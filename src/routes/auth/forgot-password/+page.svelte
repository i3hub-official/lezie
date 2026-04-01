<script lang="ts">
  import { Mail, AlertCircle, ArrowRight, CheckCircle } from 'lucide-svelte';
  
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

<div class="auth-form">
  <!-- Header -->
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Reset password</h1>
    <p class="text-gray-500 mt-1">
      Enter your email address and we'll send you a link to reset your password
    </p>
  </div>

  {#if isSuccess}
    <div class="flex items-center gap-2 px-4 py-3 mb-6 bg-green-50 text-green-600 rounded-xl border border-green-200">
      <CheckCircle size={20} />
      <span class="text-sm">
        Password reset link sent! Check your email for instructions.
      </span>
    </div>
  {/if}
  
  {#if errors.submit && !isSuccess}
    <div class="auth-alert-error">
      <AlertCircle size={20} />
      <span>{errors.submit}</span>
    </div>
  {/if}
  
  {#if !isSuccess}
    <form onsubmit={handleSubmit}>
      <!-- Email -->
      <div class="auth-form-group">
        <label for="email" class="auth-label">Email Address *</label>
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
        class="auth-btn-submit"
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
    <a
      href="/auth/signin"
      class="auth-btn-google text-center block"
      style="text-decoration: none;"
    >
      Back to Sign In
    </a>
  {:else}
    <div class="text-center">
      <a
        href="/auth/signin"
        class="auth-btn-submit inline-block"
        style="text-decoration: none;"
      >
        Return to Sign In
      </a>
    </div>
  {/if}

  <!-- Footer -->
  <div class="mt-6 text-sm text-gray-500 text-center">
    Remember your password?
    <a href="/auth/signin" class="text-blue-500 font-medium hover:underline">
      Sign in
    </a>
  </div>
</div>