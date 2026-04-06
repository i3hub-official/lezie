<script lang="ts">
  import { Mail, AlertCircle, ArrowRight, CheckCircle, ArrowLeft, Shield, MapPin, Users, Bell, ChevronLeft, Home, Sparkles, ShieldCheck, Smartphone } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  
  let email = $state('');
  let errors = $state<Record<string, string>>({});
  let isLoading = $state(false);
  let isSuccess = $state(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    return newErrors;
  };
  
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) { errors = validationErrors; return; }
    isLoading = true;
    errors = {};
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to send reset email');
      isSuccess = true;
    } catch (error: unknown) {
      errors.submit = error instanceof Error ? error.message : 'An error occurred';
    } finally {
      isLoading = false;
    }
  };

  const goBackToHome = () => {
    goto('/');
  };
</script>

<svelte:head>
  <title>Reset Password - Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="fp-page">

  <!-- ── LEFT PANEL (desktop only) ── -->
  <aside class="fp-panel">
    <div class="fp-panel-inner">
      <a href="/" class="fp-logo-link">
        <img src="/icons/lz_logo_t.png" alt="Lezie" class="fp-logo-img fp-logo-img--desktop" />
      </a>

      <div class="fp-panel-hero">
        <div class="fp-panel-badge">
          <Sparkles size={14} />
          <span>Account Recovery</span>
        </div>
        <h2 class="fp-panel-headline">
          We've got<br/>
          <em>your back.</em>
        </h2>
        <p class="fp-panel-desc">
          Happens to the best of us. Enter your email and we'll send a secure link to get you back into your account in seconds.
        </p>
      </div>

      <div class="fp-features">
        <div class="fp-feature-card">
          <div class="fp-feature-icon"><Shield size={18} /></div>
          <div><strong>Secure Reset Link</strong><span>Expires in 15 minutes for your safety</span></div>
        </div>
        <div class="fp-feature-card">
          <div class="fp-feature-icon"><Mail size={18} /></div>
          <div><strong>Check Your Inbox</strong><span>Link sent instantly to your registered email</span></div>
        </div>
        <div class="fp-feature-card">
          <div class="fp-feature-icon"><Users size={18} /></div>
          <div><strong>Still Need Help?</strong><span>Contact support if you no longer have access</span></div>
        </div>
      </div>

      <div class="fp-panel-footer">
        <div class="fp-avatars">
          <div class="fp-avatar" style="background: var(--secondary-color)"></div>
          <div class="fp-avatar" style="background: #a78bfa"></div>
          <div class="fp-avatar" style="background: #8b5cf6"></div>
          <div class="fp-avatar" style="background: var(--primary-color)"></div>
          <div class="fp-avatar-count">+12k</div>
        </div>
        <p>Trusted by communities worldwide</p>
      </div>
    </div>
    <div class="fp-panel-glow"></div>
  </aside>

  <!-- ── RIGHT / FORM ── -->
  <main class="fp-main">
    <div class="fp-form-shell">

      <!-- Back button to home -->
      <button class="fp-back-home" onclick={goBackToHome}>
        <ChevronLeft size={18} />
        <Home size={14} />
        <span>Back to Home</span>
      </button>

      <!-- Mobile logo -->
      <div class="fp-mobile-logo">
        <a href="/" class="fp-logo-link">
          <img src="/icons/lz_ico.png" alt="Lezie" class="fp-logo-img fp-logo-img--mobile" />
        </a>
      </div>

      <!-- Header -->
      <div class="fp-form-header">
        <h1 class="fp-form-title">
          {isSuccess ? 'Email sent!' : 'Reset password'}
        </h1>
        <p class="fp-form-subtitle">
          {isSuccess
            ? 'Check your inbox for the reset link'
            : 'Enter your email and we\'ll send you a reset link'}
        </p>
      </div>

      <!-- Card -->
      <div class="fp-card">

        {#if isSuccess}
          <!-- Success state -->
          <div class="fp-success" style="animation: stepIn .35s ease both">
            <div class="fp-success-icon">
              <CheckCircle size={40} strokeWidth={1.5} />
            </div>
            <h3 class="fp-success-title">Check your email</h3>
            <p class="fp-success-body">
              We sent a password reset link to
            </p>
            <div class="fp-success-email">
              <Mail size={14} />
              <span>{email}</span>
            </div>
            <p class="fp-success-note">
              Didn't receive it? Check your spam folder or wait a minute before trying again.
            </p>
            <a href="/auth/signin" class="fp-btn-primary">
              Return to Sign In <ArrowRight size={15} />
            </a>
            <button
              type="button"
              class="fp-btn-resend"
              onclick={() => { isSuccess = false; }}
            >
              Try a different email
            </button>
          </div>

        {:else}
          <!-- Form state -->
          <div style="animation: stepIn .35s ease both">

            {#if errors.submit}
              <div class="fp-alert-error">
                <AlertCircle size={18} />
                <span>{errors.submit}</span>
              </div>
            {/if}

            <form onsubmit={handleSubmit}>
              <div class="fp-field">
                <label class="fp-label" for="email">
                  Email Address <span class="fp-req">*</span>
                </label>
                <div class="fp-input-wrap">
                  <span class="fp-input-icon"><Mail size={16} /></span>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    bind:value={email}
                    class="fp-input {errors.email ? 'fp-input--err' : ''}"
                    autocomplete="email"
                  />
                </div>
                {#if errors.email}
                  <p class="fp-err">{errors.email}</p>
                {:else}
                  <p class="fp-hint">We'll send a secure reset link to this address</p>
                {/if}
              </div>

              <button type="submit" disabled={isLoading} class="fp-btn-primary">
                {#if isLoading}
                  <span class="fp-spinner"></span> Sending…
                {:else}
                  Send Reset Link <ArrowRight size={15} />
                {/if}
              </button>
            </form>

            <div class="fp-divider"><span>or</span></div>

            <a href="/auth/signin" class="fp-btn-back">
              <ArrowLeft size={15} /> Back to Sign In
            </a>

          </div>
        {/if}

      </div>

      <!-- Footer -->
      <p class="fp-footer-text">
        Don't have an account? <a href="/auth/signup" class="fp-link">Create account</a>
      </p>

    </div>
  </main>
</div>

<style>
  :global(.fp-page *) {
    font-family: 'DM Sans', system-ui, sans-serif;
    box-sizing: border-box;
  }

  /* ── Layout ── */
  .fp-page {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%);
  }

  /* ── LEFT PANEL ── */
  .fp-panel {
    display: none;
    position: relative;
    width: 440px;
    flex-shrink: 0;
    background: linear-gradient(160deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%);
    overflow: hidden;
  }

  @media (min-width: 1024px) {
    .fp-panel { display: flex; }
  }

  .fp-panel-inner {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    padding: 2.5rem;
    height: 100%;
  }

  .fp-panel-glow {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Logo ── */
  .fp-logo-link {
    display: inline-block;
    line-height: 0;
    margin-bottom: 2.5rem;
    transition: transform 0.2s, opacity 0.2s;
  }

  .fp-logo-link:hover { opacity: 0.85; transform: scale(1.02); }

  .fp-logo-img--desktop {
    width: 80px;
    height: 80px;
    object-fit: contain;
    display: block;
  }

  .fp-logo-img--mobile {
    width: 96px;
    height: 96px;
    object-fit: contain;
    display: block;
  }

  /* ── Panel copy ── */
  .fp-panel-badge {
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

  .fp-panel-headline {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 2.5rem;
    line-height: 1.2;
    color: white;
    margin-bottom: 1rem;
  }

  .fp-panel-headline em {
    color: #c4b5fd;
    font-style: italic;
  }

  .fp-panel-desc {
    font-size: 0.875rem;
    line-height: 1.6;
    color: rgba(196,181,253,0.85);
    margin-bottom: 2rem;
  }

  /* Feature cards */
  .fp-features {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: auto;
  }

  .fp-feature-card {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 0.875rem;
    background: rgba(255,255,255,0.05);
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    transition: background 0.2s;
  }

  .fp-feature-card:hover {
    background: rgba(255,255,255,0.08);
  }

  .fp-feature-icon {
    width: 36px;
    height: 36px;
    background: rgba(139,92,246,0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c4b5fd;
    flex-shrink: 0;
  }

  .fp-feature-card strong {
    display: block;
    font-size: 0.813rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.25rem;
  }

  .fp-feature-card span {
    font-size: 0.75rem;
    color: rgba(196,181,253,0.8);
    line-height: 1.4;
  }

  /* Panel footer */
  .fp-panel-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .fp-avatars {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .fp-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #2d1b4e;
    margin-left: -8px;
  }

  .fp-avatar:first-child { margin-left: 0; }

  .fp-avatar-count {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(139,92,246,0.3);
    border: 2px solid #2d1b4e;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.688rem;
    font-weight: 600;
    color: white;
    margin-left: -8px;
  }

  .fp-panel-footer p {
    font-size: 0.688rem;
    color: rgba(196,181,253,0.7);
  }

  /* ── RIGHT / MAIN ── */
  .fp-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.25rem;
    min-height: 100vh;
  }

  .fp-form-shell {
    width: 100%;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Back button */
  .fp-back-home {
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
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    width: fit-content;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }

  .fp-back-home:hover {
    border-color: #6a2c91;
    color: #6a2c91;
    background: #f3e8ff;
    transform: translateX(-2px);
  }

  /* Mobile logo */
  .fp-mobile-logo {
    display: flex;
    justify-content: center;
  }

  .fp-mobile-logo .fp-logo-link { margin-bottom: 0; }

  @media (min-width: 1024px) {
    .fp-mobile-logo { display: none; }
  }

  /* Header */
  .fp-form-header { text-align: center; }

  .fp-form-title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(1.625rem, 4vw, 2rem);
    color: #1e1b4b;
    margin-bottom: 0.25rem;
    letter-spacing: -0.02em;
  }

  .fp-form-subtitle {
    font-size: 0.875rem;
    color: #64748b;
  }

  /* Card */
  .fp-card {
    background: white;
    border-radius: 1.5rem;
    border: 1px solid #e2e8f0;
    padding: clamp(1.25rem, 5vw, 2rem);
    box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1);
  }

  /* Alert */
  .fp-alert-error {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.75rem;
    color: #dc2626;
    font-size: 0.813rem;
    margin-bottom: 1.25rem;
  }

  /* Field */
  .fp-field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-bottom: 1.25rem;
  }

  .fp-label {
    font-size: 0.813rem;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.01em;
  }

  .fp-req { color: #6a2c91; }

  .fp-input-wrap { position: relative; }

  .fp-input-icon {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .fp-input {
    width: 100%;
    padding: 0.75rem 0.875rem 0.75rem 2.625rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    color: #1e1b4b;
    background: white;
    transition: all 0.2s;
    outline: none;
    -webkit-appearance: none;
  }

  .fp-input:hover { border-color: #c4b5fd; }
  .fp-input:focus {
    border-color: #6a2c91;
    background: white;
    box-shadow: 0 0 0 3px rgba(106,44,145,0.1);
  }
  .fp-input--err { border-color: #f87171; background: #fff5f5; }

  .fp-err { font-size: 0.75rem; color: #dc2626; }

  .fp-hint { font-size: 0.75rem; color: #64748b; }

  /* Buttons */
  .fp-btn-primary {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8125rem 1.25rem;
    background: linear-gradient(135deg, #6a2c91 0%, #4a1d6e 100%);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.9375rem;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(106,44,145,0.3);
    transition: all 0.2s;
    text-decoration: none;
  }

  .fp-btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(106,44,145,0.4);
  }

  .fp-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .fp-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

  .fp-btn-back {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: white;
    border: 1.5px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    color: #64748b;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
  }

  .fp-btn-back:hover {
    border-color: #6a2c91;
    color: #6a2c91;
    background: #f3e8ff;
  }

  /* Divider */
  .fp-divider {
    position: relative;
    text-align: center;
    margin: 1.25rem 0;
  }

  .fp-divider::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    background: #e5e7eb;
  }

  .fp-divider span {
    position: relative;
    background: white;
    padding: 0 0.875rem;
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 500;
  }

  /* Success state */
  .fp-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }

  .fp-success-icon {
    width: 72px;
    height: 72px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #10b981;
    margin-bottom: 0.25rem;
  }

  .fp-success-title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 1.375rem;
    color: #1e1b4b;
    letter-spacing: -0.01em;
    margin: 0;
  }

  .fp-success-body {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }

  .fp-success-email {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #f3e8ff;
    border: 1px solid #e0d4f5;
    border-radius: 0.625rem;
    padding: 0.5rem 0.875rem;
    font-size: 0.813rem;
    font-weight: 600;
    color: #4a1d6e;
  }

  .fp-success-note {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.6;
    max-width: 300px;
    margin: 0.25rem 0 0.75rem;
  }

  .fp-success .fp-btn-primary { margin-top: 0.25rem; }

  .fp-btn-resend {
    background: none;
    border: none;
    font-size: 0.813rem;
    color: #64748b;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    text-decoration: underline;
    padding: 0;
    transition: color 0.2s;
  }

  .fp-btn-resend:hover { color: #6a2c91; }

  /* Link */
  .fp-link {
    color: #6a2c91;
    font-weight: 500;
    text-decoration: none;
  }

  .fp-link:hover { text-decoration: underline; }

  /* Footer */
  .fp-footer-text {
    text-align: center;
    font-size: 0.875rem;
    color: #64748b;
  }

  /* Spinner */
  .fp-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @keyframes stepIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .fp-main { padding: 1.5rem 1rem; align-items: flex-start; }
    .fp-form-shell { gap: 1.25rem; }
    .fp-card { border-radius: 1.25rem; }
    .fp-back-home { font-size: 0.75rem; padding: 0.375rem 0.875rem; }
  }
</style>