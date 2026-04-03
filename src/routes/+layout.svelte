<!-- global layout -->

<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/lz_ico.png';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href="/icons/lz_ico.png" /></svelte:head>
{@render children()}
