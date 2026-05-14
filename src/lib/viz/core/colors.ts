import type { Category } from '$lib/models/category';

export function publicationColor(
	categoryIds: string[],
	categoriesById: Map<string, Category>
): string {
	const cat = categoriesById.get(categoryIds[0]);
	return cat?.color ?? '#888888';
}
