import type { EulerNode } from './eulerLayout';
import { largestRing, pointInRing, polygonCentroid } from './eulerContours';

// ─── Public types ─────────────────────────────────────────────────────────────

export type RawFieldLabel = {
	id: string;
	label: string;
	anchorX: number;
	anchorY: number;
	color: string;
	/** Cluster that owns this field — used to look up the clipping polygon. */
	clusterId: string;
};

export type PlacedLabel = {
	id: string;
	label: string;
	x: number;
	y: number;
	color: string;
};

// ─── Boundary sampling ────────────────────────────────────────────────────────

/** Sample ~N evenly-spaced points along the ring perimeter. */
function sampleRingPoints(ring: number[][], n: number): [number, number][] {
	const pts: [number, number][] = [];
	if (ring.length < 2) return pts;
	const step = Math.max(1, Math.floor(ring.length / n));
	for (let i = 0; i < ring.length; i += step) {
		pts.push([ring[i][0], ring[i][1]]);
	}
	return pts;
}

// ─── Penalty scoring ──────────────────────────────────────────────────────────

/**
 * Lower score = better placement.
 *   +10 per dot within 25px
 *   +10 per boundary sample point within 20px
 *   +10 per already-placed label within 35px
 */
function penaltyScore(
	px: number,
	py: number,
	allNodes: EulerNode[],
	boundaryPts: [number, number][],
	placed: [number, number][]
): number {
	let score = 0;
	for (const n of allNodes) {
		const d2 = (n.x - px) ** 2 + (n.y - py) ** 2;
		if (d2 < 25 * 25) score += 10;
	}
	for (const [bx, by] of boundaryPts) {
		const d2 = (bx - px) ** 2 + (by - py) ** 2;
		if (d2 < 20 * 20) score += 10;
	}
	for (const [lx, ly] of placed) {
		const d2 = (lx - px) ** 2 + (ly - py) ** 2;
		if (d2 < 35 * 35) score += 10;
	}
	return score;
}

// ─── Disc label placement via ray casting inside cluster polygon ──────────────

const N_DIRS = 16;
const RADII = [0, 20, 40, 60, 80, 100, 130, 160];
const FALLBACK_THRESHOLD = 30;

function discLabelPos(
	anchorX: number,
	anchorY: number,
	ring: number[][],
	allNodes: EulerNode[],
	placed: [number, number][]
): [number, number] {
	// Snap start to polygon centroid if anchor is outside
	let startX = anchorX;
	let startY = anchorY;
	if (!pointInRing(anchorX, anchorY, ring)) {
		[startX, startY] = polygonCentroid(ring);
	}

	const boundaryPts = sampleRingPoints(ring, 60);

	let bestPos: [number, number] = [startX, startY];
	let bestScore = Infinity;

	for (let i = 0; i < N_DIRS; i++) {
		const angle = (i / N_DIRS) * 2 * Math.PI;
		const dx = Math.cos(angle);
		const dy = Math.sin(angle);

		for (const r of RADII) {
			const cx = startX + dx * r;
			const cy = startY + dy * r;
			if (!pointInRing(cx, cy, ring)) break; // hit boundary on this ray

			const score = penaltyScore(cx, cy, allNodes, boundaryPts, placed);
			if (score < bestScore) {
				bestScore = score;
				bestPos = [cx, cy];
			}
		}
	}

	// If no candidate found below threshold, fall back to polygon centroid
	if (bestScore > FALLBACK_THRESHOLD) {
		const centroid = polygonCentroid(ring);
		const centroidScore = penaltyScore(centroid[0], centroid[1], allNodes, boundaryPts, placed);
		if (centroidScore < bestScore) return centroid;
	}

	return bestPos;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function placeDiscLabels(
	rawLabels: RawFieldLabel[],
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
