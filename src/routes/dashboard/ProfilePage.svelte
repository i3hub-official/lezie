<script lang="ts">
  import {
    Mail, MapPin, Calendar, Award, Shield,
    Settings, LogOut, Camera, CheckCircle,
    AlertTriangle, Bell, Star, TrendingUp,
    Edit2, X, Save, Globe,
    Phone, Heart, Users, Activity
  } from 'lucide-svelte';
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';

  // ── Props from dashboard +page.server.ts ──
  let { data } = $props<{
    data: {
      user:    any;
      account: any;
      profile: any;
    }
  }>();

  // ── Derived display values ──
  const fullName    = $derived(
    [data.profile?.firstName, data.profile?.lastName].filter(Boolean).join(' ')
    || data.user?.name
    || 'User'
  );
  const email       = $derived(data.user?.email ?? '');
  const joinDate    = $derived(
    data.user?.createdAt
      ? new Date(data.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : '—'
  );
  const safetyScore = $derived(data.account?.trustScore ?? 0);
  const social      = $derived((data.profile?.location as any)?.social ?? {});

  // ── Local UI state ──
  let isEditing       = $state(false);
  let isSaving        = $state(false);
  let saveError       = $state('');
  let saveSuccess     = $state(false);
  let activeTab       = $state('overview');

  let editForm = $state({
    firstName:      '',
    lastName:       '',
    phone:          '',
    city:           '',
    country:        '',
    bio:            '',
    twitterHandle:  '',
    linkedinHandle: '',
  });

  function startEditing() {
    const nameParts = (data.user?.name ?? '').split(' ');
    editForm = {
      firstName:      data.profile?.firstName ?? nameParts[0] ?? '',
      lastName:       data.profile?.lastName  ?? nameParts.slice(1).join(' ') ?? '',
      phone:          data.profile?.phone     ?? '',
      city:           data.profile?.city      ?? '',
      country:        data.profile?.country   ?? '',
      bio:            data.profile?.bio       ?? '',
      twitterHandle:  social.twitter          ?? '',
      linkedinHandle: social.linkedin         ?? '',
    };
    saveError   = '';
    saveSuccess = false;
    isEditing   = true;
  }

  function cancelEditing() {
    isEditing = false;
    saveError = '';
  }

  async function saveProfile() {
    isSaving  = true;
    saveError = '';

    try {
      const res = await fetch('/api/profile', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(editForm),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        saveError = body.message ?? 'Failed to save profile';
        return;
      }

      saveSuccess = true;
      isEditing   = false;

      // Full reload so dashboard re-runs load() and gets fresh decrypted data
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      saveError = 'Connection error. Please try again.';
    } finally {
      isSaving = false;
    }
  }

  async function handleLogout() {
    await authClient.signOut();
    window.location.href = '/signin';
  }

  function formatDate(dateString: string) {
    const diff  = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(hours / 24);
    if (hours < 1)  return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7)   return `${days}d ago`;
    return new Date(dateString).toLocaleDateString();
  }
</script>

<div class="profile-page">
  <div class="profile-container">

    <!-- Header -->
    <div class="page-header">
      <div class="header-center">
        <div class="logo-badge"><Users size={24} /></div>
        <div>
          <h1>My Profile</h1>
          <p>Manage your account and preferences</p>
        </div>
      </div>
      <div class="header-right">
        {#if !isEditing}
          <button class="edit-btn" onclick={startEditing} type="button">
            <Edit2 size={18} /><span>Edit Profile</span>
          </button>
        {:else}
          <button class="save-btn" onclick={saveProfile} disabled={isSaving} type="button">
            <Save size={18} /><span>{isSaving ? 'Saving…' : 'Save Changes'}</span>
          </button>
          <button class="cancel-btn" onclick={cancelEditing} type="button">
            <X size={18} /><span>Cancel</span>
          </button>
        {/if}
      </div>
    </div>

    {#if saveSuccess}
      <div class="alert alert-success">
        <CheckCircle size={16} /> Profile updated successfully
      </div>
    {/if}
    {#if saveError}
      <div class="alert alert-error">
        <AlertTriangle size={16} /> {saveError}
      </div>
    {/if}

    <!-- Avatar section -->
    <div class="cover-section">
      <div class="cover-photo">
        <button class="change-cover-btn" type="button">
          <Camera size={16} /> Change Cover
        </button>
      </div>
      <div class="avatar-section">
        <img
          src="https://ui-avatars.com/api/?name={encodeURIComponent(fullName)}&background=6a2c91&color=fff&size=200"
          alt={fullName}
          class="avatar"
        />
        <button class="change-avatar-btn" type="button" aria-label="Change avatar">
          <Camera size={14} />
        </button>
      </div>
    </div>

    <!-- Profile Card -->
    <div class="profile-card">

      <!-- Name + details -->
      <div class="user-info">
        {#if isEditing}
          <div class="edit-row">
            <input type="text" bind:value={editForm.firstName}  class="name-input" placeholder="First name" />
            <input type="text" bind:value={editForm.lastName}   class="name-input" placeholder="Last name"  />
          </div>
        {:else}
          <h1 class="user-name">{fullName}</h1>
        {/if}

        <div class="user-details">
          <div class="detail-item"><Mail size={16} /><span>{email}</span></div>

          <div class="detail-item">
            <Phone size={16} />
            {#if isEditing}
              <input type="tel" bind:value={editForm.phone} class="inline-input" placeholder="+234 800 000 0000" />
            {:else}
              <span>{data.profile?.phone ?? '—'}</span>
            {/if}
          </div>

          <div class="detail-item">
            <MapPin size={16} />
            {#if isEditing}
              <input type="text" bind:value={editForm.city}    class="inline-input" placeholder="City"    />
              <input type="text" bind:value={editForm.country} class="inline-input" placeholder="Country" />
            {:else}
              <span>
                {[data.profile?.city, data.profile?.country].filter(Boolean).join(', ') || '—'}
              </span>
            {/if}
          </div>

          <div class="detail-item"><Calendar size={16} /><span>Member since {joinDate}</span></div>
        </div>
      </div>

      <!-- Bio -->
      <div class="description-section">
        {#if isEditing}
          <textarea bind:value={editForm.bio} class="description-input" rows="4"
            placeholder="Tell your community about yourself…"></textarea>
        {:else}
          <p class="user-description">{data.profile?.bio ?? 'No bio yet.'}</p>
        {/if}
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon reports-icon"><AlertTriangle size={22} /></div>
          <div class="stat-content">
            <span class="stat-value">0</span>
            <span class="stat-label">Reports Submitted</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon verified-icon"><CheckCircle size={22} /></div>
          <div class="stat-content">
            <span class="stat-value">0</span>
            <span class="stat-label">Verified Reports</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon votes-icon"><Star size={22} /></div>
          <div class="stat-content">
            <span class="stat-value">0</span>
            <span class="stat-label">Helpful Votes</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon alerts-icon"><Bell size={22} /></div>
          <div class="stat-content">
            <span class="stat-value">0</span>
            <span class="stat-label">Alerts Created</span>
          </div>
        </div>
      </div>

      <!-- Safety score -->
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
                stroke-dashoffset={282.74 - (282.74 * safetyScore / 100)}
                transform="rotate(-90 50 50)" stroke-linecap="round"/>
            </svg>
            <span class="score-value">{safetyScore}</span>
          </div>
          <div class="score-text">
            <p>Trust Score: <strong>{safetyScore}</strong></p>
            <p class="score-rank">KYC: {data.account?.kycStatus ?? '—'}</p>
          </div>
        </div>
      </div>

      <!-- Social links -->
      <div class="social-section">
        <div class="section-header">
          <Globe size={20} style="color: var(--primary-color)" />
          <h3>Connect</h3>
        </div>
        {#if isEditing}
          <div class="social-edit">
            <input type="text" bind:value={editForm.twitterHandle}
              class="inline-input" placeholder="@twitter_handle" />
            <input type="text" bind:value={editForm.linkedinHandle}
              class="inline-input" placeholder="linkedin-handle" />
          </div>
        {:else if social.twitter || social.linkedin}
          <div class="social-links">
            {#if social.twitter}
              <a href="https://twitter.com/{social.twitter.replace('@','')}"
                target="_blank" rel="noopener noreferrer" class="social-link twitter">
                <span>{social.twitter}</span>
              </a>
            {/if}
            {#if social.linkedin}
              <a href="https://linkedin.com/in/{social.linkedin}"
                target="_blank" rel="noopener noreferrer" class="social-link linkedin">
                <span>{social.linkedin}</span>
              </a>
            {/if}
          </div>
        {:else}
          <p class="muted">No social links added yet.</p>
        {/if}
      </div>

      <!-- Actions -->
      <div class="profile-actions">
        {#if isEditing}
          <button class="btn btn-primary" onclick={saveProfile} disabled={isSaving}>
            <Save size={18} /> {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
          <button class="btn btn-secondary" onclick={cancelEditing}>
            <X size={18} /> Cancel
          </button>
        {:else}
          <button class="btn btn-primary" onclick={startEditing}>
            <Settings size={18} /> Edit Profile
          </button>
          <button class="btn btn-outline" onclick={handleLogout}>
            <LogOut size={18} /> Sign Out
          </button>
        {/if}
      </div>

    </div>
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