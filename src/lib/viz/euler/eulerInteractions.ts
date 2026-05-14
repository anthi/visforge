import type { EulerNode } from './eulerLayout';
import type { TaxonomyEntry } from '$lib/models/taxonomy';
import type { ClusterEntry } from '$lib/data/clusters';

/**
 * Returns the visual region ID for a node given the current expansion state.
 * In overview (expanded = null): returns the cluster id.
 * In expanded mode: returns the discipline id for nodes inside the expanded cluster,
 * or the cluster id for nodes outside it.
 */
export function getNodeRegion(
	node: EulerNode,
	expandedClusterId: string | null,
	disciplineToCluster: Map<string, string>
): string {
	const primaryDisc = node.publication.disciplines[0] ?? '';
	const clusterId = disciplineToCluster.get(primaryDisc) ?? 'unknown';
	if (expandedClusterId === null) return clusterId;
	if (clusterId === expandedClusterId) return primaryDisc;
	return clusterId;
}

/**
 * Returns the fill color for a node.
 * In overview: cluster color.
 * In expanded: discipline color for nodes inside expanded cluster, cluster color for others.
 */
export function getNodeColor(
	node: EulerNode,
	expandedClusterId: string | null,
	disciplineToCluster: Map<string, string>,
	disciplinesById: Map<string, TaxonomyEntry>,
	clustersById: Map<string, ClusterEntry>
): string {
	const primaryDisc = node.publication.disciplines[0] ?? '';
	const clusterId = disciplineToCluster.get(primaryDisc);
	if (expandedClusterId !== null && clusterId === expandedClusterId) {
		return disciplinesById.get(primaryDisc)?.color ?? '#888888';
	}
	return clustersById.get(clusterId ?? '')?.color ?? '#888888';
}

export function nodeOpacity(
	nodeRegion: string,
	hoveredId: string | null,
	nodeId: string,
	selectedIds: Set<string>,
	hoveredCatId: string | null
): number {
	if (hoveredCatId) {
		return nodeRegion === hoveredCatId ? 1.0 : 0.1;
	}
	if (hoveredId === nodeId || selectedIds.has(nodeId)) return 1.0;
	if (hoveredId !== null || selectedIds.size > 0) return 0.32;
	return 0.72;
}

export function nodeRadius(
	nodeId: string,
	hoveredId: string | null,
	selectedIds: Set<string>
): number {
	if (hoveredId === nodeId) return 7;
	if (selectedIds.has(nodeId)) return 6.5;
	return 4.5;
}
