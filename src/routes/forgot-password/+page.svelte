<script lang="ts">
  import { Mail, AlertCircle, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-svelte';
  
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
    if (Object.keys(validationErrors).length > 0) {
      errors = validationErrors;
      return;
    }
    
    isLoading = true;
    errors = {};
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reset email');
      }
      
      isSuccess = true;
    } catch (error: unknown) {
      errors.submit = error instanceof Error ? error.message : 'An error occurred';
    } finally {
      isLoading = false;
    }
  };
</script>

<svelte:head>
  <title>Reset Password - Lezie</title>
</svelte:head>

<div class="forgot-password-container">
  <!-- Header -->
  <div class="forgot-password-header">
    <h1 class="forgot-password-title">Reset password</h1>
    <p class="forgot-password-subtitle">
      Enter your email address and we'll send you a link to reset your password
    </p>
  </div>

  {#if isSuccess}
    <div class="success-message">
      <CheckCircle size={24} />
      <div>
        <h3>Check your email</h3>
        <p>We've sent a password reset link to <strong>{email}</strong></p>
      </div>
    </div>
    
    <div class="form-footer">
      <a href="/auth/signin" class="auth-btn-submit return-btn">
        Return to Sign In
      </a>
    </div>
  {:else}
    {#if errors.submit}
      <div class="auth-alert-error">
        <AlertCircle size={20} />
        <span>{errors.submit}</span>
      </div>
    {/if}

    <form class="forgot-password-form" onsubmit={handleSubmit}>
      <!-- Email -->
      <div class="auth-form-group">
        <label for="email" class="auth-label">Email Address</label>
        <div class="auth-input-wrapper">
          <Mail size={18} class="auth-input-icon" />
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            bind:value={email}
            class="auth-input {errors.email ? 'input-error' : ''}"
          />
        </div>
        {#if errors.email}
          <span class="auth-error-message">{errors.email}</span>
        {/if}
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        disabled={isLoading}
        class="auth-btn-submit submit-btn"
      >
        {#if isLoading}
          <span class="auth-spinner"></span>
          Sending...
        {:else}
          Send Reset Link
          <ArrowRight size={16} />
        {/if}
      </button>
    </form>

    <!-- Divider -->
    <div class="auth-divider">
      <span>or</span>
    </div>

    <!-- Back to Sign In -->
    <a href="/auth/signin" class="back-link">
      <ArrowLeft size={16} />
      Back to Sign In
    </a>
  {/if}
</div>
