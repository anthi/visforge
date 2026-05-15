<script lang="ts">
	import type { Publication } from '$lib/models/publication';
	import { CLUSTER_COLORS, CLUSTER_MAP } from '$lib/data/clusters';

	export let pub: Publication | null = null;
	export let x = 0;
	export let y = 0;

	$: clusterColor = pub
		? (CLUSTER_COLORS[CLUSTER_MAP[pub.fields[0] ?? ''] ?? 'formal'] ?? '#888')
		: '#888';

	$: authorLine = pub
		? pub.authors.slice(0, 3).map((a) => a.name).join(', ') + (pub.authors.length > 3 ? ' et al.' : '')
		: '';

	$: metaLine = pub ? [pub.year, pub.venue].filter(Boolean).join(' · ') : '';

	$: discLine = pub?.fields[0]?.replace(/_/g, ' ') ?? '';

	$: shortTitle =
		pub && pub.title.length > 90 ? pub.title.slice(0, 87) + '…' : (pub?.title ?? '');
</script>

{#if pub}
	<div class="tooltip" style="left:{x}px;top:{y}px">
		<p class="title">{shortTitle}</p>
		{#if authorLine}
			<p class="authors">{authorLine}</p>
		{/if}
		{#if metaLine}
			<p class="meta">{metaLine}</p>
		{/if}
		{#if discLine}
			<p class="disc" style="color:{clusterColor}">{discLine}</p>
		{/if}
	</div>
{/if}

<style>
	.tooltip {
		position: absolute;
		width: 210px;
		background: rgba(250, 250, 248, 0.97);
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 0.55rem 0.7rem;
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.11);
		font-family: 'JetBrains Mono', 'Fira Mono', monospace;
		pointer-events: none;
		z-index: 30;
	}

	.title {
		margin: 0;
		font-size: 0.68rem;
		font-weight: 600;
		color: #111;
		line-height: 1.45;
	}

	.authors {
		margin: 0.3rem 0 0;
		font-size: 0.62rem;
		color: #555;
		line-height: 1.3;
	}

	.meta {
		margin: 0.25rem 0 0;
		font-size: 0.6rem;
		color: #999;
	}

	.disc {
		margin: 0.3rem 0 0;
		font-size: 0.58rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
	}
</style>
