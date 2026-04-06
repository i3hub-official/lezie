<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    ShieldCheck, ArrowRight, PlayCircle, MapPin, Radio, Cpu, BadgeCheck, 
    Map, EyeOff, BellRing, Smartphone, BrainCircuit, Megaphone, ScanEye, 
    Users, LockKeyhole, FlagTriangleRight, PhoneCall, MessageCircle, X, Menu,
    Trophy, Award, Target
  } from 'lucide-svelte';

  let isMenuOpen = $state(false);

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    isMenuOpen = false;
  };
</script>

<svelte:head>
  <title>Lezie — Real-Time Community Safety</title>
  <meta name="description" content="Real-time incident reporting, AI-powered alerts, and fun safety games to keep your community safe." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<!-- FLOATING ACTION BUTTON -->
<a href="/report" class="lz-fab" aria-label="Report an incident">
  <FlagTriangleRight size={20} />
  <span>Report Incident</span>
</a>

<!-- NAV -->
<nav class="lz-nav">
  <div class="lz-nav-inner">
    <button type="button" class="lz-logo" onclick={() => scrollToSection('home')}>
      <img src="/icons/lz_ico.png" alt="Lezie" class="lz-logo-img" width="32" height="32" />
      <span class="lz-logo-text">Lezie</span>
    </button>

    <button 
      type="button" 
      class="lz-hamburger" 
      onclick={() => isMenuOpen = !isMenuOpen}
    >
      {#if isMenuOpen}
        <X size={22} />
      {:else}
        <Menu size={22} />
      {/if}
    </button>

    <div class="lz-nav-links" class:open={isMenuOpen}>
      <button type="button" class="lz-nav-link" onclick={() => scrollToSection('features')}>Features</button>
      <button type="button" class="lz-nav-link" onclick={() => scrollToSection('how-it-works')}>How it Works</button>
      <button type="button" class="lz-nav-link" onclick={() => scrollToSection('safety-quest')}>Safety Games</button>
      <a href="/dashboard" class="lz-nav-cta">Dashboard</a>
    </div>
  </div>
</nav>

<!-- HERO -->
<section id="home" class="lz-hero">
  <div class="lz-hero-content">
    <div class="lz-badge animate-on-scroll">
      <ShieldCheck size={14} />
      Community safety platform
    </div>

    <h1 class="lz-hero-title animate-on-scroll">
      Keep your community<br>
      <span class="lz-violet-text">safe & connected</span>
    </h1>

    <p class="lz-hero-desc animate-on-scroll">
      Real-time incident reporting • AI threat detection • Instant alerts • 
      Fun safety games that teach real skills.
    </p>

    <div class="lz-hero-btns animate-on-scroll">
      <a href="/signup" class="lz-btn-primary">
        Get started free
        <ArrowRight size={16} />
      </a>
      <button onclick={() => scrollToSection('safety-quest')} class="lz-btn-secondary">
        <Trophy size={16} />
        Play Safety Quest
      </button>
    </div>

    <div class="lz-stats animate-on-scroll">
      <div class="lz-stat">
        <span class="lz-stat-n">12K+</span>
        <span class="lz-stat-l">Active users</span>
      </div>
      <div class="lz-stat-sep"></div>
      <div class="lz-stat">
        <span class="lz-stat-n">500+</span>
        <span class="lz-stat-l">Communities</span>
      </div>
      <div class="lz-stat-sep"></div>
      <div class="lz-stat">
        <span class="lz-stat-n">98.4%</span>
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
        <span style="font-size:0.75rem;color:var(--primary-color);font-weight:600">LIVE</span>
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
      </div>
    </div>
  </div>
</section>

<!-- SAFETY QUEST -->
<section id="safety-quest" class="lz-section" style="background: linear-gradient(135deg, #f3e8ff 0%, #f0f9ff 100%);">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Learn by Playing</span>
      <h2>Play Safety Quest</h2>
      <p>Fun interactive games that teach real safety skills. Earn badges and compete with friends.</p>
    </div>

    <div class="lz-feat-grid">
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Trophy size={28} style="color:#eab308" /></div>
        <h3>Real-Life Scenarios</h3>
        <p>Face realistic emergencies and make critical decisions.</p>
        <a href="/safety-quest" class="lz-btn-outline">Start Playing →</a>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Target size={28} style="color:#22c55e" /></div>
        <h3>Daily Quests</h3>
        <p>Quick missions to sharpen your safety instincts.</p>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Award size={28} style="color:#a855f7" /></div>
        <h3>Leaderboards & Badges</h3>
        <p>Compete and show off your safety achievements.</p>
      </div>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section id="features" class="lz-section lz-section-alt">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Features</span>
      <h2>Powerful tools for safer communities</h2>
    </div>
    <!-- Your existing features grid remains here -->
    <div class="lz-feat-grid">
      <!-- ... All your feature cards ... -->
    </div>
  </div>
</section>

<!-- HOW IT WORKS, SAFETY TIPS sections remain as in your original -->

<!-- CTA -->
<section class="lz-section">
  <div class="lz-container">
    <div class="lz-cta animate-on-scroll">
      <h2>Ready to protect your community?</h2>
      <p>Join thousands already making their neighbourhoods safer.</p>
      <div class="lz-cta-btns">
        <a href="/signup" class="lz-btn-primary lz-btn-lg">Get Started Free</a>
        <a href="/report" class="lz-btn-outline-lg">Report an Incident</a>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="lz-footer">
  <div class="lz-container">
    <div class="lz-foot-grid">
      <div>
        <div class="lz-foot-logo">Lezie</div>
        <p class="lz-foot-desc">Making communities safer through technology and collective action.</p>
      </div>

      <div class="lz-foot-col">
        <h4>Company</h4>
        <a href="/about" class="lz-foot-link">About Us</a>
        <a href="/contact" class="lz-foot-link">Contact</a>
      </div>

      <div class="lz-foot-col">
        <h4>Resources</h4>
        <a href="/faq" class="lz-foot-link">FAQ</a>
        <a href="/safety-guidelines" class="lz-foot-link">Safety Guidelines</a>
      </div>

      <div class="lz-foot-col">
        <h4>Legal</h4>
        <a href="/privacy" class="lz-foot-link">Privacy Policy</a>
        <a href="/terms" class="lz-foot-link">Terms of Service</a>
      </div>
    </div>

    <div class="lz-foot-bottom">
      <p>&copy; 2026 Lezie. All rights reserved.</p>
    </div>
  </div>
</footer>

<style>
  
</style>