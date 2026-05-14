<script lang="ts">
	import EulerDiagram from '$lib/viz/euler/EulerDiagram.svelte';
	import Sidebar from '$lib/ui/Sidebar.svelte';
	import { clusterOpacities } from '$lib/stores';
</script>

<div class="layout">
	<Sidebar />
	<main class="canvas">
		<EulerDiagram clusterOpacities={$clusterOpacities} />
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

	.canvas {
		position: relative;
		flex: 1;
		overflow: hidden;
	}
</style>
