import { forceCollide, forceSimulation, forceX, forceY } from 'd3';
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

// ─── Internal node type ───────────────────────────────────────────────────────

type SimNode = {
	id: string;
	label: string;
	x: number;
	y: number;
	vx: number;
	vy: number;
	fx?: number;
	fy?: number;
	nodeType: 'label' | 'obstacle';
	anchorX: number;
	anchorY: number;
	color: string;
	clusterCX: number;
	clusterCY: number;
	clusterR: number;
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Places discipline sub-labels using a d3-force simulation.
 *
 * All obstacles (dot positions + cluster/bridge boundary samples) are added
 * as fixed nodes. Labels are pulled toward their dot centroid via forceX/Y
 * (strength 0.3) and repelled from all obstacles and each other via
 * forceCollide (radius 40px for labels, 6px for obstacles).
 * The simulation runs 300 ticks synchronously before any rendering.
 */
export function placeDiscLabels(
	rawLabels: RawDiscLabel[],
	allNodes: EulerNode[],
	_canvasWidth: number,
	_canvasHeight: number,
	obstaclePoints: [number, number][]
): PlacedLabel[] {
	if (rawLabels.length === 0) return [];

	// Label nodes — movable
	const labelNodes: SimNode[] = rawLabels.map((spec) => ({
		id: spec.id,
		label: spec.label,
		x: spec.anchorX,
		y: spec.anchorY,
		vx: 0,
		vy: 0,
		nodeType: 'label' as const,
		anchorX: spec.anchorX,
		anchorY: spec.anchorY,
		color: spec.color,
		clusterCX: spec.clusterCX,
		clusterCY: spec.clusterCY,
		clusterR: spec.clusterR,
	}));

	// Dot obstacle nodes — fixed at publication positions
	const dotObstacles: SimNode[] = allNodes.map((n, i) => ({
		id: `dot_${i}`,
		label: '',
		x: n.x,
		y: n.y,
		fx: n.x,
		fy: n.y,
		vx: 0,
		vy: 0,
		nodeType: 'obstacle' as const,
		anchorX: n.x,
		anchorY: n.y,
		color: '',
		clusterCX: 0,
		clusterCY: 0,
		clusterR: 0,
	}));

	// Boundary sample obstacle nodes — fixed at sampled cluster/bridge perimeter points
	const boundaryObstacles: SimNode[] = obstaclePoints.map((pt, i) => ({
		id: `boundary_${i}`,
		label: '',
		x: pt[0],
		y: pt[1],
		fx: pt[0],
		fy: pt[1],
		vx: 0,
		vy: 0,
		nodeType: 'obstacle' as const,
		anchorX: pt[0],
		anchorY: pt[1],
		color: '',
		clusterCX: 0,
		clusterCY: 0,
		clusterR: 0,
	}));

	const allSimNodes: SimNode[] = [...labelNodes, ...dotObstacles, ...boundaryObstacles];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const sim = forceSimulation<any>(allSimNodes)
		// Pull labels toward their dot centroid; zero force on fixed obstacle nodes
		.force(
			'x',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			forceX<any>((d) => d.anchorX).strength((d: SimNode) => d.nodeType === 'label' ? 0.3 : 0)
		)
		.force(
			'y',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			forceY<any>((d) => d.anchorY).strength((d: SimNode) => d.nodeType === 'label' ? 0.3 : 0)
		)
		// Labels repel from each other and all obstacles
		.force(
			'collide',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			forceCollide<any>((d: SimNode) => d.nodeType === 'label' ? 40 : 6)
				.strength(1.0)
				.iterations(3)
		)
		.stop();

	// Run all ticks synchronously — labels are not rendered until this completes
	for (let i = 0; i < 300; i++) sim.tick();

	return labelNodes.map((n) => ({
		id: n.id,
		label: n.label,
		x: n.x,
		y: n.y,
		color: n.color,
	}));
}
