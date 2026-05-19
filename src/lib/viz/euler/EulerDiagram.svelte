<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { filteredPublications, fields, hoveredId, hoveredPublication, setHovered, hoveredCategoryId, setHoveredCategory, clusterCounts, selectedIds, selectSingle, selectedPublications, currentLens, allDerivedAuthors, visibleAuthors, searchQuery, clearSelection } from '$lib/stores';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fieldToCluster, getDotColor, CLUSTER_COLORS, CLASSIFICATION2_COLORS } from '$lib/data/clusters';
	import { lookupTaxonomy } from '$lib/data/taxonomy';
	import Tooltip from '$lib/ui/Tooltip.svelte';
	import DetailsPanel from './DetailsPanel.svelte';

	/** Per-cluster visual opacity (0–1). Passed from page; defaults to fully opaque. */
	export let clusterOpacities: Record<string, number> = {};
	import { runEulerLayout, runAuthorLayout, type EulerNode, type AuthorNode } from './eulerLayout';
	import { computeClusterContours, computeBridgeContours, type RegionContour } from './eulerContours';
	import { placeDiscLabels, type PlacedLabel, type RawFieldLabel } from './labelPlacement';

	let container: HTMLDivElement;
	let width = 900;
	let height = 680;

	let nodes: EulerNode[] = [];
	// All author nodes (full layout — stable across prominence slider changes)
	let allAuthorNodes: AuthorNode[] = [];
	let clusterContours: RegionContour[] = [];
	let bridgeContours: RegionContour[] = [];
	let fieldLabels: PlacedLabel[] = [];

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

	const authorAnimatedPositions = tweened<Record<string, [number, number]>>({}, {
		duration: 300,
		easing: cubicOut,
		interpolate: interpPositions
	});

	// ─── Field sub-label specs ───────────────────────────────────────────
	const FIELD_SPECS: { id: string; label: string; layer: 'field' | 'subfield' }[] = [
		{ id: 'information_visualization', label: 'Information Visualization', layer: 'field' },
		{ id: 'hci',                        label: 'HCI',                        layer: 'field' },
		{ id: 'psychology',                 label: 'Psychology',                 layer: 'field' },
		{ id: 'economics',                  label: 'Economics',                  layer: 'field' },
		{ id: 'statistics',                 label: 'Statistics',                 layer: 'field' },
		{ id: 'decision_theory',            label: 'Decision Theory',            layer: 'subfield'   },
		{ id: 'management_science',         label: 'Management Science',         layer: 'field' },
		{ id: 'neuroscience',               label: 'Neuroscience',               layer: 'field' },
		{ id: 'cognitive_science',          label: 'Cognitive Science',          layer: 'field' },
		{ id: 'philosophy',                 label: 'Philosophy',                 layer: 'field' },
		{ id: 'operations_research',        label: 'Operations Research',        layer: 'field' },
		{ id: 'artificial_intelligence',    label: 'AI',                         layer: 'field' },
		{ id: 'sociology',                  label: 'Sociology',                  layer: 'field' },
	];

	function buildRawFieldLabels(ns: EulerNode[]): RawFieldLabel[] {
		return FIELD_SPECS.flatMap((spec) => {
			const matching =
				spec.layer === 'field'
					? ns.filter((n) => n.publication.fields.includes(spec.id))
					: ns.filter((n) => n.publication.subfields.includes(spec.id));
			if (matching.length < 2) return [];

			const anchorX = matching.reduce((s, n) => s + n.x, 0) / matching.length;
			const anchorY = matching.reduce((s, n) => s + n.y, 0) / matching.length;

			let clusterId: string;
			if (spec.layer === 'field') {
				clusterId = fieldToCluster.get(spec.id) ?? '';
			} else {
				const counts = new Map<string, number>();
				for (const n of matching) {
					const cId = fieldToCluster.get(n.publication.fields[0] ?? '') ?? '';
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
		const discs = $fields;
		const w = width;
		const h = height;
		const lens = $currentLens;
		if (pubs.length > 0 && w > 0 && h > 0) {
			// Always run publication layout — needed for cluster contours regardless of lens
			nodes = runEulerLayout(pubs, discs, w, h, lens);

			const posMap: Record<string, [number, number]> = {};
			for (const n of nodes) posMap[n.id] = [n.x, n.y];
			animatedPositions.set(posMap);

			clusterContours = computeClusterContours(nodes, w, h);
			bridgeContours = computeBridgeContours(nodes, w, h);

			const clusterPolygons = new Map(clusterContours.map((c) => [c.id, c.coordinates]));
			fieldLabels = placeDiscLabels(buildRawFieldLabels(nodes), nodes, clusterPolygons, w, h);
		}
	}

	// Author layout: uses ALL derived authors, not just visible ones.
	// This means the prominence slider (which only changes visibleAuthors) does NOT
	// trigger a re-layout, so positions are stable while sliding.
	$: {
		const authors = $allDerivedAuthors;
		const w = width;
		const h = height;
		const lens = $currentLens;
		if (lens === 'authors' && authors.length > 0 && w > 0 && h > 0) {
			allAuthorNodes = runAuthorLayout(authors, w, h);
			const posMap: Record<string, [number, number]> = {};
			for (const n of allAuthorNodes) posMap[n.id] = [n.x, n.y];
			authorAnimatedPositions.set(posMap);
		}
	}

	// Which author IDs are currently visible (changes with prominence slider)
	$: visibleAuthorIds = new Set($visibleAuthors.map((a) => a.id));

	// Which authors to render name labels for: top 2 per cluster by withinFieldPercentile
	$: topLabelIds = (() => {
		const byCluster = new Map<string, AuthorNode[]>();
		for (const node of allAuthorNodes) {
			if (!visibleAuthorIds.has(node.id)) continue;
			const c = node.author.primaryCluster;
			const g = byCluster.get(c) ?? [];
			g.push(node);
			byCluster.set(c, g);
		}
		const ids = new Set<string>();
		for (const group of byCluster.values()) {
			group.sort((a, b) => b.author.withinFieldPercentile - a.author.withinFieldPercentile);
			for (const n of group.slice(0, 2)) ids.add(n.id);
		}
		return ids;
	})();

	// Search highlight: in authors lens, dim non-matching authors rather than filtering
	$: highlightedAuthorIds = (() => {
		if ($currentLens !== 'authors') return null;
		const q = $searchQuery.trim().toLowerCase();
		if (!q) return null;
		const ids = new Set<string>();
		for (const n of allAuthorNodes) {
			if (n.author.name.toLowerCase().includes(q)) ids.add(n.id);
		}
		return ids.size > 0 ? ids : null;
	})();

	function nodeColor(node: EulerNode): string {
		return getDotColor(node.publication);
	}

	function nodeCluster(node: EulerNode): string {
		return fieldToCluster.get(node.publication.fields[0] ?? '') ?? 'formal';
	}

	function authorColor(node: AuthorNode): string {
		return CLUSTER_COLORS[node.author.primaryCluster] ?? '#888';
	}

	function clusterOp(id: string): number {
		return clusterOpacities[id] ?? 1;
	}

	/** Returns the DO/SHOULD/COULD stroke color for a node's primary field. */
	function nodeC2Color(node: EulerNode): string {
		const entry = lookupTaxonomy(node.publication.fields[0] ?? '');
		return CLASSIFICATION2_COLORS[entry?.classification_2 ?? 'not_applicable'];
	}

	/** True when the node's primary field is an application_domain. */
	function isApplicationDomain(node: EulerNode): boolean {
		const entry = lookupTaxonomy(node.publication.fields[0] ?? '');
		return entry?.simplified_type === 'application_domain';
	}

	// Map disc label id → cluster id (for opacity lookup)
	const FIELD_CLUSTER: Record<string, string> = Object.fromEntries(
		FIELD_SPECS.map((s) => [s.id, s.layer === 'field' ? (fieldToCluster.get(s.id) ?? '') : ''])
	);

	function fieldLabelCluster(fieldId: string): string {
		return FIELD_CLUSTER[fieldId] ?? '';
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

	/** Primary field of the currently hovered publication (for dot highlight logic). */
	$: hoveredField = $hoveredPublication?.fields[0] ?? null;

	// Cluster hover badge position
	let clusterBadgePos: { x: number; y: number; label: string } | null = null;

	// Author hover state
	let hoveredAuthorId: string | null = null;
	let authorTooltip: { x: number; y: number; name: string; field: string; pubs: number } | null = null;

	// Author selection state (for cluster-context greyout in authors lens)
	let selectedAuthorId: string | null = null;

	// Map: author id → set of cluster ids they touch
	$: authorClusterMap = (() => {
		const m = new Map<string, Set<string>>();
		for (const n of allAuthorNodes) m.set(n.id, new Set(n.author.clusters));
		return m;
	})();

	// Set of author ids that share at least one cluster with the selected author
	$: selectedAuthorClusterPeers = (() => {
		if (!selectedAuthorId) return null;
		const sel = authorClusterMap.get(selectedAuthorId);
		if (!sel) return null;
		const peers = new Set<string>();
		for (const [id, clusters] of authorClusterMap) {
			for (const c of clusters) {
				if (sel.has(c)) { peers.add(id); break; }
			}
		}
		return peers;
	})();

	function handleAuthorClick(node: AuthorNode) {
		if (selectedAuthorId === node.id) {
			selectedAuthorId = null;
		} else {
			selectedAuthorId = node.id;
		}
	}

	function handleBackgroundClick() {
		selectedAuthorId = null;
		clearSelection();
	}

	// ─── Zoom ────────────────────────────────────────────────────────────────
	let svgEl: SVGSVGElement;
	let zoomTransform = 'translate(0,0) scale(1)';
	let zoomScale = 1;
	let panX = 0;
	let panY = 0;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let zoomBehavior: any = null;

	/** Viewport bounds in SVG (pre-transform) coordinates. Used for label culling. */
	$: vpMinX = -panX / zoomScale;
	$: vpMinY = -panY / zoomScale;
	$: vpMaxX = vpMinX + width / zoomScale;
	$: vpMaxY = vpMinY + height / zoomScale;

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
		panelX = node.x;
		panelY = node.y;
		selectSingle(node.id);
	}

	function handleAuthorEnter(e: PointerEvent, node: AuthorNode, ax: number, ay: number) {
		hoveredAuthorId = node.id;
		const rect = container.getBoundingClientRect();
		const cx = e.clientX - rect.left;
		const cy = e.clientY - rect.top;
		const tx = cx < width / 2 ? cx + 18 : cx - 200;
		const ty = Math.max(8, Math.min(cy - 40, height - 80));
		authorTooltip = {
			x: tx, y: ty,
			name: node.author.name,
			field: node.author.primaryField.replace(/_/g, ' '),
			pubs: node.author.pubCount
		};
	}

	function handleAuthorLeave() {
		hoveredAuthorId = null;
		authorTooltip = null;
	}

	function handleClusterEnter(region: RegionContour) {
		setHoveredCategory(region.id);
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

		// D3 zoom on the SVG, transform applied to <g id="zoom-root">
		if (svgEl) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			zoomBehavior = (d3.zoom() as any)
				.scaleExtent([0.4, 6])
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.on('zoom', (event: any) => {
					const t = event.transform;
					zoomTransform = `translate(${t.x},${t.y}) scale(${t.k})`;
					zoomScale = t.k;
					panX = t.x;
					panY = t.y;
				});
			d3.select(svgEl).call(zoomBehavior);
		}

		return () => ro.disconnect();
	});

	function resetZoom() {
		if (!svgEl || !zoomBehavior) return;
		d3.select(svgEl)
			.transition()
			.duration(300)
			.call(zoomBehavior.transform, d3.zoomIdentity);
	}

	function truncate(s: string, n: number): string {
		return s.length > n ? s.slice(0, n - 1) + '…' : s;
	}
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

	{#if authorTooltip}
		<div class="author-tooltip" style="left:{authorTooltip.x}px; top:{authorTooltip.y}px">
			<span class="author-tooltip-name">{authorTooltip.name}</span>
			<span class="author-tooltip-meta">{authorTooltip.field} · {authorTooltip.pubs} pub{authorTooltip.pubs !== 1 ? 's' : ''}</span>
		</div>
	{/if}

	<button class="reset-zoom" on:click={resetZoom} title="Reset zoom">⊙ reset</button>

	<svg
		bind:this={svgEl}
		{width}
		{height}
		role="img"
		aria-label="Euler diagram of decision making publications"
		on:click={handleBackgroundClick}
	>
		<g id="zoom-root" transform={zoomTransform}>

		<!-- Layer 1: Cluster region contours -->
		{#each clusterContours as region}
			{@const op = clusterOp(region.id)}
			{@const isHoveredCluster = $hoveredCategoryId === region.id}
			{@const isADCluster = region.isApplicationDomain}
			<path
				d={region.path}
				fill={region.color}
				fill-opacity={isHoveredCluster ? (isADCluster ? 0.10 : 0.18) * op : (isADCluster ? 0.05 : 0.10) * op}
				stroke={region.color}
				stroke-width={isHoveredCluster ? 2.0 : 1.4}
				stroke-opacity={isHoveredCluster ? 0.65 * op : (isADCluster ? 0.35 : 0.50) * op}
				stroke-dasharray={isADCluster ? '6 4' : undefined}
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

		{#if $currentLens !== 'authors'}
			<!-- Layer 3: Publication dots -->
			{#each nodes as node}
				{@const _op = clusterOpacities}
				{@const isHovered = node.id === $hoveredId}
				{@const nc = nodeCluster(node)}
				{@const isAD = isApplicationDomain(node)}
				{@const dotOp = (() => {
					if ($hoveredId !== null) {
						return node.publication.fields[0] !== hoveredField ? 0.08 : 0.85;
					}
					if ($hoveredCategoryId !== null) {
						return nc === $hoveredCategoryId ? 0.75 : 0.10;
					}
					return (isAD ? 0.28 : 0.40) * clusterOp(nc);
				})()}
				{@const ap = $animatedPositions[node.id]}
				{@const ax = ap ? ap[0] : node.x}
				{@const ay = ap ? ap[1] : node.y}
				{@const baseR = zoomScale > 3 ? 10 : zoomScale > 1.5 ? 8 : 4}
				{@const r = isHovered ? baseR + 2 : baseR}
				{@const inView = ax > vpMinX - 60 && ax < vpMaxX + 60 && ay > vpMinY - 60 && ay < vpMaxY + 60}
				<!-- Application domains: dashed outer ring. Other dots: thin classification_2 color ring when zoomed. -->
				{#if isAD}
					<circle cx={ax} cy={ay} r={r + 1.5} fill="none"
						stroke={nodeColor(node)} stroke-width={1}
						stroke-opacity={dotOp * 1.6} stroke-dasharray="2 2"
						pointer-events="none" />
				{:else if zoomScale > 1.0}
					<circle cx={ax} cy={ay} r={r + 1.5} fill="none"
						stroke={nodeC2Color(node)} stroke-width={0.8}
						stroke-opacity={dotOp * 1.4}
						pointer-events="none" />
				{/if}
				<circle
					cx={ax}
					cy={ay}
					r={r}
					fill={nodeColor(node)}
					fill-opacity={dotOp}
					style="cursor:pointer"
					on:pointerenter={(e) => handleDotEnter(e, { ...node, x: ax, y: ay })}
					on:pointerleave={handleDotLeave}
					on:click|stopPropagation={() => handleDotClick({ ...node, x: ax, y: ay })}
				/>
				{#if inView && zoomScale > 2.5}
					<text
						x={ax + baseR + 3}
						y={ay - baseR - 2}
						font-size={zoomScale > 3 ? 9 : 8}
						font-family="'JetBrains Mono', 'Fira Mono', monospace"
						fill={nodeColor(node)}
						fill-opacity={0.85}
						pointer-events="none"
					>{(node.publication.fields[0] ?? '').replace(/_/g, ' ')}</text>
				{/if}
				{#if inView && zoomScale > 4}
					<text
						x={ax + baseR + 3}
						y={ay + 4}
						font-size={9}
						font-family="'JetBrains Mono', 'Fira Mono', monospace"
						fill="#333"
						fill-opacity={0.9}
						pointer-events="none"
					>{truncate(node.publication.title, 30)}</text>
				{/if}
			{/each}
		{:else}
			<!-- Layer 3 (authors lens): Human glyphs — rendered from full layout, filtered by visibility -->
			{#each allAuthorNodes.filter(n => visibleAuthorIds.has(n.id)) as node}
				{@const ap = $authorAnimatedPositions[node.id]}
				{@const ax = ap ? ap[0] : node.x}
				{@const ay = ap ? ap[1] : node.y}
				{@const color = authorColor(node)}
				{@const isHovered = hoveredAuthorId === node.id}
				{@const nc = node.author.primaryCluster}
				{@const isSelected = selectedAuthorId === node.id}
				{@const op = (() => {
					if (selectedAuthorClusterPeers !== null)
						return selectedAuthorClusterPeers.has(node.id) ? 0.95 : 0.15;
					if (highlightedAuthorIds !== null)
						return highlightedAuthorIds.has(node.id) ? 0.95 : 0.10;
					if ($hoveredCategoryId !== null)
						return nc === $hoveredCategoryId ? 0.85 : 0.12;
					return isHovered ? 0.95 : 0.62 * clusterOp(nc);
				})()}
				<g
					transform="translate({ax}, {ay})"
					style="cursor:pointer"
					role="button"
					tabindex="0"
					aria-label={node.author.name}
					on:pointerenter={(e) => handleAuthorEnter(e, node, ax, ay)}
					on:pointerleave={handleAuthorLeave}
					on:click|stopPropagation={() => handleAuthorClick(node)}
					on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAuthorClick(node); } }}
				>
					<!-- selection ring -->
					{#if isSelected}
						<circle cx={0} cy={0} r={6.8} fill="none" stroke="#ffffff" stroke-width={1.5} />
					{/if}
					<!-- head -->
					<circle cx={0} cy={-4.5} r={2.2} fill={color} fill-opacity={op} />
					<!-- body -->
					<path
						d="M -2.5,-2 C -4,2 -3.5,5.5 0,5.5 C 3.5,5.5 4,2 2.5,-2 Z"
						fill={color}
						fill-opacity={op}
					/>
				</g>
				<!-- Always-on name label for top 2 per cluster -->
				{#if topLabelIds.has(node.id)}
					<text
						x={ax + 7}
						y={ay + 1}
						font-size={8.5}
						font-family="'JetBrains Mono', 'Fira Mono', monospace"
						fill={color}
						fill-opacity={op * 0.85}
						pointer-events="none"
					>{node.author.name}</text>
				{/if}
			{/each}
		{/if}

		<!-- Cluster labels — fade out as user zooms in -->
		{#if zoomScale < 3}
			{@const clLabelFade = zoomScale > 2 ? 1 - (zoomScale - 2) / 1 : 1}
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
					opacity={0.88 * clusterOp(region.id) * clLabelFade}
					pointer-events="none"
				>
					{region.label}
				</text>
			{/each}
		{/if}

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

		<!-- Bridge labels — hide when zoomed in -->
		{#if zoomScale < 3}
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
				>{band.label}</text>
			{/each}
		{/if}

		<!-- Field sub-labels — hidden when zoomed in (dot-level labels take over) -->
		{#if zoomScale < 2.2}
			{#each fieldLabels as dl}
				{@const flOp = clusterOp(fieldLabelCluster(dl.id))}
				{@const fadeOp = zoomScale > 1.6 ? 1 - (zoomScale - 1.6) / 0.6 : 1}
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
					fill-opacity={0.60 * flOp * fadeOp}
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
		{/if}

		</g>
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

	.author-tooltip {
		position: absolute;
		background: rgba(255, 255, 254, 0.96);
		border: 1px solid #e0dedd;
		border-radius: 3px;
		padding: 0.4rem 0.6rem;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		max-width: 190px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.08);
	}

	.author-tooltip-name {
		font-family: 'JetBrains Mono', 'Fira Mono', monospace;
		font-size: 0.72rem;
		font-weight: 600;
		color: #222;
	}

	.author-tooltip-meta {
		font-family: 'JetBrains Mono', 'Fira Mono', monospace;
		font-size: 0.62rem;
		color: #888;
		text-transform: capitalize;
	}

	.reset-zoom {
		position: absolute;
		top: 8px;
		right: 8px;
		z-index: 10;
		background: rgba(255, 255, 254, 0.92);
		border: 1px solid #d8d6d4;
		border-radius: 3px;
		padding: 0.25rem 0.5rem;
		font-family: 'JetBrains Mono', 'Fira Mono', monospace;
		font-size: 0.68rem;
		color: #444;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(0,0,0,0.06);
	}
	.reset-zoom:hover {
		background: #fff;
		color: #111;
	}
</style>
