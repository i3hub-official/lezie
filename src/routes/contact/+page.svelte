<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    ChevronLeft, Home, Mail, Phone, MapPin, Send,
    CheckCircle, AlertCircle, User, MessageCircle,
    Clock, Sparkles, Shield, Users, Globe
  } from 'lucide-svelte';

  let name = '';
  let email = '';
  let message = '';
  let submitted = false;
  let isLoading = false;
  let error = '';
  let touched = { name: false, email: false, message: false };

  function validateForm() {
    if (!name.trim()) return 'Name is required';
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email)) return 'Please enter a valid email address';
    if (!message.trim()) return 'Message is required';
    if (message.length < 10) return 'Message must be at least 10 characters';
    return null;
  }

  async function handleSubmit() {
    const validationError = validateForm();
    if (validationError) {
      error = validationError;
      return;
    }
    
    isLoading = true;
    error = '';
    
    try {
      // In production, connect to your backend or email service
      await new Promise(resolve => setTimeout(resolve, 1000));
      submitted = true;
      name = '';
      email = '';
      message = '';
      touched = { name: false, email: false, message: false };
    } catch (err) {
      error = 'Failed to send message. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Contact Lezie - Get in Touch</title>
  <meta name="description" content="Contact the Lezie team for support, partnerships, or general inquiries about our community safety platform." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="contact-page">

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="hero-background"></div>
    <div class="hero-content">
      <button class="back-home" onclick={() => goto('/')}>
        <ChevronLeft size={16} />
        <Home size={14} />
        <span>Back to Home</span>
      </button>
      
      <div class="hero-badge">
        <Sparkles size={14} />
        <span>Get in Touch</span>
      </div>
      
      <h1 class="hero-title">
        Let's talk.<br/>
        <em>We're here to help.</em>
      </h1>
      
      <p class="hero-description">
        Have questions about Lezie? Need support? Want to partner with us? 
        We'd love to hear from you. Reach out and our team will respond within 24 hours.
      </p>
    </div>
  </section>

  <!-- Contact Info Cards -->
  <div class="info-cards">
    <div class="info-card">
      <div class="info-icon email-icon">
        <Mail size={22} />
      </div>
      <h3>Email Us</h3>
      <p>support@lezie.com</p>
      <p class="info-hint">Response within 24 hours</p>
    </div>
    <div class="info-card">
      <div class="info-icon phone-icon">
        <Phone size={22} />
      </div>
      <h3>Call Us</h3>
      <p>+1 (234) 567-8900</p>
      <p class="info-hint">Mon-Fri, 9am-6pm EST</p>
    </div>
    <div class="info-card">
      <div class="info-icon location-icon">
        <MapPin size={22} />
      </div>
      <h3>Visit Us</h3>
      <p>123 Safety Street</p>
      <p class="info-hint">New York, NY 10001</p>
    </div>
  </div>

  <!-- Main Contact Section -->
  <div class="contact-grid">
    <!-- Form Column -->
    <div class="form-column">
      <div class="form-header">
        <h2>Send us a message</h2>
        <p>Fill out the form below and we'll get back to you as soon as possible.</p>
      </div>

      {#if submitted}
        <div class="success-state">
          <div class="success-icon">
            <CheckCircle size={48} />
          </div>
          <h3>Message Sent Successfully!</h3>
          <p>Thank you for reaching out. Our team will respond to your inquiry within 24 hours.</p>
          <button class="new-message-btn" onclick={() => submitted = false}>
            Send another message
          </button>
        </div>
      {:else}
        <form class="contact-form">
          {#if error}
            <div class="error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          {/if}

          <div class="form-group">
            <label class="form-label" for="name">
              Your Name <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <User size={16} class="input-icon" />
              <input
                id="name"
                type="text"
                bind:value={name}
                onblur={() => touched.name = true}
                class="form-input {touched.name && !name.trim() ? 'error' : ''}"
                placeholder="John Doe"
              />
            </div>
            {#if touched.name && !name.trim()}
              <p class="error-message">Name is required</p>
            {/if}
          </div>

          <div class="form-group">
            <label class="form-label" for="email">
              Email Address <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <Mail size={16} class="input-icon" />
              <input
                id="email"
                type="email"
                bind:value={email}
                onblur={() => touched.email = true}
                class="form-input {touched.email && (!email.trim() || !/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email)) ? 'error' : ''}"
                placeholder="you@example.com"
              />
            </div>
            {#if touched.email && !email.trim()}
              <p class="error-message">Email is required</p>
            {:else if touched.email && !/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email)}
              <p class="error-message">Please enter a valid email address</p>
            {/if}
          </div>

          <div class="form-group">
            <label class="form-label" for="message">
              Message <span class="required">*</span>
            </label>
            <div class="textarea-wrapper">
              <MessageCircle size={16} class="textarea-icon" />
              <textarea
                id="message"
                bind:value={message}
                onblur={() => touched.message = true}
                class="form-textarea {touched.message && (!message.trim() || message.length < 10) ? 'error' : ''}"
                rows="5"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>
            {#if touched.message && !message.trim()}
              <p class="error-message">Message is required</p>
            {:else if touched.message && message.length < 10 && message.length > 0}
              <p class="error-message">Message must be at least 10 characters</p>
            {/if}
          </div>

          <button type="button" class="submit-btn" onclick={handleSubmit} disabled={isLoading}>
            {#if isLoading}
              <span class="spinner"></span>
              Sending...
            {:else}
              <Send size={16} />
              Send Message
            {/if}
          </button>
        </form>
      {/if}
    </div>

    <!-- Info Column -->
    <div class="info-column">
      <div class="info-panel">
        <h3>Frequently Asked Questions</h3>
        <div class="faq-item">
          <h4>How quickly do you respond?</h4>
          <p>We typically respond within 24 hours during business days.</p>
        </div>
        <div class="faq-item">
          <h4>Do you offer phone support?</h4>
          <p>Yes, phone support is available Monday-Friday, 9am-6pm EST.</p>
        </div>
        <div class="faq-item">
          <h4>Can I report an emergency through Lezie?</h4>
          <p>For emergencies, please call your local emergency services immediately. Lezie is for non-emergency reporting.</p>
        </div>
      </div>

      <div class="trust-panel">
        <div class="trust-badge">
          <Shield size={20} />
          <span>Trusted by 12,400+ members</span>
        </div>
        <div class="trust-badge">
          <Globe size={20} />
          <span>Serving communities worldwide</span>
        </div>
        <div class="trust-badge">
          <Clock size={20} />
          <span>24/7 platform availability</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <img src="/icons/lz_ico.png" alt="Lezie" class="footer-logo" />
        <p>Building safer communities through technology and collective vigilance.</p>
      </div>
      <div class="footer-links">
        <div class="link-group">
          <h4>Product</h4>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/security">Security</a>
        </div>
        <div class="link-group">
          <h4>Company</h4>
          <a href="/about">About</a>
          <a href="/blog">Blog</a>
          <a href="/careers">Careers</a>
        </div>
        <div class="link-group">
          <h4>Resources</h4>
          <a href="/help">Help Center</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 Lezie. All rights reserved.</p>
    </div>
  </footer>
</div>

<style>
  :root {
    --primary-color: #6a2c91;
    --primary-dark: #4b1d68;
    --primary-light: #9b4fcc;
    --primary-bg: #f5f3ff;
    --primary-border: #ddd6fe;
    --success-color: #10B981;
    --warning-color: #F59E0B;
    --danger-color: #EF4444;
    --dark-color: #111827;
    --light-color: #F9FAFB;
    --gray-color: #6B7280;
  }

  .contact-page {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%);
    min-height: 100vh;
  }

  /* Hero Section */
  .hero-section {
    position: relative;
    padding: 6rem 2rem 3rem;
    overflow: hidden;
  }

  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(106,44,145,0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  .hero-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 2;
  }

  .back-home {
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
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    margin-bottom: 2rem;
  }

  .back-home:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: var(--primary-bg);
    transform: translateX(-2px);
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    border-radius: 100px;
    padding: 0.375rem 0.875rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
  }

  .hero-title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.2;
    color: #1e1b4b;
    margin-bottom: 1rem;
  }

  .hero-title em {
    color: var(--primary-color);
    font-style: italic;
  }

  .hero-description {
    font-size: 1rem;
    line-height: 1.6;
    color: #4b5563;
    max-width: 600px;
    margin: 0 auto;
  }

  /* Info Cards */
  .info-cards {
    max-width: 1200px;
    margin: 0 auto 3rem;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .info-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
  }

  .info-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }

  .info-icon {
    width: 56px;
    height: 56px;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }

  .email-icon { background: #EDE9FE; color: #8B5CF6; }
  .phone-icon { background: #DBEAFE; color: #3B82F6; }
  .location-icon { background: #D1FAE5; color: #10B981; }

  .info-card h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #1e1b4b;
    margin-bottom: 0.5rem;
  }

  .info-card p {
    font-size: 0.875rem;
    color: #4b5563;
  }

  .info-hint {
    font-size: 0.688rem;
    color: #9ca3af;
    margin-top: 0.25rem;
  }

  /* Contact Grid */
  .contact-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem 4rem;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
  }

  /* Form Column */
  .form-column {
    background: white;
    border-radius: 1.5rem;
    border: 1px solid #e2e8f0;
    padding: 2rem;
  }

  .form-header {
    margin-bottom: 1.5rem;
  }

  .form-header h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e1b4b;
    margin-bottom: 0.25rem;
  }

  .form-header p {
    font-size: 0.813rem;
    color: #6b7280;
  }

  /* Success State */
  .success-state {
    text-align: center;
    padding: 2rem;
  }

  .success-icon {
    width: 80px;
    height: 80px;
    background: #f0fdf4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: var(--success-color);
  }

  .success-state h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1e1b4b;
    margin-bottom: 0.5rem;
  }

  .success-state p {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
  }

  .new-message-btn {
    padding: 0.625rem 1.25rem;
    background: none;
    border: 1.5px solid var(--primary-border);
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.2s;
  }

  .new-message-btn:hover {
    background: var(--primary-bg);
    border-color: var(--primary-color);
  }

  /* Form Elements */
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .error-alert {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.75rem;
    color: var(--danger-color);
    font-size: 0.813rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .form-label {
    font-size: 0.813rem;
    font-weight: 600;
    color: #374151;
  }

  .required {
    color: var(--danger-color);
  }

  .input-wrapper, .textarea-wrapper {
    position: relative;
  }

  .input-icon, .textarea-icon {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }

  .textarea-icon {
    top: 1rem;
    transform: none;
  }

  .form-input, .form-textarea {
    width: 100%;
    padding: 0.75rem 0.875rem 0.75rem 2.625rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    color: #1e1b4b;
    background: var(--light-color);
    transition: all 0.2s;
    outline: none;
  }

  .form-textarea {
    padding-top: 0.875rem;
    resize: vertical;
  }

  .form-input:focus, .form-textarea:focus {
    border-color: var(--primary-color);
    background: white;
    box-shadow: 0 0 0 3px rgba(106, 44, 145, 0.1);
  }

  .form-input.error, .form-textarea.error {
    border-color: var(--danger-color);
    background: #fff5f5;
  }

  .error-message {
    font-size: 0.688rem;
    color: var(--danger-color);
  }

  .submit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8125rem 1.25rem;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 0.5rem;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(106, 44, 145, 0.3);
  }

  .submit-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Info Column */
  .info-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .info-panel, .trust-panel {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
  }

  .info-panel h3 {
    font-size: 0.875rem;
    font-weight: 700;
    color: #1e1b4b;
    margin-bottom: 1rem;
  }

  .faq-item {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .faq-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .faq-item h4 {
    font-size: 0.813rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .faq-item p {
    font-size: 0.75rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .trust-panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .trust-badge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.75rem;
    color: #4b5563;
    padding: 0.5rem;
    background: var(--primary-bg);
    border-radius: 0.75rem;
  }

  .trust-badge svg {
    color: var(--primary-color);
  }

  /* Footer */
  .footer {
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 3rem 2rem 1.5rem;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3rem;
    margin-bottom: 2rem;
  }

  .footer-logo {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
  }

  .footer-brand p {
    font-size: 0.813rem;
    color: #6b7280;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .footer-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .link-group h4 {
    font-size: 0.875rem;
    font-weight: 700;
    color: #1e1b4b;
    margin-bottom: 1rem;
  }

  .link-group a {
    display: block;
    font-size: 0.813rem;
    color: #6b7280;
    text-decoration: none;
    margin-bottom: 0.5rem;
    transition: color 0.2s;
  }

  .link-group a:hover {
    color: var(--primary-color);
  }

  .footer-bottom {
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .footer-bottom p {
    font-size: 0.75rem;
    color: #9ca3af;
  }

  /* Responsive */
  @media (max-width: 968px) {
    .contact-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .hero-section {
      padding: 4rem 1.5rem 2rem;
    }

    .info-cards {
      padding: 0 1.5rem;
    }

    .contact-grid {
      padding: 0 1.5rem 3rem;
    }

    .form-column {
      padding: 1.5rem;
    }

    .footer-content {
      grid-template-columns: 1fr;
    }

    .footer-links {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .footer-links {
      grid-template-columns: 1fr;
    }
  }
</style>