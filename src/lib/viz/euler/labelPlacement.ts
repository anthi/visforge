import { forceCollide, forceSimulation } from 'd3';
import type { SimulationNodeDatum } from 'd3';
import type { EulerNode } from './eulerLayout';

// ─── Public types ─────────────────────────────────────────────────────────────

export type RawDiscLabel = {
	id: string;
	label: string;
	anchorX: number;
	anchorY: number;
	color: string;
	/** Centroid x of the parent cluster's nodes — used for soft containment. */
	clusterCX: number;
	/** Centroid y of the parent cluster's nodes. */
	clusterCY: number;
	/** 85th-percentile radius of the parent cluster's nodes from its centroid. */
	clusterR: number;
};

export type PlacedLabel = {
	id: string;
	label: string;
	x: number;
	y: number;
	color: string;
};

// ─── Internal sim node type ───────────────────────────────────────────────────

type SimNode = SimulationNodeDatum &
	RawDiscLabel & {
		vx: number;
		vy: number;
	};

// ─── Geometry helpers ─────────────────────────────────────────────────────────

// At 10px JetBrains Mono the average character is ~5.8px wide.
const CHAR_W = 5.8;

function halfWidth(label: string): number {
	return (label.length * CHAR_W) / 2;
}

// ─── Custom forces ────────────────────────────────────────────────────────────

/** Pull each label toward its own discipline centroid (anchor). */
function anchorForce(strength: number) {
	let nodes: SimNode[] = [];
	const force = (alpha: number): void => {
		for (const n of nodes) {
			n.vx += (n.anchorX - (n.x ?? n.anchorX)) * alpha * strength;
			n.vy += (n.anchorY - (n.y ?? n.anchorY)) * alpha * strength;
		}
	};
	(force as typeof force & { initialize: (ns: SimNode[]) => void }).initialize = (
		ns: SimNode[]
	) => {
		nodes = ns;
	};
	return force;
}

/** Push labels back inside their cluster radius if they drift outside. */
function containmentForce(strength: number) {
	let nodes: SimNode[] = [];
	const force = (alpha: number): void => {
		for (const n of nodes) {
			const x = n.x ?? n.clusterCX;
			const y = n.y ?? n.clusterCY;
			const dx = x - n.clusterCX;
			const dy = y - n.clusterCY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist > n.clusterR && dist > 0) {
				const pull = ((dist - n.clusterR) / dist) * strength;
				n.vx -= dx * pull;
				n.vy -= dy * pull;
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

/** Repel each label away from nearby publication dots. */
function dotRepelForce(dots: EulerNode[], repelR: number, strength: number) {
	let nodes: SimNode[] = [];
	const force = (alpha: number): void => {
		for (const n of nodes) {
			let fx = 0,
				fy = 0;
			const lx = n.x ?? n.anchorX;
			const ly = n.y ?? n.anchorY;
			for (const d of dots) {
				const dx = lx - d.x;
				const dy = ly - d.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < repelR && dist > 0) {
					const f = (strength * (1 - dist / repelR)) / dist;
					fx += dx * f;
					fy += dy * f;
				}
			}
			n.vx += fx * alpha;
			n.vy += fy * alpha;
		}
	};
	(force as typeof force & { initialize: (ns: SimNode[]) => void }).initialize = (
		ns: SimNode[]
	) => {
		nodes = ns;
	};
	return force;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Runs a static d3-force simulation (no animation) to place discipline labels
 * so they:
 *   - don't overlap each other
 *   - repel away from dense dot areas
 *   - stay within their parent cluster region
 *
 * Starts each label at its discipline centroid with a tiny deterministic jitter.
 */
export function placeDiscLabels(
	rawLabels: RawDiscLabel[],
	allNodes: EulerNode[]
): PlacedLabel[] {
	if (rawLabels.length === 0) return [];

	// Deterministic jitter using golden-angle increments so labels don't start stacked
	const simNodes: SimNode[] = rawLabels.map((spec, i) => ({
		...spec,
		x: spec.anchorX + Math.cos(i * 2.399) * 6,
		y: spec.anchorY + Math.sin(i * 2.399) * 6,
		vx: 0,
		vy: 0
	}));

	const sim = forceSimulation<SimNode>(simNodes)
		.force(
			'collide',
			forceCollide<SimNode>((d) => halfWidth(d.label) + 10)
				.strength(0.9)
				.iterations(4)
		)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.force('anchor', anchorForce(0.14) as any)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.force('contain', containmentForce(0.55) as any)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.force('dotRepel', dotRepelForce(allNodes, 52, 0.7) as any)
		.alphaDecay(0.015)
		.velocityDecay(0.4);

	sim.stop();
	for (let i = 0; i < 240; i++) sim.tick();

	return simNodes.map((n) => ({
		id: n.id,
		label: n.label,
		x: n.x ?? n.anchorX,
		y: n.y ?? n.anchorY,
		color: n.color
	}));
}
