import type { EulerNode } from './eulerLayout';

export function nodeOpacity(
	node: EulerNode,
	hoveredId: string | null,
	selectedIds: Set<string>,
	hoveredCatId: string | null
): number {
	// Category highlight mode: dim everything outside the hovered category
	if (hoveredCatId) {
		return node.publication.categories.includes(hoveredCatId) ? 1.0 : 0.1;
	}
	// Node focus mode: full opacity for hovered/selected, partial for others
	if (hoveredId === node.id || selectedIds.has(node.id)) return 1.0;
	if (hoveredId !== null || selectedIds.size > 0) return 0.32;
	return 0.72;
}

export function nodeRadius(
	node: EulerNode,
	hoveredId: string | null,
	selectedIds: Set<string>
): number {
	if (hoveredId === node.id) return 7;
	if (selectedIds.has(node.id)) return 6.5;
	return 4.5;
}
