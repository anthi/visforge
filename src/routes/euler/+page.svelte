<script lang="ts">
	import EulerDiagram from '$lib/viz/euler/EulerDiagram.svelte';
	import {
		categories,
		filteredPublications,
		activeCategories,
		searchQuery,
		yearRange,
		yearBounds,
		toggleCategory,
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
			<label for="search">Search</label>
			<input
				id="search"
				type="text"
				placeholder="title · author · keyword"
				bind:value={$searchQuery}
			/>
		</section>

		<section>
			<p class="section-label">Categories</p>
			<div class="category-list">
				{#each $categories as cat}
					<button
						class="cat-chip"
						class:active={$activeCategories.has(cat.id)}
						style="--color: {cat.color}"
						onclick={() => toggleCategory(cat.id)}
					>
						{cat.label}
					</button>
				{/each}
			</div>
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

	label,
	.section-label {
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #999;
		margin: 0;
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

	.category-list {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.cat-chip {
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

	.cat-chip.active {
		background: var(--color);
		color: #fff;
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
		flex: 1;
		overflow: hidden;
	}
</style>
