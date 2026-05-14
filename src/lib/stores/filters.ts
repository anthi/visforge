import { derived, writable } from 'svelte/store';
import { publications } from './entities';

export type YearRange = { min: number; max: number };

export const yearBounds = derived(publications, ($pubs) => {
	const years = $pubs.map((p) => p.year).filter((y): y is number => y !== undefined);
	return years.length
		? { min: Math.min(...years), max: Math.max(...years) }
		: { min: 1944, max: 2030 };
});

export const activeDisciplines = writable<Set<string>>(new Set());
export const activeSubfields = writable<Set<string>>(new Set());
export const activeDomains = writable<Set<string>>(new Set());
export const searchQuery = writable<string>('');
export const yearRange = writable<YearRange>({ min: 1944, max: 2030 });

yearBounds.subscribe((bounds) => {
	yearRange.set({ ...bounds });
});

export const filteredPublications = derived(
	[publications, activeDisciplines, activeSubfields, activeDomains, searchQuery, yearRange],
	([$pubs, $discs, $subs, $doms, $query, $range]) => {
		const q = $query.trim().toLowerCase();
		return $pubs.filter((p) => {
			if ($discs.size > 0 && !p.disciplines.some((d) => $discs.has(d))) return false;
			if ($subs.size > 0 && !p.subfields.some((s) => $subs.has(s))) return false;
			if ($doms.size > 0 && !p.domains.some((d) => $doms.has(d))) return false;
			if (p.year !== undefined && (p.year < $range.min || p.year > $range.max)) return false;
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
	yearBounds.subscribe((bounds) => yearRange.set({ ...bounds }))();
}
