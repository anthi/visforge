import type { Publication } from '$lib/models/publication';

export type ClusterEntry = {
	id: string;
	label: string;
	color: string;
	description: string;
	fields: string[];
};

// ─── Single source of truth: field → cluster ─────────────────────────────────
// Source of truth: DecisionVerse Conceptual Map spreadsheet (Classification 1 column)
export const CLUSTER_MAP: Record<string, string> = {
	// Mind & Behavior — DO fields (how people actually decide)
	psychology:                    'mind',
	cognitive_science:             'mind',
	neuroscience:                  'mind',
	behavioral_economics:          'mind',
	naturalistic_decision_making:  'mind',
	marketing:                     'mind',

	// Formal & Mathematical — SHOULD fields (normative/rational choice)
	// Philosophy absorbed here (no longer a standalone cluster)
	economics:                     'formal',
	statistics:                    'formal',
	operations_research:           'formal',
	decision_theory:               'formal',
	game_theory:                   'formal',
	multi_criteria_decision_making:'formal',
	philosophy:                    'formal',

	// Computational & Systems — COULD fields (CS-derived, algorithmic)
	// Split out from Formal: CS, AI, DSS, Recommender Systems, DDDM
	computer_science:              'computational',
	artificial_intelligence:       'computational',
	decision_support_systems:      'computational',
	recommender_systems:           'computational',
	data_driven_decision_making:   'computational',

	// Design & Artifact — COULD fields (design-centred human-facing systems)
	information_visualization:     'design',
	hci:                           'design',

	// Socio-Institutional — DO fields (collective/institutional contexts)
	management_science:            'societal',
	sociology:                     'societal',
	anthropology:                  'societal',
	political_science:             'societal',

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
	mind:               '#c0392b',  // red
	formal:             '#2980b9',  // blue
	computational:      '#8e44ad',  // purple (formerly philosophy)
	design:             '#e67e22',  // orange
	societal:           '#27ae60',  // green
	application_domain: '#64748b',  // muted slate
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
		label: 'Formal & Mathematical',
		color: CLUSTER_COLORS.formal,
		description: 'Normative and mathematical frameworks for rational choice, including philosophy'
	},
	computational: {
		label: 'Computational & Systems',
		color: CLUSTER_COLORS.computational,
		description: 'CS-derived fields that formalize, automate, and support decisions through computation'
	},
	design: {
		label: 'Design & Artifact',
		color: CLUSTER_COLORS.design,
		description: 'Fields that operationalize decision support through interactive artifact design'
	},
	societal: {
		label: 'Socio-Institutional',
		color: CLUSTER_COLORS.societal,
		description: 'Decisions in social, organizational, and institutional contexts'
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
