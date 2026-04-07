<script lang="ts">
  // No props needed — static informational page
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

  <div class="card">
    <div class="logo">
      <img src="/icons/lz_ico.png" alt="Lezie" width="40" height="40" />
      <span>Lezie</span>
    </div>

    <div class="icon-wrap" aria-hidden="true">
      <!-- Globe with a line through it -->
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
    <h1>Service only available<br /><em>in Nigeria</em></h1>

    <p class="subtitle">
      Lezie is a community safety platform built specifically for Nigerian
      communities. It is not currently available in your region.
    </p>

    <!-- Detection notice -->
    <div class="notice">
      <div class="notice-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p>
        If you are in Nigeria and seeing this message, your network may be routing through
        a VPN or proxy server that is masking your location. Please disable it and try again.
      </p>
    </div>

    <div class="info-grid">
      <div class="info-block">
        <div class="info-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <div class="info-title">Why is Lezie region-restricted?</div>
          <div class="info-body">Our incident data, community networks, and emergency response integrations are built for Nigeria. Access from other regions is not supported at this time.</div>
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
          <div class="info-body">We plan to expand to more regions. To register your interest, contact us at <a href="mailto:hello@lezie.app" class="link">hello@lezie.app</a></div>
        </div>
      </div>
    </div>

    <button class="btn" onclick={() => window.location.reload()} type="button">
      Try Again
    </button>

    <p class="footer-note">
      For urgent safety matters, please contact your local emergency services.
    </p>
  </div>
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

  .logo {
    display:inline-flex; align-items:center; gap:.625rem;
    margin-bottom:2.25rem;
    font-family:var(--serif); font-size:1.375rem;
    color:var(--ink); letter-spacing:-.02em;
  }
  .logo img { border-radius:8px; }

  .icon-wrap {
    position:relative; width:80px; height:80px;
    margin:0 auto 1.75rem;
    display:flex; align-items:center; justify-content:center;
  }
  .icon-wrap svg { color:var(--amber); position:relative; z-index:1; }
  .icon-ring {
    position:absolute; top:50%; left:50%;
    border-radius:50%;
    border:1.5px solid rgba(245,158,11,.2);
    animation:ringOut 4s ease-out infinite;
  }
  .icon-ring.r1 { width:56px; height:56px; animation-delay:0s; }
  .icon-ring.r2 { width:72px; height:72px; animation-delay:1.5s; }

  .tag {
    display:inline-block;
    background:rgba(245,158,11,.08);
    border:1px solid rgba(245,158,11,.25);
    border-radius:99px; padding:.3rem .875rem;
    font-size:.7rem; font-weight:700; color:#b45309;
    letter-spacing:.07em; text-transform:uppercase;
    margin-bottom:1rem;
  }

  h1 {
    font-family:var(--serif);
    font-size:clamp(1.75rem,4vw,2.5rem);
    color:var(--ink); line-height:1.15;
    margin-bottom:1rem;
  }
  h1 em { color:var(--amber); font-style:italic; }

  .subtitle {
    font-size:.9375rem; line-height:1.75; color:#64748b;
    margin-bottom:1.75rem;
    max-width:400px; margin-left:auto; margin-right:auto;
  }

  /* VPN notice */
  .notice {
    display:flex; align-items:flex-start; gap:.75rem;
    background:#fffbeb; border:1px solid rgba(245,158,11,.25);
    border-radius:1rem; padding:1rem 1.25rem;
    margin-bottom:1.75rem; text-align:left;
  }
  .notice-icon {
    flex-shrink:0; width:28px; height:28px;
    border-radius:7px; background:rgba(245,158,11,.12);
    display:flex; align-items:center; justify-content:center;
    color:var(--amber); margin-top:.1rem;
  }
  .notice p { font-size:.8125rem; color:#92400e; line-height:1.6; }

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
