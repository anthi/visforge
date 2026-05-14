import { derived, readable } from 'svelte/store';
import { mockPublications } from '$lib/data/mock/publications';
import { mockCategories } from '$lib/data/mock/categories';

export const publications = readable(mockPublications);
export const categories = readable(mockCategories);

export const publicationsById = derived(publications, ($pubs) =>
	new Map($pubs.map((p) => [p.id, p]))
);

export const categoriesById = derived(categories, ($cats) =>
	new Map($cats.map((c) => [c.id, c]))
);
