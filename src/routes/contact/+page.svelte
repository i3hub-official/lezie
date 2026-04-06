<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    User,
    Mail,
    MessageCircle,
    Home,
    ChevronLeft,
    ShieldCheck,
    Users,
    PhoneCall
  } from 'lucide-svelte';

  let isLoading = $state(false);
  let submitted = $state(false);
  let errors = $state<Record<string, string>>({});

  let formData = $state({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  function validateForm() {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email))
      e.email = 'Please enter a valid email address';
    if (!formData.subject.trim()) e.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.trim().length < 10)
      e.message = 'Please provide a detailed message (at least 10 characters)';
    return e;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      errors = errs;
      return;
    }

    isLoading = true;
    errors = {};

    try {
      // Replace with your actual backend endpoint
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to send message');

      submitted = true;
      formData = { name: '', email: '', subject: '', message: '' };
    } catch (err) {
      errors.submit = 'Something went wrong. Please try again later.';
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Contact Us – Lezie</title>
  <meta name="description" content="Get in touch with the Lezie team for support, partnerships, or inquiries about our community safety platform." />
</svelte:head>

<div class="su-page">

  <!-- LEFT PANEL (Branding) -->
  <aside class="su-panel">
    <div class="su-panel-inner">
      <a href="/" class="su-logo-link">
        <img src="/icons/lz_ico.png" alt="Lezie" class="su-logo-img" />
      </a>

      <div class="su-panel-hero">
        <div class="su-panel-badge">
          <span>We're here to help</span>
        </div>
        <h2 class="su-panel-headline">
          Let's make your<br/>
          <em>community safer</em>
        </h2>
        <p class="su-panel-desc">
          Have questions, feedback, feature requests, or partnership ideas? 
          Our team is ready to listen and support you.
        </p>
      </div>

      <div class="su-features">
        {#each [
          { icon:ShieldCheck, title:'Fast Response', desc:'We typically reply within 24 hours' },
          { icon:Users,       title:'Real People',   desc:'Talk to a dedicated team member' },
          { icon:PhoneCall,   title:'Safety First',  desc:'Your privacy and security matter' },
        ] as f}
          <div class="su-feature-card">
            <div class="su-feature-icon"><f.icon size={17} /></div>
            <div>
              <strong>{f.title}</strong>
              <span>{f.desc}</span>
            </div>
          </div>
        {/each}
      </div>

      <div class="su-panel-footer">
        <p>Lezie Support Team</p>
      </div>
    </div>
    <div class="su-panel-glow"></div>
  </aside>

  <!-- RIGHT PANEL – Contact Form -->
  <main class="su-main">
    <div class="su-form-shell">

      <!-- Back to Home -->
      <button class="su-back-home" onclick={() => goto('/')}>
        <ChevronLeft size={16} />
        <Home size={13} />
        <span>Back to Home</span>
      </button>

      <div class="su-form-header">
        <h1 class="su-form-title">Get in touch</h1>
        <p class="su-form-subtitle">We'd love to hear from you</p>
      </div>

      <div class="su-card">
        {#if submitted}
          <div class="su-success-message">
            <CheckCircle size={32} style="color:var(--success-color)" />
            <h3>Thank you!</h3>
            <p>Your message has been sent successfully.<br>We will get back to you soon.</p>
            <button onclick={() => { submitted = false; }} class="su-btn-secondary">
              Send another message
            </button>
          </div>
        {:else}
          <form onsubmit={handleSubmit}>

            {#if errors.submit}
              <div class="auth-alert-error">
                <AlertCircle size={17} />
                <span>{errors.submit}</span>
              </div>
            {/if}

            <div class="auth-form-group">
              <label class="auth-label" for="name">Full Name <span class="su-req">*</span></label>
              <div class="auth-input-wrapper">
                <span class="auth-input-icon"><User size={15} /></span>
                <input 
                  id="name" 
                  type="text" 
                  placeholder="Your full name"
                  bind:value={formData.name}
                  class="auth-input {errors.name ? 'input-error' : ''}" 
                />
              </div>
              {#if errors.name}<p class="auth-error-message">{errors.name}</p>{/if}
            </div>

            <div class="auth-form-group">
              <label class="auth-label" for="email">Email Address <span class="su-req">*</span></label>
              <div class="auth-input-wrapper">
                <span class="auth-input-icon"><Mail size={15} /></span>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com"
                  bind:value={formData.email}
                  class="auth-input {errors.email ? 'input-error' : ''}" 
                />
              </div>
              {#if errors.email}<p class="auth-error-message">{errors.email}</p>{/if}
            </div>

            <div class="auth-form-group">
              <label class="auth-label" for="subject">Subject <span class="su-req">*</span></label>
              <div class="auth-input-wrapper">
                <input 
                  id="subject" 
                  type="text" 
                  placeholder="How can we help you?"
                  bind:value={formData.subject}
                  class="auth-input {errors.subject ? 'input-error' : ''}" 
                />
              </div>
              {#if errors.subject}<p class="auth-error-message">{errors.subject}</p>{/if}
            </div>

            <div class="auth-form-group">
              <label class="auth-label" for="message">Message <span class="su-req">*</span></label>
              <textarea 
                id="message" 
                rows="6" 
                placeholder="Write your message here..."
                bind:value={formData.message}
                class="auth-input {errors.message ? 'input-error' : ''}"
              ></textarea>
              {#if errors.message}<p class="auth-error-message">{errors.message}</p>{/if}
            </div>

            <button type="submit" disabled={isLoading} class="auth-btn-submit">
              {#if isLoading}
                <span class="auth-spinner"></span> Sending message...
              {:else}
                Send Message <ArrowRight size={16} />
              {/if}
            </button>
          </form>
        {/if}
      </div>

      <p class="auth-footer">
        Prefer email? <a href="mailto:support@lezie.com" class="auth-link">support@lezie.com</a>
      </p>
    </div>
  </main>
</div>

<style>
  /* Reuse your existing auth styles from the provided CSS */
  /* All classes like .su-page, .su-panel, .su-main, .su-card, .su-form-header, 
     .auth-form-group, .auth-label, .auth-input, .auth-btn-submit, .auth-alert-error, 
     .su-success-message, etc. are already defined in your global stylesheet. */

  /* Minor overrides for Contact page if needed */
  .su-textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    resize: vertical;
    min-height: 140px;
    font-family: inherit;
  }

  .su-success-message {
    text-align: center;
    padding: 2.5rem 1rem;
  }

  .su-success-message h3 {
    margin: 1rem 0 0.5rem;
    color: var(--success-color);
  }
</style>