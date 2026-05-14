import { contourDensity, geoPath } from 'd3';
import type { Publication } from '$lib/models/publication';
import type { EulerNode } from './eulerLayout';
import { CLUSTERS, clustersById, disciplineToCluster } from '$lib/data/clusters';

// ─── Shared types ─────────────────────────────────────────────────────────────

export type RegionContour = {
	id: string;
	label: string;
	path: string;
	labelPos: [number, number];
	color: string;
	/** Sampled boundary points for use as obstacles in label placement. */
	boundaryPoints: [number, number][];
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

/** Sample n evenly-spaced points from the outer ring of the largest polygon. */
function sampleBoundary(coordinates: number[][][][], n: number): [number, number][] {
	let outerRing: number[][] = [];
	for (const polygon of coordinates) {
		if (polygon[0] && polygon[0].length > outerRing.length) {
			outerRing = polygon[0];
		}
	}
	if (outerRing.length === 0) return [];

	const result: [number, number][] = [];
	const step = Math.max(1, Math.floor(outerRing.length / n));
	for (let i = 0; i < outerRing.length && result.length < n; i += step) {
		result.push([outerRing[i][0], outerRing[i][1]]);
	}
	return result;
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
	const estimator = (contourDensity as any)<EulerNode>()
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

// ─── Layer 1: Cluster region contours ────────────────────────────────────────

const CLUSTER_BANDWIDTH = 72;
const CLUSTER_LEVEL = 1;

/**
 * Pick the label position outside the cluster bbox with the fewest nearby dots.
 * Probes 4 candidate positions (top/right/bottom/left, OFFSET px outside bbox midpoint)
 * and returns the one with the lowest dot count within RADIUS px, clamped to viewport.
 */
function clusterLabelPos(
	bbox: { minX: number; maxX: number; minY: number; maxY: number },
	allNodes: EulerNode[],
	width: number,
	height: number
): [number, number] {
	const OFFSET = 40;
	const RADIUS = 120;
	const MARGIN = 24;

	const midX = (bbox.minX + bbox.maxX) / 2;
	const midY = (bbox.minY + bbox.maxY) / 2;

	const candidates: [number, number][] = [
		[midX,              bbox.minY - OFFSET], // top
		[bbox.maxX + OFFSET, midY             ], // right
		[midX,              bbox.maxY + OFFSET], // bottom
		[bbox.minX - OFFSET, midY             ], // left
	];

	let bestPos: [number, number] = candidates[0];
	let bestScore = Infinity;

	for (const [cx, cy] of candidates) {
		// Discard candidates that land outside the viewport even after clamping would move them
		const px = Math.max(MARGIN, Math.min(width - MARGIN, cx));
		const py = Math.max(MARGIN, Math.min(height - MARGIN, cy));

		let score = 0;
		for (const n of allNodes) {
			const d = Math.sqrt((n.x - px) ** 2 + (n.y - py) ** 2);
			if (d < RADIUS) score += 1;
		}

		if (score < bestScore) {
			bestScore = score;
			bestPos = [px, py];
		}
	}

	return bestPos;
}

export function computeClusterContours(
	nodes: EulerNode[],
	width: number,
	height: number
): RegionContour[] {
	return CLUSTERS.flatMap((cluster) => {
		const clusterNodes = nodes.filter(
			(n) => disciplineToCluster.get(n.publication.disciplines[0] ?? '') === cluster.id
		);

		const result = buildContour(clusterNodes, width, height, CLUSTER_BANDWIDTH, CLUSTER_LEVEL);
		if (!result) return [];

		const labelPos = clusterLabelPos(result.bbox, nodes, width, height);

		return [
			{
				id: cluster.id,
				label: cluster.label,
				path: result.path,
				labelPos,
				color: cluster.color,
				boundaryPoints: sampleBoundary(result.coordinates, 50),
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
			const d = p.disciplines;
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
				boundaryPoints: sampleBoundary(result.coordinates, 30),
			}
		];
	});
}
