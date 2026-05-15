import type { Publication } from '$lib/models/publication';
import { CLUSTER_MAP } from '$lib/data/clusters';

export type AuthorData = {
	id: string;
	name: string;
	primaryField: string;
	primaryCluster: string;
	pubCount: number;
	withinFieldPercentile: number; // 0 = least prominent in field, 1 = most prominent
	isFoundational: boolean;
	/** All distinct cluster ids the author has touched (via any pub's primary field). */
	clusters: string[];
	/** Fraction of the author's publications that have at least one field tagged. 0–1. */
	topicalConsistency: number;
	/** Career span within dataset (maxYear − minYear) / dataset span. 0–1. */
	temporalSpread: number;
	/** Count of distinct fields across all the author's publications / 17. 0–1. */
	crossFieldPresence: number;
};

/** Canonical figures whose author glyph must remain visible regardless of prominence threshold. */
const FOUNDATIONAL_IDS = new Set<string>([
	'simon',
	'kahneman',
	'tversky',
	'klein',
	'savage',
	'thaler',
	'sunstein',
	'von neumann',
	'nash',
	'munzner',
	'shneiderman',
	'norman',
	'russell',
	'pearl',
	'ackoff',
	'keeney',
	'raiffa',
	'dimara'
]);

/** Total number of fields in the taxonomy — used to normalize crossFieldPresence. */
const TOTAL_FIELDS = 17;

function isFoundationalName(normalized: string): boolean {
	if (FOUNDATIONAL_IDS.has(normalized)) return true;
	// Match by last-name token (e.g. "daniel kahneman" → "kahneman")
	const parts = normalized.split(/\s+/);
	const last = parts[parts.length - 1];
	if (FOUNDATIONAL_IDS.has(last)) return true;
	// Match multi-word foundational names ("von neumann") appearing anywhere
	for (const f of FOUNDATIONAL_IDS) {
		if (f.includes(' ') && normalized.includes(f)) return true;
	}
	return false;
}

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

	// Dataset-wide year bounds for temporalSpread normalization
	let datasetMinYear = Infinity;
	let datasetMaxYear = -Infinity;
	for (const p of publications) {
		if (p.year !== undefined) {
			if (p.year < datasetMinYear) datasetMinYear = p.year;
			if (p.year > datasetMaxYear) datasetMaxYear = p.year;
		}
	}
	const datasetSpan = Math.max(1, datasetMaxYear - datasetMinYear);

	const authors: AuthorData[] = [];
	for (const [id, { name, pubs, fieldCounts }] of authorMap) {
		const primaryField =
			[...fieldCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'psychology';

		// All clusters touched by this author (via primary field of each pub)
		const clusterSet = new Set<string>();
		for (const p of pubs) {
			const cluster = CLUSTER_MAP[p.fields[0] ?? ''] ?? 'formal';
			clusterSet.add(cluster);
		}

		// topicalConsistency — fraction of pubs with at least one tagged field
		const tagged = pubs.filter((p) => p.fields.length > 0).length;
		const topicalConsistency = pubs.length > 0 ? tagged / pubs.length : 0;

		// temporalSpread
		const years = pubs.map((p) => p.year).filter((y): y is number => y !== undefined);
		let temporalSpread = 0;
		if (years.length > 1) {
			const minY = Math.min(...years);
			const maxY = Math.max(...years);
			temporalSpread = (maxY - minY) / datasetSpan;
		}

		// crossFieldPresence — distinct fields / total fields
		const crossFieldPresence = fieldCounts.size / TOTAL_FIELDS;

		const normalized = id; // already lowercased + trimmed
		authors.push({
			id,
			name,
			primaryField,
			primaryCluster: CLUSTER_MAP[primaryField] ?? 'mind',
			pubCount: pubs.length,
			withinFieldPercentile: 0, // filled below
			isFoundational: isFoundationalName(normalized),
			clusters: [...clusterSet],
			topicalConsistency,
			temporalSpread: Math.max(0, Math.min(1, temporalSpread)),
			crossFieldPresence: Math.max(0, Math.min(1, crossFieldPresence)),
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
 *
 * Foundational authors are always included regardless of prominence threshold.
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
		discPubCounts.set(field, group.reduce((s, a) => s + a.pubCount, 0));
	}
	const sqrtSum = [...discPubCounts.values()].reduce((s, c) => s + Math.sqrt(c), 0) || 1;

	// Always include foundational authors first
	const result: AuthorData[] = [];
	const includedIds = new Set<string>();
	for (const a of authors) {
		if (a.isFoundational) {
			result.push(a);
			includedIds.add(a.id);
		}
	}

	// Fill remaining slots per field with non-foundational authors by percentile
	for (const [field, group] of byField) {
		const w = Math.sqrt(discPubCounts.get(field) ?? 1) / sqrtSum;
		const slots = 1 + Math.round(remainder * w);
		const nonFoundational = group
			.filter((a) => !includedIds.has(a.id))
			.sort((a, b) => b.withinFieldPercentile - a.withinFieldPercentile);
		const alreadyFromField = group.filter((a) => includedIds.has(a.id)).length;
		const remainingSlots = Math.max(0, slots - alreadyFromField);
		for (const a of nonFoundational.slice(0, remainingSlots)) {
			result.push(a);
			includedIds.add(a.id);
		}
	}

	return result;
}
