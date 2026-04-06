<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    ArrowRight, ArrowLeft, CheckCircle, AlertCircle,
    User, Mail, MessageCircle, Home, ChevronLeft, ShieldCheck
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
      // TODO: Replace with your actual backend endpoint
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

  <!-- LEFT PANEL -->
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
          { icon:CheckCircle, title:'Fast Response', desc:'We typically reply within 24 hours' },
          { icon:User,        title:'Real People',   desc:'Talk to a dedicated team member' },
          { icon:ShieldCheck, title:'Safety First',  desc:'Your privacy and security matter' },
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

      <!-- Back to home -->
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
              <div class="su-alert-error">
                <AlertCircle size={17} />
                <span>{errors.submit}</span>
              </div>
            {/if}

            <div class="su-field">
              <label class="su-label" for="name">Full Name <span class="su-req">*</span></label>
              <div class="su-input-wrap">
                <span class="su-ico"><User size={15} /></span>
                <input 
                  id="name" 
                  type="text" 
                  placeholder="Your full name"
                  bind:value={formData.name}
                  class="su-input {errors.name ? 'su-input--err' : ''}" 
                />
              </div>
              {#if errors.name}<p class="su-err">{errors.name}</p>{/if}
            </div>

            <div class="su-field">
              <label class="su-label" for="email">Email Address <span class="su-req">*</span></label>
              <div class="su-input-wrap">
                <span class="su-ico"><Mail size={15} /></span>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com"
                  bind:value={formData.email}
                  class="su-input {errors.email ? 'su-input--err' : ''}" 
                />
              </div>
              {#if errors.email}<p class="su-err">{errors.email}</p>{/if}
            </div>

            <div class="su-field">
              <label class="su-label" for="subject">Subject <span class="su-req">*</span></label>
              <div class="su-input-wrap">
                <input 
                  id="subject" 
                  type="text" 
                  placeholder="How can we help you?"
                  bind:value={formData.subject}
                  class="su-input {errors.subject ? 'su-input--err' : ''}" 
                />
              </div>
              {#if errors.subject}<p class="su-err">{errors.subject}</p>{/if}
            </div>

            <div class="su-field">
              <label class="su-label" for="message">Message <span class="su-req">*</span></label>
              <textarea 
                id="message" 
                rows="6" 
                placeholder="Write your message here..."
                bind:value={formData.message}
                class="su-textarea {errors.message ? 'su-input--err' : ''}"
              ></textarea>
              {#if errors.message}<p class="su-err">{errors.message}</p>{/if}
            </div>

            <button type="submit" disabled={isLoading} class="su-btn-next">
              {#if isLoading}
                <span class="su-spinner"></span> Sending message...
              {:else}
                Send Message <ArrowRight size={14} />
              {/if}
            </button>
          </form>
        {/if}
      </div>

      <p class="su-footer-text">
        Prefer email? <a href="mailto:support@lezie.com" class="su-link">support@lezie.com</a>
      </p>
    </div>
  </main>
</div>

<style>
  /* Reuse your signup styles for consistency */
  :global(.su-page) { display: flex; min-height: 100vh; background: var(--light-color, #f9fafb); }
  
  /* Add these if not already present in your global styles */
  .su-textarea {
    width: 100%;
    padding: .75rem .875rem;
    border: 1.5px solid #e5e7eb;
    border-radius: .75rem;
    font-size: .875rem;
    resize: vertical;
    min-height: 140px;
    font-family: 'DM Sans', sans-serif;
  }

  .su-success-message {
    text-align: center;
    padding: 2.5rem 1rem;
  }

  .su-success-message h3 {
    margin: 1rem 0 .5rem 0;
    color: var(--success-color, #10b981);
  }

  /* Reuse existing error, input, button styles from signup */
  .su-input--err { border-color: #f87171; }
  .su-err { color: #ef4444; font-size: .75rem; margin-top: .25rem; }
</style>