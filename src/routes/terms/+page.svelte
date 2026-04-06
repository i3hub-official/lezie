<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    ChevronLeft,
    Home,
    Sparkles,
    FileText,
    Shield,
    Scale,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    ArrowRight,
    Mail
  } from 'lucide-svelte';

  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: CheckCircle },
    { id: 'eligibility', title: 'Eligibility', icon: Shield },
    { id: 'account', title: 'Account Registration', icon: FileText },
    { id: 'conduct', title: 'User Conduct', icon: AlertTriangle },
    { id: 'content', title: 'Content & Reports', icon: FileText },
    { id: 'privacy', title: 'Privacy & Data', icon: Shield },
    { id: 'termination', title: 'Termination', icon: Scale },
    { id: 'liability', title: 'Limitation of Liability', icon: AlertTriangle },
    { id: 'changes', title: 'Changes to Terms', icon: ChevronRight }
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
  <title>Terms of Service — Lezie</title>
  <meta name="description" content="Lezie's Terms of Service outline the rules and guidelines for using our community safety platform." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="to-page">

  <!-- LEFT PANEL -->
  <aside class="to-panel">
    <div class="to-panel-inner">
      <a href="/" class="to-logo-link">
        <img src="/icons/lz_logo_t.png" alt="Lezie" class="to-logo-img" />
      </a>

      <div class="to-panel-hero">
        <div class="to-panel-badge">
          <Scale size={14} />
          <span>Legal</span>
        </div>
        <h2 class="to-panel-headline">
          Terms of<br/>
          <em>Service</em>
        </h2>
        <p class="to-panel-desc">
          These terms govern your use of Lezie. By accessing or using our platform, you agree to be bound by these terms.
        </p>
      </div>

      <nav class="to-nav">
        <span class="to-nav-label">Jump to section</span>
        {#each sections as section}
          <button 
            class="to-nav-link" 
            class:active={activeSection === section.id}
            onclick={() => scrollToSection(section.id)}
          >
            <svelte:component this={section.icon} size={16} />
            <span>{section.title}</span>
          </button>
        {/each}
      </nav>

      <div class="to-panel-footer">
        <p>Questions about these terms?</p>
        <a href="/contact" class="to-contact-btn">
          Contact Us <ArrowRight size={14} />
        </a>
      </div>
    </div>
    <div class="to-panel-glow"></div>
  </aside>

  <!-- RIGHT PANEL -->
  <main class="to-main">
    <div class="to-form-shell">

      <button class="to-back-home" onclick={() => goto('/')}>
        <ChevronLeft size={18} />
        <Home size={14} />
        <span>Back to Home</span>
      </button>

      <div class="to-mobile-brand">
        <a href="/" class="to-logo-link">
          <img src="/icons/lz_ico.png" alt="Lezie" class="to-logo-img" />
        </a>
      </div>

      <div class="to-form-header">
        <h1 class="to-form-title">Terms of Service</h1>
        <p class="to-form-subtitle">Last updated: {lastUpdated}</p>
      </div>

      <div class="to-content">

        <!-- Intro -->
        <section class="to-section to-intro">
          <p class="to-lead">
            Welcome to Lezie. These Terms of Service ("Terms") constitute a legally binding agreement between you and Lezie Inc. ("Lezie," "we," "us," or "our") governing your access to and use of the Lezie platform, including our website, mobile applications, and related services (collectively, the "Services").
          </p>
          <p class="to-lead">
            Please read these Terms carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
          </p>
        </section>

        <!-- Section 1: Acceptance -->
        <section class="to-section" id="acceptance">
          <div class="to-section-header">
            <div class="to-section-icon"><CheckCircle size={20} /></div>
            <h2>1. Acceptance of Terms</h2>
          </div>
          
          <p>By creating an account, accessing, or using Lezie, you agree to:</p>
          <ul class="to-list">
            <li>These Terms of Service</li>
            <li>Our <a href="/privacy" class="to-link">Privacy Policy</a></li>
            <li>Our <a href="/community-guidelines" class="to-link">Community Guidelines</a></li>
            <li>All applicable local, state, national, and international laws and regulations</li>
          </ul>
          
          <div class="to-highlight-box">
            <strong>Important:</strong> If you are using Lezie on behalf of an organization, you represent and warrant that you have authority to bind that organization to these Terms.
          </div>
        </section>

        <!-- Section 2: Eligibility -->
        <section class="to-section" id="eligibility">
          <div class="to-section-header">
            <div class="to-section-icon"><Shield size={20} /></div>
            <h2>2. Eligibility</h2>
          </div>
          
          <p>You must meet the following requirements to use Lezie:</p>
          
          <div class="to-requirement-grid">
            <div class="to-requirement-item">
              <h4>Age Requirement</h4>
              <p>You must be at least 13 years old. Users under 18 must have parental or guardian consent.</p>
            </div>
            <div class="to-requirement-item">
              <h4>Legal Capacity</h4>
              <p>You must have the legal capacity to enter into a binding contract in your jurisdiction.</p>
            </div>
            <div class="to-requirement-item">
              <h4>Account Status</h4>
              <p>You must not have been previously banned or removed from Lezie for violations.</p>
            </div>
            <div class="to-requirement-item">
              <h4>Accurate Information</h4>
              <p>You must provide truthful, accurate, and complete information during registration.</p>
            </div>
          </div>
          
          <p class="to-note">We reserve the right to verify your age and identity at any time and to terminate accounts that do not meet these requirements.</p>
        </section>

        <!-- Section 3: Account -->
        <section class="to-section" id="account">
          <div class="to-section-header">
            <div class="to-section-icon"><FileText size={20} /></div>
            <h2>3. Account Registration</h2>
          </div>
          
          <p>When you create a Lezie account, you agree to:</p>
          
          <ul class="to-list">
            <li><strong>Provide accurate information:</strong> Use your real name, valid email, and accurate location. False information is grounds for immediate termination.</li>
            <li><strong>Maintain security:</strong> You are responsible for maintaining the confidentiality of your password and account credentials.</li>
            <li><strong>Notify us of breaches:</strong> Immediately inform us of any unauthorized access or security breach at <a href="mailto:security@lezie.com" class="to-link">security@lezie.com</a>.</li>
            <li><strong>One person per account:</strong> Accounts are personal and non-transferable. Do not share your account credentials.</li>
            <li><strong>Community verification:</strong> You must verify your address to join a community. Each account may belong to multiple communities but must have one primary residence.</li>
          </ul>
          
          <div class="to-highlight-box to-highlight--warning">
            <strong>Security Notice:</strong> Lezie will never ask for your password via email or phone. Report suspicious requests immediately.
          </div>
        </section>

        <!-- Section 4: Conduct -->
        <section class="to-section" id="conduct">
          <div class="to-section-header">
            <div class="to-section-icon"><AlertTriangle size={20} /></div>
            <h2>4. User Conduct</h2>
          </div>
          
          <p>You agree not to engage in any of the following prohibited activities:</p>
          
          <div class="to-prohibited-grid">
            <div class="to-prohibited-item">
              <h4>False Reports</h4>
              <p>Submitting fabricated or knowingly false safety reports</p>
            </div>
            <div class="to-prohibited-item">
              <h4>Harassment</h4>
              <p>Harassing, threatening, or intimidating other users</p>
            </div>
            <div class="to-prohibited-item">
              <h4>Discrimination</h4>
              <p>Discriminatory content based on race, religion, gender, etc.</p>
            </div>
            <div class="to-prohibited-item">
              <h4>Illegal Activity</h4>
              <p>Using Lezie for any illegal purpose or to plan crimes</p>
            </div>
            <div class="to-prohibited-item">
              <h4>Spam</h4>
              <p>Posting irrelevant, repetitive, or promotional content</p>
            </div>
            <div class="to-prohibited-item">
              <h4>Impersonation</h4>
              <p>Pretending to be another person, organization, or authority</p>
            </div>
            <div class="to-prohibited-item">
              <h4>Data Mining</h4>
              <p>Scraping, harvesting, or collecting user data without consent</p>
            </div>
            <div class="to-prohibited-item">
              <h4>System Abuse</h4>
              <p>Attempting to disrupt, damage, or gain unauthorized access to Lezie systems</p>
            </div>
          </div>
          
          <p>Violations may result in content removal, account suspension, or permanent ban, and may be reported to law enforcement where appropriate.</p>
        </section>

        <!-- Section 5: Content -->
        <section class="to-section" id="content">
          <div class="to-section-header">
            <div class="to-section-icon"><FileText size={20} /></div>
            <h2>5. Content & Reports</h2>
          </div>
          
          <h3>5.1 Your Content</h3>
          <p>When you submit incident reports, comments, or other content to Lezie:</p>
          <ul class="to-list">
            <li>You retain ownership of your content but grant Lezie a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display it for the purpose of operating and improving our Services.</li>
            <li>You represent that you have all necessary rights to submit the content and that it does not violate any third-party rights.</li>
            <li>You understand that safety reports may be shared with local authorities, emergency services, or other users as necessary for community safety.</li>
          </ul>
          
          <h3>5.2 Content Moderation</h3>
          <p>Lezie reserves the right to review, modify, or remove any content that violates these Terms or our Community Guidelines. We may use automated systems and human moderators to review content.</p>
          
          <h3>5.3 Emergency Situations</h3>
          <p>In genuine emergencies involving imminent danger, Lezie may share relevant information with law enforcement or emergency services without prior notice to the user.</p>
        </section>

        <!-- Section 6: Privacy -->
        <section class="to-section" id="privacy">
          <div class="to-section-header">
            <div class="to-section-icon"><Shield size={20} /></div>
            <h2>6. Privacy & Data</h2>
          </div>
          
          <p>Your privacy is important to us. Our <a href="/privacy" class="to-link">Privacy Policy</a> explains how we collect, use, and protect your personal information. By using Lezie, you consent to our data practices as described in the Privacy Policy.</p>
          
          <p>Key points:</p>
          <ul class="to-list">
            <li>Your precise location is used only for safety alerts and incident verification</li>
            <li>We do not sell your personal data to advertisers</li>
            <li>We implement industry-standard security measures to protect your data</li>
            <li>You can request deletion of your account and data at any time</li>
          </ul>
        </section>

        <!-- Section 7: Termination -->
        <section class="to-section" id="termination">
          <div class="to-section-header">
            <div class="to-section-icon"><Scale size={20} /></div>
            <h2>7. Termination</h2>
          </div>
          
          <h3>7.1 By You</h3>
          <p>You may delete your account at any time through Settings > Account > Delete Account. Upon deletion, your personal information will be removed within 30 days, except where retention is required by law or for legitimate safety purposes.</p>
          
          <h3>7.2 By Lezie</h3>
          <p>We may suspend or terminate your account immediately, without prior notice or liability, for any reason, including:</p>
          <ul class="to-list">
            <li>Violation of these Terms or our Community Guidelines</li>
            <li>Submission of false or misleading safety reports</li>
            <li>Illegal activity or threats of violence</li>
            <li>Extended periods of inactivity (over 2 years)</li>
            <li>Technical necessity or security concerns</li>
          </ul>
          
          <p>Upon termination, your right to use the Services ceases immediately. All provisions of these Terms that by their nature should survive termination shall survive.</p>
        </section>

        <!-- Section 8: Liability -->
        <section class="to-section" id="liability">
          <div class="to-section-header">
            <div class="to-section-icon"><AlertTriangle size={20} /></div>
            <h2>8. Limitation of Liability</h2>
          </div>
          
          <div class="to-highlight-box to-highlight--warning">
            <strong>Important Disclaimer:</strong> Lezie is a community information platform, not an emergency service. Always contact local emergency services (911, 112, etc.) for immediate assistance.
          </div>
          
          <p>To the maximum extent permitted by law:</p>
          <ul class="to-list">
            <li>Lezie provides the Services "as is" and "as available" without warranties of any kind, either express or implied.</li>
            <li>We do not guarantee the accuracy, completeness, or timeliness of user-generated reports.</li>
            <li>We are not responsible for the actions or inactions of users or third parties.</li>
            <li>Our total liability for any claims arising from these Terms or the Services shall not exceed the amount you paid us (if any) in the 12 months preceding the claim, or $100, whichever is greater.</li>
          </ul>
          
          <p>Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities, so some of the above limitations may not apply to you.</p>
        </section>

        <!-- Section 9: Changes -->
        <section class="to-section" id="changes">
          <div class="to-section-header">
            <div class="to-section-icon"><ChevronRight size={20} /></div>
            <h2>9. Changes to Terms</h2>
          </div>
          
          <p>We may modify these Terms at any time. When we make material changes:</p>
          <ul class="to-list">
            <li>We will post the updated Terms with a revised "Last Updated" date</li>
            <li>We will notify you via email or in-app notification at least 30 days before material changes take effect</li>
            <li>Your continued use of Lezie after changes constitutes acceptance of the updated Terms</li>
          </ul>
          
          <p>If you do not agree to the revised Terms, you must stop using the Services.</p>
        </section>

        <!-- Contact -->
        <section class="to-section to-contact">
          <h2>Contact Us</h2>
          <p>If you have questions about these Terms, please contact us:</p>
          
          <div class="to-contact-cards">
            <div class="to-contact-card">
              <h4>Legal Inquiries</h4>
              <a href="mailto:legal@lezie.com" class="to-link">legal@lezie.com</a>
              <p>For questions about these Terms</p>
            </div>
            <div class="to-contact-card">
              <h4>General Support</h4>
              <a href="/contact" class="to-link">Contact Page</a>
              <p>For general platform questions</p>
            </div>
          </div>

          <div class="to-address">
            <strong>Lezie Inc.</strong><br>
            123 Safety Street, Suite 456<br>
            San Francisco, CA 94105<br>
            United States
          </div>
        </section>

      </div>

      <p class="to-footer-text">
        Also read our <a href="/privacy" class="to-link">Privacy Policy</a> and <a href="/community-guidelines" class="to-link">Community Guidelines</a>
      </p>

    </div>
  </main>
</div>

<style>
  :global(.to-page *) { 
    font-family: 'DM Sans', system-ui, sans-serif; 
    box-sizing: border-box; 
  }

  .to-page { 
    display: flex; 
    min-height: 100vh; 
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%); 
  }

  /* LEFT PANEL */
  .to-panel { 
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
    .to-panel { display: flex; } 
    .to-main { margin-left: 440px; } 
  }

  .to-panel-inner { 
    position: relative; 
    z-index: 2; 
    display: flex; 
    flex-direction: column; 
    padding: 2.5rem; 
    min-height: 100%; 
  }

  .to-panel-glow { 
    position: absolute; 
    inset: 0; 
    z-index: 1; 
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%); 
    pointer-events: none; 
  }

  .to-logo-link { 
    display: inline-block; 
    line-height: 0; 
    margin-bottom: 2.5rem; 
    transition: transform 0.2s, opacity 0.2s; 
  }

  .to-logo-link:hover { 
    opacity: 0.85; 
    transform: scale(1.02); 
  }

  .to-logo-img { 
    width: 80px; 
    height: 80px; 
    object-fit: contain; 
    display: block; 
  }

  .to-panel-badge { 
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

  .to-panel-headline { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 2.5rem; 
    line-height: 1.2; 
    color: white; 
    margin-bottom: 1rem; 
  }

  .to-panel-headline em { 
    color: #c4b5fd; 
    font-style: italic; 
  }

  .to-panel-desc { 
    font-size: 0.875rem; 
    line-height: 1.6; 
    color: rgba(196,181,253,0.85); 
    margin-bottom: 2.5rem; 
  }

  /* Navigation */
  .to-nav { 
    display: flex; 
    flex-direction: column; 
    gap: 0.5rem; 
    margin-bottom: auto; 
  }

  .to-nav-label { 
    font-size: 0.75rem; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
    color: rgba(196,181,253,0.6); 
    margin-bottom: 0.5rem; 
    padding-left: 0.75rem; 
  }

  .to-nav-link { 
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

  .to-nav-link:hover, 
  .to-nav-link.active { 
    background: rgba(139,92,246,0.2); 
    border-color: rgba(139,92,246,0.3); 
    color: white; 
  }

  .to-nav-link :global(svg) { 
    color: #c4b5fd; 
    flex-shrink: 0; 
  }

  .to-panel-footer { 
    margin-top: 2rem; 
    padding-top: 1.5rem; 
    border-top: 1px solid rgba(255,255,255,0.1); 
  }

  .to-panel-footer p { 
    font-size: 0.875rem; 
    color: rgba(196,181,253,0.8); 
    margin-bottom: 0.75rem; 
  }

  .to-contact-btn { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.625rem 1rem; 
    background: rgba(139,92,246,0.2); 
    border: 1px solid rgba(139,92,246,0.3); 
    border-radius: 0.75rem; 
    color: #c4b5fd; 
    font-size: 0.875rem; 
    font-weight: 600; 
    text-decoration: none; 
    transition: all 0.2s; 
  }

  .to-contact-btn:hover { 
    background: rgba(139,92,246,0.3); 
    color: white; 
  }

  /* RIGHT PANEL */
  .to-main { 
    flex: 1; 
    display: flex; 
    align-items: flex-start; 
    justify-content: center; 
    padding: 2rem 1.25rem; 
    min-height: 100vh; 
  }

  .to-form-shell { 
    width: 100%; 
    max-width: 720px; 
    display: flex; 
    flex-direction: column; 
    gap: 1.5rem; 
    padding-top: 1rem; 
  }

  .to-back-home { 
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

  .to-back-home:hover { 
    border-color: #6a2c91; 
    color: #6a2c91; 
    background: #f3e8ff; 
    transform: translateX(-2px); 
  }

  .to-mobile-brand { 
    display: flex; 
    justify-content: center; 
  }

  .to-mobile-brand .to-logo-link { 
    margin-bottom: 0; 
  }

  .to-mobile-brand .to-logo-img { 
    width: 80px; 
    height: 80px; 
  }

  @media (min-width: 1024px) { 
    .to-mobile-brand { display: none; } 
  }

  .to-form-header { 
    text-align: center; 
    margin-bottom: 0.5rem; 
  }

  .to-form-title { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: clamp(1.625rem, 4vw, 2rem); 
    color: #1e1b4b; 
    margin-bottom: 0.25rem; 
    letter-spacing: -0.02em; 
  }

  .to-form-subtitle { 
    font-size: 0.875rem; 
    color: #64748b; 
  }

  /* Content */
  .to-content { 
    background: white; 
    border-radius: 1.5rem; 
    border: 1px solid #e2e8f0; 
    padding: clamp(1.5rem, 5vw, 2.5rem); 
    box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1); 
    display: flex; 
    flex-direction: column; 
    gap: 2.5rem; 
  }

  .to-section { 
    scroll-margin-top: 2rem; 
  }

  .to-intro { 
    border-bottom: 1px solid #e2e8f0; 
    padding-bottom: 2rem; 
  }

  .to-lead { 
    font-size: 1rem; 
    line-height: 1.7; 
    color: #4b5563; 
    margin: 0 0 1rem 0; 
  }

  .to-lead:last-child { 
    margin-bottom: 0; 
  }

  .to-section-header { 
    display: flex; 
    align-items: center; 
    gap: 0.875rem; 
    margin-bottom: 1.25rem; 
  }

  .to-section-icon { 
    width: 44px; 
    height: 44px; 
    background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%); 
    border-radius: 12px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: #6a2c91; 
  }

  .to-section h2 { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.375rem; 
    color: #1e1b4b; 
    margin: 0; 
  }

  .to-section h3 { 
    font-size: 1.0625rem; 
    font-weight: 700; 
    color: #374151; 
    margin: 1.5rem 0 0.75rem 0; 
  }

  .to-section p { 
    font-size: 0.9375rem; 
    line-height: 1.7; 
    color: #4b5563; 
    margin: 0 0 1rem 0; 
  }

  .to-list { 
    list-style: none; 
    padding: 0; 
    margin: 0 0 1rem 0; 
    display: flex; 
    flex-direction: column; 
    gap: 0.625rem; 
  }

  .to-list li { 
    position: relative; 
    padding-left: 1.5rem; 
    font-size: 0.9375rem; 
    line-height: 1.6; 
    color: #4b5563; 
  }

  .to-list li::before { 
    content: ''; 
    position: absolute; 
    left: 0; 
    top: 0.6rem; 
    width: 6px; 
    height: 6px; 
    background: #6a2c91; 
    border-radius: 50%; 
  }

  .to-link { 
    color: #6a2c91; 
    font-weight: 600; 
    text-decoration: none; 
  }

  .to-link:hover { 
    text-decoration: underline; 
  }

  .to-highlight-box { 
    background: linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%); 
    border-left: 4px solid #6a2c91; 
    border-radius: 0 0.75rem 0.75rem 0; 
    padding: 1.25rem; 
    font-size: 0.9375rem; 
    line-height: 1.6; 
    color: #4b5563; 
    margin-top: 1rem; 
  }

  .to-highlight--warning { 
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); 
    border-left-color: #f59e0b; 
  }

  .to-note { 
    font-size: 0.875rem; 
    color: #6b7280; 
    font-style: italic; 
    margin-top: 1rem; 
    padding: 1rem; 
    background: #f9fafb; 
    border-radius: 0.5rem; 
    border: 1px solid #e5e7eb; 
  }

  /* Requirement Grid */
  .to-requirement-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
    gap: 1rem; 
    margin: 1.25rem 0; 
  }

  .to-requirement-item { 
    padding: 1.25rem; 
    background: #faf9ff; 
    border: 1px solid #e0d4f5; 
    border-radius: 1rem; 
  }

  .to-requirement-item h4 { 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: #6a2c91; 
    margin: 0 0 0.5rem 0; 
  }

  .to-requirement-item p { 
    font-size: 0.875rem; 
    line-height: 1.5; 
    color: #64748b; 
    margin: 0; 
  }

  /* Prohibited Grid */
  .to-prohibited-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
    gap: 1rem; 
    margin: 1.25rem 0; 
  }

  .to-prohibited-item { 
    padding: 1rem; 
    background: #fef2f2; 
    border: 1px solid #fecaca; 
    border-radius: 0.75rem; 
  }

  .to-prohibited-item h4 { 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: #dc2626; 
    margin: 0 0 0.25rem 0; 
  }

  .to-prohibited-item p { 
    font-size: 0.8125rem; 
    line-height: 1.5; 
    color: #991b1b; 
    margin: 0; 
  }

  /* Contact Section */
  .to-contact { 
    background: linear-gradient(135deg, #faf9ff 0%, #f5f0ff 100%); 
    border-radius: 1.25rem; 
    padding: 2rem; 
    margin-top: 1rem; 
  }

  .to-contact h2 { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.5rem; 
    color: #1e1b4b; 
    margin: 0 0 1rem 0; 
  }

  .to-contact > p { 
    font-size: 0.9375rem; 
    line-height: 1.6; 
    color: #4b5563; 
    margin: 0 0 1.5rem 0; 
  }

  .to-contact-cards { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
    gap: 1rem; 
    margin-bottom: 1.5rem; 
  }

  .to-contact-card { 
    background: white; 
    padding: 1.25rem; 
    border-radius: 1rem; 
    border: 1px solid #e0d4f5; 
  }

  .to-contact-card h4 { 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: #1e1b4b; 
    margin: 0 0 0.5rem 0; 
  }

  .to-contact-card .to-link { 
    display: inline-block; 
    margin-bottom: 0.5rem; 
  }

  .to-contact-card p { 
    font-size: 0.8125rem; 
    color: #6b7280; 
    margin: 0; 
  }

  .to-address { 
    font-size: 0.875rem; 
    line-height: 1.6; 
    color: #4b5563; 
    padding-top: 1.5rem; 
    border-top: 1px solid #e0d4f5; 
  }

  /* Footer */
  .to-footer-text { 
    text-align: center; 
    font-size: 0.875rem; 
    color: #64748b; 
    margin-top: 0.5rem; 
  }

  /* Responsive */
  @media (max-width: 768px) {
    .to-requirement-grid, 
    .to-prohibited-grid { 
      grid-template-columns: 1fr; 
    }
    
    .to-contact-cards { 
      grid-template-columns: 1fr; 
    }
  }

  @media (max-width: 640px) {
    .to-main { 
      padding: 1.5rem 1rem; 
    }
    
    .to-form-shell { 
      gap: 1.25rem; 
    }
    
    .to-content { 
      border-radius: 1.25rem; 
      padding: 1.25rem; 
      gap: 2rem; 
    }
    
    .to-section-icon { 
      width: 36px; 
      height: 36px; 
    }
    
    .to-section h2 { 
      font-size: 1.125rem; 
    }
  }
</style>
