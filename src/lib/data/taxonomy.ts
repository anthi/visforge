import type { TaxonomyEntry } from '$lib/models/taxonomy';

// Source of truth: DecisionVerse Conceptual Map spreadsheet
// Simplified Type values match the "Simplified Type" column exactly.
// Classification 2 values match the "Classification 2" column.

// ── Layer 1: Fields ────────────────────────────────────────────────────────────

export const FIELDS: TaxonomyEntry[] = [
	// ── Mind & Behavior — DO ───────────────────────────────────────────────
	{
		id: 'psychology',
		label: 'Psychology',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'DO',
		description: 'Scientific study of mind, behavior, and cognitive processes'
	},
	{
		id: 'cognitive_science',
		label: 'Cognitive Science',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'DO',
		description: 'Interdisciplinary study of mind and intelligent behavior'
	},
	{
		id: 'neuroscience',
		label: 'Neuroscience',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'DO',
		description: 'Scientific study of the nervous system and brain; encompasses neuroeconomics'
	},
	{
		id: 'behavioral_economics',
		label: 'Behavioral Economics',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'DO',
		description: 'Integration of psychological insights into economic models'
	},
	{
		id: 'naturalistic_decision_making',
		label: 'Naturalistic Decision Making',
		layer: 1,
		simplified_type: 'subfield',
		classification_2: 'DO',
		description: 'Study of expert decision making in real-world operational settings'
	},
	{
		id: 'marketing',
		label: 'Marketing',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'DO',
		description: 'Study of how consumers choose and how choices are influenced'
	},

	// ── Formal & Mathematical — SHOULD ────────────────────────────────────
	// Philosophy is included here (absorbed from standalone cluster)
	{
		id: 'economics',
		label: 'Economics',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'SHOULD',
		description: 'Study of rational choice, markets, and resource allocation'
	},
	{
		id: 'philosophy',
		label: 'Philosophy',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'SHOULD',
		description: 'Normative and epistemological foundations of rational choice and agency'
	},
	{
		id: 'statistics',
		label: 'Statistics',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'SHOULD',
		description: 'Mathematical study of uncertainty, inference, and evidence'
	},
	{
		id: 'decision_theory',
		label: 'Decision Theory',
		layer: 1,
		simplified_type: 'subfield',
		classification_2: 'SHOULD',
		description: 'Formal mathematical study of rational choice under risk and uncertainty'
	},
	{
		id: 'game_theory',
		label: 'Game Theory',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'SHOULD',
		description: 'Mathematical study of strategic interaction between agents'
	},
	{
		id: 'multi_criteria_decision_making',
		label: 'Multi-Criteria Decision Making',
		layer: 1,
		simplified_type: 'subfield',
		classification_2: 'COULD',
		description: 'Methods for decisions involving multiple conflicting objectives'
	},

	// ── Formal & Mathematical — COULD (prescriptive math) ─────────────────
	{
		id: 'operations_research',
		label: 'Operations Research',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'COULD',
		description: 'Mathematical optimization methods for complex decision problems'
	},

	// ── Computational & Systems — COULD ───────────────────────────────────
	{
		id: 'computer_science',
		label: 'Computer Science',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'COULD',
		description: 'Study of computation, algorithms, and information processing'
	},
	{
		id: 'artificial_intelligence',
		label: 'Artificial Intelligence',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'COULD',
		description: 'Design of systems that exhibit intelligent behavior'
	},
	{
		id: 'decision_support_systems',
		label: 'Decision Support Systems',
		layer: 1,
		simplified_type: 'subfield',
		classification_2: 'COULD',
		description: 'Interactive information systems that support organizational decision making'
	},
	{
		id: 'recommender_systems',
		label: 'Recommender Systems',
		layer: 1,
		simplified_type: 'subfield',
		classification_2: 'COULD',
		description: 'Systems that suggest options based on user preferences'
	},
	{
		id: 'data_driven_decision_making',
		label: 'Data-Driven Decision Making',
		layer: 1,
		simplified_type: 'subfield',
		classification_2: 'COULD',
		description: 'Using data analysis to ground organizational and operational decisions'
	},

	// ── Design & Artifact — COULD ─────────────────────────────────────────
	{
		id: 'information_visualization',
		label: 'Information Visualization',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'COULD',
		description: 'Visual representation of abstract data to amplify cognition and support decisions'
	},
	{
		id: 'hci',
		label: 'Human-Computer Interaction',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'COULD',
		description: 'Design and evaluation of interactive computing systems'
	},

	// ── Socio-Institutional — DO ──────────────────────────────────────────
	{
		id: 'management_science',
		label: 'Management Science',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'DO',
		description: 'Scientific methods for managerial and organizational decisions'
	},
	{
		id: 'sociology',
		label: 'Sociology',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'DO',
		description: 'Study of social behavior, institutions, and structures'
	},
	{
		id: 'anthropology',
		label: 'Anthropology',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'DO',
		description: 'Study of human societies, cultures, and their development'
	},
	{
		id: 'political_science',
		label: 'Political Science',
		layer: 1,
		simplified_type: 'field',
		classification_2: 'DO',
		description: 'Study of political systems, behavior, and institutions'
	},

	// ── Application Domains — consume DM theory, do not generate it ────────
	{
		id: 'medicine_clinical',
		label: 'Medicine / Clinical',
		layer: 1,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'Decisions in healthcare, clinical practice, and medicine'
	},
	{
		id: 'public_policy',
		label: 'Public Policy',
		layer: 1,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'Decisions in governance, regulation, and public administration'
	},
	{
		id: 'law',
		label: 'Law',
		layer: 1,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'Decisions in legal and judicial contexts'
	},
	{
		id: 'education',
		label: 'Education',
		layer: 1,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'Decisions in educational settings and learning contexts'
	},
	{
		id: 'environmental_science',
		label: 'Environmental Science',
		layer: 1,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'Decisions related to environmental and sustainability contexts'
	},
	{
		id: 'public_health',
		label: 'Public Health',
		layer: 1,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'Decisions in population health, epidemiology, and health policy'
	},
];

// ── Layer 2: Subfields — DM-specific lens (for Subfields lens) ────────────────
export const SUBFIELDS: TaxonomyEntry[] = [
	{
		id: 'judgment_and_decision_making',
		label: 'Judgment & Decision Making',
		layer: 2,
		simplified_type: 'subfield',
		classification_2: 'DO',
		description: 'Empirical study of how people form judgments and make choices'
	},
];

// ── Layer 3: Application Contexts — where decisions happen ───────────────────
export const APPLICATIONS: TaxonomyEntry[] = [
	{
		id: 'medical',
		label: 'Medical / Clinical',
		layer: 3,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'Decisions in healthcare, clinical practice, and medicine'
	},
	{
		id: 'organizational',
		label: 'Organizational / Managerial',
		layer: 3,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'Decisions within organizations and management contexts'
	},
	{
		id: 'energy',
		label: 'Energy / Sustainability',
		layer: 3,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'Decisions related to energy systems and sustainability'
	},
	{
		id: 'legal',
		label: 'Legal / Policy',
		layer: 3,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'Decisions in legal and public policy contexts'
	},
	{
		id: 'financial',
		label: 'Financial',
		layer: 3,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'Decisions in financial markets and personal finance'
	},
	{
		id: 'ui_interactive',
		label: 'UI / Interactive Systems',
		layer: 3,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'Decisions mediated by interactive technology and interfaces'
	},
	{
		id: 'crisis_emergency',
		label: 'Crisis / Emergency',
		layer: 3,
		simplified_type: 'application_domain',
		classification_2: 'not_applicable',
		description: 'High-stakes decisions under time pressure and uncertainty'
	},
];

// ── Lookup maps ───────────────────────────────────────────────────────────────
export const fieldsById = new Map(FIELDS.map((d) => [d.id, d]));
export const subfieldsById = new Map(SUBFIELDS.map((s) => [s.id, s]));
export const applicationsById = new Map(APPLICATIONS.map((d) => [d.id, d]));

export function lookupTaxonomy(id: string): TaxonomyEntry | undefined {
	return fieldsById.get(id) ?? subfieldsById.get(id) ?? applicationsById.get(id);
}
