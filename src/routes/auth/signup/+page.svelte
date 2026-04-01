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
    AlertCircle,
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
    
    // Surname validation
    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required';
    } else if (formData.surname.length < 2) {
      newErrors.surname = 'Surname must be at least 2 characters';
    }
    
    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    // Date of Birth validation
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
    
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms validation
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
  
  onMount(() => {
    authStore.subscribe(user => {
      if (user) goto('/dashboard');
    })();
  });
</script>

<svelte:head>
  <title>Sign Up - Lezie</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-2xl w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
    <div class="text-center">
      <div class="mx-auto w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="white" stroke-width="1.5" fill="none"/>
          <path d="M3 12L12 17L21 12M3 17L12 22L21 17" stroke="white" stroke-width="1.5" fill="none"/>
        </svg>
      </div>
      <h2 class="text-3xl font-bold text-gray-900">Create an account</h2>
      <p class="mt-2 text-gray-600">Join Lezie and start making your community safer</p>
    </div>

    <form onsubmit={handleSubmit} class="mt-8 space-y-6">
      {#if errors.submit}
        <div class="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-200">
          <AlertCircle size={20} />
          <span class="text-sm">{errors.submit}</span>
        </div>
      {/if}

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Surname -->
        <div>
          <label for="surname" class="block text-sm font-medium text-gray-700 mb-1.5">Surname *</label>
          <div class="relative">
            <User size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="surname"
              placeholder="Doe"
              bind:value={formData.surname}
              class="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                {errors.surname ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}"
            />
          </div>
          {#if errors.surname}
            <span class="text-xs text-red-500 mt-1 block">{errors.surname}</span>
          {/if}
        </div>

        <!-- First Name -->
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
          <div class="relative">
            <User size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="firstName"
              placeholder="John"
              bind:value={formData.firstName}
              class="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                {errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}"
            />
          </div>
          {#if errors.firstName}
            <span class="text-xs text-red-500 mt-1 block">{errors.firstName}</span>
          {/if}
        </div>
      </div>

      <!-- Middle Name -->
      <div>
        <label for="middleName" class="block text-sm font-medium text-gray-700 mb-1.5">Middle Name (Optional)</label>
        <div class="relative">
          <User size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="middleName"
            placeholder="Robert"
            bind:value={formData.middleName}
            class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Date of Birth -->
        <div>
          <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth *</label>
          <div class="relative">
            <Calendar size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              id="dateOfBirth"
              bind:value={formData.dateOfBirth}
              class="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                {errors.dateOfBirth ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}"
            />
          </div>
          {#if errors.dateOfBirth}
            <span class="text-xs text-red-500 mt-1 block">{errors.dateOfBirth}</span>
          {/if}
        </div>

        <!-- Gender -->
        <div>
          <label for="gender" class="block text-sm font-medium text-gray-700 mb-1.5">Gender *</label>
          <div class="relative">
            <Users size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              id="gender"
              bind:value={formData.gender}
              class="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                {errors.gender ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          {#if errors.gender}
            <span class="text-xs text-red-500 mt-1 block">{errors.gender}</span>
          {/if}
        </div>
      </div>

      <!-- Phone -->
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
        <div class="relative">
          <Phone size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            id="phone"
            placeholder="+1 234 567 8900"
            bind:value={formData.phone}
            class="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              {errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}"
          />
        </div>
        {#if errors.phone}
          <span class="text-xs text-red-500 mt-1 block">{errors.phone}</span>
        {/if}
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
        <div class="relative">
          <Mail size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            bind:value={formData.email}
            class="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              {errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}"
          />
        </div>
        {#if errors.email}
          <span class="text-xs text-red-500 mt-1 block">{errors.email}</span>
        {/if}
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
        <div class="relative">
          <Lock size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="••••••••"
            bind:value={formData.password}
            class="w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              {errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2"
            onclick={() => showPassword = !showPassword}
            aria-label="Toggle password visibility"
          >
            {#if showPassword}
              <EyeOff size={18} class="text-gray-400 hover:text-gray-600" />
            {:else}
              <Eye size={18} class="text-gray-400 hover:text-gray-600" />
            {/if}
          </button>
        </div>
        {#if errors.password}
          <span class="text-xs text-red-500 mt-1 block">{errors.password}</span>
        {:else}
          <div class="flex flex-wrap gap-3 mt-2">
            <span class="text-xs flex items-center gap-1 {formData.password.length >= 8 ? 'text-emerald-500' : 'text-gray-400'}">
              <Check size={12} /> 8+ characters
            </span>
            <span class="text-xs flex items-center gap-1 {/(?=.*[a-z])/.test(formData.password) ? 'text-emerald-500' : 'text-gray-400'}">
              <Check size={12} /> Lowercase
            </span>
            <span class="text-xs flex items-center gap-1 {/(?=.*[A-Z])/.test(formData.password) ? 'text-emerald-500' : 'text-gray-400'}">
              <Check size={12} /> Uppercase
            </span>
            <span class="text-xs flex items-center gap-1 {/(?=.*\d)/.test(formData.password) ? 'text-emerald-500' : 'text-gray-400'}">
              <Check size={12} /> Number
            </span>
          </div>
        {/if}
      </div>

      <!-- Confirm Password -->
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
        <div class="relative">
          <Lock size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            placeholder="••••••••"
            bind:value={formData.confirmPassword}
            class="w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              {errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2"
            onclick={() => showConfirmPassword = !showConfirmPassword}
            aria-label="Toggle confirm password visibility"
          >
            {#if showConfirmPassword}
              <EyeOff size={18} class="text-gray-400 hover:text-gray-600" />
            {:else}
              <Eye size={18} class="text-gray-400 hover:text-gray-600" />
            {/if}
          </button>
        </div>
        {#if errors.confirmPassword}
          <span class="text-xs text-red-500 mt-1 block">{errors.confirmPassword}</span>
        {/if}
      </div>

      <!-- Terms Checkbox -->
      <div>
        <label class="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            bind:checked={formData.agreeTerms}
            class="mt-0.5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
          />
          <span class="text-sm text-gray-600">
            I agree to the
            <a href="/terms" class="text-blue-500 hover:underline font-medium">Terms of Service</a>
            and
            <a href="/privacy" class="text-blue-500 hover:underline font-medium">Privacy Policy</a>
          </span>
        </label>
        {#if errors.agreeTerms}
          <span class="text-xs text-red-500 mt-1 block">{errors.agreeTerms}</span>
        {/if}
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        disabled={isLoading}
        class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold text-sm
          bg-linear-to-r from-blue-500 to-blue-600 shadow-md
          hover:-translate-y-0.5 hover:shadow-blue-200 hover:shadow-lg
          disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
          transition-all duration-200"
      >
        {#if isLoading}
          <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          Creating account...
        {:else}
          Sign Up
          <ArrowRight size={16} />
        {/if}
      </button>

      <!-- Divider -->
      <div class="relative text-center">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <span class="relative bg-white px-4 text-sm text-gray-400">or continue with</span>
      </div>

      <!-- Google Signup -->
      <button
        type="button"
        onclick={handleGoogleSignup}
        disabled={isLoading}
        class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-200 bg-white
          text-sm font-medium text-gray-700
          hover:border-blue-400 hover:bg-gray-50
          disabled:opacity-70 disabled:cursor-not-allowed
          transition-all duration-200"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign up with Google
      </button>

      <p class="text-center text-sm text-gray-500">
        Already have an account?
        <a href="/auth/login" class="text-blue-500 font-medium hover:underline">Sign in</a>
      </p>
    </form>
  </div>
</div>