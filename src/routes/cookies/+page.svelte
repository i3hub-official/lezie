<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { 
    Cookie, Shield, BarChart2, Target, Settings, ChevronRight, 
    ArrowLeft, ExternalLink, Lock, Zap, MapPin,ChevronLeft, TrendingUp 
  } from 'lucide-svelte';

  let activeSection = $state('what-are-cookies');

  const sections = [
    { id: 'what-are-cookies', label: 'What Are Cookies' },
    { id: 'how-we-use',       label: 'How We Use Them'  },
    { id: 'types',            label: 'Cookie Types'     },
    { id: 'third-party',      label: 'Third Parties'    },
    { id: 'your-choices',     label: 'Your Choices'     },
    { id: 'updates',          label: 'Policy Updates'   },
    { id: 'contact',          label: 'Contact Us'        },
  ];

  const cookieTypes = [
    {
      icon:    Shield,
      bg:      '#6a2c91',
      label:   'Strictly Necessary',
      tag:     'Always active',
      tagColor: '#ffffff',
      tagBg:   '#9b4fcc',           // brand colour
      desc:    'These cookies are essential for Lezie to function. They handle authentication sessions, security tokens, and core platform operations. Without these, you cannot use the app.',
      examples:['Session authentication','CSRF protection tokens','Load balancer routing','User preference flags'],
      retention: 'Session / up to 1 year',
    },
    {
      icon:    BarChart2,
      bg:      '#6a2c91',
      label:   'Analytics',
      tag:     'Optional',
      tagColor: '#ffffff',
      tagBg:   '#9b4fcc',           // brand colour
      desc:    'Help us understand how people navigate Lezie — which features they use most, where they encounter friction, and how to improve the experience for everyone in the community.',
      examples:['Page view tracking','Feature usage metrics','Error rate monitoring','Session duration data'],
      retention: 'Up to 2 years',
    },
    {
      icon:    Settings,
      bg:      '#6a2c91',
      label:   'Functional',
      tag:     'Optional',
      tagColor: '#ffffff',
      tagBg:   '#9b4fcc',           // brand colour
      desc:    'Remember your preferences so Lezie feels tailored to you — your default map region, notification settings, language choice, and other saved configurations.',
      examples:['Map region preference','Language / locale setting','Notification preferences','Theme selection'],
      retention: 'Up to 1 year',
    },
    {
      icon:    Target,
      bg:      '#6a2c91',
      label:   'Marketing',
      tag:     'Optional',
      tagColor: '#ffffff',
      tagBg:   '#9b4fcc',           // brand colour
      desc:    'Used to deliver relevant safety updates, community announcements, and product news. We do not sell your data or use these for third-party advertising.',
      examples:['Re-engagement campaigns','Feature announcement targeting','Community event notifications','Product update comms'],
      retention: 'Up to 90 days',
    },
  ];

  const thirdParties = [
    { name:'Mapbox',      purpose:'Interactive safety maps and location services',      link:'https://www.mapbox.com/legal/privacy' },
    { name:'Sentry',      purpose:'Error monitoring and crash reporting',               link:'https://sentry.io/privacy/' },
    { name:'PostHog',     purpose:'Product analytics and feature usage insights',       link:'https://posthog.com/privacy' },
    { name:'Cloudflare',  purpose:'CDN, DDoS protection, and performance optimisation', link:'https://www.cloudflare.com/privacypolicy/' },
  ];

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) activeSection = entry.target.id;
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  });

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<svelte:head>
  <title>Cookie Policy – Lezie</title>
  <meta name="description" content="Learn how Lezie uses cookies to keep your experience secure, personalised, and private." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="cp-page">

  <!-- LEFT PANEL -->
  <aside class="cp-panel">
    <div class="cp-panel-inner">
      <a href="/" class="cp-logo-link">
        <img src="/icons/lz_logo_t.png" alt="Lezie" class="cp-logo-img" />
      </a>

      <div class="cp-panel-hero">
        <div class="cp-panel-badge">
          <Cookie size={14} />
          <span>Legal</span>
        </div>
        <h2 class="cp-panel-headline">Cookie Policy</h2>
        <p class="cp-panel-desc">
          A clear explanation of the cookies Lezie uses, why we use them, and how you can control them.
        </p>
      </div>

      <div class="cp-panel-footer">
        <p>Effective: <strong>1 January 2025</strong></p>
        <p>Last updated: <strong>1 April 2025</strong></p>
      </div>
    </div>
    <div class="cp-panel-glow"></div>
  </aside>

  <!-- MAIN CONTENT -->
  <main class="cp-main">
    <div class="cp-content-shell">

      <button class="cp-back-home" onclick={() => goto("/")}>
        <ChevronLeft size={18} />
        <span>Back</span>
      </button>

      <div class="cp-form-header">
        <h1 class="cp-form-title">Cookie Policy</h1>
        <p class="cp-form-subtitle">\~5 minute read • Plain English</p>
      </div>

      <!-- Table of Contents -->
      <div class="cp-toc">
        <p class="cp-toc-label">On this page</p>
        <nav class="cp-toc-nav">
          {#each sections as s}
            <button
              class="cp-toc-item {activeSection === s.id ? 'active' : ''}"
              onclick={() => scrollTo(s.id)}
            >
              <ChevronRight size={14} />
              {s.label}
            </button>
          {/each}
        </nav>
      </div>

      <!-- Sections -->
      <div class="cp-sections">

        <!-- What are cookies -->
        <section id="what-are-cookies" class="cp-section">
          <div class="cp-section-label"><Cookie size={14} />What Are Cookies</div>
          <h2 class="cp-section-title">Small files, big purpose</h2>
          <p>Cookies are small text files placed on your device when you visit a website or use a web application. They allow Lezie to remember information between page loads — things like whether you're signed in, your map preferences, or how you've customised your alerts.</p>
          <p>Cookies are not programs and cannot run code or carry viruses. They simply store small pieces of text that help Lezie work correctly and personalise your experience.</p>

          <div class="cp-info-box">
            Lezie uses both <strong>first-party cookies</strong> (set by us) and <strong>third-party cookies</strong> (set by trusted partners). We do not use cookies for invasive advertising profiling.
          </div>
        </section>

        <!-- How We Use Them - with extra spacing -->
        <section id="how-we-use" class="cp-section cp-section-spaced">
          <div class="cp-section-label brand-label"><Shield size={14} />How We Use Them</div>
          <h2 class="cp-section-title">Keeping the platform safe and useful</h2>
          <p>Lezie uses cookies for four broad purposes: keeping your session secure, understanding how people use the platform, remembering your preferences, and delivering relevant community communications (when opted in).</p>
          <p>We never sell cookie data to advertisers.</p>

          <div class="cp-use-grid">
            {#each [
              { icon: Lock, title:'Security', desc:'Protect your account from session hijacking and CSRF attacks' },
              { icon: Zap, title:'Performance', desc:'Ensure the platform loads quickly and reliably' },
              { icon: MapPin, title:'Personalisation', desc:'Remember your default map region and notification settings' },
              { icon: TrendingUp, title:'Improvement', desc:'Understand what features matter most to improve Lezie' },
            ] as u}
              <div class="cp-use-card">
                <u.icon size={28} class="cp-use-icon" />
                <strong>{u.title}</strong>
                <span>{u.desc}</span>
              </div>
            {/each}
          </div>
        </section>

        <!-- Cookie Types - with extra spacing -->
        <section id="types" class="cp-section cp-section-spaced">
          <div class="cp-section-label brand-label"><BarChart2 size={14} />Cookie Types</div>
          <h2 class="cp-section-title">What we set and why</h2>
          <p>We organise our cookies into four categories. Strictly necessary cookies are always active; the others require your consent.</p>

          <div class="cp-type-list">
            {#each cookieTypes as ct}
              <div class="cp-type-card">
                <div class="cp-type-card-header">
                  <div class="cp-type-icon" style="background:{ct.bg}">
                    <ct.icon size={20} color="white" />
                  </div>
                  <div class="cp-type-meta">
                    <span class="cp-type-name">{ct.label}</span>
                    <span class="cp-type-tag" style="background:{ct.tagBg}; color:{ct.tagColor}">{ct.tag}</span>
                  </div>
                  <span class="cp-type-retention">Retention: {ct.retention}</span>
                </div>
                <p class="cp-type-desc">{ct.desc}</p>
                <div class="cp-type-examples">
                  <span class="cp-examples-label">Examples</span>
                  <div class="cp-examples-list">
                    {#each ct.examples as ex}
                      <span class="cp-example-chip">{ex}</span>
                    {/each}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </section>

        <!-- Third Parties - with extra spacing -->
        <section id="third-party" class="cp-section cp-section-spaced">
          <div class="cp-section-label brand-label"><ExternalLink size={14} />Third Parties</div>
          <h2 class="cp-section-title">Who else may set cookies</h2>
          <p>Some features rely on trusted third-party services. These providers may set their own cookies. We only work with partners who maintain strong data protection standards.</p>

          <div class="cp-third-list">
            {#each thirdParties as tp}
              <div class="cp-third-row">
                <div>
                  <strong>{tp.name}</strong>
                  <p>{tp.purpose}</p>
                </div>
                <a href={tp.link} target="_blank" rel="noopener noreferrer" class="cp-third-link">
                  Privacy policy <ExternalLink size={14} />
                </a>
              </div>
            {/each}
          </div>
        </section>

        <!-- Your Choices - with extra spacing -->
        <section id="your-choices" class="cp-section cp-section-spaced">
          <div class="cp-section-label brand-label"><Settings size={14} />Your Choices</div>
          <h2 class="cp-section-title">You're in control</h2>
          <p>You can manage cookies in several ways:</p>

          <div class="cp-choices">
            {#each [
              { num: '1', title: 'Cookie banner', desc: 'When you first visit, choose to accept all, necessary only, or customise per category.' },
              { num: '2', title: 'Privacy settings', desc: 'Go to Settings → Privacy anytime to update your preferences.' },
              { num: '3', title: 'Browser controls', desc: 'Use your browser settings to block or delete cookies (note: blocking necessary cookies may break the app).' },
              { num: '4', title: 'Do Not Track', desc: 'Lezie respects your browser’s Do Not Track signal where possible.' }
            ] as choice}
              <div class="cp-choice">
                <div class="cp-choice-num">{choice.num}</div>
                <div>
                  <strong>{choice.title}</strong>
                  <p>{choice.desc}</p>
                </div>
              </div>
            {/each}
          </div>

          <div class="cp-warning-box">
            <strong>Note:</strong> Disabling functional or analytics cookies may affect some personalised features like remembering your map region.
          </div>
        </section>

        <!-- Policy Updates - with extra spacing -->
        <section id="updates" class="cp-section cp-section-spaced">
          <div class="cp-section-label brand-label"><Cookie size={14} />Policy Updates</div>
          <h2 class="cp-section-title">When this policy changes</h2>
          <p>We may update this Cookie Policy to reflect changes in technology or regulation. Material changes will be notified via an in-app banner, and the "Last updated" date will be changed.</p>
          <p>Continued use of Lezie after updates means you accept the revised policy.</p>
        </section>

        <!-- Contact -->
        <section id="contact" class="cp-section">
          <div class="cp-section-label"><Shield size={14} />Contact Us</div>
          <h2 class="cp-section-title">Questions about cookies?</h2>
          <p>If you have any questions, feel free to reach out to our privacy team.</p>

          <div class="cp-contact-card">
            <div class="cp-contact-row">
              <span class="cp-contact-label">Email</span>
              <a href="mailto:privacy@lezie.app" class="cp-link">privacy@lezie.app</a>
            </div>
            <div class="cp-contact-row">
              <span class="cp-contact-label">Related</span>
              <div class="cp-contact-links">
                <a href="/privacy" class="cp-link">Privacy Policy</a>
                <a href="/terms" class="cp-link">Terms of Service</a>
              </div>
            </div>
          </div>
        </section>

      </div>

      <p class="cp-footer-text">
        Last updated: 1 April 2025
      </p>

    </div>
  </main>
</div>

<style>
  :global(.cp-page *) { 
    font-family: 'DM Sans', system-ui, sans-serif; 
    box-sizing: border-box; 
  }

  .cp-page { 
    display: flex; 
    min-height: 100vh; 
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%); 
  }

  /* LEFT PANEL - unchanged from previous version */
  .cp-panel { 
    display: none; 
    position: relative; 
    width: 440px; 
    flex-shrink: 0; 
    background: linear-gradient(160deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%); 
    overflow: hidden; 
  }

  @media (min-width: 1024px) { 
    .cp-panel { display: flex; } 
  }

  .cp-panel-inner { 
    position: relative; 
    z-index: 2; 
    display: flex; 
    flex-direction: column; 
    padding: 2.5rem; 
    height: 100%; 
  }

  .cp-panel-glow { 
    position: absolute; 
    inset: 0; 
    z-index: 1; 
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%); 
    pointer-events: none; 
  }

  .cp-logo-link { 
    display: inline-block; 
    line-height: 0; 
    margin-bottom: 2.5rem; 
  }

  .cp-logo-img { 
    width: 80px; 
    height: 80px; 
    object-fit: contain; 
  }

  .cp-panel-badge { 
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

  .cp-panel-headline { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 2.5rem; 
    line-height: 1.15; 
    color: white; 
    margin: 0 0 1rem 0; 
  }

  .cp-panel-desc { 
    font-size: 0.875rem; 
    line-height: 1.6; 
    color: rgba(196,181,253,0.85); 
  }

  .cp-panel-footer { 
    margin-top: auto; 
    padding-top: 2rem; 
    border-top: 1px solid rgba(255,255,255,0.1); 
    color: rgba(196,181,253,0.7); 
    font-size: 0.813rem; 
  }

  /* MAIN CONTENT */
  .cp-main { 
    flex: 1; 
    padding: 2rem 1.25rem; 
    overflow-y: auto; 
  }

  .cp-content-shell { 
    max-width: 680px; 
    margin: 0 auto; 
    display: flex; 
    flex-direction: column; 
    gap: 2rem; 
  }

  .cp-back-home { 
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
  }

  .cp-back-home:hover { 
    border-color: #6a2c91; 
    color: #6a2c91; 
    background: #f3e8ff; 
  }

  .cp-form-header { 
    text-align: center; 
  }

  .cp-form-title { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: clamp(1.75rem, 5vw, 2.25rem); 
    color: #1e1b4b; 
    margin-bottom: 0.25rem; 
  }

  .cp-form-subtitle { 
    color: #64748b; 
    font-size: 0.875rem; 
  }

  /* Table of Contents */
  .cp-toc { 
    background: white; 
    border: 1px solid #e2e8f0; 
    border-radius: 1rem; 
    padding: 1.25rem; 
  }

  .cp-toc-label { 
    font-size: 0.6875rem; 
    font-weight: 700; 
    text-transform: uppercase; 
    letter-spacing: 0.06em; 
    color: #94a3b8; 
    margin-bottom: 0.75rem; 
  }

  .cp-toc-nav { 
    display: flex; 
    flex-direction: column; 
    gap: 0.25rem; 
  }

  .cp-toc-item { 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.5rem 0.75rem; 
    border-radius: 0.75rem; 
    font-size: 0.875rem; 
    color: #64748b; 
    background: none; 
    border: none; 
    text-align: left; 
    cursor: pointer; 
    transition: all 0.2s; 
  }

  .cp-toc-item:hover, .cp-toc-item.active { 
    background: #f3e8ff; 
    color: #6a2c91; 
  }

  .cp-toc-item.active { 
    font-weight: 600; 
  }

  /* Section styling with extra spacing */
  .cp-section { 
    scroll-margin-top: 3rem; 
  }

  .cp-section-spaced {
    margin-top: 3.5rem;        /* Extra spacing above these sections */
  }

  .cp-section-label { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    font-size: 0.6875rem; 
    font-weight: 700; 
    text-transform: uppercase; 
    letter-spacing: 0.06em; 
    color: #ffffff; 
    background: #6a2c91;           /* Primary dark brand colour */
    padding: 0.4rem 1rem; 
    border-radius: 100px; 
  }

  .brand-label {
    background: #6a2c91;           /* Ensure brand colour for requested sections */
  }

  .cp-section-title { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.75rem; 
    color: #1e1b4b; 
    margin: 0.75rem 0 1rem 0; 
    line-height: 1.2; 
  }

  .cp-section p { 
    font-size: 0.9375rem; 
    line-height: 1.75; 
    color: #475569; 
    margin-bottom: 1.25rem; 
  }

  /* Info & Warning boxes */
  .cp-info-box, .cp-warning-box { 
    padding: 1.25rem; 
    border-radius: 1rem; 
    font-size: 0.9rem; 
    line-height: 1.65; 
  }

  .cp-info-box { 
   background: #9b4fcc;
    border: 1.5px solid #9b4fcc; 
    color: #ffffff; 
  }

  .cp-warning-box { 
    background: #9b4fcc;
    border: 1.5px solid #9b4fcc; 
    color: #92400e; 
  }

  /* Use grid */
  .cp-use-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
    gap: 1rem; 
    margin-top: 1.5rem; 
  }

  .cp-use-card { 
    background: white; 
    border: 1.5px solid #e5e7eb; 
    border-radius: 1rem; 
    padding: 1.25rem; 
    transition: all 0.2s; 
  }

  .cp-use-card:hover { 
    border-color: #6a2c91; 
    box-shadow: 0 4px 16px rgba(106,44,145,0.07); 
  }

  .cp-use-icon { 
    color: #6a2c91; 
    margin-bottom: 0.75rem; 
  }

  .cp-use-card strong { 
    display: block; 
    font-size: 1rem; 
    margin-bottom: 0.375rem; 
    color: #1e1b4b; 
  }

  /* Cookie type cards - brand colour accents */
  .cp-type-list { 
    display: flex; 
    flex-direction: column; 
    gap: 1.25rem; 
    margin-top: 1.25rem; 
  }

  .cp-type-card { 
    background: white; 
    border: 1.5px solid #e5e7eb; 
    border-radius: 1.25rem; 
    padding: 1.5rem; 
  }

  .cp-type-card:hover { 
    border-color: #6a2c91; 
  }

  .cp-type-card-header { 
    display: flex; 
    align-items: center; 
    gap: 1rem; 
    flex-wrap: wrap; 
    margin-bottom: 1rem; 
  }

  .cp-type-icon { 
    width: 48px; 
    height: 48px; 
    border-radius: 12px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    flex-shrink: 0; 
  }

  .cp-type-name { 
    font-size: 1.0625rem; 
    font-weight: 700; 
    color: #1e1b4b; 
  }

  .cp-type-tag { 
    font-size: 0.75rem; 
    font-weight: 700; 
    padding: 0.25rem 0.875rem; 
    border-radius: 100px; 
  }

  .cp-type-retention { 
    margin-left: auto; 
    font-size: 0.8125rem; 
    color: #64748b; 
  }

  .cp-type-desc { 
    color: #475569; 
    line-height: 1.7; 
  }

  .cp-examples-label { 
    font-size: 0.6875rem; 
    font-weight: 700; 
    color: #94a3b8; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
  }

  .cp-example-chip { 
    display: inline-block; 
    font-size: 0.8125rem; 
    background: #f8fafc; 
    border: 1px solid #e2e8f0; 
    padding: 0.25rem 0.75rem; 
    border-radius: 0.5rem; 
    margin-right: 0.375rem; 
    margin-bottom: 0.375rem; 
  }

  /* Third party */
  .cp-third-list { 
    display: flex; 
    flex-direction: column; 
    gap: 0.75rem; 
    margin-top: 1.25rem; 
  }

  .cp-third-row { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    gap: 1rem; 
    padding: 1.25rem; 
    background: white; 
    border: 1.5px solid #e5e7eb; 
    border-radius: 1rem; 
  }

  .cp-third-row:hover { 
    border-color: #6a2c91; 
  }

  .cp-third-link { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    color: #6a2c91; 
    font-weight: 600; 
    text-decoration: none; 
    font-size: 0.875rem; 
  }

  /* Choices */
  .cp-choices { 
    display: flex; 
    flex-direction: column; 
    gap: 1rem; 
    margin: 1.5rem 0; 
  }

  .cp-choice { 
    display: flex; 
    gap: 1rem; 
    background: white; 
    border: 1.5px solid #e5e7eb; 
    border-radius: 1rem; 
    padding: 1.25rem; 
  }

  .cp-choice:hover { 
    border-color: #6a2c91; 
  }

  .cp-choice-num { 
    width: 32px; 
    height: 32px; 
    background: linear-gradient(135deg, #6a2c91, #4a1d6e); 
    color: white; 
    font-weight: 700; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    flex-shrink: 0; 
  }

  .cp-contact-card { 
    background: white; 
    border: 1.5px solid #e5e7eb; 
    border-radius: 1.25rem; 
    overflow: hidden; 
    margin-top: 1rem; 
  }

  .cp-contact-row { 
    display: flex; 
    align-items: center; 
    gap: 1.5rem; 
    padding: 1.25rem 1.5rem; 
    border-bottom: 1px solid #f1f5f9; 
  }

  .cp-contact-row:last-child { 
    border-bottom: none; 
  }

  .cp-contact-label { 
    font-size: 0.75rem; 
    font-weight: 700; 
    color: #94a3b8; 
    text-transform: uppercase; 
    min-width: 70px; 
  }

  .cp-link { 
    color: #6a2c91; 
    font-weight: 600; 
    text-decoration: none; 
  }

  .cp-footer-text { 
    text-align: center; 
    color: #64748b; 
    font-size: 0.813rem; 
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .cp-panel { display: none; }
    .cp-section-spaced { margin-top: 2.5rem; }
  }
</style>