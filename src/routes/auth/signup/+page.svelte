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
    ArrowRight
  } from 'lucide-svelte';
  
  let formData = $state({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: ''
  });
  
  let errors = $state<Record<string, string>>({});
  let isLoading = $state(false);
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
  
  const validateForm = () => {
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
  
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
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

<!-- Form -->
<form class="signup-form" onsubmit={handleSubmit}>
  {#if errors.submit}
    <div class="auth-alert-error">
      <AlertCircle size={20} />
      <span>{errors.submit}</span>
    </div>
  {/if}

  <!-- Name Fields -->
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

  <!-- Date of Birth -->
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

  <!-- Phone -->
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

  <!-- Email -->
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

  <!-- Password -->
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

  <!-- Confirm Password -->
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

  <!-- Submit -->
  <button
    type="submit"
    disabled={isLoading}
    class="auth-btn-submit"
  >
    {#if isLoading}
      <span class="auth-spinner"></span>
      Creating account...
    {:else}
      Sign Up
      <ArrowRight size={16} />
    {/if}
  </button>
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
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .signup-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .signup-form {
    width: 100%;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 0.25rem;
  }

  .signup-footer {
    margin-top: 1.5rem;
    text-align: center;
  }

  .signup-footer-text {
    font-size: 0.875rem;
    color: #6b7280;
  }

  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
</style>