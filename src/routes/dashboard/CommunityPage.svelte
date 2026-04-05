<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { ChevronLeft, Users, MessageCircle, ThumbsUp, Share2 } from 'lucide-svelte';
  
  let isLoading = $state(true);
  let members = $state<any[]>([]);
  
  onMount(async () => {
    await loadCommunity();
    isLoading = false;
  });
  
  async function loadCommunity() {
    await new Promise(resolve => setTimeout(resolve, 800));
    members = [
      { id: 1, name: 'Sarah Johnson', role: 'Community Leader', reports: 24 },
      { id: 2, name: 'Michael Chen', role: 'Neighborhood Watch', reports: 18 },
      { id: 3, name: 'Emily Rodriguez', role: 'Safety Advocate', reports: 12 }
    ];
  }
</script>

<div class="community-page">
  <div class="page-header">
    <button class="back-btn" onclick={() => goto('/dashboard')}>
      <ChevronLeft size={20} />
      Back
    </button>
    <h1>Community</h1>
  </div>

  <div class="stats-row">
    <div class="stat"><Users size={24} /><div><strong>1,250</strong><span>Members</span></div></div>
    <div class="stat"><MessageCircle size={24} /><div><strong>342</strong><span>Discussions</span></div></div>
    <div class="stat"><ThumbsUp size={24} /><div><strong>89%</strong><span>Positive</span></div></div>
  </div>

  <div class="members-list">
    <h3>Top Contributors</h3>
    {#each members as member}
      <div class="member-card">
        <div class="member-avatar"><Users size={20} /></div>
        <div><strong>{member.name}</strong><span>{member.role}</span></div>
        <div class="member-stats">{member.reports} reports</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .community-page { padding: 2rem; max-width: 1000px; margin: 0 auto; }
  .page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
  .back-btn { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; cursor: pointer; color: #64748B; }
  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .stat { background: white; border-radius: 1rem; padding: 1rem; display: flex; align-items: center; gap: 1rem; border: 1px solid #E5E7EB; }
  .stat strong { display: block; font-size: 1.125rem; }
  .stat span { font-size: 0.688rem; color: #64748B; }
  .members-list h3 { font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem; }
  .member-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border-radius: 0.75rem; border: 1px solid #E5E7EB; margin-bottom: 0.5rem; }
  .member-avatar { width: 40px; height: 40px; background: #F1F5F9; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .member-card strong { display: block; font-size: 0.813rem; }
  .member-card span { font-size: 0.688rem; color: #64748B; }
  .member-stats { margin-left: auto; font-size: 0.75rem; color: var(--primary-color); }
  @media (max-width: 768px) { .community-page { padding: 1rem; } .stats-row { grid-template-columns: 1fr; } }
</style>