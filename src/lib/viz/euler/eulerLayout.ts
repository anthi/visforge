import { forceCollide, forceManyBody, forceSimulation } from 'd3';
import type { SimulationNodeDatum } from 'd3';
import type { Publication } from '$lib/models/publication';
import type { TaxonomyEntry } from '$lib/models/taxonomy';

export type EulerNode = {
	id: string;
	publication: Publication;
	x: number;
	y: number;
};

type SimNode = SimulationNodeDatum & { publication: Publication };

// Seed positions for all 16 disciplines — unit square, scaled at runtime.
// Arrangement encodes intellectual proximity: psychology/cog-sci center-right,
// quantitative fields (stats/math/OR) bottom-right, social sciences left, etc.
const SEED: Record<string, [number, number]> = {
	information_visualization: [0.0, -1.1],
	hci:                       [-0.65, -0.85],
	artificial_intelligence:   [0.65, -0.85],
	computer_science:          [0.9, -0.5],
	cognitive_science:         [0.5, -0.1],
	psychology:                [0.9, 0.3],
	neuroscience:              [0.65, 0.85],
	economics:                 [-0.5, 0.9],
	mathematics:               [0.1, 1.1],
	statistics:                [0.5, 1.1],
	operations_research:       [-0.1, 1.0],
	management_science:        [-0.85, 0.55],
	philosophy:                [-0.9, -0.1],
	political_science:         [-1.05, 0.35],
	sociology:                 [-0.95, 0.75],
	anthropology:              [-0.75, 0.9]
};

const CLUSTER_RADIUS = 240;
const NODE_RADIUS = 5;
const ALPHA_CLUSTER = 0.28;
const TICKS = 320;

export function runEulerLayout(
	publications: Publication[],
	_disciplines: TaxonomyEntry[],
	width: number,
	height: number
): EulerNode[] {
	const cx = width / 2;
	const cy = height / 2;

	const simNodes: SimNode[] = publications.map((pub) => {
		const seeds = pub.disciplines.map((d) => SEED[d]).filter(Boolean) as [number, number][];
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
		.force('cluster', clusterForce(cx, cy));

	sim.stop();
	for (let i = 0; i < TICKS; i++) sim.tick();

	return simNodes.map((n) => ({
		id: n.publication.id,
		publication: n.publication,
		x: n.x ?? cx,
		y: n.y ?? cy
	}));
}

function clusterForce(cx: number, cy: number) {
	let nodes: SimNode[] = [];

	const force = (alpha: number): void => {
		for (const n of nodes) {
			for (const discId of n.publication.disciplines) {
				const seed = SEED[discId];
				if (!seed) continue;
				const tx = cx + seed[0] * CLUSTER_RADIUS;
				const ty = cy + seed[1] * CLUSTER_RADIUS;
				n.vx = (n.vx ?? 0) + (tx - (n.x ?? cx)) * alpha * ALPHA_CLUSTER;
				n.vy = (n.vy ?? 0) + (ty - (n.y ?? cy)) * alpha * ALPHA_CLUSTER;
			}
		}
	};

	(force as typeof force & { initialize: (ns: SimNode[]) => void }).initialize = (
		ns: SimNode[]
	) => {
		nodes = ns;
	};

	return force;
}
