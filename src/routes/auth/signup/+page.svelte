<script lang="ts">
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
    ArrowRight,
    UserRound,
    Shield
  } from 'lucide-svelte';
  
  let currentStep = $state(1);
  let formData = $state({
    // Step 1: Personal Information
    surname: '',
    firstName: '',
    middleName: '',
    dateOfBirth: '',
    gender: '',
    // Step 2: Contact Information
    phone: '',
    email: '',
    // Step 3: Security
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  let errors = $state<Record<string, string>>({});
  let isLoading = $state(false);
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
  
  const validateStep1 = () => {
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
      goto('/auth/signin');
    } catch (error: unknown) {
      errors.submit = error instanceof Error ? error.message : 'An error occurred';
    } finally {
      isLoading = false;
    }
  };
</script>

<!-- Header content -->
<div class="signup-header">
  <h1 class="signup-title">Create an account</h1>
  <p class="signup-subtitle">Join Lezie and start making your community safer</p>
</div>

<!-- Progress Steps -->
<div class="signup-progress">
  <div class="signup-step-indicator">
    <div class="signup-step {currentStep >= 1 ? 'active' : ''} {currentStep > 1 ? 'completed' : ''}">
      <span class="signup-step-number">{currentStep > 1 ? <Check size={16} /> : '1'}</span>
      <span class="signup-step-label">Personal</span>
    </div>
    <div class="signup-step-line {currentStep >= 2 ? 'active' : ''}"></div>
    <div class="signup-step {currentStep >= 2 ? 'active' : ''} {currentStep > 2 ? 'completed' : ''}">
      <span class="signup-step-number">{currentStep > 2 ? <Check size={16} /> : '2'}</span>
      <span class="signup-step-label">Contact</span>
    </div>
    <div class="signup-step-line {currentStep >= 3 ? 'active' : ''}"></div>
    <div class="signup-step {currentStep >= 3 ? 'active' : ''}">
      <span class="signup-step-number">3</span>
      <span class="signup-step-label">Security</span>
    </div>
  </div>
</div>

<!-- Main form content -->
<form class="signup-form" onsubmit={currentStep === 3 ? handleSubmit : handleNextStep}>
  {#if errors.submit}
    <div class="auth-alert-error">
      <CircleAlert size={20} />
      <span>{errors.submit}</span>
    </div>
  {/if}

  <!-- Step 1: Personal Information -->
  {#if currentStep === 1}
    <div class="signup-step-content">
      <div class="signup-section">
        <div class="signup-section-header">
          <UserRound size={18} />
          <h3>Personal Information</h3>
        </div>

        <div class="signup-grid">
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

        <div class="signup-grid">
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
      </div>
    </div>
  {/if}

  <!-- Step 2: Contact Information -->
  {#if currentStep === 2}
    <div class="signup-step-content">
      <div class="signup-section">
        <div class="signup-section-header">
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
    <div class="signup-step-content">
      <div class="signup-section">
        <div class="signup-section-header">
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
          {:else}
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
      </div>
    </div>
  {/if}

  <!-- Form Navigation Buttons -->
  <div class="signup-buttons">
    {#if currentStep > 1}
      <button
        type="button"
        class="signup-btn-back"
        onclick={handlePreviousStep}
      >
        Back
      </button>
    {/if}

    <button
      type="submit"
      disabled={isLoading}
      class="auth-btn-submit signup-btn-next"
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

<!-- Footer content -->
<div class="signup-footer">
  <p class="signup-footer-text">
    Already have an account?
    <a href="/auth/signin" class="auth-link">Sign in</a>
  </p>
</div>