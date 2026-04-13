<script lang="ts">
  import { onMount } from 'svelte';
  import {
    ChevronLeft, Bell, Shield, Moon,
    Trash2, Save, ChevronDown, Lock
  } from 'lucide-svelte';

  import { toasts }  from '$lib/toasts.svelte';
  import { confirm } from '$lib/confirm.svelte';
  import type { UnlockedFeatures } from '$lib/config/settings.config';

  // ── State ──────────────────────────────────────────────────────────────────
  let isLoading    = $state(true);
  let isSaving     = $state(false);
  let showDropdown = $state(false);

  // Tier context — populated from API
  let tier        = $state('1');
  let kycStatus   = $state('pending');
  let trustScore  = $state(0);
  let reportCount = $state(0);

  let unlocked = $state<UnlockedFeatures>({
    emailSmsToggle:     false,
    anonymousReporting: false,
    localScopedPosts:   false,
    profileVisibility:  false,
    showLocationToggle: false,
  });

  // Individual state per toggle — avoids nested $state mutation bug
  let push           = $state(true);
  let email          = $state(false);
  let sms            = $state(false);
  let reportVerified = $state(true);
  // incidentNearby is ALWAYS true — no toggle, no state needed

  let anonymousReporting = $state(false);
  let showLocation       = $state(false);
  let profileVisibility  = $state<'public' | 'community' | 'private'>('community');

  let theme    = $state<'light' | 'dark' | 'system'>('light');
  let language = $state('en');

  const visibilityOptions = [
    { value: 'community' as const, label: 'Community Only' },
    { value: 'public'    as const, label: 'Public'          },
    { value: 'private'   as const, label: 'Private'         },
  ];

  // Tier badge
  const tierLabel = $derived((() => {
    const t = parseInt(tier, 10);
    if (t >= 4) return { text: 'Full Access',    color: '#10B981' };
    if (t >= 3) return { text: 'Trusted Member', color: '#6a2c91' };
    if (t >= 2) return { text: 'Active Member',  color: '#F59E0B' };
    return           { text: 'New Member',       color: '#94a3b8' };
  })());

  // ── Load ───────────────────────────────────────────────────────────────────
  onMount(async () => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error(`Load failed (${res.status})`);
      const data = await res.json();

      tier        = data.tier        ?? '1';
      kycStatus   = data.kycStatus   ?? 'pending';
      trustScore  = data.trustScore  ?? 0;
      reportCount = data.reportCount ?? 0;
      unlocked    = data.unlockedFeatures ?? unlocked;

      push           = data.notifications?.push           ?? true;
      email          = data.notifications?.email          ?? false;
      sms            = data.notifications?.sms            ?? false;
      reportVerified = data.notifications?.reportVerified ?? true;

      anonymousReporting = data.privacy?.anonymousReporting ?? false;
      showLocation       = data.privacy?.showLocation       ?? false;
      profileVisibility  = data.privacy?.profileVisibility  ?? 'community';

      theme    = data.appearance?.theme    ?? 'light';
      language = data.appearance?.language ?? 'en';

    } catch (err) {
      console.error('[Settings] Load failed:', err);
    } finally {
      isLoading = false;
    }
  });

  // ── Dropdown ───────────────────────────────────────────────────────────────
  function toggleDropdown() { showDropdown = !showDropdown; }

  function selectVisibility(value: typeof profileVisibility) {
    profileVisibility = value;
    showDropdown = false;
  }

  function handleClickOutside(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest('.custom-dropdown')) {
      showDropdown = false;
    }
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  async function saveSettings() {
    isSaving = true;
    try {
      const res = await fetch('/api/settings', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notifications: { push, email, sms, reportVerified },
          privacy:       { anonymousReporting, showLocation, profileVisibility },
          appearance:    { theme, language },
        }),
      });

      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      const data = await res.json();
      if (data.unlockedFeatures) unlocked = data.unlockedFeatures;

      toasts.success('Settings Saved', 'Your changes have been applied successfully.');
    } catch (err) {
      console.error('[Settings] Save failed:', err);
      toasts.error?.('Save Failed', 'Could not save settings. Please try again.');
    } finally {
      isSaving = false;
    }
  }

  // ── Delete account ─────────────────────────────────────────────────────────
  async function deleteAccount() {
    const confirmed = await confirm.show({
      title:       'Delete My Account',
      message:     'This action cannot be undone. All your data, reports, and profile will be permanently removed.',
      confirmText: 'Yes, Delete Account',
      cancelText:  'Cancel',
      type:        'danger',
    });
    if (confirmed) {
      toasts.success('Account Deletion Requested', 'You will receive a confirmation email shortly.');
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="settings-page">
  <div class="settings-container">

    <!-- Header -->
    <div class="settings-header">
      <button class="back-btn" onclick={() => window.history.back()}>
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>
      <h1 class="page-title">Settings</h1>
    </div>

    <!-- Tier Badge -->
    {#if !isLoading}
      <div class="tier-banner">
        <div class="tier-left">
          <span class="tier-chip" style="background:{tierLabel.color}20; color:{tierLabel.color}; border-color:{tierLabel.color}40;">
            {tierLabel.text}
          </span>
          <span class="tier-meta">
            KYC: <strong>{kycStatus}</strong> ·
            Trust: <strong>{trustScore}</strong> ·
            Reports: <strong>{reportCount}</strong>
          </span>
        </div>
        {#if !unlocked.emailSmsToggle}
          <span class="tier-hint">Submit more reports to unlock additional settings</span>
        {/if}
      </div>
    {/if}

    {#if isLoading}
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading your settings...</p>
      </div>
    {:else}
      <div class="settings-card">

        <!-- ── Notifications ───────────────────────────────────────────── -->
        <div class="settings-section">
          <div class="section-header">
            <Bell size={22} style="color: var(--primary-color)" />
            <h2>Notifications</h2>
          </div>

          <!-- Push — always unlocked -->
          <div class="setting-item">
            <div>
              <div class="setting-title">Push Notifications</div>
              <div class="setting-desc">Receive alerts for incidents near you</div>
            </div>
            <label class="toggle-switch">
              <input
                type="checkbox"
                checked={push}
                oninput={(e) => push = (e.target as HTMLInputElement).checked}
              />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Email — Tier 2+ -->
          <div class="setting-item {!unlocked.emailSmsToggle ? 'setting-item--locked' : ''}">
            <div>
              <div class="setting-title">
                Email Notifications
                {#if !unlocked.emailSmsToggle}<Lock size={12} class="lock-icon" />{/if}
              </div>
              <div class="setting-desc">
                {unlocked.emailSmsToggle
                  ? 'Weekly summary and important updates'
                  : 'Unlock at Tier 2 (submit 1+ report, trust ≥ 10)'}
              </div>
            </div>
            <label class="toggle-switch {!unlocked.emailSmsToggle ? 'toggle-switch--disabled' : ''}">
              <input
                type="checkbox"
                checked={email}
                disabled={!unlocked.emailSmsToggle}
                oninput={(e) => { if (unlocked.emailSmsToggle) email = (e.target as HTMLInputElement).checked; }}
              />
              <span class="slider"></span>
            </label>
          </div>

          <!-- SMS — Tier 2+ -->
          <div class="setting-item {!unlocked.emailSmsToggle ? 'setting-item--locked' : ''}">
            <div>
              <div class="setting-title">
                SMS Notifications
                {#if !unlocked.emailSmsToggle}<Lock size={12} class="lock-icon" />{/if}
              </div>
              <div class="setting-desc">
                {unlocked.emailSmsToggle
                  ? 'Critical alerts sent via text message'
                  : 'Unlock at Tier 2 (submit 1+ report, trust ≥ 10)'}
              </div>
            </div>
            <label class="toggle-switch {!unlocked.emailSmsToggle ? 'toggle-switch--disabled' : ''}">
              <input
                type="checkbox"
                checked={sms}
                disabled={!unlocked.emailSmsToggle}
                oninput={(e) => { if (unlocked.emailSmsToggle) sms = (e.target as HTMLInputElement).checked; }}
              />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Incident Nearby — ALWAYS ON, cannot be toggled -->
          <div class="setting-item setting-item--locked">
            <div>
              <div class="setting-title">
                Incident Nearby
                <Lock size={12} class="lock-icon" />
              </div>
              <div class="setting-desc">Alert when a new report is filed within 2km — always active for your safety</div>
            </div>
            <label class="toggle-switch toggle-switch--disabled" title="This setting cannot be turned off">
              <input type="checkbox" checked={true} disabled />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Report Verified — always unlocked -->
          <div class="setting-item">
            <div>
              <div class="setting-title">Report Verified</div>
              <div class="setting-desc">Notify me when my reports are verified</div>
            </div>
            <label class="toggle-switch">
              <input
                type="checkbox"
                checked={reportVerified}
                oninput={(e) => reportVerified = (e.target as HTMLInputElement).checked}
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <!-- ── Privacy & Security ──────────────────────────────────────── -->
        <div class="settings-section">
          <div class="section-header">
            <Shield size={22} style="color: var(--primary-color)" />
            <h2>Privacy & Security</h2>
          </div>

          <!-- Anonymous Reporting — Tier 3+ -->
          <div class="setting-item {!unlocked.anonymousReporting ? 'setting-item--locked' : ''}">
            <div>
              <div class="setting-title">
                Anonymous Reporting
                {#if !unlocked.anonymousReporting}<Lock size={12} class="lock-icon" />{/if}
              </div>
              <div class="setting-desc">
                {unlocked.anonymousReporting
                  ? 'Hide my identity when submitting reports'
                  : 'Unlock at Tier 3 (KYC verified, trust ≥ 50, 5+ reports)'}
              </div>
            </div>
            <label class="toggle-switch {!unlocked.anonymousReporting ? 'toggle-switch--disabled' : ''}">
              <input
                type="checkbox"
                checked={anonymousReporting}
                disabled={!unlocked.anonymousReporting}
                oninput={(e) => { if (unlocked.anonymousReporting) anonymousReporting = (e.target as HTMLInputElement).checked; }}
              />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Show Location — Tier 4 -->
          <div class="setting-item {!unlocked.showLocationToggle ? 'setting-item--locked' : ''}">
            <div>
              <div class="setting-title">
                Share My Location
                {#if !unlocked.showLocationToggle}<Lock size={12} class="lock-icon" />{/if}
              </div>
              <div class="setting-desc">
                {unlocked.showLocationToggle
                  ? 'Allow community to see approximate location on map'
                  : 'Unlock at Tier 4 (KYC verified, trust ≥ 100, 10+ reports)'}
              </div>
            </div>
            <label class="toggle-switch {!unlocked.showLocationToggle ? 'toggle-switch--disabled' : ''}">
              <input
                type="checkbox"
                checked={showLocation}
                disabled={!unlocked.showLocationToggle}
                oninput={(e) => { if (unlocked.showLocationToggle) showLocation = (e.target as HTMLInputElement).checked; }}
              />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Profile Visibility — Tier 4 -->
          <div class="setting-item {!unlocked.profileVisibility ? 'setting-item--locked' : ''}">
            <div>
              <div class="setting-title">
                Profile Visibility
                {#if !unlocked.profileVisibility}<Lock size={12} class="lock-icon" />{/if}
              </div>
              <div class="setting-desc">
                {unlocked.profileVisibility
                  ? 'Control who can see your profile'
                  : 'Unlock at Tier 4 (KYC verified, trust ≥ 100, 10+ reports)'}
              </div>
            </div>

            {#if unlocked.profileVisibility}
              <div class="custom-dropdown">
                <button class="dropdown-trigger" onclick={toggleDropdown}>
                  {visibilityOptions.find(o => o.value === profileVisibility)?.label ?? 'Community Only'}
                  <ChevronDown size={18} class={showDropdown ? 'rotated' : ''} />
                </button>
                {#if showDropdown}
                  <div class="dropdown-menu">
                    {#each visibilityOptions as option}
                      <button
                        class="dropdown-item"
                        class:active={option.value === profileVisibility}
                        onclick={() => selectVisibility(option.value)}
                      >
                        {option.label}
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>
            {:else}
              <span class="locked-value">Community Only</span>
            {/if}
          </div>
        </div>

        <!-- ── Appearance ──────────────────────────────────────────────── -->
        <div class="settings-section">
          <div class="section-header">
            <Moon size={22} style="color: var(--primary-color)" />
            <h2>Appearance</h2>
          </div>

          <div class="setting-item">
            <div class="setting-title">Theme</div>
            <div class="theme-options">
              <button
                class="theme-btn {theme === 'light' ? 'active' : ''}"
                onclick={() => theme = 'light'}>Light</button>
              <button
                class="theme-btn {theme === 'dark' ? 'active' : ''}"
                onclick={() => theme = 'dark'}>Dark</button>
              <button
                class="theme-btn {theme === 'system' ? 'active' : ''}"
                onclick={() => theme = 'system'}>System</button>
            </div>
          </div>
        </div>

        <!-- ── Danger Zone ─────────────────────────────────────────────── -->
        <div class="settings-section danger-zone">
          <div class="section-header">
            <h2 style="color: var(--danger-color)">Danger Zone</h2>
          </div>
          <button class="delete-btn" onclick={deleteAccount}>
            <Trash2 size={18} />
            Delete My Account
          </button>
        </div>

        <!-- ── Save ───────────────────────────────────────────────────── -->
        <div class="save-section">
          <button class="save-btn" onclick={saveSettings} disabled={isSaving}>
            {#if isSaving}
              <span>Saving...</span>
            {:else}
              <Save size={18} />
              <span>Save All Changes</span>
            {/if}
          </button>
        </div>

      </div>
    {/if}
  </div>
</div>


<style>
  .settings-page {
    min-height: 100vh;
    background: var(--light-color);
    padding: 2rem 1rem;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .settings-container {
    max-width: 680px;
    margin: 0 auto;
  }

  .settings-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: var(--gray-color);
    font-size: 0.95rem;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
  }

  .back-btn:hover {
    background: #f1f5f9;
    color: var(--dark-color);
  }

  .page-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--dark-color);
    margin: 0;
  }

  .settings-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--primary-border);
  }

  .settings-section {
    margin-bottom: 2.25rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .settings-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .section-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--dark-color);
    margin: 0;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .setting-item:last-child {
    border-bottom: none;
  }

  .setting-title {
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 0.25rem;
  }

  .setting-desc {
    font-size: 0.875rem;
    color: var(--gray-color);
    line-height: 1.4;
  }

  /* Toggle Switch */
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 52px;
    height: 28px;
  }

  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e1;
    transition: .3s;
    border-radius: 9999px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: var(--primary-color);
  }

  input:checked + .slider:before {
    transform: translateX(24px);
  }

  /* Custom Dropdown */
  .custom-dropdown {
    position: relative;
    width: 230px;
  }

  .dropdown-trigger {
    width: 100%;
    padding: 0.65rem 1rem;
    background: white;
    border: 1.5px solid var(--primary-border);
    border-radius: 0.75rem;
    font-size: 0.95rem;
    color: var(--dark-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.2s;
  }

  .dropdown-trigger:hover {
    border-color: var(--primary-color);
  }

  .dropdown-trigger .rotated {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.4rem;
    background: white;
    border: 1.5px solid var(--primary-border);
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    z-index: 100;
  }

  .dropdown-item {
    width: 100%;
    padding: 0.8rem 1rem;
    text-align: left;
    background: none;
    border: none;
    font-size: 0.95rem;
    color: var(--dark-color);
    cursor: pointer;
    transition: all 0.2s;
  }

  .dropdown-item:hover {
    background: #f8fafc;
  }

  .dropdown-item.active {
    background: var(--primary-color);
    color: white;
  }

  /* Theme Options */
  .theme-options {
    display: flex;
    gap: 0.5rem;
  }

  .theme-btn {
    padding: 0.5rem 1.25rem;
    border: 1.5px solid var(--primary-border);
    background: white;
    border-radius: 0.75rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .theme-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  /* Danger Zone */
  .danger-zone {
    border-bottom: none;
  }

  .delete-btn {
    width: 100%;
    padding: 1rem;
    background: #fef2f2;
    color: var(--danger-color);
    border: 1px solid #fecaca;
    border-radius: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .delete-btn:hover {
    background: #fee2e2;
  }

  /* Save Button */
  .save-section {
    margin-top: 1.5rem;
  }

  .save-btn {
    width: 100%;
    padding: 1.1rem;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
    border: none;
    border-radius: 0.875rem;
    font-size: 1.05rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .save-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(106, 44, 145, 0.3);
  }

  .save-btn:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    .settings-card {
      padding: 1.5rem;
    }
    .custom-dropdown {
      width: 100%;
    }
  }

/* ── Tier banner ──────────────────────────────────────────────────────────── */
  .tier-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .625rem 1rem;
    background: var(--primary-bg, #f5f3ff);
    border: 1px solid var(--primary-border, #ddd6fe);
    border-radius: .875rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: .5rem;
  }

  .tier-left {
    display: flex;
    align-items: center;
    gap: .75rem;
    flex-wrap: wrap;
  }

  .tier-chip {
    font-size: .688rem;
    font-weight: 700;
    padding: .25rem .75rem;
    border-radius: 9999px;
    border: 1px solid;
    letter-spacing: .02em;
  }

  .tier-meta {
    font-size: .688rem;
    color: #64748b;
  }

  .tier-meta strong { color: #0f172a; }

  .tier-hint {
    font-size: .625rem;
    color: #94a3b8;
    font-style: italic;
  }

  /* ── Locked setting ──────────────────────────────────────────────────────── */
  .setting-item--locked {
    opacity: .65;
  }

  .lock-icon {
    color: #94a3b8;
    margin-left: .25rem;
    vertical-align: middle;
  }

  .toggle-switch--disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  .locked-value {
    font-size: .75rem;
    color: #94a3b8;
    padding: .375rem .75rem;
    background: #f1f5f9;
    border-radius: .5rem;
    white-space: nowrap;
  }

  /* ── Loading ─────────────────────────────────────────────────────────────── */
  .loading-container {
    text-align: center;
    padding: 3rem;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e2e8f0;
    border-top-color: var(--primary-color, #6a2c91);
    border-radius: 50%;
    animation: spin .7s linear infinite;
    margin: 0 auto .75rem;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
</style>
