import type { TaxonomyEntry } from '$lib/models/taxonomy';

// ── Layer 1: Fields ─────────────────────────────────────────────────────
export const FIELDS: TaxonomyEntry[] = [
	{
		id: 'psychology',
		label: 'Psychology',
		layer: 1,
		description: 'Scientific study of mind, behavior, and cognitive processes'
	},
	{
		id: 'economics',
		label: 'Economics',
		layer: 1,
		description: 'Study of production, distribution, and consumption of goods and services'
	},
	{
		id: 'philosophy',
		label: 'Philosophy',
		layer: 1,
		description: 'Rational inquiry into the foundations of knowledge, value, and reason'
	},
	{
		id: 'cognitive_science',
		label: 'Cognitive Science',
		layer: 1,
		description: 'Interdisciplinary study of mind and intelligent behavior'
	},
	{
		id: 'neuroscience',
		label: 'Neuroscience',
		layer: 1,
		description: 'Scientific study of the nervous system and brain'
	},
	{
		id: 'statistics',
		label: 'Statistics',
		layer: 1,
		description: 'Mathematical study of data collection, analysis, and inference'
	},
	{
		id: 'mathematics',
		label: 'Mathematics',
		layer: 1,
		description: 'Abstract study of quantity, structure, space, and change'
	},
	{
		id: 'computer_science',
		label: 'Computer Science',
		layer: 1,
		description: 'Study of computation, algorithms, and information processing'
	},
	{
		id: 'anthropology',
		label: 'Anthropology',
		layer: 1,
		description: 'Study of human societies, cultures, and their development'
	},
	{
		id: 'sociology',
		label: 'Sociology',
		layer: 1,
		description: 'Study of social behavior, institutions, and structures'
	},
	{
		id: 'political_science',
		label: 'Political Science',
		layer: 1,
		description: 'Study of political systems, behavior, and institutions'
	},
	{
		id: 'information_visualization',
		label: 'Information Visualization',
		layer: 1,
		description: 'Visual representation of abstract data to amplify cognition'
	},
	{
		id: 'hci',
		label: 'Human-Computer Interaction',
		layer: 1,
		description: 'Design and evaluation of interactive computing systems'
	},
	{
		id: 'artificial_intelligence',
		label: 'Artificial Intelligence',
		layer: 1,
		description: 'Design of systems that exhibit intelligent behavior'
	},
	{
		id: 'operations_research',
		label: 'Operations Research',
		layer: 1,
		description: 'Mathematical methods for decision making in complex systems'
	},
	{
		id: 'management_science',
		label: 'Management Science',
		layer: 1,
		description: 'Application of scientific methods to managerial decision making'
	}
];

// ── Layer 2: Subfields ────────────────────────────────────────────────────────
export const SUBFIELDS: TaxonomyEntry[] = [
	{
		id: 'behavioral_economics',
		label: 'Behavioral Economics',
		layer: 2,
		description: 'Integration of psychological insights into economic models'
	},
	{
		id: 'decision_theory',
		label: 'Decision Theory',
		layer: 2,
		description: 'Formal study of rational choice under uncertainty'
	},
	{
		id: 'game_theory',
		label: 'Game Theory',
		layer: 2,
		description: 'Mathematical study of strategic interaction between agents'
	},
	{
		id: 'judgment_and_decision_making',
		label: 'Judgment & Decision Making',
		layer: 2,
		description: 'Empirical study of how people form judgments and make choices'
	},
	{
		id: 'naturalistic_decision_making',
		label: 'Naturalistic Decision Making',
		layer: 2,
		description: 'Study of decision making in complex, real-world environments'
	},
	{
		id: 'multi_criteria_decision_making',
		label: 'Multi-Criteria Decision Making',
		layer: 2,
		description: 'Methods for decisions involving multiple conflicting objectives'
	},
	{
		id: 'decision_support_systems',
		label: 'Decision Support Systems',
		layer: 2,
		description: 'Information systems that support managerial decision making'
	},
	{
		id: 'recommender_systems',
		label: 'Recommender Systems',
		layer: 2,
		description: 'Systems that suggest options based on user preferences'
	},
	{
		id: 'data_driven_decision_making',
		label: 'Data-Driven Decision Making',
		layer: 2,
		description: 'Using data analysis to guide organizational decisions'
	},
	{
		id: 'neuroeconomics',
		label: 'Neuroeconomics',
		layer: 2,
		description: 'Study of neural mechanisms underlying economic decisions'
	}
];

// ── Layer 3: Application Contexts ──────────────────────────────────────────────
export const APPLICATIONS: TaxonomyEntry[] = [
	{
		id: 'medical',
		label: 'Medical / Clinical',
		layer: 3,
		description: 'Decisions in healthcare, clinical practice, and medicine'
	},
	{
		id: 'organizational',
		label: 'Organizational / Managerial',
		layer: 3,
		description: 'Decisions within organizations and management contexts'
	},
	{
		id: 'energy',
		label: 'Energy / Sustainability',
		layer: 3,
		description: 'Decisions related to energy systems and sustainability'
	},
	{
		id: 'legal',
		label: 'Legal / Policy',
		layer: 3,
		description: 'Decisions in legal and public policy contexts'
	},
	{
		id: 'financial',
		label: 'Financial',
		layer: 3,
		description: 'Decisions in financial markets and personal finance'
	},
	{
		id: 'ui_interactive',
		label: 'UI / Interactive Systems',
		layer: 3,
		description: 'Decisions mediated by interactive technology and interfaces'
	},
	{
		id: 'education',
		label: 'Education',
		layer: 3,
		description: 'Decisions in educational settings and learning contexts'
	},
	{
		id: 'crisis_emergency',
		label: 'Crisis / Emergency',
		layer: 3,
		description: 'High-stakes decisions under time pressure and uncertainty'
	}
];

// ── Lookup maps ───────────────────────────────────────────────────────────────
export const fieldsById = new Map(FIELDS.map((d) => [d.id, d]));
export const subfieldsById = new Map(SUBFIELDS.map((s) => [s.id, s]));
export const applicationsById = new Map(APPLICATIONS.map((d) => [d.id, d]));

export function lookupTaxonomy(id: string): TaxonomyEntry | undefined {
	return fieldsById.get(id) ?? subfieldsById.get(id) ?? applicationsById.get(id);
}
