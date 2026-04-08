
<script lang="ts">
  import { onMount } from 'svelte';

  let title = $state('');
  let description = $state('');
  let categoryId = $state('');
  let locationName = $state('');
  let isLoading = $state(false);
  let result = $state<any>(null);
  let error = $state('');

  // Sample categories (adjust according to your DB)
  const categories = [
    { id: 'cat1', name: 'Suspicious Activity' },
    { id: 'cat2', name: 'Theft' },
    { id: 'cat3', name: 'Assault' },
    { id: 'cat4', name: 'Noise Complaint' },
    { id: 'cat5', name: 'Traffic Incident' },
  ];

  async function testReport() {
    if (!title || !description || !categoryId) {
      error = 'Please fill title, description and category';
      return;
    }

    isLoading = true;
    error = '';
    result = null;

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          categoryId,
          location: {
            type: 'Point',
            coordinates: [7.0498, 4.8242] // Example: Port Harcourt
          },
          locationName: locationName || 'Test Location',
          isAnonymous: false
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create report');

      result = data;
      console.log('✅ Report created with AI analysis:', data);
    } catch (err: any) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  function resetForm() {
    title = '';
    description = '';
    locationName = '';
    result = null;
    error = '';
  }
</script>

<div class="test-container">
  <h1>🧪 AI Report Analysis Test Page</h1>
  <p>Test your AI middleware and report creation flow</p>

  <div class="form-card">
    <div class="form-group">
      <label>Title</label>
      <input type="text" bind:value={title} placeholder="E.g., Suspicious person near school" />
    </div>

    <div class="form-group">
      <label>Description</label>
      <textarea bind:value={description} rows="5" 
        placeholder="Describe the incident in detail..."></textarea>
    </div>

    <div class="form-group">
      <label>Category</label>
      <select bind:value={categoryId}>
        <option value="">Select Category</option>
        {#each categories as cat}
          <option value={cat.id}>{cat.name}</option>
        {/each}
      </select>
    </div>

    <div class="form-group">
      <label>Location Name (Optional)</label>
      <input type="text" bind:value={locationName} placeholder="E.g., GRA Phase 2" />
    </div>

    <div class="actions">
      <button onclick={testReport} disabled={isLoading} class="btn-primary">
        {isLoading ? 'Analyzing with AI...' : 'Create Report + AI Analysis'}
      </button>
      <button onclick={resetForm} class="btn-secondary">Reset</button>
    </div>
  </div>

  {#if error}
    <div class="error-box">
      <strong>Error:</strong> {error}
    </div>
  {/if}

  {#if result}
    <div class="result-box">
      <h2>✅ Report Created Successfully</h2>
      <p><strong>Report ID:</strong> {result.reportId}</p>

      <div class="analysis">
        <h3>AI Analysis Result</h3>
        <p><strong>Severity:</strong> <span class="severity {result.severity}">{result.severity.toUpperCase()}</span></p>
        <p><strong>Threat Score:</strong> {result.threatScore}/100</p>
        <p><strong>Summary:</strong> {result.summary}</p>
        <p><strong>Recommended Action:</strong> {result.analysis?.recommendedAction || 'Manual review recommended'}</p>
        <p><strong>Immediate Attention:</strong> {result.needsImmediateAttention ? 'YES' : 'No'}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .test-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
  }
  h1 { margin-bottom: 0.5rem; }
  p { color: #64748b; }

  .form-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    border: 1px solid #e2e8f0;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
  }
  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    font-size: 1rem;
  }
  textarea { resize: vertical; min-height: 120px; }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .btn-primary {
    background: #6a2c91;
    color: white;
    padding: 0.85rem 2rem;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
  }
  .btn-secondary {
    background: transparent;
    border: 2px solid #6a2c91;
    color: #6a2c91;
    padding: 0.85rem 2rem;
    border-radius: 9999px;
  }

  .result-box, .error-box {
    margin-top: 2rem;
    padding: 1.5rem;
    border-radius: 1rem;
  }
  .result-box {
    background: #f0fdf4;
    border: 1px solid #86efac;
  }
  .error-box {
    background: #fef2f2;
    border: 1px solid #f87171;
    color: #b91c1c;
  }

  .severity {
    padding: 0.2rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.85rem;
    font-weight: 700;
  }
  .severity.low { background: #d1fae5; color: #10b981; }
  .severity.medium { background: #fef3c7; color: #d97706; }
  .severity.high { background: #fee2e2; color: #ef4444; }
  .severity.critical { background: #7f1d1d; color: white; }
</style>
