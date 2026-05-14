import type { TaxonomyEntry } from '$lib/models/taxonomy';

export function publicationColor(
	disciplineIds: string[],
	disciplinesById: Map<string, TaxonomyEntry>
): string {
	const disc = disciplinesById.get(disciplineIds[0]);
	return disc?.color ?? '#888888';
}
