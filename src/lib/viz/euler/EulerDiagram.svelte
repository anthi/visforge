<script lang="ts">
	import { onMount } from 'svelte';
	import { filteredPublications, disciplines } from '$lib/stores';
	import { clustersById, disciplineToCluster, getDotColor, CLUSTER_COLORS } from '$lib/data/clusters';
	import { disciplinesById, subfieldsById } from '$lib/data/taxonomy';
	import { runEulerLayout, type EulerNode } from './eulerLayout';
	import { computeClusterContours, computeBridgeContours, type RegionContour } from './eulerContours';
	import { placeDiscLabels, type PlacedLabel, type RawDiscLabel } from './labelPlacement';

	let container: HTMLDivElement;
	let width = 900;
	let height = 680;

	let nodes: EulerNode[] = [];
	let clusterContours: RegionContour[] = [];
	let bridgeContours: RegionContour[] = [];
	let discLabels: PlacedLabel[] = [];

	// ─── Discipline sub-label specs ───────────────────────────────────────────
	const DISC_SPECS: { id: string; label: string; layer: 'discipline' | 'subfield' }[] = [
		{ id: 'information_visualization', label: 'Information Visualization', layer: 'discipline' },
		{ id: 'hci',                        label: 'HCI',                        layer: 'discipline' },
		{ id: 'psychology',                 label: 'Psychology',                 layer: 'discipline' },
		{ id: 'economics',                  label: 'Economics',                  layer: 'discipline' },
		{ id: 'statistics',                 label: 'Statistics',                 layer: 'discipline' },
		{ id: 'decision_theory',            label: 'Decision Theory',            layer: 'subfield'   },
		{ id: 'management_science',         label: 'Management Science',         layer: 'discipline' },
		{ id: 'neuroscience',               label: 'Neuroscience',               layer: 'discipline' },
		{ id: 'cognitive_science',          label: 'Cognitive Science',          layer: 'discipline' },
		{ id: 'philosophy',                 label: 'Philosophy',                 layer: 'discipline' },
		{ id: 'operations_research',        label: 'Operations Research',        layer: 'discipline' },
		{ id: 'artificial_intelligence',    label: 'AI',                         layer: 'discipline' },
		{ id: 'sociology',                  label: 'Sociology',                  layer: 'discipline' },
	];

	/** Build raw placement specs by computing per-discipline centroids and cluster stats. */
	function buildRawDiscLabels(ns: EulerNode[]): RawDiscLabel[] {
		// Cluster centroids and 85th-percentile radii from actual node positions
		const clusterBuckets = new Map<string, EulerNode[]>();
		for (const n of ns) {
			const cId = disciplineToCluster.get(n.publication.disciplines[0] ?? '') ?? '';
			if (!clusterBuckets.has(cId)) clusterBuckets.set(cId, []);
			clusterBuckets.get(cId)!.push(n);
		}

		const clusterStats = new Map<string, { cx: number; cy: number; r: number }>();
		for (const [cId, cnodes] of clusterBuckets) {
			const cx = cnodes.reduce((s, n) => s + n.x, 0) / cnodes.length;
			const cy = cnodes.reduce((s, n) => s + n.y, 0) / cnodes.length;
			const dists = cnodes
				.map((n) => Math.sqrt((n.x - cx) ** 2 + (n.y - cy) ** 2))
				.sort((a, b) => a - b);
			// 85th percentile × 1.1 gives a generous but bounded cluster territory
			const r = (dists[Math.floor(dists.length * 0.85)] ?? dists[dists.length - 1]) * 1.1;
			clusterStats.set(cId, { cx, cy, r });
		}

		return DISC_SPECS.flatMap((spec) => {
			const matching =
				spec.layer === 'discipline'
					? ns.filter((n) => n.publication.disciplines.includes(spec.id))
					: ns.filter((n) => n.publication.subfields.includes(spec.id));
			if (matching.length < 2) return [];

			const anchorX = matching.reduce((s, n) => s + n.x, 0) / matching.length;
			const anchorY = matching.reduce((s, n) => s + n.y, 0) / matching.length;

			// For subfields, find the dominant cluster among matching nodes
			let clusterId: string;
			if (spec.layer === 'discipline') {
				clusterId = disciplineToCluster.get(spec.id) ?? '';
			} else {
				const counts = new Map<string, number>();
				for (const n of matching) {
					const cId = disciplineToCluster.get(n.publication.disciplines[0] ?? '') ?? '';
					counts.set(cId, (counts.get(cId) ?? 0) + 1);
				}
				clusterId =
					[...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
			}

			const stats = clusterStats.get(clusterId) ?? { cx: anchorX, cy: anchorY, r: 120 };
			const color =
				disciplinesById.get(spec.id)?.color ??
				subfieldsById.get(spec.id)?.color ??
				CLUSTER_COLORS[clusterId] ??
				'#444444';

			return [
				{
					id: spec.id,
					label: spec.label,
					anchorX,
					anchorY,
					color,
					clusterCX: stats.cx,
					clusterCY: stats.cy,
					clusterR: stats.r
				}
			];
		});
	}

	// ─── Reactive layout ──────────────────────────────────────────────────────
	$: {
		const pubs = $filteredPublications;
		const discs = $disciplines;
		const w = width;
		const h = height;
		if (pubs.length > 0 && w > 0 && h > 0) {
			nodes = runEulerLayout(pubs, discs, w, h);
			clusterContours = computeClusterContours(nodes, w, h);
			bridgeContours = computeBridgeContours(nodes, w, h);

			// Collect all boundary sample points as label-placement obstacles
			const obstaclePoints: [number, number][] = [
				...clusterContours.flatMap((c) => c.boundaryPoints),
				...bridgeContours.flatMap((b) => b.boundaryPoints),
			];

			// Labels are not rendered until placeDiscLabels completes its 300 ticks
			discLabels = placeDiscLabels(buildRawDiscLabels(nodes), nodes, w, h, obstaclePoints);
		}
	}

	function nodeColor(node: EulerNode): string {
		return getDotColor(node.publication);
	}

	/** Split label at nearest-midpoint word boundary. Returns [line1, line2]. */
	function splitLabel(label: string): [string, string] {
		const mid = Math.floor(label.length / 2);
		const spacesBefore = [];
		const spacesAfter = [];
		for (let i = mid; i >= 0; i--) if (label[i] === ' ') { spacesBefore.push(i); break; }
		for (let i = mid + 1; i < label.length; i++) if (label[i] === ' ') { spacesAfter.push(i); break; }
		const candidates = [...spacesBefore, ...spacesAfter];
		if (candidates.length === 0) return [label.slice(0, mid), label.slice(mid)];
		const split = candidates.reduce((a, b) =>
			Math.abs(a - mid) <= Math.abs(b - mid) ? a : b
		);
		return [label.slice(0, split), label.slice(split + 1)];
	}

	onMount(() => {
		const ro = new ResizeObserver(([entry]) => {
			width = entry.contentRect.width;
			height = entry.contentRect.height;
		});
		ro.observe(container);
		return () => ro.disconnect();
	});
</script>

<div class="euler-container" bind:this={container}>
	<svg {width} {height} role="img" aria-label="Euler diagram of decision making publications">

		<!-- Layer 1: Cluster region contours -->
		{#each clusterContours as region}
			<path
				d={region.path}
				fill={region.color}
				fill-opacity={0.10}
				stroke={region.color}
				stroke-width={2.0}
				stroke-opacity={0.50}
				stroke-linejoin="round"
			/>
		{/each}

		<!-- Layer 2: Bridge band isocontours -->
		{#each bridgeContours as band}
			<path
				d={band.path}
				fill={band.color}
				fill-opacity={0.07}
				stroke={band.color}
				stroke-width={1.4}
				stroke-opacity={0.42}
				stroke-linejoin="round"
				stroke-dasharray="5 3"
			/>
		{/each}

		<!-- Layer 3: Publication dots -->
		{#each nodes as node}
			<circle
				cx={node.x}
				cy={node.y}
				r={4}
				fill={nodeColor(node)}
				fill-opacity={0.40}
			/>
		{/each}

		<!-- Cluster labels — pushed outward from canvas center, clamped to viewport -->
		{#each clusterContours as region}
			<text
				x={region.labelPos[0]}
				y={region.labelPos[1]}
				text-anchor="middle"
				dominant-baseline="middle"
				fill={region.color}
				font-size={13}
				font-weight={600}
				font-family="'JetBrains Mono', 'Fira Mono', monospace"
				letter-spacing="0.04em"
				opacity={0.88}
				pointer-events="none"
			>
				{region.label}
			</text>
		{/each}

		<!-- Bridge labels -->
		{#each bridgeContours as band}
			<text
				x={band.labelPos[0]}
				y={band.labelPos[1]}
				text-anchor="middle"
				dominant-baseline="middle"
				fill={band.color}
				font-size={9}
				font-weight={500}
				font-family="'JetBrains Mono', 'Fira Mono', monospace"
				letter-spacing="0.03em"
				opacity={0.72}
				pointer-events="none"
			>
				{band.label}
			</text>
		{/each}

		<!-- Discipline sub-labels — grid-placed within cluster regions, 55% opacity -->
		{#each discLabels as dl}
			<text
				x={dl.x}
				y={dl.y}
				text-anchor="middle"
				dominant-baseline="middle"
				fill={dl.color}
				font-size={10}
				font-weight={400}
				font-family="'JetBrains Mono', 'Fira Mono', monospace"
				letter-spacing="0.02em"
				fill-opacity={0.55}
				pointer-events="none"
			>
				{#if dl.label.length > 12}
					{@const [l1, l2] = splitLabel(dl.label)}
					<tspan x={dl.x} dy="-6.5">{l1}</tspan>
					<tspan x={dl.x} dy="13">{l2}</tspan>
				{:else}
					{dl.label}
				{/if}
			</text>
		{/each}

	</svg>
</div>

<style>
	.euler-container {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fafaf8;
	}

	svg {
		display: block;
	}
</style>
