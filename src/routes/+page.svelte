<script lang="ts">
  import { onMount } from 'svelte';
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
    Menu
  } from 'lucide-svelte';

  // Fix: Use $state() for reactive variable
  let isMenuOpen = $state(false);

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    isMenuOpen = false;
  };
</script>

<svelte:head>
  <title>Lezie - Community Safety Platform</title>
  <meta name="description" content="Empower your community with real-time safety alerts, incident reporting, and AI-powered threat detection." />
  <meta property="og:title" content="Lezie - Community Safety Platform" />
  <meta property="og:type" content="website" />
</svelte:head>

<!-- ── NAV ─────────────────────────────────────────────────── -->
<nav class="lz-nav">
  <div class="lz-nav-inner">
    <button type="button" class="lz-logo" onclick={() => scrollToSection('home')}>
      <div class="lz-logo-mark">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L1 4.5L8 8L15 4.5L8 1Z" fill="white" fill-opacity=".95"/>
          <path d="M1 4.5V11.5L8 15L15 11.5V4.5" stroke="white" stroke-opacity=".6" stroke-width="1.2" fill="none"/>
          <circle cx="8" cy="8.5" r="1.3" fill="white" fill-opacity=".4"/>
        </svg>
      </div>
      <span class="lz-logo-text">Lezie</span>
    </button>

    <button class="lz-hamburger" onclick={() => isMenuOpen = !isMenuOpen} aria-label="Toggle menu">
      {#if isMenuOpen}
        <X size={22} />
      {:else}
        <Menu size={22} />
      {/if}
    </button>

    <div class="lz-nav-links" class:open={isMenuOpen}>
      <button type="button" class="lz-nav-link" onclick={() => scrollToSection('features')}>Features</button>
      <button type="button" class="lz-nav-link" onclick={() => scrollToSection('how-it-works')}>How it works</button>
      <button type="button" class="lz-nav-link" onclick={() => scrollToSection('safety-tips')}>Safety tips</button>
      <a href="/dashboard" class="lz-nav-cta">Dashboard</a>
    </div>
  </div>
</nav>

<!-- ── HERO ────────────────────────────────────────────────── -->
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
      <a href="/auth/signup" class="lz-btn-primary">
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
      <div class="lz-map-grid" id="mapGrid"></div>
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
    </div>
  </div>
</section>

<!-- ── FEATURES ───────────────────────────────────────────── -->
<section id="features" class="lz-section lz-section-alt">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Features</span>
      <h2>Powerful tools for community safety</h2>
      <p>Everything you need to keep your neighbourhood safe and informed</p>
    </div>

    <div class="lz-feat-grid">
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Radio size={22} style="color:var(--primary-color)" /></div>
        <h3>Real-time incident reporting</h3>
        <p>Report incidents instantly with photos, videos, and precise location tracking. Get immediate alerts to nearby community members.</p>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Cpu size={22} style="color:var(--primary-color)" /></div>
        <h3>AI-powered threat detection</h3>
        <p>Advanced AI analyses reports to identify patterns, predict high-risk areas, and provide threat scores for better decision-making.</p>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><BadgeCheck size={22} style="color:var(--primary-color)" /></div>
        <h3>Community verification</h3>
        <p>Trust through transparency. Community members and authorities can verify reports, ensuring accurate and reliable information.</p>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Map size={22} style="color:var(--primary-color)" /></div>
        <h3>Real-time heatmaps</h3>
        <p>Visualise incident patterns with interactive heatmaps. Identify high-risk areas and stay informed about safety trends in your area.</p>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><EyeOff size={22} style="color:var(--primary-color)" /></div>
        <h3>Anonymous reporting</h3>
        <p>Report safely and securely with optional anonymity. Your identity remains protected while helping your community stay safe.</p>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><BellRing size={22} style="color:var(--primary-color)" /></div>
        <h3>Instant alerts</h3>
        <p>Receive real-time notifications about incidents in your area. Customise alert radius and severity levels to suit your needs.</p>
      </div>
    </div>
  </div>
</section>

<!-- ── HOW IT WORKS ───────────────────────────────────────── -->
<section id="how-it-works" class="lz-section">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Simple process</span>
      <h2>How Lezie works</h2>
      <p>Three simple steps to safer communities</p>
    </div>

    <div class="lz-steps">
      <div class="lz-step animate-on-scroll">
        <div class="lz-step-num">1</div>
        <div class="lz-step-ico"><Smartphone size={28} style="color:var(--primary-color)" /></div>
        <h3>Report an incident</h3>
        <p>Quickly report incidents with details, photos, and location. Choose to report anonymously or with your identity.</p>
        <div class="lz-bdg-row">
          <span class="lz-bdg">"Suspicious activity on Main St"</span>
        </div>
      </div>
      <div class="lz-step animate-on-scroll">
        <div class="lz-step-num">2</div>
        <div class="lz-step-ico"><BrainCircuit size={28} style="color:var(--primary-color)" /></div>
        <h3>AI analysis &amp; verification</h3>
        <p>Our AI analyses the report for threat level and credibility. Community members and authorities verify information.</p>
        <div class="lz-bdg-row">
          <span class="lz-bdg lz-bdg-danger">High severity detected</span>
          <span class="lz-bdg">Community verified</span>
        </div>
      </div>
      <div class="lz-step animate-on-scroll">
        <div class="lz-step-num">3</div>
        <div class="lz-step-ico"><Megaphone size={28} style="color:var(--primary-color)" /></div>
        <h3>Alert &amp; response</h3>
        <p>Nearby community members receive instant alerts. Authorities are notified for critical incidents requiring immediate attention.</p>
        <div class="lz-bdg-row">
          <span class="lz-bdg">Alert sent to 500+ nearby users</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── SAFETY TIPS ────────────────────────────────────────── -->
<section id="safety-tips" class="lz-section lz-section-alt">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Safety first</span>
      <h2>Essential safety tips</h2>
      <p>Expert advice to help you stay safe in your community</p>
    </div>

    <div class="lz-tips-grid">
      <div class="lz-tip animate-on-scroll">
        <div class="lz-tip-ico"><ScanEye size={24} style="color:var(--primary-color)" /></div>
        <h3>Stay alert</h3>
        <p>Always be aware of your surroundings. Trust your instincts — if something feels wrong, it probably is.</p>
      </div>
      <div class="lz-tip animate-on-scroll">
        <div class="lz-tip-ico"><Users size={24} style="color:var(--primary-color)" /></div>
        <h3>Travel in groups</h3>
        <p>There's safety in numbers. When possible, travel with others, especially during late hours.</p>
      </div>
      <div class="lz-tip animate-on-scroll">
        <div class="lz-tip-ico"><MapPin size={24} style="color:var(--primary-color)" /></div>
        <h3>Share your location</h3>
        <p>Use Lezie to share your location with trusted contacts. Enable real-time tracking for peace of mind.</p>
      </div>
      <div class="lz-tip animate-on-scroll">
        <div class="lz-tip-ico"><LockKeyhole size={24} style="color:var(--primary-color)" /></div>
        <h3>Secure your home</h3>
        <p>Always lock doors and windows. Consider security cameras and proper lighting around your property.</p>
      </div>
      <div class="lz-tip animate-on-scroll">
        <div class="lz-tip-ico"><FlagTriangleRight size={24} style="color:var(--primary-color)" /></div>
        <h3>Report suspicious activity</h3>
        <p>Don't hesitate to report suspicious behaviour. Your report could prevent a crime and help others.</p>
      </div>
      <div class="lz-tip animate-on-scroll">
        <div class="lz-tip-ico"><PhoneCall size={24} style="color:var(--primary-color)" /></div>
        <h3>Know emergency numbers</h3>
        <p>Save local emergency contacts. In critical situations, always call emergency services first.</p>
      </div>
    </div>
  </div>
</section>

<!-- ── CTA ─────────────────────────────────────────────────── -->
<section class="lz-section">
  <div class="lz-container">
    <div class="lz-cta animate-on-scroll">
      <h2>Ready to make your community safer?</h2>
      <p>Join thousands of users already using Lezie to protect their neighbourhoods.</p>
      <div class="lz-cta-btns">
        <a href="/auth/signup" class="lz-btn-primary lz-btn-lg">
          Get started for free
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ── FOOTER ─────────────────────────────────────────────── -->
<footer class="lz-footer">
  <div class="lz-container">
    <div class="lz-foot-grid">
      <div>
        <div class="lz-foot-logo">
          <div class="lz-logo-mark" style="width:26px;height:26px;border-radius:6px">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L1 4.5L8 8L15 4.5L8 1Z" fill="white" fill-opacity=".9"/>
              <path d="M1 4.5V11.5L8 15L15 11.5V4.5" stroke="white" stroke-opacity=".6" stroke-width="1.2" fill="none"/>
            </svg>
          </div>
          Lezie
        </div>
        <p class="lz-foot-desc">Making communities safer through technology and collective action.</p>
        <div class="lz-socials">
          <button type="button" class="lz-soc" aria-label="X / Twitter">
            <Twitter size={15} />
          </button>
          <button type="button" class="lz-soc" aria-label="Discord">
            <MessageCircle size={15} />
          </button>
        </div>
      </div>

      <div class="lz-foot-col">
        <h4>Product</h4>
        <button type="button" class="lz-foot-link" onclick={() => scrollToSection('features')}>Features</button>
        <button type="button" class="lz-foot-link" onclick={() => scrollToSection('how-it-works')}>How it works</button>
        <a href="/dashboard" class="lz-foot-link">Dashboard</a>
      </div>

      <div class="lz-foot-col">
        <h4>Company</h4>
        <button type="button" class="lz-foot-link">About us</button>
        <button type="button" class="lz-foot-link">Contact</button>
      </div>

      <div class="lz-foot-col">
        <h4>Resources</h4>
        <button type="button" class="lz-foot-link">Help centre</button>
        <button type="button" class="lz-foot-link" onclick={() => scrollToSection('safety-tips')}>Safety tips</button>
        <button type="button" class="lz-foot-link">Privacy policy</button>
        <button type="button" class="lz-foot-link">Terms of service</button>
      </div>
    </div>

    <div class="lz-foot-bottom">
      <p>&copy; 2025 Lezie. All rights reserved.</p>
    </div>
  </div>
</footer>