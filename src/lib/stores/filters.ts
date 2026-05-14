import { derived, writable } from 'svelte/store';
import { publications } from './entities';

export type YearRange = { min: number; max: number };

// Absolute bounds derived from the dataset — used to initialise and reset the slider
export const yearBounds = derived(publications, ($pubs) => {
	const years = $pubs.map((p) => p.year).filter((y): y is number => y !== undefined);
	return years.length
		? { min: Math.min(...years), max: Math.max(...years) }
		: { min: 1970, max: 2030 };
});

// Writable filter state
export const activeCategories = writable<Set<string>>(new Set());
export const searchQuery = writable<string>('');
export const yearRange = writable<YearRange>({ min: 1970, max: 2030 });

// Keep yearRange initialised once yearBounds resolves
yearBounds.subscribe((bounds) => {
	yearRange.set({ ...bounds });
});

// Derived: publications that pass all active filters
export const filteredPublications = derived(
	[publications, activeCategories, searchQuery, yearRange],
	([$pubs, $cats, $query, $range]) => {
		const q = $query.trim().toLowerCase();
		return $pubs.filter((p) => {
			if ($cats.size > 0 && !p.categories.some((c) => $cats.has(c))) return false;
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

// Actions
export function toggleCategory(id: string): void {
	activeCategories.update((prev) => {
		const next = new Set(prev);
		next.has(id) ? next.delete(id) : next.add(id);
		return next;
	});
}

export function clearFilters(): void {
	activeCategories.set(new Set());
	searchQuery.set('');
	yearBounds.subscribe((bounds) => yearRange.set({ ...bounds }))();
}
