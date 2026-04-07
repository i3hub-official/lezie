<script lang="ts">
  import { onMount } from 'svelte';

  let isMenuOpen = $state(false);

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.aos').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });

  const scroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    isMenuOpen = false;
  };

  const features = [
    { title: 'Live Incident Map',    desc: 'Watch incidents appear in real-time on an interactive map. Pinpoint alerts the moment they are reported.' },
    { title: 'Instant Alerts',       desc: 'Push notifications delivered in seconds. Never miss a critical event in your neighbourhood.' },
    { title: 'AI Threat Detection',  desc: 'Pattern analysis across all reports to detect emerging threats before they escalate.' },
    { title: 'Community Network',    desc: 'Connect with verified neighbours and local responders. Build a genuine safety net.' },
    { title: 'Anonymous Reporting',  desc: 'Report incidents without fear. Your identity stays protected while your community stays informed.' },
    { title: 'Privacy First',        desc: 'End-to-end encryption and zero data selling. Your safety data belongs to you.' },
  ];

  const steps = [
    { n: '01', title: 'Spot & Report',     desc: 'See something? Tap report. Add photos, location, and details in under 60 seconds.' },
    { n: '02', title: 'AI Analyses',        desc: 'Instant classification by severity, cross-referencing patterns across your area.' },
    { n: '03', title: 'Community Responds', desc: 'Verified neighbours and responders receive targeted alerts and coordinate in real time.' },
  ];
</script>

<svelte:head>
  <title>Lezie — Real-Time Community Safety</title>
  <meta name="description" content="Real-time incident reporting, AI-powered alerts, and fun safety games." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
</svelte:head>

<!-- FAB -->
<a href="/report" class="fab">Report Incident</a>

<!-- NAV -->
<nav class="nav">
  <div class="nav-inner">
    <button class="nav-logo" onclick={() => scroll('home')} type="button">
      <img src="/icons/lz_ico.png" alt="Lezie" width="30" height="30" />
      <span>Lezie</span>
    </button>

    <button class="hamburger" onclick={() => isMenuOpen = !isMenuOpen} type="button" aria-label="Toggle menu">
      {isMenuOpen ? '✕' : '☰'}
    </button>

    <div class="nav-links" class:open={isMenuOpen}>
      <button class="nav-link" onclick={() => scroll('features')}  type="button">Features</button>
      <button class="nav-link" onclick={() => scroll('how')}       type="button">How it Works</button>
      <button class="nav-link" onclick={() => scroll('quest')}     type="button">Safety Games</button>
      <a href="/dashboard" class="nav-cta">Dashboard</a>
    </div>
  </div>
</nav>

<!-- ═══════════════════════════════════ HERO ═══════════════════════════════════ -->
<section id="home" class="hero">
  <div class="hero-bg-shape"></div>
  <div class="hero-bg-shape s2"></div>

  <div class="container hero-container">
    <div class="hero-content">
      <div class="eyebrow aos">Community safety platform</div>

      <h1 class="hero-title aos" style="transition-delay:.1s">
        Keep your community<br><em>safe &amp; connected</em>
      </h1>

      <p class="hero-desc aos" style="transition-delay:.2s">
        Real-time incident reporting, AI-powered threat detection, and instant community
        alerts — with safety games that actually build skills.
      </p>

      <div class="hero-btns aos" style="transition-delay:.3s">
        <a href="/signup" class="btn-primary">Get started free</a>
        <button onclick={() => scroll('quest')} class="btn-outline" type="button">
          Play Safety Quest
        </button>
      </div>

      <div class="hero-stats aos" style="transition-delay:.4s">
        <div class="stat"><span class="stat-n">12K+</span><span class="stat-l">Active users</span></div>
        <div class="stat-sep"></div>
        <div class="stat"><span class="stat-n">500+</span><span class="stat-l">Communities</span></div>
        <div class="stat-sep"></div>
        <div class="stat"><span class="stat-n">98.4%</span><span class="stat-l">Response rate</span></div>
      </div>
    </div>

    <!-- Map card -->
    <div class="hero-visual aos" style="transition-delay:.35s">
      <div class="alert-card ac1">
        <div class="ac-dot" style="background:#ef4444"></div>
        <div><strong>New incident reported</strong><span>2 min ago · Elm Street</span></div>
      </div>

      <div class="map-card">
        <div class="map-topbar">
          <span>Live incident map</span>
          <span class="live-badge"><span class="live-dot"></span>LIVE</span>
        </div>
        <div class="map-grid">
          {#each Array(63) as _, i}
            <div class="mc {i % 7 === 0 ? 'mh' : (i % 5 === 0 ? 'mw' : '')}"></div>
          {/each}
        </div>
        <div class="map-pins">
          <div class="pin p1"></div>
          <div class="pin p2"></div>
          <div class="pin p3"></div>
        </div>
        <div class="map-legend">
          <span class="leg"><span class="leg-dot" style="background:#6a2c91"></span>Active</span>
          <span class="leg"><span class="leg-dot" style="background:#ef4444"></span>Critical</span>
          <span class="leg"><span class="leg-dot" style="background:#f59e0b"></span>Recent</span>
        </div>
      </div>

      <div class="alert-card ac2">
        <div class="ac-dot" style="background:#22c55e"></div>
        <div><strong>Responder en route</strong><span>3 min ETA · Unit 7</span></div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════ FEATURES ══════════════════════════════════ -->
<section id="features" class="section section-white">
  <div class="container">
    <div class="sec-head aos">
      <span class="sec-tag">Features</span>
      <h2>Powerful tools for safer communities</h2>
      <p>Everything your neighbourhood needs to stay informed, connected, and protected.</p>
    </div>

    <div class="feat-grid">
      {#each features as f, i}
        <div class="feat-card aos" style="transition-delay:{i * 0.08}s">
          <div class="feat-num">{String(i + 1).padStart(2, '0')}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════════ SAFETY QUEST ═════════════════════════════════ -->
<section id="quest" class="section quest-section">
  <div class="container">
    <div class="quest-grid">

      <div class="quest-left aos">
        <span class="sec-tag">Learn by Playing</span>
        <h2 class="quest-heading">Safety skills that<br><em>stick with you</em></h2>
        <p class="quest-desc">
          Safety Quest turns real emergency scenarios into engaging games. Make critical decisions,
          earn badges, and compete — while building skills that genuinely matter.
        </p>
        <a href="/safety-quest" class="btn-primary">Start Playing</a>

        <div class="quest-cards">
          <div class="quest-card">
            <div class="qc-label">Real-Life Scenarios</div>
            <p>Face realistic emergencies and practice your response under pressure.</p>
          </div>
          <div class="quest-card">
            <div class="qc-label">Daily Quests</div>
            <p>Quick 3-minute missions to sharpen your safety instincts every day.</p>
          </div>
          <div class="quest-card">
            <div class="qc-label">Leaderboards &amp; Badges</div>
            <p>Compete with neighbours and show off your safety achievements.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════ HOW IT WORKS ══════════════════════════════════ -->
<section id="how" class="section section-fog">
  <div class="container">
    <div class="sec-head aos">
      <span class="sec-tag">How it Works</span>
      <h2>Safety in three simple steps</h2>
      <p>From spotting an incident to community response — Lezie makes it effortless.</p>
    </div>

    <div class="steps">
      {#each steps as s, i}
        <div class="step aos" style="transition-delay:{i * 0.12}s">
          <div class="step-num">{s.n}</div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════ CTA ══════════════════════════════════════ -->
<section class="cta-section">
  <div class="cta-inner aos">
    <span class="sec-tag">Get Started Today</span>
    <h2>Ready to protect<br><em>your community?</em></h2>
    <p>Join thousands already making their neighbourhoods safer. Free to get started, no credit card needed.</p>
    <div class="cta-btns">
      <a href="/signup" class="btn-primary">Get started free</a>
      <a href="/report" class="btn-outline">Report an Incident</a>
    </div>
  </div>
</section>

<!-- ════════════════════════════ FOOTER ══════════════════════════════════════ -->
<footer class="footer">
  <div class="container">
    <div class="foot-grid">
      <div class="foot-brand">
        <div class="foot-logo">
          <img src="/icons/lz_ico.png" alt="Lezie" width="28" height="28" />
          <span>Lezie</span>
        </div>
        <p>Real-time incident reporting, AI threat detection, and safety games for safer communities.</p>
      </div>
      <div class="foot-col">
        <h4>Company</h4>
        <a href="/about"     class="foot-link">About Us</a>
        <a href="/contact"   class="foot-link">Contact</a>
      </div>
      <div class="foot-col">
        <h4>Resources</h4>
        <a href="/faq"               class="foot-link">FAQ</a>
        <a href="/safety-guidelines" class="foot-link">Safety Guidelines</a>
      </div>
      <div class="foot-col">
        <h4>Legal</h4>
        <a href="/privacy" class="foot-link">Privacy Policy</a>
        <a href="/terms"   class="foot-link">Terms of Service</a>
      </div>
    </div>
    <div class="foot-divider"></div>
    <div class="foot-bottom">
      <p>&copy; 2026 Lezie. All rights reserved.</p>
      <div class="foot-badge">Keeping communities safe</div>
    </div>
  </div>
</footer>

<style>
  /* ─── RESET & TOKENS ──────────────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :global(body) {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: #ffffff;
    color: #1a0b2e;
    overflow-x: hidden;
  }
  :global(html) { scroll-behavior: smooth; }
  :global(::-webkit-scrollbar)       { width: 5px; }
  :global(::-webkit-scrollbar-track) { background: #f8f7ff; }
  :global(::-webkit-scrollbar-thumb) { background: #6a2c91; border-radius: 99px; }

  :global(:root) {
    --ink:    #1a0b2e;
    --violet: #6a2c91;
    --viol-l: #8b5cf6;
    --lilac:  #c4b5fd;
    --white:  #ffffff;
    --cream:  #faf9ff;
    --fog:    #f4f2fb;
    --mist:   #ece9f8;
    --serif:  'DM Serif Display', Georgia, serif;
  }

  /* ─── ANIMATIONS ──────────────────────────────────────────────────────── */
  @keyframes pulse  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.5} }
  @keyframes drift  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
  @keyframes ringOut{ 0%{transform:translate(-50%,-50%) scale(.7);opacity:.5} 100%{transform:translate(-50%,-50%) scale(2.2);opacity:0} }
  @keyframes blob   { 0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%} 50%{border-radius:40% 60% 30% 70%/60% 40% 70% 30%} }

  :global(.aos)     { opacity:0; transform:translateY(24px); transition: opacity .75s ease, transform .75s ease; }
  :global(.aos.vis) { opacity:1; transform:translateY(0); }

  /* ─── NAV ─────────────────────────────────────────────────────────────── */
  .nav {
    position: fixed; top:0; left:0; right:0; z-index:100;
    background: rgba(255,255,255,.92);
    backdrop-filter: blur(20px) saturate(150%);
    border-bottom: 1px solid rgba(106,44,145,.07);
  }
  .nav-inner {
    max-width: 1220px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 2.5rem;
  }
  .nav-logo {
    display:flex; align-items:center; gap:.625rem;
    background:none; border:none; cursor:pointer;
    font-family: var(--serif); font-size:1.375rem; color:var(--ink);
    letter-spacing:-.02em;
  }
  .nav-logo img { border-radius:8px; }

  .hamburger {
    display:none; background:none; border:none;
    cursor:pointer; color:var(--ink); font-size:1.1rem; padding:.25rem;
  }

  .nav-links { display:flex; align-items:center; gap:.25rem; }
  .nav-link {
    background:none; border:none; font-family:'DM Sans',sans-serif;
    font-size:.875rem; font-weight:500; color:#64748b;
    padding:.5rem .875rem; border-radius:99px; cursor:pointer;
    transition: color .2s, background .2s;
  }
  .nav-link:hover { color:var(--violet); background:rgba(106,44,145,.06); }
  .nav-cta {
    display:inline-flex; align-items:center; gap:.375rem;
    background: linear-gradient(135deg,#6a2c91,#4a1d6e);
    color:white; font-size:.8125rem; font-weight:600;
    padding:.5rem 1.25rem; border-radius:99px; text-decoration:none;
    box-shadow:0 2px 12px rgba(106,44,145,.3);
    transition: transform .2s, box-shadow .2s;
  }
  .nav-cta:hover { transform:translateY(-1px); box-shadow:0 4px 20px rgba(106,44,145,.42); }

  /* ─── FAB ─────────────────────────────────────────────────────────────── */
  .fab {
    position:fixed; bottom:2rem; right:2rem; z-index:200;
    background: linear-gradient(135deg,#6a2c91,#4a1d6e);
    color:white; font-size:.8rem; font-weight:700;
    padding:.75rem 1.375rem; border-radius:99px; text-decoration:none;
    box-shadow:0 6px 24px rgba(106,44,145,.4);
    transition: transform .25s, box-shadow .25s;
    font-family:'DM Sans',sans-serif;
  }
  .fab:hover { transform:translateY(-3px); box-shadow:0 10px 32px rgba(106,44,145,.55); }

  /* ─── HERO ────────────────────────────────────────────────────────────── */
  .hero {
    background: #ffffff;
    padding: 10rem 0 7rem;
    position: relative;
    overflow: hidden;
  }

  .hero-bg-shape {
    position: absolute;
    width: 700px; height: 700px;
    background: radial-gradient(ellipse, rgba(196,181,253,.22) 0%, transparent 70%);
    border-radius: 50%;
    top: -200px; right: -150px;
    pointer-events: none;
    animation: drift 12s ease-in-out infinite;
  }
  .hero-bg-shape.s2 {
    width: 400px; height: 400px;
    background: radial-gradient(ellipse, rgba(106,44,145,.09) 0%, transparent 70%);
    top: auto; bottom: -100px; right: auto; left: -100px;
    animation-delay: -5s;
  }

  .container { max-width: 1180px; margin: 0 auto; padding: 0 2.5rem; }

  .hero-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;
  }

  .hero-content { position: relative; z-index: 1; }

  .eyebrow {
    display:inline-block;
    background: rgba(106,44,145,.07);
    border: 1px solid rgba(106,44,145,.14);
    border-radius: 99px; padding: .375rem .875rem;
    font-size: .75rem; font-weight: 700; color: var(--violet);
    letter-spacing: .07em; text-transform: uppercase;
    margin-bottom: 1.75rem;
  }

  .hero-title {
    font-family: var(--serif);
    font-size: clamp(2.75rem,4vw,4rem);
    line-height: 1.08; color: var(--ink);
    margin-bottom: 1.625rem;
  }
  .hero-title em { color: var(--violet); font-style: italic; }

  .hero-desc {
    font-size: .9375rem; line-height: 1.8;
    color: #64748b; max-width: 430px;
    margin-bottom: 2.5rem;
  }

  .hero-btns {
    display: flex; gap: .875rem; flex-wrap: wrap;
    margin-bottom: 3.5rem;
  }

  .hero-stats { display:flex; gap:2.25rem; }
  .stat { display:flex; flex-direction:column; gap:.2rem; }
  .stat-n { font-family:var(--serif); font-size:1.875rem; color:var(--ink); }
  .stat-l { font-size:.75rem; color:#94a3b8; font-weight:500; letter-spacing:.04em; }
  .stat-sep { width:1px; background:var(--mist); align-self:stretch; }

  /* hero visual */
  .hero-visual {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .alert-card {
    position:absolute; background:white;
    border:1px solid rgba(106,44,145,.1); border-radius:1rem;
    box-shadow:0 8px 28px rgba(106,44,145,.1);
    padding:.875rem 1.125rem;
    display:flex; align-items:center; gap:.75rem;
    font-size:.8rem; z-index:3;
  }
  .alert-card strong { display:block; font-weight:700; color:var(--ink); }
  .alert-card span   { color:#94a3b8; font-size:.75rem; }
  .ac-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
  .ac1 { top:0; left:-1.5rem; }
  .ac2 { bottom:0; right:-1.5rem; }

  .map-card {
    background:white; border-radius:1.5rem;
    border:1px solid rgba(106,44,145,.1);
    box-shadow:0 24px 60px rgba(106,44,145,.14), 0 4px 12px rgba(0,0,0,.04);
    width:100%; max-width:360px;
    overflow:hidden; position:relative; z-index:2;
  }
  .map-topbar {
    display:flex; align-items:center; gap:.5rem;
    padding:.875rem 1rem; font-size:.8125rem; font-weight:600; color:var(--ink);
    border-bottom:1px solid rgba(106,44,145,.07);
  }
  .live-badge {
    margin-left:auto; display:flex; align-items:center; gap:.375rem;
    font-size:.7rem; font-weight:700; color:var(--violet);
    letter-spacing:.06em; text-transform:uppercase;
  }
  .live-dot { width:7px; height:7px; border-radius:50%; background:#22c55e; animation:pulse 2s ease-in-out infinite; }

  .map-grid { display:grid; grid-template-columns:repeat(9,1fr); gap:3px; padding:1rem; }
  .mc  { height:20px; border-radius:3px; background:#ede8f7; }
  .mh  { background:rgba(106,44,145,.32); }
  .mw  { background:rgba(196,181,253,.55); }

  .map-pins { position:relative; height:56px; margin:0 1rem; }
  .pin {
    position:absolute; width:20px; height:20px; border-radius:50%;
    border:2px solid white; box-shadow:0 2px 8px rgba(0,0,0,.15);
  }
  .pin::after {
    content:''; position:absolute; top:50%; left:50%;
    width:30px; height:30px; border-radius:50%;
    background:inherit; opacity:.2;
    animation:ringOut 2.2s ease-out infinite;
  }
  .p1 { background:#6a2c91; top:10px; left:18%; }
  .p2 { background:#ef4444; top:20px; left:52%; animation-delay:.8s; }
  .p3 { background:#f59e0b; top:6px;  left:74%; animation-delay:1.6s; }

  .map-legend {
    display:flex; gap:1rem; padding:.75rem 1rem;
    border-top:1px solid rgba(106,44,145,.07);
  }
  .leg { display:flex; align-items:center; gap:.375rem; font-size:.75rem; color:#64748b; font-weight:500; }
  .leg-dot { width:8px; height:8px; border-radius:50%; }

  /* ─── SECTIONS ────────────────────────────────────────────────────────── */
  .section       { padding: 8rem 0; }
  .section-white { background: #ffffff; }
  .section-fog   { background: var(--fog); }

  .sec-head { text-align:center; margin-bottom:5rem; }
  .sec-tag {
    display:inline-block;
    background:rgba(106,44,145,.07); border:1px solid rgba(106,44,145,.14);
    border-radius:99px; padding:.3rem .875rem;
    font-size:.7rem; font-weight:700; color:var(--violet);
    letter-spacing:.07em; text-transform:uppercase; margin-bottom:1.25rem;
  }
  .sec-tag-light {
    background:rgba(196,181,253,.15); border-color:rgba(196,181,253,.3); color:#c4b5fd;
  }
  .sec-head h2 {
    font-family:var(--serif); font-size:clamp(2rem,4vw,3rem);
    color:var(--ink); margin-bottom:1rem; line-height:1.15;
  }
  .sec-head p { font-size:1rem; color:#64748b; max-width:500px; margin:0 auto; line-height:1.75; }

  /* ─── FEATURES ────────────────────────────────────────────────────────── */
  .feat-grid {
    display:grid; grid-template-columns:repeat(3,1fr); gap:1.75rem;
  }
  .feat-card {
    border-radius:1.25rem; padding:2.25rem 2rem;
    border:1px solid var(--mist); background:var(--cream);
    transition: transform .3s, box-shadow .3s, border-color .3s;
    position:relative; overflow:hidden;
  }
  .feat-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,var(--violet),var(--viol-l));
    opacity:0; transition:opacity .3s;
  }
  .feat-card:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(106,44,145,.1); border-color:rgba(106,44,145,.18); }
  .feat-card:hover::before { opacity:1; }
  .feat-num {
    display:inline-flex; align-items:center; justify-content:center;
    width:36px; height:36px; border-radius:10px;
    background:linear-gradient(135deg,#6a2c91,#8b5cf6);
    color:white; font-family:'DM Sans',sans-serif;
    font-size:.8125rem; font-weight:700; letter-spacing:.02em;
    margin-bottom:1.25rem;
  }
  .feat-card h3 { font-family:var(--serif); font-size:1.125rem; color:var(--ink); margin-bottom:.625rem; }
  .feat-card p  { font-size:.875rem; color:#64748b; line-height:1.7; }

  /* ─── SAFETY QUEST ────────────────────────────────────────────────────── */
  .quest-section {
    background: var(--fog);
    position:relative; overflow:hidden;
  }
  .quest-section::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse 55% 50% at 70% 50%, rgba(196,181,253,.25), transparent 70%);
    pointer-events:none;
  }
  .quest-grid {
    display:grid; grid-template-columns:1fr 1fr;
    gap:6rem; align-items:center; position:relative; z-index:1;
  }

  .quest-heading {
    font-family:var(--serif); font-size:clamp(2rem,3.5vw,3rem);
    color:var(--ink); line-height:1.12; margin:1rem 0 1.25rem;
  }
  .quest-heading em { color:var(--violet); font-style:italic; }
  .quest-desc { font-size:.9375rem; line-height:1.8; color:#64748b; margin-bottom:2rem; }

  .quest-cards { display:flex; flex-direction:column; gap:.875rem; margin-top:2rem; }
  .quest-card {
    background:white; border:1px solid var(--mist);
    border-radius:1rem; padding:1.25rem 1.5rem;
    transition: box-shadow .25s, border-color .25s;
  }
  .quest-card:hover { box-shadow:0 6px 20px rgba(106,44,145,.08); border-color:rgba(106,44,145,.2); }
  .qc-label { font-size:.9375rem; font-weight:700; color:var(--ink); margin-bottom:.3rem; }
  .quest-card p { font-size:.8125rem; color:#64748b; line-height:1.6; }

  /* score panel */
  .score-panel {
    background:white; border:1px solid var(--mist);
    border-radius:1.5rem; padding:2.25rem;
    box-shadow:0 8px 32px rgba(106,44,145,.08);
  }
  .score-header { margin-bottom:2rem; }
  .score-label  { font-size:.7rem; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:#94a3b8; }
  .score-user {
    display:flex; align-items:center; gap:1rem; margin-bottom:1.75rem;
    padding:1.125rem; background:var(--fog); border-radius:1rem;
  }
  .score-avatar {
    width:48px; height:48px; border-radius:50%;
    background:linear-gradient(135deg,#c4b5fd,#8b5cf6);
    display:flex; align-items:center; justify-content:center;
    font-family:var(--serif); font-size:1.25rem; color:white; flex-shrink:0;
  }
  .score-name { font-weight:700; color:var(--ink); font-size:.9375rem; }
  .score-pts  { font-size:.8125rem; color:#64748b; }
  .score-pts strong { color:var(--violet); }
  .score-bars { display:flex; flex-direction:column; gap:1rem; }
  .sb-label   { display:flex; justify-content:space-between; font-size:.75rem; font-weight:600; color:#475569; margin-bottom:.4rem; }
  .sb-track   { height:7px; background:var(--mist); border-radius:99px; overflow:hidden; }
  .sb-fill    { height:100%; border-radius:99px; background:linear-gradient(90deg,#6a2c91,#8b5cf6); }
  .score-chips{ display:flex; gap:.5rem; flex-wrap:wrap; margin-top:1.5rem; }
  .chip {
    background:rgba(106,44,145,.07); border:1px solid rgba(106,44,145,.15);
    border-radius:99px; padding:.3rem .75rem;
    font-size:.75rem; font-weight:600; color:var(--violet);
  }

  /* ─── HOW IT WORKS ────────────────────────────────────────────────────── */
  .steps { display:grid; grid-template-columns:repeat(3,1fr); gap:3rem; position:relative; }
  .steps::before {
    content:''; position:absolute; top:44px; left:16%; right:16%;
    height:1px; background:linear-gradient(90deg,transparent,rgba(106,44,145,.25),transparent);
  }
  .step { text-align:center; padding:1rem; }
  .step-num {
    width:60px; height:60px; border-radius:50%;
    background:linear-gradient(135deg,#6a2c91,#8b5cf6);
    color:white; font-family:var(--serif); font-size:1.25rem;
    display:flex; align-items:center; justify-content:center;
    margin:0 auto 2rem; box-shadow:0 4px 18px rgba(106,44,145,.28);
  }
  .step h3 { font-family:var(--serif); font-size:1.25rem; color:var(--ink); margin-bottom:.75rem; }
  .step p  { font-size:.9rem; color:#64748b; line-height:1.7; }

  /* ─── CTA ─────────────────────────────────────────────────────────────── */
  .cta-section {
    background: white;
    text-align:center; padding:9rem 2rem;
    position:relative; overflow:hidden;
    border-top: 1px solid var(--mist);
  }
  .cta-section::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse 55% 55% at 50% 100%, rgba(196,181,253,.2), transparent 70%);
    pointer-events:none;
  }
  .cta-inner { position:relative; z-index:1; }
  .cta-inner h2 {
    font-family:var(--serif); font-size:clamp(2rem,5vw,3.75rem);
    color:var(--ink); margin:1rem 0 1.25rem; line-height:1.12;
  }
  .cta-inner h2 em { color:var(--violet); font-style:italic; }
  .cta-inner p { font-size:1rem; color:#64748b; max-width:480px; margin:0 auto 2.75rem; line-height:1.75; }
  .cta-btns { display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; }
  .btn-cta-white {
    display:inline-flex; align-items:center; gap:.5rem;
    background:white; color:var(--ink); font-size:.9375rem; font-weight:700;
    padding:.9375rem 2.125rem; border-radius:99px; text-decoration:none;
    box-shadow:0 4px 20px rgba(0,0,0,.18);
    transition:all .25s; font-family:'DM Sans',sans-serif;
  }
  .btn-cta-white:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,0,0,.28); }
  .btn-cta-ghost {
    display:inline-flex; align-items:center; gap:.5rem;
    background:transparent; border:1.5px solid rgba(106,44,145,.25);
    color:var(--violet); font-size:.9375rem; font-weight:600;
    padding:.9375rem 2.125rem; border-radius:99px; text-decoration:none;
    transition:all .25s; font-family:'DM Sans',sans-serif;
  }
  .btn-cta-ghost:hover { border-color:var(--violet); background:rgba(106,44,145,.05); }

  /* ─── SHARED BUTTONS ──────────────────────────────────────────────────── */
  .btn-primary {
    display:inline-flex; align-items:center; gap:.5rem;
    background:linear-gradient(135deg,#6a2c91,#4a1d6e);
    color:white; font-size:.9rem; font-weight:700;
    padding:.875rem 1.75rem; border-radius:99px; text-decoration:none;
    box-shadow:0 4px 18px rgba(106,44,145,.32);
    transition:all .25s; border:none; cursor:pointer; font-family:'DM Sans',sans-serif;
  }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 26px rgba(106,44,145,.48); }
  .btn-outline {
    display:inline-flex; align-items:center; gap:.5rem;
    background:transparent; border:1.5px solid rgba(106,44,145,.25);
    color:var(--violet); font-size:.9rem; font-weight:600;
    padding:.875rem 1.75rem; border-radius:99px;
    transition:all .25s; cursor:pointer; font-family:'DM Sans',sans-serif;
  }
  .btn-outline:hover { border-color:var(--violet); background:rgba(106,44,145,.05); }

  /* ─── FOOTER ──────────────────────────────────────────────────────────── */
  .footer { background: var(--fog); border-top: 1px solid var(--mist); padding:5rem 0 2.5rem; }
  .foot-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:3rem; margin-bottom:3.5rem; }
  .foot-brand { display:flex; flex-direction:column; }
  .foot-logo  { display:flex; align-items:center; gap:.5rem; margin-bottom:1.125rem; }
  .foot-logo span { font-family:var(--serif); font-size:1.25rem; color:var(--ink); }
  .foot-logo img  { border-radius:7px; }
  .foot-brand p { font-size:.8rem; color:#94a3b8; line-height:1.75; max-width:230px; }
  .foot-col h4  { font-size:.7rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#94a3b8; margin-bottom:1.25rem; }
  .foot-link    { display:block; font-size:.875rem; color:#475569; text-decoration:none; margin-bottom:.75rem; transition:color .2s; }
  .foot-link:hover { color:var(--violet); }
  .foot-divider { height:1px; background:var(--mist); margin-bottom:2rem; }
  .foot-bottom  { display:flex; justify-content:space-between; align-items:center; }
  .foot-bottom p { font-size:.8rem; color:#94a3b8; }
  .foot-badge   { font-size:.75rem; color:#94a3b8; }

  /* ─── RESPONSIVE ──────────────────────────────────────────────────────── */
  @media (max-width:1024px) {
    .hero-container { grid-template-columns:1fr; gap:4rem; }
    .hero { padding:9rem 0 6rem; }
    .feat-grid  { grid-template-columns:1fr 1fr; }
    .quest-grid { grid-template-columns:1fr; gap:4rem; }
    .foot-grid  { grid-template-columns:1fr 1fr; gap:2.5rem; }
    .nav-inner  { padding:1rem 1.5rem; }
    .hamburger  { display:block; }
    .nav-links  { display:none; }
    .nav-links.open {
      display:flex; flex-direction:column; align-items:flex-start;
      position:absolute; top:100%; left:0; right:0;
      background:rgba(255,255,255,.97); backdrop-filter:blur(20px);
      padding:1.25rem 1.5rem; gap:.25rem;
      border-bottom:1px solid rgba(106,44,145,.08);
    }
    .ac1, .ac2 { display:none; }
  }
  @media (max-width:640px) {
    .feat-grid   { grid-template-columns:1fr; }
    .steps       { grid-template-columns:1fr; gap:2rem; }
    .steps::before { display:none; }
    .foot-grid   { grid-template-columns:1fr; gap:2rem; }
    .foot-bottom { flex-direction:column; gap:1rem; text-align:center; }
    .section     { padding:5rem 0; }
    .cta-section { padding:6rem 1.5rem; }
  }
</style>