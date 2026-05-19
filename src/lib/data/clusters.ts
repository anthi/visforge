import type { Publication } from '$lib/models/publication';

export type ClusterEntry = {
	id: string;
	label: string;
	color: string;
	description: string;
	fields: string[];
};

// ─── Single source of truth: field → cluster ─────────────────────────────────
// Adding a field requires exactly one new entry here.
export const CLUSTER_MAP: Record<string, string> = {
	// Mind & Behavior — DO fields (descriptive, how humans actually decide)
	psychology:                    'mind',
	cognitive_science:             'mind',
	neuroscience:                  'mind',
	behavioral_economics:          'mind',
	naturalistic_decision_making:  'mind',
	marketing:                     'mind',

	// Formal & Computational — SHOULD + COULD fields
	economics:                     'formal',
	statistics:                    'formal',
	operations_research:           'formal',
	decision_theory:               'formal',
	game_theory:                   'formal',
	artificial_intelligence:       'formal',
	computer_science:              'formal',
	multi_criteria_decision_making:'formal',
	decision_support_systems:      'formal',
	recommender_systems:           'formal',
	data_driven_decision_making:   'formal',

	// Design & Interaction — COULD fields
	information_visualization:     'design',
	hci:                           'design',

	// Collective & Societal — DO fields
	management_science:            'societal',
	sociology:                     'societal',
	anthropology:                  'societal',
	political_science:             'societal',

	// Philosophy — SHOULD field
	philosophy:                    'philosophy',

	// Application Domains — consume DM theory, visually distinct
	medicine_clinical:             'application_domain',
	public_policy:                 'application_domain',
	law:                           'application_domain',
	education:                     'application_domain',
	environmental_science:         'application_domain',
	public_health:                 'application_domain',
};

// ─── Cluster colors ────────────────────────────────────────────────────────────
export const CLUSTER_COLORS: Record<string, string> = {
	mind:               '#c0392b',
	formal:             '#2980b9',
	design:             '#e67e22',
	societal:           '#27ae60',
	philosophy:         '#8e44ad',
	application_domain: '#64748b',  // muted slate — visually distinct from knowledge-generating fields
};

// ─── DO/SHOULD/COULD stroke colors (classification_2 axis) ───────────────────
// Used as dot stroke / ring to encode the normative axis independently of cluster fill.
export const CLASSIFICATION2_COLORS: Record<string, string> = {
	DO:             '#e74c3c',   // warm red — how humans actually decide
	SHOULD:         '#3498db',   // cool blue — how a rational agent ought to decide
	COULD:          '#f39c12',   // amber — how decisions can be supported
	not_applicable: '#94a3b8',   // neutral slate
};

// ─── Canonical dot color lookup ────────────────────────────────────────────────
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
		description: 'Cognitive, behavioral, and neural foundations of decision making'
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
	application_domain: {
		label: 'Application Domains',
		color: CLUSTER_COLORS.application_domain,
		description: 'Empirical contexts that apply DM theory; do not generate transferable DM knowledge'
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

export const fieldToCluster = new Map<string, string>(Object.entries(CLUSTER_MAP));
