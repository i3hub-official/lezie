<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { ChevronLeft, FileText, Clock, MapPin, Eye, FlagTriangleRight } from 'lucide-svelte';
  
  let isLoading = $state(true);
  let reports = $state<any[]>([]);
  
  onMount(async () => {
    await loadReports();
    isLoading = false;
  });
  
  async function loadReports() {
    await new Promise(resolve => setTimeout(resolve, 800));
    reports = [
      { id: 1, title: 'Suspicious person near school', category: 'suspicious', date: new Date().toISOString(), status: 'verified' },
      { id: 2, title: 'Car break-in on Main St', category: 'theft', date: new Date().toISOString(), status: 'investigating' }
    ];
  }
</script>

<div class="reports-page">
  <div class="page-header">
    <button class="back-btn" onclick={() => goto('/dashboard')}>
      <ChevronLeft size={20} />
      Back
    </button>
    <h1>My Reports</h1>
    <button class="new-btn" onclick={() => goto('/report')}>
      <FlagTriangleRight size={18} />
      New Report
    </button>
  </div>

  {#if isLoading}
    <div class="loading">Loading...</div>
  {:else}
    <div class="reports-list">
      {#each reports as report}
        <div class="report-card">
          <div class="report-header">
            <FileText size={18} />
            <h3>{report.title}</h3>
            <span class="status {report.status}">{report.status}</span>
          </div>
          <div class="report-meta">
            <span><Clock size={12} /> {new Date(report.date).toLocaleDateString()}</span>
            <span><MapPin size={12} /> {report.category}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .reports-page { padding: 2rem; max-width: 1000px; margin: 0 auto; }
  .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
  .back-btn { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; cursor: pointer; color: #64748B; }
  .new-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 0.5rem; cursor: pointer; }
  .reports-list { display: flex; flex-direction: column; gap: 1rem; }
  .report-card { background: white; border-radius: 1rem; padding: 1.25rem; border: 1px solid #E5E7EB; }
  .report-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
  .report-header h3 { flex: 1; font-size: 0.875rem; font-weight: 600; }
  .status { font-size: 0.688rem; padding: 0.125rem 0.5rem; border-radius: 1rem; }
  .status.verified { background: #D1FAE5; color: #10B981; }
  .status.investigating { background: #FEF3C7; color: #F59E0B; }
  .report-meta { display: flex; gap: 1rem; font-size: 0.688rem; color: #64748B; }
  .report-meta span { display: flex; align-items: center; gap: 0.25rem; }
  @media (max-width: 768px) { .reports-page { padding: 1rem; } }
</style>