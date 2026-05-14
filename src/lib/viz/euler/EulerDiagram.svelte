<script lang="ts">
	import { onMount } from 'svelte';
	import {
		disciplines,
		disciplinesById,
		filteredPublications,
		hoveredId,
		hoveredCategoryId,
		hoveredPublication,
		selectedIds,
		setHovered,
		setHoveredCategory,
		selectSingle,
		clearSelection
	} from '$lib/stores';
	import { publicationColor } from '$lib/viz/core/colors';
	import { tooltipPosition } from '$lib/viz/core/interactions';
	import { nodeOpacity, nodeRadius } from './eulerInteractions';
	import { runEulerLayout, type EulerNode } from './eulerLayout';
	import { computeHulls, type HullData } from './eulerGeometry';

	let container: HTMLDivElement;
	let width = 900;
	let height = 680;
	let mouseX = 0;
	let mouseY = 0;

	let nodes: EulerNode[] = [];
	let hulls: Map<string, HullData> = new Map();

	$: {
		const pubs = $filteredPublications;
		const discs = $disciplines;
		const w = width;
		const h = height;
		if (pubs.length > 0 && w > 0 && h > 0) {
			nodes = runEulerLayout(pubs, discs, w, h);
			hulls = computeHulls(nodes, discs.map((d) => d.id));
		}
	}

	$: tooltipPos =
		$hoveredPublication && mouseX > 0
			? tooltipPosition(mouseX, mouseY, width, height)
			: null;

	function trackMouse(e: MouseEvent) {
		const rect = container.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
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

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="euler-container" bind:this={container}>
	<svg
		{width}
		{height}
		on:click={clearSelection}
		on:mouseleave={() => { setHovered(null); setHoveredCategory(null); }}
		role="img"
		aria-label="Euler diagram of publications"
	>
		<!-- Hull fills -->
		{#each $disciplines as disc}
			{@const hull = hulls.get(disc.id)}
			{#if hull?.path}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<path
					d={hull.path}
					fill={disc.color}
					fill-opacity={$hoveredCategoryId && $hoveredCategoryId !== disc.id ? 0.03 : 0.10}
					stroke={disc.color}
					stroke-width="1.5"
					stroke-opacity={$hoveredCategoryId && $hoveredCategoryId !== disc.id ? 0.18 : 0.55}
					stroke-linejoin="round"
					on:mouseenter={() => setHoveredCategory(disc.id)}
					on:mouseleave={() => setHoveredCategory(null)}
				/>
			{/if}
		{/each}

		<!-- Publication nodes -->
		{#each nodes as node}
			{@const color = publicationColor(node.publication.disciplines, $disciplinesById)}
			{@const opacity = nodeOpacity(node, $hoveredId, $selectedIds, $hoveredCategoryId)}
			{@const r = nodeRadius(node, $hoveredId, $selectedIds)}
			{@const isSelected = $selectedIds.has(node.id)}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<circle
				cx={node.x}
				cy={node.y}
				{r}
				fill={color}
				fill-opacity={opacity}
				stroke={isSelected ? '#1a1a1a' : '#fff'}
				stroke-width={isSelected ? 1.5 : 0.8}
				style="cursor: pointer;"
				on:mouseenter={(e) => {
					setHovered(node.id);
					setHoveredCategory(node.publication.disciplines[0] ?? null);
					trackMouse(e);
				}}
				on:mousemove={trackMouse}
				on:mouseleave={() => {
					setHovered(null);
					setHoveredCategory(null);
				}}
				on:click={(e) => {
					e.stopPropagation();
					selectSingle(node.id);
				}}
			/>
		{/each}

		<!-- Discipline labels -->
		{#each $disciplines as disc}
			{@const hull = hulls.get(disc.id)}
			{#if hull?.labelAnchor}
				<text
					x={hull.labelAnchor[0]}
					y={hull.labelAnchor[1]}
					text-anchor="middle"
					dominant-baseline="middle"
					fill={disc.color}
					font-size="11"
					font-family="'JetBrains Mono', 'Fira Mono', monospace"
					letter-spacing="0.02em"
					opacity={$hoveredCategoryId && $hoveredCategoryId !== disc.id ? 0.2 : 0.85}
					pointer-events="none"
				>
					{disc.label}
				</text>
			{/if}
		{/each}
	</svg>

	<!-- Tooltip -->
	{#if $hoveredPublication && tooltipPos}
		{@const pub = $hoveredPublication}
		<div class="tooltip" style="left: {tooltipPos.x}px; top: {tooltipPos.y}px;">
			<p class="tt-title">{pub.title}</p>
			<p class="tt-byline">
				{pub.authors
					.slice(0, 2)
					.map((a) => a.name)
					.join(', ')}{pub.authors.length > 2 ? ' et al.' : ''}
			</p>
			<p class="tt-meta">
				{[pub.year, pub.venue].filter(Boolean).join(' · ')}
			</p>
			<div class="tt-tags">
				{#each pub.disciplines as discId}
					{@const disc = $disciplinesById.get(discId)}
					{#if disc}
						<span class="tt-tag" style="--c: {disc.color}">{disc.label}</span>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
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

	.tooltip {
		position: absolute;
		pointer-events: none;
		width: 248px;
		background: rgba(255, 255, 252, 0.96);
		border: 1px solid #e0ddd8;
		border-radius: 5px;
		padding: 0.65rem 0.8rem 0.6rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.09);
		z-index: 10;
	}

	.tt-title {
		margin: 0 0 0.3rem;
		font-size: 0.73rem;
		font-weight: 600;
		color: #1a1a1a;
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.tt-byline {
		margin: 0 0 0.18rem;
		font-size: 0.68rem;
		color: #555;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tt-meta {
		margin: 0 0 0.4rem;
		font-size: 0.66rem;
		color: #888;
	}

	.tt-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.tt-tag {
		font-size: 0.6rem;
		padding: 0.15rem 0.4rem;
		border-radius: 2px;
		border: 1px solid var(--c);
		color: var(--c);
		white-space: nowrap;
	}
</style>
