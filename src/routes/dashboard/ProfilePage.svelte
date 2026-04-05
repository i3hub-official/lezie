<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Mail, MapPin, Calendar, Award, Shield, 
    Settings, LogOut, Camera, CheckCircle,
    AlertTriangle, Bell, Star, TrendingUp,
    Edit2, X, Save, ChevronLeft, Globe,
    Phone, Briefcase, Heart, Share2, Users,Activity
  } from 'lucide-svelte';

  let isLoading = false;
  let isEditing = false;
  let showDeleteConfirm = false;
  let activeTab = 'overview';
  
  let user = {
    name: "Ogwo Godspower",
    email: "ogwogp@example.com",
    phone: "+234 803 123 4567",
    avatar: "https://ui-avatars.com/api/?name=Ogwo+Godspower&background=6a2c91&color=fff&size=200",
    coverPhoto: "https://images.unsplash.com/photo-1497366811353-2a2cf8b86f2b?w=1200",
    joinDate: "March 2025",
    location: "Port Harcourt, Rivers State",
    safetyScore: 92,
    reportsSubmitted: 47,
    verifiedReports: 41,
    helpfulVotes: 156,
    alertsCreated: 8,
    description: "Community safety advocate and active resident of Port Harcourt. Passionate about building a safer neighbourhood through timely reporting and community engagement.",
    badges: ["First Responder", "Top Reporter", "Community Guardian", "Safety Hero"],
    socialLinks: {
      twitter: "@ogwogp",
      linkedin: "ogwo-godspower"
    }
  };
  
  let recentActivity = [
    {
      id: 1,
      type: 'report',
      title: 'Reported suspicious activity',
      location: 'Maple Street',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      status: 'verified'
    },
    {
      id: 2,
      type: 'verification',
      title: 'Verified incident report',
      location: 'Downtown',
      timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
      status: 'completed'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Created new alert zone',
      location: 'Home Area',
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      status: 'active'
    }
  ];
  
  let editForm = {
    name: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    twitter: '',
    linkedin: ''
  };
  
  onMount(async () => {
    await loadProfile();
    isLoading = false;
  });
  
  async function loadProfile() {
    await new Promise(resolve => setTimeout(resolve, 600));
  }
  
  function startEditing() {
    editForm = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      description: user.description,
      twitter: user.socialLinks.twitter || '',
      linkedin: user.socialLinks.linkedin || ''
    };
    isEditing = true;
  }
  
  function saveProfile() {
    user.name = editForm.name;
    user.email = editForm.email;
    user.phone = editForm.phone;
    user.location = editForm.location;
    user.description = editForm.description;
    user.socialLinks = {
      twitter: editForm.twitter,
      linkedin: editForm.linkedin
    };
    isEditing = false;
  }
  
  function cancelEditing() {
    isEditing = false;
  }
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }
  
  function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  function getActivityIcon(type: string) {
    switch(type) {
      case 'report': return AlertTriangle;
      case 'verification': return CheckCircle;
      case 'alert': return Bell;
      default: return Activity;
    }
  }
  
  function getActivityColor(type: string) {
    switch(type) {
      case 'report': return '#EF4444';
      case 'verification': return '#10B981';
      case 'alert': return '#F59E0B';
      default: return '#6B7280';
    }
  }
  
  function handleLogout() {
    goto('/');
  }
</script>

<div class="profile-page">
  <div class="profile-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
    
      </div>
      <div class="header-center">
        <div class="logo-badge">
          <Users size={24} />
        </div>
        <div>
          <h1>My Profile</h1>
          <p>Manage your account and preferences</p>
        </div>
      </div>
      <div class="header-right">
        {#if !isEditing}
          <button class="edit-btn" on:click={startEditing} type="button">
            <Edit2 size={18} />
            <span>Edit Profile</span>
          </button>
        {:else}
          <button class="save-btn" on:click={saveProfile} type="button">
            <Save size={18} />
            <span>Save Changes</span>
          </button>
          <button class="cancel-btn" on:click={cancelEditing} type="button">
            <X size={18} />
            <span>Cancel</span>
          </button>
        {/if}
      </div>
    </div>

    {#if isLoading}
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    {:else}
      <!-- Cover Photo & Avatar -->
      <div class="cover-section">
        <div class="cover-photo" style="background-image: url({user.coverPhoto})">
          <button class="change-cover-btn" type="button">
            <Camera size={16} />
            Change Cover
          </button>
        </div>
        <div class="avatar-section">
          <img src={user.avatar} alt={user.name} class="avatar" />
          <button class="change-avatar-btn" type="button" aria-label="Change avatar">
            <Camera size={14} />
          </button>
        </div>
      </div>

      <!-- Profile Card -->
      <div class="profile-card">
        <!-- User Info -->
        <div class="user-info">
          {#if isEditing}
            <input 
              type="text" 
              bind:value={editForm.name}
              class="name-input"
              placeholder="Full Name"
            />
          {:else}
            <h1 class="user-name">{user.name}</h1>
          {/if}

          <div class="user-details">
            <div class="detail-item">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
            <div class="detail-item">
              <Phone size={16} />
              <span>{user.phone}</span>
            </div>
            <div class="detail-item">
              <MapPin size={16} />
              <span>{user.location}</span>
            </div>
            <div class="detail-item">
              <Calendar size={16} />
              <span>Member since {user.joinDate}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="description-section">
          {#if isEditing}
            <textarea 
              bind:value={editForm.description}
              class="description-input"
              rows="4"
              placeholder="Tell us about yourself..."
            ></textarea>
          {:else}
            <p class="user-description">{user.description}</p>
          {/if}
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon reports-icon">
              <AlertTriangle size={22} />
            </div>
            <div class="stat-content">
              <span class="stat-value">{user.reportsSubmitted}</span>
              <span class="stat-label">Reports Submitted</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon verified-icon">
              <CheckCircle size={22} />
            </div>
            <div class="stat-content">
              <span class="stat-value">{user.verifiedReports}</span>
              <span class="stat-label">Verified Reports</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon votes-icon">
              <Star size={22} />
            </div>
            <div class="stat-content">
              <span class="stat-value">{user.helpfulVotes}</span>
              <span class="stat-label">Helpful Votes</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon alerts-icon">
              <Bell size={22} />
            </div>
            <div class="stat-content">
              <span class="stat-value">{user.alertsCreated}</span>
              <span class="stat-label">Alerts Created</span>
            </div>
          </div>
        </div>

        <!-- Safety Score -->
        <div class="safety-score-section">
          <div class="score-header">
            <Shield size={20} style="color: var(--primary-color)" />
            <h3>Safety Score</h3>
          </div>
          <div class="score-container">
            <div class="score-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" stroke-width="8"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary-color)" stroke-width="8"
                  stroke-dasharray="282.74"
                  stroke-dashoffset={282.74 - (282.74 * user.safetyScore / 100)}
                  transform="rotate(-90 50 50)" stroke-linecap="round"/>
              </svg>
              <span class="score-value">{user.safetyScore}%</span>
            </div>
            <div class="score-text">
              <p>Your safety score is <strong>{user.safetyScore}%</strong></p>
              <p class="score-rank">Rank: Gold Guardian</p>
            </div>
          </div>
        </div>

        <!-- Achievements -->
        <div class="badges-section">
          <div class="section-header">
            <Award size={20} style="color: var(--primary-color)" />
            <h3>Achievements</h3>
          </div>
          <div class="badges-grid">
            {#each user.badges as badge}
              <div class="badge">
                <Shield size={16} />
                <span>{badge}</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- Social Links -->
        {#if !isEditing && (user.socialLinks.twitter || user.socialLinks.linkedin)}
          <div class="social-section">
            <div class="section-header">
              <Globe size={20} style="color: var(--primary-color)" />
              <h3>Connect</h3>
            </div>
            <div class="social-links">
              {#if user.socialLinks.twitter}
                <a href="https://twitter.com/{user.socialLinks.twitter.slice(1)}" target="_blank" rel="noopener noreferrer" class="social-link twitter">
                  <svg class="social-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21c-.36.1-.74.15-1.13.15c-.27 0-.54-.03-.8-.08c.54 1.69 2.11 2.92 4.01 2.95c-1.49 1.17-3.35 1.86-5.36 1.86c-.35 0-.69-.02-1.03-.06c1.92 1.23 4.19 1.95 6.63 1.95c7.96 0 12.31-6.59 12.31-12.31c0-.19-.01-.38-.02-.57c.85-.6 1.58-1.35 2.16-2.21z"/>
                  </svg>
                  <span>{user.socialLinks.twitter}</span>
                </a>
              {/if}
              {#if user.socialLinks.linkedin}
                <a href="https://linkedin.com/in/{user.socialLinks.linkedin}" target="_blank" rel="noopener noreferrer" class="social-link linkedin">
                  <svg class="social-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065c0-1.138.92-2.063 2.063-2.063c1.14 0 2.064.925 2.064 2.063c0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
                  </svg>
                  <span>{user.socialLinks.linkedin}</span>
                </a>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Action Buttons -->
        <div class="profile-actions">
          {#if isEditing}
            <button class="btn btn-primary" on:click={saveProfile}>
              <Save size={18} />
              Save Changes
            </button>
            <button class="btn btn-secondary" on:click={cancelEditing}>
              <X size={18} />
              Cancel
            </button>
          {:else}
            <button class="btn btn-primary" on:click={startEditing}>
              <Settings size={18} />
              Edit Profile
            </button>
            <button class="btn btn-outline" on:click={handleLogout}>
              <LogOut size={18} />
              Sign Out
            </button>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .profile-page {
    min-height: 100vh;
    background: transparent;
    padding: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .profile-container {
    max-width: 100%;
    margin: 0 auto;
  }

  /* Header */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 1.5rem;
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    border: 1px solid #e2e8f0;
  }

  .header-left, .header-right {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .header-left { justify-content: flex-start; }
  .header-right { justify-content: flex-end; }

  .header-center {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #64748b;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
    transition: all 0.2s;
  }

  .back-btn:hover {
    background: #f1f5f9;
    color: var(--primary-color);
  }

  .logo-badge {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .header-center h1 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.125rem;
  }

  .header-center p {
    font-size: 0.75rem;
    color: #64748b;
  }

  .edit-btn, .save-btn, .cancel-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .edit-btn {
    background: var(--primary-color);
    color: white;
  }

  .edit-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  .save-btn {
    background: #10B981;
    color: white;
  }

  .save-btn:hover {
    background: #059669;
  }

  .cancel-btn {
    background: #f1f5f9;
    color: #64748b;
  }

  .cancel-btn:hover {
    background: #e2e8f0;
  }

  /* Loading */
  .loading-container {
    text-align: center;
    padding: 4rem;
    background: white;
    border-radius: 1.5rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Cover Section */
  .cover-section {
    position: relative;
    margin-bottom: 4rem;
  }

  .cover-photo {
    height: 200px;
    background-size: cover;
    background-position: center;
    border-radius: 1rem;
    position: relative;
  }

  .change-cover-btn {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    border: none;
    border-radius: 0.75rem;
    color: white;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .change-cover-btn:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .avatar-section {
    position: absolute;
    bottom: -3rem;
    left: 2rem;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid white;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .change-avatar-btn {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--primary-color);
    border: 2px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.2s;
  }

  .change-avatar-btn:hover {
    background: var(--primary-dark);
    transform: scale(1.05);
  }

  /* Profile Card */
  .profile-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e2e8f0;
  }

  /* User Info */
  .user-info {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .user-name {
    font-size: 1.75rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 1rem;
  }

  .name-input {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    padding: 0.5rem;
    border: 2px solid var(--primary-border);
    border-radius: 0.75rem;
    width: 100%;
    margin-bottom: 1rem;
  }

  .user-details {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #475569;
  }

  /* Description */
  .description-section {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--primary-bg);
    border-radius: 0.75rem;
  }

  .user-description {
    font-size: 0.875rem;
    line-height: 1.6;
    color: #475569;
    text-align: center;
    margin: 0;
  }

  .description-input {
    width: 100%;
    padding: 0.75rem;
    border: 1.5px solid var(--primary-border);
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-family: inherit;
    resize: vertical;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    background: white;
    border-radius: 0.75rem;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .reports-icon { background: #FEE2E2; color: #DC2626; }
  .verified-icon { background: #D1FAE5; color: #10B981; }
  .votes-icon { background: #FEF3C7; color: #F59E0B; }
  .alerts-icon { background: #DBEAFE; color: #3B82F6; }

  .stat-content { flex: 1; }
  .stat-value { display: block; font-size: 1.125rem; font-weight: 700; color: #0f172a; }
  .stat-label { font-size: 0.625rem; color: #64748b; }

  /* Safety Score */
  .safety-score-section {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.75rem;
  }

  .score-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .score-header h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }

  .score-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .score-circle {
    position: relative;
    width: 100px;
    height: 100px;
  }

  .score-circle svg {
    width: 100%;
    height: 100%;
  }

  .score-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-color);
  }

  .score-text p {
    font-size: 0.875rem;
    color: #475569;
  }

  .score-rank {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  /* Badges */
  .badges-section {
    margin-bottom: 1.5rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .section-header h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }

  .badges-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .badge {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background: var(--primary-bg);
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--primary-color);
  }

  /* Social Links */
  .social-section {
    margin-bottom: 1.5rem;
  }

  .social-links {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    color: #475569;
    text-decoration: none;
    transition: all 0.2s;
  }

  .social-link:hover {
    background: #f1f5f9;
    transform: translateY(-1px);
  }

  .social-icon {
    width: 16px;
    height: 16px;
  }

  /* Buttons */
  .profile-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .btn-primary {
    background: var(--primary-color);
    color: white;
  }

  .btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: #f1f5f9;
    color: #64748b;
  }

  .btn-secondary:hover {
    background: #e2e8f0;
  }

  .btn-outline {
    background: none;
    border: 1.5px solid #e2e8f0;
    color: #64748b;
  }

  .btn-outline:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .header-left, .header-right {
      width: 100%;
      justify-content: center;
    }

    .header-center {
      flex-direction: column;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .cover-photo {
      height: 150px;
    }

    .avatar {
      width: 80px;
      height: 80px;
    }

    .avatar-section {
      left: 50%;
      transform: translateX(-50%);
    }

    .change-cover-btn {
      bottom: 0.5rem;
      right: 0.5rem;
      padding: 0.375rem 0.75rem;
      font-size: 0.688rem;
    }

    .user-name {
      font-size: 1.5rem;
    }

    .user-details {
      flex-direction: column;
      align-items: center;
    }
  }

  @media (max-width: 480px) {
    .profile-card {
      padding: 1rem;
    }

    .stat-card {
      padding: 0.5rem;
    }

    .badge {
      font-size: 0.688rem;
      padding: 0.25rem 0.625rem;
    }
  }
</style>