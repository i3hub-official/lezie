<script lang="ts">
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
    if (!formData.message.trim()) e.message = 'Message is required';
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
      // Reset form
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

<div class="su-page">  <!-- Reusing the same root class as signup for consistent layout -->

  <!-- LEFT PANEL (Branding / Visual) -->
  <aside class="su-panel">
    <div class="su-panel-inner">
      <a href="/" class="su-logo-link">
        <img src="/icons/lz_ico.png" alt="Lezie" class="su-logo-img" />
      </a>

      <div class="su-panel-hero">
        <div class="su-panel-badge">
          <Sparkles size={13} />
          <span>We're here to help</span>
        </div>
        <h2 class="su-panel-headline">
          Let's make your<br/>
          <em>community safer</em>
        </h2>
        <p class="su-panel-desc">
          Have questions, feedback, or partnership ideas? 
          Our team is ready to listen and support your safety journey.
        </p>
      </div>

      <div class="su-features">
        {#each [
          { icon:ShieldCheck, title:'Fast Response', desc:'We typically reply within 24 hours' },
          { icon:Users,       title:'Community Focus', desc:'Dedicated to real neighbourhood needs' },
          { icon:PhoneCall,   title:'Direct Support', desc:'Speak with a real team member' },
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

      <!-- Back button -->
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
            <CheckCircle size={28} style="color:var(--success-color)" />
            <h3>Message sent successfully</h3>
            <p>Thank you! We'll get back to you as soon as possible.</p>
            <button onclick={() => { submitted = false; }} class="su-btn-secondary">Send another message</button>
          </div>
        {:else}
          <form on:submit|preventDefault={handleSubmit}>

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
                <input id="name" type="text" placeholder="Your name"
                  bind:value={formData.name}
                  class="su-input {errors.name ? 'su-input--err' : ''}" />
              </div>
              {#if errors.name}<p class="su-err">{errors.name}</p>{/if}
            </div>

            <div class="su-field">
              <label class="su-label" for="email">Email Address <span class="su-req">*</span></label>
              <div class="su-input-wrap">
                <span class="su-ico"><Mail size={15} /></span>
                <input id="email" type="email" placeholder="you@example.com"
                  bind:value={formData.email}
                  class="su-input {errors.email ? 'su-input--err' : ''}" />
              </div>
              {#if errors.email}<p class="su-err">{errors.email}</p>{/if}
            </div>

            <div class="su-field">
              <label class="su-label" for="subject">Subject <span class="su-req">*</span></label>
              <div class="su-input-wrap">
                <input id="subject" type="text" placeholder="How can we help you?"
                  bind:value={formData.subject}
                  class="su-input {errors.subject ? 'su-input--err' : ''}" />
              </div>
              {#if errors.subject}<p class="su-err">{errors.subject}</p>{/if}
            </div>

            <div class="su-field">
              <label class="su-label" for="message">Message <span class="su-req">*</span></label>
              <textarea id="message" rows="6" placeholder="Write your message here..."
                bind:value={formData.message}
                class="su-textarea {errors.message ? 'su-input--err' : ''}"></textarea>
              {#if errors.message}<p class="su-err">{errors.message}</p>{/if}
            </div>

            <button type="submit" disabled={isLoading} class="su-btn-next">
              {#if isLoading}
                <span class="su-spinner"></span> Sending...
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
  /* Reuse signup styles where possible */
  :global(.su-page) { display: flex; min-height: 100vh; background: var(--light-color, #f9fafb); }
  :global(.su-panel) { /* your existing left panel styles */ }
  :global(.su-main) { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem 1.25rem; }
  :global(.su-form-shell) { width: 100%; max-width: 500px; }

  /* Form-specific adjustments */
  .su-textarea {
    width: 100%;
    padding: .75rem .875rem;
    border: 1.5px solid #e5e7eb;
    border-radius: .75rem;
    font-size: .875rem;
    resize: vertical;
    min-height: 120px;
    font-family: 'DM Sans', sans-serif;
  }

  .su-success-message {
    text-align: center;
    padding: 2rem 1rem;
  }

  .su-success-message h3 {
    margin: 1rem 0 .5rem;
    color: var(--success-color, #10b981);
  }

  /* Reuse your existing button and error styles */
  .su-btn-next { /* your existing primary button styles */ }
  .su-alert-error { /* your existing error alert styles */ }
  .su-err { color: var(--danger-color, #ef4444); font-size: .75rem; }

  /* Make sure to include or import your global signup styles if not already inherited */
</style>