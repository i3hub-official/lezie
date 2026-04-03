<!-- global layout -->

<script lang="ts">
	import './layout.css';
	
	let { children } = $props();
</script>

<svelte:head><link rel="icon" href="/icons/lz_ico.png" /></svelte:head>
{@render children()}
