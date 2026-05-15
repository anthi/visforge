<script lang="ts">
	import type { Publication } from '$lib/models/publication';
	import { CLUSTER_COLORS, CLUSTER_MAP } from '$lib/data/clusters';
	import { clearSelection } from '$lib/stores';

	export let pub: Publication | null = null;
	export let x = 0;
	export let y = 0;
	export let containerWidth = 900;
	export let containerHeight = 680;

	const PANEL_W = 290;
	const PANEL_H = 360;

	$: px = x + 18 + PANEL_W > containerWidth ? x - PANEL_W - 18 : x + 18;
	$: py = Math.max(8, Math.min(y - 40, containerHeight - PANEL_H - 8));

	function clusterColor(fields: string[]): string {
		return CLUSTER_COLORS[CLUSTER_MAP[fields[0] ?? ''] ?? 'formal'] ?? '#888';
	}

	function dismiss(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('.panel') === null) clearSelection();
	}
</script>

{#if pub}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div class="backdrop" on:click={dismiss}></div>
	<aside class="panel" style="left:{px}px;top:{py}px;width:{PANEL_W}px">
		<button class="close" on:click={clearSelection} aria-label="Close">×</button>

		<div class="scroll">
			<h2 class="title">{pub.title}</h2>

			{#if pub.authors.length > 0}
				<p class="authors">{pub.authors.map((a) => a.name).join(', ')}</p>
			{/if}

			<p class="meta">{[pub.year, pub.venue].filter(Boolean).join(' · ')}</p>

			{#if pub.fields.length > 0}
				<div class="tag-section">
					<span class="tag-label">Fields</span>
					<div class="tags">
						{#each pub.fields as id}
							<span class="tag" style="border-color:{clusterColor([id])};color:{clusterColor([id])}">{id.replace(/_/g, ' ')}</span>
						{/each}
					</div>
				</div>
			{/if}

			{#if pub.subfields.length > 0}
				<div class="tag-section">
					<span class="tag-label">Subfields</span>
					<div class="tags">
						{#each pub.subfields as id}
							<span class="tag tag-neutral">{id.replace(/_/g, ' ')}</span>
						{/each}
					</div>
				</div>
			{/if}

			{#if pub.applications.length > 0}
				<div class="tag-section">
					<span class="tag-label">Applications</span>
					<div class="tags">
						{#each pub.applications as id}
							<span class="tag tag-neutral">{id.replace(/_/g, ' ')}</span>
						{/each}
					</div>
				</div>
			{/if}

			{#if pub.abstract}
				<p class="abstract">{pub.abstract}</p>
			{/if}

			{#if pub.doi}
				<a class="link" href="https://doi.org/{pub.doi}" target="_blank" rel="noopener noreferrer">
					DOI: {pub.doi} ↗
				</a>
			{/if}

			{#if pub.url}
				<a class="link" href={pub.url} target="_blank" rel="noopener noreferrer">Full text ↗</a>
			{/if}

			{#if pub.keywords?.length}
				<div class="keywords">
					{#each pub.keywords as kw}
						<span class="kw">{kw}</span>
					{/each}
				</div>
			{/if}
		</div>
	</aside>
{/if}

<style>
	.backdrop {
		position: absolute;
		inset: 0;
		z-index: 19;
	}

	.panel {
		position: absolute;
		max-height: 380px;
		background: rgba(250, 250, 248, 0.98);
		border: 1px solid #ddd;
		border-radius: 5px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.13);
		display: flex;
		flex-direction: column;
		font-family: 'JetBrains Mono', 'Fira Mono', monospace;
		z-index: 20;
		animation: pop-in 0.14s ease-out;
	}

	@keyframes pop-in {
		from { opacity: 0; transform: scale(0.96) translateY(4px); }
		to   { opacity: 1; transform: scale(1) translateY(0); }
	}

	.close {
		position: absolute;
		top: 0.4rem;
		right: 0.5rem;
		background: none;
		border: none;
		font-size: 1.1rem;
		color: #aaa;
		cursor: pointer;
		padding: 0.15rem 0.3rem;
		font-family: inherit;
		z-index: 1;
	}

	.close:hover { color: #333; }

	.scroll {
		padding: 0.9rem 0.9rem 1rem;
		overflow-y: auto;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.title {
		margin: 0;
		font-size: 0.76rem;
		font-weight: 700;
		line-height: 1.45;
		color: #111;
		padding-right: 1.1rem;
	}

	.authors {
		margin: 0;
		font-size: 0.66rem;
		color: #444;
		line-height: 1.4;
	}

	.meta {
		margin: 0;
		font-size: 0.62rem;
		color: #999;
	}

	.tag-section {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.tag-label {
		font-size: 0.58rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #bbb;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.tag {
		font-size: 0.6rem;
		padding: 0.15rem 0.4rem;
		border-radius: 2px;
		border: 1px solid currentColor;
	}

	.tag-neutral {
		border-color: #ccc;
		color: #666;
	}

	.abstract {
		margin: 0;
		font-size: 0.65rem;
		color: #555;
		line-height: 1.55;
	}

	.link {
		font-size: 0.62rem;
		color: #666;
		text-decoration: none;
		border-bottom: 1px solid #ddd;
		align-self: flex-start;
	}

	.link:hover { color: #222; border-color: #888; }

	.keywords {
		display: flex;
		flex-wrap: wrap;
		gap: 0.22rem;
	}

	.kw {
		font-size: 0.58rem;
		padding: 0.08rem 0.32rem;
		background: #f0efeb;
		border-radius: 2px;
		color: #777;
	}
</style>
