export type Author = {
	id: string;
	name: string;
	affiliation?: string;

	// Enriched fields — populated in Phase 8, optional here
	primaryField?: string;
	fields?: string[];

	// All scores are within-field percentile ranks (0–1), never raw counts
	withinFieldPercentile?: number;
	topicalConsistency?: number; // fraction of their papers that are DM-relevant
	temporalSpread?: number; // career span within dataset, normalized
	crossFieldPresence?: number; // distinct fields bridged
	isFoundational?: boolean; // explicit override for canonical figures
};
