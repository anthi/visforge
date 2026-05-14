import { derived, writable } from 'svelte/store';
import { publicationsById } from './entities';
import type { Publication } from '$lib/models/publication';

export const hoveredId = writable<string | null>(null);
export const hoveredCategoryId = writable<string | null>(null);
export const selectedIds = writable<Set<string>>(new Set());

export const hoveredPublication = derived(
	[hoveredId, publicationsById],
	([$id, $map]): Publication | null => ($id ? ($map.get($id) ?? null) : null)
);

export const selectedPublications = derived(
	[selectedIds, publicationsById],
	([$ids, $map]): Publication[] => [...$ids].flatMap((id) => ($map.get(id) ? [$map.get(id)!] : []))
);

// Actions
export function setHovered(id: string | null): void {
	hoveredId.set(id);
}

export function setHoveredCategory(id: string | null): void {
	hoveredCategoryId.set(id);
}

// Single-select: clicking an already-selected node deselects it; otherwise replaces selection
export function selectSingle(id: string): void {
	selectedIds.update((prev) => {
		if (prev.size === 1 && prev.has(id)) return new Set();
		return new Set([id]);
	});
}

export function toggleSelection(id: string): void {
	selectedIds.update((prev) => {
		const next = new Set(prev);
		next.has(id) ? next.delete(id) : next.add(id);
		return next;
	});
}

export function clearSelection(): void {
	selectedIds.set(new Set());
}
