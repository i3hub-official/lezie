<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    ChevronLeft, Home, Shield, Zap, Users, Heart, 
    MapPin, Bell, Eye, Lock, Globe, Target, 
    Award, TrendingUp, CheckCircle, Sparkles,
    ArrowRight, Calendar, Clock, Phone, Mail,
    Linkedin, Twitter, Instagram, Github
  } from 'lucide-svelte';

  let activeSection = $state('mission');

  const scrollToSection = (sectionId: string) => {
    activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
</script>

<svelte:head>
  <title>About Lezie - Community Safety Platform</title>
  <meta name="description" content="Learn about Lezie's mission to create safer communities through real-time alerts, incident reporting, and AI-powered technology." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="about-page">

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
        <span>Our Story</span>
      </div>
      
      <h1 class="hero-title">
        Building safer<br/>
        <em>communities together</em>
      </h1>
      
      <p class="hero-description">
        Lezie was founded with a clear purpose: to empower neighbourhoods to stay safe 
        through collective vigilance, advanced technology, and seamless communication.
      </p>
      
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="stat-number">12,400+</span>
          <span class="stat-label">Active Members</span>
        </div>
        <div class="hero-stat">
          <span class="stat-number">847+</span>
          <span class="stat-label">Communities</span>
        </div>
        <div class="hero-stat">
          <span class="stat-number">99.9%</span>
          <span class="stat-label">Uptime</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Navigation Tabs -->
  <div class="nav-tabs">
    <div class="tabs-container">
      <button 
        class="tab-btn {activeSection === 'mission' ? 'active' : ''}"
        onclick={() => scrollToSection('mission')}
      >
        <Target size={16} />
        <span>Our Mission</span>
      </button>
      <button 
        class="tab-btn {activeSection === 'values' ? 'active' : ''}"
        onclick={() => scrollToSection('values')}
      >
        <Heart size={16} />
        <span>Our Values</span>
      </button>
      <button 
        class="tab-btn {activeSection === 'platform' ? 'active' : ''}"
        onclick={() => scrollToSection('platform')}
      >
        <Zap size={16} />
        <span>The Platform</span>
      </button>
      <button 
        class="tab-btn {activeSection === 'team' ? 'active' : ''}"
        onclick={() => scrollToSection('team')}
      >
        <Users size={16} />
        <span>The Team</span>
      </button>
    </div>
  </div>

  <!-- Mission Section -->
  <section id="mission" class="content-section">
    <div class="section-container">
      <div class="section-header">
        <div class="section-icon mission-icon">
          <Target size={24} />
        </div>
        <div>
          <span class="section-badge">Why we exist</span>
          <h2 class="section-title">Our Mission</h2>
        </div>
      </div>
      
      <div class="mission-grid">
        <div class="mission-card">
          <Shield size={32} class="mission-card-icon" />
          <h3>Prevention First</h3>
          <p>To build safer, more connected communities where everyone plays an active role in prevention and response.</p>
        </div>
        <div class="mission-card">
          <Zap size={32} class="mission-card-icon" />
          <h3>Real-Time Response</h3>
          <p>Enable faster emergency response through instant alerts and verified incident reporting.</p>
        </div>
        <div class="mission-card">
          <Users size={32} class="mission-card-icon" />
          <h3>Community Empowerment</h3>
          <p>Give every resident the tools they need to protect their neighbourhood and loved ones.</p>
        </div>
      </div>
      
      <div class="mission-quote">
        <p>"Our platform combines real-time incident reporting, AI-driven threat detection, and community verification to help residents and local authorities respond faster and more effectively to safety concerns."</p>
        <div class="quote-author">
          <div class="quote-avatar"></div>
          <div>
            <strong>Ogwo Godspower</strong>
            <span>Founder & CEO</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Values Section -->
  <section id="values" class="content-section alt-bg">
    <div class="section-container">
      <div class="section-header">
        <div class="section-icon values-icon">
          <Heart size={24} />
        </div>
        <div>
          <span class="section-badge">What we believe</span>
          <h2 class="section-title">Our Values</h2>
        </div>
      </div>
      
      <div class="values-grid">
        <div class="value-card">
          <div class="value-icon">
            <CheckCircle size={28} />
          </div>
          <h3>Transparency & Trust</h3>
          <p>Verified information through community consensus and official sources ensures reliable safety data.</p>
        </div>
        <div class="value-card">
          <div class="value-icon">
            <Lock size={28} />
          </div>
          <h3>Privacy-First Design</h3>
          <p>Optional anonymous reporting puts you in control of your privacy while keeping communities safe.</p>
        </div>
        <div class="value-card">
          <div class="value-icon">
            <Zap size={28} />
          </div>
          <h3>Innovation</h3>
          <p>AI-powered threat detection enhances human decision-making without replacing community judgment.</p>
        </div>
        <div class="value-card">
          <div class="value-icon">
            <Users size={28} />
          </div>
          <h3>Community Empowerment</h3>
          <p>Every voice matters. We build tools that enable collaboration and collective action.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Platform Section -->
  <section id="platform" class="content-section">
    <div class="section-container">
      <div class="section-header">
        <div class="section-icon platform-icon">
          <Zap size={24} />
        </div>
        <div>
          <span class="section-badge">How it works</span>
          <h2 class="section-title">The Platform</h2>
        </div>
      </div>
      
      <div class="platform-features">
        <div class="feature-row">
          <div class="feature-content">
            <div class="feature-tag">Real-Time</div>
            <h3>Live Incident Map</h3>
            <p>See what's happening in your neighbourhood as it happens. Our interactive map displays verified incidents, active alerts, and community reports in real-time.</p>
            <ul class="feature-list">
              <li><CheckCircle size={14} /> Real-time incident tracking</li>
              <li><CheckCircle size={14} /> Geofenced alerts</li>
              <li><CheckCircle size={14} /> Historical incident data</li>
            </ul>
          </div>
          <div class="feature-visual map-preview">
            <MapPin size={48} />
            <span>Live Map Preview</span>
          </div>
        </div>
        
        <div class="feature-row reverse">
          <div class="feature-content">
            <div class="feature-tag">AI-Powered</div>
            <h3>Smart Threat Detection</h3>
            <p>Our AI analyzes reports, identifies patterns, and predicts potential safety concerns before they escalate.</p>
            <ul class="feature-list">
              <li><CheckCircle size={14} /> Pattern recognition</li>
              <li><CheckCircle size={14} /> Predictive analytics</li>
              <li><CheckCircle size={14} /> Automated risk scoring</li>
            </ul>
          </div>
          <div class="feature-visual ai-preview">
            <TrendingUp size={48} />
            <span>AI Analytics</span>
          </div>
        </div>
        
        <div class="feature-row">
          <div class="feature-content">
            <div class="feature-tag">Community Driven</div>
            <h3>Verified Reporting</h3>
            <p>Community members verify reports through consensus, ensuring only accurate information reaches the platform.</p>
            <ul class="feature-list">
              <li><CheckCircle size={14} /> Peer verification system</li>
              <li><CheckCircle size={14} /> Trust scoring</li>
              <li><CheckCircle size={14} /> Anonymous options</li>
            </ul>
          </div>
          <div class="feature-visual community-preview">
            <Users size={48} />
            <span>Community Hub</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Team Section -->
  <section id="team" class="content-section alt-bg">
    <div class="section-container">
      <div class="section-header">
        <div class="section-icon team-icon">
          <Users size={24} />
        </div>
        <div>
          <span class="section-badge">Behind the platform</span>
          <h2 class="section-title">The Team</h2>
        </div>
      </div>
      
      <div class="team-grid">
        <div class="team-card">
          <div class="team-avatar"></div>
          <h4>Ogwo Godspower</h4>
          <span class="team-role">Founder & CEO</span>
          <p>Former security analyst with a passion for community safety technology.</p>
        </div>
        <div class="team-card">
          <div class="team-avatar"></div>
          <h4>Sarah Johnson</h4>
          <span class="team-role">Head of Product</span>
          <p>10+ years building community-driven platforms.</p>
        </div>
        <div class="team-card">
          <div class="team-avatar"></div>
          <h4>Michael Chen</h4>
          <span class="team-role">Lead Engineer</span>
          <p>AI and machine learning specialist.</p>
        </div>
        <div class="team-card">
          <div class="team-avatar"></div>
          <h4>Emily Rodriguez</h4>
          <span class="team-role">Community Manager</span>
          <p>Building bridges between tech and communities.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section">
    <div class="cta-container">
      <div class="cta-content">
        <h2>Ready to join the movement?</h2>
        <p>Be part of a growing community dedicated to making neighbourhoods safer for everyone.</p>
        <div class="cta-buttons">
          <button class="cta-primary" onclick={() => goto('/signup')}>
            Get Started <ArrowRight size={16} />
          </button>
          <button class="cta-secondary" onclick={() => goto('/contact')}>
            Contact Us
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <img src="/icons/lz_ico.png" alt="Lezie" class="footer-logo" />
        <p>Building safer communities through technology and collective vigilance.</p>
        <div class="social-links">
          <button class="social-btn"><Twitter size={18} /></button>
          <button class="social-btn"><Linkedin size={18} /></button>
          <button class="social-btn"><Instagram size={18} /></button>
          <button class="social-btn"><Github size={18} /></button>
        </div>
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
    --secondary-color: #c4b5fd;
    --success-color: #10B981;
    --warning-color: #F59E0B;
    --danger-color: #EF4444;
    --dark-color: #111827;
    --light-color: #F9FAFB;
    --gray-color: #6B7280;
  }

  .about-page {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%);
    min-height: 100vh;
  }

  /* Hero Section */
  .hero-section {
    position: relative;
    padding: 6rem 2rem 4rem;
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
    font-size: clamp(2.5rem, 5vw, 4rem);
    line-height: 1.1;
    color: #1e1b4b;
    margin-bottom: 1.5rem;
  }

  .hero-title em {
    color: var(--primary-color);
    font-style: italic;
  }

  .hero-description {
    font-size: 1.125rem;
    line-height: 1.6;
    color: #4b5563;
    max-width: 700px;
    margin: 0 auto 2rem;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-top: 2rem;
  }

  .hero-stat {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 1.875rem;
    font-weight: 800;
    color: var(--primary-color);
  }

  .stat-label {
    font-size: 0.75rem;
    color: #6b7280;
  }

  /* Navigation Tabs */
  .nav-tabs {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid #e5e7eb;
    padding: 0.5rem 1rem;
  }

  .tabs-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: none;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }

  .tab-btn:hover {
    background: var(--primary-bg);
    color: var(--primary-color);
  }

  .tab-btn.active {
    background: var(--primary-color);
    color: white;
  }

  /* Content Sections */
  .content-section {
    padding: 4rem 2rem;
  }

  .alt-bg {
    background: rgba(245, 243, 255, 0.5);
  }

  .section-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .section-icon {
    width: 56px;
    height: 56px;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mission-icon { background: linear-gradient(135deg, #6a2c91, #4b1d68); color: white; }
  .values-icon { background: linear-gradient(135deg, #10B981, #059669); color: white; }
  .platform-icon { background: linear-gradient(135deg, #F59E0B, #D97706); color: white; }
  .team-icon { background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; }

  .section-badge {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--primary-color);
  }

  .section-title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 2rem;
    color: #1e1b4b;
    margin-top: 0.25rem;
  }

  /* Mission Grid */
  .mission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .mission-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
  }

  .mission-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }

  .mission-card-icon {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  .mission-card h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1e1b4b;
    margin-bottom: 0.5rem;
  }

  .mission-card p {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.6;
  }

  .mission-quote {
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
  }

  .mission-quote p {
    font-size: 1rem;
    line-height: 1.6;
    color: #4b5563;
    font-style: italic;
    margin-bottom: 1.5rem;
  }

  .quote-author {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .quote-avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 50%;
  }

  .quote-author strong {
    display: block;
    font-size: 0.875rem;
    color: #1e1b4b;
  }

  .quote-author span {
    font-size: 0.75rem;
    color: #6b7280;
  }

  /* Values Grid */
  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .value-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
  }

  .value-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }

  .value-icon {
    width: 64px;
    height: 64px;
    background: var(--primary-bg);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: var(--primary-color);
  }

  .value-card h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #1e1b4b;
    margin-bottom: 0.5rem;
  }

  .value-card p {
    font-size: 0.813rem;
    color: #6b7280;
    line-height: 1.5;
  }

  /* Platform Features */
  .platform-features {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .feature-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: center;
  }

  .feature-row.reverse {
    direction: rtl;
  }

  .feature-row.reverse .feature-content {
    direction: ltr;
  }

  .feature-tag {
    display: inline-block;
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    border-radius: 100px;
    padding: 0.25rem 0.75rem;
    font-size: 0.688rem;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  .feature-content h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e1b4b;
    margin-bottom: 1rem;
  }

  .feature-content p {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .feature-list {
    list-style: none;
    padding: 0;
  }

  .feature-list li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.813rem;
    color: #4b5563;
    margin-bottom: 0.5rem;
  }

  .feature-list li svg {
    color: var(--success-color);
    flex-shrink: 0;
  }

  .feature-visual {
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    color: var(--primary-color);
  }

  .feature-visual span {
    display: block;
    margin-top: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Team Grid */
  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .team-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
  }

  .team-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }

  .team-avatar {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 50%;
    margin: 0 auto 1rem;
  }

  .team-card h4 {
    font-size: 1rem;
    font-weight: 700;
    color: #1e1b4b;
    margin-bottom: 0.25rem;
  }

  .team-role {
    display: block;
    font-size: 0.688rem;
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .team-card p {
    font-size: 0.75rem;
    color: #6b7280;
    line-height: 1.5;
  }

  /* CTA Section */
  .cta-section {
    padding: 4rem 2rem;
  }

  .cta-container {
    max-width: 800px;
    margin: 0 auto;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 2rem;
    padding: 3rem;
    text-align: center;
    color: white;
  }

  .cta-content h2 {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 1.875rem;
    margin-bottom: 1rem;
  }

  .cta-content p {
    font-size: 0.875rem;
    opacity: 0.9;
    margin-bottom: 2rem;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: white;
    color: var(--primary-color);
    border: none;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .cta-secondary {
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: 1px solid white;
    color: white;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cta-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
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

  .social-links {
    display: flex;
    gap: 0.5rem;
  }

  .social-btn {
    width: 36px;
    height: 36px;
    background: var(--light-color);
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
  }

  .social-btn:hover {
    background: var(--primary-bg);
    color: var(--primary-color);
    border-color: var(--primary-border);
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
  @media (max-width: 768px) {
    .hero-stats {
      flex-direction: column;
      gap: 1rem;
    }

    .feature-row,
    .feature-row.reverse {
      grid-template-columns: 1fr;
      direction: ltr;
    }

    .footer-content {
      grid-template-columns: 1fr;
    }

    .footer-links {
      grid-template-columns: repeat(2, 1fr);
    }

    .cta-buttons {
      flex-direction: column;
    }

    .tabs-container {
      gap: 0.25rem;
    }

    .tab-btn {
      padding: 0.5rem 0.875rem;
      font-size: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .footer-links {
      grid-template-columns: 1fr;
    }
  }
</style>