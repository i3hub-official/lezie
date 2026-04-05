<script lang="ts">
  import './layout.css';
  import { pwaInfo } from 'virtual:pwa-info';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  
  let { children } = $props();
  let isAuthenticated = $state(false);
  let isLoading = $state(true);
  
  onMount(async () => {
    // Check authentication status
    const unsubscribe = authStore.subscribe((state) => {
      isAuthenticated = !!state.user;
      isLoading = false;
    });
    
    return () => unsubscribe();
  });
  
  function handleLogout() {
    authStore.logout();
    goto('/signin');
  }
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

{#if isLoading}
  <div class="loading-screen">
    <div class="loading-spinner"></div>
    <p>Loading...</p>
  </div>
{:else}
  <main class="min-h-screen antialiased text-slate-900 selection:bg-violet-100">
    <!-- Global Navigation Bar - Only show when authenticated -->
    {#if isAuthenticated}
      <nav class="global-nav">
        <div class="nav-container">
          <div class="nav-brand" onclick={() => goto('/dashboard')}>
            <button type="button" class="lz-logo" onclick={() => scrollTo('home')}>
      <img src="/icons/lz_ico.png" alt="Lezie" class="lz-logo-img" width="32" height="32"/>
      <span class="lz-logo-text">Lezie</span>
    </button>
          
          <div class="nav-links">
            <button class="nav-link" onclick={() => goto('/dashboard')}>
              Dashboard
            </button>
            <button class="nav-link" onclick={() => goto('/map')}>
              Map
            </button>
            <button class="nav-link" onclick={() => goto('/alerts')}>
              Alerts
            </button>
            <button class="nav-link" onclick={() => goto('/statistics')}>
              Statistics
            </button>
          </div>
          
          <div class="nav-actions">
            <button class="nav-icon-btn" onclick={() => goto('/profile')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <button class="logout-btn" onclick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </nav>
    {/if}
    
    <!-- Main Content -->
    {#if children}
      {@render children()}
    {/if}
  </main>
{/if}

<style>
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    z-index: 1000;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Global Navigation Styles */
  .global-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    backdrop-filter: blur(8px);
  }
  
  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0.75rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--primary-dark);
    cursor: pointer;
    transition: opacity 0.2s;
  }
  
  .nav-brand:hover {
    opacity: 0.8;
  }
  
  .logo-mark {
    width: 32px;
    height: 32px;
    background: var(--primary-color);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .nav-links {
    display: flex;
    gap: 1.5rem;
  }
  
  .nav-link {
    background: none;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    padding: 0.5rem 0;
    transition: color 0.2s;
    position: relative;
  }
  
  .nav-link:hover {
    color: var(--primary-color);
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--primary-color);
    transform: scaleX(0);
    transition: transform 0.2s;
  }
  
  .nav-link:hover::after {
    transform: scaleX(1);
  }
  
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .nav-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    color: #64748b;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .nav-icon-btn:hover {
    background: #f1f5f9;
    color: var(--primary-color);
  }
  
  .logout-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: none;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.813rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .logout-btn:hover {
    background: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
  }
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .nav-container {
      padding: 0.75rem 1rem;
    }
    
    .nav-links {
      gap: 1rem;
    }
    
    .nav-link {
      font-size: 0.75rem;
    }
    
    .logout-btn span {
      display: none;
    }
    
    .logout-btn {
      padding: 0.5rem;
    }
  }
  
  @media (max-width: 640px) {
    .nav-links {
      gap: 0.75rem;
    }
    
    .nav-link {
      font-size: 0.688rem;
    }
  }
  
  :global(html) {
    scroll-behavior: smooth;
    overscroll-behavior-y: none;
  }
  
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