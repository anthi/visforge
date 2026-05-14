import { curveCatmullRomClosed, line, polygonCentroid, polygonHull } from 'd3';
import { expandPolygon, pointsCentroid } from '$lib/viz/core/geometry';
import type { EulerNode } from './eulerLayout';

const HULL_PADDING = 26; // px outward expansion from centroid

const smoothPath = line<[number, number]>()
	.x((d) => d[0])
	.y((d) => d[1])
	.curve(curveCatmullRomClosed.alpha(0.5));

export type HullData = {
	path: string | null;
	labelAnchor: [number, number] | null;
};

export function computeHulls(nodes: EulerNode[], categoryIds: string[]): Map<string, HullData> {
	const result = new Map<string, HullData>();

	for (const catId of categoryIds) {
		const pts = nodes
			.filter((n) => n.publication.categories.includes(catId))
			.map((n): [number, number] => [n.x, n.y]);

		if (pts.length === 0) {
			result.set(catId, { path: null, labelAnchor: null });
			continue;
		}

		// Fewer than 3 points — no polygon, still record centroid for label
		if (pts.length < 3) {
			result.set(catId, { path: null, labelAnchor: pointsCentroid(pts) });
			continue;
		}

		const hull = polygonHull(pts);
		if (!hull) {
			result.set(catId, { path: null, labelAnchor: pointsCentroid(pts) });
			continue;
		}

		const c = polygonCentroid(hull) as [number, number];
		const padded = expandPolygon(hull as [number, number][], c, HULL_PADDING);

		result.set(catId, {
			path: smoothPath(padded),
			labelAnchor: c
		});
	}

	return result;
}
