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
  
  const handleGoogleLogin = async () => {
    isLoading = true;
    try {
      window.location.href = '/api/auth/google';
    } catch (error) {
      console.error('Google login failed:', error);
      errors.submit = 'Google login failed. Please try again.';
      isLoading = false;
    }
  };
  
  // onMount(() => {
  //   authStore.subscribe(user => {
  //     if (user) goto('/dashboard');
  //   })();
  // });
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

  <!-- Divider -->
  <div class="auth-divider">
    <span>or continue with</span>
  </div>

  <!-- Google Login -->
  <button
    type="button"
    onclick={handleGoogleLogin}
    disabled={isLoading}
    class="auth-btn-google"
  >
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    Sign in with Google
  </button>
</div>

<style>
  /* Additional styles specific to login page if needed */
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