<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    CheckCircle
  } from 'lucide-svelte';
  
  let step = $state<'email' | 'password'>('email');
  let formData = $state({
    email: '',
    password: '',
    rememberMe: false
  });
  
  let errors = $state<Record<string, string>>({});
  let isLoading = $state(false);
  let showPassword = $state(false);
  
  const validateEmail = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    return newErrors;
  };
  
  const handleEmailSubmit = (e: Event) => {
    e.preventDefault();
    
    const emailErrors = validateEmail();
    if (Object.keys(emailErrors).length > 0) {
      errors = emailErrors;
      return;
    }
    
    errors = {};
    step = 'password';
  };
  
  const handlePasswordSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!formData.password) {
      errors = { password: 'Password is required' };
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
  
  const goBackToEmail = () => {
    step = 'email';
    errors = {};
  };
</script>

<!-- Header slot content -->
<h1 class="signin-title">Welcome back</h1>
<p class="signin-subtitle">Sign in to your Lezie account</p>

<!-- Footer slot content -->
<p class="signin-footer-text">
  Don't have an account?
  <a href="/auth/signup" class="auth-link">Create account</a>
</p>

<!-- Main form content -->
<div class="signin-container">
  {#if errors.submit}
    <div class="auth-alert-error">
      <AlertCircle size={20} />
      <span>{errors.submit}</span>
    </div>
  {/if}

  <!-- Email Step -->
  {#if step === 'email'}
    <form onsubmit={handleEmailSubmit} class="signin-form">
      <div class="auth-form-group">
        <label for="email" class="auth-label">Email Address</label>
        <div class="auth-input-wrapper">
          <Mail size={18} class="auth-input-icon" />
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            bind:value={formData.email}
            class="auth-input {errors.email ? 'input-error' : ''}"
            autofocus
          />
        </div>
        {#if errors.email}
          <span class="auth-error-message">{errors.email}</span>
        {/if}
      </div>

      <button
        type="submit"
        class="auth-btn-submit signin-btn-next"
      >
        Continue
        <ArrowRight size={16} />
      </button>
    </form>
  {/if}

  <!-- Password Step -->
  {#if step === 'password'}
    <form onsubmit={handlePasswordSubmit} class="signin-form">
      <div class="signin-email-badge">
        <span class="signin-email-text">{formData.email}</span>
        <button type="button" class="signin-email-edit" onclick={goBackToEmail}>
          Edit
        </button>
      </div>

      <div class="auth-form-group">
        <label for="password" class="auth-label">Password</label>
        <div class="auth-input-wrapper">
          <Lock size={18} class="auth-input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter your password"
            bind:value={formData.password}
            class="auth-input auth-input-has-toggle {errors.password ? 'input-error' : ''}"
            autofocus
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

      <div class="signin-options">
        <label class="auth-checkbox-label">
          <input
            type="checkbox"
            bind:checked={formData.rememberMe}
          />
          <span>Remember me</span>
        </label>
        <a href="/auth/forgot-password" class="auth-link">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        class="auth-btn-submit signin-btn-next"
      >
        {#if isLoading}
          <span class="auth-spinner"></span>
          Signing in...
        {:else}
          Sign In
          <ArrowRight size={16} />
        {/if}
      </button>

      <button
        type="button"
        class="signin-back-btn"
        onclick={goBackToEmail}
      >
        <ArrowLeft size={16} />
        Back to email
      </button>
    </form>
  {/if}
</div>

<style>
  .signin-title {
    font-size: clamp(1.5rem, 5vw, 1.875rem);
    font-weight: 700;
    color: var(--dark-color);
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .signin-subtitle {
    font-size: clamp(0.75rem, 3vw, 0.875rem);
    color: var(--gray-color);
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .signin-footer-text {
    font-size: clamp(0.75rem, 3vw, 0.875rem);
    color: var(--gray-color);
    text-align: center;
  }

  .signin-container {
    width: 100%;
    margin-top: 1rem;
  }

  .signin-form {
    width: 100%;
    animation: fadeInUp 0.4s ease;
  }

  .signin-btn-next {
    width: 100%;
    margin-top: 0.5rem;
  }

  .signin-email-badge {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1.5rem;
  }

  .signin-email-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--dark-color);
    word-break: break-all;
  }

  .signin-email-edit {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    transition: background 0.2s;
  }

  .signin-email-edit:hover {
    background: rgba(106, 44, 145, 0.1);
  }

  .signin-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .signin-back-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    margin-top: 1rem;
    padding: 0.625rem 1rem;
    background: transparent;
    border: none;
    color: var(--gray-color);
    font-size: 0.875rem;
    cursor: pointer;
    transition: color 0.2s;
  }

  .signin-back-btn:hover {
    color: var(--primary-color);
  }

  /* Responsive */
  @media (max-width: 640px) {
    .signin-email-badge {
      padding: 0.625rem 0.875rem;
    }

    .signin-email-text {
      font-size: 0.813rem;
    }

    .signin-options {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }

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
</style>