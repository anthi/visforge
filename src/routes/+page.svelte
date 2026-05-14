<script lang="ts">
	import {
		categories,
		filteredPublications,
		searchQuery,
		activeCategories,
		yearRange,
		yearBounds,
		toggleCategory,
		clearFilters
	} from '$lib/stores';
</script>

<main style="font-family: monospace; padding: 2rem; max-width: 720px; margin: 0 auto;">
	<h1>VisForge</h1>
	<p>Phase 2 — Stores wired up.</p>

	<section>
		<h2>Search</h2>
		<input
			type="text"
			placeholder="title, author, keyword…"
			bind:value={$searchQuery}
			style="width: 100%; padding: 0.4rem; font-family: monospace;"
		/>
	</section>

	<section>
		<h2>Categories</h2>
		<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
			{#each $categories as cat}
				<button
					onclick={() => toggleCategory(cat.id)}
					style="
						padding: 0.3rem 0.7rem;
						border: 2px solid {cat.color};
						background: {$activeCategories.has(cat.id) ? cat.color : 'transparent'};
						color: {$activeCategories.has(cat.id) ? '#fff' : cat.color};
						cursor: pointer;
						font-family: monospace;
						border-radius: 3px;
					"
				>
					{cat.label}
				</button>
			{/each}
		</div>
	</section>

	<section>
		<h2>Year range</h2>
		<label>
			From
			<input type="number" min={$yearBounds.min} max={$yearBounds.max} bind:value={$yearRange.min} style="width: 5rem;" />
		</label>
		&nbsp;
		<label>
			To
			<input type="number" min={$yearBounds.min} max={$yearBounds.max} bind:value={$yearRange.max} style="width: 5rem;" />
		</label>
	</section>

	<section>
		<h2>Results — {$filteredPublications.length} publications</h2>
		<button onclick={clearFilters} style="margin-bottom: 1rem; font-family: monospace;">
			Clear filters
		</button>
		<ul style="max-height: 400px; overflow-y: auto; padding-left: 1.2rem;">
			{#each $filteredPublications as pub}
				<li style="margin-bottom: 0.5rem;">
					<strong>{pub.title}</strong>
					({pub.year ?? '—'})
					— {pub.authors.map((a) => a.name).join(', ')}
				</li>
			{/each}
		</ul>
	</section>
</main>
