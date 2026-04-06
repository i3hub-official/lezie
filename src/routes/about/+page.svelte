<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    ChevronLeft,
    Home,
    Sparkles,
    Shield,
    Users,
    MapPin,
    Target,
    Zap,
    Globe,
    ArrowRight,
    Quote,
    ChevronRight,
    Heart
  } from 'lucide-svelte';

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '120+', label: 'Communities' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Every feature we build prioritizes the physical and digital safety of our community members.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'We believe the strongest neighborhoods are built on trust, transparency, and mutual support.'
    },
    {
      icon: Target,
      title: 'Precision & Speed',
      description: 'Real-time alerts and accurate location data ensure help arrives when and where it\'s needed.'
    },
    {
      icon: Globe,
      title: 'Inclusive Design',
      description: 'Our platform is accessible to everyone, regardless of technical ability or background.'
    }
  ];

  const milestones = [
    { year: '2022', title: 'Founded', desc: 'Lezie started with a simple idea: safer neighborhoods through technology' },
    { year: '2023', title: 'Beta Launch', desc: 'First 10 communities joined our pilot program' },
    { year: '2024', title: 'Series A', desc: 'Secured funding to expand nationwide' },
    { year: '2025', title: 'Growth', desc: 'Launched in 120+ communities across the country' }
  ];
</script>

<svelte:head>
  <title>About Us — Lezie</title>
  <meta name="description" content="Learn about Lezie's mission to create safer communities through real-time safety alerts and neighborhood connectivity." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="ab-page">

  <!-- LEFT PANEL -->
  <aside class="ab-panel">
    <div class="ab-panel-inner">
      <a href="/" class="ab-logo-link">
        <img src="/icons/lz_logo_t.png" alt="Lezie" class="ab-logo-img" />
      </a>

      <div class="ab-panel-hero">
        <div class="ab-panel-badge">
          <Sparkles size={14} />
          <span>Our Story</span>
        </div>
        <h2 class="ab-panel-headline">
          Building safer<br/>
          <em>communities together</em>
        </h2>
        <p class="ab-panel-desc">
          Lezie was born from a simple belief: everyone deserves to feel safe in their neighborhood. We're combining technology with human connection to make that a reality.
        </p>
      </div>

      <div class="ab-stats">
        {#each stats as stat}
          <div class="ab-stat-card">
            <div class="ab-stat-value">{stat.value}</div>
            <div class="ab-stat-label">{stat.label}</div>
          </div>
        {/each}
      </div>

      <div class="ab-panel-footer">
        <p>Trusted by communities worldwide</p>
      </div>
    </div>
    <div class="ab-panel-glow"></div>
  </aside>

  <!-- RIGHT PANEL -->
  <main class="ab-main">
    <div class="ab-form-shell">

      <button class="ab-back-home" onclick={() => goto('/')}>
        <ChevronLeft size={18} />
        <Home size={14} />
        <span>Back to Home</span>
      </button>

      <div class="ab-mobile-brand">
        <a href="/" class="ab-logo-link">
          <img src="/icons/lz_ico.png" alt="Lezie" class="ab-logo-img" />
        </a>
      </div>

      <div class="ab-form-header">
        <h1 class="ab-form-title">About Lezie</h1>
        <p class="ab-form-subtitle">Our mission, values, and the team behind it all</p>
      </div>

      <div class="ab-content">

        <!-- Mission Section -->
        <section class="ab-section">
          <div class="ab-welcome-message">
            <Target size={20} />
            <div>
              <strong>Our Mission</strong>
              <span>Why we built Lezie</span>
            </div>
          </div>
          
          <div class="ab-mission-block">
            <blockquote class="ab-quote">
              "To empower communities with real-time safety information and foster genuine neighborly connections that make every neighborhood a safer place to live."
            </blockquote>
            <p class="ab-mission-text">
              Lezie bridges the gap between traditional neighborhood watch programs and modern technology. We provide instant alerts, verified reports, and a secure platform where communities can organize, communicate, and protect one another.
            </p>
          </div>
        </section>

        <!-- Values Grid -->
        <section class="ab-section">
          <h3 class="ab-section-title">Our Core Values</h3>
          <div class="ab-values-grid">
            {#each values as value}
              <div class="ab-value-card">
                <div class="ab-value-icon">
                  <svelte:component this={value.icon} size={24} strokeWidth={1.5} />
                </div>
                <h4>{value.title}</h4>
                <p>{value.description}</p>
              </div>
            {/each}
          </div>
        </section>

        <!-- Timeline -->
        <section class="ab-section">
          <h3 class="ab-section-title">Our Journey</h3>
          <div class="ab-timeline">
            {#each milestones as milestone, i}
              <div class="ab-timeline-item" class:last={i === milestones.length - 1}>
                <div class="ab-timeline-dot"></div>
                <div class="ab-timeline-content">
                  <span class="ab-timeline-year">{milestone.year}</span>
                  <h4>{milestone.title}</h4>
                  <p>{milestone.desc}</p>
                </div>
              </div>
            {/each}
          </div>
        </section>

        <!-- CTA -->
        <section class="ab-section ab-cta-section">
          <div class="ab-cta-card">
            <h3>Ready to make your community safer?</h3>
            <p>Join thousands of neighborhoods already using Lezie to stay connected and protected.</p>
            <div class="ab-cta-actions">
              <button class="ab-btn-primary" onclick={() => goto('/signup')}>
                Get Started <ArrowRight size={16} />
              </button>
              <button class="ab-btn-secondary" onclick={() => goto('/contact')}>
                Contact Sales
              </button>
            </div>
          </div>
        </section>

      </div>

      <p class="ab-footer-text">
        Want to learn more? <a href="/contact" class="ab-link">Get in touch</a>
      </p>

    </div>
  </main>
</div>

<style>
  :global(.ab-page *) { 
    font-family: 'DM Sans', system-ui, sans-serif; 
    box-sizing: border-box; 
  }

  .ab-page { 
    display: flex; 
    min-height: 100vh; 
    background: #fafafa; 
  }

  /* LEFT PANEL */
  .ab-panel { 
    display: none; 
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 440px; 
    height: 100vh; 
    flex-shrink: 0; 
    background: #111827; 
    overflow: hidden; 
    overflow-y: auto; 
  }

  @media (min-width: 1024px) { 
    .ab-panel { display: flex; } 
    .ab-main { margin-left: 440px; } 
  }

  .ab-panel-inner { 
    position: relative; 
    z-index: 2; 
    display: flex; 
    flex-direction: column; 
    padding: 2.5rem; 
    min-height: 100%; 
  }

  .ab-panel-glow { 
    position: absolute; 
    inset: 0; 
    z-index: 1; 
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(106,44,145,0.15) 0%, transparent 70%); 
    pointer-events: none; 
  }

  .ab-logo-link { 
    display: inline-block; 
    line-height: 0; 
    margin-bottom: 2.5rem; 
    transition: opacity 0.2s; 
  }

  .ab-logo-link:hover { 
    opacity: 0.8; 
  }

  .ab-logo-img { 
    width: 48px; 
    height: 48px; 
    object-fit: contain; 
    display: block; 
    filter: brightness(0) invert(1); 
  }

  .ab-panel-badge { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.375rem 0.875rem; 
    background: rgba(255,255,255,0.05); 
    border: 1px solid rgba(255,255,255,0.1); 
    border-radius: 100px; 
    font-size: 0.75rem; 
    color: #9ca3af; 
    margin-bottom: 1.5rem; 
    font-weight: 500; 
  }

  .ab-panel-headline { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 2.5rem; 
    line-height: 1.15; 
    color: white; 
    margin-bottom: 1rem; 
    font-weight: 400; 
  }

  .ab-panel-headline em { 
    color: #a78bfa; 
    font-style: italic; 
  }

  .ab-panel-desc { 
    font-size: 0.9375rem; 
    line-height: 1.7; 
    color: #9ca3af; 
    margin-bottom: 2.5rem; 
    font-weight: 400; 
  }

  /* Stats - Minimal */
  .ab-stats { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 1px; 
    background: rgba(255,255,255,0.1); 
    border-radius: 0.75rem; 
    overflow: hidden; 
    margin-bottom: auto; 
  }

  .ab-stat-card { 
    background: rgba(255,255,255,0.03); 
    padding: 1.5rem 1rem; 
    text-align: center; 
    transition: background 0.2s; 
  }

  .ab-stat-card:hover { 
    background: rgba(255,255,255,0.05); 
  }

  .ab-stat-value { 
    font-size: 1.5rem; 
    font-weight: 600; 
    color: white; 
    margin-bottom: 0.25rem; 
    letter-spacing: -0.02em; 
  }

  .ab-stat-label { 
    font-size: 0.75rem; 
    color: #6b7280; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
  }

  .ab-panel-footer { 
    margin-top: 2rem; 
    padding-top: 1.5rem; 
    border-top: 1px solid rgba(255,255,255,0.1); 
  }

  .ab-panel-footer p { 
    font-size: 0.875rem; 
    color: #6b7280; 
  }

  /* RIGHT PANEL */
  .ab-main { 
    flex: 1; 
    display: flex; 
    align-items: flex-start; 
    justify-content: center; 
    padding: 2rem 1.25rem; 
    min-height: 100vh; 
    overflow-y: auto; 
  }

  .ab-form-shell { 
    width: 100%; 
    max-width: 640px; 
    display: flex; 
    flex-direction: column; 
    gap: 1.5rem; 
    padding-top: 1rem; 
  }

  .ab-back-home { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    background: white; 
    border: 1px solid #e5e7eb; 
    border-radius: 100px; 
    padding: 0.5rem 1rem; 
    font-size: 0.813rem; 
    font-weight: 500; 
    color: #6b7280; 
    cursor: pointer; 
    transition: all 0.2s; 
    width: fit-content; 
    box-shadow: 0 1px 2px rgba(0,0,0,0.05); 
  }

  .ab-back-home:hover { 
    border-color: #6a2c91; 
    color: #6a2c91; 
    background: #faf5ff; 
  }

  .ab-mobile-brand { 
    display: flex; 
    justify-content: center; 
  }

  .ab-mobile-brand .ab-logo-link { 
    margin-bottom: 0; 
  }

  .ab-mobile-brand .ab-logo-img { 
    width: 48px; 
    height: 48px; 
    filter: none; 
  }

  @media (min-width: 1024px) { 
    .ab-mobile-brand { display: none; } 
  }

  .ab-form-header { 
    text-align: center; 
    margin-bottom: 0.5rem; 
  }

  .ab-form-title { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: clamp(1.75rem, 4vw, 2.25rem); 
    color: #111827; 
    margin-bottom: 0.5rem; 
    letter-spacing: -0.02em; 
    font-weight: 400; 
  }

  .ab-form-subtitle { 
    font-size: 1rem; 
    color: #6b7280; 
    font-weight: 400; 
  }

  /* Content */
  .ab-content { 
    background: white; 
    border-radius: 1rem; 
    border: 1px solid #e5e7eb; 
    padding: clamp(1.5rem, 5vw, 2.5rem); 
    display: flex; 
    flex-direction: column; 
    gap: 3rem; 
  }

  .ab-section { 
    display: flex; 
    flex-direction: column; 
    gap: 1.25rem; 
  }

  .ab-welcome-message { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.75rem; 
    padding: 0.75rem 1rem; 
    background: #fafafa; 
    border: 1px solid #e5e7eb; 
    border-radius: 0.75rem; 
    width: fit-content; 
  }

  .ab-welcome-message :global(svg) { 
    color: #6a2c91; 
    flex-shrink: 0; 
  }

  .ab-welcome-message strong { 
    display: block; 
    font-size: 0.875rem; 
    font-weight: 600; 
    color: #111827; 
  }

  .ab-welcome-message span { 
    font-size: 0.75rem; 
    color: #6b7280; 
  }

  .ab-section-title { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.25rem; 
    color: #111827; 
    margin: 0; 
    font-weight: 400; 
  }

  /* Mission Block */
  .ab-mission-block { 
    display: flex; 
    flex-direction: column; 
    gap: 1rem; 
  }

  .ab-quote { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.25rem; 
    line-height: 1.5; 
    color: #374151; 
    margin: 0; 
    padding: 0; 
    font-style: italic; 
    position: relative; 
    padding-left: 1.5rem; 
    border-left: 2px solid #6a2c91; 
  }

  .ab-mission-text { 
    font-size: 0.9375rem; 
    line-height: 1.7; 
    color: #4b5563; 
    margin: 0; 
  }

  /* Values Grid - Minimal */
  .ab-values-grid { 
    display: grid; 
    grid-template-columns: repeat(2, 1fr); 
    gap: 1.5rem; 
  }

  @media (max-width: 640px) {
    .ab-values-grid { 
      grid-template-columns: 1fr; 
    }
  }

  .ab-value-card { 
    display: flex; 
    flex-direction: column; 
    gap: 0.75rem; 
    padding: 0; 
  }

  .ab-value-icon { 
    color: #6b7280; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    width: 40px; 
    height: 40px; 
  }

  .ab-value-card h4 { 
    font-size: 1rem; 
    font-weight: 600; 
    color: #111827; 
    margin: 0; 
  }

  .ab-value-card p { 
    font-size: 0.875rem; 
    line-height: 1.6; 
    color: #6b7280; 
    margin: 0; 
  }

  /* Timeline - Minimal */
  .ab-timeline { 
    position: relative; 
    padding-left: 1.5rem; 
  }

  .ab-timeline::before { 
    content: ''; 
    position: absolute; 
    left: 0; 
    top: 0.5rem; 
    bottom: 0.5rem; 
    width: 1px; 
    background: #e5e7eb; 
  }

  .ab-timeline-item { 
    position: relative; 
    padding-bottom: 2rem; 
  }

  .ab-timeline-item.last { 
    padding-bottom: 0; 
  }

  .ab-timeline-dot { 
    position: absolute; 
    left: -1.5rem; 
    top: 0.25rem; 
    width: 9px; 
    height: 9px; 
    background: white; 
    border: 1.5px solid #6a2c91; 
    border-radius: 50%; 
    margin-left: -4px; 
  }

  .ab-timeline-content { 
    display: flex; 
    flex-direction: column; 
    gap: 0.25rem; 
  }

  .ab-timeline-year { 
    font-size: 0.875rem; 
    font-weight: 600; 
    color: #6a2c91; 
    font-variant-numeric: tabular-nums; 
  }

  .ab-timeline-content h4 { 
    font-size: 1rem; 
    font-weight: 600; 
    color: #111827; 
    margin: 0; 
  }

  .ab-timeline-content p { 
    font-size: 0.875rem; 
    color: #6b7280; 
    margin: 0; 
    line-height: 1.5; 
  }

  /* CTA Section - Minimal */
  .ab-cta-section { 
    margin-top: 0.5rem; 
  }

  .ab-cta-card { 
    background: #fafafa; 
    border: 1px solid #e5e7eb; 
    border-radius: 0.75rem; 
    padding: 2rem; 
    display: flex; 
    flex-direction: column; 
    gap: 1.25rem; 
    text-align: center; 
  }

  .ab-cta-card h3 { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.375rem; 
    color: #111827; 
    margin: 0; 
    font-weight: 400; 
  }

  .ab-cta-card p { 
    font-size: 0.9375rem; 
    color: #6b7280; 
    margin: 0; 
    line-height: 1.6; 
    max-width: 400px; 
    margin-left: auto; 
    margin-right: auto; 
  }

  .ab-cta-actions { 
    display: flex; 
    gap: 0.75rem; 
    justify-content: center; 
    flex-wrap: wrap; 
  }

  .ab-btn-primary { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.75rem 1.5rem; 
    background: #111827; 
    color: white; 
    border: none; 
    border-radius: 0.5rem; 
    font-size: 0.875rem; 
    font-weight: 500; 
    cursor: pointer; 
    transition: all 0.2s; 
  }

  .ab-btn-primary:hover { 
    background: #374151; 
  }

  .ab-btn-secondary { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.75rem 1.5rem; 
    background: white; 
    color: #374151; 
    border: 1px solid #e5e7eb; 
    border-radius: 0.5rem; 
    font-size: 0.875rem; 
    font-weight: 500; 
    cursor: pointer; 
    transition: all 0.2s; 
  }

  .ab-btn-secondary:hover { 
    border-color: #111827; 
    color: #111827; 
  }

  /* Footer */
  .ab-footer-text { 
    text-align: center; 
    font-size: 0.875rem; 
    color: #6b7280; 
    margin-top: 0.5rem; 
  }

  .ab-link { 
    color: #6a2c91; 
    font-weight: 500; 
    text-decoration: none; 
  }

  .ab-link:hover { 
    text-decoration: underline; 
  }

  /* Responsive */
  @media (max-width: 640px) {
    .ab-main { 
      padding: 1.5rem 1rem; 
    }
    
    .ab-form-shell { 
      gap: 1.25rem; 
    }
    
    .ab-content { 
      border-radius: 0.75rem; 
      padding: 1.5rem; 
      gap: 2.5rem; 
    }
    
    .ab-quote { 
      font-size: 1.125rem; 
    }
    
    .ab-cta-actions { 
      flex-direction: column; 
    }
    
    .ab-btn-primary, 
    .ab-btn-secondary { 
      width: 100%; 
      justify-content: center; 
    }
    
    .ab-panel-headline { 
      font-size: 2rem; 
    }
  }
</style>
