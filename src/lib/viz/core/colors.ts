import type { TaxonomyEntry } from '$lib/models/taxonomy';
import type { ClusterEntry } from '$lib/data/clusters';

export function publicationColorByDiscipline(
	disciplineIds: string[],
	disciplinesById: Map<string, TaxonomyEntry>
): string {
	const disc = disciplinesById.get(disciplineIds[0]);
	return disc?.color ?? '#888888';
}

export function publicationColorByCluster(
	disciplineIds: string[],
	disciplineToCluster: Map<string, string>,
	clustersById: Map<string, ClusterEntry>
): string {
	const clusterId = disciplineToCluster.get(disciplineIds[0]);
	return clustersById.get(clusterId ?? '')?.color ?? '#888888';
}
