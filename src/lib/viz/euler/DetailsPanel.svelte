<script lang="ts">
	import { disciplinesById, subfieldsById, domainsById, clearSelection, selectedPublications } from '$lib/stores';

	$: pub = $selectedPublications[0] ?? null;
</script>

{#if pub}
	<aside class="panel">
		<button class="close" on:click={clearSelection} aria-label="Close">×</button>

		<div class="scroll">
			<h2 class="title">{pub.title}</h2>

			<p class="authors">
				{pub.authors.map((a) => a.name).join(', ')}
			</p>

			<p class="meta">
				{[pub.year, pub.venue].filter(Boolean).join(' · ')}
			</p>

			{#if pub.disciplines.length > 0}
				<div class="tag-section">
					<span class="tag-label">Disciplines</span>
					<div class="tags">
						{#each pub.disciplines as id}
							{@const entry = $disciplinesById.get(id)}
							{#if entry}
								<span class="tag" style="--c: {entry.color}">{entry.label}</span>
							{/if}
						{/each}
					</div>
				</div>
			{/if}

			{#if pub.subfields.length > 0}
				<div class="tag-section">
					<span class="tag-label">Subfields</span>
					<div class="tags">
						{#each pub.subfields as id}
							{@const entry = $subfieldsById.get(id)}
							{#if entry}
								<span class="tag" style="--c: {entry.color}">{entry.label}</span>
							{/if}
						{/each}
					</div>
				</div>
			{/if}

			{#if pub.domains.length > 0}
				<div class="tag-section">
					<span class="tag-label">Domains</span>
					<div class="tags">
						{#each pub.domains as id}
							{@const entry = $domainsById.get(id)}
							{#if entry}
								<span class="tag" style="--c: {entry.color}">{entry.label}</span>
							{/if}
						{/each}
					</div>
				</div>
			{/if}

			{#if pub.abstract}
				<p class="abstract">{pub.abstract}</p>
			{/if}

			{#if pub.doi}
				<a
					class="link"
					href="https://doi.org/{pub.doi}"
					target="_blank"
					rel="noopener noreferrer"
				>
					DOI: {pub.doi} ↗
				</a>
			{/if}

			{#if pub.url}
				<a class="link" href={pub.url} target="_blank" rel="noopener noreferrer">
					Full text ↗
				</a>
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
	.panel {
		position: absolute;
		top: 1rem;
		right: 1rem;
		bottom: 1rem;
		width: 280px;
		background: rgba(255, 255, 252, 0.97);
		border: 1px solid #e0ddd8;
		border-radius: 6px;
		box-shadow: 0 6px 28px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		font-family: 'JetBrains Mono', 'Fira Mono', monospace;
		z-index: 20;
		animation: slide-in 0.16s ease-out;
	}

	@keyframes slide-in {
		from { opacity: 0; transform: translateX(12px); }
		to   { opacity: 1; transform: translateX(0); }
	}

	.close {
		position: absolute;
		top: 0.5rem;
		right: 0.6rem;
		background: none;
		border: none;
		font-size: 1.1rem;
		color: #aaa;
		cursor: pointer;
		line-height: 1;
		padding: 0.2rem 0.3rem;
		font-family: inherit;
	}

	.close:hover { color: #444; }

	.scroll {
		padding: 1.1rem 1rem 1.2rem;
		overflow-y: auto;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.title {
		margin: 0;
		font-size: 0.82rem;
		font-weight: 700;
		line-height: 1.4;
		color: #111;
		padding-right: 1.2rem;
	}

	.authors {
		margin: 0;
		font-size: 0.7rem;
		color: #444;
		line-height: 1.45;
	}

	.meta {
		margin: 0;
		font-size: 0.68rem;
		color: #888;
	}

	.tag-section {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.tag-label {
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #aaa;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.tag {
		font-size: 0.62rem;
		padding: 0.18rem 0.45rem;
		border-radius: 2px;
		border: 1px solid var(--c);
		color: var(--c);
	}

	.abstract {
		margin: 0;
		font-size: 0.68rem;
		color: #555;
		line-height: 1.55;
	}

	.link {
		font-size: 0.65rem;
		color: #666;
		text-decoration: none;
		border-bottom: 1px solid #ccc;
		align-self: flex-start;
	}

	.link:hover {
		color: #222;
		border-color: #888;
	}

	.keywords {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.kw {
		font-size: 0.6rem;
		padding: 0.1rem 0.35rem;
		background: #f0efeb;
		border-radius: 2px;
		color: #666;
	}
</style>
