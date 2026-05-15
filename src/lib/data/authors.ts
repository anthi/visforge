import type { Publication } from '$lib/models/publication';
import { CLUSTER_MAP } from '$lib/data/clusters';

export type AuthorData = {
	id: string;
	name: string;
	primaryField: string;
	primaryCluster: string;
	pubCount: number;
	withinFieldPercentile: number; // 0 = least prominent in field, 1 = most prominent
};

export function deriveAuthors(publications: Publication[]): AuthorData[] {
	const authorMap = new Map<string, {
		name: string;
		pubs: Publication[];
		fieldCounts: Map<string, number>;
	}>();

	for (const pub of publications) {
		for (const author of pub.authors) {
			const key = author.name.toLowerCase().trim();
			if (!authorMap.has(key)) {
				authorMap.set(key, { name: author.name, pubs: [], fieldCounts: new Map() });
			}
			const entry = authorMap.get(key)!;
			entry.pubs.push(pub);
			for (const d of pub.fields) {
				entry.fieldCounts.set(d, (entry.fieldCounts.get(d) ?? 0) + 1);
			}
		}
	}

	const authors: AuthorData[] = [];
	for (const [id, { name, pubs, fieldCounts }] of authorMap) {
		const primaryField =
			[...fieldCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'psychology';
		authors.push({
			id,
			name,
			primaryField,
			primaryCluster: CLUSTER_MAP[primaryField] ?? 'mind',
			pubCount: pubs.length,
			withinFieldPercentile: 0, // filled below
		});
	}

	// Within-field percentile: rank by pubCount within primary field
	const byField = new Map<string, AuthorData[]>();
	for (const a of authors) {
		const g = byField.get(a.primaryField) ?? [];
		g.push(a);
		byField.set(a.primaryField, g);
	}
	for (const group of byField.values()) {
		group.sort((a, b) => a.pubCount - b.pubCount);
		group.forEach((a, i) => {
			a.withinFieldPercentile = group.length > 1 ? i / (group.length - 1) : 1.0;
		});
	}

	return authors;
}

/**
 * Allocate author slots per field using:
 *   slots(d) = 1 (floor) + proportional_remainder * sqrt(pubCount(d)) / sum(sqrt)
 *
 * The floor guarantees every field shows at least 1 author.
 * sqrt dampens dominance of high-volume fields without fully flattening them.
 * prominenceThreshold: 0 = show all, approaching 1 = show only the most prominent.
 */
export function allocateAuthorSlots(
	authors: AuthorData[],
	prominenceThreshold: number
): AuthorData[] {
	const byField = new Map<string, AuthorData[]>();
	for (const a of authors) {
		const g = byField.get(a.primaryField) ?? [];
		g.push(a);
		byField.set(a.primaryField, g);
	}

	const numFields = byField.size;
	if (numFields === 0) return [];

	const totalAuthors = authors.length;
	const targetVisible = Math.max(
		numFields,
		Math.round(totalAuthors * (1 - prominenceThreshold))
	);

	const remainder = Math.max(0, targetVisible - numFields);

	// sqrt weights from aggregate pub count per field
	const discPubCounts = new Map<string, number>();
	for (const [field, group] of byField) {
		discPubCounts.set(disc, group.reduce((s, a) => s + a.pubCount, 0));
	}
	const sqrtSum = [...discPubCounts.values()].reduce((s, c) => s + Math.sqrt(c), 0) || 1;

	const result: AuthorData[] = [];
	for (const [field, group] of byField) {
		const w = Math.sqrt(discPubCounts.get(disc) ?? 1) / sqrtSum;
		const slots = 1 + Math.round(remainder * w);
		const sorted = [...group].sort((a, b) => b.withinFieldPercentile - a.withinFieldPercentile);
		result.push(...sorted.slice(0, slots));
	}

	return result;
}
