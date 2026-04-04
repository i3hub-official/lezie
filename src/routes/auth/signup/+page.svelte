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
    Shield
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
  
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const age = calculateAge(new Date(formData.dateOfBirth));
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
      }
    }
    
    return newErrors;
  };
  
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    return newErrors;
  };
  
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };
  
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const handleNextStep = (e: Event) => {
    e.preventDefault();
    
    let stepErrors = {};
    
    if (currentStep === 1) {
      stepErrors = validateStep1();
      if (Object.keys(stepErrors).length === 0) {
        currentStep = 2;
        errors = {};
      } else {
        errors = stepErrors;
      }
    } else if (currentStep === 2) {
      stepErrors = validateStep2();
      if (Object.keys(stepErrors).length === 0) {
        currentStep = 3;
        errors = {};
      } else {
        errors = stepErrors;
      }
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      currentStep--;
      errors = {};
    }
  };
  
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    const validationErrors = validateStep3();
    if (Object.keys(validationErrors).length > 0) {
      errors = validationErrors;
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
      
      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }
      
      await authStore.login(formData.email, formData.password);
      goto('/dashboard');
    } catch (error: unknown) {
      errors.submit = error instanceof Error ? error.message : 'An error occurred';
    } finally {
      isLoading = false;
    }
  };
</script>

<svelte:head>
  <title>Sign Up - Lezie</title>
</svelte:head>

<!-- Header -->
<div class="signup-header">
  <h1 class="signup-title">Create an account</h1>
  <p class="signup-subtitle">Join Lezie and start making your community safer</p>
</div>

<!-- Progress Steps -->
<div class="signup-progress">
  <div class="step-indicator">
    <div class="step {currentStep >= 1 ? 'active' : ''} {currentStep > 1 ? 'completed' : ''}">
      <div class="step-number">
        {#if currentStep > 1}
          <Check size={16} />
        {:else}
          1
        {/if}
      </div>
      <span class="step-label">Personal</span>
    </div>
    <div class="step-line {currentStep >= 2 ? 'active' : ''}"></div>
    <div class="step {currentStep >= 2 ? 'active' : ''} {currentStep > 2 ? 'completed' : ''}">
      <div class="step-number">
        {#if currentStep > 2}
          <Check size={16} />
        {:else}
          2
        {/if}
      </div>
      <span class="step-label">Contact</span>
    </div>
    <div class="step-line {currentStep >= 3 ? 'active' : ''}"></div>
    <div class="step {currentStep >= 3 ? 'active' : ''}">
      <div class="step-number">3</div>
      <span class="step-label">Security</span>
    </div>
  </div>
</div>

<!-- Form -->
<form class="signup-form" onsubmit={currentStep === 3 ? handleSubmit : handleNextStep}>
  {#if errors.submit}
    <div class="auth-alert-error">
      <AlertCircle size={20} />
      <span>{errors.submit}</span>
    </div>
  {/if}

  <!-- Step 1: Personal Information -->
  {#if currentStep === 1}
    <div class="step-content">
      <div class="form-section">
        <div class="section-header">
          <UserRound size={18} />
          <h3>Personal Information</h3>
        </div>

        <div class="form-row">
          <div class="auth-form-group">
            <label for="firstName" class="auth-label">First Name *</label>
            <div class="auth-input-wrapper">
              <User size={18} class="auth-input-icon" />
              <input
                type="text"
                id="firstName"
                placeholder="John"
                bind:value={formData.firstName}
                class="auth-input {errors.firstName ? 'input-error' : ''}"
              />
            </div>
            {#if errors.firstName}
              <span class="auth-error-message">{errors.firstName}</span>
            {/if}
          </div>

          <div class="auth-form-group">
            <label for="lastName" class="auth-label">Last Name *</label>
            <div class="auth-input-wrapper">
              <User size={18} class="auth-input-icon" />
              <input
                type="text"
                id="lastName"
                placeholder="Doe"
                bind:value={formData.lastName}
                class="auth-input {errors.lastName ? 'input-error' : ''}"
              />
            </div>
            {#if errors.lastName}
              <span class="auth-error-message">{errors.lastName}</span>
            {/if}
          </div>
        </div>

        <div class="auth-form-group">
          <label for="dateOfBirth" class="auth-label">Date of Birth *</label>
          <div class="auth-input-wrapper">
            <Calendar size={18} class="auth-input-icon" />
            <input
              type="date"
              id="dateOfBirth"
              bind:value={formData.dateOfBirth}
              class="auth-input {errors.dateOfBirth ? 'input-error' : ''}"
            />
          </div>
          {#if errors.dateOfBirth}
            <span class="auth-error-message">{errors.dateOfBirth}</span>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Step 2: Contact Information -->
  {#if currentStep === 2}
    <div class="step-content">
      <div class="form-section">
        <div class="section-header">
          <Mail size={18} />
          <h3>Contact Information</h3>
        </div>

        <div class="auth-form-group">
          <label for="phone" class="auth-label">Phone Number *</label>
          <div class="auth-input-wrapper">
            <Phone size={18} class="auth-input-icon" />
            <input
              type="tel"
              id="phone"
              placeholder="+1 234 567 8900"
              bind:value={formData.phone}
              class="auth-input {errors.phone ? 'input-error' : ''}"
            />
          </div>
          {#if errors.phone}
            <span class="auth-error-message">{errors.phone}</span>
          {/if}
        </div>

        <div class="auth-form-group">
          <label for="email" class="auth-label">Email Address *</label>
          <div class="auth-input-wrapper">
            <Mail size={18} class="auth-input-icon" />
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              bind:value={formData.email}
              class="auth-input {errors.email ? 'input-error' : ''}"
            />
          </div>
          {#if errors.email}
            <span class="auth-error-message">{errors.email}</span>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Step 3: Security -->
  {#if currentStep === 3}
    <div class="step-content">
      <div class="form-section">
        <div class="section-header">
          <Shield size={18} />
          <h3>Secure Your Account</h3>
        </div>

        <div class="auth-form-group">
          <label for="password" class="auth-label">Password *</label>
          <div class="auth-input-wrapper">
            <Lock size={18} class="auth-input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Create a strong password"
              bind:value={formData.password}
              class="auth-input auth-input-has-toggle {errors.password ? 'input-error' : ''}"
            />
            <button
              type="button"
              class="auth-toggle-password"
              onclick={() => showPassword = !showPassword}
              aria-label="Toggle password visibility"
            >
              {#if showPassword}
                <EyeOff size={18} />
              {:else}
                <Eye size={18} />
              {/if}
            </button>
          </div>
          {#if errors.password}
            <span class="auth-error-message">{errors.password}</span>
          {:else if formData.password}
            <div class="auth-password-hints">
              <span class="auth-password-hint {formData.password.length >= 8 ? 'hint-valid' : ''}">✓ 8+ characters</span>
              <span class="auth-password-hint {/(?=.*[a-z])/.test(formData.password) ? 'hint-valid' : ''}">✓ Lowercase</span>
              <span class="auth-password-hint {/(?=.*[A-Z])/.test(formData.password) ? 'hint-valid' : ''}">✓ Uppercase</span>
              <span class="auth-password-hint {/(?=.*\d)/.test(formData.password) ? 'hint-valid' : ''}">✓ Number</span>
            </div>
          {/if}
        </div>

        <div class="auth-form-group">
          <label for="confirmPassword" class="auth-label">Confirm Password *</label>
          <div class="auth-input-wrapper">
            <Lock size={18} class="auth-input-icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Confirm your password"
              bind:value={formData.confirmPassword}
              class="auth-input auth-input-has-toggle {errors.confirmPassword ? 'input-error' : ''}"
            />
            <button
              type="button"
              class="auth-toggle-password"
              onclick={() => showConfirmPassword = !showConfirmPassword}
              aria-label="Toggle confirm password visibility"
            >
              {#if showConfirmPassword}
                <EyeOff size={18} />
              {:else}
                <Eye size={18} />
              {/if}
            </button>
          </div>
          {#if errors.confirmPassword}
            <span class="auth-error-message">{errors.confirmPassword}</span>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Navigation Buttons -->
  <div class="form-buttons">
    {#if currentStep > 1}
      <button
        type="button"
        class="btn-back"
        onclick={handlePreviousStep}
      >
        <ArrowLeft size={16} />
        Back
      </button>
    {/if}
    
    <button
      type="submit"
      disabled={isLoading}
      class="auth-btn-submit btn-next"
    >
      {#if isLoading}
        <span class="auth-spinner"></span>
        Creating account...
      {:else if currentStep === 3}
        Sign Up
        <ArrowRight size={16} />
      {:else}
        Continue
        <ArrowRight size={16} />
      {/if}
    </button>
  </div>
</form>

<!-- Footer -->
<div class="signup-footer">
  <p class="signup-footer-text">
    Already have an account?
    <a href="/auth/signin" class="auth-link">Sign in</a>
  </p>
</div>

<style>
  .signup-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .signup-title {
    font-size: clamp(1.5rem, 5vw, 1.875rem);
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .signup-subtitle {
    font-size: clamp(0.75rem, 3vw, 0.875rem);
    color: #6b7280;
  }

  /* Progress Steps */
  .signup-progress {
    margin-bottom: 2rem;
    padding: 0 1rem;
  }

  .step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .step-number {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 50%;
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    transition: all 0.3s ease;
  }

  .step.active .step-number {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }

  .step.completed .step-number {
    background: var(--success-color);
    border-color: var(--success-color);
    color: white;
  }

  .step-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
  }

  .step.active .step-label {
    color: var(--primary-color);
  }

  .step.completed .step-label {
    color: var(--success-color);
  }

  .step-line {
    width: 60px;
    height: 2px;
    background: #e5e7eb;
    transition: background 0.3s ease;
  }

  .step-line.active {
    background: var(--primary-color);
  }

  /* Form */
  .signup-form {
    width: 100%;
  }

  .step-content {
    animation: fadeInUp 0.4s ease;
  }

  .form-section {
    background: white;
    border-radius: 1rem;
    margin-bottom: 1.5rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--primary-border);
  }

  .section-header h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
  }

  .section-header svg {
    color: var(--primary-color);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 0.25rem;
  }

  /* Buttons */
  .form-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .btn-next {
    flex: 1;
  }

  .btn-back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-back:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  /* Footer */
  .signup-footer {
    margin-top: 1.5rem;
    text-align: center;
  }

  .signup-footer-text {
    font-size: 0.875rem;
    color: #6b7280;
  }

  /* Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive */
  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .step-line {
      width: 30px;
    }

    .step-number {
      width: 32px;
      height: 32px;
      font-size: 0.75rem;
    }

    .step-label {
      font-size: 0.688rem;
    }

    .form-buttons {
      flex-direction: column-reverse;
      gap: 0.75rem;
    }

    .btn-back {
      width: 100%;
    }
  }
</style>