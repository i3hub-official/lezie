<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff,
    User,
    Phone,
    Calendar,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    Check,
    UserRound,
    Shield,
    MapPin,
    Users,
    Bell
  } from 'lucide-svelte';
  
  let currentStep = $state(1);
  let formData = $state({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  let errors = $state<Record<string, string>>({});
  let isLoading = $state(false);
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);

  const steps = [
    { number: 1, label: 'Personal', icon: UserRound },
    { number: 2, label: 'Contact', icon: Mail },
    { number: 3, label: 'Security', icon: Shield },
  ];

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (formData.firstName.length < 2) newErrors.firstName = 'At least 2 characters';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (formData.lastName.length < 2) newErrors.lastName = 'At least 2 characters';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    else {
      const age = calculateAge(new Date(formData.dateOfBirth));
      if (age < 13) newErrors.dateOfBirth = 'You must be at least 13 years old';
    }
    return newErrors;
  };
  
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone))
      newErrors.phone = 'Please enter a valid phone number';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address';
    return newErrors;
  };
  
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'At least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = 'Must contain uppercase, lowercase, and number';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };
  
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };
  
  const handleNextStep = (e: Event) => {
    e.preventDefault();
    let stepErrors = currentStep === 1 ? validateStep1() : validateStep2();
    if (Object.keys(stepErrors).length === 0) {
      currentStep++;
      errors = {};
    } else {
      errors = stepErrors;
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 1) { currentStep--; errors = {}; }
  };
  
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const validationErrors = validateStep3();
    if (Object.keys(validationErrors).length > 0) { errors = validationErrors; return; }
    isLoading = true;
    errors = {};
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Signup failed');
      await authStore.login(formData.email, formData.password);
      goto('/dashboard');
    } catch (error: unknown) {
      errors.submit = error instanceof Error ? error.message : 'An error occurred';
    } finally {
      isLoading = false;
    }
  };

  const passwordStrength = $derived(() => {
    if (!formData.password) return 0;
    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(formData.password)) score++;
    if (/(?=.*[A-Z])/.test(formData.password)) score++;
    if (/(?=.*\d)/.test(formData.password)) score++;
    if (/(?=.*[^a-zA-Z0-9])/.test(formData.password)) score++;
    return score;
  });

  const strengthLabel = $derived(() => {
    const s = passwordStrength();
    if (s <= 1) return { text: 'Weak', color: 'var(--danger-color)' };
    if (s <= 2) return { text: 'Fair', color: '#f59e0b' };
    if (s <= 3) return { text: 'Good', color: '#3b82f6' };
    return { text: 'Strong', color: 'var(--success-color)' };
  });
</script>

<svelte:head>
  <title>Sign Up - Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="su-page">

  <!-- ── LEFT PANEL (desktop only) ── -->
  <aside class="su-panel">
    <div class="su-panel-inner">
      <a href="/" class="su-logo-link">
        <img src="/icons/lz_ico.png" alt="Lezie" class="su-logo-img" />
      </a>

      <div class="su-panel-hero">
        <p class="su-panel-eyebrow">Community Safety Platform</p>
        <h2 class="su-panel-headline">
          Safer streets start<br/>
          <em>with you.</em>
        </h2>
        <p class="su-panel-desc">
          Join thousands of neighbours already using Lezie to report incidents, share alerts, and protect their communities in real-time.
        </p>
      </div>

      <ul class="su-features">
        <li class="su-feature">
          <div class="su-feature-icon">
            <MapPin size={16} />
          </div>
          <div>
            <strong>Live Incident Map</strong>
            <span>See what's happening near you right now</span>
          </div>
        </li>
        <li class="su-feature">
          <div class="su-feature-icon">
            <Bell size={16} />
          </div>
          <div>
            <strong>Instant Alerts</strong>
            <span>Get notified when safety events occur nearby</span>
          </div>
        </li>
        <li class="su-feature">
          <div class="su-feature-icon">
            <Users size={16} />
          </div>
          <div>
            <strong>Trusted Community</strong>
            <span>Verified neighbours, reliable reports</span>
          </div>
        </li>
      </ul>

      <div class="su-social-proof">
        <div class="su-avatars">
          {#each ['var(--secondary-color)','#a78bfa','#8b5cf6','var(--primary-color)'] as color}
            <div class="su-avatar" style="background:{color}"></div>
          {/each}
        </div>
        <p><strong>12,400+</strong> members keeping communities safe</p>
      </div>
    </div>
    <div class="su-panel-glow"></div>
  </aside>

  <!-- ── RIGHT PANEL / FORM ── -->
  <main class="su-main">
    <div class="su-form-shell">

      <!-- Logo -->
      <div class="su-mobile-brand">
        <a href="/" class="su-logo-link">
          <img src="/icons/lz_ico.png" alt="Lezie" class="su-logo-img" />
        </a>
      </div>

      <!-- Header -->
      <div class="su-form-header">
        <h1 class="su-form-title">Create your account</h1>
        <p class="su-form-subtitle">Step {currentStep} of 3 — {steps[currentStep - 1].label} details</p>
      </div>

      <!-- Progress -->
      <div class="su-progress-track">
        {#each steps as step}
          <div class="su-progress-step {currentStep >= step.number ? 'active' : ''} {currentStep > step.number ? 'done' : ''}">
            <div class="su-step-bubble">
              {#if currentStep > step.number}
                <Check size={14} strokeWidth={3} />
              {:else}
                <svelte:component this={step.icon} size={14} />
              {/if}
            </div>
            <span class="su-step-label">{step.label}</span>
            {#if step.number < 3}
              <div class="su-step-connector {currentStep > step.number ? 'filled' : ''}"></div>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Form Card -->
      <div class="su-card">
        {#if errors.submit}
          <div class="su-alert-error">
            <AlertCircle size={18} />
            <span>{errors.submit}</span>
          </div>
        {/if}

        <form onsubmit={currentStep === 3 ? handleSubmit : handleNextStep}>

          <!-- STEP 1 -->
          {#if currentStep === 1}
            <div class="su-step-body" style="animation: stepIn .35s ease both">
              <div class="su-field-row">
                <div class="su-field">
                  <label class="su-label" for="firstName">First Name <span class="su-req">*</span></label>
                  <div class="su-input-wrap">
                    <User size={16} class="su-input-icon" />
                    <input
                      type="text"
                      id="firstName"
                      placeholder="John"
                      bind:value={formData.firstName}
                      class="su-input {errors.firstName ? 'su-input--err' : ''}"
                    />
                  </div>
                  {#if errors.firstName}<p class="su-err">{errors.firstName}</p>{/if}
                </div>
                <div class="su-field">
                  <label class="su-label" for="lastName">Last Name <span class="su-req">*</span></label>
                  <div class="su-input-wrap">
                    <User size={16} class="su-input-icon" />
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Doe"
                      bind:value={formData.lastName}
                      class="su-input {errors.lastName ? 'su-input--err' : ''}"
                    />
                  </div>
                  {#if errors.lastName}<p class="su-err">{errors.lastName}</p>{/if}
                </div>
              </div>

              <div class="su-field">
                <label class="su-label" for="dateOfBirth">Date of Birth <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <Calendar size={16} class="su-input-icon" />
                  <input
                    type="date"
                    id="dateOfBirth"
                    bind:value={formData.dateOfBirth}
                    class="su-input su-input--date {errors.dateOfBirth ? 'su-input--err' : ''}"
                  />
                </div>
                {#if errors.dateOfBirth}<p class="su-err">{errors.dateOfBirth}</p>
                {:else}<p class="su-hint">You must be at least 13 years old to join</p>{/if}
              </div>
            </div>
          {/if}

          <!-- STEP 2 -->
          {#if currentStep === 2}
            <div class="su-step-body" style="animation: stepIn .35s ease both">
              <div class="su-field">
                <label class="su-label" for="phone">Phone Number <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <Phone size={16} class="su-input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+1 (234) 567-8900"
                    bind:value={formData.phone}
                    class="su-input {errors.phone ? 'su-input--err' : ''}"
                  />
                </div>
                {#if errors.phone}<p class="su-err">{errors.phone}</p>
                {:else}<p class="su-hint">Used for critical safety alerts in your area</p>{/if}
              </div>

              <div class="su-field">
                <label class="su-label" for="email">Email Address <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <Mail size={16} class="su-input-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    bind:value={formData.email}
                    class="su-input {errors.email ? 'su-input--err' : ''}"
                  />
                </div>
                {#if errors.email}<p class="su-err">{errors.email}</p>
                {:else}<p class="su-hint">We'll send a verification link to this address</p>{/if}
              </div>
            </div>
          {/if}

          <!-- STEP 3 -->
          {#if currentStep === 3}
            <div class="su-step-body" style="animation: stepIn .35s ease both">
              <div class="su-field">
                <label class="su-label" for="password">Password <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <Lock size={16} class="su-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Create a strong password"
                    bind:value={formData.password}
                    class="su-input su-input--toggle {errors.password ? 'su-input--err' : ''}"
                  />
                  <button type="button" class="su-eye-btn" onclick={() => showPassword = !showPassword} aria-label="Toggle password">
                    {#if showPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
                  </button>
                </div>
                {#if errors.password}
                  <p class="su-err">{errors.password}</p>
                {:else if formData.password}
                  <div class="su-strength">
                    <div class="su-strength-bars">
                      {#each [1,2,3,4] as n}
                        <div class="su-strength-bar {passwordStrength() >= n ? 'lit' : ''}"
                          style={passwordStrength() >= n ? `background:${strengthLabel().color}` : ''}
                        ></div>
                      {/each}
                    </div>
                    <span class="su-strength-label" style="color:{strengthLabel().color}">{strengthLabel().text}</span>
                  </div>
                  <div class="su-hints">
                    <span class={formData.password.length >= 8 ? 'su-hint-ok' : 'su-hint-no'}>8+ chars</span>
                    <span class={/(?=.*[A-Z])/.test(formData.password) ? 'su-hint-ok' : 'su-hint-no'}>Uppercase</span>
                    <span class={/(?=.*[a-z])/.test(formData.password) ? 'su-hint-ok' : 'su-hint-no'}>Lowercase</span>
                    <span class={/(?=.*\d)/.test(formData.password) ? 'su-hint-ok' : 'su-hint-no'}>Number</span>
                  </div>
                {/if}
              </div>

              <div class="su-field">
                <label class="su-label" for="confirmPassword">Confirm Password <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <Lock size={16} class="su-input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder="Repeat your password"
                    bind:value={formData.confirmPassword}
                    class="su-input su-input--toggle {errors.confirmPassword ? 'su-input--err' : ''}"
                  />
                  <button type="button" class="su-eye-btn" onclick={() => showConfirmPassword = !showConfirmPassword} aria-label="Toggle confirm password">
                    {#if showConfirmPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
                  </button>
                </div>
                {#if errors.confirmPassword}
                  <p class="su-err">{errors.confirmPassword}</p>
                {:else if formData.confirmPassword && formData.password === formData.confirmPassword}
                  <p class="su-hint su-hint--ok">
                    <Check size={13} /> Passwords match
                  </p>
                {/if}
              </div>

              <div class="su-terms">
                <input type="checkbox" id="terms" class="su-checkbox" required />
                <label for="terms">
                  I agree to the <a href="/terms" class="su-link">Terms of Service</a> and <a href="/privacy" class="su-link">Privacy Policy</a>
                </label>
              </div>
            </div>
          {/if}

          <!-- Actions -->
          <div class="su-actions">
            {#if currentStep > 1}
              <button type="button" class="su-btn-back" onclick={handlePreviousStep}>
                <ArrowLeft size={15} /> Back
              </button>
            {/if}
            <button type="submit" disabled={isLoading} class="su-btn-next {currentStep === 1 ? 'su-btn-next--full' : ''}">
              {#if isLoading}
                <span class="su-spinner"></span> Creating account…
              {:else if currentStep === 3}
                Create Account <ArrowRight size={15} />
              {:else}
                Continue <ArrowRight size={15} />
              {/if}
            </button>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <p class="su-footer-text">
        Already have an account? <a href="/auth/signin" class="su-link">Sign in</a>
      </p>
    </div>
  </main>
</div>

<style>
  /* ── Fonts ── */
  :global(.su-page *) {
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  /* ── Layout ── */
  .su-page {
    display: flex;
    min-height: 100vh;
    background: var(--light-color);
  }

  /* ── LEFT PANEL ── */
  .su-panel {
    display: none;
    position: relative;
    width: 420px;
    flex-shrink: 0;
    background: linear-gradient(160deg, var(--primary-dark) 0%, var(--primary-dark) 40%, var(--primary-dark) 100%);
    overflow: hidden;
  }

  @media (min-width: 1024px) {
    .su-panel { display: flex; }
  }

  .su-panel-inner {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    padding: 2.5rem;
    height: 100%;
  }

  .su-panel-glow {
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      radial-gradient(ellipse 60% 40% at 80% 20%, rgba(167,139,250,0.25) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 20% 80%, rgba(109,40,217,0.4) 0%, transparent 60%);
    pointer-events: none;
  }

  /* Brand */
  .su-logo-link {
    display: inline-block;
    line-height: 0;
    margin-bottom: 2.5rem;
    transition: opacity 0.2s;
  }

  .su-logo-link:hover { opacity: 0.85; }

  .su-logo-img {
                width: 80px;
  height: 80px;
  object-fit: contain;
  }

  /* Panel copy */
  .su-panel-eyebrow {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(196,181,253,0.9);
    margin-bottom: 0.875rem;
  }

  .su-panel-headline {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 2.5rem;
    line-height: 1.15;
    color: white;
    margin-bottom: 1rem;
  }

  .su-panel-headline em {
    color: var(--secondary-color);
    font-style: italic;
  }

  .su-panel-desc {
    font-size: 0.875rem;
    line-height: 1.7;
    color: rgba(221,214,254,0.85);
    margin-bottom: 2.5rem;
  }

  /* Features */
  .su-features {
    list-style: none;
    padding: 0;
    margin: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
  }

  .su-feature {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
  }

  .su-feature-icon {
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-border);
    flex-shrink: 0;
    margin-top: 1px;
  }

  .su-feature strong {
    display: block;
    font-size: 0.813rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.125rem;
  }

  .su-feature span {
    font-size: 0.75rem;
    color: rgba(196,181,253,0.8);
    line-height: 1.5;
  }

  /* Social proof */
  .su-social-proof {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.12);
  }

  .su-avatars {
    display: flex;
  }

  .su-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid var(--primary-dark);
    margin-left: -8px;
  }

  .su-avatar:first-child { margin-left: 0; }

  .su-social-proof p {
    font-size: 0.75rem;
    color: rgba(221,214,254,0.9);
    line-height: 1.4;
  }

  .su-social-proof strong {
    color: white;
    font-weight: 600;
  }

  /* ── RIGHT / MAIN ── */
  .su-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.25rem;
    min-height: 100vh;
  }

  .su-form-shell {
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Logo (hidden on desktop — panel has it) */
  .su-mobile-brand {
    display: flex;
    justify-content: center;
  }

  .su-mobile-brand .su-logo-link {
    margin-bottom: 0;
  }

  .su-mobile-brand .su-logo-img {
                width: 96px;
  height: 96px;
  }

  @media (min-width: 1024px) {
    .su-mobile-brand { display: none; }
  }

  /* Header */
  .su-form-header {
    text-align: center;
  }

  .su-form-title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(1.625rem, 4vw, 2rem);
    color: var(--dark-color);
    margin-bottom: 0.25rem;
    letter-spacing: -0.02em;
  }

  .su-form-subtitle {
    font-size: 0.875rem;
    color: #64748b;
  }

  /* Progress */
  .su-progress-track {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
  }

  .su-progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    position: relative;
  }

  .su-step-connector {
    position: absolute;
    top: 18px;
    left: calc(100% + 1px);
    width: 72px;
    height: 2px;
    background: #e2e8f0;
    transition: background 0.4s ease;
  }

  .su-step-connector.filled {
    background: var(--primary-color);
  }

  .su-step-bubble {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    border: 2px solid #e2e8f0;
    color: #94a3b8;
    font-size: 0.813rem;
    font-weight: 600;
    transition: all 0.35s ease;
    z-index: 1;
  }

  .su-progress-step.active .su-step-bubble {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
    box-shadow: 0 0 0 4px rgba(106,44,145,0.15);
  }

  .su-progress-step.done .su-step-bubble {
    background: var(--success-color);
    border-color: var(--success-color);
    color: white;
    box-shadow: none;
  }

  .su-step-label {
    font-size: 0.688rem;
    font-weight: 500;
    color: #94a3b8;
    letter-spacing: 0.02em;
    transition: color 0.3s;
  }

  .su-progress-step.active .su-step-label { color: var(--primary-color); font-weight: 600; }
  .su-progress-step.done .su-step-label { color: var(--success-color); }

  /* Spacing around connector */
  .su-progress-step:not(:last-child) {
    margin-right: 74px;
  }

  /* Card */
  .su-card {
    background: white;
    border-radius: 1.5rem;
    border: 1px solid #e2e8f0;
    padding: clamp(1.25rem, 5vw, 2rem);
    box-shadow:
      0 1px 2px rgba(0,0,0,0.04),
      0 4px 16px rgba(0,0,0,0.06),
      0 16px 48px rgba(0,0,0,0.04);
  }

  /* Alert */
  .su-alert-error {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.75rem;
    color: #dc2626;
    font-size: 0.813rem;
    margin-bottom: 1.5rem;
  }

  /* Fields */
  .su-step-body {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
  }

  .su-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.875rem;
  }

  @media (max-width: 480px) {
    .su-field-row { grid-template-columns: 1fr; }
  }

  .su-field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .su-label {
    font-size: 0.813rem;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.01em;
  }

  .su-req { color: var(--primary-color); }

  .su-input-wrap {
    position: relative;
  }

  :global(.su-input-icon) {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }

  .su-input {
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

  .su-input:hover { border-color: var(--secondary-color); background: white; }
  .su-input:focus {
    border-color: var(--primary-color);
    background: white;
    box-shadow: 0 0 0 3px rgba(106,44,145,0.1);
  }
  .su-input--err {
    border-color: #f87171;
    background: #fff5f5;
  }
  .su-input--toggle { padding-right: 2.75rem; }
  .su-input--date { color: #374151; }

  .su-eye-btn {
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

  .su-eye-btn:hover { color: var(--primary-color); }

  .su-err {
    font-size: 0.75rem;
    color: var(--danger-color);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .su-hint {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .su-hint--ok {
    color: var(--success-color);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  /* Strength meter */
  .su-strength {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-top: 0.25rem;
  }

  .su-strength-bars {
    display: flex;
    gap: 3px;
    flex: 1;
  }

  .su-strength-bar {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: #e5e7eb;
    transition: background 0.3s ease;
  }

  .su-strength-label {
    font-size: 0.688rem;
    font-weight: 600;
    min-width: 38px;
    text-align: right;
  }

  /* Hints row */
  .su-hints {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.375rem;
  }

  .su-hint-ok,
  .su-hint-no {
    font-size: 0.688rem;
    font-weight: 500;
    padding: 0.2rem 0.5rem;
    border-radius: 20px;
    transition: all 0.2s;
  }

  .su-hint-ok {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }

  .su-hint-no {
    background: #f8fafc;
    color: #94a3b8;
    border: 1px solid #e2e8f0;
  }

  /* Terms */
  .su-terms {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    margin-top: 0.25rem;
    font-size: 0.813rem;
    color: #4b5563;
    line-height: 1.5;
  }

  .su-checkbox {
    width: 16px;
    height: 16px;
    margin-top: 2px;
    flex-shrink: 0;
    accent-color: var(--primary-color);
    cursor: pointer;
  }

  /* Actions */
  .su-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.75rem;
    align-items: center;
  }

  .su-btn-back {
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

  .su-btn-back:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: var(--primary-bg);
  }

  .su-btn-next {
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

  .su-btn-next:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(106,44,145,0.4);
  }

  .su-btn-next:active:not(:disabled) { transform: translateY(0); }
  .su-btn-next:disabled { opacity: 0.65; cursor: not-allowed; }
  .su-btn-next--full { flex: 1; }

  /* Link */
  .su-link {
    color: var(--primary-color);
    font-weight: 500;
    text-decoration: none;
  }

  .su-link:hover { text-decoration: underline; }

  /* Footer */
  .su-footer-text {
    text-align: center;
    font-size: 0.875rem;
    color: #64748b;
  }

  /* Spinner */
  .su-spinner {
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
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ── Responsive tweaks ── */
  @media (max-width: 640px) {
    .su-main { padding: 1.5rem 1rem; align-items: flex-start; }
    .su-form-shell { gap: 1.25rem; }
    .su-card { border-radius: 1.25rem; }

    /* Compact progress on small screens */
    .su-step-connector { width: 44px; }
    .su-progress-step:not(:last-child) { margin-right: 46px; }
    .su-step-bubble { width: 34px; height: 34px; }

    .su-actions { flex-direction: column-reverse; }
    .su-btn-back { width: 100%; justify-content: center; }
    .su-btn-next { width: 100%; }
  }

  @media (max-width: 380px) {
    .su-step-connector { width: 28px; }
    .su-progress-step:not(:last-child) { margin-right: 30px; }
    .su-step-label { font-size: 0.625rem; }
  }
</style>
