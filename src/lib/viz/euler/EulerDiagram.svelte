<script lang="ts">
	import { onMount } from 'svelte';
	import { filteredPublications, disciplines } from '$lib/stores';
	import { clustersById, disciplineToCluster } from '$lib/data/clusters';
	import { runEulerLayout, type EulerNode } from './eulerLayout';
	import { computeClusterContours, computeBridgeContours, type RegionContour } from './eulerContours';

	let container: HTMLDivElement;
	let width = 900;
	let height = 680;

	let nodes: EulerNode[] = [];
	let clusterContours: RegionContour[] = [];
	let bridgeContours: RegionContour[] = [];

	$: {
		const pubs = $filteredPublications;
		const discs = $disciplines;
		const w = width;
		const h = height;
		if (pubs.length > 0 && w > 0 && h > 0) {
			nodes = runEulerLayout(pubs, discs, w, h);
			clusterContours = computeClusterContours(nodes, w, h);
			bridgeContours = computeBridgeContours(nodes, w, h);
		}
	}

	function nodeColor(node: EulerNode): string {
		const primaryDisc = node.publication.disciplines[0] ?? '';
		const clusterId = disciplineToCluster.get(primaryDisc) ?? '';
		return clustersById.get(clusterId)?.color ?? '#888888';
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

		<!-- Cluster labels — placed above the contour bounding box -->
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

		<!-- Bridge labels — smaller, placed above the band bounding box -->
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
