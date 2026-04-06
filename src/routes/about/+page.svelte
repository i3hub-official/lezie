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
    Heart,
    Clock,
    Bell,
    ShieldCheck
  } from 'lucide-svelte';

  const stats = [
    { value: '50K+', label: 'Active Users', icon: Users },
    { value: '120+', label: 'Communities', icon: MapPin },
    { value: '99.9%', label: 'Uptime', icon: Zap },
    { value: '24/7', label: 'Support', icon: Heart }
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

      <div class="ab-features">
        <div class="ab-feature-card">
          <div class="ab-feature-icon"><Clock size={18} /></div>
          <div>
            <strong>Fast Response</strong>
            <span>We typically reply within 24 hours</span>
          </div>
        </div>
        <div class="ab-feature-card">
          <div class="ab-feature-icon"><Users size={18} /></div>
          <div>
            <strong>Real People</strong>
            <span>Talk to a dedicated team member</span>
          </div>
        </div>
        <div class="ab-feature-card">
          <div class="ab-feature-icon"><ShieldCheck size={18} /></div>
          <div>
            <strong>Privacy First</strong>
            <span>Your information is always protected</span>
          </div>
        </div>
      </div>

      <div class="ab-panel-footer">
        <div class="ab-avatars">
          <div class="ab-avatar" style="background: #c4b5fd"></div>
          <div class="ab-avatar" style="background: #a78bfa"></div>
          <div class="ab-avatar" style="background: #8b5cf6"></div>
          <div class="ab-avatar" style="background: #6a2c91"></div>
          <div class="ab-avatar-count">Support</div>
        </div>
        <p>Lezie Support Team</p>
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

      <div class="ab-card">

        <!-- Mission Section -->
        <div class="ab-step-body">
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
        </div>

        <!-- Values Grid -->
        <div class="ab-section">
          <h3 class="ab-section-title">Our Core Values</h3>
          <div class="ab-values-grid">
            {#each values as value}
              <div class="ab-value-card">
                <div class="ab-value-icon">
                  <svelte:component this={value.icon} size={20} />
                </div>
                <h4>{value.title}</h4>
                <p>{value.description}</p>
              </div>
            {/each}
          </div>
        </div>

        <!-- Timeline -->
        <div class="ab-section">
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
        </div>

        <!-- CTA -->
        <div class="ab-cta-section">
          <div class="ab-cta-card">
            <h3>Ready to make your community safer?</h3>
            <p>Join thousands of neighborhoods already using Lezie to stay connected and protected.</p>
            <div class="ab-cta-actions">
              <button class="ab-btn-primary" onclick={() => goto('/signup')}>
                Get Started <ArrowRight size={15} />
              </button>
              <button class="ab-btn-secondary" onclick={() => goto('/contact')}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>

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
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%); 
  }

  /* LEFT PANEL - Exact match to sign-in page */
  .ab-panel { 
    display: none; 
    position: relative; 
    width: 440px; 
    flex-shrink: 0; 
    background: linear-gradient(160deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%); 
    overflow: hidden; 
  }

  @media (min-width: 1024px) { 
    .ab-panel { display: flex; } 
  }

  .ab-panel-inner { 
    position: relative; 
    z-index: 2; 
    display: flex; 
    flex-direction: column; 
    padding: 2.5rem; 
    height: 100%; 
  }

  .ab-panel-glow { 
    position: absolute; 
    inset: 0; 
    z-index: 1; 
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%); 
    pointer-events: none; 
  }

  .ab-logo-link { 
    display: inline-block; 
    line-height: 0; 
    margin-bottom: 2.5rem; 
    transition: transform 0.2s, opacity 0.2s; 
  }

  .ab-logo-link:hover { 
    opacity: 0.85; 
    transform: scale(1.02); 
  }

  .ab-logo-img { 
    width: 80px; 
    height: 80px; 
    object-fit: contain; 
    display: block; 
  }

  .ab-panel-badge { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.375rem 0.875rem; 
    background: rgba(139,92,246,0.2); 
    border: 1px solid rgba(139,92,246,0.3); 
    border-radius: 100px; 
    font-size: 0.75rem; 
    color: #c4b5fd; 
    margin-bottom: 1.5rem; 
  }

  .ab-panel-headline { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 2.5rem; 
    line-height: 1.2; 
    color: white; 
    margin-bottom: 1rem; 
  }

  .ab-panel-headline em { 
    color: #c4b5fd; 
    font-style: italic; 
  }

  .ab-panel-desc { 
    font-size: 0.875rem; 
    line-height: 1.6; 
    color: rgba(196,181,253,0.85); 
    margin-bottom: 2rem; 
  }

  .ab-features { 
    display: flex; 
    flex-direction: column; 
    gap: 1rem; 
    margin-bottom: auto; 
  }

  .ab-feature-card { 
    display: flex; 
    align-items: flex-start; 
    gap: 0.875rem; 
    padding: 0.875rem; 
    background: rgba(255,255,255,0.05); 
    border-radius: 1rem; 
    backdrop-filter: blur(10px); 
    transition: background 0.2s; 
  }

  .ab-feature-card:hover { 
    background: rgba(255,255,255,0.08); 
  }

  .ab-feature-icon { 
    width: 36px; 
    height: 36px; 
    background: rgba(139,92,246,0.2); 
    border-radius: 10px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: #c4b5fd; 
    flex-shrink: 0; 
  }

  .ab-feature-card strong { 
    display: block; 
    font-size: 0.813rem; 
    font-weight: 600; 
    color: white; 
    margin-bottom: 0.25rem; 
  }

  .ab-feature-card span { 
    font-size: 0.75rem; 
    color: rgba(196,181,253,0.8); 
    line-height: 1.4; 
  }

  .ab-panel-footer { 
    margin-top: 2rem; 
    padding-top: 1.5rem; 
    border-top: 1px solid rgba(255,255,255,0.1); 
  }

  .ab-avatars { 
    display: flex; 
    align-items: center; 
    margin-bottom: 0.75rem; 
  }

  .ab-avatar { 
    width: 32px; 
    height: 32px; 
    border-radius: 50%; 
    border: 2px solid #2d1b4e; 
    margin-left: -8px; 
  }

  .ab-avatar:first-child { 
    margin-left: 0; 
  }

  .ab-avatar-count { 
    width: auto; 
    padding: 0 0.75rem; 
    height: 32px; 
    border-radius: 16px; 
    background: rgba(139,92,246,0.3); 
    border: 2px solid #2d1b4e; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 0.688rem; 
    font-weight: 600; 
    color: white; 
    margin-left: -8px; 
  }

  .ab-panel-footer p { 
    font-size: 0.688rem; 
    color: rgba(196,181,253,0.7); 
  }

  /* RIGHT PANEL - Exact match to sign-in page patterns */
  .ab-main { 
    flex: 1; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    padding: 2rem 1.25rem; 
    min-height: 100vh; 
  }

  .ab-form-shell { 
    width: 100%; 
    max-width: 600px; 
    display: flex; 
    flex-direction: column; 
    gap: 1.5rem; 
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
    color: #64748b; 
    cursor: pointer; 
    transition: all 0.2s; 
    width: fit-content; 
    box-shadow: 0 1px 2px rgba(0,0,0,0.05); 
  }

  .ab-back-home:hover { 
    border-color: #6a2c91; 
    color: #6a2c91; 
    background: #f3e8ff; 
    transform: translateX(-2px); 
  }

  .ab-mobile-brand { 
    display: flex; 
    justify-content: center; 
  }

  .ab-mobile-brand .ab-logo-link { 
    margin-bottom: 0; 
  }

  .ab-mobile-brand .ab-logo-img { 
    width: 80px; 
    height: 80px; 
  }

  @media (min-width: 1024px) { 
    .ab-mobile-brand { display: none; } 
  }

  .ab-form-header { 
    text-align: center; 
  }

  .ab-form-title { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: clamp(1.625rem, 4vw, 2rem); 
    color: #1e1b4b; 
    margin-bottom: 0.25rem; 
    letter-spacing: -0.02em; 
  }

  .ab-form-subtitle { 
    font-size: 0.875rem; 
    color: #64748b; 
  }

  .ab-card { 
    background: white; 
    border-radius: 1.5rem; 
    border: 1px solid #e2e8f0; 
    padding: clamp(1.25rem, 5vw, 2rem); 
    box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1); 
    display: flex; 
    flex-direction: column; 
    gap: 2.5rem; 
  }

  .ab-step-body { 
    display: flex; 
    flex-direction: column; 
  }

  .ab-welcome-message { 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    padding: 0.875rem 1rem; 
    background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%); 
    border-radius: 1rem; 
    margin-bottom: 1.5rem; 
  }

  .ab-welcome-message :global(svg) { 
    color: #6a2c91; 
    flex-shrink: 0; 
  }

  .ab-welcome-message strong { 
    display: block; 
    font-size: 0.875rem; 
    font-weight: 700; 
    color: #1e1b4b; 
  }

  .ab-welcome-message span { 
    font-size: 0.75rem; 
    color: #64748b; 
  }

  .ab-mission-block { 
    display: flex; 
    flex-direction: column; 
    gap: 1rem; 
  }

  .ab-quote { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.25rem; 
    line-height: 1.5; 
    color: #1e1b4b; 
    margin: 0; 
    padding: 1.25rem; 
    background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%); 
    border-radius: 1rem; 
    border-left: 4px solid #6a2c91; 
    font-style: italic; 
  }

  .ab-mission-text { 
    font-size: 0.9375rem; 
    line-height: 1.7; 
    color: #4b5563; 
    margin: 0; 
  }

  .ab-section { 
    display: flex; 
    flex-direction: column; 
    gap: 1.25rem; 
  }

  .ab-section-title { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.375rem; 
    color: #1e1b4b; 
    margin: 0; 
  }

  /* Values Grid - No background colors on icons */
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
  }

  .ab-value-icon { 
    color: #6a2c91; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    width: 40px; 
    height: 40px; 
    background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%); 
    border-radius: 10px; 
  }

  .ab-value-card h4 { 
    font-size: 1rem; 
    font-weight: 600; 
    color: #1e1b4b; 
    margin: 0; 
  }

  .ab-value-card p { 
    font-size: 0.875rem; 
    line-height: 1.6; 
    color: #64748b; 
    margin: 0; 
  }

  /* Timeline */
  .ab-timeline { 
    position: relative; 
    padding-left: 1.5rem; 
  }

  .ab-timeline::before { 
    content: ''; 
    position: absolute; 
    left: 0; 
    top: 0; 
    bottom: 0; 
    width: 2px; 
    background: #e2e8f0; 
    border-radius: 1px; 
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
    width: 8px; 
    height: 8px; 
    background: #6a2c91; 
    border-radius: 50%; 
    margin-left: -3px; 
    box-shadow: 0 0 0 3px rgba(106,44,145,0.15); 
  }

  .ab-timeline-content { 
    background: #f8fafc; 
    padding: 1.25rem; 
    border-radius: 1rem; 
    border: 1px solid #e2e8f0; 
  }

  .ab-timeline-year { 
    display: inline-block; 
    padding: 0.25rem 0.75rem; 
    background: #6a2c91; 
    color: white; 
    font-size: 0.75rem; 
    font-weight: 700; 
    border-radius: 100px; 
    margin-bottom: 0.5rem; 
  }

  .ab-timeline-content h4 { 
    font-size: 1rem; 
    font-weight: 600; 
    color: #1e1b4b; 
    margin: 0 0 0.375rem 0; 
  }

  .ab-timeline-content p { 
    font-size: 0.875rem; 
    color: #64748b; 
    margin: 0; 
    line-height: 1.5; 
  }

  /* CTA Section - Toned down */
  .ab-cta-section { 
    margin-top: 0.5rem; 
  }

  .ab-cta-card { 
    background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%); 
    border: 1px solid #e0d4f5; 
    border-radius: 1rem; 
    padding: 1.75rem; 
    display: flex; 
    flex-direction: column; 
    gap: 1rem; 
    text-align: center; 
  }

  .ab-cta-card h3 { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.375rem; 
    color: #1e1b4b; 
    margin: 0; 
  }

  .ab-cta-card p { 
    font-size: 0.9375rem; 
    color: #64748b; 
    margin: 0; 
    line-height: 1.6; 
  }

  .ab-cta-actions { 
    display: flex; 
    gap: 0.75rem; 
    justify-content: center; 
    flex-wrap: wrap; 
    margin-top: 0.5rem; 
  }

  .ab-btn-primary { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.8125rem 1.25rem; 
    background: linear-gradient(135deg, #6a2c91 0%, #4a1d6e 100%); 
    color: white; 
    border: none; 
    border-radius: 0.75rem; 
    font-size: 0.9375rem; 
    font-weight: 600; 
    cursor: pointer; 
    box-shadow: 0 4px 14px rgba(106,44,145,0.3); 
    transition: all 0.2s; 
  }

  .ab-btn-primary:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 6px 20px rgba(106,44,145,0.4); 
  }

  .ab-btn-secondary { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.8125rem 1.25rem; 
    background: white; 
    color: #1e1b4b; 
    border: 1.5px solid #e5e7eb; 
    border-radius: 0.75rem; 
    font-size: 0.9375rem; 
    font-weight: 600; 
    cursor: pointer; 
    transition: all 0.2s; 
  }

  .ab-btn-secondary:hover { 
    border-color: #6a2c91; 
    color: #6a2c91; 
    background: white; 
  }

  /* Footer */
  .ab-footer-text { 
    text-align: center; 
    font-size: 0.875rem; 
    color: #64748b; 
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
      align-items: flex-start; 
    }
    
    .ab-form-shell { 
      gap: 1.25rem; 
    }
    
    .ab-card { 
      border-radius: 1.25rem; 
      padding: 1.25rem; 
      gap: 2rem; 
    }
    
    .ab-quote { 
      font-size: 1.125rem; 
      padding: 1rem; 
    }
    
    .ab-cta-actions { 
      flex-direction: column; 
    }
    
    .ab-btn-primary, 
    .ab-btn-secondary { 
      width: 100%; 
      justify-content: center; 
    }
    
    .ab-back-home { 
      font-size: 0.75rem; 
      padding: 0.375rem 0.875rem; 
    }
  }
</style>
