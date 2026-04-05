<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import {
    ShieldCheck, ArrowRight, MapPin, Radio, Cpu, BadgeCheck,
    Map, EyeOff, BellRing, Smartphone, BrainCircuit, Megaphone,
    ScanEye, Users, LockKeyhole, FlagTriangleRight, PhoneCall,
    MessageCircle, ChevronRight,
    TrendingUp, Activity, Shield, Star, PlayCircle
  } from 'lucide-svelte';

  let isLoading = $state(true);

  onMount(() => {
    const unsubscribe = authStore.subscribe((state) => {
      if (state.user) {
        goto('/dashboard');
      } else {
        isLoading = false;
      }
    });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.aos').forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => goto('/signup');
</script>

<svelte:head>
  <title>Lezie – Community Safety Platform</title>
  <meta name="description" content="Real-time incident reporting, AI-powered threat detection, and community-driven safety alerts." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<!-- Full Landing Page Content (always rendered) -->
<!-- FAB -->
<button class="lz-fab" onclick={() => goto('/auth/report')} aria-label="Report an incident">
  <FlagTriangleRight size={18} />
  <span>Report incident</span>
</button>

<!-- ── HERO ── -->
<section id="home" class="lz-hero">
  <div class="lz-hero-mesh" aria-hidden="true">
    <div class="lz-mesh-blob lz-mesh-blob--1"></div>
    <div class="lz-mesh-blob lz-mesh-blob--2"></div>
    <div class="lz-mesh-blob lz-mesh-blob--3"></div>
  </div>

  <div class="lz-hero-inner">
    <div class="lz-hero-content">
      <div class="lz-eyebrow aos">
        <ShieldCheck size={13} />
        Community safety platform
        <span class="lz-eyebrow-new">NEW</span>
      </div>

      <h1 class="lz-hero-title aos">
        Keep your community<br/>
        <em class="lz-hero-em">safe &amp; connected</em>
      </h1>

      <p class="lz-hero-desc aos">
        Real-time incident reporting, AI-powered threat detection, and
        community-driven safety alerts. Join thousands creating safer
        neighbourhoods together.
      </p>

      <div class="lz-hero-actions aos">
        <button class="lz-btn-primary" onclick={handleGetStarted}>
          Get started free
          <ArrowRight size={15} />
        </button>
        <button type="button" class="lz-btn-ghost" onclick={() => scrollTo('how-it-works')}>
          <PlayCircle size={15} />
          See how it works
        </button>
      </div>

      <div class="lz-hero-stats aos">
        <div class="lz-hstat">
          <span class="lz-hstat-n">10K+</span>
          <span class="lz-hstat-l">Active users</span>
        </div>
        <div class="lz-hstat-sep"></div>
        <div class="lz-hstat">
          <span class="lz-hstat-n">500+</span>
          <span class="lz-hstat-l">Communities</span>
        </div>
        <div class="lz-hstat-sep"></div>
        <div class="lz-hstat">
          <span class="lz-hstat-n">98%</span>
          <span class="lz-hstat-l">Response rate</span>
        </div>
      </div>

      <div class="lz-trust aos">
        <div class="lz-trust-icons">
          {#each [0,1,2] as _}<Shield size={11} />{/each}
        </div>
        <span>Trusted by local authorities</span>
      </div>
    </div>

    <div class="lz-hero-card aos">
      <div class="lz-card-topbar">
        <MapPin size={13} />
        <span>Live incident map</span>
        <span class="lz-live-dot"></span>
        <span class="lz-live-label">24/7 Monitoring</span>
      </div>
      <div class="lz-map-grid">
        {#each Array(54) as _, i}
          <div class="lz-mc {i % 7 === 0 ? 'h' : (i % 5 === 0 ? 'w' : '')}"></div>
        {/each}
      </div>
      <div class="lz-map-pins" aria-hidden="true">
        <div class="lz-pin p1"></div>
        <div class="lz-pin p2"></div>
        <div class="lz-pin p3"></div>
        <div class="lz-pin p4"></div>
      </div>
      <div class="lz-legend">
        <div class="lz-leg"><span class="lz-leg-dot" style="background:#EF4444"></span>Critical</div>
        <div class="lz-leg"><span class="lz-leg-dot" style="background:#F59E0B"></span>High</div>
        <div class="lz-leg"><span class="lz-leg-dot" style="background:var(--primary-color)"></span>Active</div>
        <div class="lz-leg"><span class="lz-leg-dot" style="background:var(--primary-light)"></span>Recent</div>
      </div>
      <button class="lz-card-cta" onclick={() => goto('/auth/report')}>
        <FlagTriangleRight size={13} />
        Report incident on this map
        <ChevronRight size={13} />
      </button>
    </div>
  </div>
</section>

<!-- All other sections (features, how-it-works, stats, safety-tips, testimonials, cta, footer) follow exactly as in the previous full version. -->

<!-- Custom Loading Overlay (shown only while checking auth) -->
{#if isLoading}
  <div class="lz-loading">
    <div class="lz-loading-content">
      <div class="lz-loading-logo">
        <img src="/icons/lz_ico.png" alt="Lezie" />
        <span>Lezie</span>
      </div>
      <div class="lz-spinner"></div>
      <p>Verifying access...</p>
    </div>
  </div>
{/if}

<!-- The rest of your sections (FEATURES through FOOTER) go here – identical to the previous complete code I provided. -->

<style>
  /* All previous styles remain the same, plus the loading overlay */

  .lz-loading {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.98);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .lz-loading-content { text-align: center; }

  .lz-loading-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    justify-content: center;
  }

  .lz-loading-logo img { width: 48px; height: 48px; object-fit: contain; }

  .lz-loading-logo span {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 2rem;
    color: var(--primary-dark);
  }

  .lz-spinner {
    width: 48px;
    height: 48px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1.5rem;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .lz-loading p {
    color: var(--gray-color);
    font-size: 0.95rem;
  }

  /* ── HERO ── */
  .lz-hero {
    position: relative; overflow: hidden;
    padding: 5rem 2rem 4rem;
    max-width: 1280px; margin: 0 auto;
  }

  .lz-hero-mesh { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

  .lz-mesh-blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); opacity: .35;
  }

  .lz-mesh-blob--1 {
    width: 500px; height: 500px;
    background: var(--primary-bg);
    top: -120px; right: -80px;
  }

  .lz-mesh-blob--2 {
    width: 300px; height: 300px;
    background: var(--primary-border);
    bottom: 0; left: -60px;
  }

  .lz-mesh-blob--3 {
    width: 200px; height: 200px;
    background: var(--secondary-color);
    top: 40%; left: 45%; opacity: .2;
  }

  .lz-hero-inner {
    position: relative; z-index: 1;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: center;
  }

  .lz-eyebrow {
    display: inline-flex; align-items: center; gap: .5rem;
    background: var(--primary-bg); border: 1px solid var(--primary-border);
    color: var(--primary-dark); padding: .375rem .875rem;
    border-radius: 9999px; font-size: .75rem; font-weight: 600; margin-bottom: 1.5rem;
  }

  .lz-eyebrow-new {
    background: var(--primary-color); color: white;
    padding: .1rem .375rem; border-radius: 9999px;
    font-size: .6rem; font-weight: 700; margin-left: .25rem;
  }

  .lz-hero-title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(2.25rem, 5vw, 3.75rem);
    line-height: 1.15; color: var(--dark-color); margin-bottom: 1.25rem;
    letter-spacing: -.02em;
  }

  .lz-hero-em {
    font-style: italic;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    background-clip: text; -webkit-background-clip: text; color: transparent;
  }

  .lz-hero-desc {
    font-size: 1rem; color: var(--gray-color); line-height: 1.7;
    margin-bottom: 2rem; max-width: 480px;
  }

  .lz-hero-actions { display: flex; gap: .875rem; flex-wrap: wrap; margin-bottom: 2.5rem; }

  .lz-btn-primary {
    display: inline-flex; align-items: center; gap: .5rem;
    padding: .75rem 1.5rem;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white; border: none; border-radius: 9999px;
    font-size: .9rem; font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; box-shadow: 0 4px 14px rgba(106,44,145,.3);
    transition: all .2s; text-decoration: none;
  }

  .lz-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(106,44,145,.4); }

  .lz-btn-ghost {
    display: inline-flex; align-items: center; gap: .5rem;
    padding: .75rem 1.5rem; border: 1.5px solid #e5e7eb;
    color: var(--gray-color); background: none; border-radius: 9999px;
    font-size: .875rem; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all .2s;
  }

  .lz-btn-ghost:hover { border-color: var(--primary-border); color: var(--primary-color); }

  .lz-hero-stats { display: flex; gap: 2rem; align-items: center; margin-bottom: 1.5rem; }

  .lz-hstat { display: flex; flex-direction: column; }
  .lz-hstat-n { font-size: 1.5rem; font-weight: 800; color: var(--primary-color); font-family: 'DM Serif Display', serif; }
  .lz-hstat-l { font-size: .75rem; color: var(--gray-color); }
  .lz-hstat-sep { width: 1px; height: 36px; background: #e5e7eb; }

  .lz-trust { display: flex; align-items: center; gap: .5rem; font-size: .75rem; color: var(--gray-color); }
  .lz-trust-icons { display: flex; gap: .25rem; color: var(--success-color); }

  /* Hero map card */
  .lz-hero-card {
    background: white;
    border: 1px solid var(--primary-border);
    border-radius: 1.5rem;
    padding: 1.25rem;
    box-shadow: 0 8px 32px rgba(106,44,145,.1), 0 2px 8px rgba(0,0,0,.06);
    position: relative; overflow: hidden;
  }

  .lz-card-topbar {
    display: flex; align-items: center; gap: .5rem;
    margin-bottom: 1rem; font-size: .75rem; font-weight: 600; color: var(--primary-color);
  }

  .lz-live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--success-color); margin-left: auto;
    animation: livePulse 1.8s infinite;
  }

  .lz-live-label { font-size: .688rem; color: var(--primary-color); font-weight: 600; }

  .lz-map-grid {
    display: grid; grid-template-columns: repeat(18, 1fr);
    gap: 3px; margin-bottom: .875rem;
  }

  .lz-mc { height: 11px; border-radius: 2px; background: var(--primary-border); }
  .lz-mc.h { background: var(--primary-color); opacity: .85; }
  .lz-mc.w { background: var(--primary-light); opacity: .55; }

  .lz-map-pins { position: absolute; top: 2.5rem; left: 0; right: 0; bottom: 2.5rem; pointer-events: none; }

  .lz-pin {
    position: absolute; width: 10px; height: 10px;
    border-radius: 50%; background: var(--primary-color);
  }

  .lz-pin::after {
    content: ''; position: absolute; inset: -5px; border-radius: 50%;
    border: 1.5px solid var(--primary-color); animation: ring 2s infinite;
  }

  .p1 { top: 42%; left: 42%; }
  .p2 { top: 60%; left: 60%; } .p2::after { animation-delay: .7s; }
  .p3 { top: 28%; left: 70%; } .p3::after { animation-delay: 1.4s; }
  .p4 { top: 75%; left: 30%; } .p4::after { animation-delay: .35s; }

  .lz-legend { display: flex; gap: .875rem; flex-wrap: wrap; margin-bottom: .875rem; }
  .lz-leg { display: flex; align-items: center; gap: .375rem; font-size: .688rem; color: var(--gray-color); }
  .lz-leg-dot { width: 7px; height: 7px; border-radius: 50%; }

  .lz-card-cta {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: .5rem;
    padding: .5rem; background: var(--primary-bg); border: 1px solid var(--primary-border);
    border-radius: .625rem; font-size: .688rem; font-weight: 600; color: var(--primary-color);
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s;
  }

  .lz-card-cta:hover { background: var(--primary-color); color: white; border-color: var(--primary-color); }

  /* ── SECTION HEADS ── */
  .lz-sec-head { text-align: center; margin-bottom: 3.5rem; }

  .lz-tag {
    display: inline-block; background: var(--primary-bg);
    border: 1px solid var(--primary-border); color: var(--primary-dark);
    padding: .25rem .875rem; border-radius: 9999px;
    font-size: .75rem; font-weight: 600; margin-bottom: 1rem;
  }

  .lz-sec-head h2 {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 400; color: var(--dark-color); margin-bottom: .75rem; letter-spacing: -.02em;
  }

  .lz-sec-head h2 em {
    font-style: italic; color: var(--primary-color);
  }

  .lz-sec-head p { color: var(--gray-color); font-size: .9rem; max-width: 560px; margin: 0 auto; }

  /* ── FEATURES ── */
  .lz-feat-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem;
  }

  .lz-feat-card {
    background: white; border: 1.5px solid #e5e7eb; border-radius: 1.125rem;
    padding: 1.5rem; position: relative; transition: all .25s;
  }

  .lz-feat-card:hover {
    border-color: var(--primary-border);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(106,44,145,.08);
  }

  .lz-feat-badge {
    position: absolute; top: 1rem; right: 1rem;
    font-size: .625rem; font-weight: 700; letter-spacing: .04em;
    padding: .2rem .5rem; background: var(--primary-bg);
    border: 1px solid var(--primary-border); border-radius: .5rem;
    color: var(--primary-dark);
  }

  .lz-feat-icon {
    width: 44px; height: 44px; background: var(--primary-bg);
    border: 1px solid var(--primary-border); border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    color: var(--primary-color); margin-bottom: 1rem;
  }

  .lz-feat-card h3 { font-size: .9375rem; font-weight: 700; color: var(--dark-color); margin-bottom: .375rem; }
  .lz-feat-card p  { font-size: .8125rem; color: var(--gray-color); line-height: 1.65; }

  /* ── HOW IT WORKS ── */
  .lz-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }

  .lz-step {
    text-align: center; padding: 2rem 1.5rem;
    border: 1.5px solid #e5e7eb; border-radius: 1.125rem;
    background: white; transition: all .25s;
  }

  .lz-step:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.07); border-color: var(--primary-border); }

  .lz-step-num {
    width: 38px; height: 38px; background: var(--primary-color); color: white;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif; font-size: 1rem; font-weight: 400;
    margin: 0 auto .875rem;
  }

  .lz-step-ico { margin-bottom: .875rem; color: var(--primary-color); display: flex; justify-content: center; }
  .lz-step h3  { font-size: .9375rem; font-weight: 700; color: var(--dark-color); margin-bottom: .5rem; }
  .lz-step p   { font-size: .8125rem; color: var(--gray-color); line-height: 1.65; margin-bottom: .875rem; }

  .lz-step-pill {
    display: inline-block; font-size: .688rem; font-weight: 500;
    color: var(--primary-color); background: var(--primary-bg);
    border: 1px solid var(--primary-border); padding: .25rem .625rem;
    border-radius: .5rem; margin-bottom: .75rem;
  }

  .lz-step-badges { display: flex; gap: .5rem; justify-content: center; margin-bottom: .75rem; }

  .lz-sbadge {
    font-size: .625rem; font-weight: 700; padding: .2rem .5rem; border-radius: .5rem;
    letter-spacing: .03em;
  }

  .lz-sbadge--danger  { background: #fee2e2; color: #dc2626; }
  .lz-sbadge--success { background: #d1fae5; color: #059669; }

  .lz-step-link {
    display: inline-flex; align-items: center; gap: .25rem;
    background: none; border: none; font-size: .75rem; font-weight: 600;
    color: var(--primary-color); cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: gap .2s;
  }

  .lz-step-link:hover { gap: .5rem; }

  /* ── STATS ── */
  .lz-stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem; }

  .lz-stat-card {
    text-align: center; padding: 1.5rem; background: white;
    border-radius: 1.125rem; border: 1.5px solid #e5e7eb; transition: border-color .2s;
  }

  .lz-stat-card:hover { border-color: var(--primary-border); }

  .lz-stat-icon {
    width: 44px; height: 44px; background: var(--primary-bg); border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto .875rem; color: var(--primary-color);
  }

  .lz-stat-val { font-family: 'DM Serif Display', serif; font-size: 1.75rem; font-weight: 400; color: var(--dark-color); margin-bottom: .25rem; }
  .lz-stat-lbl { font-size: .75rem; color: var(--gray-color); line-height: 1.4; }

  /* ── TIPS ── */
  .lz-tips-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); gap: 1.25rem; }

  .lz-tip {
    background: white; border: 1.5px solid #e5e7eb; border-radius: 1.125rem;
    padding: 1.5rem; text-align: center; transition: all .25s;
  }

  .lz-tip:hover { transform: translateY(-3px); border-color: var(--primary-border); }

  .lz-tip-ico {
    width: 44px; height: 44px; background: var(--primary-bg);
    border: 1px solid var(--primary-border); border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto .875rem; color: var(--primary-color);
  }

  .lz-tip h3 { font-size: .875rem; font-weight: 700; color: var(--dark-color); margin-bottom: .5rem; }
  .lz-tip p  { font-size: .8rem; color: var(--gray-color); line-height: 1.65; }

  /* ── TESTIMONIALS ── */
  .lz-testimonials { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); gap: 1.25rem; }

  .lz-testimonial {
    background: white; border: 1.5px solid #e5e7eb; border-radius: 1.125rem;
    padding: 1.5rem; position: relative; transition: border-color .2s;
  }

  .lz-testimonial:hover { border-color: var(--primary-border); }

  .lz-t-mark {
    font-family: 'DM Serif Display', serif; font-size: 3rem; line-height: 1;
    color: var(--primary-color); opacity: .25; position: absolute; top: .75rem; left: 1.25rem;
  }

  .lz-testimonial p {
    font-size: .8125rem; color: var(--dark-color); line-height: 1.7;
    margin-bottom: 1rem; padding-top: 1.25rem;
  }

  .lz-t-author strong { display: block; font-size: .75rem; font-weight: 700; color: var(--dark-color); }
  .lz-t-author span   { font-size: .688rem; color: var(--gray-color); }

  /* ── CTA ── */
  .lz-cta {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    border-radius: 1.5rem; padding: 4rem 2rem; text-align: center;
    position: relative; overflow: hidden;
  }

  .lz-cta-glow {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 80% 20%, rgba(196,181,253,.2) 0%, transparent 60%),
      radial-gradient(ellipse 40% 60% at 20% 80%, rgba(75,29,104,.5) 0%, transparent 60%);
  }

  :global(.lz-cta-shield) { color: white; margin-bottom: 1rem; position: relative; z-index: 1; }

  .lz-cta h2 {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 400;
    color: white; margin-bottom: .75rem; position: relative; z-index: 1; letter-spacing: -.02em;
  }

  .lz-cta p {
    color: rgba(255,255,255,.85); font-size: .9rem; margin-bottom: 2rem;
    max-width: 500px; margin-left: auto; margin-right: auto; position: relative; z-index: 1;
  }

  .lz-cta-btns {
    display: flex; gap: 1rem; justify-content: center;
    flex-wrap: wrap; margin-bottom: 1.25rem; position: relative; z-index: 1;
  }

  .lz-btn-lg { padding: .875rem 2rem; font-size: .9rem; }

  .lz-btn-outline-white {
    display: inline-flex; align-items: center; gap: .5rem;
    padding: .875rem 2rem; background: transparent;
    border: 2px solid rgba(255,255,255,.5); color: white;
    border-radius: 9999px; font-size: .9rem; font-weight: 600;
    font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .2s;
  }

  .lz-btn-outline-white:hover { border-color: white; background: rgba(255,255,255,.1); }

  .lz-cta-note {
    font-size: .7rem; color: rgba(255,255,255,.6);
    position: relative; z-index: 1; margin: 0;
  }

  /* ── FOOTER ── */
  .lz-footer { background: var(--dark-color); color: #9ca3af; padding: 4rem 2rem 2rem; }

  .lz-foot-grid {
    max-width: 1280px; margin: 0 auto;
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem; margin-bottom: 2.5rem;
  }

  .lz-foot-brand p { font-size: .8rem; line-height: 1.7; max-width: 240px; margin-bottom: 1rem; }

  .lz-foot-logo {
    display: flex; align-items: center; gap: .5rem;
    font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: white; margin-bottom: .75rem;
  }

  .lz-foot-logo-img { width: 26px; height: 26px; object-fit: contain; }

  .lz-socials { display: flex; gap: .5rem; }

  .lz-soc {
    width: 32px; height: 32px; background: #1f2937;
    border: 1px solid #374151; border-radius: .5rem;
    color: #9ca3af; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s;
  }

  .lz-soc:hover { border-color: var(--primary-light); color: var(--primary-light); }

  .lz-foot-col h4 {
    font-size: .75rem; font-weight: 700; color: white;
    text-transform: uppercase; letter-spacing: .07em; margin-bottom: .875rem;
  }

  .lz-foot-link {
    display: block; color: #9ca3af; font-size: .8rem; margin-bottom: .5rem;
    text-decoration: none; background: none; border: none; cursor: pointer;
    padding: 0; text-align: left; font-family: 'DM Sans', sans-serif; transition: color .2s;
  }

  .lz-foot-link:hover { color: var(--primary-light); }

  .lz-foot-bottom {
    max-width: 1280px; margin: 0 auto;
    border-top: 1px solid #1f2937; padding-top: 1.5rem;
    font-size: .75rem; text-align: center;
  }

  /* ── FAB ── */
  .lz-fab {
    position: fixed; bottom: 24px; right: 24px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white; padding: 12px 20px; border-radius: 40px;
    display: flex; align-items: center; gap: 8px;
    font-weight: 600; font-size: .875rem; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 8px 20px rgba(106,44,145,.35);
    z-index: 1000; border: none; cursor: pointer; transition: all .25s;
  }

  .lz-fab:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(106,44,145,.45); }

  /* ── Scroll animations ── */
  .aos {
    opacity: 0; transform: translateY(20px);
    transition: opacity .6s ease, transform .6s ease;
  }

  .aos.visible { opacity: 1; transform: translateY(0); }

  /* ── Keyframes ── */
  @keyframes livePulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:.5; transform:scale(1.3); }
  }

  @keyframes ring {
    0%   { transform:scale(.7); opacity:.7; }
    100% { transform:scale(2.2); opacity:0; }
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .lz-hero-inner { gap: 2.5rem; }
    .lz-stats-grid { grid-template-columns: repeat(2,1fr); }
  }

  @media (max-width: 768px) {
    .lz-hero-inner { grid-template-columns: 1fr; text-align: center; }
    .lz-hero-desc  { margin-left: auto; margin-right: auto; }
    .lz-hero-actions { justify-content: center; }
    .lz-hero-stats { justify-content: center; }
    .lz-trust { justify-content: center; }
    .lz-foot-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .lz-sec-head h2 { font-size: 1.75rem; }
    .lz-stats-grid { grid-template-columns: 1fr 1fr; }
    .lz-section { padding: 3.5rem 1.25rem; }
    .lz-hero { padding: 3rem 1.25rem; }
  }

  @media (max-width: 640px) {
    .lz-foot-grid { grid-template-columns: 1fr; gap: 1.5rem; }
    .lz-cta-btns { flex-direction: column; align-items: stretch; }
    .lz-btn-outline-white { justify-content: center; }
    .lz-stats-grid { grid-template-columns: 1fr; }
    .lz-fab { padding: 10px 16px; bottom: 16px; right: 16px; font-size: .813rem; }
  }
</style>