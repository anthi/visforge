export type TaxonomyLayer = 1 | 2 | 3;

export type TaxonomyEntry = {
	id: string;
	label: string;
	color: string;
	layer: TaxonomyLayer;
	description?: string;
};
