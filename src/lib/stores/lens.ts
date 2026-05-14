import { writable } from 'svelte/store';

// null = cluster overview (Level 1); string = that cluster is expanded to show disciplines
export const expandedClusterId = writable<string | null>(null);

export function expandCluster(id: string): void {
	expandedClusterId.set(id);
}

export function collapseToOverview(): void {
	expandedClusterId.set(null);
}
