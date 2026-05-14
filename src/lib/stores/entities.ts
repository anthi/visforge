import { derived, readable } from 'svelte/store';
import { mockPublications } from '$lib/data/mock/publications';
import { DISCIPLINES, SUBFIELDS, DOMAINS } from '$lib/data/taxonomy';

export const publications = readable(mockPublications);
export const disciplines = readable(DISCIPLINES);
export const subfields = readable(SUBFIELDS);
export const domains = readable(DOMAINS);

export const publicationsById = derived(publications, ($pubs) =>
	new Map($pubs.map((p) => [p.id, p]))
);

export const disciplinesById = derived(disciplines, ($discs) =>
	new Map($discs.map((d) => [d.id, d]))
);

export const subfieldsById = derived(subfields, ($subs) =>
	new Map($subs.map((s) => [s.id, s]))
);

export const domainsById = derived(domains, ($doms) =>
	new Map($doms.map((d) => [d.id, d]))
);
