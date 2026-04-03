<script lang="ts">
	import './layout.css';
	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/icons/lz_ico.png" />
	<meta name="theme-color" content="#6d28d9" />

	{#if pwaInfo}
		{@html pwaInfo.webManifest.linkTag}
	{/if}

	<link rel="apple-touch-icon" href="/icons/lz_ico_192.png" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="Lezie" />

	<title>Lezie | Real-Time Safety & Monitoring</title>
	<meta name="description" content="Proactive community safety and identity protection." />
</svelte:head>

<main class="min-h-screen antialiased text-slate-900 selection:bg-violet-100">
	{@render children()}
</main>

<style>
	:global(html) {
		scroll-behavior: smooth;
		/* Prevents pull-to-refresh on mobile which can disrupt map/reporting UIs */
		overscroll-behavior-y: none; 
	}
</style>
