<script lang="ts">
  import { goto } from '$app/navigation';
  import { ChevronLeft, Bell, MapPin, Shield, Moon, Globe, LogOut, ChevronRight } from 'lucide-svelte';
  
  let notifications = $state(true);
  let darkMode = $state(false);
  let shareLocation = $state(true);
</script>

<div class="settings-page">
  <div class="page-header">
    <button class="back-btn" onclick={() => goto('/dashboard')}>
      <ChevronLeft size={20} />
      Back
    </button>
    <h1>Settings</h1>
  </div>

  <div class="settings-group">
    <h3>Preferences</h3>
    <div class="setting-item"><Bell size={18} /><span>Push Notifications</span><label class="toggle"><input type="checkbox" bind:checked={notifications} /><span class="toggle-slider"></span></label></div>
    <div class="setting-item"><Moon size={18} /><span>Dark Mode</span><label class="toggle"><input type="checkbox" bind:checked={darkMode} /><span class="toggle-slider"></span></label></div>
    <div class="setting-item"><MapPin size={18} /><span>Share Location</span><label class="toggle"><input type="checkbox" bind:checked={shareLocation} /><span class="toggle-slider"></span></label></div>
  </div>

  <div class="settings-group">
    <h3>Account</h3>
    <div class="setting-item"><Shield size={18} /><span>Privacy & Security</span><ChevronRight size={16} /></div>
    <div class="setting-item"><Globe size={18} /><span>Language</span><ChevronRight size={16} /></div>
  </div>

  <button class="logout-btn" onclick={() => goto('/auth/signin')}><LogOut size={18} /> Sign Out</button>
</div>

<style>
  .settings-page { padding: 2rem; max-width: 600px; margin: 0 auto; }
  .page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
  .back-btn { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; cursor: pointer; color: #64748B; }
  .settings-group { background: white; border-radius: 1rem; padding: 1rem; margin-bottom: 1.5rem; border: 1px solid #E5E7EB; }
  .settings-group h3 { font-size: 0.75rem; font-weight: 600; color: #64748B; margin-bottom: 1rem; text-transform: uppercase; }
  .setting-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid #F1F5F9; }
  .setting-item:last-child { border-bottom: none; }
  .setting-item span { flex: 1; font-size: 0.875rem; }
  .toggle { position: relative; display: inline-block; width: 44px; height: 24px; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: 0.3s; border-radius: 24px; }
  .toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%; }
  input:checked + .toggle-slider { background-color: var(--success-color); }
  input:checked + .toggle-slider:before { transform: translateX(20px); }
  .logout-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 0.75rem; color: #DC2626; cursor: pointer; margin-top: 1rem; }
  @media (max-width: 768px) { .settings-page { padding: 1rem; } }
</style>