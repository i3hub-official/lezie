<script lang="ts">
  import { onMount } from 'svelte';
  import { ALLOWED_CODES, ALLOWED_NAMES } from '$lib/config/allowedRegions';

  // ── State ──────────────────────────────────────────────────────────────
  type Status = 'checking' | 'allowed' | 'blocked' | 'error';

  let status      = $state<Status>('checking');
  let countryCode = $state('');
  let countryName = $state('');
  let isVpn       = $state(false);

  let { onAllowed }: { onAllowed?: () => void } = $props();

  // ── Geo check ──────────────────────────────────────────────────────────
  async function checkRegion() {
    status = 'checking';

    try {
      // ip-api.com free tier — no API key needed, 45 req/min
      const res  = await fetch('https://ip-api.com/json/?fields=status,countryCode,country,proxy,hosting');
      const data = await res.json();

      if (data.status !== 'success') {
        status = 'error';
        return;
      }

      countryCode = (data.countryCode ?? '').toUpperCase();
      countryName = data.country ?? countryCode;

      // Heuristic: ip-api flags known VPN/proxy/hosting IPs
      isVpn = !!(data.proxy || data.hosting);

      if (ALLOWED_CODES.has(countryCode)) {
        status = 'allowed';
        onAllowed?.();
      } else {
        status = 'blocked';
      }
    } catch {
      status = 'error';
    }
  }

  onMount(() => {
    checkRegion();
  });
</script>

<svelte:head>
  <title>Lezie — Not Available in Your Region</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="wrap">
  <div class="bg-shape s1"></div>
  <div class="bg-shape s2"></div>
  <div class="grid-overlay" aria-hidden="true"></div>

  <!-- ── CHECKING ──────────────────────────────────────────────────────── -->
  {#if status === 'checking'}
    <div class="card checking-card">
      <div class="logo">
        <img src="/icons/lz_ico.png" alt="Lezie" width="40" height="40" />
        <span>Lezie</span>
      </div>
      <div class="spinner-wrap" aria-label="Checking your location">
        <div class="spinner"></div>
      </div>
      <p class="checking-label">Verifying your location…</p>
    </div>

  <!-- ── BLOCKED ────────────────────────────────────────────────────────── -->
  {:else if status === 'blocked'}
    <div class="card">
      <div class="logo">
        <img src="/icons/lz_ico.png" alt="Lezie" width="40" height="40" />
        <span>Lezie</span>
      </div>

      <div class="icon-wrap" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <line x1="4.22" y1="4.22" x2="19.78" y2="19.78"/>
        </svg>
        <div class="icon-ring r1"></div>
        <div class="icon-ring r2"></div>
      </div>

      <div class="tag">Region Restricted</div>

      <h1>Service only available<br /><em>in {ALLOWED_NAMES}</em></h1>

      {#if countryName}
        <div class="detected-location">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Your location: <strong>{countryName}</strong>
        </div>
      {/if}

      <p class="subtitle">
        Lezie is a community safety platform built specifically for
        {ALLOWED_NAMES}. It is not currently available in your region.
      </p>

      {#if isVpn}
        <div class="notice vpn-notice">
          <div class="notice-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p>
            A <strong>VPN or proxy</strong> was detected on your connection. If you are in
            {ALLOWED_NAMES}, please disable it and try again.
          </p>
        </div>
      {:else}
        <div class="notice">
          <div class="notice-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p>
            If you are in {ALLOWED_NAMES} and seeing this message, your network may be
            routing through a VPN or proxy server. Please disable it and try again.
          </p>
        </div>
      {/if}

      <div class="info-grid">
        <div class="info-block">
          <div class="info-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <div class="info-title">Why is Lezie region-restricted?</div>
            <div class="info-body">
              Our incident data, community networks, and emergency response integrations
              are built for {ALLOWED_NAMES}. Access from other regions is not supported at this time.
            </div>
          </div>
        </div>

        <div class="info-block">
          <div class="info-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div class="info-title">Expanding soon?</div>
            <div class="info-body">
              We plan to expand to more regions. Register your interest at
              <a href="mailto:hello@lezie.app" class="link">hello@lezie.app</a>
            </div>
          </div>
        </div>
      </div>

      <button class="btn" onclick={checkRegion} type="button">Try Again</button>

      <p class="footer-note">
        For urgent safety matters, please contact your local emergency services.
      </p>
    </div>

  <!-- ── ERROR ──────────────────────────────────────────────────────────── -->
  {:else if status === 'error'}
    <div class="card error-card">
      <div class="logo">
        <img src="/icons/lz_ico.png" alt="Lezie" width="40" height="40" />
        <span>Lezie</span>
      </div>

      <div class="icon-wrap error-icon-wrap" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div class="icon-ring r1"></div>
        <div class="icon-ring r2"></div>
      </div>

      <div class="tag error-tag">Location Error</div>
      <h1 class="error-h1">Could not verify<br /><em>your location</em></h1>

      <p class="subtitle">
        We were unable to determine your location. Please check your internet
        connection and try again.
      </p>

      <button class="btn" onclick={checkRegion} type="button">Retry</button>

      <p class="footer-note">
        If this keeps happening, contact us at
        <a href="mailto:support@lezie.app" class="link">support@lezie.app</a>
      </p>
    </div>
  {/if}
</div>

<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :global(body) {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: #ffffff;
    overflow: hidden;
  }

  :root {
    --ink:    #1a0b2e;
    --violet: #6a2c91;
    --viol-l: #8b5cf6;
    --mist:   #ece9f8;
    --amber:  #f59e0b;
    --serif:  'DM Serif Display', Georgia, serif;
  }

  @keyframes drift  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(3deg)} }
  @keyframes drift2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(14px) rotate(-2deg)} }
  @keyframes ringOut {
    0%   { transform:translate(-50%,-50%) scale(.8); opacity:.5; }
    100% { transform:translate(-50%,-50%) scale(2.2); opacity:0; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes spin { to { transform:rotate(360deg); } }

  /* ── WRAP ───────────────────────────────────────────────────────────────── */
  .wrap {
    min-height:100vh;
    display:flex; align-items:center; justify-content:center;
    background:#faf9ff;
    position:relative; overflow:hidden;
    padding:2rem;
  }

  .bg-shape { position:absolute; border-radius:50%; pointer-events:none; }
  .bg-shape.s1 {
    width:550px; height:550px;
    background:radial-gradient(ellipse, rgba(245,158,11,.08) 0%, transparent 70%);
    top:-180px; right:-80px;
    animation:drift 16s ease-in-out infinite;
  }
  .bg-shape.s2 {
    width:400px; height:400px;
    background:radial-gradient(ellipse, rgba(106,44,145,.07) 0%, transparent 70%);
    bottom:-130px; left:-80px;
    animation:drift2 13s ease-in-out infinite;
  }
  .grid-overlay {
    position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(106,44,145,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(106,44,145,.04) 1px, transparent 1px);
    background-size:48px 48px;
    pointer-events:none;
  }

  /* ── CARD ───────────────────────────────────────────────────────────────── */
  .card {
    position:relative; z-index:1;
    background:#ffffff;
    border:1px solid rgba(245,158,11,.2);
    border-radius:2rem;
    padding:3.5rem 3rem;
    max-width:520px; width:100%;
    text-align:center;
    box-shadow:0 32px 80px rgba(245,158,11,.07), 0 4px 16px rgba(0,0,0,.04);
    animation:fadeUp .8s ease both;
  }
  .checking-card, .error-card {
    border-color:rgba(106,44,145,.12);
    box-shadow:0 32px 80px rgba(106,44,145,.1), 0 4px 16px rgba(0,0,0,.04);
  }

  /* ── LOGO ───────────────────────────────────────────────────────────────── */
  .logo {
    display:inline-flex; align-items:center; gap:.625rem;
    margin-bottom:2.25rem;
    font-family:var(--serif); font-size:1.375rem;
    color:var(--ink); letter-spacing:-.02em;
  }
  .logo img { border-radius:8px; }

  /* ── SPINNER ────────────────────────────────────────────────────────────── */
  .spinner-wrap {
    width:72px; height:72px; margin:0 auto 1.5rem;
    display:flex; align-items:center; justify-content:center;
  }
  .spinner {
    width:48px; height:48px; border-radius:50%;
    border:3px solid var(--mist);
    border-top-color:var(--violet);
    animation:spin .9s linear infinite;
  }
  .checking-label { font-size:.9375rem; color:#94a3b8; font-weight:500; }

  /* ── ICON ───────────────────────────────────────────────────────────────── */
  .icon-wrap {
    position:relative; width:80px; height:80px;
    margin:0 auto 1.75rem;
    display:flex; align-items:center; justify-content:center;
  }
  .icon-wrap svg { color:var(--amber); position:relative; z-index:1; }
  .error-icon-wrap svg { color:var(--violet); }

  .icon-ring {
    position:absolute; top:50%; left:50%;
    border-radius:50%;
    border:1.5px solid rgba(245,158,11,.2);
    animation:ringOut 4s ease-out infinite;
  }
  .error-icon-wrap .icon-ring { border-color:rgba(106,44,145,.2); }
  .icon-ring.r1 { width:56px; height:56px; animation-delay:0s; }
  .icon-ring.r2 { width:72px; height:72px; animation-delay:1.5s; }

  /* ── TAGS ───────────────────────────────────────────────────────────────── */
  .tag {
    display:inline-block;
    background:rgba(245,158,11,.08);
    border:1px solid rgba(245,158,11,.25);
    border-radius:99px; padding:.3rem .875rem;
    font-size:.7rem; font-weight:700; color:#b45309;
    letter-spacing:.07em; text-transform:uppercase;
    margin-bottom:1rem;
  }
  .error-tag {
    background:rgba(106,44,145,.07);
    border-color:rgba(106,44,145,.15);
    color:var(--violet);
  }

  /* ── DETECTED LOCATION PILL ─────────────────────────────────────────────── */
  .detected-location {
    display:inline-flex; align-items:center; gap:.4rem;
    background:var(--mist); border-radius:99px;
    padding:.375rem .875rem; margin-bottom:1rem;
    font-size:.8rem; color:#475569;
  }
  .detected-location strong { color:var(--ink); }
  .detected-location svg { color:#94a3b8; flex-shrink:0; }

  /* ── HEADINGS ───────────────────────────────────────────────────────────── */
  h1 {
    font-family:var(--serif);
    font-size:clamp(1.75rem,4vw,2.5rem);
    color:var(--ink); line-height:1.15;
    margin-bottom:1rem;
  }
  h1 em { color:var(--amber); font-style:italic; }
  .error-h1 em { color:var(--violet); }

  .subtitle {
    font-size:.9375rem; line-height:1.75; color:#64748b;
    margin-bottom:1.75rem;
    max-width:400px; margin-left:auto; margin-right:auto;
  }

  /* ── NOTICE ─────────────────────────────────────────────────────────────── */
  .notice {
    display:flex; align-items:flex-start; gap:.75rem;
    background:#fffbeb; border:1px solid rgba(245,158,11,.25);
    border-radius:1rem; padding:1rem 1.25rem;
    margin-bottom:1.75rem; text-align:left;
  }
  .vpn-notice { background:#fff7ed; border-color:rgba(234,88,12,.25); }
  .notice-icon {
    flex-shrink:0; width:28px; height:28px;
    border-radius:7px; background:rgba(245,158,11,.12);
    display:flex; align-items:center; justify-content:center;
    color:var(--amber); margin-top:.1rem;
  }
  .notice p { font-size:.8125rem; color:#92400e; line-height:1.6; }
  .notice p strong { font-weight:700; }

  /* ── INFO GRID ──────────────────────────────────────────────────────────── */
  .info-grid { display:flex; flex-direction:column; gap:.75rem; margin-bottom:2rem; text-align:left; }
  .info-block {
    display:flex; align-items:flex-start; gap:.875rem;
    background:#faf9ff; border:1px solid var(--mist);
    border-radius:1rem; padding:1rem 1.25rem;
  }
  .info-icon {
    flex-shrink:0; width:32px; height:32px;
    border-radius:8px; background:var(--mist);
    display:flex; align-items:center; justify-content:center;
    color:var(--violet); margin-top:.1rem;
  }
  .info-title { font-size:.8125rem; font-weight:700; color:var(--ink); margin-bottom:.2rem; }
  .info-body  { font-size:.8rem; color:#64748b; line-height:1.6; }
  .link { color:var(--violet); font-weight:600; text-decoration:none; }
  .link:hover { text-decoration:underline; }

  /* ── BUTTON ─────────────────────────────────────────────────────────────── */
  .btn {
    display:inline-flex; align-items:center; justify-content:center;
    background:#6a2c91; color:white;
    font-size:.9rem; font-weight:700;
    padding:.875rem 2.25rem; border-radius:99px;
    border:none; cursor:pointer; width:100%;
    box-shadow:0 4px 18px rgba(106,44,145,.25);
    transition:transform .2s, box-shadow .2s;
    font-family:'DM Sans',sans-serif;
    margin-bottom:1.75rem;
  }
  .btn:hover { transform:translateY(-2px); box-shadow:0 8px 26px rgba(106,44,145,.35); }

  .footer-note { font-size:.75rem; color:#94a3b8; line-height:1.6; }

  @media (max-width:480px) {
    .card { padding:2.5rem 1.75rem; border-radius:1.5rem; }
  }
</style>
