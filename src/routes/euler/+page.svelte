<script lang="ts">
	import EulerDiagram from '$lib/viz/euler/EulerDiagram.svelte';
	import { CLUSTERS } from '$lib/data/clusters';
	import {
		filteredPublications,
		searchQuery,
		yearRange,
		yearBounds,
		clearFilters
	} from '$lib/stores';
</script>

<div class="layout">
	<aside class="sidebar">
		<header>
			<h1>VisForge</h1>
			<p class="subtitle">{$filteredPublications.length} publications</p>
		</header>

		<section>
			<p class="section-label">Clusters</p>
			<div class="legend">
				{#each CLUSTERS as cluster}
					<div class="legend-row">
						<span class="swatch" style="background: {cluster.color}"></span>
						<span class="legend-label">{cluster.label}</span>
					</div>
				{/each}
			</div>
		</section>

		<section>
			<label for="search">Search</label>
			<input
				id="search"
				type="text"
				placeholder="title · author · keyword"
				bind:value={$searchQuery}
			/>
		</section>

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

	.legend {
		display: flex;
		flex-direction: column;
		gap: 0.38rem;
	}

	.legend-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.swatch {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.legend-label {
		font-size: 0.72rem;
		color: #444;
	}

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
