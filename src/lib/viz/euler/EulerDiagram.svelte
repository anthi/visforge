<script lang="ts">
	import { onMount } from 'svelte';
	import { filteredPublications, disciplines } from '$lib/stores';
	import { disciplineToCluster, getDotColor, CLUSTER_COLORS } from '$lib/data/clusters';

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
		if (pubs.length > 0 && w > 0 && h > 0) {
			nodes = runEulerLayout(pubs, discs, w, h);
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
			{@const op = clusterOp(region.id)}
			<path
				d={region.path}
				fill={region.color}
				fill-opacity={0.10 * op}
				stroke={region.color}
				stroke-width={2.0}
				stroke-opacity={0.50 * op}
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
				fill-opacity={0.40 * clusterOp(nodeCluster(node))}
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

		<!-- Discipline sub-labels — ray-cast inside cluster polygon, 55% opacity -->
		{#each discLabels as dl}
			{@const dlOp = clusterOp(discLabelCluster(dl.id))}
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
				fill-opacity={0.55 * dlOp}
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
