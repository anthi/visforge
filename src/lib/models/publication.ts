import type { Author } from './author';

export type Publication = {
	id: string;
	title: string;
	doi?: string;
	abstract?: string;
	year?: number;
	venue?: string;
	authors: Author[];

	// Three orthogonal classification axes
	disciplines: string[]; // Layer 1: psychology, economics, information_visualization…
	subfields: string[]; // Layer 2: behavioral_economics, judgment_and_decision_making…
	domains: string[]; // Layer 3: medical, organizational, financial…

	keywords?: string[];
	citations?: string[];
	url?: string;
	metadata?: Record<string, unknown>;
};
