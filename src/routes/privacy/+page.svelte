<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    ChevronLeft,
    Home,
    Sparkles,
    Shield,
    Lock,
    Eye,
    Server,
    Globe,
    ChevronRight,
    FileText,
    CheckCircle2
  } from 'lucide-svelte';

  const sections = [
    { id: 'collection', title: 'Information We Collect', icon: Server },
    { id: 'usage', title: 'How We Use Your Information', icon: Eye },
    { id: 'sharing', title: 'Information Sharing', icon: Globe },
    { id: 'security', title: 'Data Security', icon: Lock },
    { id: 'rights', title: 'Your Privacy Rights', icon: Shield },
    { id: 'retention', title: 'Data Retention', icon: FileText },
    { id: 'cookies', title: 'Cookies & Tracking', icon: CheckCircle2 },
    { id: 'changes', title: 'Changes to This Policy', icon: ChevronRight }
  ];

  let activeSection = $state<string | null>(null);

  function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      activeSection = id;
    }
  }

  const lastUpdated = 'April 6, 2026';
</script>

<svelte:head>
  <title>Privacy Policy — Lezie</title>
  <meta name="description" content="Lezie's Privacy Policy explains how we collect, use, and protect your personal information." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="pp-page">

  <!-- LEFT PANEL -->
  <aside class="pp-panel">
    <div class="pp-panel-inner">
      <a href="/" class="pp-logo-link">
        <img src="/icons/lz_logo_t.png" alt="Lezie" class="pp-logo-img" />
      </a>

      <div class="pp-panel-hero">
        <div class="pp-panel-badge">
          <Shield size={14} />
          <span>Your Privacy Matters</span>
        </div>
        <h2 class="pp-panel-headline">
          We protect<br/>
          <em>your data</em>
        </h2>
        <p class="pp-panel-desc">
          Transparency and trust are fundamental to building safer communities. Here's exactly how we handle your information.
        </p>
      </div>

      <nav class="pp-nav">
        <span class="pp-nav-label">Jump to section</span>
        {#each sections as section}
          <button 
            class="pp-nav-link" 
            class:active={activeSection === section.id}
            onclick={() => scrollToSection(section.id)}
          >
            <svelte:component this={section.icon} size={16} />
            <span>{section.title}</span>
          </button>
        {/each}
      </nav>

      <div class="pp-panel-footer">
        <div class="pp-contact-box">
          <p>Questions about your privacy?</p>
          <a href="/contact" class="pp-contact-link">Contact our DPO</a>
        </div>
      </div>
    </div>
    <div class="pp-panel-glow"></div>
  </aside>

  <!-- RIGHT PANEL -->
  <main class="pp-main">
    <div class="pp-form-shell">

      <button class="pp-back-home" onclick={() => goto('/')}>
        <ChevronLeft size={18} />
        <Home size={14} />
        <span>Back to Home</span>
      </button>

      <div class="pp-mobile-brand">
        <a href="/" class="pp-logo-link">
          <img src="/icons/lz_ico.png" alt="Lezie" class="pp-logo-img" />
        </a>
      </div>

      <div class="pp-form-header">
        <h1 class="pp-form-title">Privacy Policy</h1>
        <p class="pp-form-subtitle">Last updated: {lastUpdated}</p>
      </div>

      <div class="pp-content">

        <!-- Intro -->
        <section class="pp-section pp-intro">
          <p class="pp-lead">
            At Lezie, we take your privacy seriously. This Privacy Policy describes how we collect, use, store, and protect your personal information when you use our community safety platform. By using Lezie, you agree to the practices described in this policy.
          </p>
        </section>

        <!-- Section 1: Collection -->
        <section class="pp-section" id="collection">
          <div class="pp-section-header">
            <div class="pp-section-icon"><Server size={20} /></div>
            <h2>1. Information We Collect</h2>
          </div>
          
          <div class="pp-subsection">
            <h3>1.1 Information You Provide</h3>
            <ul class="pp-list">
              <li><strong>Account Information:</strong> Name, email address, phone number, and password when you register</li>
              <li><strong>Profile Information:</strong> Optional profile photo, bio, and neighborhood affiliation</li>
              <li><strong>Location Data:</strong> Precise location when you submit safety reports or enable real-time alerts (with your consent)</li>
              <li><strong>Communications:</strong> Messages sent through our platform, support requests, and feedback</li>
              <li><strong>Incident Reports:</strong> Photos, descriptions, and location data you submit regarding safety incidents</li>
            </ul>
          </div>

          <div class="pp-subsection">
            <h3>1.2 Information We Automatically Collect</h3>
            <ul class="pp-list">
              <li><strong>Device Information:</strong> IP address, device type, operating system, and browser type</li>
              <li><strong>Usage Data:</strong> How you interact with our platform, features used, and time spent</li>
              <li><strong>Location Data:</strong> General location derived from IP address for service optimization</li>
              <li><strong>Cookies:</strong> Data collected through cookies and similar technologies (see Cookies section)</li>
            </ul>
          </div>
        </section>

        <!-- Section 2: Usage -->
        <section class="pp-section" id="usage">
          <div class="pp-section-header">
            <div class="pp-section-icon"><Eye size={20} /></div>
            <h2>2. How We Use Your Information</h2>
          </div>
          
          <p>We use your personal information for the following purposes:</p>
          
          <div class="pp-usage-grid">
            <div class="pp-usage-card">
              <h4>Service Provision</h4>
              <p>To operate and maintain the Lezie platform, authenticate users, and deliver real-time safety alerts</p>
            </div>
            <div class="pp-usage-card">
              <h4>Safety & Security</h4>
              <p>To verify incident reports, prevent fraud, and ensure the integrity of community safety data</p>
            </div>
            <div class="pp-usage-card">
              <h4>Communication</h4>
              <p>To send service notifications, safety alerts, and respond to your inquiries</p>
            </div>
            <div class="pp-usage-card">
              <h4>Improvement</h4>
              <p>To analyze usage patterns and improve our platform features and user experience</p>
            </div>
          </div>

          <div class="pp-highlight-box">
            <strong>We never use your location data for advertising purposes.</strong> Your precise location is only used to deliver relevant safety alerts and verify incident reports within your community.
          </div>
        </section>

        <!-- Section 3: Sharing -->
        <section class="pp-section" id="sharing">
          <div class="pp-section-header">
            <div class="pp-section-icon"><Globe size={20} /></div>
            <h2>3. Information Sharing</h2>
          </div>
          
          <p>We do not sell your personal information. We only share data in the following circumstances:</p>
          
          <div class="pp-subsection">
            <h3>3.1 Within Your Community</h3>
            <p>When you submit an incident report, your username and general location area are visible to verified members of your designated community. Precise addresses are never shared publicly.</p>
          </div>

          <div class="pp-subsection">
            <h3>3.2 Service Providers</h3>
            <p>We engage trusted third-party providers for:</p>
            <ul class="pp-list">
              <li>Cloud hosting and data storage (encrypted at rest and in transit)</li>
              <li>Email and SMS notification delivery</li>
              <li>Analytics and crash reporting (anonymized data only)</li>
              <li>Customer support platform</li>
            </ul>
          </div>

          <div class="pp-subsection">
            <h3>3.3 Legal Requirements</h3>
            <p>We may disclose information if required by law, court order, or governmental request, or when necessary to protect our rights, property, or safety, or that of our users or the public.</p>
          </div>

          <div class="pp-subsection">
            <h3>3.4 Emergency Situations</h3>
            <p>In genuine emergencies involving imminent danger to personal safety, we may share relevant information with law enforcement or emergency services.</p>
          </div>
        </section>

        <!-- Section 4: Security -->
        <section class="pp-section" id="security">
          <div class="pp-section-header">
            <div class="pp-section-icon"><Lock size={20} /></div>
            <h2>4. Data Security</h2>
          </div>
          
          <p>We implement industry-standard security measures to protect your data:</p>
          
          <ul class="pp-list pp-list-check">
            <li><strong>Encryption:</strong> AES-256 encryption for data at rest; TLS 1.3 for data in transit</li>
            <li><strong>Authentication:</strong> Multi-factor authentication options and secure password hashing (bcrypt)</li>
            <li><strong>Access Controls:</strong> Role-based access with principle of least privilege</li>
            <li><strong>Monitoring:</strong> 24/7 security monitoring and automated threat detection</li>
            <li><strong>Audits:</strong> Regular third-party security assessments and penetration testing</li>
          </ul>

          <p class="pp-note">While we take every precaution, no internet transmission is 100% secure. We encourage users to use strong passwords and enable two-factor authentication.</p>
        </section>

        <!-- Section 5: Rights -->
        <section class="pp-section" id="rights">
          <div class="pp-section-header">
            <div class="pp-section-icon"><Shield size={20} /></div>
            <h2>5. Your Privacy Rights</h2>
          </div>
          
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          
          <div class="pp-rights-grid">
            <div class="pp-right-item">
              <h4>Access</h4>
              <p>Request a copy of the personal data we hold about you</p>
            </div>
            <div class="pp-right-item">
              <h4>Correction</h4>
              <p>Update or correct inaccurate information in your profile</p>
            </div>
            <div class="pp-right-item">
              <h4>Deletion</h4>
              <p>Request deletion of your account and associated data</p>
            </div>
            <div class="pp-right-item">
              <h4>Portability</h4>
              <p>Export your data in a machine-readable format</p>
            </div>
            <div class="pp-right-item">
              <h4>Restriction</h4>
              <p>Limit how we process your data in certain circumstances</p>
            </div>
            <div class="pp-right-item">
              <h4>Objection</h4>
              <p>Opt-out of certain data processing activities</p>
            </div>
          </div>

          <p class="pp-note">To exercise these rights, contact us at <a href="mailto:privacy@lezie.com" class="pp-link">privacy@lezie.com</a> or through your account settings. We respond to all requests within 30 days.</p>
        </section>

        <!-- Section 6: Retention -->
        <section class="pp-section" id="retention">
          <div class="pp-section-header">
            <div class="pp-section-icon"><FileText size={20} /></div>
            <h2>6. Data Retention</h2>
          </div>
          
          <p>We retain your information only as long as necessary:</p>
          
          <ul class="pp-list">
            <li><strong>Account Data:</strong> Retained while your account is active; deleted within 30 days of account closure (unless legally required to retain longer)</li>
            <li><strong>Incident Reports:</strong> Retained for 2 years to maintain community safety records and legal compliance</li>
            <li><strong>Usage Logs:</strong> Anonymized after 90 days; raw logs deleted after 1 year</li>
            <li><strong>Communications:</strong> Support tickets retained for 3 years for quality assurance</li>
          </ul>

          <p class="pp-note">You may request early deletion of specific data by contacting our Data Protection Officer.</p>
        </section>

        <!-- Section 7: Cookies -->
        <section class="pp-section" id="cookies">
          <div class="pp-section-header">
            <div class="pp-section-icon"><CheckCircle2 size={20} /></div>
            <h2>7. Cookies & Tracking Technologies</h2>
          </div>
          
          <p>We use cookies and similar technologies to:</p>
          
          <ul class="pp-list">
            <li><strong>Essential:</strong> Maintain your session and authentication status (required)</li>
            <li><strong>Preferences:</strong> Remember your settings and display preferences</li>
            <li><strong>Analytics:</strong> Understand how visitors interact with our platform (anonymized)</li>
            <li><strong>Security:</strong> Detect and prevent fraudulent activity</li>
          </ul>

          <p>You can manage cookie preferences through your browser settings. Note that disabling essential cookies may affect platform functionality.</p>
        </section>

        <!-- Section 8: Changes -->
        <section class="pp-section" id="changes">
          <div class="pp-section-header">
            <div class="pp-section-icon"><ChevronRight size={20} /></div>
            <h2>8. Changes to This Policy</h2>
          </div>
          
          <p>We may update this Privacy Policy periodically to reflect changes in our practices, technology, or legal requirements. When we make significant changes, we will:</p>
          
          <ul class="pp-list">
            <li>Post the updated policy with a revised "Last Updated" date</li>
            <li>Notify you via email or platform notification at least 30 days before material changes take effect</li>
            <li>Require renewed consent where required by law (e.g., for new data processing purposes)</li>
          </ul>

          <p class="pp-note">Continued use of Lezie after changes constitutes acceptance of the updated policy.</p>
        </section>

        <!-- Contact -->
        <section class="pp-section pp-contact">
          <h2>Contact Us</h2>
          <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          
          <div class="pp-contact-cards">
            <div class="pp-contact-card">
              <h4>Data Protection Officer</h4>
              <a href="mailto:privacy@lezie.com" class="pp-link">privacy@lezie.com</a>
              <p>For privacy-specific inquiries and rights requests</p>
            </div>
            <div class="pp-contact-card">
              <h4>General Support</h4>
              <a href="/contact" class="pp-link">Contact Page</a>
              <p>For general questions about our platform</p>
            </div>
          </div>

          <div class="pp-address">
            <strong>Lezie Inc.</strong><br>
            123 Safety Street, Suite 456<br>
            San Francisco, CA 94105<br>
            United States
          </div>
        </section>

      </div>

      <p class="pp-footer-text">
        Also read our <a href="/terms" class="pp-link">Terms of Service</a> and <a href="/cookies" class="pp-link">Cookie Policy</a>
      </p>

    </div>
  </main>
</div>

<style>
  :global(.pp-page *) { 
    font-family: 'DM Sans', system-ui, sans-serif; 
    box-sizing: border-box; 
  }

  .pp-page { 
    display: flex; 
    min-height: 100vh; 
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%); 
  }

  /* LEFT PANEL */
  .pp-panel { 
    display: none; 
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 440px; 
    height: 100vh; 
    flex-shrink: 0; 
    background: linear-gradient(160deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%); 
    overflow: hidden; 
    overflow-y: auto; 
  }

  @media (min-width: 1024px) { 
    .pp-panel { display: flex; } 
    .pp-main { margin-left: 440px; } 
  }

  .pp-panel-inner { 
    position: relative; 
    z-index: 2; 
    display: flex; 
    flex-direction: column; 
    padding: 2.5rem; 
    min-height: 100%; 
  }

  .pp-panel-glow { 
    position: absolute; 
    inset: 0; 
    z-index: 1; 
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%); 
    pointer-events: none; 
  }

  .pp-logo-link { 
    display: inline-block; 
    line-height: 0; 
    margin-bottom: 2.5rem; 
    transition: transform 0.2s, opacity 0.2s; 
  }

  .pp-logo-link:hover { 
    opacity: 0.85; 
    transform: scale(1.02); 
  }

  .pp-logo-img { 
    width: 80px; 
    height: 80px; 
    object-fit: contain; 
    display: block; 
  }

  .pp-panel-badge { 
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

  .pp-panel-headline { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 2.5rem; 
    line-height: 1.2; 
    color: white; 
    margin-bottom: 1rem; 
  }

  .pp-panel-headline em { 
    color: #c4b5fd; 
    font-style: italic; 
  }

  .pp-panel-desc { 
    font-size: 0.875rem; 
    line-height: 1.6; 
    color: rgba(196,181,253,0.85); 
    margin-bottom: 2.5rem; 
  }

  /* Navigation */
  .pp-nav { 
    display: flex; 
    flex-direction: column; 
    gap: 0.5rem; 
    margin-bottom: auto; 
  }

  .pp-nav-label { 
    font-size: 0.75rem; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
    color: rgba(196,181,253,0.6); 
    margin-bottom: 0.5rem; 
    padding-left: 0.75rem; 
  }

  .pp-nav-link { 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    padding: 0.75rem; 
    background: rgba(255,255,255,0.05); 
    border: 1px solid transparent; 
    border-radius: 0.75rem; 
    color: rgba(255,255,255,0.8); 
    font-size: 0.875rem; 
    font-weight: 500; 
    cursor: pointer; 
    transition: all 0.2s; 
    text-align: left; 
  }

  .pp-nav-link:hover, 
  .pp-nav-link.active { 
    background: rgba(139,92,246,0.2); 
    border-color: rgba(139,92,246,0.3); 
    color: white; 
  }

  .pp-nav-link :global(svg) { 
    color: #c4b5fd; 
    flex-shrink: 0; 
  }

  .pp-panel-footer { 
    margin-top: 2rem; 
    padding-top: 1.5rem; 
    border-top: 1px solid rgba(255,255,255,0.1); 
  }

  .pp-contact-box { 
    background: rgba(139,92,246,0.15); 
    border: 1px solid rgba(139,92,246,0.25); 
    border-radius: 1rem; 
    padding: 1.25rem; 
    text-align: center; 
  }

  .pp-contact-box p { 
    font-size: 0.875rem; 
    color: rgba(255,255,255,0.8); 
    margin: 0 0 0.75rem 0; 
  }

  .pp-contact-link { 
    display: inline-block; 
    padding: 0.5rem 1rem; 
    background: rgba(255,255,255,0.1); 
    color: #c4b5fd; 
    text-decoration: none; 
    border-radius: 0.5rem; 
    font-size: 0.875rem; 
    font-weight: 600; 
    transition: all 0.2s; 
  }

  .pp-contact-link:hover { 
    background: rgba(255,255,255,0.15); 
    color: white; 
  }

  /* RIGHT PANEL */
  .pp-main { 
    flex: 1; 
    display: flex; 
    align-items: flex-start; 
    justify-content: center; 
    padding: 2rem 1.25rem; 
    min-height: 100vh; 
  }

  .pp-form-shell { 
    width: 100%; 
    max-width: 720px; 
    display: flex; 
    flex-direction: column; 
    gap: 1.5rem; 
    padding-top: 1rem; 
  }

  .pp-back-home { 
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

  .pp-back-home:hover { 
    border-color: #6a2c91; 
    color: #6a2c91; 
    background: #f3e8ff; 
    transform: translateX(-2px); 
  }

  .pp-mobile-brand { 
    display: flex; 
    justify-content: center; 
  }

  .pp-mobile-brand .pp-logo-link { 
    margin-bottom: 0; 
  }

  .pp-mobile-brand .pp-logo-img { 
    width: 80px; 
    height: 80px; 
  }

  @media (min-width: 1024px) { 
    .pp-mobile-brand { display: none; } 
  }

  .pp-form-header { 
    text-align: center; 
    margin-bottom: 0.5rem; 
  }

  .pp-form-title { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: clamp(1.625rem, 4vw, 2rem); 
    color: #1e1b4b; 
    margin-bottom: 0.25rem; 
    letter-spacing: -0.02em; 
  }

  .pp-form-subtitle { 
    font-size: 0.875rem; 
    color: #64748b; 
  }

  /* Content */
  .pp-content { 
    background: white; 
    border-radius: 1.5rem; 
    border: 1px solid #e2e8f0; 
    padding: clamp(1.5rem, 5vw, 2.5rem); 
    box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1); 
    display: flex; 
    flex-direction: column; 
    gap: 2.5rem; 
  }

  .pp-section { 
    scroll-margin-top: 2rem; 
  }

  .pp-intro { 
    border-bottom: 1px solid #e2e8f0; 
    padding-bottom: 2rem; 
  }

  .pp-lead { 
    font-size: 1.0625rem; 
    line-height: 1.7; 
    color: #4b5563; 
    margin: 0; 
  }

  .pp-section-header { 
    display: flex; 
    align-items: center; 
    gap: 0.875rem; 
    margin-bottom: 1.25rem; 
  }

  .pp-section-icon { 
    width: 44px; 
    height: 44px; 
    background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%); 
    border-radius: 12px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: #6a2c91; 
  }

  .pp-section h2 { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.375rem; 
    color: #1e1b4b; 
    margin: 0; 
  }

  .pp-subsection { 
    margin-bottom: 1.5rem; 
  }

  .pp-subsection:last-child { 
    margin-bottom: 0; 
  }

  .pp-subsection h3 { 
    font-size: 1.0625rem; 
    font-weight: 700; 
    color: #374151; 
    margin: 0 0 0.75rem 0; 
  }

  .pp-subsection p { 
    font-size: 0.9375rem; 
    line-height: 1.7; 
    color: #4b5563; 
    margin: 0 0 0.75rem 0; 
  }

  .pp-list { 
    list-style: none; 
    padding: 0; 
    margin: 0 0 1rem 0; 
    display: flex; 
    flex-direction: column; 
    gap: 0.625rem; 
  }

  .pp-list li { 
    position: relative; 
    padding-left: 1.5rem; 
    font-size: 0.9375rem; 
    line-height: 1.6; 
    color: #4b5563; 
  }

  .pp-list li::before { 
    content: ''; 
    position: absolute; 
    left: 0; 
    top: 0.6rem; 
    width: 6px; 
    height: 6px; 
    background: #6a2c91; 
    border-radius: 50%; 
  }

  .pp-list-check li::before { 
    content: '✓'; 
    width: auto; 
    height: auto; 
    background: transparent; 
    color: #10b981; 
    font-weight: 700; 
    top: 0; 
  }

  .pp-highlight-box { 
    background: linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%); 
    border-left: 4px solid #6a2c91; 
    border-radius: 0 0.75rem 0.75rem 0; 
    padding: 1.25rem; 
    font-size: 0.9375rem; 
    line-height: 1.6; 
    color: #4b5563; 
    margin-top: 1rem; 
  }

  .pp-note { 
    font-size: 0.875rem; 
    color: #6b7280; 
    font-style: italic; 
    margin-top: 1rem; 
    padding: 1rem; 
    background: #f9fafb; 
    border-radius: 0.5rem; 
    border: 1px solid #e5e7eb; 
  }

  /* Usage Grid */
  .pp-usage-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
    gap: 1rem; 
    margin: 1.25rem 0; 
  }

  .pp-usage-card { 
    padding: 1.25rem; 
    background: #faf9ff; 
    border: 1px solid #e0d4f5; 
    border-radius: 1rem; 
  }

  .pp-usage-card h4 { 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: #6a2c91; 
    margin: 0 0 0.5rem 0; 
  }

  .pp-usage-card p { 
    font-size: 0.875rem; 
    line-height: 1.5; 
    color: #64748b; 
    margin: 0; 
  }

  /* Rights Grid */
  .pp-rights-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
    gap: 1rem; 
    margin: 1.25rem 0; 
  }

  .pp-right-item { 
    padding: 1rem; 
    background: white; 
    border: 1px solid #e0d4f5; 
    border-radius: 0.75rem; 
    transition: all 0.2s; 
  }

  .pp-right-item:hover { 
    border-color: #6a2c91; 
    box-shadow: 0 4px 12px rgba(106,44,145,0.1); 
  }

  .pp-right-item h4 { 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: #1e1b4b; 
    margin: 0 0 0.25rem 0; 
  }

  .pp-right-item p { 
    font-size: 0.8125rem; 
    line-height: 1.5; 
    color: #64748b; 
    margin: 0; 
  }

  /* Contact Section */
  .pp-contact { 
    background: linear-gradient(135deg, #faf9ff 0%, #f5f0ff 100%); 
    border-radius: 1.25rem; 
    padding: 2rem; 
    margin-top: 1rem; 
  }

  .pp-contact h2 { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.5rem; 
    color: #1e1b4b; 
    margin: 0 0 1rem 0; 
  }

  .pp-contact > p { 
    font-size: 0.9375rem; 
    line-height: 1.6; 
    color: #4b5563; 
    margin: 0 0 1.5rem 0; 
  }

  .pp-contact-cards { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
    gap: 1rem; 
    margin-bottom: 1.5rem; 
  }

  .pp-contact-card { 
    background: white; 
    padding: 1.25rem; 
    border-radius: 1rem; 
    border: 1px solid #e0d4f5; 
  }

  .pp-contact-card h4 { 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: #1e1b4b; 
    margin: 0 0 0.5rem 0; 
  }

  .pp-contact-card .pp-link { 
    display: inline-block; 
    margin-bottom: 0.5rem; 
  }

  .pp-contact-card p { 
    font-size: 0.8125rem; 
    color: #6b7280; 
    margin: 0; 
  }

  .pp-address { 
    font-size: 0.875rem; 
    line-height: 1.6; 
    color: #4b5563; 
    padding-top: 1.5rem; 
    border-top: 1px solid #e0d4f5; 
  }

  .pp-link { 
    color: #6a2c91; 
    font-weight: 600; 
    text-decoration: none; 
  }

  .pp-link:hover { 
    text-decoration: underline; 
  }

  /* Footer */
  .pp-footer-text { 
    text-align: center; 
    font-size: 0.875rem; 
    color: #64748b; 
    margin-top: 0.5rem; 
  }

  /* Responsive */
  @media (max-width: 768px) {
    .pp-usage-grid, 
    .pp-rights-grid { 
      grid-template-columns: 1fr; 
    }
    
    .pp-contact-cards { 
      grid-template-columns: 1fr; 
    }
    
    .pp-section-icon { 
      width: 36px; 
      height: 36px; 
    }
    
    .pp-section-icon :global(svg) { 
      width: 18px; 
      height: 18px; 
    }
    
    .pp-section h2 { 
      font-size: 1.125rem; 
    }
  }

  @media (max-width: 640px) {
    .pp-main { 
      padding: 1.5rem 1rem; 
    }
    
    .pp-form-shell { 
      gap: 1.25rem; 
    }
    
    .pp-content { 
      border-radius: 1.25rem; 
      padding: 1.25rem; 
      gap: 2rem; 
    }
    
    .pp-contact { 
      padding: 1.5rem; 
    }
    
    .pp-back-home { 
      font-size: 0.75rem; 
      padding: 0.375rem 0.875rem; 
    }
    
    .pp-panel-headline { 
      font-size: 2rem; 
    }
  }
</style>
