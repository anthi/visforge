<script lang="ts">
	import { onMount } from 'svelte';
	import { categories, categoriesById, filteredPublications } from '$lib/stores';
	import { publicationColor } from '$lib/viz/core/colors';
	import { runEulerLayout, type EulerNode } from './eulerLayout';
	import { computeHulls, type HullData } from './eulerGeometry';

	let container: HTMLDivElement;
	let width = 900;
	let height = 680;

	let nodes: EulerNode[] = [];
	let hulls: Map<string, HullData> = new Map();

	// Recompute whenever filtered data or dimensions change
	$: {
		const pubs = $filteredPublications;
		const cats = $categories;
		const w = width;
		const h = height;
		if (pubs.length > 0 && w > 0 && h > 0) {
			nodes = runEulerLayout(pubs, cats, w, h);
			hulls = computeHulls(nodes, cats.map((c) => c.id));
		}
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
	<svg {width} {height}>
		<!-- Hull fills — rendered back-to-front so smaller hulls appear on top -->
		{#each $categories as cat}
			{@const hull = hulls.get(cat.id)}
			{#if hull?.path}
				<path
					d={hull.path}
					fill={cat.color}
					fill-opacity="0.10"
					stroke={cat.color}
					stroke-width="1.5"
					stroke-opacity="0.55"
					stroke-linejoin="round"
				/>
			{/if}
		{/each}

		<!-- Publication nodes -->
		{#each nodes as node}
			{@const color = publicationColor(node.publication.categories, $categoriesById)}
			<circle
				cx={node.x}
				cy={node.y}
				r={4.5}
				fill={color}
				fill-opacity="0.72"
				stroke="#fff"
				stroke-width="0.8"
			/>
		{/each}

		<!-- Category labels — above nodes so they read clearly -->
		{#each $categories as cat}
			{@const hull = hulls.get(cat.id)}
			{#if hull?.labelAnchor}
				<text
					x={hull.labelAnchor[0]}
					y={hull.labelAnchor[1]}
					text-anchor="middle"
					dominant-baseline="middle"
					fill={cat.color}
					font-size="11"
					font-family="'JetBrains Mono', 'Fira Mono', monospace"
					letter-spacing="0.02em"
					opacity="0.85"
					pointer-events="none"
				>
					{cat.label}
				</text>
			{/if}
		{/each}
	</svg>
</div>

<style>
	.euler-container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fafaf8;
	}

	svg {
		display: block;
	}
</style>
