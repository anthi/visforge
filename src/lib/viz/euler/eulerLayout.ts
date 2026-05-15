import { forceCollide, forceManyBody, forceSimulation } from 'd3';
import type { SimulationNodeDatum } from 'd3';
import type { Publication } from '$lib/models/publication';
import type { TaxonomyEntry } from '$lib/models/taxonomy';
import type { Lens } from '$lib/stores';
import type { AuthorData } from '$lib/data/authors';

export type EulerNode = {
	id: string;
	publication: Publication;
	x: number;
	y: number;
};

export type AuthorNode = {
	id: string;
	author: AuthorData;
	x: number;
	y: number;
};

type SimNode = SimulationNodeDatum & { publication: Publication };

// ─── Seed maps (unit-square coordinates, scaled by CLUSTER_RADIUS) ────────────

// Disciplines lens — intellectual proximity of contributing fields
const DISC_SEED: Record<string, [number, number]> = {
	// Mind & Behavior (right)
	psychology:               [ 1.0,   0.15],
	cognitive_science:        [ 0.72, -0.25],
	neuroscience:             [ 0.85,  0.55],
	// Formal & Computational (bottom-right; AI/CS bridge upper-right)
	economics:                [ 0.2,   0.88],
	mathematics:              [ 0.45,  1.1 ],
	statistics:               [ 0.7,   1.0 ],
	decision_theory:          [ 0.5,   0.72],
	operations_research:      [ 0.05,  1.0 ],
	artificial_intelligence:  [ 0.62, -0.72],
	computer_science:         [ 0.9,  -0.5 ],
	// Design & Interaction (top-left)
	information_visualization:[-0.15, -1.05],
	hci:                      [-0.62, -0.82],
	// Collective & Societal (left)
	management_science:       [-0.7,   0.45],
	sociology:                [-0.92,  0.75],
	anthropology:             [-0.72,  0.95],
	political_science:        [-1.0,   0.2 ],
	// Philosophy (upper-left, standalone)
	philosophy:               [-0.85, -0.32],
};

// Subfields lens — DM-specific subfields arranged by intellectual proximity
const SUBFIELD_SEED: Record<string, [number, number]> = {
	judgment_and_decision_making:  [ 0.85,  0.10],
	behavioral_economics:          [ 0.50, -0.60],
	neuroeconomics:                [ 0.90, -0.45],
	decision_theory:               [ 0.20,  0.90],
	game_theory:                   [ 0.05,  1.05],
	multi_criteria_decision_making:[-0.45,  0.85],
	naturalistic_decision_making:  [-0.85,  0.20],
	decision_support_systems:      [-0.40, -0.65],
	recommender_systems:           [-0.85, -0.50],
	data_driven_decision_making:   [ 0.10, -0.15],
};

// Domains lens — application contexts
const DOMAIN_SEED: Record<string, [number, number]> = {
	medical:           [ 0.85, -0.50],
	organizational:    [ 0.85,  0.45],
	financial:         [ 0.30,  1.05],
	legal:             [-0.30,  1.00],
	energy:            [-0.85,  0.35],
	ui_interactive:    [-0.85, -0.50],
	education:         [ 0.20, -1.00],
	crisis_emergency:  [ 0.05,  0.50],
};

const CLUSTER_RADIUS = 240;
const NODE_RADIUS = 5;
const ALPHA_CLUSTER = 0.28;
const TICKS = 320;

// ─── Public API ───────────────────────────────────────────────────────────────

export function runAuthorLayout(
	authors: AuthorData[],
	width: number,
	height: number
): AuthorNode[] {
	const cx = width / 2;
	const cy = height / 2;

	type AuthorSimNode = SimulationNodeDatum & { author: AuthorData };

	const simNodes: AuthorSimNode[] = authors.map((author) => {
		const seed = DISC_SEED[author.primaryDiscipline] ?? [0, 0];
		return {
			author,
			x: cx + seed[0] * CLUSTER_RADIUS + (Math.random() - 0.5) * 40,
			y: cy + seed[1] * CLUSTER_RADIUS + (Math.random() - 0.5) * 40,
		};
	});

	const authorClusterForce = (() => {
		let nodes: AuthorSimNode[] = [];
		const force = (alpha: number) => {
			for (const n of nodes) {
				const seed = DISC_SEED[n.author.primaryDiscipline] ?? [0, 0];
				const tx = cx + seed[0] * CLUSTER_RADIUS;
				const ty = cy + seed[1] * CLUSTER_RADIUS;
				n.vx = (n.vx ?? 0) + (tx - (n.x ?? cx)) * alpha * ALPHA_CLUSTER;
				n.vy = (n.vy ?? 0) + (ty - (n.y ?? cy)) * alpha * ALPHA_CLUSTER;
			}
		};
		(force as typeof force & { initialize: (ns: AuthorSimNode[]) => void }).initialize =
			(ns) => { nodes = ns; };
		return force;
	})();

	const sim = forceSimulation(simNodes)
		.force('charge', forceManyBody().strength(-30))
		.force('collide', forceCollide(9))
		.force('cluster', authorClusterForce);

	sim.stop();
	for (let i = 0; i < TICKS; i++) sim.tick();

	return simNodes.map((n) => ({
		id: n.author.id,
		author: n.author,
		x: n.x ?? cx,
		y: n.y ?? cy,
	}));
}

export function runEulerLayout(
	publications: Publication[],
	_disciplines: TaxonomyEntry[],
	width: number,
	height: number,
	lens: Lens = 'disciplines'
): EulerNode[] {
	const seedMap =
		lens === 'subfields' ? SUBFIELD_SEED :
		lens === 'domains'   ? DOMAIN_SEED   :
		DISC_SEED; // disciplines and authors both fall back to disciplines layout

	const cx = width / 2;
	const cy = height / 2;

	const simNodes: SimNode[] = publications.map((pub) => {
		const seeds = lensSeeds(pub, lens, seedMap);
		const sx = seeds.length ? seeds.reduce((s, p) => s + p[0], 0) / seeds.length : 0;
		const sy = seeds.length ? seeds.reduce((s, p) => s + p[1], 0) / seeds.length : 0;
		return {
			publication: pub,
			x: cx + sx * CLUSTER_RADIUS + (Math.random() - 0.5) * 24,
			y: cy + sy * CLUSTER_RADIUS + (Math.random() - 0.5) * 24
		};
	});

	const sim = forceSimulation(simNodes)
		.force('charge', forceManyBody().strength(-18))
		.force('collide', forceCollide(NODE_RADIUS + 2))
		.force('cluster', clusterForce(cx, cy, seedMap, lens));

	sim.stop();
	for (let i = 0; i < TICKS; i++) sim.tick();

	return simNodes.map((n) => ({
		id: n.publication.id,
		publication: n.publication,
		x: n.x ?? cx,
		y: n.y ?? cy
	}));
}

// ─── Internals ────────────────────────────────────────────────────────────────

function lensSeeds(
	pub: Publication,
	lens: Lens,
	seedMap: Record<string, [number, number]>
): [number, number][] {
	if (lens === 'subfields') {
		return pub.subfields.map((s) => seedMap[s]).filter(Boolean) as [number, number][];
	}
	if (lens === 'domains') {
		return pub.domains.map((d) => seedMap[d]).filter(Boolean) as [number, number][];
	}
	// disciplines (and authors fallback)
	return pub.disciplines.map((d) => seedMap[d]).filter(Boolean) as [number, number][];
}

function clusterForce(
	cx: number,
	cy: number,
	seedMap: Record<string, [number, number]>,
	lens: Lens
) {
	let nodes: SimNode[] = [];

	const force = (alpha: number): void => {
		for (const n of nodes) {
			const seeds = lensSeeds(n.publication, lens, seedMap);
			for (const seed of seeds) {
				const tx = cx + seed[0] * CLUSTER_RADIUS;
				const ty = cy + seed[1] * CLUSTER_RADIUS;
				n.vx = (n.vx ?? 0) + (tx - (n.x ?? cx)) * alpha * ALPHA_CLUSTER;
				n.vy = (n.vy ?? 0) + (ty - (n.y ?? cy)) * alpha * ALPHA_CLUSTER;
			}
		}
	};

	(force as typeof force & { initialize: (ns: SimNode[]) => void }).initialize = (
		ns: SimNode[]
	) => { nodes = ns; };

	return force;
}
