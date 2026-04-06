<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    ShieldCheck, ArrowRight, PlayCircle, MapPin, Radio, Cpu, BadgeCheck, 
    Map, EyeOff, BellRing, Smartphone, BrainCircuit, Megaphone, ScanEye, 
    Users, LockKeyhole, FlagTriangleRight, PhoneCall, MessageCircle, X, Menu,
    Award, Trophy, Target
  } from 'lucide-svelte';

  let isMenuOpen = $state(false);

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    isMenuOpen = false;
  };
</script>

<svelte:head>
  <title>Lezie — Real-Time Community Safety</title>
  <meta name="description" content="Join thousands protecting their neighborhoods with real-time alerts, incident reporting, and fun safety games." />
</svelte:head>

<!-- Floating Action Button -->
<a href="/report" class="lz-fab">
  <FlagTriangleRight size={20} />
  <span>Report Incident</span>
</a>

<!-- NAV -->
<nav class="lz-nav"> ... (your existing nav, unchanged) </nav>

<!-- HERO - More Powerful -->
<section id="home" class="lz-hero">
  <div class="lz-hero-content">
    <div class="lz-badge animate-on-scroll">
      <ShieldCheck size={16} /> Trusted by 10,000+ community members
    </div>

    <h1 class="lz-hero-title animate-on-scroll">
      Safer neighborhoods.<br>
      <span class="lz-violet-text">Together.</span>
    </h1>

    <p class="lz-hero-desc animate-on-scroll">
      Real-time incident reporting • AI threat detection • Instant community alerts • 
      <strong>Safety games that actually teach</strong>
    </p>

    <div class="lz-hero-btns animate-on-scroll">
      <a href="/signup" class="lz-btn-primary">
        Join Free
        <ArrowRight size={18} />
      </a>
      <button onclick={() => scrollToSection('safety-quest')} class="lz-btn-secondary">
        <Trophy size={18} />
        Play Safety Quest
      </button>
    </div>

    <div class="lz-stats animate-on-scroll">
      <div class="lz-stat"><span class="lz-stat-n">98.4%</span><span class="lz-stat-l">Response Rate</span></div>
      <div class="lz-stat-sep"></div>
      <div class="lz-stat"><span class="lz-stat-n">12K+</span><span class="lz-stat-l">Lives Protected</span></div>
      <div class="lz-stat-sep"></div>
      <div class="lz-stat"><span class="lz-stat-n">4.9</span><span class="lz-stat-l">App Rating</span></div>
    </div>
  </div>

  <!-- Visual Side -->
  <div class="lz-hero-visual animate-on-scroll">
    <!-- Your map card + new badge -->
    <div class="lz-map-card" style="position:relative; overflow:hidden;">
      <div class="lz-map-topbar">Live Safety Map • 47 incidents today</div>
      <!-- ... your existing map grid and pins ... -->
      <div style="position:absolute; bottom:16px; right:16px; background:white; padding:8px 14px; border-radius:9999px; font-size:0.8rem; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        <span style="color:#10b981;">●</span> 312 people safe right now
      </div>
    </div>
  </div>
</section>

<!-- New Safety Games Section -->
<section id="safety-quest" class="lz-section" style="background: linear-gradient(135deg, #f3e8ff 0%, #f0f9ff 100%);">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Fun & Educational</span>
      <h2>Play Safety Quest</h2>
      <p>Learn life-saving skills while having fun. Challenge friends. Earn badges.</p>
    </div>

    <div class="lz-feat-grid">
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Trophy size={28} style="color:#eab308" /></div>
        <h3>Scenario Challenges</h3>
        <p>Real-life safety situations. Make the right decisions and earn points.</p>
        <a href="/safety-quest" class="lz-btn-outline">Start Playing →</a>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Target size={28} style="color:#22c55e" /></div>
        <h3>Daily Safety Quests</h3>
        <p>Complete quick missions like "Spot the Risk" or "Emergency Drill".</p>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Award size={28} style="color:#a855f7" /></div>
        <h3>Leaderboards & Badges</h3>
        <p>Compete with your community. Show off your safety champion badges.</p>
      </div>
    </div>
  </div>
</section>

<!-- Rest of your sections (Features, How it Works, Safety Tips) remain, but with better spacing and visual appeal -->

<!-- FOOTER - Clean & Professional -->
<footer class="lz-footer">
  <div class="lz-container">
    <div class="lz-foot-grid">
      <div>
        <div class="lz-foot-logo">Lezie</div>
        <p class="lz-foot-desc">Building safer communities, one alert at a time.</p>
      </div>

      <div class="lz-foot-col">
        <h4>Product</h4>
        <a href="/report" class="lz-foot-link">Report Incident</a>
        <a href="/dashboard" class="lz-foot-link">Dashboard</a>
        <a href="/safety-quest" class="lz-foot-link">Safety Quest</a>
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
        <a href="/privacy" class="lz-foot-link">Privacy</a>
        <a href="/terms" class="lz-foot-link">Terms</a>
      </div>
    </div>

    <div class="lz-foot-bottom">
      <p>&copy; 2026 Lezie. All rights reserved.</p>
    </div>
  </div>
</footer>