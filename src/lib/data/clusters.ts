import type { Publication } from '$lib/models/publication';

export type ClusterEntry = {
	id: string;
	label: string;
	color: string;
	description: string;
	fields: string[];
};

// ─── Single source of truth: field → cluster ─────────────────────────────
// Adding a field requires exactly one new entry here.
export const CLUSTER_MAP: Record<string, string> = {
	psychology:                'mind',
	cognitive_science:         'mind',
	neuroscience:              'mind',
	economics:                 'formal',
	mathematics:               'formal',
	statistics:                'formal',
	decision_theory:           'formal',
	operations_research:       'formal',
	artificial_intelligence:   'formal',
	computer_science:          'formal',
	information_visualization: 'design',
	hci:                       'design',
	management_science:        'societal',
	sociology:                 'societal',
	anthropology:              'societal',
	political_science:         'societal',
	philosophy:                'philosophy',
};

// ─── Cluster colors ────────────────────────────────────────────────────────────
export const CLUSTER_COLORS: Record<string, string> = {
	mind:       '#c0392b',
	formal:     '#2980b9',
	design:     '#e67e22',
	societal:   '#27ae60',
	philosophy: '#8e44ad',
};

// ─── Canonical dot color lookup ────────────────────────────────────────────────
// Every dot color MUST go through this function. No other color source exists.
export function getDotColor(publication: Publication): string {
	const primaryField = publication.fields[0];
	const clusterId = CLUSTER_MAP[primaryField] ?? 'formal';
	return CLUSTER_COLORS[clusterId];
}

// ─── Cluster metadata ──────────────────────────────────────────────────────────
const CLUSTER_META: Record<string, Omit<ClusterEntry, 'id' | 'fields'>> = {
	mind: {
		label: 'Mind & Behavior',
		color: CLUSTER_COLORS.mind,
		description: 'Cognitive and neural foundations of decision making'
	},
	formal: {
		label: 'Formal & Computational',
		color: CLUSTER_COLORS.formal,
		description: 'Formal, mathematical, and computational approaches to rational choice'
	},
	design: {
		label: 'Design & Interaction',
		color: CLUSTER_COLORS.design,
		description: 'Fields that operationalize and support decision making through design'
	},
	societal: {
		label: 'Collective & Societal',
		color: CLUSTER_COLORS.societal,
		description: 'Decisions in social, organizational, and political contexts'
	},
	philosophy: {
		label: 'Philosophy',
		color: CLUSTER_COLORS.philosophy,
		description: 'Normative and epistemological foundations of rational choice'
	},
};

// ─── Derived collections ───────────────────────────────────────────────────────
export const CLUSTERS: ClusterEntry[] = Object.entries(CLUSTER_META).map(([id, meta]) => ({
	id,
	...meta,
	fields: Object.entries(CLUSTER_MAP)
		.filter(([, cId]) => cId === id)
		.map(([dId]) => dId),
}));

export const clustersById = new Map<string, ClusterEntry>(CLUSTERS.map((c) => [c.id, c]));

/** Backwards-compatible Map for .get() usage in layout and contour code. */
export const fieldToCluster = new Map<string, string>(Object.entries(CLUSTER_MAP));
