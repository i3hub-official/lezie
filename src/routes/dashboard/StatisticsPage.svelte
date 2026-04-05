<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { ChevronLeft, TrendingUp, Shield, AlertTriangle, Users, CheckCircle, Clock } from 'lucide-svelte';
  
  let isLoading = $state(true);
  let stats = $state({
    totalReports: 0,
    verifiedReports: 0,
    activeAlerts: 0,
    safetyScore: 0
  });
  
  onMount(async () => {
    await loadStats();
    isLoading = false;
  });
  
  async function loadStats() {
    await new Promise(resolve => setTimeout(resolve, 800));
    stats = { totalReports: 47, verifiedReports: 32, activeAlerts: 3, safetyScore: 86 };
  }
</script>

<div class="stats-page">
  <div class="page-header">
    <button class="back-btn" onclick={() => goto('/dashboard')}>
      <ChevronLeft size={20} />
      Back
    </button>
    <h1>Statistics</h1>
  </div>

  {#if isLoading}
    <div class="loading">Loading...</div>
  {:else}
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon purple"><TrendingUp size={24} /></div><div><div class="stat-value">{stats.totalReports}</div><div class="stat-label">Total Reports</div></div></div>
      <div class="stat-card"><div class="stat-icon green"><CheckCircle size={24} /></div><div><div class="stat-value">{stats.verifiedReports}</div><div class="stat-label">Verified</div></div></div>
      <div class="stat-card"><div class="stat-icon orange"><Bell size={24} /></div><div><div class="stat-value">{stats.activeAlerts}</div><div class="stat-label">Active Alerts</div></div></div>
      <div class="stat-card"><div class="stat-icon blue"><Shield size={24} /></div><div><div class="stat-value">{stats.safetyScore}%</div><div class="stat-label">Safety Score</div></div></div>
    </div>
  {/if}
</div>

<style>
  .stats-page { padding: 2rem; max-width: 1200px; margin: 0 auto; }
  .page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
  .back-btn { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; cursor: pointer; color: #64748B; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
  .stat-card { background: white; border-radius: 1rem; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; border: 1px solid #E5E7EB; }
  .stat-icon { width: 48px; height: 48px; border-radius: 1rem; display: flex; align-items: center; justify-content: center; }
  .purple { background: #F5F3FF; color: var(--primary-color); }
  .green { background: #D1FAE5; color: #10B981; }
  .orange { background: #FEF3C7; color: #F59E0B; }
  .blue { background: #DBEAFE; color: #3B82F6; }
  .stat-value { font-size: 1.5rem; font-weight: 700; color: #0F172A; }
  .stat-label { font-size: 0.75rem; color: #64748B; }
  @media (max-width: 768px) { .stats-page { padding: 1rem; } }
</style>