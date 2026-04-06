<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    ArrowRight,
    CheckCircle,
    AlertCircle,
    User,
    Mail,
    MessageSquare,
    Home,
    ChevronLeft,
    ShieldCheck,
    Users,
    PhoneCall,
    Send,
    Sparkles,
    Clock,
    MapPin
  } from 'lucide-svelte';

  let isLoading = $state(false);
  let submitted = $state(false);
  let errors = $state<Record<string, string>>({});
  let touched = $state<Record<string, boolean>>({});

  let formData = $state({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  function validateForm() {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Please enter your full name';
    if (!formData.email.trim()) {
      e.email = 'Email address is required';
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
      e.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) e.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      e.message = 'Please provide at least 10 characters';
    }
    return e;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      errors = errs;
      Object.keys(errs).forEach(key => touched[key] = true);
      return;
    }

    isLoading = true;
    errors = {};

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to send message');
      
      submitted = true;
      formData = { name: '', email: '', subject: '', message: '' };
      touched = {};
    } catch (err) {
      errors.submit = 'Something went wrong. Please try again later.';
    } finally {
      isLoading = false;
    }
  }

  function handleBlur(field: string) {
    touched[field] = true;
    const fieldErrors = validateForm();
    if (fieldErrors[field]) {
      errors = { ...errors, [field]: fieldErrors[field] };
    } else {
      const { [field]: _, ...rest } = errors;
      errors = rest;
    }
  }

  function handleInput(field: string) {
    if (touched[field] && errors[field]) {
      const fieldErrors = validateForm();
      if (!fieldErrors[field]) {
        const { [field]: _, ...rest } = errors;
        errors = rest;
      }
    }
  }
</script>

<svelte:head>
  <title>Contact Us — Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="cu-page">

  <!-- LEFT PANEL -->
  <aside class="cu-panel">
    <div class="cu-panel-inner">
      <a href="/" class="cu-logo-link">
        <img src="/icons/lz_logo_t.png" alt="Lezie" class="cu-logo-img" />
      </a>

      <div class="cu-panel-hero">
        <div class="cu-panel-badge">
          <Sparkles size={14} />
          <span>We're here to help</span>
        </div>
        <h2 class="cu-panel-headline">
          Let's make your<br/>
          <em>community safer</em>
        </h2>
        <p class="cu-panel-desc">
          Have questions, feedback, or partnership ideas? Our dedicated team is ready to listen and support your safety initiatives.
        </p>
      </div>

      <div class="cu-features">
        <div class="cu-feature-card">
          <div class="cu-feature-icon"><Clock size={18} /></div>
          <div>
            <strong>Fast Response</strong>
            <span>We typically reply within 24 hours</span>
          </div>
        </div>
        <div class="cu-feature-card">
          <div class="cu-feature-icon"><Users size={18} /></div>
          <div>
            <strong>Real People</strong>
            <span>Talk to a dedicated team member</span>
          </div>
        </div>
        <div class="cu-feature-card">
          <div class="cu-feature-icon"><ShieldCheck size={18} /></div>
          <div>
            <strong>Privacy First</strong>
            <span>Your information is always protected</span>
          </div>
        </div>
      </div>

      <div class="cu-panel-footer">
        <div class="cu-avatars">
          <div class="cu-avatar" style="background: var(--secondary-color)"></div>
          <div class="cu-avatar" style="background: #a78bfa"></div>
          <div class="cu-avatar" style="background: #8b5cf6"></div>
          <div class="cu-avatar" style="background: var(--primary-color)"></div>
          <div class="cu-avatar-count">Support</div>
        </div>
        <p>Lezie Support Team</p>
      </div>
    </div>
    <div class="cu-panel-glow"></div>
  </aside>

  <!-- RIGHT PANEL -->
  <main class="cu-main">
    <div class="cu-form-shell">

      <button class="cu-back-home" onclick={() => goto('/')}>
        <ChevronLeft size={18} />
        <Home size={14} />
        <span>Back to Home</span>
      </button>

      <div class="cu-mobile-brand">
        <a href="/" class="cu-logo-link">
          <img src="/icons/lz_ico.png" alt="Lezie" class="cu-logo-img" />
        </a>
      </div>

      <div class="cu-form-header">
        <h1 class="cu-form-title">Get in touch</h1>
        <p class="cu-form-subtitle">We'd love to hear from you</p>
      </div>

      <div class="cu-card">

        {#if errors.submit}
          <div class="cu-alert-error">
            <AlertCircle size={18} />
            <span>{errors.submit}</span>
          </div>
        {/if}

        {#if submitted}
          <div class="cu-success-state">
            <div class="cu-success-icon-wrap">
              <CheckCircle size={48} class="cu-success-icon" />
              <div class="cu-success-ring"></div>
            </div>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. We've received your message and will get back to you within 24 hours.</p>
            <button onclick={() => submitted = false} class="cu-btn-secondary">
              Send another message
            </button>
          </div>
        {:else}
          <form onsubmit={handleSubmit} class="cu-form">
            
            <div class="cu-welcome-message">
              <MessageSquare size={20} />
              <div>
                <strong>Send us a message</strong>
                <span>Fill out the form below and we'll respond shortly</span>
              </div>
            </div>

            <!-- Name -->
            <div class="cu-field">
              <label class="cu-label" for="name">
                Full Name <span class="cu-req">*</span>
              </label>
              <div class="cu-input-wrap" class:cu-input--err={errors.name && touched.name}>
                <span class="cu-input-icon"><User size={16} /></span>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  bind:value={formData.name}
                  onblur={() => handleBlur('name')}
                  oninput={() => handleInput('name')}
                  class="cu-input"
                />
              </div>
              {#if errors.name && touched.name}
                <p class="cu-err">{errors.name}</p>
              {:else}
                <p class="cu-hint">How should we address you?</p>
              {/if}
            </div>

            <!-- Email -->
            <div class="cu-field">
              <label class="cu-label" for="email">
                Email Address <span class="cu-req">*</span>
              </label>
              <div class="cu-input-wrap" class:cu-input--err={errors.email && touched.email}>
                <span class="cu-input-icon"><Mail size={16} /></span>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  bind:value={formData.email}
                  onblur={() => handleBlur('email')}
                  oninput={() => handleInput('email')}
                  class="cu-input"
                />
              </div>
              {#if errors.email && touched.email}
                <p class="cu-err">{errors.email}</p>
              {:else}
                <p class="cu-hint">We'll never share your email with anyone</p>
              {/if}
            </div>

            <!-- Subject -->
            <div class="cu-field">
              <label class="cu-label" for="subject">
                Subject <span class="cu-req">*</span>
              </label>
              <div class="cu-input-wrap" class:cu-input--err={errors.subject && touched.subject}>
                <span class="cu-input-icon"><MessageSquare size={16} /></span>
                <input
                  id="subject"
                  type="text"
                  placeholder="How can we help you?"
                  bind:value={formData.subject}
                  onblur={() => handleBlur('subject')}
                  oninput={() => handleInput('subject')}
                  class="cu-input"
                />
              </div>
              {#if errors.subject && touched.subject}
                <p class="cu-err">{errors.subject}</p>
              {:else}
                <p class="cu-hint">Brief summary of your inquiry</p>
              {/if}
            </div>

            <!-- Message -->
            <div class="cu-field">
              <label class="cu-label" for="message">
                Message <span class="cu-req">*</span>
              </label>
              <div class="cu-textarea-wrap" class:cu-input--err={errors.message && touched.message}>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Tell us more about your inquiry..."
                  bind:value={formData.message}
                  onblur={() => handleBlur('message')}
                  oninput={() => handleInput('message')}
                  class="cu-input cu-textarea"
                ></textarea>
                <div class="cu-char-count" class:warning={formData.message.length > 0 && formData.message.length < 10}>
                  {formData.message.length} chars
                </div>
              </div>
              {#if errors.message && touched.message}
                <p class="cu-err">{errors.message}</p>
              {:else}
                <p class="cu-hint">Please provide at least 10 characters</p>
              {/if}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              class="cu-btn-submit"
              class:loading={isLoading}
            >
              {#if isLoading}
                <span class="cu-spinner"></span>
                <span>Sending...</span>
              {:else}
                <span>Send Message</span>
                <Send size={16} />
              {/if}
            </button>

          </form>
        {/if}

      </div>

      <p class="cu-footer-text">
        Prefer email? <a href="mailto:support@lezie.com" class="cu-link">support@lezie.com</a>
      </p>

    </div>
  </main>
</div>

<style>
  :global(.cu-page *) { 
    font-family: 'DM Sans', system-ui, sans-serif; 
    box-sizing: border-box; 
  }

  .cu-page { 
    display: flex; 
    min-height: 100vh; 
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%); 
  }

  /* LEFT PANEL - Exact match to sign-in page */
  .cu-panel { 
    display: none; 
    position: relative; 
    width: 440px; 
    flex-shrink: 0; 
    background: linear-gradient(160deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%); 
    overflow: hidden; 
  }

  @media (min-width: 1024px) { 
    .cu-panel { display: flex; } 
  }

  .cu-panel-inner { 
    position: relative; 
    z-index: 2; 
    display: flex; 
    flex-direction: column; 
    padding: 2.5rem; 
    height: 100%; 
  }

  .cu-panel-glow { 
    position: absolute; 
    inset: 0; 
    z-index: 1; 
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%); 
    pointer-events: none; 
  }

  .cu-logo-link { 
    display: inline-block; 
    line-height: 0; 
    margin-bottom: 2.5rem; 
    transition: transform 0.2s, opacity 0.2s; 
  }

  .cu-logo-link:hover { 
    opacity: 0.85; 
    transform: scale(1.02); 
  }

  .cu-logo-img { 
    width: 80px; 
    height: 80px; 
    object-fit: contain; 
    display: block; 
  }

  .cu-panel-badge { 
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

  .cu-panel-headline { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 2.5rem; 
    line-height: 1.2; 
    color: white; 
    margin-bottom: 1rem; 
  }

  .cu-panel-headline em { 
    color: #c4b5fd; 
    font-style: italic; 
  }

  .cu-panel-desc { 
    font-size: 0.875rem; 
    line-height: 1.6; 
    color: rgba(196,181,253,0.85); 
    margin-bottom: 2rem; 
  }

  .cu-features { 
    display: flex; 
    flex-direction: column; 
    gap: 1rem; 
    margin-bottom: auto; 
  }

  .cu-feature-card { 
    display: flex; 
    align-items: flex-start; 
    gap: 0.875rem; 
    padding: 0.875rem; 
    background: rgba(255,255,255,0.05); 
    border-radius: 1rem; 
    backdrop-filter: blur(10px); 
    transition: background 0.2s; 
  }

  .cu-feature-card:hover { 
    background: rgba(255,255,255,0.08); 
  }

  .cu-feature-icon { 
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

  .cu-feature-card strong { 
    display: block; 
    font-size: 0.813rem; 
    font-weight: 600; 
    color: white; 
    margin-bottom: 0.25rem; 
  }

  .cu-feature-card span { 
    font-size: 0.75rem; 
    color: rgba(196,181,253,0.8); 
    line-height: 1.4; 
  }

  .cu-panel-footer { 
    margin-top: 2rem; 
    padding-top: 1.5rem; 
    border-top: 1px solid rgba(255,255,255,0.1); 
  }

  .cu-avatars { 
    display: flex; 
    align-items: center; 
    margin-bottom: 0.75rem; 
  }

  .cu-avatar { 
    width: 32px; 
    height: 32px; 
    border-radius: 50%; 
    border: 2px solid #2d1b4e; 
    margin-left: -8px; 
  }

  .cu-avatar:first-child { 
    margin-left: 0; 
  }

  .cu-avatar-count { 
    width: auto; 
    padding: 0 0.75rem; 
    height: 32px; 
    border-radius: 16px; 
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

  .cu-panel-footer p { 
    font-size: 0.688rem; 
    color: rgba(196,181,253,0.7); 
  }

  /* RIGHT PANEL - Exact match to sign-in page patterns */
  .cu-main { 
    flex: 1; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    padding: 2rem 1.25rem; 
    min-height: 100vh; 
  }

  .cu-form-shell { 
    width: 100%; 
    max-width: 500px; 
    display: flex; 
    flex-direction: column; 
    gap: 1.5rem; 
  }

  .cu-back-home { 
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

  .cu-back-home:hover { 
    border-color: #6a2c91; 
    color: #6a2c91; 
    background: #f3e8ff; 
    transform: translateX(-2px); 
  }

  .cu-mobile-brand { 
    display: flex; 
    justify-content: center; 
  }

  .cu-mobile-brand .cu-logo-link { 
    margin-bottom: 0; 
  }

  .cu-mobile-brand .cu-logo-img { 
    width: 80px; 
    height: 80px; 
  }

  @media (min-width: 1024px) { 
    .cu-mobile-brand { display: none; } 
  }

  .cu-form-header { 
    text-align: center; 
  }

  .cu-form-title { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: clamp(1.625rem, 4vw, 2rem); 
    color: #1e1b4b; 
    margin-bottom: 0.25rem; 
    letter-spacing: -0.02em; 
  }

  .cu-form-subtitle { 
    font-size: 0.875rem; 
    color: #64748b; 
  }

  .cu-card { 
    background: white; 
    border-radius: 1.5rem; 
    border: 1px solid #e2e8f0; 
    padding: clamp(1.25rem, 5vw, 2rem); 
    box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1); 
  }

  .cu-alert-error { 
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

  .cu-welcome-message { 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    padding: 0.875rem 1rem; 
    background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%); 
    border-radius: 1rem; 
    margin-bottom: 1.5rem; 
  }

  .cu-welcome-message :global(svg) { 
    color: #6a2c91; 
    flex-shrink: 0; 
  }

  .cu-welcome-message strong { 
    display: block; 
    font-size: 0.875rem; 
    font-weight: 700; 
    color: #1e1b4b; 
  }

  .cu-welcome-message span { 
    font-size: 0.75rem; 
    color: #64748b; 
  }

  /* Form Fields - Exact match to sign-in */
  .cu-form { 
    display: flex; 
    flex-direction: column; 
    gap: 1.125rem; 
  }

  .cu-field { 
    display: flex; 
    flex-direction: column; 
    gap: 0.375rem; 
  }

  .cu-label { 
    font-size: 0.813rem; 
    font-weight: 600; 
    color: #374151; 
  }

  .cu-req { 
    color: #6a2c91; 
  }

  .cu-hint { 
    font-size: 0.688rem; 
    color: #94a3b8; 
  }

  .cu-err { 
    font-size: 0.75rem; 
    color: #dc2626; 
    display: flex; 
    align-items: center; 
    gap: 0.25rem; 
  }

  .cu-input-wrap { 
    position: relative; 
    display: flex; 
    align-items: center; 
  }

  .cu-input-icon { 
    position: absolute; 
    left: 0.875rem; 
    top: 50%; 
    transform: translateY(-50%); 
    color: #9ca3af; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    pointer-events: none; 
  }

  .cu-input { 
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

  .cu-input:hover { 
    border-color: #c4b5fd; 
  }

  .cu-input:focus { 
    border-color: #6a2c91; 
    box-shadow: 0 0 0 3px rgba(106,44,145,0.1); 
  }

  .cu-input--err { 
    border-color: #f87171 !important; 
    background: #fff5f5; 
  }

  .cu-input--err:focus { 
    box-shadow: 0 0 0 3px rgba(248,113,113,0.1); 
  }

  /* Textarea specific */
  .cu-textarea-wrap { 
    position: relative; 
  }

  .cu-textarea { 
    padding: 0.875rem; 
    padding-left: 0.875rem; 
    min-height: 120px; 
    resize: vertical; 
    line-height: 1.6; 
  }

  .cu-char-count { 
    position: absolute; 
    bottom: 0.5rem; 
    right: 0.75rem; 
    font-size: 0.75rem; 
    color: #94a3b8; 
    background: rgba(255,255,255,0.9); 
    padding: 0.25rem 0.5rem; 
    border-radius: 6px; 
    pointer-events: none; 
  }

  .cu-char-count.warning { 
    color: #f59e0b; 
    font-weight: 500; 
  }

  /* Submit Button */
  .cu-btn-submit { 
    display: inline-flex; 
    align-items: center; 
    justify-content: center; 
    gap: 0.5rem; 
    width: 100%; 
    padding: 0.8125rem 1.25rem; 
    background: linear-gradient(135deg, #6a2c91 0%, #4a1d6e 100%); 
    color: white; 
    border: none; 
    border-radius: 0.75rem; 
    font-size: 0.9375rem; 
    font-weight: 600; 
    cursor: pointer; 
    box-shadow: 0 4px 14px rgba(106,44,145,0.3); 
    transition: all 0.2s; 
    margin-top: 0.5rem; 
  }

  .cu-btn-submit:hover:not(:disabled) { 
    transform: translateY(-2px); 
    box-shadow: 0 6px 20px rgba(106,44,145,0.4); 
  }

  .cu-btn-submit:active:not(:disabled) { 
    transform: translateY(0); 
  }

  .cu-btn-submit:disabled { 
    opacity: 0.65; 
    cursor: not-allowed; 
  }

  .cu-btn-submit.loading { 
    background: #64748b; 
    box-shadow: none; 
  }

  .cu-spinner { 
    width: 16px; 
    height: 16px; 
    border: 2px solid rgba(255,255,255,0.3); 
    border-top-color: white; 
    border-radius: 50%; 
    animation: spin 0.6s linear infinite; 
  }

  @keyframes spin { 
    to { transform: rotate(360deg); } 
  }

  /* Success State */
  .cu-success-state { 
    text-align: center; 
    padding: 2rem 1rem; 
    animation: fadeIn 0.5s ease; 
  }

  @keyframes fadeIn { 
    from { opacity: 0; transform: scale(0.95); } 
    to { opacity: 1; transform: scale(1); } 
  }

  .cu-success-icon-wrap { 
    position: relative; 
    display: inline-flex; 
    margin-bottom: 1.5rem; 
  }

  .cu-success-icon { 
    color: #10b981; 
    position: relative; 
    z-index: 1; 
  }

  .cu-success-ring { 
    position: absolute; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
    width: 80px; 
    height: 80px; 
    border: 3px solid #10b981; 
    border-radius: 50%; 
    opacity: 0; 
    animation: ringPulse 1.5s ease-out; 
  }

  @keyframes ringPulse { 
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; } 
    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; } 
  }

  .cu-success-state h3 { 
    font-size: 1.5rem; 
    font-weight: 700; 
    color: #1e1b4b; 
    margin-bottom: 0.75rem; 
  }

  .cu-success-state p { 
    color: #64748b; 
    line-height: 1.6; 
    margin-bottom: 2rem; 
    max-width: 360px; 
    margin-left: auto; 
    margin-right: auto; 
  }

  .cu-btn-secondary { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.875rem 1.5rem; 
    background: #f3e8ff; 
    color: #6a2c91; 
    border: 2px solid #e0d4f5; 
    border-radius: 0.75rem; 
    font-size: 0.9375rem; 
    font-weight: 600; 
    cursor: pointer; 
    transition: all 0.2s; 
  }

  .cu-btn-secondary:hover { 
    background: #6a2c91; 
    color: white; 
    border-color: #6a2c91; 
  }

  /* Footer */
  .cu-footer-text { 
    text-align: center; 
    font-size: 0.875rem; 
    color: #64748b; 
  }

  .cu-link { 
    color: #6a2c91; 
    font-weight: 600; 
    text-decoration: none; 
  }

  .cu-link:hover { 
    text-decoration: underline; 
  }

  /* Responsive */
  @media (max-width: 640px) {
    .cu-main { 
      padding: 1.5rem 1rem; 
      align-items: flex-start; 
    }
    
    .cu-form-shell { 
      gap: 1.25rem; 
    }
    
    .cu-card { 
      border-radius: 1.25rem; 
      padding: 1.25rem; 
    }
    
    .cu-back-home { 
      font-size: 0.75rem; 
      padding: 0.375rem 0.875rem; 
    }
    
    .cu-panel-headline { 
      font-size: 2rem; 
    }
  }
</style>
