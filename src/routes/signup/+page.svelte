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
    Bell,
    ChevronLeft,
    Home,
    Sparkles,
    ShieldCheck,
    Clock,
    Smartphone,
    Fingerprint
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
  let touched = $state<Record<string, boolean>>({});

  const steps = [
    { number: 1, label: 'Personal', icon: UserRound, description: 'Tell us about yourself' },
    { number: 2, label: 'Contact', icon: Mail, description: 'How to reach you' },
    { number: 3, label: 'Security', icon: Shield, description: 'Protect your account' },
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
      else if (age > 120) newErrors.dateOfBirth = 'Please enter a valid date';
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      errors = stepErrors;
      Object.keys(stepErrors).forEach(key => { touched[key] = true; });
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 1) { 
      currentStep--; 
      errors = {};
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const validationErrors = validateStep3();
    if (Object.keys(validationErrors).length > 0) { 
      errors = validationErrors;
      Object.keys(validationErrors).forEach(key => { touched[key] = true; });
      return; 
    }
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

  const goBackToHome = () => {
    goto('/');
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
    if (s <= 1) return { text: 'Weak', color: '#dc2626', width: '25%' };
    if (s <= 2) return { text: 'Fair', color: '#f59e0b', width: '50%' };
    if (s <= 3) return { text: 'Good', color: '#3b82f6', width: '75%' };
    return { text: 'Strong', color: '#10b981', width: '100%' };
  });

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0,3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,10)}`;
  };

  const handlePhoneInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    formData.phone = formatPhoneNumber(input.value);
  };
</script>

<svelte:head>
  <title>Sign Up - Lezie</title>
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="su-page">

  <!-- ── LEFT PANEL (desktop only) ── -->
  <aside class="su-panel">
    <div class="su-panel-inner">
      <a href="/" class="su-logo-link">
        <img src="/icons/lz_logo_t.png" alt="Lezie" class="su-logo-img" />
      </a>

      <div class="su-panel-hero">
        <div class="su-panel-badge">
          <Sparkles size={14} />
          <span>Join 12,400+ members</span>
        </div>
        <h2 class="su-panel-headline">
          Safer streets start<br/>
          <em>with you.</em>
        </h2>
        <p class="su-panel-desc">
          Join thousands of neighbours already using Lezie to report incidents, share alerts, and protect their communities in real-time.
        </p>
      </div>

      <div class="su-features">
        <div class="su-feature-card">
          <div class="su-feature-icon"><MapPin size={18} /></div>
          <div><strong>Live Incident Map</strong><span>See what's happening near you right now</span></div>
        </div>
        <div class="su-feature-card">
          <div class="su-feature-icon"><Bell size={18} /></div>
          <div><strong>Instant Alerts</strong><span>Get notified when safety events occur nearby</span></div>
        </div>
        <div class="su-feature-card">
          <div class="su-feature-icon"><ShieldCheck size={18} /></div>
          <div><strong>Trusted Community</strong><span>Verified neighbours, reliable reports</span></div>
        </div>
      </div>

      <div class="su-panel-footer">
        <div class="su-avatars">
          <div class="su-avatar" style="background: var(--secondary-color)"></div>
          <div class="su-avatar" style="background: #a78bfa"></div>
          <div class="su-avatar" style="background: #8b5cf6"></div>
          <div class="su-avatar" style="background: var(--primary-color)"></div>
          <div class="su-avatar-count">+12k</div>
        </div>
        <p>Trusted by communities worldwide</p>
      </div>
    </div>
    <div class="su-panel-glow"></div>
  </aside>

  <!-- ── RIGHT PANEL / FORM ── -->
  <main class="su-main">
    <div class="su-form-shell">

      <!-- Back button to home -->
      <button class="su-back-home" onclick={goBackToHome}>
        <ChevronLeft size={18} />
        <Home size={14} />
        <span>Back to Home</span>
      </button>

      <!-- Mobile logo -->
      <div class="su-mobile-brand">
        <a href="/" class="su-logo-link">
          <img src="/icons/lz_ico.png" alt="Lezie" class="su-logo-img" />
        </a>
      </div>

      <!-- Header -->
      <div class="su-form-header">
        <h1 class="su-form-title">Create your account</h1>
        <p class="su-form-subtitle">{steps[currentStep - 1].description}</p>
      </div>

      <!-- Progress -->
      <div class="su-progress-track">
        {#each steps as step, idx}
          <div class="su-progress-step-wrapper">
            <div class="su-progress-step {currentStep >= step.number ? 'active' : ''} {currentStep > step.number ? 'done' : ''}">
              <div class="su-step-bubble">
                {#if currentStep > step.number}
                  <Check size={14} strokeWidth={3} />
                {:else}
                  <svelte:component this={step.icon} size={14} />
                {/if}
              </div>
              <span class="su-step-label">{step.label}</span>
            </div>
            {#if idx < steps.length - 1}
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

          <!-- STEP 1 - Personal Info -->
          {#if currentStep === 1}
            <div class="su-step-body">
              <div class="su-welcome-message">
                <UserRound size={20} />
                <div><strong>Welcome!</strong><span>Let's start with your basic information</span></div>
              </div>

              <div class="su-field-row">
                <div class="su-field">
                  <label class="su-label" for="firstName">First Name <span class="su-req">*</span></label>
                  <div class="su-input-wrap">
                    <span class="su-input-icon"><User size={16} /></span>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="John"
                      bind:value={formData.firstName}
                      onblur={() => { touched.firstName = true; errors.firstName = validateStep1().firstName; }}
                      class="su-input {errors.firstName && touched.firstName ? 'su-input--err' : ''}"
                    />
                  </div>
                  {#if errors.firstName && touched.firstName}
                    <p class="su-err">{errors.firstName}</p>
                  {/if}
                </div>
                <div class="su-field">
                  <label class="su-label" for="lastName">Last Name <span class="su-req">*</span></label>
                  <div class="su-input-wrap">
                    <span class="su-input-icon"><User size={16} /></span>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Doe"
                      bind:value={formData.lastName}
                      onblur={() => { touched.lastName = true; errors.lastName = validateStep1().lastName; }}
                      class="su-input {errors.lastName && touched.lastName ? 'su-input--err' : ''}"
                    />
                  </div>
                  {#if errors.lastName && touched.lastName}
                    <p class="su-err">{errors.lastName}</p>
                  {/if}
                </div>
              </div>

              <div class="su-field">
                <label class="su-label" for="dateOfBirth">Date of Birth <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <span class="su-input-icon"><Calendar size={16} /></span>
                  <input
                    type="date"
                    id="dateOfBirth"
                    bind:value={formData.dateOfBirth}
                    onblur={() => { touched.dateOfBirth = true; errors.dateOfBirth = validateStep1().dateOfBirth; }}
                    class="su-input su-input--date {errors.dateOfBirth && touched.dateOfBirth ? 'su-input--err' : ''}"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {#if errors.dateOfBirth && touched.dateOfBirth}
                  <p class="su-err">{errors.dateOfBirth}</p>
                {:else}
                  <p class="su-hint">You must be at least 13 years old to join</p>
                {/if}
              </div>
            </div>
          {/if}

          <!-- STEP 2 - Contact Info -->
          {#if currentStep === 2}
            <div class="su-step-body">
              <div class="su-welcome-message">
                <Smartphone size={20} />
                <div><strong>Contact Details</strong><span>How we'll reach you for important alerts</span></div>
              </div>

              <div class="su-field">
                <label class="su-label" for="phone">Phone Number <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <span class="su-input-icon"><Phone size={16} /></span>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="(555) 123-4567"
                    bind:value={formData.phone}
                    oninput={handlePhoneInput}
                    onblur={() => { touched.phone = true; errors.phone = validateStep2().phone; }}
                    class="su-input {errors.phone && touched.phone ? 'su-input--err' : ''}"
                  />
                </div>
                {#if errors.phone && touched.phone}
                  <p class="su-err">{errors.phone}</p>
                {:else}
                  <p class="su-hint">Used for critical safety alerts in your area</p>
                {/if}
              </div>

              <div class="su-field">
                <label class="su-label" for="email">Email Address <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <span class="su-input-icon"><Mail size={16} /></span>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    bind:value={formData.email}
                    onblur={() => { touched.email = true; errors.email = validateStep2().email; }}
                    class="su-input {errors.email && touched.email ? 'su-input--err' : ''}"
                  />
                </div>
                {#if errors.email && touched.email}
                  <p class="su-err">{errors.email}</p>
                {:else}
                  <p class="su-hint">We'll send a verification link to this address</p>
                {/if}
              </div>
            </div>
          {/if}

          <!-- STEP 3 - Security -->
          {#if currentStep === 3}
            <div class="su-step-body">
              <div class="su-welcome-message">
                <Fingerprint size={20} />
                <div><strong>Secure Your Account</strong><span>Create a strong password to keep your account safe</span></div>
              </div>

              <div class="su-field">
                <label class="su-label" for="password">Password <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <span class="su-input-icon"><Lock size={16} /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Create a strong password"
                    bind:value={formData.password}
                    onblur={() => { touched.password = true; errors.password = validateStep3().password; }}
                    class="su-input su-input--toggle {errors.password && touched.password ? 'su-input--err' : ''}"
                  />
                  <button type="button" class="su-eye-btn" onclick={() => showPassword = !showPassword}>
                    {#if showPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
                  </button>
                </div>
                {#if errors.password && touched.password}
                  <p class="su-err">{errors.password}</p>
                {:else if formData.password}
                  <div class="su-strength">
                    <div class="su-strength-track">
                      <div class="su-strength-fill" style="width: {strengthLabel().width}; background: {strengthLabel().color}"></div>
                    </div>
                    <span class="su-strength-label" style="color:{strengthLabel().color}">{strengthLabel().text}</span>
                  </div>
                  <div class="su-hints">
                    <span class={formData.password.length >= 8 ? 'su-hint-ok' : 'su-hint-no'}>
                      {#if formData.password.length >= 8}<Check size={10} />{/if} 8+ chars
                    </span>
                    <span class={/(?=.*[A-Z])/.test(formData.password) ? 'su-hint-ok' : 'su-hint-no'}>
                      {#if /(?=.*[A-Z])/.test(formData.password)}<Check size={10} />{/if} Uppercase
                    </span>
                    <span class={/(?=.*[a-z])/.test(formData.password) ? 'su-hint-ok' : 'su-hint-no'}>
                      {#if /(?=.*[a-z])/.test(formData.password)}<Check size={10} />{/if} Lowercase
                    </span>
                    <span class={/(?=.*\d)/.test(formData.password) ? 'su-hint-ok' : 'su-hint-no'}>
                      {#if /(?=.*\d)/.test(formData.password)}<Check size={10} />{/if} Number
                    </span>
                  </div>
                {/if}
              </div>

              <div class="su-field">
                <label class="su-label" for="confirmPassword">Confirm Password <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <span class="su-input-icon"><Lock size={16} /></span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder="Repeat your password"
                    bind:value={formData.confirmPassword}
                    onblur={() => { touched.confirmPassword = true; errors.confirmPassword = validateStep3().confirmPassword; }}
                    class="su-input su-input--toggle {errors.confirmPassword && touched.confirmPassword ? 'su-input--err' : ''}"
                  />
                  <button type="button" class="su-eye-btn" onclick={() => showConfirmPassword = !showConfirmPassword}>
                    {#if showConfirmPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
                  </button>
                </div>
                {#if errors.confirmPassword && touched.confirmPassword}
                  <p class="su-err">{errors.confirmPassword}</p>
                {:else if formData.confirmPassword && formData.password === formData.confirmPassword && formData.password}
                  <p class="su-hint su-hint--ok"><Check size={13} /> Passwords match</p>
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
        Already have an account? <a href="/signin" class="su-link">Sign in</a>
      </p>
    </div>
  </main>
</div>

<style>
  /* ── Fonts ── */
  :global(.su-page *) {
    font-family: 'DM Sans', system-ui, sans-serif;
    box-sizing: border-box;
  }

  /* ── Layout ── */
  .su-page {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%);
  }

  /* ── LEFT PANEL ── */
  .su-panel {
    display: none;
    position: relative;
    width: 440px;
    flex-shrink: 0;
    background: linear-gradient(160deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%);
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
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Brand */
  .su-logo-link {
    display: inline-block;
    line-height: 0;
    margin-bottom: 2.5rem;
    transition: transform 0.2s, opacity 0.2s;
  }

  .su-logo-link:hover { opacity: 0.85; transform: scale(1.02); }

  .su-logo-img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    display: block;
  }

  /* Panel content */
  .su-panel-badge {
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

  .su-panel-headline {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 2.5rem;
    line-height: 1.2;
    color: white;
    margin-bottom: 1rem;
  }

  .su-panel-headline em {
    color: #c4b5fd;
    font-style: italic;
  }

  .su-panel-desc {
    font-size: 0.875rem;
    line-height: 1.6;
    color: rgba(196,181,253,0.85);
    margin-bottom: 2rem;
  }

  /* Feature cards */
  .su-features {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: auto;
  }

  .su-feature-card {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 0.875rem;
    background: rgba(255,255,255,0.05);
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    transition: background 0.2s;
  }

  .su-feature-card:hover {
    background: rgba(255,255,255,0.08);
  }

  .su-feature-icon {
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

  .su-feature-card strong {
    display: block;
    font-size: 0.813rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.25rem;
  }

  .su-feature-card span {
    font-size: 0.75rem;
    color: rgba(196,181,253,0.8);
    line-height: 1.4;
  }

  /* Panel footer */
  .su-panel-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .su-avatars {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .su-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #2d1b4e;
    margin-left: -8px;
  }

  .su-avatar:first-child { margin-left: 0; }

  .su-avatar-count {
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

  .su-panel-footer p {
    font-size: 0.688rem;
    color: rgba(196,181,253,0.7);
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
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Back button */
  .su-back-home {
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

  .su-back-home:hover {
    border-color: #6a2c91;
    color: #6a2c91;
    background: #f3e8ff;
    transform: translateX(-2px);
  }

  /* Mobile brand */
  .su-mobile-brand {
    display: flex;
    justify-content: center;
  }

  .su-mobile-brand .su-logo-link {
    margin-bottom: 0;
  }

  .su-mobile-brand .su-logo-img {
    width: 80px;
    height: 80px;
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
    color: #1e1b4b;
    margin-bottom: 0.25rem;
    letter-spacing: -0.02em;
  }

  .su-form-subtitle {
    font-size: 0.875rem;
    color: #64748b;
  }

  /* Card */
  .su-card {
    background: white;
    border-radius: 1.5rem;
    border: 1px solid #e2e8f0;
    padding: clamp(1.25rem, 5vw, 2rem);
    box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1);
  }

  /* Progress */
  .su-progress-track {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
  }

  .su-progress-step-wrapper {
    display: flex;
    align-items: center;
    position: relative;
  }

  .su-progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .su-step-connector {
    width: 60px;
    height: 2px;
    background: #e2e8f0;
    margin: 0 0.5rem;
    transition: background 0.4s ease;
  }

  .su-step-connector.filled {
    background: #1a0b2e;
  }

  .su-step-bubble {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    border: 2px solid #e2e8f0;
    color: #94a3b8;
    transition: all 0.3s ease;
  }

  .su-progress-step.active .su-step-bubble {
    background: #6a2c91;
    border-color: #6a2c91;
    color: white;
    box-shadow: 0 0 0 4px rgba(106,44,145,0.15);
  }

  .su-progress-step.done .su-step-bubble {
    background: #1a0b2e;
    border-color: #1a0b2e;
    color: white;
  }

  .su-step-label {
    font-size: 0.688rem;
    font-weight: 500;
    color: #94a3b8;
    transition: color 0.3s;
  }

  .su-progress-step.active .su-step-label {
    color: #6a2c91;
    font-weight: 600;
  }

  .su-progress-step.done .su-step-label {
    color: #1a0b2e;
  }

  /* Welcome message */
  .su-welcome-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%);
    border-radius: 1rem;
    margin-bottom: 1.5rem;
  }

  .su-welcome-message svg {
    color: #6a2c91;
    flex-shrink: 0;
  }

  .su-welcome-message strong {
    display: block;
    font-size: 0.875rem;
    font-weight: 700;
    color: #1e1b4b;
  }

  .su-welcome-message span {
    font-size: 0.75rem;
    color: #64748b;
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
  }

  .su-req { color: #6a2c91; }

  .su-input-wrap {
    position: relative;
  }

  .su-input-icon {
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

  .su-input {
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
  }

  .su-input:hover { border-color: #c4b5fd; }
  .su-input:focus {
    border-color: #6a2c91;
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

  .su-eye-btn:hover { color: #6a2c91; }

  .su-err {
    font-size: 0.75rem;
    color: #dc2626;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .su-hint {
    font-size: 0.688rem;
    color: #94a3b8;
  }

  .su-hint--ok {
    color: #10b981;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  /* Strength meter */
  .su-strength {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .su-strength-track {
    flex: 1;
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
  }

  .su-strength-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease, background 0.3s ease;
  }

  .su-strength-label {
    font-size: 0.688rem;
    font-weight: 600;
    min-width: 42px;
    text-align: right;
  }

  /* Hints */
  .su-hints {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .su-hint-ok,
  .su-hint-no {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.688rem;
    font-weight: 500;
    padding: 0.2rem 0.625rem;
    border-radius: 100px;
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
    margin-top: 0.5rem;
    font-size: 0.813rem;
    color: #4b5563;
    line-height: 1.5;
  }

  .su-checkbox {
    width: 16px;
    height: 16px;
    margin-top: 2px;
    flex-shrink: 0;
    accent-color: #6a2c91;
    cursor: pointer;
  }

  /* Actions */
  .su-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.75rem;
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
    color: #64748b;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }

  .su-btn-back:hover {
    border-color: #6a2c91;
    color: #6a2c91;
    background: #f3e8ff;
    transform: translateX(-2px);
  }

  .su-btn-next {
    flex: 1;
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
  }

  .su-btn-next:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(106,44,145,0.4);
  }

  .su-btn-next:active:not(:disabled) { transform: translateY(0); }
  .su-btn-next:disabled { opacity: 0.65; cursor: not-allowed; }
  .su-btn-next--full { flex: 1; }

  /* Link */
  .su-link {
    color: #6a2c91;
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

  /* Responsive */
  @media (max-width: 640px) {
    .su-main { padding: 1.5rem 1rem; align-items: flex-start; }
    .su-form-shell { gap: 1.25rem; }
    .su-card { border-radius: 1.25rem; padding: 1.25rem; }
    .su-step-connector { width: 40px; }
    .su-step-bubble { width: 36px; height: 36px; }
    .su-actions { flex-direction: column-reverse; }
    .su-btn-back { width: 100%; justify-content: center; }
    .su-btn-next { width: 100%; }
    .su-back-home { font-size: 0.75rem; padding: 0.375rem 0.875rem; }
  }
</style>