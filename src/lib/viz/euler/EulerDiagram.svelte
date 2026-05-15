<script lang="ts">
	import { onMount } from 'svelte';
	import { filteredPublications, disciplines, hoveredId, hoveredPublication, setHovered, hoveredCategoryId, setHoveredCategory, clusterCounts, selectedIds, selectSingle, selectedPublications, currentLens } from '$lib/stores';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { disciplineToCluster, getDotColor, CLUSTER_COLORS } from '$lib/data/clusters';
	import Tooltip from '$lib/ui/Tooltip.svelte';
	import DetailsPanel from './DetailsPanel.svelte';

	/** Per-cluster visual opacity (0–1). Passed from page; defaults to fully opaque. */
	export let clusterOpacities: Record<string, number> = {};
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

	function interpPositions(a: Record<string, [number, number]>, b: Record<string, [number, number]>) {
		return (t: number): Record<string, [number, number]> => {
			const result: Record<string, [number, number]> = {};
			for (const id of Object.keys(b)) {
				const [bx, by] = b[id];
				const [ax, ay] = a[id] ?? b[id];
				result[id] = [ax + (bx - ax) * t, ay + (by - ay) * t];
			}
			return result;
		};
	}

	const animatedPositions = tweened<Record<string, [number, number]>>({}, {
		duration: 300,
		easing: cubicOut,
		interpolate: interpPositions
	});

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

	function buildRawDiscLabels(ns: EulerNode[]): RawDiscLabel[] {
		return DISC_SPECS.flatMap((spec) => {
			const matching =
				spec.layer === 'discipline'
					? ns.filter((n) => n.publication.disciplines.includes(spec.id))
					: ns.filter((n) => n.publication.subfields.includes(spec.id));
			if (matching.length < 2) return [];

			const anchorX = matching.reduce((s, n) => s + n.x, 0) / matching.length;
			const anchorY = matching.reduce((s, n) => s + n.y, 0) / matching.length;

			let clusterId: string;
			if (spec.layer === 'discipline') {
				clusterId = disciplineToCluster.get(spec.id) ?? '';
			} else {
				const counts = new Map<string, number>();
				for (const n of matching) {
					const cId = disciplineToCluster.get(n.publication.disciplines[0] ?? '') ?? '';
					counts.set(cId, (counts.get(cId) ?? 0) + 1);
				}
				clusterId = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
			}

			const color = CLUSTER_COLORS[clusterId] ?? '#444444';
			return [{ id: spec.id, label: spec.label, anchorX, anchorY, color, clusterId }];
		});
	}

	// ─── Reactive layout ──────────────────────────────────────────────────────
	$: {
		const pubs = $filteredPublications;
		const discs = $disciplines;
		const w = width;
		const h = height;
		const lens = $currentLens;
		if (pubs.length > 0 && w > 0 && h > 0) {
			nodes = runEulerLayout(pubs, discs, w, h, lens);

			const posMap: Record<string, [number, number]> = {};
			for (const n of nodes) posMap[n.id] = [n.x, n.y];
			animatedPositions.set(posMap);

			clusterContours = computeClusterContours(nodes, w, h);
			bridgeContours = computeBridgeContours(nodes, w, h);

			const clusterPolygons = new Map(clusterContours.map((c) => [c.id, c.coordinates]));
			discLabels = placeDiscLabels(buildRawDiscLabels(nodes), nodes, clusterPolygons, w, h);
		}
	}

	function nodeColor(node: EulerNode): string {
		return getDotColor(node.publication);
	}

	function nodeCluster(node: EulerNode): string {
		return disciplineToCluster.get(node.publication.disciplines[0] ?? '') ?? 'formal';
	}

	function clusterOp(id: string): number {
		return clusterOpacities[id] ?? 1;
	}

	// Map disc label id → cluster id (for opacity lookup)
	const DISC_CLUSTER: Record<string, string> = Object.fromEntries(
		DISC_SPECS.map((s) => [s.id, s.layer === 'discipline' ? (disciplineToCluster.get(s.id) ?? '') : ''])
	);

	function discLabelCluster(discId: string): string {
		return DISC_CLUSTER[discId] ?? '';
	}

	/** Split a label at the word boundary nearest to the string midpoint. */
	function splitLabel(label: string): [string, string] {
		const mid = Math.floor(label.length / 2);
		let splitAt = -1;
		let bestDist = Infinity;
		for (let i = 0; i < label.length; i++) {
			if (label[i] === ' ') {
				const dist = Math.abs(i - mid);
				if (dist < bestDist) { bestDist = dist; splitAt = i; }
			}
		}
		if (splitAt < 0) return [label.slice(0, mid), label.slice(mid)];
		return [label.slice(0, splitAt), label.slice(splitAt + 1)];
	}

	// ─── Hover / tooltip ─────────────────────────────────────────────────────
	let tooltipX = 0;
	let tooltipY = 0;
	let panelX = 0;
	let panelY = 0;

	/** Primary discipline of the currently hovered publication (for dot highlight logic). */
	$: hoveredDisc = $hoveredPublication?.disciplines[0] ?? null;

	// Cluster hover badge position
	let clusterBadgePos: { x: number; y: number; label: string } | null = null;

	function handleDotEnter(e: PointerEvent, node: EulerNode) {
		setHovered(node.id);
		const rect = container.getBoundingClientRect();
		const cx = e.clientX - rect.left;
		const cy = e.clientY - rect.top;
		tooltipX = cx < width / 2 ? cx + 18 : cx - 228;
		tooltipY = Math.max(8, Math.min(cy - 50, height - 140));
	}

	function handleDotLeave() {
		setHovered(null);
	}

	function handleDotClick(node: EulerNode) {
		// Record panel anchor at the dot's SVG coordinate
		panelX = node.x;
		panelY = node.y;
		selectSingle(node.id);
	}

	function handleClusterEnter(region: RegionContour) {
		setHoveredCategory(region.id);
		// Badge appears just below the cluster label
		clusterBadgePos = {
			x: region.labelPos[0],
			y: region.labelPos[1] + 18,
			label: String($clusterCounts[region.id] ?? 0) + ' papers'
		};
	}

	function handleClusterLeave() {
		setHoveredCategory(null);
		clusterBadgePos = null;
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
	<Tooltip pub={$hoveredPublication} x={tooltipX} y={tooltipY} />
	<DetailsPanel
		pub={$selectedPublications[0] ?? null}
		x={panelX}
		y={panelY}
		containerWidth={width}
		containerHeight={height}
	/>
	<svg {width} {height} role="img" aria-label="Euler diagram of decision making publications">

		<!-- Layer 1: Cluster region contours -->
		{#each clusterContours as region}
			{@const op = clusterOp(region.id)}
			{@const isHoveredCluster = $hoveredCategoryId === region.id}
			<path
				d={region.path}
				fill={region.color}
				fill-opacity={isHoveredCluster ? 0.18 * op : 0.10 * op}
				stroke={region.color}
				stroke-width={isHoveredCluster ? 2.5 : 2.0}
				stroke-opacity={isHoveredCluster ? 0.75 * op : 0.50 * op}
				stroke-linejoin="round"
				style="cursor:default"
				on:pointerenter={() => handleClusterEnter(region)}
				on:pointerleave={handleClusterLeave}
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
			{@const isHovered = node.id === $hoveredId}
			{@const nc = nodeCluster(node)}
			{@const dotOp = (() => {
				if ($hoveredId !== null) {
					// dot hover takes priority
					return node.publication.disciplines[0] !== hoveredDisc ? 0.08 : 0.85;
				}
				if ($hoveredCategoryId !== null) {
					// cluster hover: highlight cluster, dim others
					return nc === $hoveredCategoryId ? 0.75 : 0.10;
				}
				return 0.40 * clusterOp(nc);
			})()}
			{@const ap = $animatedPositions[node.id]}
			{@const ax = ap ? ap[0] : node.x}
			{@const ay = ap ? ap[1] : node.y}
			<circle
				cx={ax}
				cy={ay}
				r={isHovered ? 6 : 4}
				fill={nodeColor(node)}
				fill-opacity={dotOp}
				style="cursor:pointer"
				on:pointerenter={(e) => handleDotEnter(e, { ...node, x: ax, y: ay })}
				on:pointerleave={handleDotLeave}
				on:click={() => handleDotClick({ ...node, x: ax, y: ay })}
			/>
		{/each}

		<!-- Cluster labels — ray-cast to whitespace outside cluster boundary -->
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
				opacity={0.88 * clusterOp(region.id)}
				pointer-events="none"
			>
				{region.label}
			</text>
		{/each}

		<!-- Cluster count badge (shown on cluster hover) -->
		{#if clusterBadgePos}
			<text
				x={clusterBadgePos.x}
				y={clusterBadgePos.y}
				text-anchor="middle"
				dominant-baseline="middle"
				font-size={10}
				font-family="'JetBrains Mono', 'Fira Mono', monospace"
				fill="#555"
				opacity={0.8}
				pointer-events="none"
			>{clusterBadgePos.label}</text>
		{/if}

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

		<!-- Discipline sub-labels — 10px, 60% opacity, subordinate to cluster labels -->
		{#each discLabels as dl}
			{@const dlOp = clusterOp(discLabelCluster(dl.id))}
			<text
				x={dl.x}
				y={dl.y}
				text-anchor="middle"
				dominant-baseline="middle"
				fill={dl.color}
				font-size={9}
				font-weight={400}
				font-family="'JetBrains Mono', 'Fira Mono', monospace"
				letter-spacing="0.02em"
				fill-opacity={0.60 * dlOp}
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
