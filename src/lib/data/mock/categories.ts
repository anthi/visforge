import type { Category } from '$lib/models/category';

export const mockCategories: Category[] = [
	{
		id: 'infovis',
		label: 'Information Visualization',
		color: '#4e79a7',
		description: 'Visual representations of abstract data to amplify cognition'
	},
	{
		id: 'hci',
		label: 'Human-Computer Interaction',
		color: '#f28e2b',
		description: 'Design, evaluation, and implementation of interactive computing systems'
	},
	{
		id: 'decision-making',
		label: 'Decision Making',
		color: '#e15759',
		description: 'Cognitive and behavioral processes underlying choice and judgment'
	},
	{
		id: 'xai',
		label: 'Explainable AI',
		color: '#76b7b2',
		description: 'Methods to make AI systems interpretable and transparent to humans'
	},
	{
		id: 'cognitive-bias',
		label: 'Cognitive Bias',
		color: '#59a14f',
		description: 'Systematic patterns of deviation from rationality in judgment'
	},
	{
		id: 'feminist-hci',
		label: 'Feminist HCI',
		color: '#edc948',
		description: 'Critical perspectives on gender, power, and values in computing'
	},
	{
		id: 'behavioral-economics',
		label: 'Behavioral Economics',
		color: '#b07aa1',
		description: 'Integration of psychological insights into economic models of behavior'
	},
	{
		id: 'jdm',
		label: 'Judgment and Decision Making',
		color: '#ff9da7',
		description: 'Empirical study of how people evaluate options and form judgments'
	}
];
