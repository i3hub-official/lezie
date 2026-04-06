<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { 
    Cookie, Shield, BarChart2, Target, Settings, ChevronRight, 
    ArrowLeft, ExternalLink, Lock, Zap, MapPin, TrendingUp 
  } from 'lucide-svelte';

  // Active section for sticky nav highlight
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
      color:   '#1a0b2e',
      bg:      'linear-gradient(135deg,#1a0b2e,#2d1b4e)',
      label:   'Strictly Necessary',
      tag:     'Always active',
      tagColor:'#6a2c91',
      tagBg:   '#f3e8ff',
      desc:    'These cookies are essential for Lezie to function. They handle authentication sessions, security tokens, and core platform operations. Without these, you cannot use the app.',
      examples:['Session authentication','CSRF protection tokens','Load balancer routing','User preference flags'],
      retention: 'Session / up to 1 year',
    },
    {
      icon:    BarChart2,
      color:   '#0369a1',
      bg:      'linear-gradient(135deg,#0369a1,#0284c7)',
      label:   'Analytics',
      tag:     'Optional',
      tagColor:'#0369a1',
      tagBg:   '#e0f2fe',
      desc:    'Help us understand how people navigate Lezie — which features they use most, where they encounter friction, and how to improve the experience for everyone in the community.',
      examples:['Page view tracking','Feature usage metrics','Error rate monitoring','Session duration data'],
      retention: 'Up to 2 years',
    },
    {
      icon:    Settings,
      color:   '#059669',
      bg:      'linear-gradient(135deg,#059669,#10b981)',
      label:   'Functional',
      tag:     'Optional',
      tagColor:'#059669',
      tagBg:   '#d1fae5',
      desc:    'Remember your preferences so Lezie feels tailored to you — your default map region, notification settings, language choice, and other saved configurations.',
      examples:['Map region preference','Language / locale setting','Notification preferences','Theme selection'],
      retention: 'Up to 1 year',
    },
    {
      icon:    Target,
      color:   '#b45309',
      bg:      'linear-gradient(135deg,#b45309,#d97706)',
      label:   'Marketing',
      tag:     'Optional',
      tagColor:'#b45309',
      tagBg:   '#fef3c7',
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

  // Intersection observer for nav highlight
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
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="cp-page">

  <!-- ── HERO ── -->
  <header class="cp-hero">
    <div class="cp-hero-glow"></div>
    <div class="cp-hero-inner">
      <button class="cp-back" onclick={() => goto(-1 as any)}>
        <ArrowLeft size={15} /> Back
      </button>
      <div class="cp-hero-badge">
        <Cookie size={14} /><span>Legal</span>
      </div>
      <h1 class="cp-hero-title">Cookie Policy</h1>
      <p class="cp-hero-subtitle">
        A plain-English explanation of what cookies Lezie uses, why,
        and how you can control them.
      </p>
      <div class="cp-hero-meta">
        <span>Effective: <strong>1 January 2025</strong></span>
        <span class="cp-meta-dot"></span>
        <span>Last updated: <strong>1 April 2025</strong></span>
        <span class="cp-meta-dot"></span>
        <span>~5 min read</span>
      </div>
    </div>
  </header>

  <div class="cp-body">

    <!-- ── SIDEBAR NAV ── -->
    <aside class="cp-sidebar">
      <div class="cp-sidebar-inner">
        <p class="cp-sidebar-heading">On this page</p>
        <nav class="cp-nav">
          {#each sections as s}
            <button
              class="cp-nav-item {activeSection === s.id ? 'cp-nav-item--active' : ''}"
              onclick={() => scrollTo(s.id)}>
              <ChevronRight size={12} class="cp-nav-chevron" />
              {s.label}
            </button>
          {/each}
        </nav>
        <div class="cp-sidebar-cta">
          <p>Want to update your cookie preferences?</p>
          <a href="/settings#privacy" class="cp-sidebar-btn">
            <Settings size={13} /> Manage preferences
          </a>
        </div>
      </div>
    </aside>

    <!-- ── CONTENT ── -->
    <main class="cp-content">

      <!-- What are cookies -->
      <section id="what-are-cookies" class="cp-section">
        <div class="cp-section-label"><Cookie size={14} />What Are Cookies</div>
        <h2 class="cp-section-title">Small files, big purpose</h2>
        <p>Cookies are small text files placed on your device when you visit a website or use a web application. They allow Lezie to remember information between page loads — things like whether you're signed in, your map preferences, or how you've customised your alerts.</p>
        <p>Cookies are not programs and cannot run code or carry viruses. They simply store small pieces of text that help Lezie work correctly and personalise your experience.</p>
        <div class="cp-info-box">
          <strong>Lezie uses both first-party cookies</strong> (set by us directly) and <strong>third-party cookies</strong> (set by trusted service providers on our behalf). We do not use cookies for invasive advertising profiling.
        </div>
      </section>

    <!-- How we use -->
<section id="how-we-use" class="cp-section">
  <div class="cp-section-label"><Shield size={14} />How We Use Them</div>
  <h2 class="cp-section-title">Keeping the platform safe and useful</h2>
  <p>Lezie uses cookies for four broad purposes: keeping your session secure and authenticated, understanding how people use the platform so we can improve it, remembering your preferences, and — if you opt in — delivering relevant community communications.</p>
  <p>We never sell cookie data to advertisers. Any third parties we work with are contractually bound to use data only to provide their service to us.</p>

  <div class="cp-use-grid">
    {#each [
      { icon: Lock,        title:'Security',      desc:'Protect your account from session hijacking and CSRF attacks' },
      { icon: Zap,         title:'Performance',   desc:'Ensure the platform loads quickly and reliably for everyone' },
      { icon: MapPin,      title:'Personalisation',desc:'Remember your default map region and notification settings'  },
      { icon: TrendingUp,  title:'Improvement',   desc:'Understand what features matter most so we can build better tools' },
    ] as u}
      <div class="cp-use-card">
        <u.icon size={28} class="cp-use-icon" />
        <strong>{u.title}</strong>
        <span>{u.desc}</span>
      </div>
    {/each}
  </div>
</section>

      <!-- Types -->
      <section id="types" class="cp-section">
        <div class="cp-section-label"><BarChart2 size={14} />Cookie Types</div>
        <h2 class="cp-section-title">What we set and why</h2>
        <p>We organise our cookies into four categories. Strictly necessary cookies are always active; the rest are only set with your consent.</p>

        <div class="cp-type-list">
          {#each cookieTypes as ct}
            <div class="cp-type-card">
              <div class="cp-type-card-header">
                <div class="cp-type-icon" style="background:{ct.bg}">
                  <ct.icon size={18} color="white" />
                </div>
                <div class="cp-type-meta">
                  <span class="cp-type-name">{ct.label}</span>
                  <span class="cp-type-tag" style="color:{ct.tagColor};background:{ct.tagBg}">{ct.tag}</span>
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

      <!-- Third party -->
      <section id="third-party" class="cp-section">
        <div class="cp-section-label"><ExternalLink size={14} />Third Parties</div>
        <h2 class="cp-section-title">Who else may set cookies</h2>
        <p>Some Lezie features rely on trusted third-party services. These providers may set their own cookies subject to their own privacy policies. We vet all third parties and only engage those with strong data protection practices.</p>

        <div class="cp-third-list">
          {#each thirdParties as tp}
            <div class="cp-third-row">
              <div class="cp-third-info">
                <strong>{tp.name}</strong>
                <span>{tp.purpose}</span>
              </div>
              <a href={tp.link} target="_blank" rel="noopener noreferrer" class="cp-third-link">
                Privacy policy <ExternalLink size={11} />
              </a>
            </div>
          {/each}
        </div>
      </section>

      <!-- Your choices -->
      <section id="your-choices" class="cp-section">
        <div class="cp-section-label"><Settings size={14} />Your Choices</div>
        <h2 class="cp-section-title">You're in control</h2>
        <p>You have several ways to manage cookies on Lezie:</p>

        <div class="cp-choices">
          <div class="cp-choice">
            <div class="cp-choice-num">1</div>
            <div>
              <strong>Cookie banner</strong>
              <p>When you first visit Lezie, a banner lets you accept all, accept necessary only, or manage preferences per category.</p>
            </div>
          </div>
          <div class="cp-choice">
            <div class="cp-choice-num">2</div>
            <div>
              <strong>Privacy settings</strong>
              <p>Visit <a href="/settings#privacy" class="cp-link">Settings → Privacy</a> at any time to update your cookie preferences. Changes take effect immediately.</p>
            </div>
          </div>
          <div class="cp-choice">
            <div class="cp-choice-num">3</div>
            <div>
              <strong>Browser controls</strong>
              <p>All modern browsers let you view, block, or delete cookies. Note that blocking strictly necessary cookies will prevent Lezie from working correctly.</p>
            </div>
          </div>
          <div class="cp-choice">
            <div class="cp-choice-num">4</div>
            <div>
              <strong>Opt-out tools</strong>
              <p>For analytics, you can also opt out via your browser's Do Not Track setting, which Lezie respects where technically feasible.</p>
            </div>
          </div>
        </div>

        <div class="cp-warning-box">
          <strong>Heads up:</strong> Disabling functional or analytics cookies won't prevent you from using Lezie, but some features — like remembering your map region — may not work as expected.
        </div>
      </section>

      <!-- Updates -->
      <section id="updates" class="cp-section">
        <div class="cp-section-label"><Cookie size={14} />Policy Updates</div>
        <h2 class="cp-section-title">When this policy changes</h2>
        <p>We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or the way we operate Lezie. When we make material changes, we'll notify you via an in-app banner and update the "Last updated" date at the top of this page.</p>
        <p>Continued use of Lezie after a policy update constitutes acceptance of the revised terms. We encourage you to review this page periodically.</p>
      </section>

      <!-- Contact -->
      <section id="contact" class="cp-section">
        <div class="cp-section-label"><Shield size={14} />Contact Us</div>
        <h2 class="cp-section-title">Questions about cookies?</h2>
        <p>If you have any questions about how Lezie uses cookies, or wish to exercise your data rights, please reach out to our privacy team.</p>

        <div class="cp-contact-card">
          <div class="cp-contact-row">
            <span class="cp-contact-label">Email</span>
            <a href="mailto:privacy@lezie.app" class="cp-link">privacy@lezie.app</a>
          </div>
          <div class="cp-contact-row">
            <span class="cp-contact-label">Related</span>
            <div class="cp-contact-links">
              <a href="/privacy" class="cp-link">Privacy Policy</a>
              <a href="/terms"   class="cp-link">Terms of Service</a>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</div>

<style>
  :global(.cp-page *) { font-family:'DM Sans',system-ui,sans-serif; box-sizing:border-box; }

  .cp-page { min-height:100vh; background:#faf9ff; }

  /* ── HERO ── */
  .cp-hero {
    background:linear-gradient(160deg,#1a0b2e 0%,#2d1b4e 60%,#1a0b2e 100%);
    position:relative; overflow:hidden;
    padding:3rem 1.5rem 3.5rem;
  }
  .cp-hero-glow {
    position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse 70% 80% at 30% 50%,rgba(139,92,246,.18),transparent 65%);
  }
  .cp-hero-inner {
    position:relative; z-index:1;
    max-width:860px; margin:0 auto;
    display:flex; flex-direction:column; gap:1rem;
  }
  .cp-back {
    display:inline-flex; align-items:center; gap:.4rem;
    background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15);
    border-radius:100px; padding:.375rem .875rem;
    font-size:.75rem; font-weight:500; color:rgba(196,181,253,.85);
    cursor:pointer; font-family:'DM Sans',sans-serif;
    transition:all .2s; width:fit-content;
  }
  .cp-back:hover { background:rgba(255,255,255,.14); color:white; }

  .cp-hero-badge {
    display:inline-flex; align-items:center; gap:.5rem;
    background:rgba(106,44,145,.3); border:1px solid rgba(139,92,246,.35);
    border-radius:100px; padding:.3rem .875rem;
    font-size:.75rem; color:#c4b5fd; width:fit-content;
  }

  .cp-hero-title {
    font-family:'DM Serif Display',Georgia,serif;
    font-size:clamp(2rem,5vw,3rem);
    color:white; margin:0; letter-spacing:-.02em; line-height:1.1;
  }

  .cp-hero-subtitle {
    font-size:clamp(.875rem,2vw,1rem); color:rgba(196,181,253,.85);
    max-width:520px; line-height:1.65; margin:0;
  }

  .cp-hero-meta {
    display:flex; align-items:center; flex-wrap:wrap; gap:.625rem;
    font-size:.75rem; color:rgba(196,181,253,.7); margin-top:.25rem;
  }
  .cp-hero-meta strong { color:rgba(196,181,253,.95); font-weight:600; }
  .cp-meta-dot { width:3px; height:3px; border-radius:50%; background:rgba(196,181,253,.35); }

  /* ── BODY LAYOUT ── */
  .cp-body {
    max-width:1060px; margin:0 auto;
    display:grid; grid-template-columns:220px 1fr;
    gap:2.5rem; padding:3rem 1.5rem 5rem;
    align-items:start;
  }
  @media (max-width:768px) {
    .cp-body { grid-template-columns:1fr; }
    .cp-sidebar { display:none; }
  }

  /* ── SIDEBAR ── */
  .cp-sidebar { position:sticky; top:2rem; }
  .cp-sidebar-inner {
    background:white; border:1.5px solid #e5e7eb; border-radius:1.25rem;
    padding:1.25rem; display:flex; flex-direction:column; gap:1rem;
    box-shadow:0 4px 16px rgba(0,0,0,.05);
  }
  .cp-sidebar-heading { font-size:.6875rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.08em; margin:0; }

  .cp-nav { display:flex; flex-direction:column; gap:.125rem; }
  .cp-nav-item {
    display:flex; align-items:center; gap:.5rem;
    padding:.5rem .625rem; border-radius:.625rem; border:none;
    background:none; font-size:.8125rem; color:#64748b; font-weight:500;
    cursor:pointer; font-family:'DM Sans',sans-serif;
    transition:all .15s; text-align:left;
  }
  .cp-nav-item:hover { background:#f3e8ff; color:#6a2c91; }
  .cp-nav-item--active { background:#f3e8ff; color:#6a2c91; font-weight:700; }
  :global(.cp-nav-chevron) { flex-shrink:0; opacity:.5; }
  .cp-nav-item--active :global(.cp-nav-chevron) { opacity:1; }

  .cp-sidebar-cta {
    background:linear-gradient(135deg,#f3e8ff,#ede9fe);
    border-radius:.875rem; padding:1rem;
    border:1px solid #ddd6fe;
  }
  .cp-sidebar-cta p { font-size:.75rem; color:#4b1d68; margin:0 0 .75rem; line-height:1.5; }
  .cp-sidebar-btn {
    display:inline-flex; align-items:center; gap:.4rem;
    padding:.4375rem .875rem; background:#6a2c91; color:white;
    border-radius:.625rem; font-size:.75rem; font-weight:600;
    text-decoration:none; transition:all .2s;
    box-shadow:0 3px 8px rgba(106,44,145,.25);
  }
  .cp-sidebar-btn:hover { background:#4a1d6e; transform:translateY(-1px); }

  /* ── CONTENT ── */
  .cp-content { display:flex; flex-direction:column; gap:3rem; }

  .cp-section { display:flex; flex-direction:column; gap:1rem; scroll-margin-top:2rem; }

  .cp-section-label {
    display:inline-flex; align-items:center; gap:.4rem;
    font-size:.6875rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em;
    color:#6a2c91; background:#f3e8ff; padding:.3rem .875rem;
    border-radius:100px; width:fit-content; border:1px solid #ddd6fe;
  }

  .cp-section-title {
    font-family:'DM Serif Display',Georgia,serif;
    font-size:clamp(1.25rem,3vw,1.625rem); color:#1e1b4b;
    margin:0; letter-spacing:-.01em; line-height:1.25;
  }

  .cp-section p {
    font-size:.9rem; color:#475569; line-height:1.75; margin:0;
  }

  /* Info box */
  .cp-info-box {
    background:linear-gradient(135deg,#f0f9ff,#e0f2fe);
    border:1.5px solid #bae6fd; border-radius:1rem;
    padding:1rem 1.25rem; font-size:.875rem; color:#0369a1; line-height:1.6;
  }
  .cp-info-box strong { color:#0c4a6e; }

  .cp-warning-box {
    background:linear-gradient(135deg,#fffbeb,#fef3c7);
    border:1.5px solid #fde68a; border-radius:1rem;
    padding:1rem 1.25rem; font-size:.875rem; color:#92400e; line-height:1.6;
  }
  .cp-warning-box strong { color:#78350f; }

  /* Use grid */
  .cp-use-grid {
    display:grid; grid-template-columns:1fr 1fr; gap:.75rem;
  }
  @media (max-width:500px) { .cp-use-grid { grid-template-columns:1fr; } }

  .cp-use-card {
    display:flex; flex-direction:column; gap:.375rem;
    padding:1rem 1.125rem; background:white;
    border:1.5px solid #e5e7eb; border-radius:1rem;
    transition:border-color .2s, box-shadow .2s;
  }
  .cp-use-card:hover { border-color:#c4b5fd; box-shadow:0 4px 16px rgba(106,44,145,.07); }
  .cp-use-emoji { font-size:1.375rem; line-height:1; }
  .cp-use-card strong { font-size:.875rem; font-weight:700; color:#1e1b4b; }
  .cp-use-card span { font-size:.8125rem; color:#64748b; line-height:1.5; }

  /* Cookie type cards */
  .cp-type-list { display:flex; flex-direction:column; gap:1rem; }

  .cp-type-card {
    background:white; border:1.5px solid #e5e7eb; border-radius:1.25rem;
    padding:1.25rem; display:flex; flex-direction:column; gap:1rem;
    transition:border-color .2s, box-shadow .2s;
  }
  .cp-type-card:hover { border-color:#c4b5fd; box-shadow:0 6px 20px rgba(106,44,145,.07); }

  .cp-type-card-header {
    display:flex; align-items:center; gap:.875rem; flex-wrap:wrap;
  }

  .cp-type-icon {
    width:42px; height:42px; border-radius:.875rem; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 10px rgba(0,0,0,.15);
  }

  .cp-type-meta { display:flex; flex-direction:column; gap:.3rem; flex:1; min-width:120px; }
  .cp-type-name { font-size:.9375rem; font-weight:700; color:#1e1b4b; }
  .cp-type-tag {
    display:inline-block; font-size:.6875rem; font-weight:700;
    padding:.2rem .625rem; border-radius:100px; width:fit-content;
  }
  .cp-type-retention {
    font-size:.75rem; color:#94a3b8; font-weight:500;
    margin-left:auto; white-space:nowrap; align-self:center;
  }

  .cp-type-desc { font-size:.875rem; color:#475569; line-height:1.65; margin:0; }

  .cp-type-examples { display:flex; flex-direction:column; gap:.5rem; }
  .cp-examples-label { font-size:.6875rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; }
  .cp-examples-list { display:flex; flex-wrap:wrap; gap:.375rem; }
  .cp-example-chip {
    font-size:.75rem; color:#4b5563; background:#f8fafc;
    border:1px solid #e2e8f0; border-radius:.5rem; padding:.25rem .625rem;
    font-weight:500;
  }

  /* Third party */
  .cp-third-list { display:flex; flex-direction:column; gap:.5rem; }
  .cp-third-row {
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:.5rem;
    padding:.875rem 1rem; background:white;
    border:1.5px solid #e5e7eb; border-radius:.875rem;
    transition:border-color .15s;
  }
  .cp-third-row:hover { border-color:#c4b5fd; }
  .cp-third-info { display:flex; flex-direction:column; gap:.2rem; }
  .cp-third-info strong { font-size:.875rem; font-weight:700; color:#1e1b4b; }
  .cp-third-info span { font-size:.8125rem; color:#64748b; }
  .cp-third-link {
    display:inline-flex; align-items:center; gap:.3rem;
    font-size:.75rem; font-weight:600; color:#6a2c91;
    text-decoration:none; padding:.375rem .75rem;
    background:#f3e8ff; border-radius:.5rem; transition:all .15s;
    white-space:nowrap;
  }
  .cp-third-link:hover { background:#ede9fe; }

  /* Choices */
  .cp-choices { display:flex; flex-direction:column; gap:.75rem; }
  .cp-choice {
    display:flex; align-items:flex-start; gap:.875rem;
    padding:1rem; background:white; border:1.5px solid #e5e7eb;
    border-radius:1rem; transition:border-color .15s;
  }
  .cp-choice:hover { border-color:#c4b5fd; }
  .cp-choice-num {
    width:28px; height:28px; border-radius:50%; flex-shrink:0;
    background:linear-gradient(135deg,#6a2c91,#4a1d6e);
    color:white; font-size:.75rem; font-weight:700;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 2px 6px rgba(106,44,145,.25); margin-top:.1rem;
  }
  .cp-choice strong { display:block; font-size:.875rem; font-weight:700; color:#1e1b4b; margin-bottom:.25rem; }
  .cp-choice p { font-size:.8125rem; color:#64748b; line-height:1.6; margin:0; }

  /* Contact */
  .cp-contact-card {
    background:white; border:1.5px solid #e5e7eb; border-radius:1.25rem;
    overflow:hidden;
  }
  .cp-contact-row {
    display:flex; align-items:center; gap:1rem; padding:.875rem 1.125rem;
    border-bottom:1px solid #f1f5f9; flex-wrap:wrap;
  }
  .cp-contact-row:last-child { border-bottom:none; }
  .cp-contact-label { font-size:.75rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; min-width:56px; }
  .cp-contact-links { display:flex; gap:.75rem; flex-wrap:wrap; }

  .cp-link { color:#6a2c91; font-weight:600; text-decoration:none; font-size:.875rem; }
  .cp-link:hover { text-decoration:underline; }

.cp-use-icon {
  color: #6a2c91;
  margin-bottom: 0.25rem;
}

.cp-use-card {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1rem 1.125rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 1rem;
  transition: border-color .2s, box-shadow .2s;
}

.cp-use-card:hover {
  border-color: #c4b5fd;
  box-shadow: 0 4px 16px rgba(106, 44, 145, .07);
}

.cp-use-card strong {
  font-size: .875rem;
  font-weight: 700;
  color: #1e1b4b;
}

.cp-use-card span {
  font-size: .8125rem;
  color: #64748b;
  line-height: 1.5;
}
</style>
