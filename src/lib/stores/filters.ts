import { derived, writable } from 'svelte/store';
import { publications } from './entities';
import { CLUSTER_MAP, CLUSTERS } from '$lib/data/clusters';

export type YearRange = { min: number; max: number };
export type Lens = 'disciplines' | 'subfields' | 'domains' | 'authors';

// ─── Year bounds (derived from dataset) ──────────────────────────────────────
export const yearBounds = derived(publications, ($pubs) => {
	const years = $pubs.map((p) => p.year).filter((y): y is number => y !== undefined);
	return years.length
		? { min: Math.min(...years), max: Math.max(...years) }
		: { min: 1944, max: 2030 };
});

// ─── Filter state ─────────────────────────────────────────────────────────────
export const activeDisciplines = writable<Set<string>>(new Set());
export const activeSubfields = writable<Set<string>>(new Set());
export const activeDomains = writable<Set<string>>(new Set());
export const searchQuery = writable<string>('');
export const yearRange = writable<YearRange>({ min: 1944, max: 2030 });
export const venueFilter = writable<string>('');

// ─── UI / visual state (not filters — do not affect filteredPublications) ─────
export const currentLens = writable<Lens>('disciplines');
export const clusterOpacities = writable<Record<string, number>>(
	Object.fromEntries(CLUSTERS.map((c) => [c.id, 1]))
);
export const authorProminence = writable<number>(0); // 0 = show all; 1 = most prominent only

// Keep yearRange in sync with dataset bounds on initial load
yearBounds.subscribe((bounds) => {
	yearRange.set({ ...bounds });
});

// ─── Derived: unique venues (for dropdown) ────────────────────────────────────
export const uniqueVenues = derived(publications, ($pubs) => {
	const set = new Set<string>();
	for (const p of $pubs) if (p.venue) set.add(p.venue);
	return [...set].sort();
});

// ─── Derived: filtered publications ──────────────────────────────────────────
export const filteredPublications = derived(
	[publications, activeDisciplines, activeSubfields, activeDomains, searchQuery, yearRange, venueFilter],
	([$pubs, $discs, $subs, $doms, $query, $range, $venue]) => {
		const q = $query.trim().toLowerCase();
		return $pubs.filter((p) => {
			if ($discs.size > 0 && !p.disciplines.some((d) => $discs.has(d))) return false;
			if ($subs.size > 0 && !p.subfields.some((s) => $subs.has(s))) return false;
			if ($doms.size > 0 && !p.domains.some((d) => $doms.has(d))) return false;
			if (p.year !== undefined && (p.year < $range.min || p.year > $range.max)) return false;
			if ($venue && p.venue !== $venue) return false;
			if (q) {
				const inTitle = p.title.toLowerCase().includes(q);
				const inAuthors = p.authors.some((a) => a.name.toLowerCase().includes(q));
				const inKeywords = p.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false;
				if (!inTitle && !inAuthors && !inKeywords) return false;
			}
			return true;
		});
	}
);

// ─── Derived: live publication count per cluster ──────────────────────────────
export const clusterCounts = derived(filteredPublications, ($pubs) => {
	const counts: Record<string, number> = {};
	for (const p of $pubs) {
		const c = CLUSTER_MAP[p.disciplines[0] ?? ''] ?? 'formal';
		counts[c] = (counts[c] ?? 0) + 1;
	}
	return counts;
});

// ─── Derived: per-year publication counts (full dataset, for sparkline) ───────
export const yearCounts = derived(publications, ($pubs) => {
	const counts: Record<number, number> = {};
	for (const p of $pubs) {
		if (p.year !== undefined) counts[p.year] = (counts[p.year] ?? 0) + 1;
	}
	return counts;
});

// ─── Actions ──────────────────────────────────────────────────────────────────
export function toggleDiscipline(id: string): void {
	activeDisciplines.update((prev) => {
		const next = new Set(prev);
		next.has(id) ? next.delete(id) : next.add(id);
		return next;
	});
}

export function toggleSubfield(id: string): void {
	activeSubfields.update((prev) => {
		const next = new Set(prev);
		next.has(id) ? next.delete(id) : next.add(id);
		return next;
	});
}

export function toggleDomain(id: string): void {
	activeDomains.update((prev) => {
		const next = new Set(prev);
		next.has(id) ? next.delete(id) : next.add(id);
		return next;
	});
}

export function clearFilters(): void {
	activeDisciplines.set(new Set());
	activeSubfields.set(new Set());
	activeDomains.set(new Set());
	searchQuery.set('');
	venueFilter.set('');
	yearBounds.subscribe((bounds) => yearRange.set({ ...bounds }))();
}
