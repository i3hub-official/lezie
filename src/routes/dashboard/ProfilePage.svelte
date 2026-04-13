<script lang="ts">
  import {
    Mail, MapPin, Calendar, Award, Shield,
    Settings, LogOut, Camera, CheckCircle,
    AlertTriangle, Bell, Star, Edit2, X,
    Save, Globe, Phone, Users, Activity,
    Lock, Key, Home, FileText, CreditCard,
    ChevronDown, Info, Upload
  } from 'lucide-svelte';
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';

  let { data } = $props<{
    data: { user: any; account: any; profile: any; kycData: any; recentReports: any[]; reportSummary: any }
  }>();

  // ── Derived display values ────────────────────────────────
  const fullName    = $derived(
    [data.profile?.firstName, data.profile?.lastName].filter(Boolean).join(' ')
    || data.user?.name || 'User'
  );
  const email       = $derived(data.profile?.email    ?? data.user?.email ?? '');
  const phone       = $derived(data.profile?.phone    ?? '');
  const joinDate    = $derived(data.user?.createdAt
    ? new Date(data.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—'
  );
  const safetyScore = $derived(data.account?.trustScore ?? 0);
  const kycStatus   = $derived(data.account?.kycStatus  ?? 'pending');

  // ── Tabs ──────────────────────────────────────────────────
  let activeTab = $state<'overview' | 'edit' | 'kyc' | 'security'>('overview');

  // ── Edit form ─────────────────────────────────────────────
  let isSaving   = $state(false);
  let saveError  = $state('');
  let saveSuccess = $state('');

  let editForm = $state({
    bio:         data.profile?.bio         ?? '',
    city:        data.profile?.city        ?? '',
    state:       data.profile?.state       ?? '',
    country:     data.profile?.country     ?? '',
    address:     data.profile?.address     ?? '',
    homeAddress: data.profile?.homeAddress ?? '',
    username:    data.profile?.username    ?? '',
    socialLinks: {
      twitter:   (data.profile?.socialLinks as any)?.twitter   ?? '',
      linkedin:  (data.profile?.socialLinks as any)?.linkedin  ?? '',
      instagram: (data.profile?.socialLinks as any)?.instagram ?? '',
    },
  });

  // KYC form
  let kycForm = $state({
    nin:  '',
    bvn:  '',
  });
  let kycError   = $state('');
  let kycSuccess = $state('');
  let savingKyc  = $state(false);

  // Country/state data (condensed — top countries with states)
  const COUNTRIES_WITH_STATES: Record<string, string[]> = {
    'Nigeria': ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
      'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa',
      'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun',
      'Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'],
    'United States': ['Alabama','Alaska','Arizona','Arkansas','California','Colorado',
      'Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana',
      'Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
      'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
      'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma',
      'Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee',
      'Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
    'United Kingdom': ['England','Scotland','Wales','Northern Ireland'],
    'Canada': ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador',
      'Northwest Territories','Nova Scotia','Nunavut','Ontario','Prince Edward Island','Quebec',
      'Saskatchewan','Yukon'],
    'Ghana': ['Ahafo','Ashanti','Bono','Bono East','Central','Eastern','Greater Accra',
      'North East','Northern','Oti','Savannah','Upper East','Upper West','Volta','Western','Western North'],
    'Kenya': ['Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay',
      'Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu',
      'Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru',
      'Migori','Mombasa','Murang\'a','Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua',
      'Nyeri','Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia',
      'Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot'],
    'South Africa': ['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo',
      'Mpumalanga','North West','Northern Cape','Western Cape'],
  };

  const countryList = Object.keys(COUNTRIES_WITH_STATES).sort();
  const stateList   = $derived(
    editForm.country && COUNTRIES_WITH_STATES[editForm.country]
      ? COUNTRIES_WITH_STATES[editForm.country]
      : []
  );

  // Clear state when country changes
  function onCountryChange() {
    editForm.state = '';
  }

  // ── Save profile ──────────────────────────────────────────
  async function saveProfile() {
    isSaving  = true;
    saveError = '';
    saveSuccess = '';
    try {
      const res = await fetch('/api/profile', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(editForm),
      });
      const body = await res.json();
      if (!res.ok) { saveError = body.error ?? 'Failed to save'; return; }
      saveSuccess = 'Profile updated successfully';
      setTimeout(() => window.location.reload(), 900);
    } catch { saveError = 'Connection error. Please try again.'; }
    finally { isSaving = false; }
  }

  // ── Save KYC ──────────────────────────────────────────────
  async function saveKyc() {
    savingKyc  = true;
    kycError   = '';
    kycSuccess = '';
    const payload: any = {};
    if (kycForm.nin.trim()) payload.nin = kycForm.nin.trim();
    if (kycForm.bvn.trim()) payload.bvn = kycForm.bvn.trim();
    if (!Object.keys(payload).length) { kycError = 'Enter at least one field'; savingKyc = false; return; }

    try {
      const res = await fetch('/api/profile', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) { kycError = body.error ?? 'Failed to save'; return; }
      kycSuccess = 'Submitted for verification';
      kycForm = { nin: '', bvn: '' };
      setTimeout(() => window.location.reload(), 900);
    } catch { kycError = 'Connection error.'; }
    finally { savingKyc = false; }
  }

  // ── Photo upload ──────────────────────────────────────────
  let uploadingAvatar = $state(false);
  let uploadingCover  = $state(false);
  let uploadError     = $state('');

  async function uploadPhoto(e: Event, type: 'avatar' | 'cover') {
    const input = e.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;

    const setter = type === 'avatar' ? (v: boolean) => uploadingAvatar = v
                                      : (v: boolean) => uploadingCover  = v;
    setter(true);
    uploadError = '';

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('type', type);

      const res = await fetch('/api/profile/upload', { 
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: form 
});
const body = await res.json();
      if (!res.ok) { uploadError = body.error ?? 'Upload failed'; return; }
      window.location.reload();
    } catch { uploadError = 'Upload failed. Please try again.'; }
    finally { setter(false); }
  }

  // ── Logout ────────────────────────────────────────────────
  async function handleLogout() {
    await authClient.signOut();
    window.location.href = '/signin';
  }

  // ── Helpers ───────────────────────────────────────────────
  const avatarSrc = $derived(
    data.profile?.avatarUrl
      ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6a2c91&color=fff&size=200`
  );
  const coverSrc = $derived(data.profile?.coverUrl ?? null);
  const scoreOffset = $derived(282.74 - (282.74 * Math.min(safetyScore, 100) / 100));
</script>

<!-- ══════════════════════════════════════════════════════════
     PROFILE TAB
══════════════════════════════════════════════════════════ -->
<div class="profile-page">
  <div class="profile-container">

    <!-- Cover + Avatar -->
    <div class="cover-section">
      <div class="cover-photo" style={coverSrc ? `background-image:url('${coverSrc}')` : ''}>
        <label class="change-cover-btn" aria-label="Change cover photo">
          {#if uploadingCover}
            <span class="upload-spinner"></span>
          {:else}
            <Camera size={16} /> Change Cover
          {/if}
          <input type="file" accept="image/*" class="hidden-input"
            onchange={(e) => uploadPhoto(e, 'cover')} />
        </label>
      </div>
      <div class="avatar-section">
        <div class="avatar-wrap">
          <img src={avatarSrc} alt={fullName} class="avatar" />
          <label class="change-avatar-btn" aria-label="Change profile photo">
            {#if uploadingAvatar}
              <span class="upload-spinner-sm"></span>
            {:else}
              <Camera size={14} />
            {/if}
            <input type="file" accept="image/*" class="hidden-input"
              onchange={(e) => uploadPhoto(e, 'avatar')} />
          </label>
        </div>
      </div>
    </div>

    {#if uploadError}
      <div class="alert alert-error"><AlertTriangle size={14} /> {uploadError}</div>
    {/if}

    <!-- Name + quick info -->
    <div class="profile-hero">
      <div class="profile-hero-info">
        <h1 class="user-name">{fullName}</h1>
        {#if data.profile?.username}
          <span class="username-badge">@{data.profile.username}</span>
        {/if}
        <div class="hero-details">
          <span><Mail size={13} /> {email}</span>
          {#if phone}<span><Phone size={13} /> {phone}</span>{/if}
          {#if data.profile?.city || data.profile?.country}
            <span><MapPin size={13} /> {[data.profile.city, data.profile.country].filter(Boolean).join(', ')}</span>
          {/if}
          <span><Calendar size={13} /> Member since {joinDate}</span>
        </div>
      </div>

    </div>

    <!-- Tabs -->
    <div class="profile-tabs">
      {#each [
        { id: 'overview', label: 'Overview',  icon: Users },
        { id: 'edit',     label: 'Edit',      icon: Edit2 },
        { id: 'kyc',      label: 'KYC',       icon: Shield },
        { id: 'security', label: 'Security',  icon: Lock },
      ] as tab}
        <button
          class="tab-btn {activeTab === tab.id ? 'active' : ''}"
          onclick={() => activeTab = tab.id as any}
        >
          <tab.icon size={15} />
          {tab.label}
          {#if tab.id === 'kyc' && kycStatus === 'pending'}
            <span class="tab-badge">!</span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- ── OVERVIEW ── -->
    {#if activeTab === 'overview'}
      <div class="tab-content">

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon reports-icon"><AlertTriangle size={20} /></div>
            <div class="stat-content">
              <span class="stat-value">{data.reportSummary?.total ?? 0}</span>
              <span class="stat-label">Reports</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon score-icon"><Star size={20} /></div>
            <div class="stat-content">
              <span class="stat-value">{safetyScore}</span>
              <span class="stat-label">Trust Score</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon kyc-icon"><Shield size={20} /></div>
            <div class="stat-content">
              <span class="stat-value" style="text-transform:capitalize">{kycStatus}</span>
              <span class="stat-label">KYC Status</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon tier-icon"><Award size={20} /></div>
            <div class="stat-content">
              <span class="stat-value">Tier {data.account?.tier ?? '1'}</span>
              <span class="stat-label">Account Tier</span>
            </div>
          </div>
        </div>

        <!-- Safety score ring -->
        <div class="score-section">
          <div class="score-header">
            <Shield size={18} />
            <h3>Safety Score</h3>
          </div>
          <div class="score-body">
            <div class="score-ring">
              <svg viewBox="0 0 100 100" width="120" height="120">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" stroke-width="8"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="#6a2c91" stroke-width="8"
                  stroke-dasharray="282.74"
                  stroke-dashoffset={scoreOffset}
                  transform="rotate(-90 50 50)"
                  stroke-linecap="round"/>
              </svg>
              <span class="score-num">{safetyScore}</span>
            </div>
            <div class="score-info">
              <p>Your trust score reflects your contribution to community safety.</p>
              <p class="score-tip">Submit verified reports and engage with alerts to increase your score.</p>
            </div>
          </div>
        </div>

        <!-- Bio -->
        {#if data.profile?.bio}
          <div class="bio-section">
            <h3>About</h3>
            <p>{data.profile.bio}</p>
          </div>
        {/if}

        <!-- Location -->
        {#if data.profile?.city || data.profile?.country || data.profile?.state}
          <div class="info-section">
            <h3><MapPin size={15} /> Location</h3>
            <p>{[data.profile.address, data.profile.city, data.profile.state, data.profile.country].filter(Boolean).join(', ')}</p>
          </div>
        {/if}

        <!-- Home address -->
        {#if data.profile?.homeAddress}
          <div class="info-section">
            <h3><Home size={15} /> Home Address</h3>
            <p>{data.profile.homeAddress}</p>
          </div>
        {/if}

        <!-- Social links -->
        {#if (data.profile?.socialLinks as any)?.twitter || (data.profile?.socialLinks as any)?.linkedin}
          <div class="social-section">
            <h3><Globe size={15} /> Social</h3>
            <div class="social-links">
              {#if (data.profile?.socialLinks as any)?.twitter}
                <a href="https://twitter.com/{(data.profile.socialLinks as any).twitter.replace('@','')}"
                  target="_blank" rel="noopener noreferrer" class="social-link">
                  𝕏 @{(data.profile.socialLinks as any).twitter}
                </a>
              {/if}
              {#if (data.profile?.socialLinks as any)?.linkedin}
                <a href="https://linkedin.com/in/{(data.profile.socialLinks as any).linkedin}"
                  target="_blank" rel="noopener noreferrer" class="social-link">
                  in {(data.profile.socialLinks as any).linkedin}
                </a>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Recent reports -->
        {#if data.recentReports?.length > 0}
          <div class="recent-section">
            <h3><Activity size={15} /> Recent Reports</h3>
            <div class="reports-list">
              {#each data.recentReports.slice(0, 5) as report}
                <div class="report-item">
                  <span class="severity-dot severity-{report.severity}"></span>
                  <span class="report-title">{report.title}</span>
                  <span class="report-date">{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

    <!-- ── EDIT ── -->
    {:else if activeTab === 'edit'}
      <div class="tab-content">

        {#if saveSuccess}
          <div class="alert alert-success"><CheckCircle size={14} /> {saveSuccess}</div>
        {/if}
        {#if saveError}
          <div class="alert alert-error"><AlertTriangle size={14} /> {saveError}</div>
        {/if}

        <!-- Immutable fields notice -->
        <div class="notice notice-info">
          <Info size={14} />
          <span>Name, date of birth, email and phone are set during registration and cannot be changed.</span>
        </div>

        <div class="form-grid">

          <!-- Immutable display only -->
          <div class="form-group form-group--readonly">
            <label>Full Name</label>
            <div class="readonly-value">{fullName}</div>
          </div>
          <div class="form-group form-group--readonly">
            <label>Email</label>
            <div class="readonly-value"><Mail size={13} /> {email}</div>
          </div>
          <div class="form-group form-group--readonly">
            <label>Phone</label>
            <div class="readonly-value"><Phone size={13} /> {phone || '—'}</div>
          </div>
          {#if data.profile?.dateOfBirth}
            <div class="form-group form-group--readonly">
              <label>Date of Birth</label>
              <div class="readonly-value">
                {new Date(data.profile.dateOfBirth).toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' })}
              </div>
            </div>
          {/if}

          <!-- Username — set-once -->
          <div class="form-group {data.profile?.usernameSetAt ? 'form-group--readonly' : ''}">
            <label>Username
              {#if data.profile?.usernameSetAt}
                <span class="lock-badge"><Lock size={10} /> Locked</span>
              {:else}
                <span class="optional-badge">Set once — cannot be changed later</span>
              {/if}
            </label>
            {#if data.profile?.usernameSetAt}
              <div class="readonly-value">@{data.profile.username}</div>
            {:else}
              <input type="text" bind:value={editForm.username} class="form-input"
                placeholder="choose_a_username" maxlength={30} />
            {/if}
          </div>

          <!-- Bio -->
          <div class="form-group form-group--full">
            <label>Bio</label>
            <textarea bind:value={editForm.bio} class="form-textarea" rows={4}
              placeholder="Tell your community about yourself…"></textarea>
          </div>

          <!-- Country → State → City chain -->
          <div class="form-group">
            <label>Country</label>
            <div class="select-wrap">
              <select bind:value={editForm.country} class="form-select" onchange={onCountryChange}>
                <option value="">Select country…</option>
                {#each countryList as c}
                  <option value={c}>{c}</option>
                {/each}
                <option disabled>──────────</option>
                <!-- Free-text fallback handled below -->
              </select>
              <ChevronDown size={14} class="select-arrow" />
            </div>
            {#if !countryList.includes(editForm.country) && editForm.country}
              <!-- Country not in list — show free-text -->
              <input type="text" bind:value={editForm.country} class="form-input mt-1"
                placeholder="Enter country name" />
            {/if}
          </div>

          <div class="form-group">
            <label>State / Province</label>
            {#if stateList.length > 0}
              <div class="select-wrap">
                <select bind:value={editForm.state} class="form-select">
                  <option value="">Select state…</option>
                  {#each stateList as s}
                    <option value={s}>{s}</option>
                  {/each}
                </select>
                <ChevronDown size={14} class="select-arrow" />
              </div>
            {:else}
              <input type="text" bind:value={editForm.state} class="form-input"
                placeholder="State / Province / Region" />
            {/if}
          </div>

          <div class="form-group">
            <label>City</label>
            <input type="text" bind:value={editForm.city} class="form-input" placeholder="City" />
          </div>

          <!-- Address -->
          <div class="form-group form-group--full">
            <label>Street Address</label>
            <input type="text" bind:value={editForm.address} class="form-input"
              placeholder="123 Main Street, Apt 4B" />
          </div>

          <!-- Home address -->
          <div class="form-group form-group--full">
            <label><Home size={13} /> Home Address
              <span class="optional-badge">Used for local alerts radius</span>
            </label>
            <input type="text" bind:value={editForm.homeAddress} class="form-input"
              placeholder="Your home address (optional)" />
          </div>

          <!-- Social links -->
          <div class="form-group">
            <label>Twitter / X</label>
            <input type="text" bind:value={editForm.socialLinks.twitter} class="form-input"
              placeholder="@handle" />
          </div>
          <div class="form-group">
            <label>LinkedIn</label>
            <input type="text" bind:value={editForm.socialLinks.linkedin} class="form-input"
              placeholder="profile-name" />
          </div>
          <div class="form-group">
            <label>Instagram</label>
            <input type="text" bind:value={editForm.socialLinks.instagram} class="form-input"
              placeholder="@handle" />
          </div>

        </div>

        <div class="form-actions">
          <button class="btn btn-primary" onclick={saveProfile} disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

    <!-- ── KYC ── -->
    {:else if activeTab === 'kyc'}
      <div class="tab-content">
        <div class="notice notice-info">
          <Shield size={14} />
          <span>Identity verification is optional but increases your trust score and unlocks higher tiers. NIN and BVN are encrypted and cannot be read by staff — they are only verified against your identity.</span>
        </div>

        {#if kycSuccess}
          <div class="alert alert-success"><CheckCircle size={14} /> {kycSuccess}</div>
        {/if}
        {#if kycError}
          <div class="alert alert-error"><AlertTriangle size={14} /> {kycError}</div>
        {/if}

        <div class="kyc-grid">

          <!-- NIN -->
          <div class="kyc-card">
            <div class="kyc-card-header">
              <FileText size={18} />
              <div>
                <h4>NIN — National ID Number</h4>
                <p>11-digit number on your National ID slip or NIMC card</p>
              </div>
              {#if data.profile?.ninVerified}
                <span class="verified-pill"><CheckCircle size={12} /> Verified</span>
              {:else if data.profile?.hasNin}
                <span class="pending-pill">Pending</span>
              {/if}
            </div>
            {#if data.profile?.ninVerified}
              <div class="notice notice-success">
                <CheckCircle size={13} /> Your NIN is verified and locked. It cannot be changed.
              </div>
            {:else}
              <input
                type="text"
                bind:value={kycForm.nin}
                class="form-input"
                placeholder="Enter 11-digit NIN"
                maxlength={11}
                inputmode="numeric"
                disabled={data.profile?.ninVerified}
              />
              {#if data.profile?.hasNin && !data.profile?.ninVerified}
                <p class="field-hint">NIN submitted on {new Date(data.profile.ninSubmittedAt).toLocaleDateString()}. Pending manual verification.</p>
              {/if}
            {/if}
          </div>

          <!-- BVN -->
          <div class="kyc-card">
            <div class="kyc-card-header">
              <CreditCard size={18} />
              <div>
                <h4>BVN — Bank Verification Number</h4>
                <p>11-digit number linked to your bank account</p>
              </div>
              {#if data.profile?.bvnVerified}
                <span class="verified-pill"><CheckCircle size={12} /> Verified</span>
              {:else if data.profile?.hasBvn}
                <span class="pending-pill">Pending</span>
              {/if}
            </div>
            {#if data.profile?.bvnVerified}
              <div class="notice notice-success">
                <CheckCircle size={13} /> Your BVN is verified and locked. It cannot be changed.
              </div>
            {:else}
              <input
                type="text"
                bind:value={kycForm.bvn}
                class="form-input"
                placeholder="Enter 11-digit BVN"
                maxlength={11}
                inputmode="numeric"
                disabled={data.profile?.bvnVerified}
              />
              {#if data.profile?.hasBvn && !data.profile?.bvnVerified}
                <p class="field-hint">BVN submitted on {new Date(data.profile.bvnSubmittedAt).toLocaleDateString()}. Pending manual verification.</p>
              {/if}
            {/if}
          </div>

        </div>

        {#if !data.profile?.ninVerified || !data.profile?.bvnVerified}
          <div class="form-actions">
            <button class="btn btn-primary" onclick={saveKyc} disabled={savingKyc}>
              <Shield size={16} /> {savingKyc ? 'Submitting…' : 'Submit for Verification'}
            </button>
          </div>
        {/if}
      </div>

    <!-- ── SECURITY ── -->
    {:else if activeTab === 'security'}
      <div class="tab-content">
        <div class="security-grid">

          <div class="security-card">
            <div class="security-card-icon"><Key size={20} /></div>
            <div class="security-card-body">
              <h4>Password</h4>
              <p>Change your account password</p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick={() => goto('/forgot-password')}>
              Change
            </button>
          </div>

          <div class="security-card">
            <div class="security-card-icon"><Mail size={20} /></div>
            <div class="security-card-body">
              <h4>Email Verification</h4>
              <p>{data.user?.emailVerified ? 'Email is verified' : 'Email not verified'}</p>
            </div>
            {#if data.user?.emailVerified}
              <span class="verified-pill"><CheckCircle size={12} /> Verified</span>
            {:else}
              <button class="btn btn-primary btn-sm" onclick={() => goto('/verify-email')}>
                Verify
              </button>
            {/if}
          </div>

          <div class="security-card">
            <div class="security-card-icon"><LogOut size={20} /></div>
            <div class="security-card-body">
              <h4>Sign Out</h4>
              <p>Sign out of your account on this device</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick={handleLogout}>
              Sign Out
            </button>
          </div>

        </div>
      </div>
    {/if}

  </div>
</div>

<style>
  .profile-page { width: 100%; }
  .profile-container { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.25rem; padding-bottom: 3rem; }

  /* Cover */
  .cover-section { position: relative; }
  .cover-photo {
    height: 180px; border-radius: 1rem;
    background: linear-gradient(135deg, #1a0b2e, #2d1b4e);
    background-size: cover; background-position: center;
    position: relative; overflow: hidden;
  }
  .change-cover-btn {
    position: absolute; bottom: .75rem; right: .75rem;
    display: inline-flex; align-items: center; gap: .375rem;
    background: rgba(0,0,0,.5); color: white; border: none;
    border-radius: .625rem; padding: .5rem .875rem;
    font-size: .75rem; font-weight: 600; cursor: pointer;
    backdrop-filter: blur(4px); transition: background .2s;
  }
  .change-cover-btn:hover { background: rgba(0,0,0,.7); }
  .avatar-section { position: absolute; bottom: -48px; left: 1.5rem; }
  .avatar-wrap { position: relative; width: 96px; height: 96px; }
  .avatar { width: 96px; height: 96px; border-radius: 50%; border: 4px solid white; object-fit: cover; }
  .change-avatar-btn {
    position: absolute; bottom: 0; right: 0;
    width: 28px; height: 28px; border-radius: 50%;
    background: #6a2c91; color: white; border: 2px solid white;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s;
  }
  .change-avatar-btn:hover { background: #4a1d6e; }
  .hidden-input { display: none; }

  /* Hero */
  .profile-hero { margin-top: 56px; display: flex; justify-content: space-between; align-items: flex-start; }
  .user-name { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.5rem; color: #1e1b4b; margin: 0 0 .25rem; }
  .username-badge { font-size: .8rem; color: #6a2c91; font-weight: 600; background: #f3e8ff; padding: .2rem .6rem; border-radius: 100px; }
  .hero-details { display: flex; flex-wrap: wrap; gap: .5rem 1.25rem; margin-top: .625rem; font-size: .8125rem; color: #64748b; }
  .hero-details span { display: inline-flex; align-items: center; gap: .375rem; }

  /* Tabs */
  .profile-tabs { display: flex; gap: .25rem; border-bottom: 1.5px solid #e5e7eb; padding-bottom: 0; }
  .tab-btn {
    display: inline-flex; align-items: center; gap: .375rem;
    padding: .625rem 1rem; border: none; background: none;
    font-size: .8125rem; font-weight: 500; color: #64748b;
    cursor: pointer; border-bottom: 2px solid transparent;
    margin-bottom: -1.5px; transition: all .2s; border-radius: .5rem .5rem 0 0;
    position: relative;
  }
  .tab-btn:hover { color: #6a2c91; background: #f3e8ff; }
  .tab-btn.active { color: #6a2c91; border-bottom-color: #6a2c91; font-weight: 700; }
  .tab-badge {
    position: absolute; top: .25rem; right: .25rem;
    width: 14px; height: 14px; border-radius: 50%;
    background: #f59e0b; color: white; font-size: .5rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
  }

  /* Tab content */
  .tab-content { display: flex; flex-direction: column; gap: 1.25rem; padding-top: 1rem; }

  /* Stats */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: .875rem; }
  @media (max-width: 640px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
  .stat-card { background: white; border: 1.5px solid #e5e7eb; border-radius: 1rem; padding: 1rem; display: flex; align-items: center; gap: .875rem; }
  .stat-icon { width: 40px; height: 40px; border-radius: .75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .reports-icon { background: #fef2f2; color: #dc2626; }
  .score-icon   { background: #fef3c7; color: #d97706; }
  .kyc-icon     { background: #f0fdf4; color: #15803d; }
  .tier-icon    { background: #f3e8ff; color: #6a2c91; }
  .stat-value   { display: block; font-size: 1.125rem; font-weight: 800; color: #1e1b4b; }
  .stat-label   { display: block; font-size: .6875rem; color: #94a3b8; font-weight: 500; margin-top: .125rem; }

  /* Score ring */
  .score-section { background: white; border: 1.5px solid #e5e7eb; border-radius: 1rem; padding: 1.25rem; }
  .score-header { display: flex; align-items: center; gap: .5rem; margin-bottom: 1rem; font-weight: 700; color: #1e1b4b; }
  .score-body { display: flex; align-items: center; gap: 1.5rem; }
  .score-ring { position: relative; display: flex; align-items: center; justify-content: center; }
  .score-num { position: absolute; font-size: 1.5rem; font-weight: 800; color: #6a2c91; }
  .score-info p { font-size: .8125rem; color: #64748b; margin: 0 0 .5rem; }
  .score-tip { font-size: .75rem; color: #94a3b8; }

  /* Info sections */
  .bio-section, .info-section, .social-section, .recent-section {
    background: white; border: 1.5px solid #e5e7eb; border-radius: 1rem; padding: 1.25rem;
  }
  .bio-section h3, .info-section h3, .social-section h3, .recent-section h3 {
    display: flex; align-items: center; gap: .375rem;
    font-size: .875rem; font-weight: 700; color: #1e1b4b; margin: 0 0 .75rem;
  }
  .bio-section p { font-size: .875rem; color: #374151; line-height: 1.6; margin: 0; }
  .info-section p { font-size: .875rem; color: #374151; margin: 0; }
  .social-links { display: flex; flex-wrap: wrap; gap: .5rem; }
  .social-link { font-size: .8125rem; color: #6a2c91; text-decoration: none; background: #f3e8ff; padding: .375rem .875rem; border-radius: .625rem; font-weight: 600; }
  .social-link:hover { text-decoration: underline; }
  .reports-list { display: flex; flex-direction: column; gap: .5rem; }
  .report-item { display: flex; align-items: center; gap: .75rem; font-size: .8125rem; }
  .severity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .severity-critical { background: #dc2626; }
  .severity-high     { background: #ea580c; }
  .severity-medium   { background: #d97706; }
  .severity-low      { background: #65a30d; }
  .report-title { flex: 1; color: #374151; }
  .report-date  { color: #94a3b8; font-size: .75rem; }

  /* Forms */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
  .form-group { display: flex; flex-direction: column; gap: .375rem; }
  .form-group--full { grid-column: 1 / -1; }
  .form-group--readonly label, .form-group--readonly .readonly-value { opacity: .7; }
  .form-group label { font-size: .8125rem; font-weight: 600; color: #374151; display: flex; align-items: center; gap: .375rem; }
  .form-input { padding: .6875rem .875rem; border: 1.5px solid #e5e7eb; border-radius: .75rem; font-size: .875rem; font-family: inherit; color: #1e1b4b; outline: none; transition: border-color .2s; background: white; }
  .form-input:focus { border-color: #6a2c91; box-shadow: 0 0 0 3px rgba(106,44,145,.1); }
  .form-input:disabled { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }
  .form-textarea { padding: .6875rem .875rem; border: 1.5px solid #e5e7eb; border-radius: .75rem; font-size: .875rem; font-family: inherit; color: #1e1b4b; outline: none; resize: vertical; transition: border-color .2s; }
  .form-textarea:focus { border-color: #6a2c91; box-shadow: 0 0 0 3px rgba(106,44,145,.1); }
  .form-select { width: 100%; padding: .6875rem .875rem; border: 1.5px solid #e5e7eb; border-radius: .75rem; font-size: .875rem; font-family: inherit; color: #1e1b4b; outline: none; appearance: none; background: white; transition: border-color .2s; }
  .form-select:focus { border-color: #6a2c91; box-shadow: 0 0 0 3px rgba(106,44,145,.1); }
  .select-wrap { position: relative; }
  .select-wrap :global(.select-arrow) { position: absolute; right: .875rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: #94a3b8; }
  .readonly-value { padding: .6875rem .875rem; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: .75rem; font-size: .875rem; color: #64748b; display: flex; align-items: center; gap: .5rem; }
  .mt-1 { margin-top: .25rem; }
  .form-actions { display: flex; gap: .75rem; padding-top: .5rem; }
  .field-hint { font-size: .75rem; color: #94a3b8; margin: .25rem 0 0; }

  /* Badges */
  .lock-badge { font-size: .6875rem; font-weight: 600; background: #fef3c7; color: #d97706; padding: .2rem .5rem; border-radius: 100px; display: inline-flex; align-items: center; gap: .2rem; margin-left: .375rem; }
  .optional-badge { font-size: .6875rem; font-weight: 500; color: #94a3b8; margin-left: .375rem; }

  /* Notices */
  .notice { display: flex; align-items: flex-start; gap: .625rem; padding: .875rem 1rem; border-radius: .875rem; font-size: .8125rem; line-height: 1.5; }
  .notice-info    { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
  .notice-success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .alert { display: flex; align-items: center; gap: .5rem; padding: .75rem 1rem; border-radius: .75rem; font-size: .8125rem; font-weight: 600; }
  .alert-success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .alert-error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

  /* KYC */
  .kyc-grid { display: flex; flex-direction: column; gap: 1rem; }
  .kyc-card { background: white; border: 1.5px solid #e5e7eb; border-radius: 1rem; padding: 1.25rem; display: flex; flex-direction: column; gap: .875rem; }
  .kyc-card-header { display: flex; align-items: flex-start; gap: .875rem; }
  .kyc-card-header > :global(svg) { color: #6a2c91; flex-shrink: 0; margin-top: .125rem; }
  .kyc-card-header h4 { font-size: .9375rem; font-weight: 700; color: #1e1b4b; margin: 0 0 .25rem; }
  .kyc-card-header p { font-size: .8rem; color: #64748b; margin: 0; }
  .kyc-card-header { display: grid; grid-template-columns: auto 1fr auto; }
  .verified-pill { display: inline-flex; align-items: center; gap: .25rem; padding: .25rem .625rem; background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; border-radius: 100px; font-size: .6875rem; font-weight: 700; white-space: nowrap; }
  .pending-pill  { display: inline-flex; align-items: center; gap: .25rem; padding: .25rem .625rem; background: #fffbeb; color: #d97706; border: 1px solid #fde68a; border-radius: 100px; font-size: .6875rem; font-weight: 700; }

  /* Security */
  .security-grid { display: flex; flex-direction: column; gap: .875rem; }
  .security-card { background: white; border: 1.5px solid #e5e7eb; border-radius: 1rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; }
  .security-card-icon { width: 44px; height: 44px; border-radius: .875rem; background: #f3e8ff; color: #6a2c91; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .security-card-body { flex: 1; }
  .security-card-body h4 { font-size: .9375rem; font-weight: 700; color: #1e1b4b; margin: 0 0 .25rem; }
  .security-card-body p { font-size: .8rem; color: #64748b; margin: 0; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; padding: .75rem 1.25rem; border-radius: .875rem; font-size: .9375rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all .2s; border: none; }
  .btn-sm { padding: .5rem .875rem; font-size: .8125rem; border-radius: .625rem; }
  .btn-primary { background: linear-gradient(135deg,#6a2c91,#4a1d6e); color: white; box-shadow: 0 4px 14px rgba(106,44,145,.25); }
  .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(106,44,145,.35); }
  .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
  .btn-secondary { background: white; color: #374151; border: 1.5px solid #e5e7eb; }
  .btn-secondary:hover { border-color: #6a2c91; color: #6a2c91; background: #f3e8ff; }
  .btn-outline { background: transparent; color: #64748b; border: 1.5px solid #e5e7eb; }
  .btn-outline:hover { border-color: #6a2c91; color: #6a2c91; }

  /* Upload spinners */
  .upload-spinner, .upload-spinner-sm {
    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3);
    border-top-color: white; border-radius: 50%;
    animation: spin .6s linear infinite;
  }
  .upload-spinner-sm { width: 12px; height: 12px; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>