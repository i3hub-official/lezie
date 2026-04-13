<script lang="ts">
  import { onMount } from 'svelte';
  import {
    ChevronLeft, Bell, Shield, Moon,
    Trash2, Save, ChevronDown
  } from 'lucide-svelte';

  import { toasts }   from '$lib/toasts.svelte';
  import { confirm }  from '$lib/confirm.svelte';

  // ── Settings state ────────────────────────────────────────────────────────
  let settings = $state({
    notifications: {
      push:           true,
      email:          false,
      sms:            true,
      incidentNearby: true,
      reportVerified: true,
    },
    privacy: {
      anonymousReporting: true,
      showLocation:       false,
      profileVisibility:  'community' as string,
    },
    appearance: {
      theme:    'light' as 'light' | 'dark' | 'system',
      language: 'en',
    },
  });

  let isSaving    = $state(false);
  let isLoading   = $state(true);
  let showDropdown = $state(false);

  const visibilityOptions = [
    { value: 'community', label: 'Community Only' },
    { value: 'public',    label: 'Public'          },
    { value: 'private',   label: 'Private'         },
  ];

  // ── Load settings on mount ────────────────────────────────────────────────
  onMount(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        // Deep merge so any missing keys fall back to defaults
        settings = {
          notifications: { ...settings.notifications, ...data.notifications },
          privacy:       { ...settings.privacy,       ...data.privacy       },
          appearance:    { ...settings.appearance,    ...data.appearance    },
        };
      }
    } catch (err) {
      console.error('[Settings] Failed to load:', err);
    } finally {
      isLoading = false;
    }
  });

  // ── Toggle helpers ────────────────────────────────────────────────────────
  // Using explicit setters instead of bind:checked to avoid the Svelte 5
  // nested $state reactivity bug that prevents incidentNearby from toggling.

  function setNotif(key: keyof typeof settings.notifications, val: boolean) {
    settings.notifications = { ...settings.notifications, [key]: val };
  }

  function setPrivacy(key: keyof typeof settings.privacy, val: boolean | string) {
    settings.privacy = { ...settings.privacy, [key]: val };
  }

  // ── Dropdown ──────────────────────────────────────────────────────────────
  function toggleDropdown() { showDropdown = !showDropdown; }

  function selectVisibility(value: string) {
    setPrivacy('profileVisibility', value);
    showDropdown = false;
  }

  function handleClickOutside(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest('.custom-dropdown')) {
      showDropdown = false;
    }
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function saveSettings() {
    isSaving = true;
    try {
      const res = await fetch('/api/settings', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(settings),
      });

      if (!res.ok) throw new Error(`Save failed (${res.status})`);

      toasts.success('Settings Saved', 'Your changes have been applied successfully.');
    } catch (err) {
      console.error('[Settings] Save failed:', err);
      toasts.error?.('Save Failed', 'Could not save settings. Please try again.');
    } finally {
      isSaving = false;
    }
  }

  // ── Delete account ────────────────────────────────────────────────────────
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

    <div class="settings-card">

      <!-- Notifications Section -->
      <div class="settings-section">
        <div class="section-header">
          <Bell size={22} style="color: var(--primary-color)" />
          <h2>Notifications</h2>
        </div>

        <div class="setting-item">
          <div>
            <div class="setting-title">Push Notifications</div>
            <div class="setting-desc">Receive alerts for incidents near you</div>
          </div>
          <label class="toggle-switch">
            <input
            type="checkbox"
            checked={settings.notifications.push}
            oninput={(e) => setNotif('push', (e.target as HTMLInputElement).checked)}
          />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div>
            <div class="setting-title">Email Notifications</div>
            <div class="setting-desc">Weekly summary and important updates</div>
          </div>
          <label class="toggle-switch">
            <input
            type="checkbox"
            checked={settings.notifications.email}
            oninput={(e) => setNotif('email', (e.target as HTMLInputElement).checked)}
          />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div>
            <div class="setting-title">Incident Nearby</div>
            <div class="setting-desc">Alert when a new report is filed within 2km</div>
          </div>
          <label class="toggle-switch">
            <input
            type="checkbox"
            checked={settings.notifications.incidentNearby}
            oninput={(e) => setNotif('incidentNearby', (e.target as HTMLInputElement).checked)}
          />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div>
            <div class="setting-title">Report Verified</div>
            <div class="setting-desc">Notify me when my reports are verified</div>
          </div>
          <label class="toggle-switch">
            <input
            type="checkbox"
            checked={settings.notifications.reportVerified}
/>
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Privacy Section -->
      <div class="settings-section">
        <div class="section-header">
          <Shield size={22} style="color: var(--primary-color)" />
          <h2>Privacy & Security</h2>
        </div>

        <div class="setting-item">
          <div>
            <div class="setting-title">Anonymous Reporting</div>
            <div class="setting-desc">Hide my identity when submitting reports</div>
          </div>
          <label class="toggle-switch">
            <input
            type="checkbox"
            checked={settings.privacy.anonymousReporting}
            oninput={(e) => setPrivacy('anonymousReporting', (e.target as HTMLInputElement).checked)}
          />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div>
            <div class="setting-title">Share My Location</div>
            <div class="setting-desc">Allow community to see approximate location on map</div>
          </div>
          <label class="toggle-switch">
            <input
            type="checkbox"
            checked={settings.privacy.showLocation}
            oninput={(e) => setPrivacy('showLocation', (e.target as HTMLInputElement).checked)}
          />
            <span class="slider"></span>
          </label>
        </div>

        <!-- Custom Dropdown -->
        <div class="setting-item">
          <div>
            <div class="setting-title">Profile Visibility</div>
            <div class="setting-desc">Control who can see your profile</div>
          </div>

          <div class="custom-dropdown">
            <button class="dropdown-trigger" onclick={toggleDropdown}>
              {visibilityOptions.find(opt => opt.value === settings.privacy.profileVisibility)?.label}
              <ChevronDown size={18} class={showDropdown ? 'rotated' : ''} />
            </button>

            {#if showDropdown}
              <div class="dropdown-menu">
                {#each visibilityOptions as option}
                  <button
                    class="dropdown-item"
                    class:active={option.value === settings.privacy.profileVisibility}
                    onclick={() => selectVisibility(option.value)}
                  >
                    {option.label}
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Appearance -->
      <div class="settings-section">
        <div class="section-header">
          <Moon size={22} style="color: var(--primary-color)" />
          <h2>Appearance</h2>
        </div>

        <div class="setting-item">
          <div class="setting-title">Theme</div>
          <div class="theme-options">
            <button 
              class="theme-btn {settings.appearance.theme === 'light' ? 'active' : ''}"
              onclick={() => settings.appearance.theme = 'light'}>
              Light
            </button>
            <button 
              class="theme-btn {settings.appearance.theme === 'dark' ? 'active' : ''}"
              onclick={() => settings.appearance.theme = 'dark'}>
              Dark
            </button>
            <button 
              class="theme-btn {settings.appearance.theme === 'system' ? 'active' : ''}"
              onclick={() => settings.appearance.theme = 'system'}>
              System
            </button>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="settings-section danger-zone">
        <div class="section-header">
          <h2 style="color: var(--danger-color)">Danger Zone</h2>
        </div>

        <button class="delete-btn" onclick={deleteAccount}>
          <Trash2 size={18} />
          Delete My Account
        </button>
      </div>

      <!-- Save Button -->
      <div class="save-section">
        <button 
          class="save-btn" 
          onclick={saveSettings}
          disabled={isSaving}
        >
          {#if isSaving}
            <span>Saving...</span>
          {:else}
            <Save size={18} />
            <span>Save All Changes</span>
          {/if}
        </button>
      </div>

    </div>
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
</style>
