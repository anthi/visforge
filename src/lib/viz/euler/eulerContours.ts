import { contourDensity, geoPath } from 'd3';
import type { Publication } from '$lib/models/publication';
import type { EulerNode } from './eulerLayout';
import { CLUSTERS, clustersById, disciplineToCluster } from '$lib/data/clusters';

// ─── Shared types ─────────────────────────────────────────────────────────────

export type RegionContour = {
	id: string;
	label: string;
	path: string;
	/** Point for label placement — already offset outward from the boundary. */
	labelPos: [number, number];
	color: string;
};

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Bounding box of a GeoJSON MultiPolygon coordinate set. */
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

/** Average two hex colours. */
function blendHex(h1: string, h2: string): string {
	const p = (h: string, s: number) => parseInt(h.slice(s, s + 2), 16);
	const r = Math.round((p(h1, 1) + p(h2, 1)) / 2);
	const g = Math.round((p(h1, 3) + p(h2, 3)) / 2);
	const b = Math.round((p(h1, 5) + p(h2, 5)) / 2);
	return `rgb(${r},${g},${b})`;
}

/**
 * Core KDE contour builder.
 *
 * bandwidth  — Gaussian kernel sigma in px. Larger = smoother / wider shape.
 * levelIndex — Which threshold level to extract (0 = most generous outer contour).
 *              With thresholds(10), index 1 gives ~10% of peak density.
 */
function buildContour(
	nodes: EulerNode[],
	width: number,
	height: number,
	bandwidth: number,
	levelIndex: number
): { path: string; bbox: NonNullable<ReturnType<typeof bounds>> } | null {
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
	const bbox = bounds(c.coordinates as any);
	if (!bbox) return null;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const pathStr = (geoPath as any)()(c);
	if (!pathStr) return null;

	return { path: pathStr, bbox };
}

// ─── Layer 1: Cluster region contours ────────────────────────────────────────
//
// Large bandwidth so each cluster reads as one generous organic blob.
// Level index 1 (of 10) gives the second-outermost contour — generous but
// not so thin it covers the whole canvas.

const CLUSTER_BANDWIDTH = 72;
const CLUSTER_LEVEL = 1;

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

		// Push label outward from canvas center so it clears the contour boundary
		const ncx = clusterNodes.reduce((s, n) => s + n.x, 0) / clusterNodes.length;
		const ncy = clusterNodes.reduce((s, n) => s + n.y, 0) / clusterNodes.length;
		const dx = ncx - width / 2;
		const dy = ncy - height / 2;
		const len = Math.sqrt(dx * dx + dy * dy);
		const nx = len > 0 ? dx / len : 0;
		const ny = len > 0 ? dy / len : -1;

		const { minX, maxX, minY, maxY } = result.bbox;
		const bboxCX = (minX + maxX) / 2;
		const bboxCY = (minY + maxY) / 2;
		const bboxHW = (maxX - minX) / 2;
		const bboxHH = (maxY - minY) / 2;

		// Find the point on the bounding box perimeter in direction (nx, ny)
		let ex: number, ey: number;
		if (Math.abs(ny) * bboxHW >= Math.abs(nx) * bboxHH) {
			const sign = ny <= 0 ? -1 : 1;
			ey = bboxCY + sign * bboxHH;
			ex = bboxCX + (Math.abs(ny) > 1e-6 ? (nx * sign * bboxHH) / Math.abs(ny) : 0);
		} else {
			const sign = nx < 0 ? -1 : 1;
			ex = bboxCX + sign * bboxHW;
			ey = bboxCY + (Math.abs(nx) > 1e-6 ? (ny * sign * bboxHW) / Math.abs(nx) : 0);
		}

		return [
			{
				id: cluster.id,
				label: cluster.label,
				path: result.path,
				labelPos: [ex + nx * 32, ey + ny * 32] as [number, number],
				color: cluster.color
			}
		];
	});
}

// ─── Layer 2: Bridge band contours (Bubble Sets logic) ───────────────────────
//
// Narrower bandwidth keeps the band tighter around the bridging publications.
// Level index 2 (of 10) gives a moderately tight isocontour, avoiding the
// very outer fringes while still stretching between parent cluster regions.

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
		parentClusters: ['mind_behavior', 'formal_computational'],
		filter: (p) => p.subfields.includes('behavioral_economics')
	},
	{
		id: 'neuroeconomics',
		label: 'Neuroeconomics',
		parentClusters: ['mind_behavior', 'formal_computational'],
		filter: (p) => p.subfields.includes('neuroeconomics')
	},
	{
		id: 'ndm',
		label: 'Naturalistic DM',
		parentClusters: ['mind_behavior', 'collective_societal'],
		filter: (p) => p.subfields.includes('naturalistic_decision_making')
	},
	{
		id: 'mcdm',
		label: 'MCDM',
		parentClusters: ['formal_computational', 'collective_societal'],
		filter: (p) => p.subfields.includes('multi_criteria_decision_making')
	},
	{
		id: 'dss',
		label: 'Decision Support',
		parentClusters: ['formal_computational', 'design_interaction'],
		filter: (p) => p.subfields.includes('decision_support_systems')
	},
	{
		id: 'xai',
		label: 'XAI / Explainability',
		parentClusters: ['formal_computational', 'design_interaction'],
		// Publications that cross Formal & Computational and Design & Interaction
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

		// XAI has fewer pubs — use slightly wider bandwidth so it still forms a visible band
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
				color: blendHex(c1, c2)
			}
		];
	});
}
