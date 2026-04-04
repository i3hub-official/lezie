<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff,
    AlertCircle,
    ArrowRight
  } from 'lucide-svelte';
  
  let formData = $state({
    email: '',
    password: '',
    rememberMe: false
  });
  
  let errors = $state<Record<string, string>>({});
  let isLoading = $state(false);
  let showPassword = $state(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await authStore.login(formData.email, formData.password, formData.rememberMe);
      goto('/dashboard');
    } catch (error: unknown) {
      errors.submit = error instanceof Error ? error.message : 'Invalid email or password';
    } finally {
      isLoading = false;
    }
  };
</script>

<!-- Header slot content -->
<h1 class="text-2xl font-bold text-gray-800">Welcome back</h1>
<p class="text-gray-500 mt-1">Sign in to your Lezie account</p>

<!-- Footer slot content -->
<p class="text-sm text-gray-500">
  Don't have an account?
  <a href="/auth/signup" class="auth-link text-sm font-medium hover:underline">Create account</a>
</p>

<!-- Main form content -->
<div class="auth-form">
  {#if errors.submit}
    <div class="auth-alert-error">
      <AlertCircle size={20} />
      <span>{errors.submit}</span>
    </div>
  {/if}

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
    {/if}
  </div>

  <!-- Remember Me & Forgot Password -->
  <div class="flex items-center justify-between mb-6">
    <label class="auth-checkbox-label">
      <input
        type="checkbox"
        bind:checked={formData.rememberMe}
      />
      <span class="text-sm">Remember me</span>
    </label>
    <a href="/auth/forgot-password" class="auth-link text-sm">
      Forgot password?
    </a>
  </div>

  <!-- Submit Button -->
  <button
    type="submit"
    disabled={isLoading}
    class="auth-btn-submit"
    onclick={handleSubmit}
  >
    {#if isLoading}
      <span class="auth-spinner"></span>
      Signing in...
    {:else}
      Sign In
      <ArrowRight size={16} />
    {/if}
  </button>
</div>

<style>
  /* Minimal styles not covered by global CSS */
  .flex {
    display: flex;
  }
  
  .items-center {
    align-items: center;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .mb-6 {
    margin-bottom: 1.5rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
</style>