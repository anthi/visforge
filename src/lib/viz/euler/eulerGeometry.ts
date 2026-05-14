import { curveCatmullRomClosed, line, polygonCentroid, polygonHull } from 'd3';
import { expandPolygon, pointsCentroid } from '$lib/viz/core/geometry';
import type { EulerNode } from './eulerLayout';

const HULL_PADDING = 28;

const smoothPath = line<[number, number]>()
	.x((d) => d[0])
	.y((d) => d[1])
	.curve(curveCatmullRomClosed.alpha(0.5));

export type HullData = {
	path: string | null;
	labelAnchor: [number, number] | null;
};

/**
 * Generic hull computation.
 * regionIds — the set of region identifiers to compute hulls for.
 * nodeToRegion — maps each node to its region id (null = node excluded from all hulls).
 */
export function computeHullsForRegions(
	nodes: EulerNode[],
	regionIds: string[],
	nodeToRegion: (node: EulerNode) => string | null
): Map<string, HullData> {
	// Bucket nodes into regions
	const buckets = new Map<string, [number, number][]>();
	for (const id of regionIds) buckets.set(id, []);
	for (const n of nodes) {
		const rid = nodeToRegion(n);
		if (rid !== null) buckets.get(rid)?.push([n.x, n.y]);
	}

	const result = new Map<string, HullData>();

	for (const regionId of regionIds) {
		const pts = buckets.get(regionId) ?? [];

		if (pts.length === 0) {
			result.set(regionId, { path: null, labelAnchor: null });
			continue;
		}

		if (pts.length < 3) {
			result.set(regionId, { path: null, labelAnchor: pointsCentroid(pts) });
			continue;
		}

		const hull = polygonHull(pts);
		if (!hull) {
			result.set(regionId, { path: null, labelAnchor: pointsCentroid(pts) });
			continue;
		}

		const c = polygonCentroid(hull) as [number, number];
		const padded = expandPolygon(hull as [number, number][], c, HULL_PADDING);

		result.set(regionId, {
			path: smoothPath(padded),
			labelAnchor: c
		});
	}

	return result;
}
