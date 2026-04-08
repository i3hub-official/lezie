<script lang="ts">
  import { onMount } from 'svelte';

  let { onVerified }: { onVerified: () => void } = $props();

  const MIN_AGE = 13;
  const STORAGE_KEY = 'lezie_age_verified';

  let day   = $state('');
  let month = $state('');
  let year  = $state('');
  let error = $state('');
  let shake = $state(false);

  // Fields
  let dayEl:   HTMLInputElement;
  let monthEl: HTMLInputElement;
  let yearEl:  HTMLInputElement;

  onMount(() => {
    // Already verified this session
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      onVerified();
    }
  });

  function triggerShake() {
    shake = true;
    setTimeout(() => shake = false, 600);
  }

  function verify() {
    error = '';
    const d = parseInt(day,   10);
    const m = parseInt(month, 10);
    const y = parseInt(year,  10);

    if (!day || !month || !year)           { error = 'Please enter your full date of birth.'; triggerShake(); return; }
    if (isNaN(d)||isNaN(m)||isNaN(y))      { error = 'Please enter a valid date.';            triggerShake(); return; }
    if (m < 1 || m > 12)                   { error = 'Month must be between 1 and 12.';       triggerShake(); return; }
    if (d < 1 || d > 31)                   { error = 'Day must be between 1 and 31.';         triggerShake(); return; }
    if (y < 1900 || y > new Date().getFullYear()) { error = 'Please enter a valid year.';    triggerShake(); return; }

    const dob  = new Date(y, m - 1, d);
    const now  = new Date();
    let   age  = now.getFullYear() - dob.getFullYear();
    const bday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    if (now < bday) age--;

    if (age < MIN_AGE) {
      error = `You must be at least ${MIN_AGE} years old to use Lezie.`;
      triggerShake();
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, 'true');
    onVerified();
  }

  // Auto-advance focus
  function handleDay() {
    if (day.length === 2) monthEl?.focus();
  }
  function handleMonth() {
    if (month.length === 2) yearEl?.focus();
  }
</script>

<svelte:head>
  <title>Lezie — Age Verification</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="wrap">
  <div class="bg-shape s1"></div>
  <div class="bg-shape s2"></div>
  <div class="grid-overlay" aria-hidden="true"></div>

  <div class="card" class:shake>
    <div class="logo">
      <img src="/icons/lz_ico.png" alt="Lezie" width="40" height="40" />
      <span>Lezie</span>
    </div>

    <div class="icon-wrap" aria-hidden="true">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      <div class="icon-ring r1"></div>
      <div class="icon-ring r2"></div>
    </div>

    <div class="tag">Age Verification</div>
    <h1>Before you continue</h1>

    <p class="subtitle">
      Lezie contains real community safety reports. You must be at least
      <strong>{MIN_AGE} years old</strong> to access this platform.
    </p>

    <p class="dob-label">Enter your date of birth</p>

    <div class="dob-row">
      <div class="dob-field">
        <input
          bind:this={dayEl}
          bind:value={day}
          oninput={handleDay}
          type="text"
          inputmode="numeric"
          maxlength="2"
          placeholder="DD"
          aria-label="Day"
          class:has-error={!!error}
        />
        <span class="dob-unit">Day</span>
      </div>

      <div class="dob-sep">/</div>

      <div class="dob-field">
        <input
          bind:this={monthEl}
          bind:value={month}
          oninput={handleMonth}
          type="text"
          inputmode="numeric"
          maxlength="2"
          placeholder="MM"
          aria-label="Month"
          class:has-error={!!error}
        />
        <span class="dob-unit">Month</span>
      </div>

      <div class="dob-sep">/</div>

      <div class="dob-field wide">
        <input
          bind:this={yearEl}
          bind:value={year}
          type="text"
          inputmode="numeric"
          maxlength="4"
          placeholder="YYYY"
          aria-label="Year"
          class:has-error={!!error}
          onkeydown={(e) => e.key === 'Enter' && verify()}
        />
        <span class="dob-unit">Year</span>
      </div>
    </div>

    {#if error}
      <div class="error-msg" role="alert">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {error}
      </div>
    {/if}

    <button class="btn" onclick={verify} type="button">Confirm Age &amp; Continue</button>

    <p class="footer-note">
      Your date of birth is used only for age verification and is not stored on our servers.
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
  @keyframes shake {
    0%,100% { transform:translateX(0); }
    20%     { transform:translateX(-8px); }
    40%     { transform:translateX(8px); }
    60%     { transform:translateX(-5px); }
    80%     { transform:translateX(5px); }
  }

  .wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;   /* stack content vertically */
  justify-content: flex-start; /* top align, allows scrolling */
  align-items: center;      /* horizontal centering */
  background: #faf9ff;
  position: relative;
  padding: 2rem;
  overflow: auto;           /* allow scrolling */
}

  .bg-shape { position:absolute; border-radius:50%; pointer-events:none; }
  .bg-shape.s1 {
    width:550px; height:550px;
    background:radial-gradient(ellipse, rgba(196,181,253,.2) 0%, transparent 70%);
    top:-180px; right:-80px;
    animation:drift 16s ease-in-out infinite;
  }
  .bg-shape.s2 {
    width:400px; height:400px;
    background:radial-gradient(ellipse, rgba(106,44,145,.08) 0%, transparent 70%);
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
    border:1px solid rgba(106,44,145,.12);
    border-radius:2rem;
    padding:3.5rem 3rem;
    max-width:480px; width:100%;
    text-align:center;
    box-shadow:0 32px 80px rgba(106,44,145,.1), 0 4px 16px rgba(0,0,0,.04);
    animation:fadeUp .8s ease both;
  }
  .card.shake { animation: shake .6s ease; }

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
  .icon-wrap svg { color:var(--violet); position:relative; z-index:1; }
  .icon-ring {
    position:absolute; top:50%; left:50%;
    border-radius:50%;
    border:1.5px solid rgba(106,44,145,.2);
    animation:ringOut 4s ease-out infinite;
  }
  .icon-ring.r1 { width:56px; height:56px; animation-delay:0s; }
  .icon-ring.r2 { width:72px; height:72px; animation-delay:1.5s; }

  .tag {
    display:inline-block;
    background:rgba(106,44,145,.07);
    border:1px solid rgba(106,44,145,.14);
    border-radius:99px; padding:.3rem .875rem;
    font-size:.7rem; font-weight:700; color:var(--violet);
    letter-spacing:.07em; text-transform:uppercase;
    margin-bottom:1rem;
  }

  h1 {
    font-family:var(--serif);
    font-size:clamp(1.75rem,4vw,2.25rem);
    color:var(--ink); line-height:1.15;
    margin-bottom:1rem;
  }

  .subtitle {
    font-size:.9375rem; line-height:1.75; color:#64748b;
    margin-bottom:2rem;
  }
  .subtitle strong { color:var(--ink); }

  /* DOB inputs */
  .dob-label {
    font-size:.8rem; font-weight:700; color:#94a3b8;
    letter-spacing:.06em; text-transform:uppercase;
    margin-bottom:.875rem;
  }
  .dob-row {
    display:flex; align-items:flex-end; justify-content:center;
    gap:.5rem; margin-bottom:1.25rem;
  }
  .dob-sep { font-size:1.25rem; color:#cbd5e1; padding-bottom:1.4rem; font-weight:300; }
  .dob-field { display:flex; flex-direction:column; align-items:center; gap:.375rem; }
  .dob-field.wide { flex:1; max-width:110px; }

  .dob-field input {
    width:64px; height:56px;
    border:1.5px solid var(--mist);
    border-radius:.875rem;
    background:#faf9ff;
    font-family:'DM Sans',sans-serif;
    font-size:1.375rem; font-weight:600;
    color:var(--ink); text-align:center;
    outline:none;
    transition: border-color .2s, box-shadow .2s;
  }
  .dob-field.wide input { width:100%; }
  .dob-field input:focus {
    border-color:var(--violet);
    box-shadow:0 0 0 3px rgba(106,44,145,.12);
  }
  .dob-field input.has-error { border-color:#ef4444; }
  .dob-unit { font-size:.7rem; font-weight:600; color:#94a3b8; letter-spacing:.05em; text-transform:uppercase; }

  .error-msg {
    display:flex; align-items:center; gap:.5rem; justify-content:center;
    background:#fef2f2; border:1px solid rgba(239,68,68,.2);
    border-radius:.75rem; padding:.75rem 1rem;
    font-size:.8125rem; color:#ef4444; font-weight:500;
    margin-bottom:1.25rem;
  }

  .btn {
    display:inline-flex; align-items:center;
    background:#6a2c91; color:white;
    font-size:.9rem; font-weight:700;
    padding:.9rem 2.25rem; border-radius:99px;
    border:none; cursor:pointer;
    box-shadow:0 4px 18px rgba(106,44,145,.25);
    transition:transform .2s, box-shadow .2s;
    font-family:'DM Sans',sans-serif;
    margin-bottom:1.5rem; width:100%;
    justify-content:center;
  }
  .btn:hover { transform:translateY(-2px); box-shadow:0 8px 26px rgba(106,44,145,.35); }

  .footer-note { font-size:.75rem; color:#94a3b8; line-height:1.6; }

  @media (max-width:480px) {
    .card { padding:2.5rem 1.5rem; border-radius:1.5rem; }
    .dob-field input { width:56px; font-size:1.125rem; }
  }
</style>
