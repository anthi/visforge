import { forceCollide, forceManyBody, forceSimulation } from 'd3';
import type { SimulationNodeDatum } from 'd3';
import type { Publication } from '$lib/models/publication';
import type { Category } from '$lib/models/category';

export type EulerNode = {
	id: string;
	publication: Publication;
	x: number;
	y: number;
};

// Internal D3 simulation node — extends SimulationNodeDatum so D3 can mutate x/y/vx/vy
type SimNode = SimulationNodeDatum & { publication: Publication };

// Normalized seed positions reflecting intellectual proximity.
// Coordinates are in the unit square centered at origin; scaled at runtime.
const SEED: Record<string, [number, number]> = {
	infovis: [0.0, -1.0],
	hci: [-0.75, -0.45],
	'feminist-hci': [-1.0, 0.35],
	xai: [0.6, -0.45],
	'cognitive-bias': [0.85, 0.1],
	'decision-making': [0.3, 0.75],
	jdm: [0.85, 0.75],
	'behavioral-economics': [0.15, 1.1]
};

const CLUSTER_RADIUS = 210; // px — distance of category centers from canvas center
const NODE_RADIUS = 5; // px — collision radius
const ALPHA_CLUSTER = 0.28; // cluster force strength per alpha unit
const TICKS = 320;

export function runEulerLayout(
	publications: Publication[],
	_categories: Category[],
	width: number,
	height: number
): EulerNode[] {
	const cx = width / 2;
	const cy = height / 2;

	const simNodes: SimNode[] = publications.map((pub) => {
		// Start each node at the mean seed position of its categories
		const seeds = pub.categories.map((c) => SEED[c]).filter(Boolean) as [number, number][];
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

// Custom force: pulls each node toward the center(s) of its category seed(s)
function clusterForce(cx: number, cy: number) {
	let nodes: SimNode[] = [];

	const force = (alpha: number): void => {
		for (const n of nodes) {
			for (const catId of n.publication.categories) {
				const seed = SEED[catId];
				if (!seed) continue;
				const tx = cx + seed[0] * CLUSTER_RADIUS;
				const ty = cy + seed[1] * CLUSTER_RADIUS;
				n.vx = (n.vx ?? 0) + (tx - (n.x ?? cx)) * alpha * ALPHA_CLUSTER;
				n.vy = (n.vy ?? 0) + (ty - (n.y ?? cy)) * alpha * ALPHA_CLUSTER;
			}
		}
	};

	// D3 calls initialize() with the node array before the first tick
	(force as typeof force & { initialize: (ns: SimNode[]) => void }).initialize = (
		ns: SimNode[]
	) => {
		nodes = ns;
	};

	return force;
}
