<!-- global layout -->

<script lang="ts">
	import './layout.css';
	import favicon from '$icons/lz_ico.png';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
