<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    ChevronLeft,
    Home,
    Sparkles,
    Shield,
    AlertTriangle,
    CheckCircle,
    Phone,
    Eye,
    MapPin,
    Users,
    Clock,
    Ban,
    FileText,
    Heart,
    ArrowRight,
    Siren
  } from 'lucide-svelte';

  const sections = [
    { id: 'emergency', title: 'Emergency Protocol', icon: Siren },
    { id: 'reporting', title: 'Reporting Incidents', icon: FileText },
    { id: 'verification', title: 'Verification Tips', icon: CheckCircle },
    { id: 'personal', title: 'Personal Safety', icon: Shield },
    { id: 'community', title: 'Community Guidelines', icon: Users },
    { id: 'prohibited', title: 'Prohibited Content', icon: Ban }
  ];

  let activeSection = $state<string | null>(null);

  function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      activeSection = id;
    }
  }
</script>

<svelte:head>
  <title>Safety Guidelines — Lezie</title>
  <meta name="description" content="Lezie's Safety Guidelines help you use our platform responsibly and stay safe while protecting your community." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="sg-page">

  <!-- LEFT PANEL -->
  <aside class="sg-panel">
    <div class="sg-panel-inner">
      <a href="/" class="sg-logo-link">
        <img src="/icons/lz_logo_t.png" alt="Lezie" class="sg-logo-img" />
      </a>

      <div class="sg-panel-hero">
        <div class="sg-panel-badge">
          <Shield size={14} />
          <span>Safety First</span>
        </div>
        <h2 class="sg-panel-headline">
          Use Lezie<br/>
          <em>responsibly.</em>
        </h2>
        <p class="sg-panel-desc">
          These guidelines help you stay safe while keeping your community informed. Your safety is always more important than any report.
        </p>
      </div>

      <nav class="sg-nav">
        <span class="sg-nav-label">Quick Navigation</span>
        {#each sections as section}
          <button 
            class="sg-nav-link" 
            class:active={activeSection === section.id}
            onclick={() => scrollToSection(section.id)}
          >
            <svelte:component this={section.icon} size={16} />
            <span>{section.title}</span>
          </button>
        {/each}
      </nav>

      <div class="sg-panel-footer">
        <div class="sg-emergency-box">
          <Siren size={20} />
          <div>
            <strong>Emergency?</strong>
            <span>Call your local emergency number immediately</span>
          </div>
        </div>
      </div>
    </div>
    <div class="sg-panel-glow"></div>
  </aside>

  <!-- RIGHT PANEL -->
  <main class="sg-main">
    <div class="sg-form-shell">

      <button class="sg-back-home" onclick={() => goto('/')}>
        <ChevronLeft size={18} />
        <Home size={14} />
        <span>Back to Home</span>
      </button>

      <div class="sg-mobile-brand">
        <a href="/" class="sg-logo-link">
          <img src="/icons/lz_ico.png" alt="Lezie" class="sg-logo-img" />
        </a>
      </div>

      <div class="sg-form-header">
        <h1 class="sg-form-title">Safety Guidelines</h1>
        <p class="sg-form-subtitle">How to use Lezie safely and effectively</p>
      </div>

      <div class="sg-content">

        <!-- Emergency Banner -->
        <div class="sg-emergency-banner">
          <Siren size={24} />
          <div>
            <h3>Remember: Lezie is NOT an emergency service</h3>
            <p>For immediate danger or life-threatening situations, always call your local emergency number first (911, 112, 999, etc.)</p>
          </div>
        </div>

        <!-- Emergency Protocol -->
        <section class="sg-section" id="emergency">
          <div class="sg-section-header">
            <div class="sg-section-icon"><Siren size={20} /></div>
            <h2>Emergency Protocol</h2>
          </div>
          
          <div class="sg-priority-list">
            <div class="sg-priority-item sg-priority--critical">
              <div class="sg-priority-number">1</div>
              <div>
                <h4>Ensure Your Safety First</h4>
                <p>Move to a safe location if possible. Your personal safety is the absolute priority.</p>
              </div>
            </div>
            <div class="sg-priority-item sg-priority--critical">
              <div class="sg-priority-number">2</div>
              <div>
                <h4>Call Emergency Services</h4>
                <p>Dial your local emergency number. Do not rely on Lezie for emergency response.</p>
              </div>
            </div>
            <div class="sg-priority-item sg-priority--important">
              <div class="sg-priority-number">3</div>
              <div>
                <h4>Alert Others If Safe</h4>
                <p>Only after ensuring your safety and contacting authorities, warn others nearby if you can do so safely.</p>
              </div>
            </div>
            <div class="sg-priority-item">
              <div class="sg-priority-number">4</div>
              <div>
                <h4>Report on Lezie</h4>
                <p>Once safe, report the incident on Lezie to inform your community. Include accurate details and updates.</p>
              </div>
            </div>
          </div>

          <div class="sg-emergency-numbers">
            <h4>Emergency Numbers by Region</h4>
            <div class="sg-numbers-grid">
              <div class="sg-number-item"><strong>United States</strong><span>911</span></div>
              <div class="sg-number-item"><strong>United Kingdom</strong><span>999 / 112</span></div>
              <div class="sg-number-item"><strong>European Union</strong><span>112</span></div>
              <div class="sg-number-item"><strong>Nigeria</strong><span>112 / 911</span></div>
              <div class="sg-number-item"><strong>Canada</strong><span>911</span></div>
              <div class="sg-number-item"><strong>Australia</strong><span>000</span></div>
              <div class="sg-number-item"><strong>India</strong><span>112</span></div>
              <div class="sg-number-item"><strong>South Africa</strong><span>10111</span></div>
            </div>
          </div>
        </section>

        <!-- Reporting Incidents -->
        <section class="sg-section" id="reporting">
          <div class="sg-section-header">
            <div class="sg-section-icon"><FileText size={20} /></div>
            <h2>Reporting Incidents</h2>
          </div>
          
          <h3>What to Report</h3>
          <div class="sg-report-grid">
            <div class="sg-report-card sg-report--yes">
              <CheckCircle size={20} />
              <h4>Do Report</h4>
              <ul>
                <li>Suspicious activity or persons</li>
                <li>Crimes in progress or recent</li>
                <li>Accidents or injuries</li>
                <li>Fires or hazardous materials</li>
                <li>Severe weather damage</li>
                <li>Missing persons</li>
                <li>Power outages (widespread)</li>
                <li>Animal threats or attacks</li>
              </ul>
            </div>
            <div class="sg-report-card sg-report--no">
              <Ban size={20} />
              <h4>Don't Report</h4>
              <ul>
                <li>Noise complaints (minor)</li>
                <li>Parking disputes</li>
                <li>Lost pets (use lost & found)</li>
                <li>Non-emergency maintenance</li>
                <li>Personal disputes</li>
                <li>Political opinions</li>
                <li>Advertisements or promotions</li>
                <li>Unverified rumors</li>
              </ul>
            </div>
          </div>

          <h3>How to Write a Good Report</h3>
          <div class="sg-tips-list">
            <div class="sg-tip-item">
              <div class="sg-tip-icon"><Eye size={16} /></div>
              <div>
                <h5>Be Specific</h5>
                <p>Include what happened, when, where, and who was involved. "Suspicious person in red jacket at Oak St and 5th, 2:30 PM" is better than "Someone suspicious."</p>
              </div>
            </div>
            <div class="sg-tip-item">
              <div class="sg-tip-icon"><Clock size={16} /></div>
              <div>
                <h5>Act Quickly</h5>
                <p>Report as soon as it's safe to do so. Timely reports help neighbors stay informed and authorities respond.</p>
              </div>
            </div>
            <div class="sg-tip-item">
              <div class="sg-tip-icon"><MapPin size={16} /></div>
              <div>
                <h5>Location Accuracy</h5>
                <p>Use specific addresses or landmarks. Lezie uses your location, but adding details helps others find the exact spot.</p>
              </div>
            </div>
            <div class="sg-tip-item">
              <div class="sg-tip-icon"><FileText size={16} /></div>
              <div>
                <h5>Updates Matter</h5>
                <p>If the situation changes, update your report. "Police arrived" or "All clear" helps everyone.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Verification -->
        <section class="sg-section" id="verification">
          <div class="sg-section-header">
            <div class="sg-section-icon"><CheckCircle size={20} /></div>
            <h2>Verification Tips</h2>
          </div>
          
          <p>Help keep Lezie trustworthy by verifying others' reports when you have firsthand knowledge:</p>

          <div class="sg-verify-grid">
            <div class="sg-verify-card">
              <h4>Confirm If You Saw It</h4>
              <p>Only verify reports you personally witnessed. Don't confirm based on hearsay or assumptions.</p>
            </div>
            <div class="sg-verify-card">
              <h4>Dispute If False</h4>
              <p>If a report is clearly wrong or outdated, dispute it with a brief explanation. This helps maintain accuracy.</p>
            </div>
            <div class="sg-verify-card">
              <h4>Add Context</h4>
              <p>Comments with additional details (e.g., "Fire department arrived at 3:15") are valuable for everyone.</p>
            </div>
            <div class="sg-verify-card">
              <h4>Stay Objective</h4>
              <p>Report facts, not opinions. "Loud bang heard" is better than "Definitely a gunshot."</p>
            </div>
          </div>

          <div class="sg-highlight-box">
            <strong>Verification Badge:</strong> Reports with multiple verifications from different users show a checkmark. This helps identify reliable information, but never replaces official sources.
          </div>
        </section>

        <!-- Personal Safety -->
        <section class="sg-section" id="personal">
          <div class="sg-section-header">
            <div class="sg-section-icon"><Shield size={20} /></div>
            <h2>Personal Safety</h2>
          </div>
          
          <h3>When Using Lezie in Active Situations</h3>
          
          <div class="sg-safety-rules">
            <div class="sg-safety-item sg-safety--danger">
              <AlertTriangle size={20} />
              <div>
                <h4>Never Approach Danger</h4>
                <p>Use Lezie to stay informed, not to investigate. Keep a safe distance from any active incident.</p>
              </div>
            </div>
            <div class="sg-safety-item sg-safety--warning">
              <Eye size={20} />
              <div>
                <h4>Be Aware of Surroundings</h4>
                <p>Don't become so focused on your phone that you miss real-world dangers. Look up regularly.</p>
              </div>
            </div>
            <div class="sg-safety-item sg-safety--info">
              <MapPin size={20} />
              <div>
                <h4>Share Location Carefully</h4>
                <p>Your precise location is shared only with Lezie for alerts. Be cautious sharing your exact location in comments.</p>
              </div>
            </div>
            <div class="sg-safety-item sg-safety--success">
              <Users size={20} />
              <div>
                <h4>Travel in Groups</h4>
                <p>If an area has recent safety reports, avoid going alone if possible. There's safety in numbers.</p>
              </div>
            </div>
          </div>

          <h3>Digital Safety</h3>
          <ul class="sg-list">
            <li><strong>Strong Password:</strong> Use a unique, strong password for your Lezie account and enable two-factor authentication.</li>
            <li><strong>Privacy Settings:</strong> Review your privacy settings regularly. Limit what personal information appears on your public profile.</li>
            <li><strong>Direct Messages:</strong> Be cautious with private messages from users you don't know. Report harassment immediately.</li>
            <li><strong>Public Wi-Fi:</strong> Avoid accessing Lezie on unsecured public Wi-Fi networks. Use your mobile data instead.</li>
          </ul>
        </section>

        <!-- Community Guidelines -->
        <section class="sg-section" id="community">
          <div class="sg-section-header">
            <div class="sg-section-icon"><Users size={20} /></div>
            <h2>Community Guidelines</h2>
          </div>
          
          <p>Lezie works best when everyone follows these principles:</p>

          <div class="sg-principles-grid">
            <div class="sg-principle-card">
              <div class="sg-principle-number">01</div>
              <h4>Be Respectful</h4>
              <p>Treat neighbors with respect, even when you disagree. No harassment, discrimination, or personal attacks.</p>
            </div>
            <div class="sg-principle-card">
              <div class="sg-principle-number">02</div>
              <h4>Be Accurate</h4>
              <p>Double-check facts before posting. Correct errors quickly. Unverified rumors can cause unnecessary panic.</p>
            </div>
            <div class="sg-principle-card">
              <div class="sg-principle-number">03</div>
              <h4>Be Constructive</h4>
              <p>Focus on solutions and helpful information. "Street light out at 5th and Main" helps; "This neighborhood is terrible" doesn't.</p>
            </div>
            <div class="sg-principle-card">
              <div class="sg-principle-number">04</div>
              <h4>Be Inclusive</h4>
              <p>Welcome newcomers. Don't gatekeep based on how long someone has lived in the area. Safety concerns everyone.</p>
            </div>
          </div>

          <div class="sg-highlight-box sg-highlight--heart">
            <Heart size={20} />
            <div>
              <strong>Community First:</strong> Lezie is about collective safety, not individual vigilante action. Support your neighbors, don't police them.
            </div>
          </div>
        </section>

        <!-- Prohibited Content -->
        <section class="sg-section" id="prohibited">
          <div class="sg-section-header">
            <div class="sg-section-icon"><Ban size={20} /></div>
            <h2>Prohibited Content & Behavior</h2>
          </div>
          
          <p>The following will result in content removal and may lead to account suspension:</p>

          <div class="sg-prohibited-list">
            <div class="sg-prohibited-item">
              <Ban size={16} />
              <span><strong>False Reports:</strong> Knowingly submitting fabricated incidents</span>
            </div>
            <div class="sg-prohibited-item">
              <Ban size={16} />
              <span><strong>Discrimination:</strong> Content targeting race, religion, gender, orientation, etc.</span>
            </div>
            <div class="sg-prohibited-item">
              <Ban size={16} />
              <span><strong>Harassment:</strong> Targeted abuse, threats, or intimidation of any user</span>
            </div>
            <div class="sg-prohibited-item">
              <Ban size={16} />
              <span><strong>Graphic Content:</strong> Excessively violent or disturbing images without warning</span>
            </div>
            <div class="sg-prohibited-item">
              <Ban size={16} />
              <span><strong>Personal Information:</strong> Sharing others' private details (doxing)</span>
            </div>
            <div class="sg-prohibited-item">
              <Ban size={16} />
              <span><strong>Spam:</strong> Repetitive posts, advertisements, or off-topic content</span>
            </div>
            <div class="sg-prohibited-item">
              <Ban size={16} />
              <span><strong>Impersonation:</strong> Pretending to be law enforcement, officials, or other users</span>
            </div>
            <div class="sg-prohibited-item">
              <Ban size={16} />
              <span><strong>Illegal Activity:</strong> Using Lezie to plan or facilitate crimes</span>
            </div>
          </div>

          <div class="sg-highlight-box sg-highlight--warning">
            <AlertTriangle size={20} />
            <div>
              <strong>Report Violations:</strong> If you see content that violates these guidelines, report it immediately using the report button or email <a href="mailto:trust@lezie.com" class="sg-link">trust@lezie.com</a>
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section class="sg-section sg-cta">
          <h3>Ready to keep your community safe?</h3>
          <p>Use Lezie responsibly, prioritize your safety, and remember: we're stronger together.</p>
          <div class="sg-cta-buttons">
            <button class="sg-btn-primary" onclick={() => goto('/signup')}>
              Join Lezie <ArrowRight size={16} />
            </button>
            <button class="sg-btn-secondary" onclick={() => goto('/contact')}>
              Contact Safety Team
            </button>
          </div>
        </section>

      </div>

      <p class="sg-footer-text">
        Questions about safety? <a href="/contact" class="sg-link">Contact our Safety Team</a>
      </p>

    </div>
  </main>
</div>

<style>
  :global(.sg-page *) { 
    font-family: 'DM Sans', system-ui, sans-serif; 
    box-sizing: border-box; 
  }

  .sg-page { 
    display: flex; 
    min-height: 100vh; 
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%); 
  }

  /* LEFT PANEL */
  .sg-panel { 
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
    .sg-panel { display: flex; } 
    .sg-main { margin-left: 440px; } 
  }

  .sg-panel-inner { 
    position: relative; 
    z-index: 2; 
    display: flex; 
    flex-direction: column; 
    padding: 2.5rem; 
    min-height: 100%; 
  }

  .sg-panel-glow { 
    position: absolute; 
    inset: 0; 
    z-index: 1; 
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%); 
    pointer-events: none; 
  }

  .sg-logo-link { 
    display: inline-block; 
    line-height: 0; 
    margin-bottom: 2.5rem; 
    transition: transform 0.2s, opacity 0.2s; 
  }

  .sg-logo-link:hover { 
    opacity: 0.85; 
    transform: scale(1.02); 
  }

  .sg-logo-img { 
    width: 80px; 
    height: 80px; 
    object-fit: contain; 
    display: block; 
  }

  .sg-panel-badge { 
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

  .sg-panel-headline { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 2.5rem; 
    line-height: 1.2; 
    color: white; 
    margin-bottom: 1rem; 
  }

  .sg-panel-headline em { 
    color: #c4b5fd; 
    font-style: italic; 
  }

  .sg-panel-desc { 
    font-size: 0.875rem; 
    line-height: 1.6; 
    color: rgba(196,181,253,0.85); 
    margin-bottom: 2.5rem; 
  }

  /* Navigation */
  .sg-nav { 
    display: flex; 
    flex-direction: column; 
    gap: 0.5rem; 
    margin-bottom: auto; 
  }

  .sg-nav-label { 
    font-size: 0.75rem; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
    color: rgba(196,181,253,0.6); 
    margin-bottom: 0.5rem; 
    padding-left: 0.75rem; 
  }

  .sg-nav-link { 
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

  .sg-nav-link:hover, 
  .sg-nav-link.active { 
    background: rgba(139,92,246,0.2); 
    border-color: rgba(139,92,246,0.3); 
    color: white; 
  }

  .sg-nav-link :global(svg) { 
    color: #c4b5fd; 
    flex-shrink: 0; 
  }

  .sg-panel-footer { 
    margin-top: 2rem; 
    padding-top: 1.5rem; 
    border-top: 1px solid rgba(255,255,255,0.1); 
  }

  .sg-emergency-box { 
    display: flex; 
    align-items: center; 
    gap: 0.875rem; 
    padding: 1rem; 
    background: rgba(220,38,38,0.15); 
    border: 1px solid rgba(220,38,38,0.3); 
    border-radius: 1rem; 
    color: #fca5a5; 
  }

  .sg-emergency-box :global(svg) { 
    color: #ef4444; 
    flex-shrink: 0; 
  }

  .sg-emergency-box strong { 
    display: block; 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: white; 
    margin-bottom: 0.25rem; 
  }

  .sg-emergency-box span { 
    font-size: 0.75rem; 
    color: rgba(252,165,165,0.9); 
  }

  /* RIGHT PANEL */
  .sg-main { 
    flex: 1; 
    display: flex; 
    align-items: flex-start; 
    justify-content: center; 
    padding: 2rem 1.25rem; 
    min-height: 100vh; 
  }

  .sg-form-shell { 
    width: 100%; 
    max-width: 720px; 
    display: flex; 
    flex-direction: column; 
    gap: 1.5rem; 
    padding-top: 1rem; 
  }

  .sg-back-home { 
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

  .sg-back-home:hover { 
    border-color: #6a2c91; 
    color: #6a2c91; 
    background: #f3e8ff; 
    transform: translateX(-2px); 
  }

  .sg-mobile-brand { 
    display: flex; 
    justify-content: center; 
  }

  .sg-mobile-brand .sg-logo-link { 
    margin-bottom: 0; 
  }

  .sg-mobile-brand .sg-logo-img { 
    width: 80px; 
    height: 80px; 
  }

  @media (min-width: 1024px) { 
    .sg-mobile-brand { display: none; } 
  }

  .sg-form-header { 
    text-align: center; 
    margin-bottom: 0.5rem; 
  }

  .sg-form-title { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: clamp(1.625rem, 4vw, 2rem); 
    color: #1e1b4b; 
    margin-bottom: 0.25rem; 
    letter-spacing: -0.02em; 
  }

  .sg-form-subtitle { 
    font-size: 0.875rem; 
    color: #64748b; 
  }

  /* Emergency Banner */
  .sg-emergency-banner { 
    display: flex; 
    align-items: flex-start; 
    gap: 1rem; 
    padding: 1.25rem; 
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
    border: 1.5px solid #fecaca; 
    border-radius: 1rem; 
    margin-bottom: 0.5rem; 
  }

  .sg-emergency-banner :global(svg) { 
    color: #dc2626; 
    flex-shrink: 0; 
  }

  .sg-emergency-banner h3 { 
    font-size: 1rem; 
    font-weight: 700; 
    color: #991b1b; 
    margin: 0 0 0.25rem 0; 
  }

  .sg-emergency-banner p { 
    font-size: 0.875rem; 
    color: #7f1d1d; 
    margin: 0; 
    line-height: 1.5; 
  }

  /* Content */
  .sg-content { 
    background: white; 
    border-radius: 1.5rem; 
    border: 1px solid #e2e8f0; 
    padding: clamp(1.5rem, 5vw, 2.5rem); 
    box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1); 
    display: flex; 
    flex-direction: column; 
    gap: 2.5rem; 
  }

  .sg-section { 
    scroll-margin-top: 2rem; 
  }

  .sg-section-header { 
    display: flex; 
    align-items: center; 
    gap: 0.875rem; 
    margin-bottom: 1.25rem; 
  }

  .sg-section-icon { 
    width: 44px; 
    height: 44px; 
    background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%); 
    border-radius: 12px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: #6a2c91; 
  }

  .sg-section h2 { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.375rem; 
    color: #1e1b4b; 
    margin: 0; 
  }

  .sg-section h3 { 
    font-size: 1.0625rem; 
    font-weight: 700; 
    color: #374151; 
    margin: 1.5rem 0 0.75rem 0; 
  }

  .sg-section p { 
    font-size: 0.9375rem; 
    line-height: 1.7; 
    color: #4b5563; 
    margin: 0 0 1rem 0; 
  }

  /* Priority List */
  .sg-priority-list { 
    display: flex; 
    flex-direction: column; 
    gap: 0.75rem; 
    margin-bottom: 1.5rem; 
  }

  .sg-priority-item { 
    display: flex; 
    align-items: flex-start; 
    gap: 1rem; 
    padding: 1rem; 
    background: #f8fafc; 
    border: 1px solid #e2e8f0; 
    border-radius: 1rem; 
  }

  .sg-priority--critical { 
    background: #fef2f2; 
    border-color: #fecaca; 
  }

  .sg-priority--important { 
    background: #fffbeb; 
    border-color: #fde68a; 
  }

  .sg-priority-number { 
    width: 32px; 
    height: 32px; 
    background: #6a2c91; 
    color: white; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 0.875rem; 
    font-weight: 700; 
    flex-shrink: 0; 
  }

  .sg-priority--critical .sg-priority-number { 
    background: #dc2626; 
  }

  .sg-priority--important .sg-priority-number { 
    background: #f59e0b; 
  }

  .sg-priority-item h4 { 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: #1e1b4b; 
    margin: 0 0 0.25rem 0; 
  }

  .sg-priority-item p { 
    font-size: 0.875rem; 
    color: #64748b; 
    margin: 0; 
    line-height: 1.5; 
  }

  /* Emergency Numbers */
  .sg-emergency-numbers { 
    background: #f8fafc; 
    border-radius: 1rem; 
    padding: 1.25rem; 
  }

  .sg-emergency-numbers h4 { 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: #374151; 
    margin: 0 0 1rem 0; 
  }

  .sg-numbers-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); 
    gap: 0.75rem; 
  }

  .sg-number-item { 
    display: flex; 
    flex-direction: column; 
    gap: 0.25rem; 
    padding: 0.75rem; 
    background: white; 
    border: 1px solid #e2e8f0; 
    border-radius: 0.5rem; 
  }

  .sg-number-item strong { 
    font-size: 0.8125rem; 
    color: #374151; 
  }

  .sg-number-item span { 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: #dc2626; 
  }

  /* Report Grid */
  .sg-report-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 1rem; 
    margin: 1.25rem 0; 
  }

  @media (max-width: 640px) {
    .sg-report-grid { 
      grid-template-columns: 1fr; 
    }
  }

  .sg-report-card { 
    padding: 1.25rem; 
    border-radius: 1rem; 
  }

  .sg-report--yes { 
    background: #f0fdf4; 
    border: 1.5px solid #86efac; 
  }

  .sg-report--no { 
    background: #fef2f2; 
    border: 1.5px solid #fca5a5; 
  }

  .sg-report-card :global(svg) { 
    margin-bottom: 0.75rem; 
  }

  .sg-report--yes :global(svg) { 
    color: #16a34a; 
  }

  .sg-report--no :global(svg) { 
    color: #dc2626; 
  }

  .sg-report-card h4 { 
    font-size: 1rem; 
    font-weight: 700; 
    margin: 0 0 0.75rem 0; 
  }

  .sg-report--yes h4 { 
    color: #166534; 
  }

  .sg-report--no h4 { 
    color: #991b1b; 
  }

  .sg-report-card ul { 
    list-style: none; 
    padding: 0; 
    margin: 0; 
    display: flex; 
    flex-direction: column; 
    gap: 0.5rem; 
  }

  .sg-report-card li { 
    font-size: 0.875rem; 
    line-height: 1.5; 
    padding-left: 1rem; 
    position: relative; 
  }

  .sg-report--yes li { 
    color: #374151; 
  }

  .sg-report--yes li::before { 
    content: '✓'; 
    position: absolute; 
    left: 0; 
    color: #16a34a; 
    font-weight: 700; 
  }

  .sg-report--no li { 
    color: #374151; 
  }

  .sg-report--no li::before { 
    content: '✕'; 
    position: absolute; 
    left: 0; 
    color: #dc2626; 
    font-weight: 700; 
  }

  /* Tips List */
  .sg-tips-list { 
    display: flex; 
    flex-direction: column; 
    gap: 0.75rem; 
    margin: 1.25rem 0; 
  }

  .sg-tip-item { 
    display: flex; 
    align-items: flex-start; 
    gap: 0.875rem; 
    padding: 1rem; 
    background: #faf9ff; 
    border: 1px solid #e0d4f5; 
    border-radius: 1rem; 
  }

  .sg-tip-icon { 
    width: 32px; 
    height: 32px; 
    background: #f3e8ff; 
    border-radius: 8px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: #6a2c91; 
    flex-shrink: 0; 
  }

  .sg-tip-item h5 { 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: #1e1b4b; 
    margin: 0 0 0.25rem 0; 
  }

  .sg-tip-item p { 
    font-size: 0.875rem; 
    color: #64748b; 
    margin: 0; 
    line-height: 1.5; 
  }

  /* Verify Grid */
  .sg-verify-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
    gap: 1rem; 
    margin: 1.25rem 0; 
  }

  .sg-verify-card { 
    padding: 1.25rem; 
    background: #faf9ff; 
    border: 1px solid #e0d4f5; 
    border-radius: 1rem; 
  }

  .sg-verify-card h4 { 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: #6a2c91; 
    margin: 0 0 0.5rem 0; 
  }

  .sg-verify-card p { 
    font-size: 0.875rem; 
    line-height: 1.5; 
    color: #64748b; 
    margin: 0; 
  }

  /* Highlight Box */
  .sg-highlight-box { 
    background: linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%); 
    border-left: 4px solid #6a2c91; 
    border-radius: 0 0.75rem 0.75rem 0; 
    padding: 1.25rem; 
    font-size: 0.9375rem; 
    line-height: 1.6; 
    color: #4b5563; 
    margin-top: 1rem; 
    display: flex; 
    align-items: flex-start; 
    gap: 0.75rem; 
  }

  .sg-highlight-box :global(svg) { 
    color: #6a2c91; 
    flex-shrink: 0; 
  }

  .sg-highlight--warning { 
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); 
    border-left-color: #f59e0b; 
  }

  .sg-highlight--warning :global(svg) { 
    color: #f59e0b; 
  }

  .sg-highlight--heart { 
    background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); 
    border-left-color: #ec4899; 
  }

  .sg-highlight--heart :global(svg) { 
    color: #ec4899; 
  }

  /* Safety Rules */
  .sg-safety-rules { 
    display: flex; 
    flex-direction: column; 
    gap: 0.75rem; 
    margin: 1.25rem 0; 
  }

  .sg-safety-item { 
    display: flex; 
    align-items: flex-start; 
    gap: 0.875rem; 
    padding: 1rem; 
    border-radius: 1rem; 
    border: 1px solid; 
  }

  .sg-safety--danger { 
    background: #fef2f2; 
    border-color: #fecaca; 
  }

  .sg-safety--warning { 
    background: #fffbeb; 
    border-color: #fde68a; 
  }

  .sg-safety--info { 
    background: #eff6ff; 
    border-color: #bfdbfe; 
  }

  .sg-safety--success { 
    background: #f0fdf4; 
    border-color: #bbf7d0; 
  }

  .sg-safety-item :global(svg) { 
    flex-shrink: 0; 
  }

  .sg-safety--danger :global(svg) { 
    color: #dc2626; 
  }

  .sg-safety--warning :global(svg) { 
    color: #f59e0b; 
  }

  .sg-safety--info :global(svg) { 
    color: #3b82f6; 
  }

  .sg-safety--success :global(svg) { 
    color: #16a34a; 
  }

  .sg-safety-item h4 { 
    font-size: 0.9375rem; 
    font-weight: 700; 
    color: #1e1b4b; 
    margin: 0 0 0.25rem 0; 
  }

  .sg-safety-item p { 
    font-size: 0.875rem; 
    color: #64748b; 
    margin: 0; 
    line-height: 1.5; 
  }

  /* List */
  .sg-list { 
    list-style: none; 
    padding: 0; 
    margin: 0 0 1rem 0; 
    display: flex; 
    flex-direction: column; 
    gap: 0.625rem; 
  }

  .sg-list li { 
    position: relative; 
    padding-left: 1.5rem; 
    font-size: 0.9375rem; 
    line-height: 1.6; 
    color: #4b5563; 
  }

  .sg-list li::before { 
    content: ''; 
    position: absolute; 
    left: 0; 
    top: 0.6rem; 
    width: 6px; 
    height: 6px; 
    background: #6a2c91; 
    border-radius: 50%; 
  }

  /* Principles Grid */
  .sg-principles-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
    gap: 1rem; 
    margin: 1.25rem 0; 
  }

  .sg-principle-card { 
    padding: 1.5rem; 
    background: #faf9ff; 
    border: 1px solid #e0d4f5; 
    border-radius: 1rem; 
    text-align: center; 
  }

  .sg-principle-number { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 2rem; 
    color: #6a2c91; 
    opacity: 0.3; 
    margin-bottom: 0.5rem; 
  }

  .sg-principle-card h4 { 
    font-size: 1rem; 
    font-weight: 700; 
    color: #1e1b4b; 
    margin: 0 0 0.5rem 0; 
  }

  .sg-principle-card p { 
    font-size: 0.875rem; 
    line-height: 1.5; 
    color: #64748b; 
    margin: 0; 
  }

  /* Prohibited List */
  .sg-prohibited-list { 
    display: flex; 
    flex-direction: column; 
    gap: 0.5rem; 
    margin: 1.25rem 0; 
  }

  .sg-prohibited-item { 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    padding: 0.875rem 1rem; 
    background: #fef2f2; 
    border: 1px solid #fecaca; 
    border-radius: 0.75rem; 
  }

  .sg-prohibited-item :global(svg) { 
    color: #dc2626; 
    flex-shrink: 0; 
  }

  .sg-prohibited-item span { 
    font-size: 0.875rem; 
    color: #374151; 
  }

  /* CTA */
  .sg-cta { 
    background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%); 
    border-radius: 1.25rem; 
    padding: 2rem; 
    text-align: center; 
    margin-top: 1rem; 
  }

  .sg-cta h3 { 
    font-family: 'DM Serif Display', Georgia, serif; 
    font-size: 1.5rem; 
    color: #1e1b4b; 
    margin: 0 0 0.5rem 0; 
  }

  .sg-cta > p { 
    font-size: 0.9375rem; 
    color: #64748b; 
    margin: 0 0 1.5rem 0; 
  }

  .sg-cta-buttons { 
    display: flex; 
    gap: 0.75rem; 
    justify-content: center; 
    flex-wrap: wrap; 
  }

  .sg-btn-primary { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.8125rem 1.5rem; 
    background: linear-gradient(135deg, #6a2c91 0%, #4a1d6e 100%); 
    color: white; 
    border: none; 
    border-radius: 0.75rem; 
    font-size: 0.9375rem; 
    font-weight: 600; 
    cursor: pointer; 
    box-shadow: 0 4px 14px rgba(106,44,145,0.3); 
    transition: all 0.2s; 
  }

  .sg-btn-primary:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 6px 20px rgba(106,44,145,0.4); 
  }

  .sg-btn-secondary { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.8125rem 1.5rem; 
    background: white; 
    color: #374151; 
    border: 1.5px solid #e5e7eb; 
    border-radius: 0.75rem; 
    font-size: 0.9375rem; 
    font-weight: 600; 
    cursor: pointer; 
    transition: all 0.2s; 
  }

  .sg-btn-secondary:hover { 
    border-color: #6a2c91; 
    color: #6a2c91; 
  }

  .sg-link { 
    color: #6a2c91; 
    font-weight: 600; 
    text-decoration: none; 
  }

  .sg-link:hover { 
    text-decoration: underline; 
  }

  /* Footer */
  .sg-footer-text { 
    text-align: center; 
    font-size: 0.875rem; 
    color: #64748b; 
    margin-top: 0.5rem; 
  }

  /* Responsive */
  @media (max-width: 768px) {
    .sg-verify-grid, 
    .sg-principles-grid { 
      grid-template-columns: 1fr; 
    }
    
    .sg-numbers-grid { 
      grid-template-columns: repeat(2, 1fr); 
    }
  }

  @media (max-width: 640px) {
    .sg-main { 
      padding: 1.5rem 1rem; 
    }
    
    .sg-form-shell { 
      gap: 1.25rem; 
    }
    
    .sg-content { 
      border-radius: 1.25rem; 
      padding: 1.25rem; 
      gap: 2rem; 
    }
    
    .sg-section-icon { 
      width: 36px; 
      height: 36px; 
    }
    
    .sg-section h2 { 
      font-size: 1.125rem; 
    }
    
    .sg-cta { 
      padding: 1.5rem; 
    }
    
    .sg-cta-buttons { 
      flex-direction: column; 
    }
    
    .sg-btn-primary, 
    .sg-btn-secondary { 
      width: 100%; 
      justify-content: center; 
    }
  }
</style>
