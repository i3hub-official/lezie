<script lang="ts">
  import { goto } from '$app/navigation';
  import { ShieldCheck, AlertCircle, RefreshCw, Home, ArrowRight, Copy, Check } from 'lucide-svelte';

  let { data } = $props();

  let copied = $state(false);

  async function copyCode() {
    if (!data.code) return;
    await navigator.clipboard.writeText(data.code);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  // Split code into individual digits for display
  const digits = $derived(data.code ? data.code.split('') : []);
</script>

<svelte:head>
  <title>Verify your email – Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="vp-page">
  <div class="vp-blob vp-blob--1"></div>
  <div class="vp-blob vp-blob--2"></div>

  <div class="vp-shell">

    <a href="/" class="vp-logo-link">
      <img src="/icons/lz_ico.png" alt="Lezie" class="vp-logo" />
    </a>

    <div class="vp-card">

      <!-- ── SUCCESS ── -->
      {#if data.status === 'success'}
        <div class="vp-header vp-header--success">
          <div class="vp-icon-wrap vp-icon-wrap--success">
            <ShieldCheck size={28} />
          </div>
          <h1 class="vp-title">Your verification code</h1>
          <p class="vp-subtitle">
            Your email is verified. Enter this code to confirm you clicked the link.
          </p>
        </div>

        <div class="vp-code-wrap">
          <div class="vp-code-digits">
            {#each digits as digit, i}
              <span class="vp-digit" style="animation-delay: {i * 80}ms">{digit}</span>
              {#if i === 2}
                <span class="vp-digit-sep">–</span>
              {/if}
            {/each}
          </div>

          <button class="vp-copy-btn" onclick={copyCode}>
            {#if copied}
              <Check size={14} />
              <span>Copied!</span>
            {:else}
              <Copy size={14} />
              <span>Copy code</span>
            {/if}
          </button>
        </div>

        <div class="vp-notice">
          <p>
            Go back to the tab where you started and enter this
            <strong>6-digit code</strong> to complete verification.
            This code is shown only once.
          </p>
        </div>

        <button class="vp-btn vp-btn--primary" onclick={() => goto('/dashboard')}>
          Continue to dashboard <ArrowRight size={16} />
        </button>

      <!-- ── EXPIRED / ALREADY USED ── -->
      {:else if data.status === 'expired'}
        <div class="vp-header vp-header--warn">
          <div class="vp-icon-wrap vp-icon-wrap--warn">
            <RefreshCw size={28} />
          </div>
          <h1 class="vp-title">Link expired</h1>
          <p class="vp-subtitle">{data.message}</p>
        </div>

        <div class="vp-actions">
          <button class="vp-btn vp-btn--primary" onclick={() => goto('/verify-email')}>
            Request a new link
          </button>
        </div>

      <!-- ── ERROR / INVALID ── -->
      {:else}
        <div class="vp-header vp-header--error">
          <div class="vp-icon-wrap vp-icon-wrap--error">
            <AlertCircle size={28} />
          </div>
          <h1 class="vp-title">Verification failed</h1>
          <p class="vp-subtitle">{data.message}</p>
        </div>

        <div class="vp-actions">
          <button class="vp-btn vp-btn--secondary" onclick={() => goto('/')}>
            <Home size={15} /> Back to home
          </button>
          <button class="vp-btn vp-btn--primary" onclick={() => goto('/verify-email')}>
            Try again <ArrowRight size={15} />
          </button>
        </div>
      {/if}

    </div>

    <p class="vp-footer">
      Need help? <a href="/support" class="vp-link">Contact support</a>
    </p>

  </div>
</div>

<style>
  :global(.vp-page *) { font-family: 'DM Sans', system-ui, sans-serif; box-sizing: border-box; }

  .vp-page {
    min-height: 100vh;
    background: linear-gradient(145deg, #faf9ff 0%, #f3f0ff 60%, #fdf4ff 100%);
    display: flex; align-items: center; justify-content: center;
    padding: 2rem 1.25rem;
    position: relative; overflow: hidden;
  }

  .vp-blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none; z-index: 0;
  }
  .vp-blob--1 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(106,44,145,.1), transparent 70%);
    top: -100px; right: -100px;
    animation: vp-float 8s ease-in-out infinite;
  }
  .vp-blob--2 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(139,92,246,.08), transparent 70%);
    bottom: -80px; left: -80px;
    animation: vp-float 10s ease-in-out infinite reverse;
  }

  .vp-shell {
    position: relative; z-index: 1;
    width: 100%; max-width: 440px;
    display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
  }

  .vp-logo-link { display: inline-block; line-height: 0; transition: opacity .2s; }
  .vp-logo-link:hover { opacity: .8; }
  .vp-logo { width: 64px; height: 64px; object-fit: contain; }

  .vp-card {
    width: 100%;
    background: white;
    border-radius: 1.75rem;
    border: 1.5px solid #e5e7eb;
    box-shadow: 0 24px 48px -12px rgba(26,11,46,.12), 0 4px 16px rgba(0,0,0,.04);
    padding: 2rem;
    display: flex; flex-direction: column; gap: 1.5rem;
    animation: vp-rise .45s cubic-bezier(.16,1,.3,1) both;
  }

  /* Header */
  .vp-header { display: flex; flex-direction: column; align-items: center; gap: .75rem; text-align: center; }

  .vp-icon-wrap {
    width: 64px; height: 64px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: .25rem;
  }
  .vp-icon-wrap--success { background: #f0fdf4; color: #15803d; box-shadow: 0 0 0 8px #dcfce7; }
  .vp-icon-wrap--warn    { background: #fffbeb; color: #d97706; box-shadow: 0 0 0 8px #fef3c7; }
  .vp-icon-wrap--error   { background: #fef2f2; color: #dc2626; box-shadow: 0 0 0 8px #fee2e2; }

  .vp-title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 1.5rem; color: #1e1b4b; margin: 0; letter-spacing: -.02em;
  }
  .vp-subtitle { font-size: .875rem; color: #64748b; margin: 0; line-height: 1.6; }

  /* Code display */
  .vp-code-wrap {
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8f5ff, #f3f0ff);
    border: 1.5px solid #e9d5ff;
    border-radius: 1.25rem;
  }

  .vp-code-digits {
    display: flex; align-items: center; gap: .5rem;
  }

  .vp-digit {
    width: 48px; height: 60px;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; font-weight: 800; color: #1e1b4b;
    background: white;
    border: 2px solid #e9d5ff;
    border-radius: .75rem;
    box-shadow: 0 2px 8px rgba(106,44,145,.08);
    animation: vp-pop .4s cubic-bezier(.16,1,.3,1) both;
    letter-spacing: 0;
  }

  .vp-digit-sep {
    font-size: 1.5rem; font-weight: 300; color: #c4b5fd;
    margin: 0 .125rem;
  }

  .vp-copy-btn {
    display: inline-flex; align-items: center; gap: .375rem;
    padding: .5rem 1rem;
    background: white; border: 1.5px solid #e9d5ff;
    border-radius: .625rem; cursor: pointer;
    font-size: .8125rem; font-weight: 600; color: #6a2c91;
    font-family: 'DM Sans', sans-serif;
    transition: all .2s;
  }
  .vp-copy-btn:hover { background: #6a2c91; color: white; border-color: #6a2c91; }

  /* Notice */
  .vp-notice {
    background: #fafafa; border: 1.5px solid #f1f5f9;
    border-radius: .875rem; padding: .875rem 1rem;
  }
  .vp-notice p {
    font-size: .8125rem; color: #64748b; margin: 0; line-height: 1.6;
  }
  .vp-notice strong { color: #1e1b4b; }

  /* Buttons */
  .vp-actions { display: flex; gap: .75rem; }

  .vp-btn {
    flex: 1; display: inline-flex; align-items: center; justify-content: center;
    gap: .5rem; padding: .8125rem 1.25rem;
    border-radius: .875rem; font-size: .9375rem; font-weight: 600;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: all .2s; border: none;
  }
  .vp-btn--primary {
    background: linear-gradient(135deg, #6a2c91, #4a1d6e);
    color: white;
    box-shadow: 0 4px 14px rgba(106,44,145,.3);
  }
  .vp-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(106,44,145,.4); }
  .vp-btn--secondary {
    background: white; color: #64748b;
    border: 1.5px solid #e5e7eb;
  }
  .vp-btn--secondary:hover { border-color: #6a2c91; color: #6a2c91; background: #f3e8ff; }

  .vp-footer { font-size: .8125rem; color: #64748b; margin: 0; }
  .vp-link { color: #6a2c91; font-weight: 600; text-decoration: none; }
  .vp-link:hover { text-decoration: underline; }

  @keyframes vp-rise {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes vp-float {
    0%, 100% { transform: translate(0, 0); }
    50%       { transform: translate(20px, 20px); }
  }
  @keyframes vp-pop {
    from { opacity: 0; transform: scale(.8) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  @media (max-width: 480px) {
    .vp-card { padding: 1.5rem; border-radius: 1.25rem; }
    .vp-digit { width: 40px; height: 52px; font-size: 1.625rem; }
    .vp-actions { flex-direction: column; }
  }
</style>