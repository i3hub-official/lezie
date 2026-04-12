<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount, onDestroy } from 'svelte';
  import { Mail, RefreshCw, CheckCircle, AlertCircle, ArrowRight, Home } from 'lucide-svelte';

  let { data } = $props();

  // ── Resend cooldown ─────────────────────────────────────
  const COOLDOWN_SECS = 60;
  let cooldown    = $state(0);
  let resending   = $state(false);
  let resendDone  = $state(false);
  let resendError = $state('');
  let timer: ReturnType<typeof setInterval> | null = null;

  function startCooldown() {
    cooldown = COOLDOWN_SECS;
    timer = setInterval(() => {
      cooldown--;
      if (cooldown <= 0) { clearInterval(timer!); timer = null; cooldown = 0; }
    }, 1000);
  }

  onMount(() => startCooldown());
  onDestroy(() => { if (timer) clearInterval(timer); });

  async function handleResend() {
    if (cooldown > 0 || resending) return;
    resending   = true;
    resendError = '';
    resendDone  = false;
    try {
      // Send the signed ref — never the raw email
      const res = await fetch('/api/resend-verification', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ref: data.ref }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Failed to resend');
      }
      resendDone = true;
      startCooldown();
    } catch (err: unknown) {
      resendError = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
    } finally {
      resending = false;
    }
  }

  // Progress dots animation
  let activeDot = $state(0);
  let dotTimer: ReturnType<typeof setInterval>;
  onMount(() => { dotTimer = setInterval(() => { activeDot = (activeDot + 1) % 3; }, 900); });
  onDestroy(() => clearInterval(dotTimer));

  // Cooldown ring
  const circumference = 2 * Math.PI * 20;
  const strokeDash = $derived(circumference - ((cooldown / COOLDOWN_SECS) * circumference));
</script>

<svelte:head>
  <title>Verify your email – Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="ve-page">
  <div class="ve-blob ve-blob--1"></div>
  <div class="ve-blob ve-blob--2"></div>

  <div class="ve-shell">

    <a href="/" class="ve-logo-link">
      <img src="/icons/lz_ico.png" alt="Lezie" class="ve-logo" />
    </a>

    <div class="ve-card">

      <div class="ve-envelope-wrap">
        <div class="ve-envelope">
          <div class="ve-env-body">
            <div class="ve-env-flap"></div>
            <div class="ve-env-lines">
              <span></span><span></span><span></span>
            </div>
          </div>
          {#each [0,1,2] as i}
            <div class="ve-dot ve-dot--{i} {activeDot === i ? 've-dot--active' : ''}"></div>
          {/each}
        </div>
      </div>

      <div class="ve-card-content">
        <h1 class="ve-title">Check your inbox</h1>
        <p class="ve-subtitle">
          We sent a verification link to<br/>
          <strong class="ve-email">{data.maskedEmail}</strong>
        </p>

        <div class="ve-steps">
          {#each [
            { n:1, text:'Open the email from Lezie' },
            { n:2, text:'Click the "Verify my email" button' },
            { n:3, text:'Enter the code shown on the next page' },
          ] as s}
            <div class="ve-step">
              <span class="ve-step-num">{s.n}</span>
              <span class="ve-step-text">{s.text}</span>
            </div>
          {/each}
        </div>

        <div class="ve-resend-wrap">
          {#if resendDone}
            <div class="ve-resend-success">
              <CheckCircle size={15} /><span>Email resent successfully!</span>
            </div>
          {/if}
          {#if resendError}
            <div class="ve-resend-error">
              <AlertCircle size={15} /><span>{resendError}</span>
            </div>
          {/if}

          <div class="ve-resend-row">
            <span class="ve-resend-label">Didn't receive it?</span>
            <button
              class="ve-resend-btn {cooldown > 0 || resending ? 've-resend-btn--disabled' : ''}"
              onclick={handleResend}
              disabled={cooldown > 0 || resending}>
              {#if resending}
                <span class="ve-spin"><RefreshCw size={13} /></span><span>Sending…</span>
              {:else if cooldown > 0}
                <span class="ve-cooldown-ring">
                  <svg width="18" height="18" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="20" fill="none" stroke="#e5e7eb" stroke-width="3"/>
                    <circle cx="22" cy="22" r="20" fill="none" stroke="#6a2c91" stroke-width="3"
                      stroke-dasharray={circumference} stroke-dashoffset={strokeDash}
                      stroke-linecap="round" transform="rotate(-90 22 22)" />
                  </svg>
                  <span class="ve-cooldown-num">{cooldown}</span>
                </span>
                <span>Resend in {cooldown}s</span>
              {:else}
                <RefreshCw size={13} /><span>Resend email</span>
              {/if}
            </button>
          </div>
        </div>

        <div class="ve-mail-clients">
          {#each [
            { name:'Gmail',   href:'https://mail.google.com',  color:'#EA4335' },
            { name:'Outlook', href:'https://outlook.live.com', color:'#0078D4' },
            { name:'Yahoo',   href:'https://mail.yahoo.com',   color:'#720E9E' },
          ] as client}
            <a href={client.href} target="_blank" rel="noopener noreferrer" class="ve-mail-client">
              <span class="ve-client-dot" style="background:{client.color}"></span>
              {client.name}<ArrowRight size={11} />
            </a>
          {/each}
        </div>
      </div>
    </div>

    <div class="ve-footer">
      <p>Wrong email? <a href="/signup" class="ve-link">Go back and correct it</a></p>
      <p>Already verified? <a href="/signin" class="ve-link">Sign in</a></p>
    </div>

    <button class="ve-home-btn" onclick={() => goto('/')}>
      <Home size={14} /> Back to Home
    </button>

  </div>
</div>

<style>
  :global(.ve-page *) { font-family:'DM Sans',system-ui,sans-serif; box-sizing:border-box; }
  .ve-page { min-height:100vh; background:linear-gradient(145deg,#faf9ff 0%,#f3f0ff 60%,#fdf4ff 100%); display:flex; align-items:center; justify-content:center; padding:2rem 1.25rem; position:relative; overflow:hidden; }
  .ve-blob { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; z-index:0; }
  .ve-blob--1 { width:400px; height:400px; background:radial-gradient(circle,rgba(106,44,145,.1),transparent 70%); top:-100px; right:-100px; animation:ve-float 8s ease-in-out infinite; }
  .ve-blob--2 { width:300px; height:300px; background:radial-gradient(circle,rgba(139,92,246,.08),transparent 70%); bottom:-80px; left:-80px; animation:ve-float 10s ease-in-out infinite reverse; }
  .ve-shell { position:relative; z-index:1; width:100%; max-width:460px; display:flex; flex-direction:column; align-items:center; gap:1.5rem; }
  .ve-logo-link { display:inline-block; line-height:0; transition:opacity .2s; }
  .ve-logo-link:hover { opacity:.8; }
  .ve-logo { width:72px; height:72px; object-fit:contain; }
  .ve-card { width:100%; background:white; border-radius:1.75rem; border:1.5px solid #e5e7eb; box-shadow:0 24px 48px -12px rgba(26,11,46,.12),0 4px 16px rgba(0,0,0,.04); overflow:hidden; animation:ve-rise .5s cubic-bezier(.16,1,.3,1) both; }
  .ve-envelope-wrap { background:linear-gradient(160deg,#1a0b2e 0%,#2d1b4e 100%); padding:2.5rem 2rem 2rem; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
  .ve-envelope-wrap::after { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 80% 60% at 50% 80%,rgba(139,92,246,.2),transparent); }
  .ve-envelope { position:relative; width:80px; height:60px; z-index:1; animation:ve-hover 3s ease-in-out infinite; }
  .ve-env-body { width:80px; height:60px; background:white; border-radius:.625rem; position:relative; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,.3); }
  .ve-env-flap { position:absolute; top:0; left:0; right:0; height:30px; background:linear-gradient(135deg,#f3e8ff,#ede9fe); clip-path:polygon(0 0,100% 0,50% 100%); }
  .ve-env-lines { position:absolute; bottom:10px; left:12px; right:12px; display:flex; flex-direction:column; gap:5px; }
  .ve-env-lines span { display:block; height:3px; border-radius:2px; background:#e5e7eb; }
  .ve-env-lines span:first-child { width:100%; }
  .ve-env-lines span:nth-child(2) { width:75%; }
  .ve-env-lines span:last-child { width:50%; }
  .ve-dot { position:absolute; width:8px; height:8px; border-radius:50%; background:rgba(196,181,253,.4); transition:background .3s,transform .3s; }
  .ve-dot--0 { top:-12px; right:-16px; }
  .ve-dot--1 { top:-20px; left:-8px; width:6px; height:6px; }
  .ve-dot--2 { bottom:-10px; right:4px; width:5px; height:5px; }
  .ve-dot--active { background:#c4b5fd; transform:scale(1.5); }
  .ve-card-content { padding:1.75rem 1.75rem 2rem; display:flex; flex-direction:column; gap:1.375rem; }
  .ve-title { font-family:'DM Serif Display',Georgia,serif; font-size:1.75rem; color:#1e1b4b; letter-spacing:-.02em; margin:0; line-height:1.2; }
  .ve-subtitle { font-size:.9rem; color:#64748b; line-height:1.6; margin:0; }
  .ve-email { color:#1e1b4b; font-weight:700; background:#f3e8ff; padding:.1rem .4rem; border-radius:.375rem; }
  .ve-steps { display:flex; flex-direction:column; gap:.625rem; background:#fafafa; border:1.5px solid #f1f5f9; border-radius:1rem; padding:1rem; }
  .ve-step { display:flex; align-items:center; gap:.75rem; }
  .ve-step-num { width:24px; height:24px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,#6a2c91,#4a1d6e); color:white; font-size:.6875rem; font-weight:700; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(106,44,145,.25); }
  .ve-step-text { font-size:.8125rem; color:#374151; font-weight:500; }
  .ve-resend-wrap { display:flex; flex-direction:column; gap:.625rem; }
  .ve-resend-success { display:flex; align-items:center; gap:.5rem; font-size:.8rem; color:#15803d; font-weight:600; background:#f0fdf4; border:1px solid #bbf7d0; padding:.5rem .875rem; border-radius:.625rem; animation:ve-fade-in .3s ease; }
  .ve-resend-error { display:flex; align-items:center; gap:.5rem; font-size:.8rem; color:#dc2626; background:#fef2f2; border:1px solid #fecaca; padding:.5rem .875rem; border-radius:.625rem; }
  .ve-resend-row { display:flex; align-items:center; justify-content:space-between; padding:.875rem 1rem; background:linear-gradient(135deg,#f8f5ff,#f3f0ff); border:1.5px solid #e9d5ff; border-radius:.875rem; }
  .ve-resend-label { font-size:.8125rem; color:#64748b; }
  .ve-resend-btn { display:inline-flex; align-items:center; gap:.375rem; padding:.5rem .875rem; border-radius:.625rem; border:none; background:linear-gradient(135deg,#6a2c91,#4a1d6e); color:white; font-size:.8125rem; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .2s; box-shadow:0 3px 10px rgba(106,44,145,.25); }
  .ve-resend-btn:hover:not(.ve-resend-btn--disabled) { transform:translateY(-1px); box-shadow:0 5px 16px rgba(106,44,145,.35); }
  .ve-resend-btn--disabled { background:#f1f5f9; color:#94a3b8; box-shadow:none; cursor:not-allowed; }
  .ve-cooldown-ring { position:relative; display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; }
  .ve-cooldown-ring svg { position:absolute; inset:0; }
  .ve-cooldown-num { font-size:.55rem; font-weight:800; color:#6a2c91; position:relative; z-index:1; line-height:1; }
  .ve-resend-btn--disabled .ve-cooldown-num { color:#94a3b8; }
  .ve-spin { display:inline-flex; animation:ve-spin .6s linear infinite; }
  .ve-mail-clients { display:flex; gap:.5rem; flex-wrap:wrap; }
  .ve-mail-client { display:inline-flex; align-items:center; gap:.375rem; padding:.4375rem .875rem; border-radius:.625rem; border:1.5px solid #e5e7eb; background:white; font-size:.75rem; font-weight:600; color:#374151; text-decoration:none; transition:all .2s; }
  .ve-mail-client:hover { border-color:#6a2c91; color:#6a2c91; background:#f3e8ff; transform:translateY(-1px); }
  .ve-client-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .ve-footer { display:flex; flex-direction:column; align-items:center; gap:.375rem; animation:ve-rise .5s .15s cubic-bezier(.16,1,.3,1) both; }
  .ve-footer p { font-size:.8125rem; color:#64748b; margin:0; }
  .ve-link { color:#6a2c91; font-weight:600; text-decoration:none; }
  .ve-link:hover { text-decoration:underline; }
  .ve-home-btn { display:inline-flex; align-items:center; gap:.375rem; background:none; border:none; cursor:pointer; font-size:.8rem; color:#94a3b8; font-family:'DM Sans',sans-serif; transition:color .2s; padding:.25rem; }
  .ve-home-btn:hover { color:#6a2c91; }
  @keyframes ve-rise { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ve-hover { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes ve-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,20px)} }
  @keyframes ve-fade-in { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ve-spin { to{transform:rotate(360deg)} }
  @media (max-width:480px) { .ve-card{border-radius:1.25rem} .ve-card-content{padding:1.5rem 1.25rem 1.75rem} .ve-title{font-size:1.5rem} .ve-mail-clients{justify-content:center} .ve-resend-row{flex-direction:column;gap:.75rem;align-items:flex-start} .ve-resend-btn{width:100%;justify-content:center} }
</style>