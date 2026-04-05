<script lang="ts">
  import './layout.css';
  import { pwaInfo } from 'virtual:pwa-info';
  import { resolve } from '$app/paths';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/icons/lz_ico.png" />
  <meta name="theme-color" content="#6d28d9" />

  {#if pwaInfo}
    {@html pwaInfo.webManifest.linkTag}
  {/if}

  <link rel="apple-touch-icon" href="/icons/lz_ico.png" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Lezie" />

  <title>Lezie | Real-Time Safety & Monitoring</title>
  <meta name="description" content="Proactive community safety and identity protection." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
</svelte:head>

<main class="min-h-screen antialiased text-slate-900 selection:bg-violet-100">
  <!-- Logo Control Bar - Similar to auth/layout but for main app -->
  {#if children}
    {@render children()}
  {/if}
</main>

<style>
  :global(html) {
    scroll-behavior: smooth;
    /* Prevents pull-to-refresh on mobile which can disrupt map/reporting UIs */
    overscroll-behavior-y: none;
  }
  
  /* Global styles to complement your layout.css */
  :global(body) {
    margin: 0;
    padding: 0;
  }
  
  :global(#app) {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>