<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { 
    User, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff,
    Calendar,
    Phone,
    Users,
    Check,
    CircleAlert,
    ArrowRight
  } from 'lucide-svelte';
  
  let formData = $state({
    surname: '',
    firstName: '',
    middleName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  let errors = $state<Record<string, string>>({});
  let isLoading = $state(false);
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required';
    } else if (formData.surname.length < 2) {
      newErrors.surname = 'Surname must be at least 2 characters';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const age = calculateAge(new Date(formData.dateOfBirth));
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
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
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
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
          surname: formData.surname,
          firstName: formData.firstName,
          middleName: formData.middleName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
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
  
  const handleGoogleSignup = async () => {
    isLoading = true;
    try {
      window.location.href = '/api/auth/google';
    } catch (error) {
      console.error('Google signup failed:', error);
      errors.submit = 'Google signup failed. Please try again.';
      isLoading = false;
    }
  };
  
  // Commented out to allow viewing the signup page while logged in
  // onMount(() => {
  //   authStore.subscribe(user => {
  //     if (user) goto('/dashboard');
  //   })();
  // });
</script>

<!-- Header content -->
<div class="text-center mb-6">
  <h1 class="text-2xl font-bold text-gray-800">Create an account</h1>
  <p class="text-gray-500 mt-1">Join Lezie and start making your community safer</p>
</div>

<!-- Main form content using your global CSS classes -->
<form class="auth-form" onsubmit={handleSubmit}>
  {#if errors.submit}
    <div class="auth-alert-error">
      <CircleAlert size={20} />
      <span>{errors.submit}</span>
    </div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Surname -->
    <div class="auth-form-group">
      <label for="surname" class="auth-label">Surname *</label>
      <div class="auth-input-wrapper">
        <User size={18} class="auth-input-icon" />
        <input
          type="text"
          id="surname"
          placeholder="Doe"
          bind:value={formData.surname}
          class="auth-input {errors.surname ? 'input-error' : ''}"
        />
      </div>
      {#if errors.surname}
        <span class="auth-error-message">{errors.surname}</span>
      {/if}
    </div>

    <!-- First Name -->
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
  </div>

  <!-- Middle Name -->
  <div class="auth-form-group">
    <label for="middleName" class="auth-label">Middle Name (Optional)</label>
    <div class="auth-input-wrapper">
      <User size={18} class="auth-input-icon" />
      <input
        type="text"
        id="middleName"
        placeholder="Robert"
        bind:value={formData.middleName}
        class="auth-input"
      />
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

    <!-- Gender -->
    <div class="auth-form-group">
      <label for="gender" class="auth-label">Gender *</label>
      <div class="auth-input-wrapper">
        <Users size={18} class="auth-input-icon" />
        <select
          id="gender"
          bind:value={formData.gender}
          class="auth-input {errors.gender ? 'input-error' : ''}"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>
      {#if errors.gender}
        <span class="auth-error-message">{errors.gender}</span>
      {/if}
    </div>
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
        placeholder="••••••••"
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
    {:else}
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
        placeholder="••••••••"
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

  <!-- Terms Checkbox -->
  <div class="auth-checkbox-group">
    <label class="auth-checkbox-label">
      <input
        type="checkbox"
        bind:checked={formData.agreeTerms}
      />
      <span>
        I agree to the
        <a href="/terms" class="auth-link">Terms of Service</a>
        and
        <a href="/privacy" class="auth-link">Privacy Policy</a>
      </span>
    </label>
    {#if errors.agreeTerms}
      <span class="auth-error-message">{errors.agreeTerms}</span>
    {/if}
  </div>

  <!-- Submit Button -->
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

  <!-- Divider -->
  <div class="auth-divider">
    <span>or continue with</span>
  </div>

  <!-- Google Signup -->
  <button
    type="button"
    onclick={handleGoogleSignup}
    disabled={isLoading}
    class="auth-btn-google"
  >
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    Sign up with Google
  </button>
</form>

<!-- Footer content -->
<div class="auth-footer-content mt-6 text-center">
  <p class="text-sm text-gray-500">
    Already have an account?
    <a href="/auth/login" class="text-blue-500 font-medium hover:underline">Sign in</a>
  </p>
</div>
