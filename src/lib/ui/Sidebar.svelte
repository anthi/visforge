<script lang="ts">
	import { CLUSTERS } from '$lib/data/clusters';
	import {
		filteredPublications,
		currentLens,
		clusterOpacities,
		clusterCounts,
		venueFilter,
		toggleVenue,
		uniqueVenues,
		authorProminence,
		visibleAuthors,
		searchQuery,
		yearRange,
		yearBounds,
		yearCounts,
		clearFilters,
		type Lens
	} from '$lib/stores';

	type LensOption = { id: Lens; label: string };
	const LENSES: LensOption[] = [
		{ id: 'fields', label: 'Fields' },
		{ id: 'subfields',   label: 'Subfields'   },
		{ id: 'applications',     label: 'Applications'      },
		{ id: 'authors',     label: 'Authors'      },
	];

	// ─── Year sparkline drag ──────────────────────────────────────────────────
	const CHART_W = 200;
	const CHART_H = 40;

	let dragging: 'min' | 'max' | null = null;

	$: sparkBars = buildBars($yearCounts, $yearBounds);
	$: minX = yearToX($yearRange.min);
	$: maxX = yearToX($yearRange.max);

	function yearToX(year: number): number {
		const span = $yearBounds.max - $yearBounds.min || 1;
		return ((year - $yearBounds.min) / span) * CHART_W;
	}

	function svgXToYear(svgX: number): number {
		const pct = Math.max(0, Math.min(1, svgX / CHART_W));
		const year = Math.round($yearBounds.min + pct * ($yearBounds.max - $yearBounds.min));
		return Math.max($yearBounds.min, Math.min($yearBounds.max, year));
	}

	function pointerSvgX(e: PointerEvent): number {
		const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
		return ((e.clientX - rect.left) / rect.width) * CHART_W;
	}

	function buildBars(
		counts: Record<number, number>,
		bounds: { min: number; max: number }
	): { x: number; y: number; w: number; h: number }[] {
		if (bounds.max <= bounds.min) return [];
		const span = bounds.max - bounds.min;
		const maxCount = Math.max(...Object.values(counts), 1);
		const barW = Math.max(1, (CHART_W / span) - 0.5);
		return Object.entries(counts).map(([yr, cnt]) => {
			const x = ((Number(yr) - bounds.min) / span) * CHART_W;
			const h = (cnt / maxCount) * CHART_H;
			return { x, y: CHART_H - h, w: barW, h };
		});
	}

	function onTimelineDown(e: PointerEvent) {
		const x = pointerSvgX(e);
		dragging = Math.abs(x - minX) <= Math.abs(x - maxX) ? 'min' : 'max';
		(e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
	}

	function onTimelineMove(e: PointerEvent) {
		if (!dragging) return;
		const year = svgXToYear(pointerSvgX(e));
		if (dragging === 'min') yearRange.update((r) => ({ ...r, min: Math.min(year, r.max - 1) }));
		else yearRange.update((r) => ({ ...r, max: Math.max(year, r.min + 1) }));
	}

	function onTimelineUp() { dragging = null; }

	// ─── Cluster opacity helper ───────────────────────────────────────────────
	function setOpacity(clusterId: string, value: number) {
		clusterOpacities.update((o) => ({ ...o, [clusterId]: value }));
	}
</script>

<aside class="sidebar">
	<header>
		<h1>DecisionVerse</h1>
		{#if $currentLens === 'authors'}
			<p class="subtitle">{$visibleAuthors.length} authors · {$filteredPublications.length} publications</p>
		{:else}
			<p class="subtitle">{$filteredPublications.length} publications</p>
		{/if}
	</header>

	<!-- Lens switcher -->
	<section>
		<p class="section-label">Lens</p>
		<div class="lens-grid">
			{#each LENSES as lens}
				<button
					class="lens-tab"
					class:active={$currentLens === lens.id}
					on:click={() => currentLens.set(lens.id)}
				>{lens.label}</button>
			{/each}
		</div>
	</section>

	<!-- Clusters — opacity sliders + live counts -->
	<section>
		<p class="section-label">Clusters</p>
		{#each CLUSTERS as cluster}
			{@const opacity = $clusterOpacities[cluster.id] ?? 1}
			{@const count = $clusterCounts[cluster.id] ?? 0}
			<div class="cluster-row">
				<span class="swatch" style="background:{cluster.color};opacity:{0.4 + 0.6 * opacity}"></span>
				<span class="cluster-name">{cluster.label}</span>
				<span class="cluster-count">{count}</span>
				<input
					type="range"
					class="opacity-slider"
					min="0" max="100" step="1"
					value={Math.round(opacity * 100)}
					style="--c:{cluster.color}"
					on:input={(e) => setOpacity(cluster.id, Number((e.target as HTMLInputElement).value) / 100)}
				/>
			</div>
		{/each}
	</section>

	<!-- Year timeline sparkline -->
	<section>
		<p class="section-label">Years · {$yearRange.min}–{$yearRange.max}</p>
		<svg
			class="timeline"
			viewBox="0 0 {CHART_W} {CHART_H}"
			preserveAspectRatio="none"
			role="slider"
			tabindex="0"
			aria-label="Year range"
			aria-valuemin={$yearBounds.min}
			aria-valuemax={$yearBounds.max}
			aria-valuenow={$yearRange.min}
			on:pointerdown={onTimelineDown}
			on:pointermove={onTimelineMove}
			on:pointerup={onTimelineUp}
			on:pointercancel={onTimelineUp}
		>
			<!-- Bars -->
			{#each sparkBars as bar}
				<rect x={bar.x} y={bar.y} width={bar.w} height={bar.h} fill="#c0bdb8" />
			{/each}
			<!-- Selected range overlay -->
			<rect x={minX} y={0} width={maxX - minX} height={CHART_H} fill="#555" opacity={0.12} />
			<!-- Min handle -->
			<line x1={minX} y1={0} x2={minX} y2={CHART_H} stroke="#555" stroke-width={1.5} />
			<circle cx={minX} cy={CHART_H / 2} r={5} fill="#fafaf8" stroke="#555" stroke-width={1.5} />
			<!-- Max handle -->
			<line x1={maxX} y1={0} x2={maxX} y2={CHART_H} stroke="#555" stroke-width={1.5} />
			<circle cx={maxX} cy={CHART_H / 2} r={5} fill="#fafaf8" stroke="#555" stroke-width={1.5} />
		</svg>
	</section>

	<!-- Author prominence threshold — only relevant in Authors lens -->
	{#if $currentLens === 'authors'}
	<section>
		<p class="section-label">
			Prominence · top {Math.round((1 - $authorProminence) * 100)}%
		</p>
		<input
			type="range"
			class="plain-slider"
			min="0" max="100" step="1"
			value={Math.round((1 - $authorProminence) * 100)}
			on:input={(e) => authorProminence.set(1 - Number((e.target as HTMLInputElement).value) / 100)}
		/>
	</section>
	{/if}

	<!-- Venue filter — exclusion checklist (checked = visible, unchecked = hidden) -->
	<section>
		<p class="section-label">
			Venue{$venueFilter.size > 0 ? ` · ${$venueFilter.size} hidden` : ''}
		</p>
		<div class="venue-list">
			{#each $uniqueVenues as v}
				<label class="venue-item">
					<input
						type="checkbox"
						checked={!$venueFilter.has(v)}
						on:change={() => toggleVenue(v)}
					/>
					<span class="venue-name">{v}</span>
				</label>
			{/each}
		</div>
	</section>

	<!-- Search -->
	<section>
		<p class="section-label">Search</p>
		<input
			type="text"
			class="search"
			placeholder="title · author · keyword"
			bind:value={$searchQuery}
		/>
	</section>

	<button class="clear-btn" on:click={clearFilters}>Clear all filters</button>
</aside>

<style>
	.sidebar {
		box-sizing: border-box;
		width: 220px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		padding: 1.4rem 1.1rem;
		border-right: 1px solid #e5e4e0;
		overflow-y: auto;
		background: #f5f4f0;
		font-family: 'JetBrains Mono', 'Fira Mono', monospace;
	}

	h1 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: #222;
	}

	.subtitle {
		margin: 0.15rem 0 0;
		font-size: 0.68rem;
		color: #999;
	}

	section {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.section-label {
		margin: 0;
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: #aaa;
	}

	/* Lens tabs */
	.lens-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3px;
	}

	.lens-tab {
		font-family: inherit;
		font-size: 0.68rem;
		padding: 0.28rem 0;
		border: 1px solid #ddd;
		border-radius: 2px;
		background: transparent;
		color: #666;
		cursor: pointer;
		text-align: center;
		transition: background 0.1s, color 0.1s;
	}

	.lens-tab:hover { background: #eee; }

	.lens-tab.active {
		background: #333;
		color: #fafaf8;
		border-color: #333;
	}

	/* Cluster rows */
	.cluster-row {
		display: grid;
		grid-template-columns: 10px 1fr auto;
		grid-template-rows: auto auto;
		column-gap: 6px;
		row-gap: 3px;
		align-items: center;
	}

	.swatch {
		grid-row: 1;
		grid-column: 1;
		width: 10px;
		height: 10px;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.cluster-name {
		grid-row: 1;
		grid-column: 2;
		font-size: 0.68rem;
		color: #444;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.cluster-count {
		grid-row: 1;
		grid-column: 3;
		font-size: 0.62rem;
		color: #999;
		font-variant-numeric: tabular-nums;
	}

	.opacity-slider {
		grid-row: 2;
		grid-column: 1 / -1;
		width: 100%;
		height: 3px;
		accent-color: var(--c);
		cursor: pointer;
	}

	/* Year timeline */
	.timeline {
		width: 100%;
		height: 44px;
		display: block;
		cursor: ew-resize;
		border-radius: 2px;
		overflow: visible;
	}

	/* Plain slider (author prominence) */
	.plain-slider {
		width: 100%;
		height: 3px;
		accent-color: #888;
		cursor: pointer;
	}

	/* Venue checklist */
	.venue-list {
		max-height: 110px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 2px;
		scrollbar-width: thin;
		scrollbar-color: #ccc transparent;
	}

	.venue-item {
		display: flex;
		align-items: baseline;
		gap: 5px;
		cursor: pointer;
	}

	.venue-item input[type="checkbox"] {
		margin: 0;
		flex-shrink: 0;
		accent-color: #555;
		cursor: pointer;
	}

	.venue-name {
		font-size: 0.62rem;
		color: #555;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.5;
	}

	/* Search */
	.search {
		font-family: inherit;
		font-size: 0.72rem;
		padding: 0.3rem 0.45rem;
		border: 1px solid #ddd;
		border-radius: 3px;
		background: #fff;
		color: #222;
		outline: none;
		width: 100%;
		box-sizing: border-box;
	}

	.search:focus { border-color: #aaa; }

	/* Clear button */
	.clear-btn {
		font-family: inherit;
		font-size: 0.68rem;
		padding: 0.3rem 0.6rem;
		border: 1px solid #ccc;
		border-radius: 3px;
		background: transparent;
		color: #666;
		cursor: pointer;
		align-self: flex-start;
		margin-top: auto;
	}

	.clear-btn:hover { background: #eee; }
</style>
