import type { EulerNode } from './eulerLayout';

export function getNodeRegion(
	node: EulerNode,
	expandedClusterId: string | null,
	fieldToCluster: Map<string, string>
): string {
	const primaryDisc = node.publication.fields[0] ?? '';
	const clusterId = fieldToCluster.get(primaryDisc) ?? 'unknown';
	if (expandedClusterId === null) return clusterId;
	if (clusterId === expandedClusterId) return primaryDisc;
	return clusterId;
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
