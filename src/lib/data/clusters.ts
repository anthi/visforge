export type ClusterEntry = {
	id: string;
	label: string;
	color: string;
	description: string;
	disciplines: string[];
};

// ─── Single source of truth ────────────────────────────────────────────────────
//
// To assign a discipline to a cluster: add ONE entry here.
// CLUSTER_MAP is the canonical lookup used by all color and layout code.
// Do NOT list disciplines anywhere else — they are derived from this map.
//
export const CLUSTER_MAP: Record<string, string> = {
	// Mind & Behavior
	psychology:                'mind_behavior',
	cognitive_science:         'mind_behavior',
	neuroscience:              'mind_behavior',
	// Formal & Computational
	economics:                 'formal_computational',
	mathematics:               'formal_computational',
	statistics:                'formal_computational',
	operations_research:       'formal_computational',
	artificial_intelligence:   'formal_computational',
	computer_science:          'formal_computational',
	// Design & Interaction
	information_visualization: 'design_interaction',
	hci:                       'design_interaction',
	// Collective & Societal
	management_science:        'collective_societal',
	sociology:                 'collective_societal',
	anthropology:              'collective_societal',
	political_science:         'collective_societal',
	// Philosophy
	philosophy:                'philosophy',
};

// ─── Cluster metadata ──────────────────────────────────────────────────────────
// Label, color, and description only. Disciplines list is derived from CLUSTER_MAP.

const CLUSTER_META: Record<string, Omit<ClusterEntry, 'id' | 'disciplines'>> = {
	mind_behavior: {
		label: 'Mind & Behavior',
		color: '#C0392B',
		description: 'Cognitive and neural foundations of decision making'
	},
	formal_computational: {
		label: 'Formal & Computational',
		color: '#2471A3',
		description: 'Formal, mathematical, and computational approaches to rational choice'
	},
	design_interaction: {
		label: 'Design & Interaction',
		color: '#D35400',
		description: 'Fields that operationalize and support decision making through design'
	},
	collective_societal: {
		label: 'Collective & Societal',
		color: '#1E8449',
		description: 'Decisions in social, organizational, and political contexts'
	},
	philosophy: {
		label: 'Philosophy',
		color: '#76448A',
		description: 'Normative and epistemological foundations of rational choice'
	},
};

// ─── Derived collections ───────────────────────────────────────────────────────

export const CLUSTERS: ClusterEntry[] = Object.entries(CLUSTER_META).map(([id, meta]) => ({
	id,
	...meta,
	disciplines: Object.entries(CLUSTER_MAP)
		.filter(([, cId]) => cId === id)
		.map(([dId]) => dId),
}));

export const clustersById = new Map<string, ClusterEntry>(CLUSTERS.map((c) => [c.id, c]));

/** Backwards-compatible Map for .get() usage in existing code. */
export const disciplineToCluster = new Map<string, string>(Object.entries(CLUSTER_MAP));

// ─── Canonical color lookup ────────────────────────────────────────────────────
//
// ALL dot, node, and region color lookups must go through this function.
// It resolves discipline → cluster → color in one place.
//
export function clusterColorForDiscipline(disciplineId: string): string {
	const clusterId = CLUSTER_MAP[disciplineId] ?? '';
	return clustersById.get(clusterId)?.color ?? '#888888';
}
