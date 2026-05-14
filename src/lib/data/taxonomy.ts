import type { TaxonomyEntry } from '$lib/models/taxonomy';

// ── Layer 1: Disciplines ─────────────────────────────────────────────────────
export const DISCIPLINES: TaxonomyEntry[] = [
	{
		id: 'psychology',
		label: 'Psychology',
		color: '#D94F3D',
		layer: 1,
		description: 'Scientific study of mind, behavior, and cognitive processes'
	},
	{
		id: 'economics',
		label: 'Economics',
		color: '#3CB371',
		layer: 1,
		description: 'Study of production, distribution, and consumption of goods and services'
	},
	{
		id: 'philosophy',
		label: 'Philosophy',
		color: '#8B6FBE',
		layer: 1,
		description: 'Rational inquiry into the foundations of knowledge, value, and reason'
	},
	{
		id: 'cognitive_science',
		label: 'Cognitive Science',
		color: '#E89236',
		layer: 1,
		description: 'Interdisciplinary study of mind and intelligent behavior'
	},
	{
		id: 'neuroscience',
		label: 'Neuroscience',
		color: '#2EA8A0',
		layer: 1,
		description: 'Scientific study of the nervous system and brain'
	},
	{
		id: 'statistics',
		label: 'Statistics',
		color: '#C8A828',
		layer: 1,
		description: 'Mathematical study of data collection, analysis, and inference'
	},
	{
		id: 'mathematics',
		label: 'Mathematics',
		color: '#7B8CA0',
		layer: 1,
		description: 'Abstract study of quantity, structure, space, and change'
	},
	{
		id: 'computer_science',
		label: 'Computer Science',
		color: '#4472CA',
		layer: 1,
		description: 'Study of computation, algorithms, and information processing'
	},
	{
		id: 'anthropology',
		label: 'Anthropology',
		color: '#A0522D',
		layer: 1,
		description: 'Study of human societies, cultures, and their development'
	},
	{
		id: 'sociology',
		label: 'Sociology',
		color: '#5F8EA0',
		layer: 1,
		description: 'Study of social behavior, institutions, and structures'
	},
	{
		id: 'political_science',
		label: 'Political Science',
		color: '#B22222',
		layer: 1,
		description: 'Study of political systems, behavior, and institutions'
	},
	{
		id: 'information_visualization',
		label: 'Information Visualization',
		color: '#1E7FD8',
		layer: 1,
		description: 'Visual representation of abstract data to amplify cognition'
	},
	{
		id: 'hci',
		label: 'Human-Computer Interaction',
		color: '#E07820',
		layer: 1,
		description: 'Design and evaluation of interactive computing systems'
	},
	{
		id: 'artificial_intelligence',
		label: 'Artificial Intelligence',
		color: '#00A8B8',
		layer: 1,
		description: 'Design of systems that exhibit intelligent behavior'
	},
	{
		id: 'operations_research',
		label: 'Operations Research',
		color: '#228B22',
		layer: 1,
		description: 'Mathematical methods for decision making in complex systems'
	},
	{
		id: 'management_science',
		label: 'Management Science',
		color: '#9B59B6',
		layer: 1,
		description: 'Application of scientific methods to managerial decision making'
	}
];

// ── Layer 2: Subfields ────────────────────────────────────────────────────────
export const SUBFIELDS: TaxonomyEntry[] = [
	{
		id: 'behavioral_economics',
		label: 'Behavioral Economics',
		color: '#2ECC71',
		layer: 2,
		description: 'Integration of psychological insights into economic models'
	},
	{
		id: 'decision_theory',
		label: 'Decision Theory',
		color: '#9B59B6',
		layer: 2,
		description: 'Formal study of rational choice under uncertainty'
	},
	{
		id: 'game_theory',
		label: 'Game Theory',
		color: '#3498DB',
		layer: 2,
		description: 'Mathematical study of strategic interaction between agents'
	},
	{
		id: 'judgment_and_decision_making',
		label: 'Judgment & Decision Making',
		color: '#E74C3C',
		layer: 2,
		description: 'Empirical study of how people form judgments and make choices'
	},
	{
		id: 'naturalistic_decision_making',
		label: 'Naturalistic Decision Making',
		color: '#F39C12',
		layer: 2,
		description: 'Study of decision making in complex, real-world environments'
	},
	{
		id: 'multi_criteria_decision_making',
		label: 'Multi-Criteria Decision Making',
		color: '#27AE60',
		layer: 2,
		description: 'Methods for decisions involving multiple conflicting objectives'
	},
	{
		id: 'decision_support_systems',
		label: 'Decision Support Systems',
		color: '#2980B9',
		layer: 2,
		description: 'Information systems that support managerial decision making'
	},
	{
		id: 'recommender_systems',
		label: 'Recommender Systems',
		color: '#8E44AD',
		layer: 2,
		description: 'Systems that suggest options based on user preferences'
	},
	{
		id: 'data_driven_decision_making',
		label: 'Data-Driven Decision Making',
		color: '#16A085',
		layer: 2,
		description: 'Using data analysis to guide organizational decisions'
	},
	{
		id: 'neuroeconomics',
		label: 'Neuroeconomics',
		color: '#D35400',
		layer: 2,
		description: 'Study of neural mechanisms underlying economic decisions'
	}
];

// ── Layer 3: Application Domains ──────────────────────────────────────────────
export const DOMAINS: TaxonomyEntry[] = [
	{
		id: 'medical',
		label: 'Medical / Clinical',
		color: '#E74C3C',
		layer: 3,
		description: 'Decisions in healthcare, clinical practice, and medicine'
	},
	{
		id: 'organizational',
		label: 'Organizational / Managerial',
		color: '#3498DB',
		layer: 3,
		description: 'Decisions within organizations and management contexts'
	},
	{
		id: 'energy',
		label: 'Energy / Sustainability',
		color: '#27AE60',
		layer: 3,
		description: 'Decisions related to energy systems and sustainability'
	},
	{
		id: 'legal',
		label: 'Legal / Policy',
		color: '#8E44AD',
		layer: 3,
		description: 'Decisions in legal and public policy contexts'
	},
	{
		id: 'financial',
		label: 'Financial',
		color: '#F39C12',
		layer: 3,
		description: 'Decisions in financial markets and personal finance'
	},
	{
		id: 'ui_interactive',
		label: 'UI / Interactive Systems',
		color: '#1ABC9C',
		layer: 3,
		description: 'Decisions mediated by interactive technology and interfaces'
	},
	{
		id: 'education',
		label: 'Education',
		color: '#E67E22',
		layer: 3,
		description: 'Decisions in educational settings and learning contexts'
	},
	{
		id: 'crisis_emergency',
		label: 'Crisis / Emergency',
		color: '#C0392B',
		layer: 3,
		description: 'High-stakes decisions under time pressure and uncertainty'
	}
];

// ── Lookup maps ───────────────────────────────────────────────────────────────
export const disciplinesById = new Map(DISCIPLINES.map((d) => [d.id, d]));
export const subfieldsById = new Map(SUBFIELDS.map((s) => [s.id, s]));
export const domainsById = new Map(DOMAINS.map((d) => [d.id, d]));

export function lookupTaxonomy(id: string): TaxonomyEntry | undefined {
	return disciplinesById.get(id) ?? subfieldsById.get(id) ?? domainsById.get(id);
}
