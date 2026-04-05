<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { ChevronLeft, User, Mail, Phone, MapPin, Shield, Edit2 } from 'lucide-svelte';
  
  let user = $state({ name: 'Alex Morgan', email: 'alex@example.com', phone: '+1 234 567 8900', location: 'Maple Grove' });
</script>

<div class="profile-page">
  <div class="page-header">
    <button class="back-btn" onclick={() => goto('/dashboard')}>
      <ChevronLeft size={20} />
      Back
    </button>
    <h1>Profile</h1>
    <button class="edit-btn"><Edit2 size={16} /> Edit</button>
  </div>

  <div class="profile-card">
    <div class="profile-avatar"><User size={48} /></div>
    <h2>{user.name}</h2>
    <div class="profile-info"><Mail size={16} /> {user.email}</div>
    <div class="profile-info"><Phone size={16} /> {user.phone}</div>
    <div class="profile-info"><MapPin size={16} /> {user.location}</div>
    <div class="profile-badge"><Shield size={14} /> Verified Member</div>
  </div>
</div>

<style>
  .profile-page { padding: 2rem; max-width: 600px; margin: 0 auto; }
  .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
  .back-btn { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; cursor: pointer; color: #64748B; }
  .edit-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: none; border: 1px solid #E5E7EB; border-radius: 0.5rem; cursor: pointer; }
  .profile-card { background: white; border-radius: 1.5rem; padding: 2rem; text-align: center; border: 1px solid #E5E7EB; }
  .profile-avatar { width: 80px; height: 80px; background: var(--primary-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: var(--primary-color); }
  .profile-card h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; }
  .profile-info { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.5rem; color: #64748B; font-size: 0.875rem; }
  .profile-badge { display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 1rem; padding: 0.375rem 0.75rem; background: #D1FAE5; color: #10B981; border-radius: 2rem; font-size: 0.75rem; }
  @media (max-width: 768px) { .profile-page { padding: 1rem; } }
</style>