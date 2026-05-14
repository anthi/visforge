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

// ─── Public API ───────────────────────────────────────────────────────────────

const GRID_COLS = 20;
const GRID_ROWS = 20;

/**
 * Places discipline sub-labels using a 20×20 occupancy grid.
 *
 * Each cell accumulates: dot count + boundary sample count.
 * For each label, we find the lowest-occupancy cell within the cluster radius
 * that is also closest to the anchor centroid, then place the label at cell center.
 * Placed labels increment their cell so subsequent labels avoid the same spot.
 * Fully deterministic — no simulation.
 */
export function placeDiscLabels(
	rawLabels: RawDiscLabel[],
	allNodes: EulerNode[],
	canvasWidth: number,
	canvasHeight: number,
	obstaclePoints: [number, number][]
): PlacedLabel[] {
	if (rawLabels.length === 0) return [];

	const cellW = canvasWidth / GRID_COLS;
	const cellH = canvasHeight / GRID_ROWS;

	// Build occupancy grid from dots and boundary samples
	const grid = new Float32Array(GRID_COLS * GRID_ROWS);

	const cellOf = (x: number, y: number): number => {
		const col = Math.max(0, Math.min(GRID_COLS - 1, Math.floor(x / cellW)));
		const row = Math.max(0, Math.min(GRID_ROWS - 1, Math.floor(y / cellH)));
		return row * GRID_COLS + col;
	};

	for (const n of allNodes) grid[cellOf(n.x, n.y)] += 1;
	for (const [px, py] of obstaclePoints) grid[cellOf(px, py)] += 0.5;

	// Cell center coordinates
	const cellCX = (col: number) => (col + 0.5) * cellW;
	const cellCY = (row: number) => (row + 0.5) * cellH;

	const placed: PlacedLabel[] = [];

	for (const spec of rawLabels) {
		const { anchorX, anchorY, clusterCX, clusterCY, clusterR } = spec;

		// Search all cells within cluster radius; pick lowest-occupancy + nearest anchor
		let bestIdx = -1;
		let bestScore = Infinity;

		for (let row = 0; row < GRID_ROWS; row++) {
			for (let col = 0; col < GRID_COLS; col++) {
				const cx = cellCX(col);
				const cy = cellCY(row);

				// Must be within cluster radius
				const dCluster = Math.sqrt((cx - clusterCX) ** 2 + (cy - clusterCY) ** 2);
				if (dCluster > clusterR) continue;

				const idx = row * GRID_COLS + col;
				const occupancy = grid[idx];
				const dAnchor = Math.sqrt((cx - anchorX) ** 2 + (cy - anchorY) ** 2);

				// Score: occupancy weighted heavily, tie-broken by anchor distance
				const score = occupancy * 1000 + dAnchor;
				if (score < bestScore) {
					bestScore = score;
					bestIdx = idx;
				}
			}
		}

		// Fallback to anchor if no cell found inside cluster radius
		let x = anchorX;
		let y = anchorY;

		if (bestIdx >= 0) {
			const bestCol = bestIdx % GRID_COLS;
			const bestRow = Math.floor(bestIdx / GRID_COLS);
			x = cellCX(bestCol);
			y = cellCY(bestRow);
			// Mark cell as occupied so next labels avoid it (label footprint ~ 2×2 cells)
			for (let dr = -1; dr <= 1; dr++) {
				for (let dc = -1; dc <= 1; dc++) {
					const r = bestRow + dr;
					const c = bestCol + dc;
					if (r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS) {
						grid[r * GRID_COLS + c] += 5;
					}
				}
			}
		}

		placed.push({ id: spec.id, label: spec.label, x, y, color: spec.color });
	}

	return placed;
}
