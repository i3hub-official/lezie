<!-- global layout -->

<script lang="ts">
	import './layout.css';
	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/icons/lz_ico.png" />

	{@html pwaInfo?.webManifest.linkTag}

	<meta name="theme-color" content="#6d28d9" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	
	<title>Lezie | Real-Time Safety & Monitoring</title>
	<meta name="description" content="Proactive community safety and identity protection." />
</svelte:head>

<main class="min-h-screen antialiased text-slate-900">
	{@render children()}
</main>

<style>
	/* Ensures smooth scrolling and prevents layout shifts */
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
