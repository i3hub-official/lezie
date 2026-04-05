<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    MapPin,
    Users,
    Bell,
    User,
    Phone,
    Fingerprint,
    Key
  } from 'lucide-svelte';
  
  let step = $state<'identifier' | 'password' | 'pin' | 'passkey'>('identifier');
  let formData = $state({
    identifier: '',
    password: '',
    pin: '',
    rememberMe: false
  });
  
  let errors = $state<Record<string, string>>({});
  let isLoading = $state(false);
  let showPassword = $state(false);
  let authMethod = $state<'password' | 'pin' | 'passkey'>('password');
  
  // Detect identifier type (email, username, or phone)
  const getIdentifierType = (identifier: string): 'email' | 'username' | 'phone' => {
    if (/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(identifier)) return 'email';
    if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(identifier)) return 'phone';
    return 'username';
  };
  
  const validateIdentifier = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email, username, or phone number is required';
    } else if (getIdentifierType(formData.identifier) === 'email' && !/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.identifier)) {
      newErrors.identifier = 'Please enter a valid email address';
    } else if (getIdentifierType(formData.identifier) === 'phone' && formData.identifier.replace(/[\s\-\(\)\+]/g, '').length < 10) {
      newErrors.identifier = 'Please enter a valid phone number';
    }
    return newErrors;
  };
  
  const handleIdentifierSubmit = async (e: Event) => {
    e.preventDefault();
    const identifierErrors = validateIdentifier();
    if (Object.keys(identifierErrors).length > 0) { 
      errors = identifierErrors; 
      return; 
    }
    errors = {};
    isLoading = true;
    
    // Check which auth methods are available for this identifier
    try {
      // Simulate API call to get available auth methods
      await new Promise(r => setTimeout(r, 500));
      const type = getIdentifierType(formData.identifier);
      
      // For demo: all methods available, but in real app this would come from backend
      // You can modify this based on your backend response
      const availableMethods = ['password', 'pin', 'passkey'];
      
      if (availableMethods.includes('passkey') && window.PublicKeyCredential) {
        authMethod = 'passkey';
        step = 'passkey';
      } else if (availableMethods.includes('pin')) {
        authMethod = 'pin';
        step = 'pin';
      } else {
        authMethod = 'password';
        step = 'password';
      }
    } catch (error) {
      errors.submit = 'Unable to verify account. Please try again.';
    } finally {
      isLoading = false;
    }
  };
  
  const handlePasswordSubmit = async (e: Event) => {
    e.preventDefault();
    if (!formData.password) { 
      errors = { password: 'Password is required' }; 
      return; 
    }
    isLoading = true;
    errors = {};
    try {
      await authStore.login(formData.identifier, formData.password, formData.rememberMe);
      goto('/dashboard');
    } catch (error: unknown) {
      errors.submit = error instanceof Error ? error.message : 'Invalid email or password';
    } finally {
      isLoading = false;
    }
  };
  
  const handlePinSubmit = async (e: Event) => {
    e.preventDefault();
    if (!formData.pin || formData.pin.length < 4) { 
      errors = { pin: 'PIN must be at least 4 digits' }; 
      return; 
    }
    isLoading = true;
    errors = {};
    try {
      await authStore.loginWithPin(formData.identifier, formData.pin, formData.rememberMe);
      goto('/dashboard');
    } catch (error: unknown) {
      errors.submit = error instanceof Error ? error.message : 'Invalid PIN';
    } finally {
      isLoading = false;
    }
  };
  
  const handlePasskeySubmit = async (e: Event) => {
    e.preventDefault();
    isLoading = true;
    errors = {};
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        throw new Error('Passkeys are not supported on this browser');
      }
      
      await authStore.loginWithPasskey(formData.identifier, formData.rememberMe);
      goto('/dashboard');
    } catch (error: unknown) {
      errors.submit = error instanceof Error ? error.message : 'Passkey authentication failed';
      // Fallback to password
      authMethod = 'password';
      step = 'password';
    } finally {
      isLoading = false;
    }
  };
  
  const goBackToIdentifier = () => { 
    step = 'identifier'; 
    errors = {}; 
    authMethod = 'password';
  };
  
  const switchAuthMethod = (method: 'password' | 'pin' | 'passkey') => {
    authMethod = method;
    errors = {};
    if (method === 'passkey') {
      step = 'passkey';
    } else if (method === 'pin') {
      step = 'pin';
    } else {
      step = 'password';
    }
  };
  
  const getIdentifierIcon = () => {
    const type = getIdentifierType(formData.identifier);
    if (type === 'email') return Mail;
    if (type === 'phone') return Phone;
    return User;
  };
  
  const getIdentifierLabel = () => {
    const type = getIdentifierType(formData.identifier);
    if (type === 'email') return 'Email';
    if (type === 'phone') return 'Phone Number';
    return 'Username';
  };
</script>

<svelte:head>
  <title>Sign In - Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="si-page">

  <!-- ── LEFT PANEL (desktop only) ── -->
  <aside class="si-panel">
    <div class="si-panel-inner">

      <a href="/" class="si-logo-link">
        <img src="/icons/lz_logo_t.png" alt="Lezie" class="si-logo-img si-logo-img--desktop" />
      </a>

      <div class="si-panel-hero">
        <p class="si-panel-eyebrow">Community Safety Platform</p>
        <h2 class="si-panel-headline">
          Good to have<br/>
          <em>you back.</em>
        </h2>
        <p class="si-panel-desc">
          Your community is counting on you. Sign in to check live alerts, review recent reports, and keep your neighbourhood safe.
        </p>
      </div>

      <ul class="si-features">
        <li class="si-feature">
          <div class="si-feature-icon"><MapPin size={16} /></div>
          <div>
            <strong>Live Incident Map</strong>
            <span>See what's happening near you right now</span>
          </div>
        </li>
        <li class="si-feature">
          <div class="si-feature-icon"><Bell size={16} /></div>
          <div>
            <strong>Instant Alerts</strong>
            <span>Get notified when safety events occur nearby</span>
          </div>
        </li>
        <li class="si-feature">
          <div class="si-feature-icon"><Users size={16} /></div>
          <div>
            <strong>Trusted Community</strong>
            <span>Verified neighbours, reliable reports</span>
          </div>
        </li>
      </ul>

      <div class="si-social-proof">
        <div class="si-avatars">
          {#each ['var(--secondary-color)','#a78bfa','#8b5cf6','var(--primary-color)'] as color}
            <div class="si-avatar" style="background:{color}"></div>
          {/each}
        </div>
        <p><strong>12,400+</strong> members keeping communities safe</p>
      </div>

    </div>
    <div class="si-panel-glow"></div>
  </aside>

  <!-- ── RIGHT / FORM ── -->
  <main class="si-main">
    <div class="si-form-shell">

      <!-- Mobile logo -->
      <div class="si-mobile-logo">
        <a href="/" class="si-logo-link">
          <img src="/icons/lz_ico.png" alt="Lezie" class="si-logo-img si-logo-img--mobile" />
        </a>
      </div>

      <!-- Header -->
      <div class="si-form-header">
        <h1 class="si-form-title">Welcome back</h1>
        <p class="si-form-subtitle">Sign in to your Lezie account</p>
      </div>

      <!-- Card -->
      <div class="si-card">

        {#if errors.submit}
          <div class="si-alert-error">
            <AlertCircle size={18} />
            <span>{errors.submit}</span>
          </div>
        {/if}

        <!-- Step indicator dots -->
        <div class="si-steps">
          <div class="si-step-dot {step !== 'identifier' ? 'done' : 'active'}"></div>
          <div class="si-step-line {step !== 'identifier' ? 'filled' : ''}"></div>
          <div class="si-step-dot {step !== 'identifier' ? 'active' : ''}"></div>
        </div>

        <!-- IDENTIFIER STEP (Email / Username / Phone) -->
        {#if step === 'identifier'}
          <div class="si-step-body" style="animation: stepIn .3s ease both">
            <p class="si-step-label">Step 1 of 2 — Enter your email, username, or phone</p>
            <form onsubmit={handleIdentifierSubmit}>
              <div class="si-field">
                <label class="si-label" for="identifier">Email / Username / Phone <span class="si-req">*</span></label>
                <div class="si-input-wrap">
                  <Mail size={16} class="si-input-icon" />
                  <input
                    type="text"
                    id="identifier"
                    placeholder="you@example.com, username, or +1234567890"
                    bind:value={formData.identifier}
                    class="si-input {errors.identifier ? 'si-input--err' : ''}"
                    autocomplete="username"
                  />
                </div>
                {#if errors.identifier}<p class="si-err">{errors.identifier}</p>{/if}
              </div>

              <div class="si-actions">
                <button type="submit" disabled={isLoading} class="si-btn-next">
                  {#if isLoading}
                    <span class="si-spinner"></span> Verifying…
                  {:else}
                    Continue <ArrowRight size={15} />
                  {/if}
                </button>
              </div>
            </form>
          </div>
        {/if}

        <!-- PASSWORD STEP -->
        {#if step === 'password'}
          <div class="si-step-body" style="animation: stepIn .3s ease both">
            <p class="si-step-label">Step 2 of 2 — Enter your password</p>

            <!-- Identifier badge -->
            <div class="si-email-badge">
              <svelte:component this={getIdentifierIcon()} size={14} class="si-badge-icon" />
              <span class="si-badge-email">{formData.identifier}</span>
              <button type="button" class="si-badge-edit" onclick={goBackToIdentifier}>Edit</button>
            </div>

            <!-- Auth method switcher -->
            <div class="si-auth-switch">
              <button 
                type="button" 
                class="si-auth-method {authMethod === 'password' ? 'active' : ''}"
                onclick={() => switchAuthMethod('password')}
              >
                <Lock size={14} />
                <span>Password</span>
              </button>
              <button 
                type="button" 
                class="si-auth-method {authMethod === 'pin' ? 'active' : ''}"
                onclick={() => switchAuthMethod('pin')}
              >
                <Key size={14} />
                <span>PIN</span>
              </button>
              {#if window.PublicKeyCredential}
                <button 
                  type="button" 
                  class="si-auth-method {authMethod === 'passkey' ? 'active' : ''}"
                  onclick={() => switchAuthMethod('passkey')}
                >
                  <Fingerprint size={14} />
                  <span>Passkey</span>
                </button>
              {/if}
            </div>

            <form onsubmit={handlePasswordSubmit}>
              <div class="si-field">
                <div class="si-label-row">
                  <label class="si-label" for="password">Password <span class="si-req">*</span></label>
                  <a href="/forgot-password" class="si-link si-forgot">Forgot password?</a>
                </div>
                <div class="si-input-wrap">
                  <Lock size={16} class="si-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    bind:value={formData.password}
                    class="si-input si-input--toggle {errors.password ? 'si-input--err' : ''}"
                    autocomplete="current-password"
                  />
                  <button type="button" class="si-eye-btn" onclick={() => showPassword = !showPassword} aria-label="Toggle password">
                    {#if showPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
                  </button>
                </div>
                {#if errors.password}<p class="si-err">{errors.password}</p>{/if}
              </div>

              <label class="si-remember">
                <input type="checkbox" bind:checked={formData.rememberMe} class="si-checkbox" />
                <span>Remember me for 30 days</span>
              </label>

              <div class="si-actions">
                <button type="button" class="si-btn-back" onclick={goBackToIdentifier}>
                  <ArrowLeft size={15} /> Back
                </button>
                <button type="submit" disabled={isLoading} class="si-btn-next">
                  {#if isLoading}
                    <span class="si-spinner"></span> Signing in…
                  {:else}
                    Sign In <ArrowRight size={15} />
                  {/if}
                </button>
              </div>
            </form>
          </div>
        {/if}

        <!-- PIN STEP -->
        {#if step === 'pin'}
          <div class="si-step-body" style="animation: stepIn .3s ease both">
            <p class="si-step-label">Step 2 of 2 — Enter your PIN</p>

            <!-- Identifier badge -->
            <div class="si-email-badge">
              <svelte:component this={getIdentifierIcon()} size={14} class="si-badge-icon" />
              <span class="si-badge-email">{formData.identifier}</span>
              <button type="button" class="si-badge-edit" onclick={goBackToIdentifier}>Edit</button>
            </div>

            <!-- Auth method switcher -->
            <div class="si-auth-switch">
              <button 
                type="button" 
                class="si-auth-method {authMethod === 'password' ? 'active' : ''}"
                onclick={() => switchAuthMethod('password')}
              >
                <Lock size={14} />
                <span>Password</span>
              </button>
              <button 
                type="button" 
                class="si-auth-method {authMethod === 'pin' ? 'active' : ''}"
                onclick={() => switchAuthMethod('pin')}
              >
                <Key size={14} />
                <span>PIN</span>
              </button>
              {#if window.PublicKeyCredential}
                <button 
                  type="button" 
                  class="si-auth-method {authMethod === 'passkey' ? 'active' : ''}"
                  onclick={() => switchAuthMethod('passkey')}
                >
                  <Fingerprint size={14} />
                  <span>Passkey</span>
                </button>
              {/if}
            </div>

            <form onsubmit={handlePinSubmit}>
              <div class="si-field">
                <div class="si-label-row">
                  <label class="si-label" for="pin">PIN <span class="si-req">*</span></label>
                  <a href="/forgot-pin" class="si-link si-forgot">Forgot PIN?</a>
                </div>
                <div class="si-input-wrap">
                  <Key size={16} class="si-input-icon" />
                  <input
                    type="password"
                    id="pin"
                    placeholder="Enter your 4-6 digit PIN"
                    bind:value={formData.pin}
                    maxlength="6"
                    pattern="\d*"
                    inputmode="numeric"
                    class="si-input {errors.pin ? 'si-input--err' : ''}"
                    autocomplete="off"
                  />
                </div>
                {#if errors.pin}<p class="si-err">{errors.pin}</p>{/if}
              </div>

              <label class="si-remember">
                <input type="checkbox" bind:checked={formData.rememberMe} class="si-checkbox" />
                <span>Remember me for 30 days</span>
              </label>

              <div class="si-actions">
                <button type="button" class="si-btn-back" onclick={goBackToIdentifier}>
                  <ArrowLeft size={15} /> Back
                </button>
                <button type="submit" disabled={isLoading} class="si-btn-next">
                  {#if isLoading}
                    <span class="si-spinner"></span> Verifying PIN…
                  {:else}
                    Sign In with PIN <ArrowRight size={15} />
                  {/if}
                </button>
              </div>
            </form>
          </div>
        {/if}

        <!-- PASSKEY STEP -->
        {#if step === 'passkey'}
          <div class="si-step-body" style="animation: stepIn .3s ease both">
            <p class="si-step-label">Step 2 of 2 — Authenticate with passkey</p>

            <!-- Identifier badge -->
            <div class="si-email-badge">
              <svelte:component this={getIdentifierIcon()} size={14} class="si-badge-icon" />
              <span class="si-badge-email">{formData.identifier}</span>
              <button type="button" class="si-badge-edit" onclick={goBackToIdentifier}>Edit</button>
            </div>

            <!-- Auth method switcher -->
            <div class="si-auth-switch">
              <button 
                type="button" 
                class="si-auth-method {authMethod === 'password' ? 'active' : ''}"
                onclick={() => switchAuthMethod('password')}
              >
                <Lock size={14} />
                <span>Password</span>
              </button>
              <button 
                type="button" 
                class="si-auth-method {authMethod === 'pin' ? 'active' : ''}"
                onclick={() => switchAuthMethod('pin')}
              >
                <Key size={14} />
                <span>PIN</span>
              </button>
              {#if window.PublicKeyCredential}
                <button 
                  type="button" 
                  class="si-auth-method {authMethod === 'passkey' ? 'active' : ''}"
                  onclick={() => switchAuthMethod('passkey')}
                >
                  <Fingerprint size={14} />
                  <span>Passkey</span>
                </button>
              {/if}
            </div>

            <form onsubmit={handlePasskeySubmit}>
              <div class="si-passkey-prompt">
                <div class="si-passkey-icon">
                  <Fingerprint size={48} />
                </div>
                <p class="si-passkey-text">
                  Use your device's fingerprint, face recognition, or screen lock to sign in
                </p>
                <p class="si-passkey-hint">
                  Your passkey is stored securely on this device
                </p>
              </div>

              <label class="si-remember">
                <input type="checkbox" bind:checked={formData.rememberMe} class="si-checkbox" />
                <span>Remember me for 30 days</span>
              </label>

              <div class="si-actions">
                <button type="button" class="si-btn-back" onclick={goBackToIdentifier}>
                  <ArrowLeft size={15} /> Back
                </button>
                <button type="submit" disabled={isLoading} class="si-btn-next si-btn-passkey">
                  {#if isLoading}
                    <span class="si-spinner"></span> Authenticating…
                  {:else}
                    <Fingerprint size={16} /> Use Passkey
                  {/if}
                </button>
              </div>
            </form>
          </div>
        {/if}

      </div>

      <!-- Footer -->
      <p class="si-footer-text">
        Don't have an account? <a href="/signup" class="si-link">Create account</a>
      </p>

    </div>
  </main>
</div>

<style>
  :global(.si-page *) {
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  /* ── Layout ── */
  .si-page {
    display: flex;
    min-height: 100vh;
    background: var(--light-color);
  }

  /* ── LEFT PANEL ── */
  .si-panel {
    display: none;
    position: relative;
    width: 420px;
    flex-shrink: 0;
    background: linear-gradient(160deg, var(--primary-color) 0%, var(--primary-dark) 40%, var(--primary-dark) 100%);
    overflow: hidden;
  }

  @media (min-width: 1024px) {
    .si-panel { display: flex; }
  }

  .si-panel-inner {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    padding: 2.5rem;
    height: 100%;
  }

  .si-panel-glow {
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      radial-gradient(ellipse 60% 40% at 80% 20%, rgba(167,139,250,0.25) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 20% 80%, rgba(109,40,217,0.4) 0%, transparent 60%);
    pointer-events: none;
  }

  /* ── Logo ── */
  .si-logo-link {
    display: inline-block;
    line-height: 0;
    margin-bottom: 2.5rem;
    transition: opacity 0.2s;
  }

  .si-logo-link:hover { opacity: 0.85; }

  .si-logo-img--desktop {
    width: 80px;
    height: 80px;
    object-fit: contain;
    display: block;
  }

  .si-logo-img--mobile {
    width: 96px;
    height: 96px;
    object-fit: contain;
    display: block;
  }

  /* ── Panel copy ── */
  .si-panel-eyebrow {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(196,181,253,0.9);
    margin-bottom: 0.875rem;
  }

  .si-panel-headline {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 2.5rem;
    line-height: 1.15;
    color: white;
    margin-bottom: 1rem;
  }

  .si-panel-headline em {
    color: var(--secondary-color);
    font-style: italic;
  }

  .si-panel-desc {
    font-size: 0.875rem;
    line-height: 1.7;
    color: rgba(221,214,254,0.85);
    margin-bottom: 2.5rem;
  }

  /* Features */
  .si-features {
    list-style: none;
    padding: 0;
    margin: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
  }

  .si-feature {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
  }

  .si-feature-icon {
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ddd6fe;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .si-feature strong {
    display: block;
    font-size: 0.813rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.125rem;
  }

  .si-feature span {
    font-size: 0.75rem;
    color: rgba(196,181,253,0.8);
    line-height: 1.5;
  }

  /* Social proof */
  .si-social-proof {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.12);
  }

  .si-avatars { display: flex; }

  .si-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid var(--primary-dark);
    margin-left: -8px;
  }

  .si-avatar:first-child { margin-left: 0; }

  .si-social-proof p {
    font-size: 0.75rem;
    color: rgba(221,214,254,0.9);
    line-height: 1.4;
  }

  .si-social-proof strong { color: white; font-weight: 600; }

  /* ── RIGHT / MAIN ── */
  .si-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.25rem;
    min-height: 100vh;
  }

  .si-form-shell {
    width: 100%;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Mobile logo */
  .si-mobile-logo {
    display: flex;
    justify-content: center;
  }

  .si-mobile-logo .si-logo-link { margin-bottom: 0; }

  @media (min-width: 1024px) {
    .si-mobile-logo { display: none; }
  }

  /* Header */
  .si-form-header { text-align: center; }

  .si-form-title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(1.625rem, 4vw, 2rem);
    color: var(--dark-color);
    margin-bottom: 0.25rem;
    letter-spacing: -0.02em;
  }

  .si-form-subtitle {
    font-size: 0.875rem;
    color: var(--gray-color);
  }

  /* Card */
  .si-card {
    background: white;
    border-radius: 1.5rem;
    border: 1px solid #e2e8f0;
    padding: clamp(1.25rem, 5vw, 2rem);
    box-shadow:
      0 1px 2px rgba(0,0,0,0.04),
      0 4px 16px rgba(0,0,0,0.06),
      0 16px 48px rgba(0,0,0,0.04);
  }

  /* Step dots */
  .si-steps {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .si-step-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e2e8f0;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .si-step-dot.active {
    background: var(--primary-color);
    width: 24px;
    border-radius: 4px;
    box-shadow: 0 0 0 3px rgba(106,44,145,0.15);
  }

  .si-step-dot.done {
    background: var(--success-color);
  }

  .si-step-line {
    flex: 1;
    height: 2px;
    background: #e2e8f0;
    border-radius: 1px;
    transition: background 0.4s ease;
  }

  .si-step-line.filled { background: var(--primary-color); }

  /* Step label */
  .si-step-label {
    font-size: 0.75rem;
    color: var(--gray-color);
    margin-bottom: 1.25rem;
    font-weight: 500;
  }

  /* Alert */
  .si-alert-error {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.75rem;
    color: var(--danger-color);
    font-size: 0.813rem;
    margin-bottom: 1.25rem;
  }

  /* Identifier badge */
  .si-email-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    border-radius: 0.75rem;
    margin-bottom: 1.25rem;
  }

  :global(.si-badge-icon) { color: var(--primary-color); flex-shrink: 0; }

  .si-badge-email {
    font-size: 0.813rem;
    font-weight: 500;
    color: var(--dark-color);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .si-badge-edit {
    background: none;
    border: none;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--primary-color);
    cursor: pointer;
    padding: 0.125rem 0.375rem;
    border-radius: 0.375rem;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s;
    flex-shrink: 0;
  }

  .si-badge-edit:hover { background: rgba(106,44,145,0.08); }

  /* Auth method switcher */
  .si-auth-switch {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .si-auth-method {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--gray-color);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }

  .si-auth-method:hover {
    background: var(--primary-bg);
    color: var(--primary-color);
  }

  .si-auth-method.active {
    background: var(--primary-color);
    color: white;
  }

  /* Fields */
  .si-step-body {
    display: flex;
    flex-direction: column;
  }

  .si-field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-bottom: 1.125rem;
  }

  .si-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .si-label {
    font-size: 0.813rem;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.01em;
  }

  .si-req { color: var(--primary-color); }

  .si-forgot {
    font-size: 0.75rem;
  }

  .si-input-wrap { position: relative; }

  :global(.si-input-icon) {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }

  .si-input {
    width: 100%;
    padding: 0.75rem 0.875rem 0.75rem 2.625rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    color: var(--dark-color);
    background: var(--light-color);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
    -webkit-appearance: none;
  }

  .si-input:hover { border-color: var(--primary-border); background: white; }
  .si-input:focus {
    border-color: var(--primary-color);
    background: white;
    box-shadow: 0 0 0 3px rgba(106,44,145,0.1);
  }
  .si-input--err { border-color: #f87171; background: #fff5f5; }
  .si-input--toggle { padding-right: 2.75rem; }

  .si-eye-btn {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    display: flex;
    padding: 0.25rem;
    transition: color 0.2s;
  }

  .si-eye-btn:hover { color: var(--primary-color); }

  .si-err {
    font-size: 0.75rem;
    color: var(--danger-color);
  }

  /* Passkey prompt */
  .si-passkey-prompt {
    text-align: center;
    padding: 1.5rem 1rem;
    margin-bottom: 1.125rem;
    background: var(--primary-bg);
    border-radius: 1rem;
    border: 1px solid var(--primary-border);
  }

  .si-passkey-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
  }

  .si-passkey-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  .si-passkey-hint {
    font-size: 0.688rem;
    color: var(--gray-color);
  }

  /* Remember me */
  .si-remember {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.813rem;
    color: #4b5563;
    cursor: pointer;
    margin-bottom: 1.125rem;
  }

  .si-checkbox {
    width: 16px;
    height: 16px;
    accent-color: var(--primary-color);
    cursor: pointer;
    flex-shrink: 0;
  }

  /* Actions */
  .si-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-top: 0.25rem;
  }

  .si-btn-back {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.75rem 1.125rem;
    background: white;
    border: 1.5px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--gray-color);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .si-btn-back:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: var(--primary-bg);
  }

  .si-btn-next {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8125rem 1.25rem;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.9375rem;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(106,44,145,0.3);
    transition: all 0.2s;
  }

  .si-btn-next:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(106,44,145,0.4);
  }

  .si-btn-next:active:not(:disabled) { transform: translateY(0); }
  .si-btn-next:disabled { opacity: 0.65; cursor: not-allowed; }

  .si-btn-passkey {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  }

  /* Link */
  .si-link {
    color: var(--primary-color);
    font-weight: 500;
    text-decoration: none;
  }

  .si-link:hover { text-decoration: underline; }

  /* Footer */
  .si-footer-text {
    text-align: center;
    font-size: 0.875rem;
    color: var(--gray-color);
  }

  /* Spinner */
  .si-spinner {
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
    from { opacity: 0; transform: translateX(12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .si-main { padding: 1.5rem 1rem; align-items: flex-start; }
    .si-form-shell { gap: 1.25rem; }
    .si-card { border-radius: 1.25rem; }
    .si-actions { flex-direction: column-reverse; }
    .si-btn-back { width: 100%; justify-content: center; }
    .si-btn-next { width: 100%; }
    .si-auth-switch { flex-wrap: wrap; }
    .si-auth-method { flex: none; width: calc(33.33% - 0.34rem); }
  }
</style>