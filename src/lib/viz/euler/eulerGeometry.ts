import { curveCatmullRomClosed, line, polygonCentroid, polygonHull } from 'd3';
import { expandPolygon, pointsCentroid } from '$lib/viz/core/geometry';
import type { EulerNode } from './eulerLayout';

const HULL_PADDING = 26;

const smoothPath = line<[number, number]>()
	.x((d) => d[0])
	.y((d) => d[1])
	.curve(curveCatmullRomClosed.alpha(0.5));

export type HullData = {
	path: string | null;
	labelAnchor: [number, number] | null;
};

export function computeHulls(nodes: EulerNode[], groupIds: string[]): Map<string, HullData> {
	const result = new Map<string, HullData>();

	for (const groupId of groupIds) {
		const pts = nodes
			.filter((n) => n.publication.disciplines.includes(groupId))
			.map((n): [number, number] => [n.x, n.y]);

		if (pts.length === 0) {
			result.set(groupId, { path: null, labelAnchor: null });
			continue;
		}

		if (pts.length < 3) {
			result.set(groupId, { path: null, labelAnchor: pointsCentroid(pts) });
			continue;
		}

		const hull = polygonHull(pts);
		if (!hull) {
			result.set(groupId, { path: null, labelAnchor: pointsCentroid(pts) });
			continue;
		}

		const c = polygonCentroid(hull) as [number, number];
		const padded = expandPolygon(hull as [number, number][], c, HULL_PADDING);

		result.set(groupId, {
			path: smoothPath(padded),
			labelAnchor: c
		});
	}

	return result;
}
