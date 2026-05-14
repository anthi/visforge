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
	clusterCX: number;
	clusterCY: number;
	clusterR: number;
};

export type PlacedLabel = {
	id: string;
	label: string;
	x: number;
	y: number;
	color: string;
};

// ─── Internal ─────────────────────────────────────────────────────────────────

type SimNode = SimulationNodeDatum &
	RawDiscLabel & { vx: number; vy: number };

const CELL = 8;   // px per density-grid cell
const CHAR_W = 5.8; // px per character at 10px JetBrains Mono

function halfWidth(label: string): number {
	return (label.length * CHAR_W) / 2;
}

// ─── Phase 1: dot density grid ────────────────────────────────────────────────
//
// Each publication dot contributes a gaussian-like falloff to nearby cells.
// Low grid value = whitespace; high value = dot-dense area.

function buildDensityGrid(
	dots: EulerNode[],
	cols: number,
	rows: number
): Float32Array {
	const grid = new Float32Array(cols * rows);
	const R = 14; // influence radius in px
	const SPAN = Math.ceil(R / CELL) + 1;

	for (const d of dots) {
		const gx = Math.floor(d.x / CELL);
		const gy = Math.floor(d.y / CELL);
		for (let cy = -SPAN; cy <= SPAN; cy++) {
			for (let cx = -SPAN; cx <= SPAN; cx++) {
				const nx = gx + cx, ny = gy + cy;
				if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
				const dist = Math.sqrt((cx * CELL) ** 2 + (cy * CELL) ** 2);
				if (dist <= R) grid[ny * cols + nx] += (R - dist) / R;
			}
		}
	}
	return grid;
}

// ─── Phase 2: nearest-whitespace search ───────────────────────────────────────
//
// For each label, scan candidate grid positions within the cluster radius and
// pick the one with the lowest combined score (dot density + distance from anchor).
// Constrained to stay within the cluster centroid radius.

function findBestWhitespace(
	anchorX: number,
	anchorY: number,
	clusterCX: number,
	clusterCY: number,
	clusterR: number,
	grid: Float32Array,
	cols: number,
	rows: number
): [number, number] {
	let best: [number, number] = [anchorX, anchorY];
	let bestScore = Infinity;

	const STEP = 10; // px between candidate positions
	const limit = Math.min(clusterR, 220);

	for (let dy = -limit; dy <= limit; dy += STEP) {
		for (let dx = -limit; dx <= limit; dx += STEP) {
			if (dx * dx + dy * dy > limit * limit) continue;

			const px = anchorX + dx;
			const py = anchorY + dy;

			// Must be within cluster radius from cluster centroid
			const cdx = px - clusterCX;
			const cdy = py - clusterCY;
			if (cdx * cdx + cdy * cdy > clusterR * clusterR) continue;

			const gx = Math.floor(px / CELL);
			const gy = Math.floor(py / CELL);
			if (gx < 0 || gy < 0 || gx >= cols || gy >= rows) continue;

			// Low density preferred; secondarily prefer positions closer to anchor
			const density = grid[gy * cols + gx];
			const dist = Math.sqrt(dx * dx + dy * dy);
			const score = density * 15 + dist * 0.08;

			if (score < bestScore) {
				bestScore = score;
				best = [px, py];
			}
		}
	}

	return best;
}

// Mark the footprint of a placed label as occupied so the next greedy search
// avoids it.

function markOccupied(
	x: number,
	y: number,
	labelHalfW: number,
	grid: Float32Array,
	cols: number,
	rows: number
): void {
	const halfW = Math.ceil((labelHalfW + 12) / CELL);
	const halfH = Math.ceil(8 / CELL) + 1;
	const gx = Math.floor(x / CELL);
	const gy = Math.floor(y / CELL);

	for (let cy = -halfH; cy <= halfH; cy++) {
		for (let cx = -halfW; cx <= halfW; cx++) {
			const nx = gx + cx, ny = gy + cy;
			if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) {
				grid[ny * cols + nx] += 800;
			}
		}
	}
}

// ─── Phase 3: collision simulation ───────────────────────────────────────────
//
// Labels start at their whitespace-found positions. A light forceCollide sim
// resolves any residual label–label overlaps, anchored back toward the whitespace
// target so labels don't drift into dot clusters.

function whitespaceAnchorForce(
	targets: Map<string, [number, number]>,
	strength: number
) {
	let nodes: SimNode[] = [];
	const force = (alpha: number): void => {
		for (const n of nodes) {
			const t = targets.get(n.id);
			if (!t) continue;
			n.vx += (t[0] - (n.x ?? t[0])) * alpha * strength;
			n.vy += (t[1] - (n.y ?? t[1])) * alpha * strength;
		}
	};
	(force as typeof force & { initialize: (ns: SimNode[]) => void }).initialize = (
		ns: SimNode[]
	) => { nodes = ns; };
	return force;
}

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
	) => { nodes = ns; };
	return force;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Places discipline sub-labels in available whitespace.
 *
 * Three-phase algorithm:
 *   1. Build a dot-density grid over the canvas.
 *   2. For each label, greedy-search the grid for the nearest low-density
 *      position within the cluster radius; mark it occupied before the next search.
 *   3. Run a short forceCollide simulation (labels only, 150 ticks) anchored
 *      toward the whitespace positions to resolve any residual overlap.
 */
export function placeDiscLabels(
	rawLabels: RawDiscLabel[],
	allNodes: EulerNode[],
	canvasWidth: number,
	canvasHeight: number
): PlacedLabel[] {
	if (rawLabels.length === 0) return [];

	const cols = Math.ceil(canvasWidth / CELL);
	const rows = Math.ceil(canvasHeight / CELL);

	// Phase 1
	const grid = buildDensityGrid(allNodes, cols, rows);

	// Phase 2: greedy sequential placement
	const whitespaceTargets = new Map<string, [number, number]>();
	for (const spec of rawLabels) {
		const pos = findBestWhitespace(
			spec.anchorX, spec.anchorY,
			spec.clusterCX, spec.clusterCY, spec.clusterR,
			grid, cols, rows
		);
		whitespaceTargets.set(spec.id, pos);
		markOccupied(pos[0], pos[1], halfWidth(spec.label), grid, cols, rows);
	}

	// Phase 3: collision refinement
	const simNodes: SimNode[] = rawLabels.map((spec) => {
		const [wx, wy] = whitespaceTargets.get(spec.id)!;
		return { ...spec, x: wx, y: wy, vx: 0, vy: 0 };
	});

	const sim = forceSimulation<SimNode>(simNodes)
		.force(
			'collide',
			forceCollide<SimNode>((d) => halfWidth(d.label) + 8)
				.strength(1.0)
				.iterations(6)
		)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.force('wsAnchor', whitespaceAnchorForce(whitespaceTargets, 0.35) as any)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.force('contain', containmentForce(0.8) as any)
		.alphaDecay(0.025)
		.velocityDecay(0.5);

	sim.stop();
	for (let i = 0; i < 150; i++) sim.tick();

	return simNodes.map((n) => ({
		id: n.id,
		label: n.label,
		x: n.x ?? n.anchorX,
		y: n.y ?? n.anchorY,
		color: n.color
	}));
}
