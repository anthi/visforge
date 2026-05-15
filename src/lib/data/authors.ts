import type { Publication } from '$lib/models/publication';
import { CLUSTER_MAP } from '$lib/data/clusters';

export type AuthorData = {
	id: string;
	name: string;
	primaryDiscipline: string;
	primaryCluster: string;
	pubCount: number;
	withinFieldPercentile: number; // 0 = least prominent in field, 1 = most prominent
};

export function deriveAuthors(publications: Publication[]): AuthorData[] {
	const authorMap = new Map<string, {
		name: string;
		pubs: Publication[];
		discCounts: Map<string, number>;
	}>();

	for (const pub of publications) {
		for (const author of pub.authors) {
			const key = author.name.toLowerCase().trim();
			if (!authorMap.has(key)) {
				authorMap.set(key, { name: author.name, pubs: [], discCounts: new Map() });
			}
			const entry = authorMap.get(key)!;
			entry.pubs.push(pub);
			for (const d of pub.disciplines) {
				entry.discCounts.set(d, (entry.discCounts.get(d) ?? 0) + 1);
			}
		}
	}

	const authors: AuthorData[] = [];
	for (const [id, { name, pubs, discCounts }] of authorMap) {
		const primaryDiscipline =
			[...discCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'psychology';
		authors.push({
			id,
			name,
			primaryDiscipline,
			primaryCluster: CLUSTER_MAP[primaryDiscipline] ?? 'mind',
			pubCount: pubs.length,
			withinFieldPercentile: 0, // filled below
		});
	}

	// Within-field percentile: rank by pubCount within primary discipline
	const byDisc = new Map<string, AuthorData[]>();
	for (const a of authors) {
		const g = byDisc.get(a.primaryDiscipline) ?? [];
		g.push(a);
		byDisc.set(a.primaryDiscipline, g);
	}
	for (const group of byDisc.values()) {
		group.sort((a, b) => a.pubCount - b.pubCount);
		group.forEach((a, i) => {
			a.withinFieldPercentile = group.length > 1 ? i / (group.length - 1) : 1.0;
		});
	}

	return authors;
}

/**
 * Allocate author slots per discipline using:
 *   slots(d) = 1 (floor) + proportional_remainder * sqrt(pubCount(d)) / sum(sqrt)
 *
 * The floor guarantees every discipline shows at least 1 author.
 * sqrt dampens dominance of high-volume disciplines without fully flattening them.
 * prominenceThreshold: 0 = show all, approaching 1 = show only the most prominent.
 */
export function allocateAuthorSlots(
	authors: AuthorData[],
	prominenceThreshold: number
): AuthorData[] {
	const byDisc = new Map<string, AuthorData[]>();
	for (const a of authors) {
		const g = byDisc.get(a.primaryDiscipline) ?? [];
		g.push(a);
		byDisc.set(a.primaryDiscipline, g);
	}

	const numDiscs = byDisc.size;
	if (numDiscs === 0) return [];

	const totalAuthors = authors.length;
	const targetVisible = Math.max(
		numDiscs,
		Math.round(totalAuthors * (1 - prominenceThreshold))
	);

	const remainder = Math.max(0, targetVisible - numDiscs);

	// sqrt weights from aggregate pub count per discipline
	const discPubCounts = new Map<string, number>();
	for (const [disc, group] of byDisc) {
		discPubCounts.set(disc, group.reduce((s, a) => s + a.pubCount, 0));
	}
	const sqrtSum = [...discPubCounts.values()].reduce((s, c) => s + Math.sqrt(c), 0) || 1;

	const result: AuthorData[] = [];
	for (const [disc, group] of byDisc) {
		const w = Math.sqrt(discPubCounts.get(disc) ?? 1) / sqrtSum;
		const slots = 1 + Math.round(remainder * w);
		const sorted = [...group].sort((a, b) => b.withinFieldPercentile - a.withinFieldPercentile);
		result.push(...sorted.slice(0, slots));
	}

	return result;
}
