<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { 
    ShieldCheck, 
    ArrowRight, 
    PlayCircle, 
    MapPin, 
    Radio, 
    Cpu, 
    BadgeCheck, 
    Map, 
    EyeOff, 
    BellRing,
    Smartphone,
    BrainCircuit,
    Megaphone,
    ScanEye,
    Users,
    LockKeyhole,
    FlagTriangleRight,
    PhoneCall,
    MessageCircle,
    X,
    Menu,
    Clock,
    Upload,
    CheckCircle,
    Siren,
  } from 'lucide-svelte';

  let isMenuOpen = $state(false);
  let isLoading = $state(true);   // Controls the loading overlay

  onMount(() => {
    // Check authentication
    const unsubscribe = authStore.subscribe((state) => {
      if (state.user) {
        // Authenticated user → redirect to dashboard
        goto('/dashboard');
      } else {
        // Not authenticated → show landing page
        isLoading = false;
      }
    });

    // Scroll animations
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    
    return () => {
      observer.disconnect();
      unsubscribe();
    };
  });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    isMenuOpen = false;
  };
</script>

<svelte:head>
  <title>Lezie - Community Safety Platform</title>
  <meta name="description" content="Empower your community with real-time safety alerts, incident reporting, and AI-powered threat detection." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<!-- Custom Loading Overlay -->
{#if isLoading}
  <div class="lz-loading-overlay">
    <div class="lz-loading-content">
      <div class="lz-loading-logo">
        <div class="lz-logo-mark">
          <svg width="32" height="32" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L1 4.5L8 8L15 4.5L8 1Z" fill="white" fill-opacity=".9"/>
            <path d="M1 4.5V11.5L8 15L15 11.5V4.5" stroke="white" stroke-opacity=".6" stroke-width="1.2" fill="none"/>
          </svg>
        </div>
        <span class="lz-logo-text">Lezie</span>
      </div>
      <div class="lz-spinner"></div>
      <p>Verifying access...</p>
    </div>
  </div>
{/if}

<!-- FLOATING ACTION BUTTON -->
<a href="/auth/report" class="lz-fab" aria-label="Report an incident">
  <FlagTriangleRight size={20} />
  <span>Report incident</span>
</a>

<!-- HERO -->
<section id="home" class="lz-hero">
  <div class="lz-hero-content">
    <div class="lz-badge animate-on-scroll">
      <ShieldCheck size={14} />
      Community safety platform
    </div>

    <h1 class="lz-hero-title animate-on-scroll">
      Keep your community<br>
      <span class="lz-violet-text">safe &amp; connected</span>
    </h1>

    <p class="lz-hero-desc animate-on-scroll">
      Real-time incident reporting, AI-powered threat detection, and community-driven
      safety alerts. Join thousands creating safer neighbourhoods together.
    </p>

    <div class="lz-hero-btns animate-on-scroll">
      <a href="/signup" class="lz-btn-primary">
        Get started free
        <ArrowRight size={16} />
      </a>
      <button type="button" class="lz-btn-secondary" onclick={() => scrollToSection('how-it-works')}>
        <PlayCircle size={16} />
        See how it works
      </button>
    </div>

    <div class="lz-stats animate-on-scroll">
      <div class="lz-stat">
        <span class="lz-stat-n">10K+</span>
        <span class="lz-stat-l">Active users</span>
      </div>
      <div class="lz-stat-sep"></div>
      <div class="lz-stat">
        <span class="lz-stat-n">500+</span>
        <span class="lz-stat-l">Communities</span>
      </div>
      <div class="lz-stat-sep"></div>
      <div class="lz-stat">
        <span class="lz-stat-n">98%</span>
        <span class="lz-stat-l">Response rate</span>
      </div>
    </div>
  </div>

  <div class="lz-hero-visual animate-on-scroll">
    <div class="lz-map-card">
      <div class="lz-map-topbar">
        <MapPin size={14} style="color:var(--primary-color)" />
        <span>Live incident map</span>
        <span class="lz-live-dot"></span>
        <span style="font-size:.75rem;color:var(--primary-color);font-weight:600">Live</span>
      </div>
      <div class="lz-map-grid">
        {#each Array(54) as _, i}
          <div class="lz-mc {i % 7 === 0 ? 'h' : (i % 5 === 0 ? 'w' : '')}"></div>
        {/each}
      </div>
      <div class="lz-map-pins">
        <div class="lz-pin p1"></div>
        <div class="lz-pin p2"></div>
        <div class="lz-pin p3"></div>
      </div>
      <div class="lz-map-legend">
        <div class="lz-leg-item"><span class="lz-leg-dot" style="background:var(--primary-color)"></span>Active</div>
        <div class="lz-leg-item"><span class="lz-leg-dot" style="background:var(--primary-light)"></span>Recent</div>
        <div class="lz-leg-item"><span class="lz-leg-dot" style="background:var(--primary-bg)"></span>Monitored</div>
      </div>
      <div style="margin-top: 1rem; text-align: center;">
        <a href="/auth/report" style="display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--primary-color); text-decoration: none;">
          <FlagTriangleRight size={14} />
          Report incident on this map
        </a>
      </div>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section id="features" class="lz-section lz-section-alt">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Features</span>
      <h2>Powerful tools for community safety</h2>
      <p>Everything you need to keep your neighbourhood safe and informed</p>
    </div>

    <div class="lz-feat-grid">
      <!-- Your existing feature cards here (unchanged) -->
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Radio size={22} style="color:var(--primary-color)" /></div>
        <h3>Real-time incident reporting</h3>
        <p>Report incidents instantly with photos, videos, and precise location tracking. Get immediate alerts to nearby community members.</p>
        <a href="/auth/report" style="display: inline-block; margin-top: 1rem; font-size: 0.8rem; color: var(--primary-color); text-decoration: none; font-weight: 500;">Report now →</a>
      </div>
      <!-- Repeat the other 5 cards exactly as in your pasted file -->
    </div>
  </div>
</section>

<!-- HOW IT WORKS, SAFETY TIPS, CTA, and FOOTER sections remain exactly as you provided in the pasted file. -->

<!-- Custom Loading Styles + your existing <style> block -->
<style>
  :global(:root) {
    --primary-color: #6a2c91;   /* Adjust if your design uses a different primary */
    --primary-light: #9b4fcc;
    --primary-bg: #f5f3ff;
  }

  .lz-loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.98);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .lz-loading-content {
    text-align: center;
  }

  .lz-loading-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
    justify-content: center;
  }

  .lz-logo-mark {
    width: 48px;
    height: 48px;
    background: var(--primary-color);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lz-logo-text {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
  }

  .lz-spinner {
    width: 56px;
    height: 56px;
    border: 6px solid #f3f3f3;
    border-top: 6px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1.25rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .lz-loading-overlay p {
    color: #6b7280;
    font-size: 1rem;
  }

</style>