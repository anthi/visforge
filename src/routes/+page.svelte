<script lang="ts">
	import { mockPublications, mockCategories } from '$lib/data/mock';

	const pubCount = mockPublications.length;
	const catCount = mockCategories.length;

	const byCategory = mockCategories.map((cat) => ({
		...cat,
		count: mockPublications.filter((p) => p.categories.includes(cat.id)).length
	}));
</script>

<main style="font-family: monospace; padding: 2rem; max-width: 640px; margin: 0 auto;">
	<h1>VisForge</h1>
	<p>Phase 1 — Data models and mock dataset loaded.</p>
	<p><strong>{pubCount}</strong> publications · <strong>{catCount}</strong> categories</p>

	<h2>Categories</h2>
	<ul>
		{#each byCategory as cat}
			<li>
				<span style="display:inline-block;width:12px;height:12px;background:{cat.color};border-radius:2px;margin-right:6px;vertical-align:middle;"></span>
				{cat.label} — {cat.count} publications
			</li>
		{/each}
	</ul>
</main>
