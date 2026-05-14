<script lang="ts">
	import EulerDiagram from '$lib/viz/euler/EulerDiagram.svelte';
	import DetailsPanel from '$lib/viz/euler/DetailsPanel.svelte';
	import { CLUSTERS, clustersById } from '$lib/data/clusters';
	import {
		disciplines,
		filteredPublications,
		activeDisciplines,
		searchQuery,
		yearRange,
		yearBounds,
		toggleDiscipline,
		clearFilters,
		expandedClusterId,
		expandCluster,
		collapseToOverview
	} from '$lib/stores';
</script>

<div class="layout">
	<aside class="sidebar">
		<header>
			<h1>VisForge</h1>
			<p class="subtitle">{$filteredPublications.length} publications</p>
		</header>

		<!-- Navigation: cluster overview or expanded cluster -->
		<section>
			{#if $expandedClusterId === null}
				<p class="section-label">Clusters</p>
				<div class="chip-list">
					{#each CLUSTERS as cluster}
						<button
							class="cluster-chip"
							style="--color: {cluster.color}"
							onclick={() => expandCluster(cluster.id)}
							title={cluster.description}
						>
							{cluster.label}
						</button>
					{/each}
				</div>
			{:else}
				{@const cluster = clustersById.get($expandedClusterId)}
				<button class="back-link" onclick={collapseToOverview}>← All Clusters</button>
				{#if cluster}
					<p class="cluster-heading" style="--color: {cluster.color}">{cluster.label}</p>
					<p class="cluster-desc">{cluster.description}</p>
					<div class="chip-list">
						{#each cluster.disciplines as discId}
							{@const disc = $disciplines.find((d) => d.id === discId)}
							{#if disc}
								<button
									class="disc-chip"
									class:active={$activeDisciplines.has(disc.id)}
									style="--color: {disc.color}"
									onclick={() => toggleDiscipline(disc.id)}
								>
									{disc.label}
								</button>
							{/if}
						{/each}
					</div>
				{/if}
			{/if}
		</section>

		<!-- Search (always visible) -->
		<section>
			<label for="search">Search</label>
			<input
				id="search"
				type="text"
				placeholder="title · author · keyword"
				bind:value={$searchQuery}
			/>
		</section>

		<!-- Year range (always visible) -->
		<section>
			<p class="section-label">Years</p>
			<div class="year-row">
				<input
					type="number"
					min={$yearBounds.min}
					max={$yearBounds.max}
					bind:value={$yearRange.min}
				/>
				<span>–</span>
				<input
					type="number"
					min={$yearBounds.min}
					max={$yearBounds.max}
					bind:value={$yearRange.max}
				/>
			</div>
		</section>

		<button class="clear-btn" onclick={clearFilters}>Clear filters</button>
	</aside>

	<main class="canvas">
		<EulerDiagram />
		<DetailsPanel />
	</main>
</div>

<style>
	.layout {
		display: flex;
		height: 100vh;
		overflow: hidden;
		font-family: 'JetBrains Mono', 'Fira Mono', monospace;
		background: #fafaf8;
	}

	.sidebar {
		width: 220px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 1.4rem;
		padding: 1.4rem 1.2rem;
		border-right: 1px solid #e5e4e0;
		overflow-y: auto;
		background: #f5f4f0;
	}

	h1 {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: #222;
	}

	.subtitle {
		margin: 0.2rem 0 0;
		font-size: 0.72rem;
		color: #888;
	}

	section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.section-label {
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #999;
		margin: 0;
	}

	label {
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #999;
		margin: 0;
	}

	.chip-list {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	/* ── Cluster chips (Level 1) ── */
	.cluster-chip {
		font-family: inherit;
		font-size: 0.74rem;
		font-weight: 600;
		padding: 0.32rem 0.6rem;
		border: 2px solid var(--color);
		border-radius: 3px;
		background: transparent;
		color: var(--color);
		cursor: pointer;
		text-align: left;
		transition: background 0.12s, color 0.12s;
	}

	.cluster-chip:hover {
		background: var(--color);
		color: #fff;
	}

	/* ── Back link (Level 2 header) ── */
	.back-link {
		font-family: inherit;
		font-size: 0.68rem;
		background: none;
		border: none;
		color: #888;
		cursor: pointer;
		padding: 0;
		text-align: left;
		align-self: flex-start;
	}

	.back-link:hover {
		color: #333;
	}

	.cluster-heading {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color);
	}

	.cluster-desc {
		margin: 0;
		font-size: 0.65rem;
		color: #999;
		line-height: 1.4;
	}

	/* ── Discipline chips (Level 2 filter) ── */
	.disc-chip {
		font-family: inherit;
		font-size: 0.72rem;
		padding: 0.28rem 0.55rem;
		border: 1.5px solid var(--color);
		border-radius: 3px;
		background: transparent;
		color: var(--color);
		cursor: pointer;
		text-align: left;
		transition: background 0.12s, color 0.12s;
	}

	.disc-chip.active {
		background: var(--color);
		color: #fff;
	}

	/* ── Search ── */
	input[type='text'] {
		font-family: inherit;
		font-size: 0.78rem;
		padding: 0.35rem 0.5rem;
		border: 1px solid #ddd;
		border-radius: 3px;
		background: #fff;
		color: #222;
		outline: none;
	}

	input[type='text']:focus {
		border-color: #aaa;
	}

	/* ── Year range ── */
	.year-row {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.year-row input {
		font-family: inherit;
		font-size: 0.78rem;
		width: 4.4rem;
		padding: 0.3rem 0.4rem;
		border: 1px solid #ddd;
		border-radius: 3px;
		background: #fff;
		color: #222;
		outline: none;
	}

	.year-row span {
		color: #aaa;
		font-size: 0.8rem;
	}

	.clear-btn {
		font-family: inherit;
		font-size: 0.72rem;
		padding: 0.35rem 0.6rem;
		border: 1px solid #ccc;
		border-radius: 3px;
		background: transparent;
		color: #666;
		cursor: pointer;
		align-self: flex-start;
	}

	.clear-btn:hover {
		background: #eee;
	}

	.canvas {
		position: relative;
		flex: 1;
		overflow: hidden;
	}
</style>
