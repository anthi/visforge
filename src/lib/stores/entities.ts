import { derived, readable } from 'svelte/store';
import { mockPublications } from '$lib/data/mock/publications';
import { FIELDS, SUBFIELDS, APPLICATIONS } from '$lib/data/taxonomy';
import { CLUSTERS } from '$lib/data/clusters';

export const publications = readable(mockPublications);
export const fields = readable(FIELDS);
export const subfields = readable(SUBFIELDS);
export const applications = readable(APPLICATIONS);
export const clusters = readable(CLUSTERS);

export const publicationsById = derived(publications, ($pubs) =>
	new Map($pubs.map((p) => [p.id, p]))
);

export const fieldsById = derived(fields, ($discs) =>
	new Map($discs.map((d) => [d.id, d]))
);

export const subfieldsById = derived(subfields, ($subs) =>
	new Map($subs.map((s) => [s.id, s]))
);

export const applicationsById = derived(applications, ($doms) =>
	new Map($doms.map((d) => [d.id, d]))
);

export const clustersById = derived(clusters, ($cs) =>
	new Map($cs.map((c) => [c.id, c]))
);
