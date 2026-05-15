import { contourDensity, geoPath } from 'd3';
import type { Publication } from '$lib/models/publication';
import type { EulerNode } from './eulerLayout';
import { CLUSTERS, clustersById, fieldToCluster } from '$lib/data/clusters';

// ─── Shared types ─────────────────────────────────────────────────────────────

export type RegionContour = {
	id: string;
	label: string;
	path: string;
	labelPos: [number, number];
	color: string;
	/** Raw GeoJSON MultiPolygon coordinates — used for disc label polygon clipping. */
	coordinates: number[][][][];
};

// ─── Internal helpers ─────────────────────────────────────────────────────────

function bounds(coordinates: number[][][][]): {
	minX: number; maxX: number; minY: number; maxY: number;
} | null {
	let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
	for (const polygon of coordinates) {
		for (const ring of polygon) {
			for (const pt of ring) {
				if (pt[0] < minX) minX = pt[0];
				if (pt[0] > maxX) maxX = pt[0];
				if (pt[1] < minY) minY = pt[1];
				if (pt[1] > maxY) maxY = pt[1];
			}
		}
	}
	return minX === Infinity ? null : { minX, maxX, minY, maxY };
}

function blendHex(h1: string, h2: string): string {
	const p = (h: string, s: number) => parseInt(h.slice(s, s + 2), 16);
	const r = Math.round((p(h1, 1) + p(h2, 1)) / 2);
	const g = Math.round((p(h1, 3) + p(h2, 3)) / 2);
	const b = Math.round((p(h1, 5) + p(h2, 5)) / 2);
	return `rgb(${r},${g},${b})`;
}

function buildContour(
	nodes: EulerNode[],
	width: number,
	height: number,
	bandwidth: number,
	levelIndex: number
): { path: string; bbox: NonNullable<ReturnType<typeof bounds>>; coordinates: number[][][][] } | null {
	if (nodes.length < 4) return null;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const estimator = (contourDensity as any)()
		.x((n: EulerNode) => n.x)
		.y((n: EulerNode) => n.y)
		.size([width, height])
		.bandwidth(bandwidth)
		.thresholds(10);

	const contours = estimator(nodes);
	if (!contours.length) return null;

	const c = contours[Math.min(levelIndex, contours.length - 1)];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const coordinates = c.coordinates as number[][][][];
	const bbox = bounds(coordinates);
	if (!bbox) return null;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const pathStr = (geoPath as any)()(c);
	if (!pathStr) return null;

	return { path: pathStr, bbox, coordinates };
}

// ─── Ray casting utilities ────────────────────────────────────────────────────

/** Select the outer ring of the largest polygon in a MultiPolygon. */
export function largestRing(coordinates: number[][][][]): number[][] {
	let best: number[][] = [];
	for (const polygon of coordinates) {
		if (polygon[0] && polygon[0].length > best.length) best = polygon[0];
	}
	return best;
}

/** Signed-area centroid of a polygon ring. Falls back to simple mean for degenerate rings. */
export function polygonCentroid(ring: number[][]): [number, number] {
	let area = 0, cx = 0, cy = 0;
	const n = ring.length;
	for (let i = 0, j = n - 1; i < n; j = i++) {
		const f = ring[i][0] * ring[j][1] - ring[j][0] * ring[i][1];
		area += f;
		cx += (ring[i][0] + ring[j][0]) * f;
		cy += (ring[i][1] + ring[j][1]) * f;
	}
	area /= 2;
	if (Math.abs(area) < 1e-10) {
		return [
			ring.reduce((s, p) => s + p[0], 0) / n,
			ring.reduce((s, p) => s + p[1], 0) / n,
		];
	}
	return [cx / (6 * area), cy / (6 * area)];
}

/** Even-odd point-in-polygon test for a single ring. */
export function pointInRing(px: number, py: number, ring: number[][]): boolean {
	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const xi = ring[i][0], yi = ring[i][1];
		const xj = ring[j][0], yj = ring[j][1];
		if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
			inside = !inside;
		}
	}
	return inside;
}

const SCORE_RADIUS = 150;

/**
 * Score a label candidate position.
 * Higher = more whitespace: sum of capped distances to all dots and already-placed labels.
 * Placed labels get a 3× weight to spread cluster labels apart.
 */
function scoreLabelPoint(
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
		score += (d < SCORE_RADIUS ? d : SCORE_RADIUS) * 3;
	}
	return score;
}

/**
 * Cast 16 rays from the polygon centroid.
 * For each ray, walk outward until it exits the polygon ring, then continue
 * OVERSHOOT px past the boundary. Score that endpoint and return the best one.
 * Already-placed label positions are passed as obstacles (3× weight) so
 * subsequent cluster labels are pushed apart.
 */
function clusterLabelPosRay(
	coordinates: number[][][][],
	allNodes: EulerNode[],
	placed: [number, number][],
	width: number,
	height: number
): [number, number] {
	const ring = largestRing(coordinates);
	if (ring.length === 0) return [width / 2, 24];

	const [ocx, ocy] = polygonCentroid(ring);
	const N_RAYS = 24;
	const STEP = 4;
	const OVERSHOOT = 96;
	const MARGIN = 24;

	let bestPos: [number, number] = [Math.max(MARGIN, Math.min(width - MARGIN, ocx)), MARGIN];
	let bestScore = -Infinity;

	for (let i = 0; i < N_RAYS; i++) {
		const angle = (i / N_RAYS) * 2 * Math.PI;
		const dx = Math.cos(angle);
		const dy = Math.sin(angle);

		// Walk outward until the ray exits the polygon
		let exitDist = 0;
		for (let dist = STEP; dist <= 900; dist += STEP) {
			if (!pointInRing(ocx + dx * dist, ocy + dy * dist, ring)) {
				exitDist = dist;
				break;
			}
		}
		if (exitDist === 0) continue;

		// Candidate: OVERSHOOT px past the boundary
		const cx = ocx + dx * (exitDist + OVERSHOOT);
		const cy = ocy + dy * (exitDist + OVERSHOOT);
		const px = Math.max(MARGIN, Math.min(width - MARGIN, cx));
		const py = Math.max(MARGIN, Math.min(height - MARGIN, cy));

		const score = scoreLabelPoint(px, py, allNodes, placed);
		if (score > bestScore) {
			bestScore = score;
			bestPos = [px, py];
		}
	}

	return bestPos;
}

// ─── Layer 1: Cluster region contours ────────────────────────────────────────

const CLUSTER_BANDWIDTH = 72;
const CLUSTER_LEVEL = 1;

export function computeClusterContours(
	nodes: EulerNode[],
	width: number,
	height: number
): RegionContour[] {
	const placed: [number, number][] = [];

	return CLUSTERS.flatMap((cluster) => {
		const clusterNodes = nodes.filter(
			(n) => fieldToCluster.get(n.publication.fields[0] ?? '') === cluster.id
		);

		const result = buildContour(clusterNodes, width, height, CLUSTER_BANDWIDTH, CLUSTER_LEVEL);
		if (!result) return [];

		const labelPos = clusterLabelPosRay(result.coordinates, nodes, placed, width, height);
		placed.push(labelPos);

		return [
			{
				id: cluster.id,
				label: cluster.label,
				path: result.path,
				labelPos,
				color: cluster.color,
				coordinates: result.coordinates,
			}
		];
	});
}

// ─── Layer 2: Bridge band contours ────────────────────────────────────────────

const BRIDGE_BANDWIDTH = 52;
const BRIDGE_LEVEL = 2;

const BRIDGE_DEFS: {
	id: string;
	label: string;
	parentClusters: [string, string];
	filter: (pub: Publication) => boolean;
}[] = [
	{
		id: 'behavioral_economics',
		label: 'Behavioral Economics',
		parentClusters: ['mind', 'formal'],
		filter: (p) => p.subfields.includes('behavioral_economics')
	},
	{
		id: 'neuroeconomics',
		label: 'Neuroeconomics',
		parentClusters: ['mind', 'formal'],
		filter: (p) => p.subfields.includes('neuroeconomics')
	},
	{
		id: 'ndm',
		label: 'Naturalistic DM',
		parentClusters: ['mind', 'societal'],
		filter: (p) => p.subfields.includes('naturalistic_decision_making')
	},
	{
		id: 'mcdm',
		label: 'MCDM',
		parentClusters: ['formal', 'societal'],
		filter: (p) => p.subfields.includes('multi_criteria_decision_making')
	},
	{
		id: 'dss',
		label: 'Decision Support',
		parentClusters: ['formal', 'design'],
		filter: (p) => p.subfields.includes('decision_support_systems')
	},
	{
		id: 'xai',
		label: 'XAI / Explainability',
		parentClusters: ['formal', 'design'],
		filter: (p) => {
			const d = p.fields;
			const inFormal = d.some((x) =>
				['artificial_intelligence', 'computer_science', 'statistics', 'mathematics',
				 'economics', 'operations_research'].includes(x)
			);
			const inDesign = d.some((x) => ['information_visualization', 'hci'].includes(x));
			return inFormal && inDesign;
		}
	}
];

export function computeBridgeContours(
	nodes: EulerNode[],
	width: number,
	height: number
): RegionContour[] {
	return BRIDGE_DEFS.flatMap((bridge) => {
		const bridgeNodes = nodes.filter((n) => bridge.filter(n.publication));

		const bw = bridge.id === 'xai' ? 60 : BRIDGE_BANDWIDTH;
		const result = buildContour(bridgeNodes, width, height, bw, BRIDGE_LEVEL);
		if (!result) return [];

		const c1 = clustersById.get(bridge.parentClusters[0])?.color ?? '#888888';
		const c2 = clustersById.get(bridge.parentClusters[1])?.color ?? '#888888';

		const { minX, maxX, minY } = result.bbox;
		return [
			{
				id: bridge.id,
				label: bridge.label,
				path: result.path,
				labelPos: [(minX + maxX) / 2, minY - 14] as [number, number],
				color: blendHex(c1, c2),
				coordinates: result.coordinates,
			}
		];
	});
}
