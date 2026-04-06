<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onDestroy } from 'svelte';
  import {
    Lock, Eye, EyeOff, Check, AlertCircle,
    ShieldCheck, ArrowRight, Home
  } from 'lucide-svelte';

  // Token from URL: /reset-password?token=xxx
  const token = $derived($page.url.searchParams.get('token') ?? '');

  // ── Form state ──────────────────────────────────────────
  let password        = $state('');
  let confirmPassword = $state('');
  let showPassword    = $state(false);
  let showConfirm     = $state(false);
  let touched         = $state<Record<string, boolean>>({});
  let errors          = $state<Record<string, string>>({});
  let isLoading       = $state(false);
  let submitError     = $state('');
  let success         = $state(false);

  // ── Cooldown (prevent spam on error) ───────────────────
  const COOLDOWN_SECS = 30;
  let cooldown = $state(0);
  let cdTimer: ReturnType<typeof setInterval> | null = null;

  function startCooldown() {
    cooldown = COOLDOWN_SECS;
    cdTimer = setInterval(() => {
      cooldown--;
      if (cooldown <= 0) { clearInterval(cdTimer!); cdTimer = null; cooldown = 0; }
    }, 1000);
  }

  onDestroy(() => { if (cdTimer) clearInterval(cdTimer); });

  // ── Validation ──────────────────────────────────────────
  function validate() {
    const e: Record<string, string> = {};
    if (!password)                e.password = 'Password is required';
    else if (password.length < 8) e.password = 'At least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      e.password = 'Must contain uppercase, lowercase, and number';
    if (!confirmPassword)              e.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  }

  function blurField(field: string) {
    touched[field] = true;
    errors[field] = validate()[field] || '';
  }

  // ── Submit ──────────────────────────────────────────────
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (cooldown > 0 || isLoading) return;
    touched = { password: true, confirmPassword: true };
    const errs = validate();
    if (Object.keys(errs).length > 0) { errors = errs; return; }
    isLoading   = true;
    submitError = '';
    try {
      const res = await fetch('/api/reset-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Reset failed');
      success = true;
      setTimeout(() => goto('/signin'), 4000);
    } catch (err: unknown) {
      submitError = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      startCooldown();
    } finally {
      isLoading = false;
    }
  }

  // ── Password strength ───────────────────────────────────
  const strength = $derived(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8)              s++;
    if (/[a-z]/.test(password))            s++;
    if (/[A-Z]/.test(password))            s++;
    if (/\d/.test(password))               s++;
    if (/[^a-zA-Z0-9]/.test(password))     s++;
    return s;
  });

  const strengthMeta = $derived(() => {
    const s = strength();
    if (s <= 1) return { label:'Weak',   color:'#dc2626', width:'20%'  };
    if (s <= 2) return { label:'Fair',   color:'#f59e0b', width:'45%'  };
    if (s <= 3) return { label:'Good',   color:'#6a2c91', width:'70%'  };
    return            { label:'Strong', color:'#1a0b2e', width:'100%' };
  });

  // ── Cooldown ring geometry ──────────────────────────────
  const circumference = 2 * Math.PI * 10;
  const ringOffset    = $derived(
    cooldown > 0
      ? circumference - (cooldown / COOLDOWN_SECS) * circumference
      : circumference
  );

  const tokenMissing = $derived(!token);
</script>

<svelte:head>
  <title>Reset Password – Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="rp-page">
  <div class="rp-blob rp-blob--1"></div>
  <div class="rp-blob rp-blob--2"></div>

  <div class="rp-shell">

    <a href="/" class="rp-logo-link">
      <img src="/icons/lz_logo_t.png" alt="Lezie" class="rp-logo" />
    </a>

    <!-- ── SUCCESS ── -->
    {#if success}
      <div class="rp-card rp-card--success">
        <div class="rp-success-icon-wrap">
          <div class="rp-success-ring"></div>
          <div class="rp-success-icon"><ShieldCheck size={32} /></div>
        </div>
        <h1 class="rp-title">Password updated!</h1>
        <p class="rp-success-desc">Your password has been reset successfully. You'll be redirected to sign in shortly.</p>
        <div class="rp-redirect-bar"><div class="rp-redirect-fill"></div></div>
        <button class="rp-btn rp-btn--primary rp-btn--full" onclick={() => goto('/signin')}>
          Sign in now <ArrowRight size={15} />
        </button>
      </div>

    <!-- ── INVALID TOKEN ── -->
    {:else if tokenMissing}
      <div class="rp-card">
        <div class="rp-invalid-icon"><AlertCircle size={36} /></div>
        <h1 class="rp-title">Invalid reset link</h1>
        <p class="rp-subtitle">This link is missing a token. It may have been copied incorrectly or already used.</p>
        <div class="rp-invalid-actions">
          <button class="rp-btn rp-btn--primary rp-btn--full" onclick={() => goto('/forgot-password')}>
            Request a new link <ArrowRight size={15} />
          </button>
          <button class="rp-btn rp-btn--ghost rp-btn--full" onclick={() => goto('/signin')}>
            Back to sign in
          </button>
        </div>
      </div>

    <!-- ── FORM ── -->
    {:else}
      <div class="rp-card">

        <div class="rp-card-header">
          <div class="rp-lock-icon"><Lock size={22} /></div>
          <div>
            <h1 class="rp-title">Set new password</h1>
            <p class="rp-subtitle">Choose something strong that you haven't used before</p>
          </div>
        </div>

        {#if submitError}
          <div class="rp-alert-error">
            <AlertCircle size={16} /><span>{submitError}</span>
          </div>
        {/if}

        <form onsubmit={handleSubmit} class="rp-form">

          <!-- New password -->
          <div class="rp-field">
            <label class="rp-label" for="rp-password">
              New Password <span class="rp-req">*</span>
            </label>
            <div class="rp-input-wrap">
              <span class="rp-ico"><Lock size={15} /></span>
              <input
                id="rp-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                bind:value={password}
                onblur={() => blurField('password')}
                class="rp-input rp-input--toggle {errors.password && touched.password ? 'rp-input--err' : ''}"
              />
              <button type="button" class="rp-eye" onclick={() => showPassword = !showPassword}>
                {#if showPassword}<EyeOff size={15} />{:else}<Eye size={15} />{/if}
              </button>
            </div>
            {#if errors.password && touched.password}
              <p class="rp-err"><AlertCircle size={12} />{errors.password}</p>
            {:else if password}
              <div class="rp-strength">
                <div class="rp-strength-track">
                  <div class="rp-strength-fill" style="width:{strengthMeta().width};background:{strengthMeta().color}"></div>
                </div>
                <span class="rp-strength-label" style="color:{strengthMeta().color}">{strengthMeta().label}</span>
              </div>
              <div class="rp-hints">
                {#each [
                  [password.length >= 8,         '8+ chars' ],
                  [/[A-Z]/.test(password),        'Uppercase'],
                  [/[a-z]/.test(password),        'Lowercase'],
                  [/\d/.test(password),            'Number'  ],
                  [/[^a-zA-Z0-9]/.test(password), 'Symbol'  ],
                ] as [ok, lbl]}
                  <span class="rp-hint {ok ? 'rp-hint--ok' : 'rp-hint--no'}">
                    {#if ok}<Check size={9} />{/if}{lbl}
                  </span>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Confirm password -->
          <div class="rp-field">
            <label class="rp-label" for="rp-confirm">
              Confirm Password <span class="rp-req">*</span>
            </label>
            <div class="rp-input-wrap">
              <span class="rp-ico"><Lock size={15} /></span>
              <input
                id="rp-confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                bind:value={confirmPassword}
                onblur={() => blurField('confirmPassword')}
                class="rp-input rp-input--toggle {errors.confirmPassword && touched.confirmPassword ? 'rp-input--err' : ''}"
              />
              <button type="button" class="rp-eye" onclick={() => showConfirm = !showConfirm}>
                {#if showConfirm}<EyeOff size={15} />{:else}<Eye size={15} />{/if}
              </button>
            </div>
            {#if errors.confirmPassword && touched.confirmPassword}
              <p class="rp-err"><AlertCircle size={12} />{errors.confirmPassword}</p>
            {:else if confirmPassword && password === confirmPassword}
              <p class="rp-match"><Check size={12} /> Passwords match</p>
            {/if}
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="rp-btn rp-btn--primary rp-btn--full rp-btn--submit"
            disabled={isLoading || cooldown > 0}>
            {#if isLoading}
              <span class="rp-spinner"></span>Updating password…
            {:else if cooldown > 0}
              <span class="rp-cd-ring">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="2.5"/>
                  <circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="2.5"
                    stroke-dasharray={circumference}
                    stroke-dashoffset={ringOffset}
                    stroke-linecap="round"
                    transform="rotate(-90 12 12)" />
                </svg>
                <span class="rp-cd-num">{cooldown}</span>
              </span>
              Try again in {cooldown}s
            {:else}
              <ShieldCheck size={16} />Reset password
            {/if}
          </button>

        </form>
      </div>
    {/if}

    <div class="rp-footer">
      <p>Remember your password? <a href="/signin" class="rp-link">Sign in</a></p>
    </div>

    <button class="rp-home-btn" onclick={() => goto('/')}>
      <Home size={13} /> Back to Home
    </button>

  </div>
</div>

<style>
  :global(.rp-page *) { font-family:'DM Sans',system-ui,sans-serif; box-sizing:border-box; }

  .rp-page {
    min-height:100vh;
    background:linear-gradient(145deg,#faf9ff 0%,#f3f0ff 60%,#fdf4ff 100%);
    display:flex; align-items:center; justify-content:center;
    padding:2rem 1.25rem; position:relative; overflow:hidden;
  }

  .rp-blob { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:0; }
  .rp-blob--1 { width:420px; height:420px; background:radial-gradient(circle,rgba(106,44,145,.09),transparent 70%); top:-120px; right:-80px; animation:rp-float 9s ease-in-out infinite; }
  .rp-blob--2 { width:320px; height:320px; background:radial-gradient(circle,rgba(139,92,246,.07),transparent 70%); bottom:-80px; left:-60px; animation:rp-float 11s ease-in-out infinite reverse; }

  .rp-shell { position:relative; z-index:1; width:100%; max-width:440px; display:flex; flex-direction:column; align-items:center; gap:1.5rem; }

  .rp-logo-link { display:inline-block; line-height:0; transition:opacity .2s; }
  .rp-logo-link:hover { opacity:.8; }
  .rp-logo { width:72px; height:72px; object-fit:contain; }

  .rp-card {
    width:100%; background:white; border-radius:1.75rem;
    border:1.5px solid #e5e7eb;
    box-shadow:0 24px 48px -12px rgba(26,11,46,.12),0 4px 16px rgba(0,0,0,.04);
    padding:clamp(1.5rem,5vw,2rem);
    display:flex; flex-direction:column; gap:1.375rem;
    animation:rp-rise .5s cubic-bezier(.16,1,.3,1) both;
  }

  .rp-card-header { display:flex; align-items:flex-start; gap:1rem; }

  .rp-lock-icon {
    width:48px; height:48px; border-radius:1rem; flex-shrink:0;
    background:linear-gradient(135deg,#1a0b2e,#2d1b4e);
    display:flex; align-items:center; justify-content:center; color:#c4b5fd;
    box-shadow:0 6px 16px rgba(26,11,46,.25);
  }

  .rp-title { font-family:'DM Serif Display',Georgia,serif; font-size:clamp(1.4rem,4vw,1.75rem); color:#1e1b4b; letter-spacing:-.02em; margin:0; line-height:1.2; }
  .rp-subtitle { font-size:.8125rem; color:#64748b; margin:.25rem 0 0; line-height:1.5; }

  .rp-alert-error { display:flex; align-items:center; gap:.625rem; padding:.75rem 1rem; background:#fef2f2; border:1px solid #fecaca; border-radius:.75rem; color:#dc2626; font-size:.8125rem; }

  .rp-form { display:flex; flex-direction:column; gap:1.125rem; }
  .rp-field { display:flex; flex-direction:column; gap:.375rem; }
  .rp-label { font-size:.8125rem; font-weight:600; color:#374151; }
  .rp-req { color:#6a2c91; }
  .rp-input-wrap { position:relative; }
  .rp-ico { position:absolute; left:.875rem; top:50%; transform:translateY(-50%); color:#9ca3af; display:flex; align-items:center; pointer-events:none; }
  .rp-input { width:100%; padding:.75rem .875rem .75rem 2.5rem; border:1.5px solid #e5e7eb; border-radius:.75rem; font-size:.875rem; font-family:'DM Sans',sans-serif; color:#1e1b4b; background:white; transition:all .2s; outline:none; }
  .rp-input:hover { border-color:#c4b5fd; }
  .rp-input:focus { border-color:#6a2c91; box-shadow:0 0 0 3px rgba(106,44,145,.1); }
  .rp-input--err { border-color:#f87171; background:#fff5f5; }
  .rp-input--toggle { padding-right:2.75rem; }
  .rp-eye { position:absolute; right:.75rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#9ca3af; display:flex; padding:.25rem; transition:color .2s; }
  .rp-eye:hover { color:#6a2c91; }

  .rp-strength { display:flex; align-items:center; gap:.625rem; margin-top:.25rem; }
  .rp-strength-track { flex:1; height:4px; background:#e5e7eb; border-radius:2px; overflow:hidden; }
  .rp-strength-fill { height:100%; border-radius:2px; transition:width .35s ease,background .35s ease; }
  .rp-strength-label { font-size:.6875rem; font-weight:700; min-width:44px; text-align:right; }

  .rp-hints { display:flex; flex-wrap:wrap; gap:.375rem; margin-top:.375rem; }
  .rp-hint { display:inline-flex; align-items:center; gap:.3rem; font-size:.6875rem; font-weight:500; padding:.2rem .625rem; border-radius:100px; transition:all .2s; }
  .rp-hint--ok { background:#f3e8ff; color:#4b1d68; border:1px solid #ddd6fe; }
  .rp-hint--no { background:#f8fafc; color:#94a3b8; border:1px solid #e2e8f0; }

  .rp-err   { display:flex; align-items:center; gap:.3rem; font-size:.75rem; color:#dc2626; margin:0; }
  .rp-match { display:flex; align-items:center; gap:.3rem; font-size:.75rem; color:#6a2c91; font-weight:500; margin:0; }

  .rp-btn { display:inline-flex; align-items:center; justify-content:center; gap:.5rem; padding:.8125rem 1.25rem; border-radius:.75rem; font-size:.9rem; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; border:none; transition:all .2s; }
  .rp-btn--full { width:100%; }
  .rp-btn--primary { background:linear-gradient(135deg,#6a2c91,#4a1d6e); color:white; box-shadow:0 4px 14px rgba(106,44,145,.28); }
  .rp-btn--primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 6px 20px rgba(106,44,145,.38); }
  .rp-btn--primary:disabled { opacity:.65; cursor:not-allowed; transform:none; }
  .rp-btn--ghost { background:white; color:#64748b; border:1.5px solid #e5e7eb; }
  .rp-btn--ghost:hover { border-color:#6a2c91; color:#6a2c91; background:#f3e8ff; }
  .rp-btn--submit { margin-top:.25rem; }

  .rp-cd-ring { position:relative; width:18px; height:18px; display:inline-flex; align-items:center; justify-content:center; }
  .rp-cd-ring svg { position:absolute; inset:0; }
  .rp-cd-num { font-size:.55rem; font-weight:800; color:white; position:relative; z-index:1; line-height:1; }

  .rp-spinner { width:15px; height:15px; border:2px solid rgba(255,255,255,.3); border-top-color:white; border-radius:50%; animation:rp-spin .55s linear infinite; flex-shrink:0; }

  /* ── Success ── */
  .rp-card--success { align-items:center; text-align:center; padding:2.5rem 2rem; background:linear-gradient(160deg,#1a0b2e 0%,#2d1b4e 100%); border-color:transparent; }
  .rp-card--success .rp-title { color:white; }
  .rp-success-desc { color:rgba(196,181,253,.85); font-size:.875rem; line-height:1.6; margin:0; }
  .rp-success-icon-wrap { position:relative; width:80px; height:80px; display:flex; align-items:center; justify-content:center; margin-bottom:.5rem; }
  .rp-success-ring { position:absolute; inset:0; border-radius:50%; border:2px solid rgba(196,181,253,.3); animation:rp-pulse-ring 2s ease-out infinite; }
  .rp-success-icon { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,#6a2c91,#4a1d6e); display:flex; align-items:center; justify-content:center; color:white; box-shadow:0 0 32px rgba(106,44,145,.5); animation:rp-pop .5s cubic-bezier(.34,1.56,.64,1) both; }
  .rp-redirect-bar { width:100%; height:3px; background:rgba(255,255,255,.1); border-radius:2px; overflow:hidden; }
  .rp-redirect-fill { height:100%; background:#c4b5fd; animation:rp-progress 4s linear forwards; }
  .rp-card--success .rp-btn--primary { background:white; color:#6a2c91; box-shadow:0 4px 14px rgba(0,0,0,.2); }
  .rp-card--success .rp-btn--primary:hover { background:#f3e8ff; }

  /* ── Invalid token ── */
  .rp-invalid-icon { display:flex; justify-content:center; color:#f59e0b; }
  .rp-invalid-actions { display:flex; flex-direction:column; gap:.625rem; }

  .rp-footer { animation:rp-rise .5s .15s cubic-bezier(.16,1,.3,1) both; }
  .rp-footer p { font-size:.8125rem; color:#64748b; margin:0; text-align:center; }
  .rp-link { color:#6a2c91; font-weight:600; text-decoration:none; }
  .rp-link:hover { text-decoration:underline; }
  .rp-home-btn { display:inline-flex; align-items:center; gap:.375rem; background:none; border:none; cursor:pointer; font-size:.8rem; color:#94a3b8; font-family:'DM Sans',sans-serif; transition:color .2s; padding:.25rem; }
  .rp-home-btn:hover { color:#6a2c91; }

  @keyframes rp-rise        { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rp-float       { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,16px)} }
  @keyframes rp-spin        { to{transform:rotate(360deg)} }
  @keyframes rp-pop         { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes rp-pulse-ring  { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.5);opacity:0} }
  @keyframes rp-progress    { from{width:0%} to{width:100%} }

  @media (max-width:480px) {
    .rp-card { border-radius:1.25rem; }
    .rp-card-header { flex-direction:column; gap:.75rem; }
  }
</style>
