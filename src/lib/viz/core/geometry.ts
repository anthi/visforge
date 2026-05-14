export function expandPolygon(
	points: [number, number][],
	centroid: [number, number],
	padding: number
): [number, number][] {
	return points.map(([x, y]) => {
		const dx = x - centroid[0];
		const dy = y - centroid[1];
		const len = Math.hypot(dx, dy);
		return len > 0 ? [x + (dx / len) * padding, y + (dy / len) * padding] : [x, y];
	});
}

export function pointsCentroid(points: [number, number][]): [number, number] {
	const n = points.length;
	if (n === 0) return [0, 0];
	const [sx, sy] = points.reduce(([ax, ay], [x, y]) => [ax + x, ay + y], [0, 0]);
	return [sx / n, sy / n];
}
