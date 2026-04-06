<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import {
    Mail, Lock, Eye, EyeOff, User, Phone, Calendar,
    AlertCircle, ArrowRight, ArrowLeft, Check, UserRound,
    Shield, MapPin, Bell, ChevronLeft, Home,
    Sparkles, ShieldCheck, Smartphone, Fingerprint
  } from 'lucide-svelte';

  let currentStep        = $state(1);
  let isLoading          = $state(false);
  let showPassword       = $state(false);
  let showConfirmPassword= $state(false);
  let touched            = $state<Record<string, boolean>>({});
  let errors             = $state<Record<string, string>>({});

  let formData = $state({
    firstName: '', lastName: '', dateOfBirth: '',
    dialCode: '+234', phone: '', email: '', password: '', confirmPassword: ''
  });

  const steps = [
    { number:1, label:'Personal', icon:UserRound, description:'Tell us about yourself'       },
    { number:2, label:'Contact',  icon:Mail,      description:'How to reach you'             },
    { number:3, label:'Security', icon:Shield,    description:'Protect your account'         },
  ];

  // ── Validation ─────────────────────────────────────────
  function validateStep1() {
    const e: Record<string,string> = {};
    if (!formData.firstName.trim())          e.firstName = 'First name is required';
    else if (formData.firstName.length < 2)  e.firstName = 'At least 2 characters';
    if (!formData.lastName.trim())           e.lastName  = 'Last name is required';
    else if (formData.lastName.length < 2)   e.lastName  = 'At least 2 characters';
    if (!formData.dateOfBirth)               e.dateOfBirth = 'Date of birth is required';
    else {
      const age = calcAge(new Date(formData.dateOfBirth));
      if (age < 13)  e.dateOfBirth = 'You must be at least 13 years old';
      if (age > 120) e.dateOfBirth = 'Please enter a valid date';
    }
    return e;
  }

  function validateStep2() {
    const e: Record<string,string> = {};
    const digits = formData.phone.replace(/\D/g,'');
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    else if (digits.length < 5 || digits.length > 15)
      e.phone = 'Enter a valid local number (5–15 digits)';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email))
      e.email = 'Please enter a valid email address';
    return e;
  }

  function validateStep3() {
    const e: Record<string,string> = {};
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 8)  e.password = 'At least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      e.password = 'Must contain uppercase, lowercase, and number';
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    return e;
  }

  function calcAge(d: Date) {
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age;
  }

  // ── Country list (Nigeria first, then alphabetical) ──────
  const countries = [
    { code:'NG', name:'Nigeria',              dial:'+234' },
    { code:'US', name:'United States',        dial:'+1'   },
    { code:'GB', name:'United Kingdom',       dial:'+44'  },
    { code:'GH', name:'Ghana',                dial:'+233' },
    { code:'KE', name:'Kenya',                dial:'+254' },
    { code:'ZA', name:'South Africa',         dial:'+27'  },
    { code:'EG', name:'Egypt',                dial:'+20'  },
    { code:'ET', name:'Ethiopia',             dial:'+251' },
    { code:'TZ', name:'Tanzania',             dial:'+255' },
    { code:'UG', name:'Uganda',               dial:'+256' },
    { code:'RW', name:'Rwanda',               dial:'+250' },
    { code:'SN', name:'Senegal',              dial:'+221' },
    { code:'CI', name:'Côte d\'Ivoire',      dial:'+225' },
    { code:'CM', name:'Cameroon',             dial:'+237' },
    { code:'AO', name:'Angola',               dial:'+244' },
    { code:'MZ', name:'Mozambique',           dial:'+258' },
    { code:'ZM', name:'Zambia',               dial:'+260' },
    { code:'ZW', name:'Zimbabwe',             dial:'+263' },
    { code:'BJ', name:'Benin',                dial:'+229' },
    { code:'TG', name:'Togo',                 dial:'+228' },
    { code:'NE', name:'Niger',                dial:'+227' },
    { code:'ML', name:'Mali',                 dial:'+223' },
    { code:'BF', name:'Burkina Faso',         dial:'+226' },
    { code:'GN', name:'Guinea',               dial:'+224' },
    { code:'SL', name:'Sierra Leone',         dial:'+232' },
    { code:'LR', name:'Liberia',              dial:'+231' },
    { code:'GM', name:'Gambia',               dial:'+220' },
    { code:'MR', name:'Mauritania',           dial:'+222' },
    { code:'MA', name:'Morocco',              dial:'+212' },
    { code:'DZ', name:'Algeria',              dial:'+213' },
    { code:'TN', name:'Tunisia',              dial:'+216' },
    { code:'LY', name:'Libya',                dial:'+218' },
    { code:'SD', name:'Sudan',                dial:'+249' },
    { code:'SO', name:'Somalia',              dial:'+252' },
    { code:'DJ', name:'Djibouti',             dial:'+253' },
    { code:'ER', name:'Eritrea',              dial:'+291' },
    { code:'IN', name:'India',                dial:'+91'  },
    { code:'PK', name:'Pakistan',             dial:'+92'  },
    { code:'BD', name:'Bangladesh',           dial:'+880' },
    { code:'CN', name:'China',                dial:'+86'  },
    { code:'JP', name:'Japan',                dial:'+81'  },
    { code:'KR', name:'South Korea',          dial:'+82'  },
    { code:'PH', name:'Philippines',          dial:'+63'  },
    { code:'ID', name:'Indonesia',            dial:'+62'  },
    { code:'MY', name:'Malaysia',             dial:'+60'  },
    { code:'SG', name:'Singapore',            dial:'+65'  },
    { code:'TH', name:'Thailand',             dial:'+66'  },
    { code:'VN', name:'Vietnam',              dial:'+84'  },
    { code:'AU', name:'Australia',            dial:'+61'  },
    { code:'NZ', name:'New Zealand',          dial:'+64'  },
    { code:'CA', name:'Canada',               dial:'+1'   },
    { code:'MX', name:'Mexico',               dial:'+52'  },
    { code:'BR', name:'Brazil',               dial:'+55'  },
    { code:'AR', name:'Argentina',            dial:'+54'  },
    { code:'CO', name:'Colombia',             dial:'+57'  },
    { code:'DE', name:'Germany',              dial:'+49'  },
    { code:'FR', name:'France',               dial:'+33'  },
    { code:'IT', name:'Italy',                dial:'+39'  },
    { code:'ES', name:'Spain',                dial:'+34'  },
    { code:'PT', name:'Portugal',             dial:'+351' },
    { code:'NL', name:'Netherlands',          dial:'+31'  },
    { code:'BE', name:'Belgium',              dial:'+32'  },
    { code:'SE', name:'Sweden',               dial:'+46'  },
    { code:'NO', name:'Norway',               dial:'+47'  },
    { code:'DK', name:'Denmark',              dial:'+45'  },
    { code:'FI', name:'Finland',              dial:'+358' },
    { code:'PL', name:'Poland',               dial:'+48'  },
    { code:'UA', name:'Ukraine',              dial:'+380' },
    { code:'RU', name:'Russia',               dial:'+7'   },
    { code:'TR', name:'Turkey',               dial:'+90'  },
    { code:'SA', name:'Saudi Arabia',         dial:'+966' },
    { code:'AE', name:'UAE',                  dial:'+971' },
    { code:'QA', name:'Qatar',                dial:'+974' },
    { code:'KW', name:'Kuwait',               dial:'+965' },
    { code:'IL', name:'Israel',               dial:'+972' },
    { code:'JO', name:'Jordan',               dial:'+962' },
    { code:'LB', name:'Lebanon',              dial:'+961' },
    { code:'IQ', name:'Iraq',                 dial:'+964' },
    { code:'IR', name:'Iran',                 dial:'+98'  },
  ];

  let showCountryDrop = $state(false);
  let countrySearch   = $state('');

  const filteredCountries = $derived(
    countrySearch.trim()
      ? countries.filter(c =>
          c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
          c.dial.includes(countrySearch)
        )
      : countries
  );

  function selectCountry(dial: string) {
    formData.dialCode = dial;
    showCountryDrop = false;
    countrySearch = '';
  }

  function handlePhoneInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value.replace(/[^\d\s\-\(\)]/g, '');
    formData.phone = raw;
  }

  function getFlag(code: string) {
    return [...code].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
  }

  const selectedCountry = $derived(
    countries.find(c => c.dial === formData.dialCode) ?? countries[0]
  );

  // ── Navigation ─────────────────────────────────────────
  function handleNextStep(e: Event) {
    e.preventDefault();
    const errs = currentStep === 1 ? validateStep1() : validateStep2();
    if (Object.keys(errs).length === 0) {
      currentStep++;
      errors = {};
      window.scrollTo({ top:0, behavior:'smooth' });
    } else {
      errors = errs;
      Object.keys(errs).forEach(k => { touched[k] = true; });
    }
  }

  function handlePreviousStep() {
    if (currentStep > 1) {
      currentStep--;
      errors = {};
      window.scrollTo({ top:0, behavior:'smooth' });
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const errs = validateStep3();
    if (Object.keys(errs).length > 0) {
      errors = errs;
      Object.keys(errs).forEach(k => { touched[k] = true; });
      return;
    }
    isLoading = true;
    errors = {};
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName:  formData.lastName.trim(),
          dateOfBirth: formData.dateOfBirth,
          phone:     `${formData.dialCode}${formData.phone}`,
          email:     formData.email.trim().toLowerCase(),
          password:  formData.password,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Signup failed');
      await authStore.login(formData.email, formData.password);
      goto('/dashboard');
    } catch (err: unknown) {
      errors.submit = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      isLoading = false;
    }
  }

  // ── Password strength ──────────────────────────────────
  const passwordStrength = $derived(() => {
    if (!formData.password) return 0;
    let s = 0;
    if (formData.password.length >= 8)            s++;
    if (/(?=.*[a-z])/.test(formData.password))    s++;
    if (/(?=.*[A-Z])/.test(formData.password))    s++;
    if (/(?=.*\d)/.test(formData.password))       s++;
    if (/(?=.*[^a-zA-Z0-9])/.test(formData.password)) s++;
    return s;
  });

  const strengthLabel = $derived(() => {
    const s = passwordStrength();
    if (s <= 1) return { text:'Weak',   color:'#dc2626', width:'20%'  };
    if (s <= 2) return { text:'Fair',   color:'#f59e0b', width:'45%'  };
    if (s <= 3) return { text:'Good',   color:'#6a2c91', width:'70%'  };
    return            { text:'Strong', color:'#4b1d68', width:'100%' };
  });

  // Inline blur validators
  function blurField(field: string, validator: () => Record<string,string>) {
    touched[field] = true;
    errors[field] = validator()[field] || '';
  }
</script>

<svelte:head>
  <title>Sign Up – Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="su-page">

  <!-- LEFT PANEL (desktop ≥1024px) -->
  <aside class="su-panel">
    <div class="su-panel-inner">

      <a href="/" class="su-logo-link">
        <img src="/icons/lz_logo_t.png" alt="Lezie" class="su-logo-img" />
      </a>

      <div class="su-panel-hero">
        <div class="su-panel-badge">
          <Sparkles size={14} />
          <span>Join 12,400+ members</span>
        </div>
        <h2 class="su-panel-headline">
          Safer streets start<br/>
          <em>with you.</em>
        </h2>
        <p class="su-panel-desc">
          Join thousands of neighbours already using Lezie to report
          incidents, share alerts, and protect their communities in real-time.
        </p>
      </div>

      <div class="su-features">
        {#each [
          { icon:MapPin,      title:'Live Incident Map',   desc:'See what\'s happening near you right now' },
          { icon:Bell,        title:'Instant Alerts',      desc:'Get notified when safety events occur nearby' },
          { icon:ShieldCheck, title:'Trusted Community',   desc:'Verified neighbours, reliable reports' },
        ] as f}
          <div class="su-feature-card">
            <div class="su-feature-icon"><f.icon size={18} /></div>
            <div>
              <strong>{f.title}</strong>
              <span>{f.desc}</span>
            </div>
          </div>
        {/each}
      </div>

      <div class="su-panel-footer">
        <div class="su-avatars">
          {#each ['#c4b5fd','#a78bfa','#8b5cf6','#6a2c91'] as bg}
            <div class="su-avatar" style="background:{bg}"></div>
          {/each}
          <div class="su-avatar-count">+12k</div>
        </div>
        <p>Trusted by communities worldwide</p>
      </div>

    </div>
    <div class="su-panel-glow"></div>
  </aside>

  <!-- RIGHT / FORM -->
  <main class="su-main">
    <div class="su-form-shell">

      <!-- Back to home -->
      <button class="su-back-home" onclick={() => goto('/')}>
        <ChevronLeft size={18} />
        <Home size={14} />
        <span>Back to Home</span>
      </button>

      <!-- Mobile logo -->
      <div class="su-mobile-brand">
        <a href="/"><img src="/icons/lz_ico.png" alt="Lezie" class="su-logo-img-mobile" /></a>
      </div>

      <!-- Header -->
      <div class="su-form-header">
        <h1 class="su-form-title">Create your account</h1>
        <p class="su-form-subtitle">{steps[currentStep - 1].description}</p>
      </div>

      <!-- Progress stepper -->
      <div class="su-progress-track">
        {#each steps as step, idx}
          <div class="su-progress-step-wrap">
            <div class="su-progress-step {currentStep >= step.number ? 'active' : ''} {currentStep > step.number ? 'done' : ''}">
              <div class="su-step-bubble">
                {#if currentStep > step.number}
                  <Check size={14} strokeWidth={3} />
                {:else}
                  <svelte:component this={step.icon} size={14} />
                {/if}
              </div>
              <span class="su-step-label">{step.label}</span>
            </div>
            {#if idx < steps.length - 1}
              <div class="su-step-connector {currentStep > step.number ? 'filled' : ''}"></div>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Form card -->
      <div class="su-card">
        {#if errors.submit}
          <div class="su-alert-error">
            <AlertCircle size={18} /><span>{errors.submit}</span>
          </div>
        {/if}

        <form onsubmit={currentStep === 3 ? handleSubmit : handleNextStep}>

          <!-- STEP 1 -->
          {#if currentStep === 1}
            <div class="su-step-body" style="animation:stepIn .3s ease both">
              <div class="su-welcome-msg">
                <UserRound size={20} />
                <div><strong>Welcome!</strong><span>Let's start with your basic information</span></div>
              </div>

              <div class="su-field-row">
                <div class="su-field">
                  <label class="su-label" for="firstName">First Name <span class="su-req">*</span></label>
                  <div class="su-input-wrap">
                    <span class="su-ico"><User size={16} /></span>
                    <input id="firstName" type="text" placeholder="John"
                      bind:value={formData.firstName}
                      onblur={() => blurField('firstName', validateStep1)}
                      class="su-input {errors.firstName && touched.firstName ? 'su-input--err' : ''}" />
                  </div>
                  {#if errors.firstName && touched.firstName}<p class="su-err">{errors.firstName}</p>{/if}
                </div>
                <div class="su-field">
                  <label class="su-label" for="lastName">Last Name <span class="su-req">*</span></label>
                  <div class="su-input-wrap">
                    <span class="su-ico"><User size={16} /></span>
                    <input id="lastName" type="text" placeholder="Doe"
                      bind:value={formData.lastName}
                      onblur={() => blurField('lastName', validateStep1)}
                      class="su-input {errors.lastName && touched.lastName ? 'su-input--err' : ''}" />
                  </div>
                  {#if errors.lastName && touched.lastName}<p class="su-err">{errors.lastName}</p>{/if}
                </div>
              </div>

              <div class="su-field">
                <label class="su-label" for="dob">Date of Birth <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <span class="su-ico"><Calendar size={16} /></span>
                  <input id="dob" type="date"
                    bind:value={formData.dateOfBirth}
                    onblur={() => blurField('dateOfBirth', validateStep1)}
                    max={new Date().toISOString().split('T')[0]}
                    class="su-input su-input--date {errors.dateOfBirth && touched.dateOfBirth ? 'su-input--err' : ''}" />
                </div>
                {#if errors.dateOfBirth && touched.dateOfBirth}
                  <p class="su-err">{errors.dateOfBirth}</p>
                {:else}
                  <p class="su-hint">You must be at least 13 years old to join</p>
                {/if}
              </div>
            </div>
          {/if}

          <!-- STEP 2 -->
          {#if currentStep === 2}
            <div class="su-step-body" style="animation:stepIn .3s ease both">
              <div class="su-welcome-msg">
                <Smartphone size={20} />
                <div><strong>Contact Details</strong><span>How we'll reach you for important alerts</span></div>
              </div>

              <div class="su-field">
                <label class="su-label" for="phone">Phone Number <span class="su-req">*</span></label>
                <div class="su-phone-row">

                  <!-- Country code picker -->
                  <div class="su-dial-wrap">
                    <button type="button" class="su-dial-btn" onclick={() => showCountryDrop = !showCountryDrop}>
                      <span class="su-flag">{getFlag(selectedCountry.code)}</span>
                      <span class="su-dial-code">{formData.dialCode}</span>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" class={showCountryDrop ? 'su-chevron-open' : ''}>
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </button>

                    {#if showCountryDrop}
                      <div class="su-country-drop-overlay" onclick={() => showCountryDrop = false}></div>
                      <div class="su-country-drop">
                        <div class="su-country-search-wrap">
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" class="su-csearch-ico"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                          <input
                            type="text"
                            placeholder="Search country or code…"
                            bind:value={countrySearch}
                            class="su-country-search"
                            autofocus
                          />
                        </div>
                        <ul class="su-country-list">
                          {#each filteredCountries as c}
                            <li>
                              <button type="button"
                                class="su-country-opt {formData.dialCode === c.dial && selectedCountry.code === c.code ? 'su-country-opt--active' : ''}"
                                onclick={() => selectCountry(c.dial)}
                              >
                                <span class="su-flag">{getFlag(c.code)}</span>
                                <span class="su-country-name">{c.name}</span>
                                <span class="su-country-dial">{c.dial}</span>
                              </button>
                            </li>
                          {/each}
                          {#if filteredCountries.length === 0}
                            <li class="su-country-empty">No countries found</li>
                          {/if}
                        </ul>
                      </div>
                    {/if}
                  </div>

                  <!-- Phone number field -->
                  <div class="su-input-wrap su-phone-input-wrap">
                    <input id="phone" type="tel" placeholder="0 801 234 5678"
                      bind:value={formData.phone}
                      oninput={handlePhoneInput}
                      onblur={() => blurField('phone', validateStep2)}
                      class="su-input su-phone-input {errors.phone && touched.phone ? 'su-input--err' : ''}" />
                  </div>
                </div>

                {#if errors.phone && touched.phone}
                  <p class="su-err">{errors.phone}</p>
                {:else}
                  <p class="su-hint">
                    Full number: <strong>{formData.dialCode} {formData.phone}</strong>
                    · Used for critical safety alerts
                  </p>
                {/if}
              </div>

              <div class="su-field">
                <label class="su-label" for="email">Email Address <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <span class="su-ico"><Mail size={16} /></span>
                  <input id="email" type="email" placeholder="you@example.com"
                    bind:value={formData.email}
                    onblur={() => blurField('email', validateStep2)}
                    class="su-input {errors.email && touched.email ? 'su-input--err' : ''}" />
                </div>
                {#if errors.email && touched.email}
                  <p class="su-err">{errors.email}</p>
                {:else}
                  <p class="su-hint">We'll send a verification link to this address</p>
                {/if}
              </div>
            </div>
          {/if}

          <!-- STEP 3 -->
          {#if currentStep === 3}
            <div class="su-step-body" style="animation:stepIn .3s ease both">
              <div class="su-welcome-msg">
                <Fingerprint size={20} />
                <div><strong>Secure Your Account</strong><span>Create a strong password to stay safe</span></div>
              </div>

              <div class="su-field">
                <label class="su-label" for="password">Password <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <span class="su-ico"><Lock size={16} /></span>
                  <input id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    bind:value={formData.password}
                    onblur={() => blurField('password', validateStep3)}
                    class="su-input su-input--toggle {errors.password && touched.password ? 'su-input--err' : ''}" />
                  <button type="button" class="su-eye" onclick={() => showPassword = !showPassword}>
                    {#if showPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
                  </button>
                </div>
                {#if errors.password && touched.password}
                  <p class="su-err">{errors.password}</p>
                {:else if formData.password}
                  <div class="su-strength">
                    <div class="su-strength-track">
                      <div class="su-strength-fill" style="width:{strengthLabel().width};background:{strengthLabel().color}"></div>
                    </div>
                    <span style="color:{strengthLabel().color};font-size:.688rem;font-weight:700;min-width:44px;text-align:right">{strengthLabel().text}</span>
                  </div>
                  <div class="su-hints">
                    {#each [
                      [formData.password.length >= 8,              '8+ characters'   ],
                      [/(?=.*[A-Z])/.test(formData.password),      'Uppercase'  ],
                      [/(?=.*[a-z])/.test(formData.password),      'Lowercase'  ],
                      [/(?=.*\d)/.test(formData.password),         'Number'     ],
                    ] as [ok, lbl]}
                      <span class={ok ? 'su-hint-ok' : 'su-hint-no'}>
                        {#if ok}<Check size={9} />{/if}{lbl}
                      </span>
                    {/each}
                  </div>
                {/if}
              </div>

              <div class="su-field">
                <label class="su-label" for="confirmPw">Confirm Password <span class="su-req">*</span></label>
                <div class="su-input-wrap">
                  <span class="su-ico"><Lock size={16} /></span>
                  <input id="confirmPw"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    bind:value={formData.confirmPassword}
                    onblur={() => blurField('confirmPassword', validateStep3)}
                    class="su-input su-input--toggle {errors.confirmPassword && touched.confirmPassword ? 'su-input--err' : ''}" />
                  <button type="button" class="su-eye" onclick={() => showConfirmPassword = !showConfirmPassword}>
                    {#if showConfirmPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
                  </button>
                </div>
                {#if errors.confirmPassword && touched.confirmPassword}
                  <p class="su-err">{errors.confirmPassword}</p>
                {:else if formData.confirmPassword && formData.password === formData.confirmPassword}
                  <p class="su-hint su-hint--ok"><Check size={12} /> Passwords match</p>
                {/if}
              </div>

              <label class="su-terms">
                <input type="checkbox" class="su-checkbox" required />
                I agree to the <a href="/terms" class="su-link">Terms of Service</a> and
                <a href="/privacy" class="su-link">Privacy Policy</a>
              </label>
            </div>
          {/if}

          <!-- Actions -->
          <div class="su-actions">
            {#if currentStep > 1}
              <button type="button" class="su-btn-back" onclick={handlePreviousStep}>
                <ArrowLeft size={15} /> Back
              </button>
            {/if}
            <button type="submit" disabled={isLoading} class="su-btn-next {currentStep === 1 ? 'su-btn-next--full' : ''}">
              {#if isLoading}
                <span class="su-spinner"></span> Creating account…
              {:else if currentStep === 3}
                Create Account <ArrowRight size={15} />
              {:else}
                Continue <ArrowRight size={15} />
              {/if}
            </button>
          </div>
        </form>
      </div>

      <p class="su-footer-text">
        Already have an account? <a href="/auth/signin" class="su-link">Sign in</a>
      </p>
    </div>
  </main>

</div>
<style>
  :global(.su-page *) { 
    font-family: 'DM Sans', system-ui, sans-serif; 
    box-sizing: border-box; 
  }

  .su-page { 
    display: flex; 
    min-height: 100vh; 
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%); 
  }

  /* LEFT PANEL - Exact match to sign-in page */
  .su-panel { 
    display: none; 
    position: relative; 
    width: 440px; 
    flex-shrink: 0; 
    background: linear-gradient(160deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%); 
    overflow: hidden; 
  }

  @media (min-width: 1024px) { 
    .su-panel { display: flex; } 
  }

  .su-panel-inner { 
    position: relative; 
    z-index: 2; 
    display: flex; 
    flex-direction: column; 
    padding: 2.5rem; 
    height: 100%; 
  }

  .su-panel-glow { 
    position: absolute; 
    inset: 0; 
    z-index: 1; 
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%); 
    pointer-events: none; 
  }

  .su-logo-link { 
    display: inline-block; 
    line-height: 0; 
    margin-bottom: 2.5rem; 
    transition: transform 0.2s, opacity 0.2s; 
  }

  .su-logo-link:hover { 
    opacity: 0.85; 
    transform: scale(1.02); 
  }

  .su-logo-img { 
    width: 80px; 
    height: 80px; 
    object-fit: contain; 
    display: block; 
  }

  .su-panel-badge { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.375rem 0.875rem; 
    background: rgba(139,92,246,0.2); 
    border: 1px solid rgba(139,92,246,0.3); 
    border-radius: 100px; 
    font-size: 0.75rem; 
    color: #c4b5fd; 
    margin-bottom: 1.5rem; 
  }

  .su-panel-headline { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 2.5rem; 
    line-height: 1.2; 
    color: white; 
    margin-bottom: 1rem; 
  }

  .su-panel-headline em { 
    color: #c4b5fd; 
    font-style: italic; 
  }

  .su-panel-desc { 
    font-size: 0.875rem; 
    line-height: 1.6; 
    color: rgba(196,181,253,0.85); 
    margin-bottom: 2rem; 
  }

  .su-features { 
    display: flex; 
    flex-direction: column; 
    gap: 1rem; 
    margin-bottom: auto; 
  }

  .su-feature-card { 
    display: flex; 
    align-items: flex-start; 
    gap: 0.875rem; 
    padding: 0.875rem; 
    background: rgba(255,255,255,0.05); 
    border-radius: 1rem; 
    backdrop-filter: blur(10px); 
    transition: background 0.2s; 
  }

  .su-feature-card:hover { 
    background: rgba(255,255,255,0.08); 
  }

  .su-feature-icon { 
    width: 36px; 
    height: 36px; 
    background: rgba(139,92,246,0.2); 
    border-radius: 10px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: #c4b5fd; 
    flex-shrink: 0; 
  }

  .su-feature-card strong { 
    display: block; 
    font-size: 0.813rem; 
    font-weight: 600; 
    color: white; 
    margin-bottom: 0.25rem; 
  }

  .su-feature-card span { 
    font-size: 0.75rem; 
    color: rgba(196,181,253,0.8); 
    line-height: 1.4; 
  }

  .su-panel-footer { 
    margin-top: 2rem; 
    padding-top: 1.5rem; 
    border-top: 1px solid rgba(255,255,255,0.1); 
  }

  .su-avatars { 
    display: flex; 
    align-items: center; 
    margin-bottom: 0.75rem; 
  }

  .su-avatar { 
    width: 32px; 
    height: 32px; 
    border-radius: 50%; 
    border: 2px solid #2d1b4e; 
    margin-left: -8px; 
  }

  .su-avatar:first-child { 
    margin-left: 0; 
  }

  .su-avatar-count { 
    width: 32px; 
    height: 32px; 
    border-radius: 50%; 
    background: rgba(139,92,246,0.3); 
    border: 2px solid #2d1b4e; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 0.688rem; 
    font-weight: 600; 
    color: white; 
    margin-left: -8px; 
  }

  .su-panel-footer p { 
    font-size: 0.688rem; 
    color: rgba(196,181,253,0.7); 
  }

  /* RIGHT PANEL - Exact match to sign-in page patterns */
  .su-main { 
    flex: 1; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    padding: 2rem 1.25rem; 
    min-height: 100vh; 
  }

  .su-form-shell { 
    width: 100%; 
    max-width: 500px; 
    display: flex; 
    flex-direction: column; 
    gap: 1.5rem; 
  }

  .su-back-home { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    background: white; 
    border: 1px solid #e5e7eb; 
    border-radius: 100px; 
    padding: 0.5rem 1rem; 
    font-size: 0.813rem; 
    font-weight: 500; 
    color: #64748b; 
    cursor: pointer; 
    transition: all 0.2s; 
    width: fit-content; 
    box-shadow: 0 1px 2px rgba(0,0,0,0.05); 
  }

  .su-back-home:hover { 
    border-color: #6a2c91; 
    color: #6a2c91; 
    background: #f3e8ff; 
    transform: translateX(-2px); 
  }

  .su-mobile-brand { 
    display: flex; 
    justify-content: center; 
  }

  .su-logo-img-mobile { 
    width: 80px; 
    height: 80px; 
    object-fit: contain; 
  }

  @media (min-width: 1024px) { 
    .su-mobile-brand { display: none; } 
  }

  .su-form-header { 
    text-align: center; 
  }

  .su-form-title { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: clamp(1.625rem, 4vw, 2rem); 
    color: #1e1b4b; 
    margin-bottom: 0.25rem; 
    letter-spacing: -0.02em; 
  }

  .su-form-subtitle { 
    font-size: 0.875rem; 
    color: #64748b; 
  }

  /* Stepper - Yellow/Orange kept as requested */
  .su-progress-track { 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    gap: 0.5rem; 
  }

  .su-progress-step-wrap { 
    display: flex; 
    align-items: center; 
  }

  .su-progress-step { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 0.4rem; 
  }

  .su-step-connector { 
    width: 64px; 
    height: 2px; 
    margin: 0 0.375rem; 
    background: #e2e8f0; 
    transition: background 0.35s; 
    margin-bottom: 1.125rem; 
  }

  .su-step-connector.filled { 
    background: #1a0b2e; 
  }

  .su-step-bubble { 
    width: 38px; 
    height: 38px; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    background: rgba(245,158,11,0.12); 
    border: 2px solid #F59E0B; 
    color: #F59E0B; 
    transition: all 0.3s; 
  }

  .su-progress-step.active .su-step-bubble { 
    background: #6a2c91; 
    border-color: #6a2c91; 
    color: white; 
    box-shadow: 0 0 0 4px rgba(106,44,145,0.15); 
  }

  .su-progress-step.done .su-step-bubble { 
    background: #1a0b2e; 
    border-color: #1a0b2e; 
    color: white; 
  }

  .su-step-label { 
    font-size: 0.6875rem; 
    font-weight: 500; 
    color: #F59E0B; 
    transition: color 0.3s; 
  }

  .su-progress-step.active .su-step-label { 
    color: #6a2c91; 
    font-weight: 700; 
  }

  .su-progress-step.done .su-step-label { 
    color: #1a0b2e; 
    font-weight: 600; 
  }

  /* Form Card */
  .su-card { 
    background: white; 
    border-radius: 1.5rem; 
    border: 1px solid #e2e8f0; 
    padding: clamp(1.25rem, 5vw, 2rem); 
    box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1); 
  }

  .su-alert-error { 
    display: flex; 
    align-items: center; 
    gap: 0.625rem; 
    padding: 0.75rem 1rem; 
    background: #fef2f2; 
    border: 1px solid #fecaca; 
    border-radius: 0.75rem; 
    color: #dc2626; 
    font-size: 0.813rem; 
    margin-bottom: 1.5rem; 
  }

  .su-step-body { 
    display: flex; 
    flex-direction: column; 
    gap: 1.125rem; 
  }

  .su-welcome-msg { 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    padding: 0.875rem 1rem; 
    background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%); 
    border-radius: 1rem; 
    margin-bottom: 1.5rem; 
  }

  .su-welcome-msg :global(svg) { 
    color: #6a2c91; 
    flex-shrink: 0; 
  }

  .su-welcome-msg strong { 
    display: block; 
    font-size: 0.875rem; 
    font-weight: 700; 
    color: #1e1b4b; 
  }

  .su-welcome-msg span { 
    font-size: 0.75rem; 
    color: #64748b; 
  }

  .su-field-row { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 0.875rem; 
  }

  @media (max-width: 480px) { 
    .su-field-row { 
      grid-template-columns: 1fr; 
    } 
  }

  .su-field { 
    display: flex; 
    flex-direction: column; 
    gap: 0.375rem; 
  }

  .su-label { 
    font-size: 0.813rem; 
    font-weight: 600; 
    color: #374151; 
  }

  .su-req { 
    color: #6a2c91; 
  }

  .su-input-wrap { 
    position: relative; 
  }

  .su-ico { 
    position: absolute; 
    left: 0.875rem; 
    top: 50%; 
    transform: translateY(-50%); 
    color: #9ca3af; 
    display: flex; 
    align-items: center; 
    pointer-events: none; 
  }

  .su-input { 
    width: 100%; 
    padding: 0.75rem 0.875rem 0.75rem 2.625rem; 
    border: 1.5px solid #e5e7eb; 
    border-radius: 0.75rem; 
    font-size: 0.875rem; 
    font-family: 'DM Sans', sans-serif; 
    color: #1e1b4b; 
    background: white; 
    transition: all 0.2s; 
    outline: none; 
  }

  .su-input:hover { 
    border-color: #c4b5fd; 
  }

  .su-input:focus { 
    border-color: #6a2c91; 
    box-shadow: 0 0 0 3px rgba(106,44,145,0.1); 
  }

  .su-input--err { 
    border-color: #f87171; 
    background: #fff5f5; 
  }

  .su-input--toggle { 
    padding-right: 2.75rem; 
  }

  .su-input--date { 
    color: #374151; 
  }

  /* Phone row */
  .su-phone-row { 
    display: flex; 
    gap: 0.5rem; 
    align-items: stretch; 
  }

  .su-dial-wrap { 
    position: relative; 
    flex-shrink: 0; 
  }

  .su-dial-btn { 
    display: flex; 
    align-items: center; 
    gap: 0.375rem; 
    height: 100%; 
    padding: 0 0.75rem; 
    background: white; 
    border: 1.5px solid #e5e7eb; 
    border-radius: 0.75rem; 
    cursor: pointer; 
    font-family: 'DM Sans', sans-serif; 
    font-size: 0.8125rem; 
    font-weight: 600; 
    color: #1e1b4b; 
    white-space: nowrap; 
    transition: all 0.2s; 
    min-height: 44px; 
  }

  .su-dial-btn:hover { 
    border-color: #6a2c91; 
    background: #f3e8ff; 
  }

  .su-flag { 
    font-size: 1.125rem; 
    line-height: 1; 
  }

  .su-dial-code { 
    font-size: 0.8rem; 
  }

  .su-dial-btn svg { 
    color: #64748b; 
    transition: transform 0.2s; 
  }

  :global(.su-chevron-open) { 
    transform: rotate(180deg); 
  }

  /* Country dropdown */
  .su-country-drop-overlay { 
    position: fixed; 
    inset: 0; 
    z-index: 40; 
  }

  .su-country-drop { 
    position: absolute; 
    top: calc(100% + 0.375rem); 
    left: 0; 
    width: 280px; 
    background: white; 
    border: 1.5px solid #e5e7eb; 
    border-radius: 1rem; 
    box-shadow: 0 12px 32px rgba(0,0,0,0.12); 
    z-index: 50; 
    overflow: hidden; 
  }

  .su-country-search-wrap { 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.625rem 0.875rem; 
    border-bottom: 1px solid #f1f5f9; 
  }

  .su-csearch-ico { 
    color: #94a3b8; 
    flex-shrink: 0; 
  }

  .su-country-search { 
    flex: 1; 
    border: none; 
    outline: none; 
    background: none; 
    font-size: 0.8125rem; 
    font-family: 'DM Sans', sans-serif; 
    color: #1e1b4b; 
  }

  .su-country-search::placeholder { 
    color: #94a3b8; 
  }

  .su-country-list { 
    list-style: none; 
    max-height: 220px; 
    overflow-y: auto; 
    padding: 0.375rem; 
  }

  .su-country-list::-webkit-scrollbar { 
    width: 4px; 
  }

  .su-country-list::-webkit-scrollbar-track { 
    background: transparent; 
  }

  .su-country-list::-webkit-scrollbar-thumb { 
    background: #e5e7eb; 
    border-radius: 2px; 
  }

  .su-country-opt { 
    display: flex; 
    align-items: center; 
    gap: 0.625rem; 
    width: 100%; 
    padding: 0.5rem 0.625rem; 
    background: none; 
    border: none; 
    border-radius: 0.625rem; 
    cursor: pointer; 
    text-align: left; 
    font-family: 'DM Sans', sans-serif; 
    transition: background 0.15s; 
  }

  .su-country-opt:hover { 
    background: #f3e8ff; 
  }

  .su-country-opt--active { 
    background: #f3e8ff; 
    color: #6a2c91; 
  }

  .su-country-name { 
    flex: 1; 
    font-size: 0.8rem; 
    color: #1e1b4b; 
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis; 
  }

  .su-country-dial { 
    font-size: 0.75rem; 
    font-weight: 700; 
    color: #6a2c91; 
    flex-shrink: 0; 
  }

  .su-country-opt--active .su-country-name { 
    color: #6a2c91; 
  }

  .su-country-empty { 
    padding: 0.75rem; 
    font-size: 0.8rem; 
    color: #64748b; 
    text-align: center; 
  }

  .su-phone-input-wrap { 
    flex: 1; 
  }

  .su-phone-input { 
    padding-left: 0.875rem !important; 
  }

  .su-eye { 
    position: absolute; 
    right: 0.75rem; 
    top: 50%; 
    transform: translateY(-50%); 
    background: none; 
    border: none; 
    cursor: pointer; 
    color: #9ca3af; 
    display: flex; 
    padding: 0.25rem; 
    transition: color 0.2s; 
  }

  .su-eye:hover { 
    color: #6a2c91; 
  }

  .su-err { 
    font-size: 0.75rem; 
    color: #dc2626; 
    display: flex; 
    align-items: center; 
    gap: 0.25rem; 
  }

  .su-hint { 
    font-size: 0.688rem; 
    color: #94a3b8; 
  }

  .su-hint--ok { 
    color: #6a2c91; 
    display: flex; 
    align-items: center; 
    gap: 0.25rem; 
    font-weight: 500; 
  }

  /* Password strength */
  .su-strength { 
    display: flex; 
    align-items: center; 
    gap: 0.625rem; 
    margin-top: 0.375rem; 
  }

  .su-strength-track { 
    flex: 1; 
    height: 4px; 
    background: #e5e7eb; 
    border-radius: 2px; 
    overflow: hidden; 
  }

  .su-strength-fill { 
    height: 100%; 
    border-radius: 2px; 
    transition: width 0.3s ease, background 0.3s ease; 
  }

  .su-hints { 
    display: flex; 
    flex-wrap: wrap; 
    gap: 0.5rem; 
    margin-top: 0.5rem; 
  }

  .su-hint-ok, 
  .su-hint-no { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.3rem; 
    font-size: 0.7rem; 
    font-weight: 500; 
    padding: 0.25rem 0.7rem; 
    border-radius: 100px; 
    transition: all 0.2s; 
  }

  .su-hint-ok { 
    background: #f3e8ff; 
    color: #4b1d68; 
    border: 1px solid #ddd6fe; 
  }

  .su-hint-no { 
    background: #f8fafc; 
    color: #94a3b8; 
    border: 1px solid #e2e8f0; 
  }

  /* Terms */
  .su-terms { 
    display: flex; 
    align-items: flex-start; 
    gap: 0.625rem; 
    font-size: 0.8125rem; 
    color: #4b5563; 
    line-height: 1.5; 
    cursor: pointer; 
    margin-top: 0.5rem; 
  }

  .su-checkbox { 
    width: 16px; 
    height: 16px; 
    margin-top: 2px; 
    flex-shrink: 0; 
    accent-color: #6a2c91; 
    cursor: pointer; 
  }

  /* Actions */
  .su-actions { 
    display: flex; 
    gap: 0.75rem; 
    align-items: center; 
    margin-top: 1.75rem; 
  }

  .su-btn-back { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.375rem; 
    padding: 0.75rem 1.125rem; 
    background: white; 
    border: 1.5px solid #e5e7eb; 
    border-radius: 0.75rem; 
    font-size: 0.875rem; 
    font-weight: 500; 
    color: #64748b; 
    cursor: pointer; 
    font-family: 'DM Sans', sans-serif; 
    transition: all 0.2s; 
    flex-shrink: 0; 
  }

  .su-btn-back:hover { 
    border-color: #6a2c91; 
    color: #6a2c91; 
    background: #f3e8ff; 
    transform: translateX(-2px); 
  }

  .su-btn-next { 
    flex: 1; 
    display: inline-flex; 
    align-items: center; 
    justify-content: center; 
    gap: 0.5rem; 
    padding: 0.8125rem 1.25rem; 
    background: linear-gradient(135deg, #6a2c91 0%, #4a1d6e 100%); 
    color: white; 
    border: none; 
    border-radius: 0.75rem; 
    font-size: 0.9375rem; 
    font-weight: 600; 
    font-family: 'DM Sans', sans-serif; 
    cursor: pointer; 
    box-shadow: 0 4px 14px rgba(106,44,145,0.3); 
    transition: all 0.2s; 
  }

  .su-btn-next:hover:not(:disabled) { 
    transform: translateY(-2px); 
    box-shadow: 0 6px 20px rgba(106,44,145,0.4); 
  }

  .su-btn-next:active:not(:disabled) { 
    transform: translateY(0); 
  }

  .su-btn-next:disabled { 
    opacity: 0.65; 
    cursor: not-allowed; 
  }

  .su-btn-next--full { 
    flex: 1; 
  }

  .su-link { 
    color: #6a2c91; 
    font-weight: 500; 
    text-decoration: none; 
  }

  .su-link:hover { 
    text-decoration: underline; 
  }

  .su-footer-text { 
    text-align: center; 
    font-size: 0.875rem; 
    color: #64748b; 
  }

  /* Spinner */
  .su-spinner { 
    width: 16px; 
    height: 16px; 
    border: 2px solid rgba(255,255,255,0.3); 
    border-top-color: white; 
    border-radius: 50%; 
    animation: spin 0.6s linear infinite; 
    flex-shrink: 0; 
  }

  @keyframes spin { 
    to { transform: rotate(360deg); } 
  }

  @keyframes stepIn { 
    from { opacity: 0; transform: translateX(14px); } 
    to { opacity: 1; transform: translateX(0); } 
  }

  /* Responsive */
  @media (max-width: 640px) {
    .su-main { 
      padding: 1.5rem 1rem; 
      align-items: flex-start; 
    }
    
    .su-form-shell { 
      gap: 1.125rem; 
    }
    
    .su-card { 
      border-radius: 1.25rem; 
    }
    
    .su-step-connector { 
      width: 36px; 
    }
    
    .su-step-bubble { 
      width: 34px; 
      height: 34px; 
    }
    
    .su-actions { 
      flex-direction: column-reverse; 
    }
    
    .su-btn-back { 
      width: 100%; 
      justify-content: center; 
    }
    
    .su-btn-next { 
      width: 100%; 
    }
  }

  @media (max-width: 380px) {
    .su-step-connector { 
      width: 20px; 
    }
    
    .su-step-label { 
      font-size: 0.5625rem; 
    }
  }
</style>
