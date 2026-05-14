<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => goto('/euler', { replaceState: true }));
</script>
