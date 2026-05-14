import type { EulerNode } from './eulerLayout';
import { largestRing, pointInRing, polygonCentroid } from './eulerContours';

// ─── Public types ─────────────────────────────────────────────────────────────

export type RawDiscLabel = {
	id: string;
	label: string;
	anchorX: number;
	anchorY: number;
	color: string;
	/** Cluster that owns this discipline — used to look up the clipping polygon. */
	clusterId: string;
};

export type PlacedLabel = {
	id: string;
	label: string;
	x: number;
	y: number;
	color: string;
};

// ─── Scoring ──────────────────────────────────────────────────────────────────

const SCORE_RADIUS = 150;

function scorePoint(
	px: number,
	py: number,
	allNodes: EulerNode[],
	placed: [number, number][]
): number {
	let score = 0;
	for (const n of allNodes) {
		const d = Math.sqrt((n.x - px) ** 2 + (n.y - py) ** 2);
		score += d < SCORE_RADIUS ? d : SCORE_RADIUS;
	}
	for (const [lx, ly] of placed) {
		const d = Math.sqrt((lx - px) ** 2 + (ly - py) ** 2);
		score += (d < SCORE_RADIUS ? d : SCORE_RADIUS) * 2;
	}
	return score;
}

// ─── Disc label placement via polar grid inside cluster polygon ───────────────

/**
 * Find the best position for a disc sub-label inside its cluster polygon.
 *
 * Strategy: sample a polar grid of candidates from the anchor centroid
 * (16 directions × 5 radii = 80 candidates), keep only those inside the
 * cluster ring, score each by clearance from all dots + already-placed labels,
 * and return the highest-scoring candidate.
 *
 * If the anchor is outside the polygon (edge case), fall back to the
 * polygon centroid as the starting point.
 */
function discLabelPos(
	anchorX: number,
	anchorY: number,
	ring: number[][],
	allNodes: EulerNode[],
	placed: [number, number][]
): [number, number] {
	// Snap to polygon centroid if anchor landed outside
	let startX = anchorX;
	let startY = anchorY;
	if (!pointInRing(anchorX, anchorY, ring)) {
		[startX, startY] = polygonCentroid(ring);
	}

	const N_DIRS = 16;
	const RADII = [0, 20, 40, 60, 80, 100, 130, 160];

	let bestPos: [number, number] = [startX, startY];
	let bestScore = scorePoint(startX, startY, allNodes, placed);

	for (let i = 0; i < N_DIRS; i++) {
		const angle = (i / N_DIRS) * 2 * Math.PI;
		const dx = Math.cos(angle);
		const dy = Math.sin(angle);

		for (const r of RADII) {
			const cx = startX + dx * r;
			const cy = startY + dy * r;
			if (!pointInRing(cx, cy, ring)) break; // hit boundary on this ray, skip farther

			const score = scorePoint(cx, cy, allNodes, placed);
			if (score > bestScore) {
				bestScore = score;
				bestPos = [cx, cy];
			}
		}
	}

	return bestPos;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Place discipline sub-labels using ray casting inside cluster polygons.
 *
 * For each label: casts rays from the discipline dot centroid, tests candidates
 * against the cluster polygon boundary, scores by clearance from all dots and
 * already-placed labels. Fully deterministic, no simulation.
 */
export function placeDiscLabels(
	rawLabels: RawDiscLabel[],
	allNodes: EulerNode[],
	clusterPolygons: Map<string, number[][][][]>,
	_width: number,
	_height: number
): PlacedLabel[] {
	if (rawLabels.length === 0) return [];

	const placed: [number, number][] = [];

	return rawLabels.map((spec) => {
		const coordinates = clusterPolygons.get(spec.clusterId);
		let x = spec.anchorX;
		let y = spec.anchorY;

		if (coordinates) {
			const ring = largestRing(coordinates);
			if (ring.length > 0) {
				[x, y] = discLabelPos(spec.anchorX, spec.anchorY, ring, allNodes, placed);
			}
		}

		placed.push([x, y]);
		return { id: spec.id, label: spec.label, x, y, color: spec.color };
	});
}
