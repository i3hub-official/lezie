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
    ChevronRight,
    Sparkles,
    Zap,
    Globe,
    Heart,
    Star,
    Award,
    TrendingUp,
    Activity,
    Shield,
    AlertTriangle
  } from 'lucide-svelte';

  let isMenuOpen = $state(false);
  let isAuthenticated = $state(false);
  let isLoading = $state(true);

  onMount(() => {
    // Check authentication status
    const unsubscribe = authStore.subscribe((state) => {
      isAuthenticated = !!state.user;
      isLoading = false;
    });
    
    // Intersection observer for animations
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
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      goto('/dashboard');
    } else {
      goto('/auth/signup');
    }
  };
</script>

<svelte:head>
  <title>Lezie - Community Safety Platform</title>
  <meta name="description" content="Empower your community with real-time safety alerts, incident reporting, and AI-powered threat detection." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet" />
</svelte:head>

<!-- ── FLOATING ACTION BUTTON (REPORT INCIDENT) ── -->
{#if !isLoading}
  <button class="lz-fab" onclick={() => goto('/auth/report')} aria-label="Report an incident">
    <FlagTriangleRight size={20} />
    <span>Report incident</span>
  </button>
{/if}

<!-- ── NAV ─────────────────────────────────────────────────── -->
<nav class="lz-nav">
  <div class="lz-nav-inner">
    <button type="button" class="lz-logo" onclick={() => scrollToSection('home')}>
      <div class="lz-logo-mark">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L1 4.5L8 8L15 4.5L8 1Z" fill="white" fill-opacity=".9"/>
          <path d="M1 4.5V11.5L8 15L15 11.5V4.5" stroke="white" stroke-opacity=".6" stroke-width="1.2" fill="none"/>
        </svg>
      </div>
      <span class="lz-logo-text">Lezie</span>
    </button>

    <button class="lz-hamburger" onclick={() => isMenuOpen = !isMenuOpen} aria-label="Toggle menu">
      {#if isMenuOpen}
        <X size={24} />
      {:else}
        <Menu size={24} />
      {/if}
    </button>

    <div class="lz-nav-links" class:open={isMenuOpen}>
      <button type="button" class="lz-nav-link" onclick={() => scrollToSection('features')}>Features</button>
      <button type="button" class="lz-nav-link" onclick={() => scrollToSection('how-it-works')}>How it works</button>
      <button type="button" class="lz-nav-link" onclick={() => scrollToSection('safety-tips')}>Safety tips</button>
      {#if isAuthenticated}
        <button class="lz-nav-link" onclick={() => goto('/dashboard')}>Dashboard</button>
        <button class="lz-nav-link" onclick={() => goto('/auth/report')}>Report</button>
        <button class="lz-nav-link" onclick={() => authStore.logout()}>Sign Out</button>
      {:else}
        <a href="/auth/signin" class="lz-nav-link">Sign In</a>
        <a href="/auth/signup" class="lz-nav-cta">Get Started</a>
      {/if}
    </div>
  </div>
</nav>

<!-- ── HERO SECTION ────────────────────────────────────────────────── -->
<section id="home" class="lz-hero">
  <div class="lz-hero-grid">
    <div class="lz-hero-content">
      <div class="lz-badge animate-on-scroll">
        <ShieldCheck size={14} />
        Community safety platform
        <span class="lz-badge-new">NEW</span>
      </div>

      <h1 class="lz-hero-title animate-on-scroll">
        Keep your community<br>
        <span class="lz-gradient-text">safe & connected</span>
      </h1>

      <p class="lz-hero-desc animate-on-scroll">
        Real-time incident reporting, AI-powered threat detection, and community-driven
        safety alerts. Join thousands creating safer neighbourhoods together.
      </p>

      <div class="lz-hero-btns animate-on-scroll">
        <button class="lz-btn-primary" onclick={handleGetStarted}>
          {#if isAuthenticated}
            Go to Dashboard
          {:else}
            Get started free
          {/if}
          <ArrowRight size={16} />
        </button>
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
      
      <div class="lz-trust-badge animate-on-scroll">
        <div class="lz-trust-icons">
          <Shield size={12} />
          <Shield size={12} />
          <Shield size={12} />
        </div>
        <span>Trusted by local authorities</span>
      </div>
    </div>

    <div class="lz-hero-visual animate-on-scroll">
      <div class="lz-map-card">
        <div class="lz-map-topbar">
          <MapPin size={14} style="color:var(--primary-color)" />
          <span>Live incident map</span>
          <span class="lz-live-dot"></span>
          <span style="font-size:.7rem;color:var(--primary-color);font-weight:600">24/7 Monitoring</span>
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
          <div class="lz-pin p4"></div>
        </div>
        <div class="lz-map-legend">
          <div class="lz-leg-item"><span class="lz-leg-dot" style="background:#EF4444"></span>Critical</div>
          <div class="lz-leg-item"><span class="lz-leg-dot" style="background:#F59E0B"></span>High</div>
          <div class="lz-leg-item"><span class="lz-leg-dot" style="background:var(--primary-color)"></span>Active</div>
          <div class="lz-leg-item"><span class="lz-leg-dot" style="background:var(--primary-light)"></span>Recent</div>
        </div>
        <button class="lz-map-cta" onclick={() => goto('/auth/report')}>
          <FlagTriangleRight size={14} />
          Report incident on this map
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  </div>
</section>

<!-- ── FEATURES ───────────────────────────────────────────── -->
<section id="features" class="lz-section lz-section-alt">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Why choose Lezie</span>
      <h2>Powerful tools for <span class="lz-gradient-text">community safety</span></h2>
      <p>Everything you need to keep your neighbourhood safe and informed</p>
    </div>

    <div class="lz-feat-grid">
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Radio size={22} style="color:var(--primary-color)" /></div>
        <h3>Real-time incident reporting</h3>
        <p>Report incidents instantly with photos, videos, and precise location tracking. Get immediate alerts to nearby community members.</p>
        <div class="lz-feat-badge">Instant</div>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Cpu size={22} style="color:var(--primary-color)" /></div>
        <h3>AI-powered threat detection</h3>
        <p>Advanced AI analyses reports to identify patterns, predict high-risk areas, and provide threat scores for better decision-making.</p>
        <div class="lz-feat-badge">Smart</div>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><BadgeCheck size={22} style="color:var(--primary-color)" /></div>
        <h3>Community verification</h3>
        <p>Trust through transparency. Community members and authorities can verify reports, ensuring accurate and reliable information.</p>
        <div class="lz-feat-badge">Verified</div>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Map size={22} style="color:var(--primary-color)" /></div>
        <h3>Real-time heatmaps</h3>
        <p>Visualise incident patterns with interactive heatmaps. Identify high-risk areas and stay informed about safety trends.</p>
        <div class="lz-feat-badge">Visual</div>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><EyeOff size={22} style="color:var(--primary-color)" /></div>
        <h3>Anonymous reporting</h3>
        <p>Report safely and securely with optional anonymity. Your identity remains protected while helping your community stay safe.</p>
        <div class="lz-feat-badge">Private</div>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><BellRing size={22} style="color:var(--primary-color)" /></div>
        <h3>Instant alerts</h3>
        <p>Receive real-time notifications about incidents in your area. Customise alert radius and severity levels to suit your needs.</p>
        <div class="lz-feat-badge">Real-time</div>
      </div>
    </div>
  </div>
</section>

<!-- ── HOW IT WORKS ───────────────────────────────────────── -->
<section id="how-it-works" class="lz-section">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Simple process</span>
      <h2>How <span class="lz-gradient-text">Lezie</span> works</h2>
      <p>Three simple steps to safer communities</p>
    </div>

    <div class="lz-steps">
      <div class="lz-step animate-on-scroll">
        <div class="lz-step-number">1</div>
        <div class="lz-step-icon"><Smartphone size={28} /></div>
        <h3>Report an incident</h3>
        <p>Quickly report incidents with details, photos, and location. Choose to report anonymously or with your identity.</p>
        <div class="lz-step-example">"Suspicious activity on Main St"</div>
        <button class="lz-step-link" onclick={() => goto('/auth/report')}>
          Start reporting <ChevronRight size={14} />
        </button>
      </div>
      <div class="lz-step animate-on-scroll">
        <div class="lz-step-number">2</div>
        <div class="lz-step-icon"><BrainCircuit size={28} /></div>
        <h3>AI analysis & verification</h3>
        <p>Our AI analyses the report for threat level and credibility. Community members and authorities verify information.</p>
        <div class="lz-step-badges">
          <span class="lz-step-badge danger">High severity</span>
          <span class="lz-step-badge success">Verified</span>
        </div>
      </div>
      <div class="lz-step animate-on-scroll">
        <div class="lz-step-number">3</div>
        <div class="lz-step-icon"><Megaphone size={28} /></div>
        <h3>Alert & response</h3>
        <p>Nearby community members receive instant alerts. Authorities are notified for critical incidents requiring immediate attention.</p>
        <div class="lz-step-example">Alert sent to 500+ nearby users</div>
      </div>
    </div>
  </div>
</section>

<!-- ── STATISTICS ─────────────────────────────────────────── -->
<section class="lz-section lz-section-alt">
  <div class="lz-container">
    <div class="lz-stats-grid animate-on-scroll">
      <div class="lz-stat-card">
        <div class="lz-stat-card-icon">
          <TrendingUp size={24} />
        </div>
        <div class="lz-stat-card-value">47%</div>
        <div class="lz-stat-card-label">Crime reduction in active communities</div>
      </div>
      <div class="lz-stat-card">
        <div class="lz-stat-card-icon">
          <Activity size={24} />
        </div>
        <div class="lz-stat-card-value">2min</div>
        <div class="lz-stat-card-label">Average response time to reports</div>
      </div>
      <div class="lz-stat-card">
        <div class="lz-stat-card-icon">
          <Users size={24} />
        </div>
        <div class="lz-stat-card-value">10K+</div>
        <div class="lz-stat-card-label">Active community members</div>
      </div>
      <div class="lz-stat-card">
        <div class="lz-stat-card-icon">
          <Star size={24} />
        </div>
        <div class="lz-stat-card-value">4.9</div>
        <div class="lz-stat-card-label">User rating (App Store)</div>
      </div>
    </div>
  </div>
</section>

<!-- ── SAFETY TIPS ────────────────────────────────────────── -->
<section id="safety-tips" class="lz-section">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Safety first</span>
      <h2>Essential <span class="lz-gradient-text">safety tips</span></h2>
      <p>Expert advice to help you stay safe in your community</p>
    </div>

    <div class="lz-tips-grid">
      <div class="lz-tip animate-on-scroll">
        <div class="lz-tip-icon"><ScanEye size={22} /></div>
        <h3>Stay alert</h3>
        <p>Always be aware of your surroundings. Trust your instincts — if something feels wrong, it probably is.</p>
      </div>
      <div class="lz-tip animate-on-scroll">
        <div class="lz-tip-icon"><Users size={22} /></div>
        <h3>Travel in groups</h3>
        <p>There's safety in numbers. When possible, travel with others, especially during late hours.</p>
      </div>
      <div class="lz-tip animate-on-scroll">
        <div class="lz-tip-icon"><MapPin size={22} /></div>
        <h3>Share your location</h3>
        <p>Use Lezie to share your location with trusted contacts. Enable real-time tracking for peace of mind.</p>
      </div>
      <div class="lz-tip animate-on-scroll">
        <div class="lz-tip-icon"><LockKeyhole size={22} /></div>
        <h3>Secure your home</h3>
        <p>Always lock doors and windows. Consider security cameras and proper lighting around your property.</p>
      </div>
      <div class="lz-tip animate-on-scroll">
        <div class="lz-tip-icon"><FlagTriangleRight size={22} /></div>
        <h3>Report suspicious activity</h3>
        <p>Don't hesitate to report suspicious behaviour. Your report could prevent a crime and help others.</p>
      </div>
      <div class="lz-tip animate-on-scroll">
        <div class="lz-tip-icon"><PhoneCall size={22} /></div>
        <h3>Know emergency numbers</h3>
        <p>Save local emergency contacts. In critical situations, always call emergency services first.</p>
      </div>
    </div>
  </div>
</section>

<!-- ── TESTIMONIALS ───────────────────────────────────────── -->
<section class="lz-section lz-section-alt">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Testimonials</span>
      <h2>Trusted by <span class="lz-gradient-text">communities</span></h2>
      <p>What our users say about Lezie</p>
    </div>

    <div class="lz-testimonials">
      <div class="lz-testimonial animate-on-scroll">
        <div class="lz-testimonial-quote">"</div>
        <p>Lezie has transformed how our neighbourhood responds to safety concerns. The real-time alerts have made a huge difference.</p>
        <div class="lz-testimonial-author">
          <strong>Sarah Johnson</strong>
          <span>Community Leader, Maple Grove</span>
        </div>
      </div>
      <div class="lz-testimonial animate-on-scroll">
        <div class="lz-testimonial-quote">"</div>
        <p>The AI threat detection is incredibly accurate. We've been able to prevent several incidents thanks to early warnings.</p>
        <div class="lz-testimonial-author">
          <strong>Michael Chen</strong>
          <span>Neighborhood Watch Coordinator</span>
        </div>
      </div>
      <div class="lz-testimonial animate-on-scroll">
        <div class="lz-testimonial-quote">"</div>
        <p>Anonymous reporting feature gives our community confidence to speak up without fear. Game-changer for safety.</p>
        <div class="lz-testimonial-author">
          <strong>Dr. Emily Rodriguez</strong>
          <span>Community Safety Advocate</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── CTA ─────────────────────────────────────────────────── -->
<section class="lz-section">
  <div class="lz-container">
    <div class="lz-cta animate-on-scroll">
      <div class="lz-cta-icon">
        <ShieldCheck size={40} />
      </div>
      <h2>Ready to make your community safer?</h2>
      <p>Join thousands of users already using Lezie to protect their neighbourhoods.</p>
      <div class="lz-cta-btns">
        <button class="lz-btn-primary lz-btn-lg" onclick={handleGetStarted}>
          {#if isAuthenticated}
            Go to Dashboard
          {:else}
            Get started for free
          {/if}
          <ArrowRight size={16} />
        </button>
        <button class="lz-btn-outline-light" onclick={() => goto('/auth/report')}>
          <FlagTriangleRight size={16} />
          Report an incident
        </button>
      </div>
      <p class="lz-cta-note">No credit card required • Free for community members</p>
    </div>
  </div>
</section>

<!-- ── FOOTER ─────────────────────────────────────────────── -->
<footer class="lz-footer">
  <div class="lz-container">
    <div class="lz-foot-grid">
      <div class="lz-foot-brand">
        <div class="lz-foot-logo">
          <div class="lz-logo-mark" style="width:26px;height:26px;border-radius:6px; background: var(--primary-color); display: flex; align-items: center; justify-content: center;">
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
            <X size={14} />
          </button>
          <button type="button" class="lz-soc" aria-label="Discord">
            <MessageCircle size={14} />
          </button>
        </div>
      </div>

      <div class="lz-foot-col">
        <h4>Product</h4>
        <button type="button" class="lz-foot-link" onclick={() => scrollToSection('features')}>Features</button>
        <button type="button" class="lz-foot-link" onclick={() => scrollToSection('how-it-works')}>How it works</button>
        <button class="lz-foot-link" onclick={() => goto('/dashboard')}>Dashboard</button>
        <button class="lz-foot-link" onclick={() => goto('/auth/report')}>Report incident</button>
      </div>

      <div class="lz-foot-col">
        <h4>Company</h4>
        <button type="button" class="lz-foot-link">About us</button>
        <button type="button" class="lz-foot-link">Contact</button>
        <button type="button" class="lz-foot-link">Careers</button>
        <button type="button" class="lz-foot-link">Press</button>
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

<style>
  :root {
    --primary-color: #6a2c91;
    --primary-dark: #4b1d68;
    --primary-light: #9b4fcc;
    --primary-bg: #f5f3ff;
    --primary-border: #ddd6fe;
    --success-color: #10B981;
    --warning-color: #F59E0B;
    --danger-color: #EF4444;
    --dark-color: #111827;
    --light-color: #F9FAFB;
    --gray-color: #6B7280;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: var(--dark-color);
    overflow-x: hidden;
    background: white;
  }

  /* Navigation */
  .lz-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--primary-border);
  }

  .lz-nav-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .lz-logo {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-dark);
  }

  .lz-logo-mark {
    width: 32px;
    height: 32px;
    background: var(--primary-color);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lz-hamburger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: var(--dark-color);
  }

  .lz-nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .lz-nav-link {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--gray-color);
    transition: color 0.2s;
    padding: 0;
  }

  .lz-nav-link:hover {
    color: var(--primary-color);
  }

  .lz-nav-cta {
    background: var(--primary-color);
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    transition: background 0.2s;
  }

  .lz-nav-cta:hover {
    background: var(--primary-dark);
  }

  /* Hero Section */
  .lz-hero {
    max-width: 1400px;
    margin: 0 auto;
    padding: 5rem 2rem;
  }

  .lz-hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .lz-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    color: var(--primary-dark);
    padding: 0.375rem 0.875rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  .lz-badge-new {
    background: var(--primary-color);
    color: white;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    font-size: 0.625rem;
    margin-left: 0.5rem;
  }

  .lz-hero-title {
    font-size: clamp(2rem, 4.5vw, 3.5rem);
    font-weight: 800;
    line-height: 1.2;
    color: var(--dark-color);
    margin-bottom: 1.25rem;
  }

  .lz-gradient-text {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  .lz-hero-desc {
    font-size: 1rem;
    color: var(--gray-color);
    line-height: 1.6;
    margin-bottom: 2rem;
    max-width: 500px;
  }

  .lz-hero-btns {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2.5rem;
  }

  .lz-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 9999px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lz-btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }

  .lz-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 1.5px solid #e5e7eb;
    color: var(--gray-color);
    background: none;
    border-radius: 9999px;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lz-btn-secondary:hover {
    border-color: var(--primary-border);
    color: var(--primary-color);
  }

  .lz-stats {
    display: flex;
    gap: 2rem;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .lz-stat {
    display: flex;
    flex-direction: column;
  }

  .lz-stat-n {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--primary-color);
  }

  .lz-stat-l {
    font-size: 0.75rem;
    color: var(--gray-color);
  }

  .lz-stat-sep {
    width: 1px;
    height: 36px;
    background: #e5e7eb;
  }

  .lz-trust-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--gray-color);
  }

  .lz-trust-icons {
    display: flex;
    gap: 0.25rem;
    color: var(--success-color);
  }

  /* Map Card */
  .lz-map-card {
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    border-radius: 1.5rem;
    padding: 1.25rem;
    position: relative;
    overflow: hidden;
  }

  .lz-map-topbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--dark-color);
  }

  .lz-live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    margin-left: auto;
    animation: pulse 1.5s infinite;
  }

  .lz-map-grid {
    display: grid;
    grid-template-columns: repeat(18, 1fr);
    gap: 3px;
    margin-bottom: 1rem;
  }

  .lz-mc {
    height: 10px;
    border-radius: 2px;
    background: #ddd6fe;
  }

  .lz-mc.h {
    background: var(--primary-color);
    opacity: 0.85;
  }

  .lz-mc.w {
    background: var(--primary-light);
    opacity: 0.6;
  }

  .lz-map-pins {
    position: absolute;
    top: 2.5rem;
    left: 0;
    right: 0;
    bottom: 2.5rem;
    pointer-events: none;
  }

  .lz-pin {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--primary-color);
  }

  .lz-pin::after {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    border: 1.5px solid var(--primary-color);
    animation: ring 2s infinite;
  }

  .p1 { top: 42%; left: 42%; }
  .p2 { top: 60%; left: 60%; }
  .p3 { top: 28%; left: 70%; }
  .p4 { top: 75%; left: 30%; }

  .lz-map-legend {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .lz-leg-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.688rem;
    color: var(--gray-color);
  }

  .lz-leg-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .lz-map-cta {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: none;
    border: 1px solid var(--primary-border);
    border-radius: 0.5rem;
    font-size: 0.688rem;
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.2s;
  }

  .lz-map-cta:hover {
    background: white;
  }

  /* Features Section */
  .lz-section {
    padding: 5rem 2rem;
  }

  .lz-section-alt {
    background: var(--light-color);
  }

  .lz-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .lz-sec-head {
    text-align: center;
    margin-bottom: 3.5rem;
  }

  .lz-tag {
    display: inline-block;
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    color: var(--primary-dark);
    padding: 0.25rem 0.875rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .lz-sec-head h2 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--dark-color);
    margin-bottom: 0.75rem;
  }

  .lz-sec-head p {
    color: var(--gray-color);
    font-size: 0.875rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .lz-feat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .lz-feat-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.5rem;
    transition: all 0.2s;
    position: relative;
  }

  .lz-feat-card:hover {
    border-color: var(--primary-border);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(106, 44, 145, 0.08);
  }

  .lz-feat-icon {
    width: 48px;
    height: 48px;
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .lz-feat-card h3 {
    font-size: 1rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  .lz-feat-card p {
    font-size: 0.813rem;
    color: var(--gray-color);
    line-height: 1.6;
  }

  .lz-feat-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 0.625rem;
    font-weight: 600;
    padding: 0.125rem 0.5rem;
    background: #f3f4f6;
    border-radius: 0.5rem;
    color: #6b7280;
  }

  /* Steps */
  .lz-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .lz-step {
    text-align: center;
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
    background: white;
    transition: all 0.2s;
  }

  .lz-step:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .lz-step-number {
    width: 40px;
    height: 40px;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
    margin: 0 auto 1rem;
  }

  .lz-step-icon {
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .lz-step h3 {
    font-size: 1rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  .lz-step p {
    font-size: 0.813rem;
    color: var(--gray-color);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .lz-step-example {
    font-size: 0.688rem;
    color: var(--primary-color);
    background: var(--primary-bg);
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    display: inline-block;
  }

  .lz-step-badges {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .lz-step-badge {
    font-size: 0.625rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
  }

  .lz-step-badge.danger {
    background: #fee2e2;
    color: #dc2626;
  }

  .lz-step-badge.success {
    background: #d1fae5;
    color: #10b981;
  }

  .lz-step-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--primary-color);
    cursor: pointer;
    margin-top: 0.5rem;
  }

  /* Stats Grid */
  .lz-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .lz-stat-card {
    text-align: center;
    padding: 1.5rem;
    background: white;
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
  }

  .lz-stat-card-icon {
    width: 48px;
    height: 48px;
    background: var(--primary-bg);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: var(--primary-color);
  }

  .lz-stat-card-value {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--dark-color);
    margin-bottom: 0.25rem;
  }

  .lz-stat-card-label {
    font-size: 0.75rem;
    color: var(--gray-color);
  }

  /* Tips Grid */
  .lz-tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .lz-tip {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.2s;
  }

  .lz-tip:hover {
    transform: translateY(-4px);
    border-color: var(--primary-border);
  }

  .lz-tip-icon {
    width: 48px;
    height: 48px;
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: var(--primary-color);
  }

  .lz-tip h3 {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  .lz-tip p {
    font-size: 0.75rem;
    color: var(--gray-color);
    line-height: 1.6;
  }

  /* Testimonials */
  .lz-testimonials {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .lz-testimonial {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.5rem;
    position: relative;
  }

  .lz-testimonial-quote {
    font-size: 3rem;
    line-height: 1;
    color: var(--primary-color);
    opacity: 0.3;
    position: absolute;
    top: 0.5rem;
    left: 1rem;
  }

  .lz-testimonial p {
    font-size: 0.813rem;
    color: var(--dark-color);
    line-height: 1.6;
    margin-bottom: 1rem;
    padding-top: 1rem;
  }

  .lz-testimonial-author strong {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--dark-color);
  }

  .lz-testimonial-author span {
    font-size: 0.688rem;
    color: var(--gray-color);
  }

  /* CTA */
  .lz-cta {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 1.5rem;
    padding: 4rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .lz-cta-icon {
    margin-bottom: 1rem;
    color: white;
  }

  .lz-cta h2 {
    font-size: 2rem;
    font-weight: 800;
    color: white;
    margin-bottom: 0.75rem;
  }

  .lz-cta p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.875rem;
    margin-bottom: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .lz-cta-btns {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .lz-btn-lg {
    padding: 0.875rem 2rem;
    font-size: 0.875rem;
  }

  .lz-btn-outline-light {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.5);
    color: white;
    border-radius: 9999px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lz-btn-outline-light:hover {
    border-color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  .lz-cta-note {
    font-size: 0.688rem;
    opacity: 0.7;
    margin-bottom: 0;
  }

  /* Footer */
  .lz-footer {
    background: var(--dark-color);
    color: #9ca3af;
    padding: 4rem 2rem 2rem;
  }

  .lz-foot-grid {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
    margin-bottom: 2.5rem;
  }

  .lz-foot-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.75rem;
  }

  .lz-foot-desc {
    font-size: 0.75rem;
    line-height: 1.6;
    max-width: 250px;
    margin-bottom: 1rem;
  }

  .lz-socials {
    display: flex;
    gap: 0.5rem;
  }

  .lz-soc {
    width: 32px;
    height: 32px;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 0.5rem;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lz-soc:hover {
    border-color: var(--primary-light);
    color: var(--primary-light);
  }

  .lz-foot-col h4 {
    font-size: 0.75rem;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.875rem;
  }

  .lz-foot-link {
    display: block;
    color: #9ca3af;
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    text-align: left;
    transition: color 0.2s;
  }

  .lz-foot-link:hover {
    color: var(--primary-light);
  }

  .lz-foot-bottom {
    max-width: 1400px;
    margin: 0 auto;
    border-top: 1px solid #1f2937;
    padding-top: 1.5rem;
    font-size: 0.688rem;
    text-align: center;
  }

  /* FAB */
  .lz-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
    padding: 12px 20px;
    border-radius: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: 0 8px 20px rgba(106, 44, 145, 0.3);
    z-index: 1000;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .lz-fab:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(106, 44, 145, 0.4);
  }

  /* Animations */
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }

  @keyframes ring {
    0% { transform: scale(0.7); opacity: 0.7; }
    100% { transform: scale(2); opacity: 0; }
  }

  .animate-on-scroll {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .lz-hero-grid {
      gap: 2rem;
    }
    
    .lz-stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .lz-hero-grid {
      grid-template-columns: 1fr;
      text-align: center;
    }
    
    .lz-hero-desc {
      margin-left: auto;
      margin-right: auto;
    }
    
    .lz-hero-btns {
      justify-content: center;
    }
    
    .lz-stats {
      justify-content: center;
    }
    
    .lz-hamburger {
      display: flex;
    }
    
    .lz-nav-links {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      flex-direction: column;
      padding: 1rem;
      gap: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
    }
    
    .lz-nav-links.open {
      display: flex;
    }
    
    .lz-foot-grid {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    
    .lz-sec-head h2 {
      font-size: 1.5rem;
    }
    
    .lz-cta h2 {
      font-size: 1.5rem;
    }
    
    .lz-stats-grid {
      grid-template-columns: 1fr;
    }
    
    .lz-section {
      padding: 3rem 1rem;
    }
    
    .lz-hero {
      padding: 3rem 1rem;
    }
  }

  @media (max-width: 640px) {
    .lz-nav-inner {
      padding: 0.75rem 1rem;
    }
    
    .lz-foot-grid {
      grid-template-columns: 1fr;
    }
    
    .lz-cta-btns {
      flex-direction: column;
    }
    
    .lz-btn-outline-light {
      justify-content: center;
    }
    
    .lz-fab {
      padding: 10px 16px;
      bottom: 16px;
      right: 16px;
      font-size: 0.75rem;
    }
  }
</style>