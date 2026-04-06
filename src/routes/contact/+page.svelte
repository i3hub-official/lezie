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
    Clock,
    Sparkles
  } from 'lucide-svelte';

  let isLoading = $state(false);
  let submitted = $state(false);
  let focusedField = $state<string | null>(null);
  let errors = $state<Record<string, string>>({});

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
    } catch (err) {
      errors.submit = 'Something went wrong. Please try again later.';
    } finally {
      isLoading = false;
    }
  }

  function handleInput(field: string) {
    if (errors[field]) {
      const { [field]: _, ...rest } = errors;
      errors = rest;
    }
  }
</script>

<svelte:head>
  <title>Contact Us — Lezie</title>
  <meta name="description" content="Get in touch with the Lezie team for support, partnerships, or inquiries about our community safety platform." />
</svelte:head>

<div class="contact-page">
  <!-- Animated Background Elements -->
  <div class="ambient-glow ambient-glow-1"></div>
  <div class="ambient-glow ambient-glow-2"></div>

  <!-- Left Panel - Branding & Trust Signals -->
  <aside class="brand-panel">
    <div class="brand-content">
      <a href="/" class="logo-link">
        <div class="logo-badge">
          <img src="/icons/lz_ico.png" alt="Lezie" class="logo-img" />
          <span class="logo-text">Lezie</span>
        </div>
      </a>

      <div class="brand-hero">
        <div class="hero-badge">
          <Sparkles size={14} />
          <span>We're here to help</span>
        </div>
        <h1 class="hero-title">
          Let's make your<br/>
          <span class="gradient-text">community safer</span>
        </h1>
        <p class="hero-description">
          Have questions about our platform? Looking for partnerships? 
          Our dedicated team is ready to support your safety initiatives.
        </p>
      </div>

      <div class="trust-cards">
        <div class="trust-card">
          <div class="trust-icon pulse">
            <Clock size={18} />
          </div>
          <div class="trust-content">
            <h3>Fast Response</h3>
            <p>Typically reply within 24 hours</p>
          </div>
        </div>

        <div class="trust-card">
          <div class="trust-icon">
            <Users size={18} />
          </div>
          <div class="trust-content">
            <h3>Real People</h3>
            <p>Dedicated support team</p>
          </div>
        </div>

        <div class="trust-card">
          <div class="trust-icon">
            <ShieldCheck size={18} />
          </div>
          <div class="trust-content">
            <h3>Privacy First</h3>
            <p>Your data is always protected</p>
          </div>
        </div>
      </div>

      <div class="brand-footer">
        <div class="support-avatar-group">
          <div class="avatar">JD</div>
          <div class="avatar">MK</div>
          <div class="avatar">+3</div>
        </div>
        <p>Lezie Support Team</p>
      </div>
    </div>
  </aside>

  <!-- Right Panel - Contact Form -->
  <main class="form-panel">
    <div class="form-container">
      <!-- Navigation -->
      <button class="back-button" onclick={() => goto('/')}>
        <ChevronLeft size={16} />
        <Home size={14} />
        <span>Back to Home</span>
      </button>

      <!-- Form Header -->
      <div class="form-header">
        <h2 class="form-title">Get in touch</h2>
        <p class="form-subtitle">We'd love to hear from you</p>
      </div>

      <!-- Form Card -->
      <div class="form-card">
        {#if submitted}
          <div class="success-state">
            <div class="success-icon-wrapper">
              <CheckCircle size={48} class="success-icon" />
              <div class="success-ring"></div>
            </div>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. We've received your message and will get back to you within 24 hours.</p>
            <button 
              onclick={() => submitted = false} 
              class="btn-secondary"
            >
              Send another message
            </button>
          </div>
        {:else}
          <form onsubmit={handleSubmit} class="contact-form">
            {#if errors.submit}
              <div class="alert alert-error">
                <AlertCircle size={18} />
                <span>{errors.submit}</span>
              </div>
            {/if}

            <!-- Name Field -->
            <div class="form-group" class:focused={focusedField === 'name'}>
              <label for="name" class="form-label">
                Full Name
                <span class="required">*</span>
              </label>
              <div class="input-wrapper" class:error={errors.name}>
                <User size={16} class="input-icon" />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  bind:value={formData.name}
                  onfocus={() => focusedField = 'name'}
                  onblur={() => focusedField = null}
                  oninput={() => handleInput('name')}
                  class="form-input"
                />
              </div>
              {#if errors.name}
                <span class="error-message">{errors.name}</span>
              {/if}
            </div>

            <!-- Email Field -->
            <div class="form-group" class:focused={focusedField === 'email'}>
              <label for="email" class="form-label">
                Email Address
                <span class="required">*</span>
              </label>
              <div class="input-wrapper" class:error={errors.email}>
                <Mail size={16} class="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  bind:value={formData.email}
                  onfocus={() => focusedField = 'email'}
                  onblur={() => focusedField = null}
                  oninput={() => handleInput('email')}
                  class="form-input"
                />
              </div>
              {#if errors.email}
                <span class="error-message">{errors.email}</span>
              {/if}
            </div>

            <!-- Subject Field -->
            <div class="form-group" class:focused={focusedField === 'subject'}>
              <label for="subject" class="form-label">
                Subject
                <span class="required">*</span>
              </label>
              <div class="input-wrapper" class:error={errors.subject}>
                <MessageSquare size={16} class="input-icon" />
                <input
                  id="subject"
                  type="text"
                  placeholder="How can we help you?"
                  bind:value={formData.subject}
                  onfocus={() => focusedField = 'subject'}
                  onblur={() => focusedField = null}
                  oninput={() => handleInput('subject')}
                  class="form-input"
                />
              </div>
              {#if errors.subject}
                <span class="error-message">{errors.subject}</span>
              {/if}
            </div>

            <!-- Message Field -->
            <div class="form-group" class:focused={focusedField === 'message'}>
              <label for="message" class="form-label">
                Message
                <span class="required">*</span>
              </label>
              <div class="input-wrapper textarea-wrapper" class:error={errors.message}>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Tell us more about your inquiry..."
                  bind:value={formData.message}
                  onfocus={() => focusedField = 'message'}
                  onblur={() => focusedField = null}
                  oninput={() => handleInput('message')}
                  class="form-input form-textarea"
                ></textarea>
                <div class="character-count" class:warning={formData.message.length > 0 && formData.message.length < 10}>
                  {formData.message.length} chars
                </div>
              </div>
              {#if errors.message}
                <span class="error-message">{errors.message}</span>
              {/if}
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              disabled={isLoading}
              class="btn-submit"
              class:loading={isLoading}
            >
              {#if isLoading}
                <span class="spinner"></span>
                <span>Sending...</span>
              {:else}
                <span>Send Message</span>
                <Send size={16} class="btn-icon" />
              {/if}
            </button>
          </form>
        {/if}
      </div>

      <!-- Footer -->
      <p class="form-footer">
        Prefer direct email? 
        <a href="mailto:support@lezie.com" class="text-link">support@lezie.com</a>
      </p>
    </div>
  </main>
</div>

<style>
  /* Page Layout */
  .contact-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 45% 55%;
    background: linear-gradient(135deg, #faf9ff 0%, #f5f3ff 100%);
    position: relative;
    overflow: hidden;
  }

  /* Ambient Background Effects */
  .ambient-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    pointer-events: none;
  }

  .ambient-glow-1 {
    width: 600px;
    height: 600px;
    background: var(--primary-color);
    top: -200px;
    left: -100px;
    animation: float 20s ease-in-out infinite;
  }

  .ambient-glow-2 {
    width: 400px;
    height: 400px;
    background: var(--primary-light);
    bottom: -100px;
    right: 20%;
    animation: float 15s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -30px) scale(1.1); }
  }

  /* Brand Panel (Left) */
  .brand-panel {
    background: linear-gradient(160deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .brand-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  .brand-content {
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* Logo */
  .logo-link {
    text-decoration: none;
    display: inline-block;
    margin-bottom: 3rem;
  }

  .logo-badge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    padding: 0.5rem 1rem;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.2);
    transition: all 0.3s ease;
  }

  .logo-badge:hover {
    background: rgba(255,255,255,0.15);
    transform: translateY(-2px);
  }

  .logo-img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
  }

  /* Hero Section */
  .brand-hero {
    margin-bottom: 3rem;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255,255,255,0.15);
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255,255,255,0.2);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }

  .gradient-text {
    background: linear-gradient(135deg, #fff 0%, var(--secondary-color) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-description {
    font-size: 1.125rem;
    line-height: 1.7;
    opacity: 0.9;
    max-width: 90%;
  }

  /* Trust Cards */
  .trust-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .trust-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255,255,255,0.08);
    padding: 1.25rem;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.1);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .trust-card:hover {
    background: rgba(255,255,255,0.12);
    transform: translateX(8px);
    border-color: rgba(255,255,255,0.2);
  }

  .trust-icon {
    width: 44px;
    height: 44px;
    background: rgba(255,255,255,0.15);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .trust-icon.pulse {
    animation: iconPulse 2s ease-in-out infinite;
  }

  @keyframes iconPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
    50% { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
  }

  .trust-content h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .trust-content p {
    font-size: 0.875rem;
    opacity: 0.8;
  }

  /* Brand Footer */
  .brand-footer {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .support-avatar-group {
    display: flex;
    align-items: center;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-light), var(--secondary-color));
    border: 2px solid var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    margin-left: -8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .avatar:first-child {
    margin-left: 0;
  }

  .brand-footer p {
    font-size: 0.875rem;
    opacity: 0.8;
  }

  /* Form Panel (Right) */
  .form-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
  }

  .form-container {
    width: 100%;
    max-width: 520px;
  }

  /* Back Button */
  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: none;
    color: var(--gray-color);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem;
    margin-bottom: 2rem;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .back-button:hover {
    color: var(--primary-color);
    background: var(--primary-bg);
  }

  /* Form Header */
  .form-header {
    margin-bottom: 2rem;
  }

  .form-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  .form-subtitle {
    color: var(--gray-color);
    font-size: 1rem;
  }

  /* Form Card */
  .form-card {
    background: white;
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 
      0 4px 6px -1px rgba(0,0,0,0.05),
      0 10px 15px -3px rgba(106,44,145,0.08),
      0 0 0 1px rgba(106,44,145,0.05);
    margin-bottom: 1.5rem;
  }

  /* Form Elements */
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: all 0.3s ease;
  }

  .form-group.focused .form-label {
    color: var(--primary-color);
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--dark-color);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: color 0.2s ease;
  }

  .required {
    color: var(--danger-color);
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--light-color);
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 0 1rem;
    transition: all 0.2s ease;
  }

  .input-wrapper:focus-within {
    background: white;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px var(--primary-bg);
  }

  .input-wrapper.error {
    border-color: var(--danger-color);
    background: #fef2f2;
  }

  .input-wrapper.error:focus-within {
    box-shadow: 0 0 0 4px rgba(239,68,68,0.1);
  }

  .input-icon {
    color: var(--gray-color);
    margin-right: 0.75rem;
    flex-shrink: 0;
    transition: color 0.2s ease;
  }

  .input-wrapper:focus-within .input-icon {
    color: var(--primary-color);
  }

  .form-input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 1rem 0;
    font-size: 0.9375rem;
    color: var(--dark-color);
    outline: none;
    font-family: inherit;
  }

  .form-input::placeholder {
    color: var(--gray-color);
    opacity: 0.6;
  }

  .textarea-wrapper {
    padding: 1rem;
    align-items: flex-start;
  }

  .form-textarea {
    resize: vertical;
    min-height: 120px;
    line-height: 1.6;
    width: 100%;
  }

  .character-count {
    position: absolute;
    bottom: 0.5rem;
    right: 0.75rem;
    font-size: 0.75rem;
    color: var(--gray-color);
    background: rgba(255,255,255,0.9);
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    pointer-events: none;
  }

  .character-count.warning {
    color: var(--warning-color);
    font-weight: 500;
  }

  .error-message {
    font-size: 0.875rem;
    color: var(--danger-color);
    display: flex;
    align-items: center;
    gap: 0.375rem;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Alert */
  .alert {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    animation: slideIn 0.3s ease;
  }

  .alert-error {
    background: #fef2f2;
    color: var(--danger-color);
    border: 1px solid #fecaca;
  }

  /* Submit Button */
  .btn-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 0.5rem;
    position: relative;
    overflow: hidden;
  }

  .btn-submit::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }

  .btn-submit:hover::before {
    left: 100%;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(106,44,145,0.4);
  }

  .btn-submit:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-submit.loading {
    background: var(--gray-color);
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .btn-icon {
    transition: transform 0.2s ease;
  }

  .btn-submit:hover .btn-icon {
    transform: translateX(4px);
  }

  /* Success State */
  .success-state {
    text-align: center;
    padding: 2rem 1rem;
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .success-icon-wrapper {
    position: relative;
    display: inline-flex;
    margin-bottom: 1.5rem;
  }

  .success-icon {
    color: var(--success-color);
    position: relative;
    z-index: 1;
  }

  .success-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    border: 3px solid var(--success-color);
    border-radius: 50%;
    opacity: 0;
    animation: ringPulse 1.5s ease-out;
  }

  @keyframes ringPulse {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }

  .success-state h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 0.75rem;
  }

  .success-state p {
    color: var(--gray-color);
    line-height: 1.6;
    margin-bottom: 2rem;
    max-width: 360px;
    margin-left: auto;
    margin-right: auto;
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: var(--primary-bg);
    color: var(--primary-color);
    border: 2px solid var(--primary-border);
    border-radius: 12px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-secondary:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  /* Form Footer */
  .form-footer {
    text-align: center;
    color: var(--gray-color);
    font-size: 0.875rem;
  }

  .text-link {
    color: var(--primary-color);
    font-weight: 600;
    text-decoration: none;
    position: relative;
  }

  .text-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary-color);
    transition: width 0.3s ease;
  }

  .text-link:hover::after {
    width: 100%;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .contact-page {
      grid-template-columns: 1fr;
    }

    .brand-panel {
      padding: 2rem;
      min-height: auto;
    }

    .brand-content {
      max-width: 100%;
    }

    .hero-title {
      font-size: 2.25rem;
    }

    .trust-cards {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .trust-card {
      flex: 1;
      min-width: 200px;
    }

    .form-panel {
      padding: 2rem 1.5rem;
    }
  }

  @media (max-width: 640px) {
    .hero-title {
      font-size: 1.875rem;
    }

    .form-card {
      padding: 1.5rem;
      border-radius: 20px;
    }

    .trust-cards {
      flex-direction: column;
    }

    .trust-card:hover {
      transform: translateX(4px);
    }
  }
</style>
