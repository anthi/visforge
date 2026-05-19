export type TaxonomyLayer = 1 | 2 | 3;

/** Distinguishes pure disciplines from DM-specific subfields and application contexts. */
export type SimplifiedType = 'field' | 'subfield' | 'application_domain';

/** The DO/SHOULD/COULD axis: descriptive / normative / prescriptive. */
export type Classification2 = 'DO' | 'SHOULD' | 'COULD' | 'not_applicable';

export type TaxonomyEntry = {
	id: string;
	label: string;
	color?: string;
	layer: TaxonomyLayer;
	description?: string;
	simplified_type: SimplifiedType;
	classification_2: Classification2;
};
