import type { Author } from './author';

export type Publication = {
	id: string;
	title: string;
	doi?: string;
	abstract?: string;
	year?: number;
	venue?: string;
	authors: Author[];
	categories: string[];
	keywords?: string[];
	citations?: string[];
	url?: string;
	metadata?: Record<string, unknown>;
};
