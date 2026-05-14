<script lang="ts">
	import { onMount } from 'svelte';
	import { CLUSTERS, clustersById, disciplineToCluster } from '$lib/data/clusters';
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
		clearSelection,
		expandedClusterId,
		expandCluster,
		collapseToOverview
	} from '$lib/stores';
	import { tooltipPosition } from '$lib/viz/core/interactions';
	import { getNodeColor, getNodeRegion, nodeOpacity, nodeRadius } from './eulerInteractions';
	import { runEulerLayout, type EulerNode } from './eulerLayout';
	import { computeHullsForRegions, type HullData } from './eulerGeometry';
	import type { TaxonomyEntry } from '$lib/models/taxonomy';

	let container: HTMLDivElement;
	let width = 900;
	let height = 680;
	let mouseX = 0;
	let mouseY = 0;

	let nodes: EulerNode[] = [];
	let hulls: Map<string, HullData> = new Map();

	type VisRegion = { id: string; label: string; color: string; isCluster: boolean };
	let visRegions: VisRegion[] = CLUSTERS.map((c) => ({
		id: c.id,
		label: c.label,
		color: c.color,
		isCluster: true
	}));

	// ── Block 1: re-layout when publications or canvas size changes ────────────
	$: {
		const pubs = $filteredPublications;
		const discs = $disciplines;
		const w = width;
		const h = height;
		if (pubs.length > 0 && w > 0 && h > 0) {
			nodes = runEulerLayout(pubs, discs, w, h);
		}
	}

	// ── Block 2: rebuild regions + hulls when nodes or expansion state changes ─
	$: {
		const expanded = $expandedClusterId;
		const discById = $disciplinesById as Map<string, TaxonomyEntry>;

		// Compute visual regions
		if (expanded === null) {
			visRegions = CLUSTERS.map((c) => ({ id: c.id, label: c.label, color: c.color, isCluster: true }));
		} else {
			const regs: VisRegion[] = [];
			for (const c of CLUSTERS) {
				if (c.id !== expanded) {
					regs.push({ id: c.id, label: c.label, color: c.color, isCluster: true });
				}
			}
			const cluster = clustersById.get(expanded);
			if (cluster) {
				for (const discId of cluster.disciplines) {
					const disc = discById.get(discId);
					if (disc) regs.push({ id: disc.id, label: disc.label, color: disc.color, isCluster: false });
				}
			}
			visRegions = regs;
		}

		// Compute hulls for the computed regions
		if (nodes.length > 0) {
			hulls = computeHullsForRegions(
				nodes,
				visRegions.map((r) => r.id),
				(n) => getNodeRegion(n, expanded, disciplineToCluster)
			);
		}
	}

	$: tooltipPos =
		$hoveredPublication && mouseX > 0 ? tooltipPosition(mouseX, mouseY, width, height) : null;

	function trackMouse(e: MouseEvent) {
		const rect = container.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
	}

	function handleHullClick(region: VisRegion) {
		if ($expandedClusterId === null && region.isCluster) {
			expandCluster(region.id);
		}
	}

	function handleSvgClick() {
		clearSelection();
		if ($expandedClusterId !== null) collapseToOverview();
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
	<!-- Breadcrumb overlay when a cluster is expanded -->
	{#if $expandedClusterId !== null}
		{@const cluster = clustersById.get($expandedClusterId)}
		<div class="breadcrumb">
			<button class="back-btn" on:click={collapseToOverview}>← All Clusters</button>
			{#if cluster}
				<span class="crumb-sep">/</span>
				<span class="crumb-label" style="color: {cluster.color}">{cluster.label}</span>
			{/if}
		</div>
	{/if}

	<svg
		{width}
		{height}
		on:click={handleSvgClick}
		on:mouseleave={() => {
			setHovered(null);
			setHoveredCategory(null);
		}}
		role="img"
		aria-label="Euler diagram of publications"
	>
		<!-- Hulls -->
		{#each visRegions as region}
			{@const hull = hulls.get(region.id)}
			{#if hull?.path}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<path
					d={hull.path}
					fill={region.color}
					fill-opacity={$hoveredCategoryId && $hoveredCategoryId !== region.id
						? 0.02
						: region.isCluster
							? 0.11
							: 0.09}
					stroke={region.color}
					stroke-width={region.isCluster ? 2.0 : 1.4}
					stroke-opacity={$hoveredCategoryId && $hoveredCategoryId !== region.id ? 0.15 : 0.55}
					stroke-linejoin="round"
					stroke-dasharray={region.isCluster ? 'none' : '6 3'}
					style={region.isCluster && $expandedClusterId === null ? 'cursor: pointer' : ''}
					on:mouseenter={() => setHoveredCategory(region.id)}
					on:mouseleave={() => setHoveredCategory(null)}
					on:click|stopPropagation={() => handleHullClick(region)}
				/>
			{/if}
		{/each}

		<!-- Publication nodes -->
		{#each nodes as node}
			{@const region = getNodeRegion(node, $expandedClusterId, disciplineToCluster)}
			{@const color = getNodeColor(node, $expandedClusterId, disciplineToCluster, $disciplinesById, clustersById)}
			{@const opacity = nodeOpacity(region, $hoveredId, node.id, $selectedIds, $hoveredCategoryId)}
			{@const r = nodeRadius(node.id, $hoveredId, $selectedIds)}
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
					setHoveredCategory(region);
					trackMouse(e);
				}}
				on:mousemove={trackMouse}
				on:mouseleave={() => {
					setHovered(null);
					setHoveredCategory(null);
				}}
				on:click|stopPropagation={() => selectSingle(node.id)}
			/>
		{/each}

		<!-- Region labels -->
		{#each visRegions as region}
			{@const hull = hulls.get(region.id)}
			{#if hull?.labelAnchor}
				<text
					x={hull.labelAnchor[0]}
					y={hull.labelAnchor[1]}
					text-anchor="middle"
					dominant-baseline="middle"
					fill={region.color}
					font-size={region.isCluster ? 13 : 10}
					font-weight={region.isCluster ? 600 : 400}
					font-family="'JetBrains Mono', 'Fira Mono', monospace"
					letter-spacing="0.03em"
					opacity={$hoveredCategoryId && $hoveredCategoryId !== region.id ? 0.2 : 0.88}
					pointer-events="none"
				>
					{region.label}
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
			<p class="tt-meta">{[pub.year, pub.venue].filter(Boolean).join(' · ')}</p>
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

	/* ── Breadcrumb ── */
	.breadcrumb {
		position: absolute;
		top: 0.9rem;
		left: 1rem;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		z-index: 10;
		pointer-events: none;
	}

	.back-btn {
		pointer-events: all;
		font-family: 'JetBrains Mono', 'Fira Mono', monospace;
		font-size: 0.7rem;
		padding: 0.22rem 0.55rem;
		border: 1px solid #ccc;
		border-radius: 3px;
		background: rgba(255, 255, 252, 0.92);
		color: #555;
		cursor: pointer;
		transition: background 0.1s, color 0.1s;
	}

	.back-btn:hover {
		background: #f0efeb;
		color: #222;
	}

	.crumb-sep {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem;
		color: #bbb;
	}

	.crumb-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem;
		font-weight: 600;
	}

	/* ── Tooltip ── */
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
