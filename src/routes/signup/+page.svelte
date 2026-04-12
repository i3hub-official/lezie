<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { authClient } from '$lib/auth-client';
  import { authStore } from '$lib/stores/auth';
  import { 
    Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft,
    MapPin, Users, Bell, User, Phone, Fingerprint, ChevronLeft,
    Home, Sparkles, ShieldCheck, Smartphone
  } from 'lucide-svelte';
  
  let Icon = $derived(getIdentifierIcon());
  
  let step = $state<'identifier' | 'password'>('identifier');
  let formData = $state({
    identifier: '',
    password: '',
    rememberMe: false
  });
  
  let errors       = $state<Record<string, string>>({});
  let isLoading    = $state(false);
  let showPassword = $state(false);
  let touched      = $state<Record<string, boolean>>({});

  /**
   * Visibility gate — keeps the page hidden until we know the auth state.
   * If the user is already signed in, goto('/dashboard') fires before
   * anything is painted, so there is no flash at all.
   *
   * - false  → page is invisible (waiting for store to resolve)
   * - true   → store has resolved AND user is not authenticated; safe to show
   */
  let visible = $state(!browser); // SSR: always visible (no JS flash risk)

  $effect(() => {
    const unsub = authStore.subscribe(s => {
      if (s.user) {
        // Already authenticated — redirect silently before any paint
        goto('/dashboard', { replaceState: true });
      } else {
        // Not authenticated — reveal the page
        visible = true;
      }
    });
    return unsub;
  });
  
  const getIdentifierType = (identifier: string): 'email' | 'username' | 'phone' => {
    if (/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(identifier)) return 'email';
    if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(identifier)) return 'phone';
    return 'username';
  };
  
  const validateIdentifier = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Required';
    } else if (getIdentifierType(formData.identifier) === 'email' && !/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.identifier)) {
      newErrors.identifier = 'Invalid email';
    }
    return newErrors;
  };
  
  const handleIdentifierSubmit = async (e: Event) => {
    e.preventDefault();
    const identifierErrors = validateIdentifier();
    if (Object.keys(identifierErrors).length > 0) { 
      errors = identifierErrors;
      touched.identifier = true;
      return; 
    }
    errors = {};
    step = 'password';
  };

  const handlePasswordSubmit = async (e: Event) => {
    e.preventDefault();
    isLoading = true;
    errors = {};

    try {
      // 1. Resolve the identifier to an actual email
      const resolveRes = await fetch('/api/login-resolver', {
        method: 'POST',
        body: JSON.stringify({ identifier: formData.identifier })
      });
      const resolved = await resolveRes.json();

      if (!resolveRes.ok) {
        errors.submit = "Account not found";
        return;
      }

      // 2. Sign in using the resolved email
      // Works for both passwords and PINs (stored as the password)
      const { data, error } = await authClient.signIn.email({
        email: resolved.email,
        password: formData.password,
        dontRememberMe: !formData.rememberMe,
      });

      if (error) {
        errors.submit = error.message;
      } else {
        await goto('/dashboard');
      }
    } catch (err) {
      errors.submit = "Login failed. Check your connection.";
    } finally {
      isLoading = false;
    }
  };

  const handlePasskeyLogin = async () => {
    isLoading = true;
    errors = {};
    try {
      const { data, error } = await authClient.signIn.passkey();
      if (error) {
        errors.submit = error.message || 'Passkey authentication failed';
      } else {
        await goto('/dashboard');
      }
    } catch (err) {
      errors.submit = 'An unexpected error occurred during passkey login';
    } finally {
      isLoading = false;
    }
  };
  
  const goBackToIdentifier = () => { step = 'identifier'; errors = {}; };
  const goBackToLanding    = () => goto('/');
  
  const getIdentifierIcon = () => {
    const type = getIdentifierType(formData.identifier);
    return type === 'email' ? Mail : (type === 'phone' ? Phone : User);
  };
</script>

<svelte:head>
  <title>Sign In - Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<!-- Visibility gate: hidden until auth state is confirmed -->
<div class="si-page" class:si-page--hidden={!visible}>

  <aside class="si-panel">
    <div class="si-panel-inner">
      <a href="/" class="si-logo-link">
        <img src="/icons/lz_logo_t.png" alt="Lezie" class="si-logo-img" />
      </a>

      <div class="si-panel-hero">
        <div class="si-panel-badge">
          <Sparkles size={14} />
          <span>Welcome back</span>
        </div>
        <h2 class="si-panel-headline">
          Good to have<br/>
          <em>you back.</em>
        </h2>
        <p class="si-panel-desc">
          Your community is counting on you. Sign in to check live alerts, review recent reports, and keep your neighbourhood safe.
        </p>
      </div>

      <div class="si-features">
        <div class="si-feature-card">
          <div class="si-feature-icon"><MapPin size={18} /></div>
          <div><strong>Live Incident Map</strong><span>See what's happening near you right now</span></div>
        </div>
        <div class="si-feature-card">
          <div class="si-feature-icon"><Bell size={18} /></div>
          <div><strong>Instant Alerts</strong><span>Get notified when safety events occur nearby</span></div>
        </div>
        <div class="si-feature-card">
          <div class="si-feature-icon"><ShieldCheck size={18} /></div>
          <div><strong>Trusted Community</strong><span>Verified neighbours, reliable reports</span></div>
        </div>
      </div>

      <div class="si-panel-footer">
        <div class="si-avatars">
          <div class="si-avatar" style="background: var(--secondary-color)"></div>
          <div class="si-avatar" style="background: #a78bfa"></div>
          <div class="si-avatar" style="background: #8b5cf6"></div>
          <div class="si-avatar" style="background: var(--primary-color)"></div>
          <div class="si-avatar-count">+12k</div>
        </div>
        <p>Trusted by communities worldwide</p>
      </div>
    </div>
    <div class="si-panel-glow"></div>
  </aside>

  <main class="si-main">
    <div class="si-form-shell">

      <button class="si-back-home" onclick={goBackToLanding}>
        <ChevronLeft size={18} />
        <Home size={14} />
        <span>Back to Home</span>
      </button>

      <div class="si-mobile-brand">
        <a href="/" class="si-logo-link">
          <img src="/icons/lz_ico.png" alt="Lezie" class="si-logo-img" />
        </a>
      </div>

      <div class="si-form-header">
        <h1 class="si-form-title">Welcome back</h1>
        <p class="si-form-subtitle">{step === 'identifier' ? 'Sign in to your account' : 'Enter your credentials'}</p>
      </div>

      <div class="si-card">

        {#if errors.submit}
          <div class="si-alert-error">
            <AlertCircle size={18} />
            <span>{errors.submit}</span>
          </div>
        {/if}

        <div class="si-steps">
          <div class="si-step-dot {step !== 'identifier' ? 'done' : 'active'}"></div>
          <div class="si-step-line {step !== 'identifier' ? 'filled' : ''}"></div>
          <div class="si-step-dot {step !== 'identifier' ? 'active' : ''}"></div>
        </div>

        {#if step === 'identifier'}
          <div class="si-step-body">
            <div class="si-welcome-message">
              <Smartphone size={20} />
              <div><strong>Sign in securely</strong><span>Use your email, username, or phone number</span></div>
            </div>
            <form onsubmit={handleIdentifierSubmit}>
              <div class="si-field">
                <label class="si-label" for="identifier">Email / Username / Phone <span class="si-req">*</span></label>
                <div class="si-input-wrap">
                  <span class="si-input-icon"><Mail size={16} /></span>
                  <input
                    type="text"
                    id="identifier"
                    placeholder="you@example.com, username, or +1 (234) 567-8900"
                    bind:value={formData.identifier}
                    onblur={() => { touched.identifier = true; errors.identifier = validateIdentifier().identifier; }}
                    class="si-input {errors.identifier && touched.identifier ? 'si-input--err' : ''}"
                    autocomplete="username"
                  />
                </div>
                {#if errors.identifier && touched.identifier}
                  <p class="si-err">{errors.identifier}</p>
                {:else}
                  <p class="si-hint">You can sign in with any of these options</p>
                {/if}
              </div>
              <div class="si-actions">
                <button type="submit" class="si-btn-next si-btn-next--full">Continue <ArrowRight size={15} /></button>
              </div>
            </form>
          </div>
        {/if}

        {#if step === 'password'}
          <div class="si-step-body">
            <div class="si-welcome-message">
              <Fingerprint size={20} />
              <div><strong>Verify your identity</strong><span>Enter your password or PIN to continue</span></div>
            </div>

           <div class="si-email-badge">
  <Icon size={14} class="si-badge-icon" />
  <span class="si-badge-email">{formData.identifier}</span>
  <button type="button" class="si-badge-edit" onclick={goBackToIdentifier}>Edit</button>
</div>

            <form onsubmit={handlePasswordSubmit}>
              <div class="si-field">
                <div class="si-label-row">
                  <label class="si-label" for="password">Password or PIN <span class="si-req">*</span></label>
                  <a href="/forgot-password" class="si-link si-forgot">Forgot password?</a>
                </div>
                <div class="si-input-wrap">
                  <span class="si-input-icon"><Lock size={16} /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password or 4-6 digit PIN"
                    bind:value={formData.password}
                    onblur={() => { touched.password = true; }}
                    class="si-input si-input--toggle {errors.password && touched.password ? 'si-input--err' : ''}"
                    autocomplete="current-password"
                  />
                  <button type="button" class="si-eye-btn" onclick={() => showPassword = !showPassword}>
                    {#if showPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
                  </button>
                </div>
                {#if errors.password && touched.password}
                  <p class="si-err">{errors.password}</p>
                {:else}
                  <p class="si-hint">You can sign in with either your password or 4-6 digit PIN</p>
                {/if}
              </div>

              <label class="si-remember">
                <input type="checkbox" bind:checked={formData.rememberMe} class="si-checkbox" />
                <span>Remember me for 30 days</span>
              </label>

              <div class="si-actions">
                <button type="button" class="si-btn-back" onclick={goBackToIdentifier}><ArrowLeft size={15} /> Back</button>
                <button type="submit" disabled={isLoading} class="si-btn-next">
                  {#if isLoading}<span class="si-spinner"></span> Signing in…{:else}Sign In <ArrowRight size={15} />{/if}
                </button>
              </div>
            </form>

            {#if typeof window !== 'undefined' && window.PublicKeyCredential}
              <div class="si-passkey-divider"><span>or continue with</span></div>
              <button 
                type="button" 
                class="si-passkey-btn" 
                disabled={isLoading}
                onclick={handlePasskeyLogin}
              >
                {#if isLoading}
                  <span class="si-spinner"></span>
                {:else}
                  <Fingerprint size={18} />
                  <span>Sign in with Passkey</span>
                {/if}
              </button>
            {/if}

          </div>
        {/if}

      </div>

      <p class="si-footer-text">Don't have an account? <a href="/signup" class="si-link">Create account</a></p>
    </div>
  </main>
</div>

<style>
  :global(.si-page *) { font-family: 'DM Sans', system-ui, sans-serif; box-sizing: border-box; }
  .si-page { display: flex; min-height: 100vh; background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%); }
  .si-panel { display: none; position: relative; width: 440px; flex-shrink: 0; background: linear-gradient(160deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%); overflow: hidden; }
  @media (min-width: 1024px) { .si-panel { display: flex; } }
  .si-panel-inner { position: relative; z-index: 2; display: flex; flex-direction: column; padding: 2.5rem; height: 100%; }
  .si-panel-glow { position: absolute; inset: 0; z-index: 1; background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%); pointer-events: none; }
  .si-logo-link { display: inline-block; line-height: 0; margin-bottom: 2.5rem; transition: transform 0.2s, opacity 0.2s; }
  .si-logo-link:hover { opacity: 0.85; transform: scale(1.02); }
  .si-logo-img { width: 80px; height: 80px; object-fit: contain; display: block; }
  .si-panel-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.875rem; background: rgba(139,92,246,0.2); border: 1px solid rgba(139,92,246,0.3); border-radius: 100px; font-size: 0.75rem; color: #c4b5fd; margin-bottom: 1.5rem; }
  .si-panel-headline { font-family: 'DM Serif Display', Georgia, serif; font-size: 2.5rem; line-height: 1.2; color: white; margin-bottom: 1rem; }
  .si-panel-headline em { color: #c4b5fd; font-style: italic; }
  .si-panel-desc { font-size: 0.875rem; line-height: 1.6; color: rgba(196,181,253,0.85); margin-bottom: 2rem; }
  .si-features { display: flex; flex-direction: column; gap: 1rem; margin-bottom: auto; }
  .si-feature-card { display: flex; align-items: flex-start; gap: 0.875rem; padding: 0.875rem; background: rgba(255,255,255,0.05); border-radius: 1rem; backdrop-filter: blur(10px); transition: background 0.2s; }
  .si-feature-card:hover { background: rgba(255,255,255,0.08); }
  .si-feature-icon { width: 36px; height: 36px; background: rgba(139,92,246,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #c4b5fd; flex-shrink: 0; }
  .si-feature-card strong { display: block; font-size: 0.813rem; font-weight: 600; color: white; margin-bottom: 0.25rem; }
  .si-feature-card span { font-size: 0.75rem; color: rgba(196,181,253,0.8); line-height: 1.4; }
  .si-panel-footer { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); }
  .si-avatars { display: flex; align-items: center; margin-bottom: 0.75rem; }
  .si-avatar { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #2d1b4e; margin-left: -8px; }
  .si-avatar:first-child { margin-left: 0; }
  .si-avatar-count { width: 32px; height: 32px; border-radius: 50%; background: rgba(139,92,246,0.3); border: 2px solid #2d1b4e; display: flex; align-items: center; justify-content: center; font-size: 0.688rem; font-weight: 600; color: white; margin-left: -8px; }
  .si-panel-footer p { font-size: 0.688rem; color: rgba(196,181,253,0.7); }
  .si-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem 1.25rem; min-height: 100vh; }
  .si-form-shell { width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 1.5rem; }
  .si-back-home { display: inline-flex; align-items: center; gap: 0.5rem; background: white; border: 1px solid #e5e7eb; border-radius: 100px; padding: 0.5rem 1rem; font-size: 0.813rem; font-weight: 500; color: #64748b; cursor: pointer; transition: all 0.2s; width: fit-content; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  .si-back-home:hover { border-color: #6a2c91; color: #6a2c91; background: #f3e8ff; transform: translateX(-2px); }
  .si-mobile-brand { display: flex; justify-content: center; }
  .si-mobile-brand .si-logo-link { margin-bottom: 0; }
  .si-mobile-brand .si-logo-img { width: 80px; height: 80px; }
  @media (min-width: 1024px) { .si-mobile-brand { display: none; } }
  .si-form-header { text-align: center; }
  .si-form-title { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(1.625rem, 4vw, 2rem); color: #1e1b4b; margin-bottom: 0.25rem; letter-spacing: -0.02em; }
  .si-form-subtitle { font-size: 0.875rem; color: #64748b; }
  .si-card { background: white; border-radius: 1.5rem; border: 1px solid #e2e8f0; padding: clamp(1.25rem, 5vw, 2rem); box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1); }
  .si-steps { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.75rem; }
  .si-step-dot { width: 8px; height: 8px; border-radius: 50%; background: #e2e8f0; transition: all 0.3s ease; flex-shrink: 0; }
  .si-step-dot.active { background: #6a2c91; width: 24px; border-radius: 4px; box-shadow: 0 0 0 3px rgba(106,44,145,0.15); }
  .si-step-dot.done { background: #1a0b2e; }
  .si-step-line { flex: 1; height: 2px; background: #e2e8f0; border-radius: 1px; transition: background 0.4s ease; }
  .si-step-line.filled { background: #1a0b2e; }
  .si-welcome-message { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1rem; background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%); border-radius: 1rem; margin-bottom: 1.5rem; }
  .si-welcome-message svg { color: #6a2c91; flex-shrink: 0; }
  .si-welcome-message strong { display: block; font-size: 0.875rem; font-weight: 700; color: #1e1b4b; }
  .si-welcome-message span { font-size: 0.75rem; color: #64748b; }
  .si-alert-error { display: flex; align-items: center; gap: 0.625rem; padding: 0.75rem 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.75rem; color: #dc2626; font-size: 0.813rem; margin-bottom: 1.5rem; }
  .si-email-badge { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 0.875rem; background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%); border: 1px solid #e0d4f5; border-radius: 0.75rem; margin-bottom: 1.25rem; }
  .si-badge-icon { color: #6a2c91; flex-shrink: 0; }
  .si-badge-email { font-size: 0.813rem; font-weight: 500; color: #1e1b4b; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .si-badge-edit { background: none; border: none; font-size: 0.75rem; font-weight: 600; color: #6a2c91; cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 0.5rem; transition: background 0.2s; flex-shrink: 0; }
  .si-badge-edit:hover { background: rgba(106,44,145,0.08); }
  .si-step-body { display: flex; flex-direction: column; }
  .si-field { display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 1.125rem; }
  .si-label-row { display: flex; align-items: center; justify-content: space-between; }
  .si-label { font-size: 0.813rem; font-weight: 600; color: #374151; }
  .si-req { color: #6a2c91; }
  .si-forgot { font-size: 0.75rem; }
  .si-hint { font-size: 0.688rem; color: #94a3b8; }
  .si-input-wrap { position: relative; }
  .si-input-icon { position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: #9ca3af; display: flex; align-items: center; justify-content: center; pointer-events: none; }
  .si-input { width: 100%; padding: 0.75rem 0.875rem 0.75rem 2.625rem; border: 1.5px solid #e5e7eb; border-radius: 0.75rem; font-size: 0.875rem; font-family: 'DM Sans', sans-serif; color: #1e1b4b; background: white; transition: all 0.2s; outline: none; }
  .si-input:hover { border-color: #c4b5fd; }
  .si-input:focus { border-color: #6a2c91; box-shadow: 0 0 0 3px rgba(106,44,145,0.1); }
  .si-input--err { border-color: #f87171; background: #fff5f5; }
  .si-input--toggle { padding-right: 2.75rem; }
  .si-eye-btn { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9ca3af; display: flex; padding: 0.25rem; transition: color 0.2s; }
  .si-eye-btn:hover { color: #6a2c91; }
  .si-err { font-size: 0.75rem; color: #dc2626; display: flex; align-items: center; gap: 0.25rem; }
  .si-remember { display: flex; align-items: center; gap: 0.5rem; font-size: 0.813rem; color: #4b5563; cursor: pointer; margin-bottom: 1.5rem; }
  .si-checkbox { width: 16px; height: 16px; accent-color: #6a2c91; cursor: pointer; flex-shrink: 0; }
  .si-actions { display: flex; gap: 0.75rem; align-items: center; }
  .si-btn-back { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.75rem 1.125rem; background: white; border: 1.5px solid #e5e7eb; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 500; color: #64748b; cursor: pointer; transition: all 0.2s; }
  .si-btn-back:hover { border-color: #6a2c91; color: #6a2c91; background: #f3e8ff; transform: translateX(-2px); }
  .si-btn-next { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.8125rem 1.25rem; background: linear-gradient(135deg, #6a2c91 0%, #4a1d6e 100%); color: white; border: none; border-radius: 0.75rem; font-size: 0.9375rem; font-weight: 600; cursor: pointer; box-shadow: 0 4px 14px rgba(106,44,145,0.3); transition: all 0.2s; }
  .si-btn-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(106,44,145,0.4); }
  .si-btn-next:active:not(:disabled) { transform: translateY(0); }
  .si-btn-next:disabled { opacity: 0.65; cursor: not-allowed; }
  .si-btn-next--full { width: 100%; }
  .si-passkey-divider { position: relative; text-align: center; margin: 1.25rem 0 1rem; }
  .si-passkey-divider::before { content: ''; position: absolute; left: 0; top: 50%; width: 100%; height: 1px; background: #e5e7eb; }
  .si-passkey-divider span { position: relative; background: white; padding: 0 0.75rem; font-size: 0.75rem; color: #94a3b8; }
  .si-passkey-btn { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 0.625rem; padding: 0.8125rem 1.25rem; background: white; border: 1.5px solid #e5e7eb; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 600; color: #1e1b4b; cursor: pointer; transition: all 0.2s; }
  .si-passkey-btn:hover { border-color: #6a2c91; background: #f3e8ff; color: #6a2c91; transform: translateY(-1px); }
  .si-link { color: #6a2c91; font-weight: 500; text-decoration: none; }
  .si-link:hover { text-decoration: underline; }
  .si-footer-text { text-align: center; font-size: 0.875rem; color: #64748b; }
  .si-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 640px) {
    .si-main { padding: 1.5rem 1rem; align-items: flex-start; }
    .si-form-shell { gap: 1.25rem; }
    .si-card { border-radius: 1.25rem; padding: 1.25rem; }
    .si-actions { flex-direction: column-reverse; }
    .si-btn-back { width: 100%; justify-content: center; }
    .si-btn-next { width: 100%; }
    .si-back-home { font-size: 0.75rem; padding: 0.375rem 0.875rem; }
  }
.si-page--hidden {
    opacity: 0;
    pointer-events: none;
  }
</style>
