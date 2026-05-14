export type ClusterEntry = {
	id: string;
	label: string;
	color: string;
	description: string;
	disciplines: string[];
};

export const CLUSTERS: ClusterEntry[] = [
	{
		id: 'mind_behavior',
		label: 'Mind & Behavior',
		color: '#C0392B',
		description: 'Cognitive and neural foundations of decision making',
		disciplines: ['psychology', 'cognitive_science', 'neuroscience']
	},
	{
		id: 'formal_computational',
		label: 'Formal & Computational',
		color: '#2471A3',
		description: 'Formal, mathematical, and computational approaches to rational choice',
		disciplines: [
			'economics',
			'mathematics',
			'statistics',
			'operations_research',
			'artificial_intelligence',
			'computer_science'
		]
	},
	{
		id: 'design_interaction',
		label: 'Design & Interaction',
		color: '#D35400',
		description: 'Fields that operationalize and support decision making through design',
		disciplines: ['information_visualization', 'hci']
	},
	{
		id: 'collective_societal',
		label: 'Collective & Societal',
		color: '#1E8449',
		description: 'Decisions in social, organizational, and political contexts',
		disciplines: ['management_science', 'sociology', 'anthropology', 'political_science']
	},
	{
		id: 'philosophy',
		label: 'Philosophy',
		color: '#76448A',
		description: 'Normative and epistemological foundations of rational choice',
		disciplines: ['philosophy']
	}
];

export const clustersById = new Map<string, ClusterEntry>(CLUSTERS.map((c) => [c.id, c]));

// Lookup: discipline id → cluster id
export const disciplineToCluster = new Map<string, string>(
	CLUSTERS.flatMap((c) => c.disciplines.map((d) => [d, c.id] as [string, string]))
);
