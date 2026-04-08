<script lang="ts">
import './layout.css';
import { env } from '$env/dynamic/public';
import { pwaInfo } from 'virtual:pwa-info';
import { goto } from '$app/navigation';
import { authStore } from '$lib/stores/auth';

import ShutdownPage from '$lib/components/ShutdownPage.svelte';
import MaintenancePage from '$lib/components/MaintenancePage.svelte';
import SuspendedPage    from '$lib/components/SuspendedPage.svelte';
import AgeGate          from '$lib/components/AgeGate.svelte';
import RegionBlockedPage from '$lib/components/RegionBlockedPage.svelte';

import CookieNotice from '$lib/components/CookieNotice.svelte';

  // Toast & Confirmation Imports
import ToastContainer from '$lib/ToastContainer.svelte';
import ConfirmationModal from '$lib/ConfirmationModal.svelte';

const SHUTDOWN_MODE     = env.PUBLIC_SHUTDOWN_MODE     === 'true';
const MAINTENANCE_MODE  = env.PUBLIC_MAINTENANCE_MODE  === 'true';
const REGION_BLOCKED    = env.PUBLIC_REGION_BLOCKED    === 'true';


  let { children } = $props();
  let isAuthenticated = $state(false);
// For account suspension, pull from your auth store
let regionAllowed = $state(false);
let isSuspended   = $state(false);
let ageVerified   = $state(false);
let userEmail     = $state('');


  // Auth check
  $effect(() => {
  const unsubscribe = authStore.subscribe(s => {
    isAuthenticated = !!s.user;
    isSuspended     = s.user?.suspended ?? false;
    userEmail       = s.user?.email ?? '';
  });

  return unsubscribe;
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

<main class="min-h-screen antialiased text-slate-900 selection:bg-violet-100">
  
  <!-- Global Navigation -->
  {#if isAuthenticated}
    <nav class="global-nav">
      <div class="nav-container">
        <div class="nav-brand" onclick={() => goto('/dashboard')}>
          <button type="button" class="lz-logo">
            <img src="/icons/lz_ico.png" alt="Lezie" class="lz-logo-img" width="32" height="32"/>
            <span class="lz-logo-text">Lezie</span>
          </button>
        </div>

        <div class="nav-links">
          <button class="nav-link" onclick={() => goto('/dashboard')}>Dashboard</button>
          <button class="nav-link" onclick={() => goto('/map')}>Map</button>
          <button class="nav-link" onclick={() => goto('/alerts')}>Alerts</button>
          <button class="nav-link" onclick={() => goto('/statistics')}>Statistics</button>
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

  <!-- Page Content -->
  {#if SHUTDOWN_MODE}
  <ShutdownPage />

{:else if MAINTENANCE_MODE}
  <MaintenancePage />

{:else if isSuspended}
  <SuspendedPage email={userEmail} />

{:else if !ageVerified}
  <AgeGate onVerified={() => ageVerified = true} />

{:else if !regionAllowed}
  <RegionBlockedPage onAllowed={() => regionAllowed = true} />

{:else if children}
  {@render children()}
{/if}

  <!-- Global Notifications -->
<CookieNotice />
  <ToastContainer />
  <ConfirmationModal />

</main>