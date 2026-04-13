<!-- src/routes/dashboard/ProfilePage.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    Mail, MapPin, Calendar, Award, Shield,
    Settings, LogOut, Camera, CheckCircle,
    AlertTriangle, Bell, Star, TrendingUp,
    Edit2, X, Save, Globe,
    Phone, Heart, Users, Activity, User, 
    CreditCard, Home, Lock, Eye, EyeOff,
    Upload, Loader2, AlertCircle, Check,
    ChevronDown, ChevronUp, FileText
  } from 'lucide-svelte';
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';
  import { getCloudinaryUrl, CLOUDINARY_CLOUD_NAME } from '$lib/utils/cloudinary-client';

  let { data } = $props<{
    data: {
      user: any;
      account: any;
      profile: any;
    }
  }>();

  // State
  let isEditing = $state(false);
  let isSaving = $state(false);
  let saveError = $state('');
  let saveSuccess = $state(false);
  let activeTab = $state('overview');
  let showNin = $state(false);
  let showBvn = $state(false);
  let uploadingAvatar = $state(false);
  let uploadingCover = $state(false);
  let avatarFile = $state<File | null>(null);
  let coverFile = $state<File | null>(null);
  let avatarPreview = $state('');
  let coverPreview = $state('');

  // Derived values
  const fullName = $derived(
    [data.profile?.firstName, data.profile?.lastName].filter(Boolean).join(' ') || data.user?.name || 'User'
  );
  const email = $derived(data.user?.email ?? '');
  const joinDate = $derived(
    data.user?.createdAt
      ? new Date(data.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : '—'
  );
  const safetyScore = $derived(data.account?.trustScore ?? 0);
  const social = $derived(data.profile?.social ?? {});

  // Edit form
  let editForm = $state({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    bio: '',
    twitterHandle: '',
    linkedinHandle: '',
    nin: '',
    bvn: '',
  });

  // Country list
  const countries = [
    { code: 'NG', name: 'Nigeria' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'KE', name: 'Kenya' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'GH', name: 'Ghana' },
  ];

  const nigeriaStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  function startEditing() {
    editForm = {
      firstName: data.profile?.firstName ?? '',
      lastName: data.profile?.lastName ?? '',
      username: data.profile?.username ?? '',
      phone: data.profile?.phone ?? '',
      streetAddress: data.profile?.streetAddress ?? '',
      city: data.profile?.city ?? '',
      state: data.profile?.state ?? '',
      country: data.profile?.country ?? '',
      postalCode: data.profile?.postalCode ?? '',
      bio: data.profile?.bio ?? '',
      twitterHandle: social.twitter ?? '',
      linkedinHandle: social.linkedin ?? '',
      nin: data.profile?.nin ?? '',
      bvn: data.profile?.bvn ?? '',
    };
    saveError = '';
    saveSuccess = false;
    isEditing = true;
  }

  function cancelEditing() {
    isEditing = false;
    avatarPreview = '';
    coverPreview = '';
    avatarFile = null;
    coverFile = null;
    saveError = '';
  }

  async function uploadToCloudinary(file: File, type: 'avatar' | 'cover'): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('userId', data.user.id);

    try {
      const res = await fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();
      return result.publicId;
    } catch (err) {
      console.error('Upload error:', err);
      saveError = `Failed to upload ${type}`;
      return null;
    }
  }

  async function saveProfile() {
    isSaving = true;
    saveError = '';

    try {
      let avatarPublicId = data.profile?.avatarPublicId;
      let coverPublicId = data.profile?.coverPhotoPublicId;

      // Upload avatar if changed
      if (avatarFile) {
        const uploaded = await uploadToCloudinary(avatarFile, 'avatar');
        if (uploaded) avatarPublicId = uploaded;
      }

      // Upload cover if changed
      if (coverFile) {
        const uploaded = await uploadToCloudinary(coverFile, 'cover');
        if (uploaded) coverPublicId = uploaded;
      }

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          avatarPublicId,
          coverPublicId,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        saveError = body.message ?? 'Failed to save profile';
        return;
      }

      saveSuccess = true;
      isEditing = false;
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

  function handleAvatarUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        saveError = 'Avatar must be less than 5MB';
        return;
      }
      avatarFile = file;
      avatarPreview = URL.createObjectURL(file);
    }
  }

  function handleCoverUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 10 * 1024 * 1024) {
        saveError = 'Cover photo must be less than 10MB';
        return;
      }
      coverFile = file;
      coverPreview = URL.createObjectURL(file);
    }
  }

  // Avatar URL
  const avatarUrl = $derived(
    avatarPreview || 
    (data.profile?.avatarPublicId ? getCloudinaryUrl(data.profile.avatarPublicId, { width: 200, height: 200, crop: 'fill' }) : 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6a2c91&color=fff&size=200`)
  );

  const coverUrl = $derived(
    coverPreview ||
    (data.profile?.coverPhotoPublicId ? getCloudinaryUrl(data.profile.coverPhotoPublicId, { width: 1200, height: 400, crop: 'cover' }) :
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200')
  );
</script>

<div class="profile-page">
  <div class="profile-container">

    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" onclick={() => goto('/dashboard')}>
          <ChevronLeft size={18} />
          <span>Dashboard</span>
        </button>
      </div>
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
        {/if}
      </div>
    </div>

    <!-- Alerts -->
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

    <!-- Cover & Avatar -->
    <div class="cover-section">
      <div class="cover-photo" style="background-image: url({coverUrl})">
        {#if isEditing}
          <label class="change-cover-btn">
            <Camera size={16} /> Change Cover
            <input type="file" accept="image/*" hidden onchange={handleCoverUpload} />
          </label>
        {/if}
        {#if uploadingCover}
          <div class="upload-overlay"><Loader2 size={24} class="spin" /></div>
        {/if}
      </div>
      <div class="avatar-section">
        <img src={avatarUrl} alt={fullName} class="avatar" />
        {#if isEditing}
          <label class="change-avatar-btn">
            <Camera size={14} />
            <input type="file" accept="image/*" hidden onchange={handleAvatarUpload} />
          </label>
        {/if}
        {#if uploadingAvatar}
          <div class="avatar-upload-overlay"><Loader2 size={16} class="spin" /></div>
        {/if}
      </div>
    </div>

    <!-- Tabs -->
    <div class="profile-tabs">
      <button class="tab {activeTab === 'overview' ? 'active' : ''}" onclick={() => activeTab = 'overview'}>
        <User size={16} /> Overview
      </button>
      <button class="tab {activeTab === 'kyc' ? 'active' : ''}" onclick={() => activeTab = 'kyc'}>
        <Shield size={16} /> KYC Verification
      </button>
      <button class="tab {activeTab === 'address' ? 'active' : ''}" onclick={() => activeTab = 'address'}>
        <Home size={16} /> Address
      </button>
      <button class="tab {activeTab === 'security' ? 'active' : ''}" onclick={() => activeTab = 'security'}>
        <Lock size={16} /> Security
      </button>
    </div>

    <!-- Overview Tab -->
    {#if activeTab === 'overview'}
      <div class="profile-card">
        <div class="user-info">
          {#if isEditing}
            <div class="edit-row">
              <input type="text" bind:value={editForm.firstName} class="name-input" placeholder="First name" />
              <input type="text" bind:value={editForm.lastName} class="name-input" placeholder="Last name" />
            </div>
            <div class="edit-row">
              <input type="text" bind:value={editForm.username} class="name-input" placeholder="Username" 
                disabled={data.profile?.usernameSet} />
              {#if data.profile?.usernameSet}
                <span class="disabled-hint">Username cannot be changed</span>
              {/if}
            </div>
          {:else}
            <h1 class="user-name">{fullName}</h1>
            {#if data.profile?.username}
              <p class="username">@{data.profile.username}</p>
            {/if}
          {/if}

          <div class="user-details">
            <div class="detail-item"><Mail size={16} /><span>{email}</span></div>
            <div class="detail-item"><Calendar size={16} /><span>Member since {joinDate}</span></div>
          </div>
        </div>

        <!-- Bio -->
        <div class="description-section">
          {#if isEditing}
            <textarea bind:value={editForm.bio} class="description-input" rows="4"
              placeholder="Tell your community about yourself…"></textarea>
          {:else}
            <p class="user-description">{data.profile?.bio || 'No bio yet.'}</p>
          {/if}
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon reports-icon"><AlertTriangle size={22} /></div>
            <div class="stat-content">
              <span class="stat-value">{data.account?.reportCount || 0}</span>
              <span class="stat-label">Reports Submitted</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon verified-icon"><CheckCircle size={22} /></div>
            <div class="stat-content">
              <span class="stat-value">{data.account?.verifiedReports || 0}</span>
              <span class="stat-label">Verified Reports</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon votes-icon"><Star size={22} /></div>
            <div class="stat-content">
              <span class="stat-value">{data.account?.helpfulVotes || 0}</span>
              <span class="stat-label">Helpful Votes</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon alerts-icon"><Bell size={22} /></div>
            <div class="stat-content">
              <span class="stat-value">{data.account?.alertCount || 0}</span>
              <span class="stat-label">Alerts Created</span>
            </div>
          </div>
        </div>

        <!-- Safety Score -->
        <div class="safety-score-section">
          <div class="score-header">
            <Shield size={20} />
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
              <p class="score-rank">KYC Level: {getKycLevel()}</p>
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div class="social-section">
          <div class="section-header">
            <Globe size={20} />
            <h3>Connect</h3>
          </div>
          {#if isEditing}
            <div class="social-edit">
              <input type="text" bind:value={editForm.twitterHandle} class="inline-input" placeholder="@twitter_handle" />
              <input type="text" bind:value={editForm.linkedinHandle} class="inline-input" placeholder="linkedin-handle" />
            </div>
          {:else if social.twitter || social.linkedin}
            <div class="social-links">
              {#if social.twitter}
                <a href="https://twitter.com/{social.twitter.replace('@','')}" target="_blank" rel="noopener noreferrer" class="social-link">
                  <span>{social.twitter}</span>
                </a>
              {/if}
              {#if social.linkedin}
                <a href="https://linkedin.com/in/{social.linkedin}" target="_blank" rel="noopener noreferrer" class="social-link">
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
              {#if isSaving}<Loader2 size={18} class="spin" />{:else}<Save size={18} />{/if}
              {isSaving ? 'Saving…' : 'Save Changes'}
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
    {/if}

    <!-- KYC Tab -->
    {#if activeTab === 'kyc'}
      <div class="profile-card">
        <div class="kyc-info">
          <div class="kyc-header">
            <Shield size={24} />
            <h2>Identity Verification</h2>
            <p>Verify your identity to increase your trust score and unlock more features</p>
          </div>

          <!-- NIN Field -->
          <div class="kyc-field">
            <label>National Identification Number (NIN)</label>
            <div class="kyc-input-group">
              <input 
                type={showNin ? 'text' : 'password'}
                bind:value={editForm.nin}
                disabled={data.profile?.ninVerified}
                placeholder="Enter your 11-digit NIN"
                class="kyc-input"
              />
              <button class="toggle-visibility" onclick={() => showNin = !showNin}>
                {#if showNin}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
              </button>
            </div>
            {#if data.profile?.ninVerified}
              <div class="verified-badge"><CheckCircle size={14} /> Verified</div>
            {:else if isEditing}
              <p class="field-hint">NIN cannot be changed once verified</p>
            {/if}
          </div>

          <!-- BVN Field -->
          <div class="kyc-field">
            <label>Bank Verification Number (BVN)</label>
            <div class="kyc-input-group">
              <input 
                type={showBvn ? 'text' : 'password'}
                bind:value={editForm.bvn}
                disabled={data.profile?.bvnVerified}
                placeholder="Enter your 11-digit BVN"
                class="kyc-input"
              />
              <button class="toggle-visibility" onclick={() => showBvn = !showBvn}>
                {#if showBvn}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
              </button>
            </div>
            {#if data.profile?.bvnVerified}
              <div class="verified-badge"><CheckCircle size={14} /> Verified</div>
            {:else if isEditing}
              <p class="field-hint">BVN cannot be changed once verified</p>
            {/if}
          </div>

          {#if isEditing}
            <button class="btn btn-primary" onclick={saveProfile} disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save KYC Information'}
            </button>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Address Tab -->
    {#if activeTab === 'address'}
      <div class="profile-card">
        <div class="address-section">
          <div class="section-header">
            <Home size={20} />
            <h3>Home Address</h3>
          </div>

          <div class="address-form">
            <div class="form-group">
              <label>Street Address</label>
              <input 
                type="text" 
                bind:value={editForm.streetAddress}
                disabled={!isEditing}
                placeholder="Enter your street address"
                class="form-input"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Country</label>
                <select bind:value={editForm.country} disabled={!isEditing} class="form-select">
                  <option value="">Select country</option>
                  {#each countries as c}
                    <option value={c.code}>{c.name}</option>
                  {/each}
                </select>
              </div>
              <div class="form-group">
                <label>State/Province</label>
                <select bind:value={editForm.state} disabled={!isEditing} class="form-select">
                  <option value="">Select state</option>
                  {#each editForm.country === 'NG' ? nigeriaStates : [] as state}
                    <option value={state}>{state}</option>
                  {/each}
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>City</label>
                <input type="text" bind:value={editForm.city} disabled={!isEditing} placeholder="City" class="form-input" />
              </div>
              <div class="form-group">
                <label>Postal Code</label>
                <input type="text" bind:value={editForm.postalCode} disabled={!isEditing} placeholder="Postal code" class="form-input" />
              </div>
            </div>

            {#if !isEditing && data.profile?.homeAddressSet}
              <div class="verified-badge"><CheckCircle size={14} /> Address verified</div>
            {/if}
          </div>

          {#if isEditing}
            <div class="form-actions">
              <button class="btn btn-primary" onclick={saveProfile} disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save Address'}
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Security Tab -->
    {#if activeTab === 'security'}
      <div class="profile-card">
        <div class="security-section">
          <div class="section-header">
            <Lock size={20} />
            <h3>Account Security</h3>
          </div>

          <div class="security-item">
            <div class="security-info">
              <h4>Phone Number</h4>
              <p>{data.profile?.phone || 'Not set'}</p>
            </div>
            {#if isEditing}
              <input type="tel" bind:value={editForm.phone} placeholder="+234 800 000 0000" class="security-input" />
            {/if}
          </div>

          <div class="security-item">
            <div class="security-info">
              <h4>Email Address</h4>
              <p>{email}</p>
              <span class="security-note">Email cannot be changed</span>
            </div>
          </div>

          <div class="security-item">
            <div class="security-info">
              <h4>Username</h4>
              <p>{data.profile?.username || 'Not set'}</p>
              {#if data.profile?.usernameSet}
                <span class="security-note">Username cannot be changed once set</span>
              {/if}
            </div>
            {#if isEditing && !data.profile?.usernameSet}
              <input type="text" bind:value={editForm.username} placeholder="Choose a username" class="security-input" />
            {/if}
          </div>

          {#if isEditing}
            <button class="btn btn-primary" onclick={saveProfile} disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save Security Settings'}
            </button>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Add to existing styles */
  .profile-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    background: white;
    padding: 0.5rem;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
  }

  .tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: transparent;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab:hover {
    background: #f1f5f9;
  }

  .tab.active {
    background: var(--primary-bg);
    color: var(--primary-color);
  }

  .username {
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 1rem;
  }

  .disabled-hint {
    font-size: 0.688rem;
    color: #f59e0b;
    margin-top: 0.25rem;
    display: block;
  }

  /* KYC Styles */
  .kyc-info {
    max-width: 600px;
    margin: 0 auto;
  }

  .kyc-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .kyc-header h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0.5rem 0;
  }

  .kyc-header p {
    font-size: 0.875rem;
    color: #64748b;
  }

  .kyc-field {
    margin-bottom: 1.5rem;
  }

  .kyc-field label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .kyc-input-group {
    position: relative;
    display: flex;
    align-items: center;
  }

  .kyc-input {
    flex: 1;
    padding: 0.75rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
  }

  .kyc-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .kyc-input:disabled {
    background: #f8fafc;
    color: #64748b;
  }

  .toggle-visibility {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
  }

  /* Address Form */
  .address-form {
    max-width: 600px;
    margin: 0 auto;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    font-size: 0.813rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.375rem;
  }

  .form-input, .form-select {
    width: 100%;
    padding: 0.75rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
  }

  .form-input:focus, .form-select:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .form-input:disabled, .form-select:disabled {
    background: #f8fafc;
    color: #64748b;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-actions {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;
  }

  /* Security Section */
  .security-section {
    max-width: 600px;
    margin: 0 auto;
  }

  .security-item {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .security-info h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.25rem;
  }

  .security-info p {
    font-size: 0.875rem;
    color: #475569;
  }

  .security-note {
    font-size: 0.688rem;
    color: #f59e0b;
    display: inline-block;
    margin-top: 0.25rem;
  }

  .security-input {
    flex: 1;
    min-width: 200px;
    padding: 0.5rem 0.75rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.875rem;
  }

  /* Upload Overlays */
  .upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
  }

  .avatar-upload-overlay {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 32px;
    height: 32px;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  .verified-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #10B981;
  }

  .field-hint {
    font-size: 0.688rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  .muted {
    color: #64748b;
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    .profile-tabs {
      flex-wrap: wrap;
    }
    
    .form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }
    
    .security-item {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .security-input {
      width: 100%;
    }
  }

  function getKycLevel() {
    if (data.profile?.ninVerified && data.profile?.bvnVerified) return 'Tier 3';
    if (data.profile?.ninVerified || data.profile?.bvnVerified) return 'Tier 2';
    return 'Tier 1';
  }
</style>