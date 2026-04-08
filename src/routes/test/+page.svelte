<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    AlertCircle, 
    CheckCircle, 
    MapPin, 
    FileText, 
    List, 
    RefreshCw,
    Send,
    Trash2,
    Shield,
    TrendingUp,
    Bell,
    Target,
    Activity
  } from 'lucide-svelte';

  // Using runes for state
  let title = $state('');
  let description = $state('');
  let categoryId = $state('');
  let locationName = $state('');
  let isLoading = $state(false);
  let result = $state<any>(null);
  let error = $state('');
  let selectedScenario = $state(0);

  // Sample categories
  const categories = $state([
    { id: 'cat1', name: 'Suspicious Activity' },
    { id: 'cat2', name: 'Theft' },
    { id: 'cat3', name: 'Assault' },
    { id: 'cat4', name: 'Noise Complaint' },
    { id: 'cat5', name: 'Traffic Incident' },
  ]);

  // Sample test data for auto-fill
  const testScenarios = $state([
    {
      name: 'Suspicious Activity',
      title: 'Suspicious person loitering near school gate',
      description: 'A person in dark clothing has been hanging around the school entrance for the past 2 hours, taking photos of children during dismissal time. Security approached but the person left quickly.',
      categoryId: 'cat1',
      locationName: 'Holy Cross School, GRA Phase 2'
    },
    {
      name: 'Theft Incident',
      title: 'Phone snatching at bus stop',
      description: 'Two men on a motorcycle snatched a woman\'s iPhone while she was waiting at the bus stop. They fled towards the market area. Victim is shaken but unharmed.',
      categoryId: 'cat2',
      locationName: 'Rumuokuta Bus Stop'
    },
    {
      name: 'Assault Report',
      title: 'Physical altercation at nightclub',
      description: 'A fight broke out between two groups outside Club Venom around 2 AM. One person was punched and fell to the ground. Bouncers intervened and police were called.',
      categoryId: 'cat3',
      locationName: 'Club Venom, Stadium Road'
    },
    {
      name: 'Noise Complaint',
      title: 'Loud music past midnight',
      description: 'A residence has been playing loud music since 10 PM. It\'s now 1 AM and the bass is shaking neighboring houses. Multiple neighbors have complained.',
      categoryId: 'cat4',
      locationName: 'Estate Road, Phase 3'
    },
    {
      name: 'Traffic Incident',
      title: 'Hit and run at junction',
      description: 'A blue sedan ran a red light and hit a motorcycle. The sedan driver sped off towards the expressway. Motorcyclist has leg injury but is conscious.',
      categoryId: 'cat5',
      locationName: 'Waterlines Junction'
    }
  ]);

  function autoFillTest(index: number) {
    const scenario = testScenarios[index];
    title = scenario.title;
    description = scenario.description;
    categoryId = scenario.categoryId;
    locationName = scenario.locationName;
    selectedScenario = index;
    error = '';
    result = null;
  }

  function randomFill() {
    const randomIndex = Math.floor(Math.random() * testScenarios.length);
    autoFillTest(randomIndex);
  }

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
            coordinates: [7.0498, 4.8242]
          },
          locationName: locationName || 'Test Location',
          isAnonymous: false
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create report');

      result = data;
      console.log('Report created with AI analysis:', data);
    } catch (err: any) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  function resetForm() {
    title = '';
    description = '';
    categoryId = '';
    locationName = '';
    result = null;
    error = '';
    selectedScenario = -1;
  }

  onMount(() => {
    autoFillTest(0);
  });
</script>

<div class="test-container">
  <div class="header">
    <Shield size={32} class="header-icon" />
    <h1>AI Report Analysis Test Page</h1>
  </div>
  <p class="subtitle">Test your AI middleware and report creation flow</p>

  <!-- Quick Fill Section -->
  <div class="quick-fill-section">
    <div class="section-header">
      <Activity size={18} />
      <span>Quick Test Scenarios</span>
    </div>
    <div class="scenario-buttons">
      {#each testScenarios as scenario, index}
        <button 
          class="scenario-btn {selectedScenario === index ? 'active' : ''}"
          onclick={() => autoFillTest(index)}
        >
          {scenario.name}
        </button>
      {/each}
    </div>
    <button onclick={randomFill} class="random-btn">
      <RefreshCw size={16} />
      Random Fill
    </button>
  </div>

  <div class="form-card">
    <div class="form-group">
      <label>
        <FileText size={16} />
        Title
      </label>
      <input 
        type="text" 
        bind:value={title} 
        placeholder="E.g., Suspicious person near school"
      />
    </div>

    <div class="form-group">
      <label>
        <FileText size={16} />
        Description
      </label>
      <textarea 
        bind:value={description} 
        rows="5" 
        placeholder="Describe the incident in detail..."
      ></textarea>
    </div>

    <div class="form-group">
      <label>
        <List size={16} />
        Category
      </label>
      <select bind:value={categoryId}>
        <option value="">Select Category</option>
        {#each categories as cat}
          <option value={cat.id}>{cat.name}</option>
        {/each}
      </select>
    </div>

    <div class="form-group">
      <label>
        <MapPin size={16} />
        Location Name (Optional)
      </label>
      <input 
        type="text" 
        bind:value={locationName} 
        placeholder="E.g., GRA Phase 2"
      />
    </div>

    <div class="actions">
      <button onclick={testReport} disabled={isLoading} class="btn-primary">
        {#if isLoading}
          <RefreshCw size={18} class="spinning" />
          Analyzing with AI...
        {:else}
          <Send size={18} />
          Create Report + AI Analysis
        {/if}
      </button>
      <button onclick={resetForm} class="btn-secondary">
        <Trash2 size={18} />
        Reset
      </button>
    </div>
  </div>

  {#if error}
    <div class="error-box">
      <AlertCircle size={20} />
      <div>
        <strong>Error:</strong> {error}
      </div>
    </div>
  {/if}

  {#if result}
    <div class="result-box">
      <div class="result-header">
        <CheckCircle size={24} />
        <h2>Report Created Successfully</h2>
      </div>
      <p class="report-id"><strong>Report ID:</strong> {result.reportId}</p>

      <div class="analysis">
        <div class="analysis-header">
          <TrendingUp size={20} />
          <h3>AI Analysis Result</h3>
        </div>
        
        <div class="analysis-grid">
          <div class="analysis-item">
            <Shield size={16} />
            <span class="label">Severity:</span>
            <span class="severity {result.severity}">{result.severity?.toUpperCase() || 'N/A'}</span>
          </div>
          
          <div class="analysis-item">
            <Target size={16} />
            <span class="label">Threat Score:</span>
            <span class="threat-score">{result.threatScore || 0}/100</span>
          </div>
          
          <div class="analysis-item full-width">
            <FileText size={16} />
            <span class="label">Summary:</span>
            <p>{result.summary || 'No summary available'}</p>
          </div>
          
          <div class="analysis-item full-width">
            <Bell size={16} />
            <span class="label">Recommended Action:</span>
            <p>{result.analysis?.recommendedAction || 'Manual review recommended'}</p>
          </div>
          
          <div class="analysis-item">
            <AlertCircle size={16} />
            <span class="label">Immediate Attention:</span>
            <span class="attention {result.needsImmediateAttention ? 'yes' : 'no'}">
              {result.needsImmediateAttention ? 'YES' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .test-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .header-icon {
    color: #6a2c91;
  }

  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .subtitle {
    color: #6b7280;
    margin-bottom: 2rem;
    font-size: 0.875rem;
  }

  .quick-fill-section {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  .scenario-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .scenario-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    color: #374151;
  }

  .scenario-btn:hover {
    background: #f3f4f6;
    border-color: #6a2c91;
  }

  .scenario-btn.active {
    background: #6a2c91;
    color: white;
    border-color: #6a2c91;
  }

  .random-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    cursor: pointer;
    color: #6a2c91;
  }

  .random-btn:hover {
    background: #f3f4f6;
  }

  .form-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-family: inherit;
    transition: all 0.2s;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #6a2c91;
    box-shadow: 0 0 0 3px rgba(106, 44, 145, 0.1);
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .btn-primary, .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #6a2c91;
    color: white;
    border: none;
  }

  .btn-primary:hover:not(:disabled) {
    background: #5a237a;
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: white;
    border: 1px solid #d1d5db;
    color: #374151;
  }

  .btn-secondary:hover {
    background: #f9fafb;
    border-color: #6a2c91;
    color: #6a2c91;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .error-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1rem;
    padding: 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    color: #dc2626;
  }

  .result-box {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 0.75rem;
  }

  .result-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .result-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #166534;
    margin: 0;
  }

  .report-id {
    font-size: 0.875rem;
    color: #374151;
    padding-bottom: 1rem;
    border-bottom: 1px solid #bbf7d0;
    margin-bottom: 1rem;
  }

  .analysis-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .analysis-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .analysis-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .analysis-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .analysis-item.full-width {
    grid-column: span 2;
    flex-direction: column;
  }

  .analysis-item .label {
    font-weight: 600;
    color: #374151;
    min-width: 120px;
  }

  .analysis-item p {
    margin: 0.25rem 0 0 0;
    color: #4b5563;
    line-height: 1.5;
  }

  .severity {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .severity.low { background: #d1fae5; color: #065f46; }
  .severity.medium { background: #fef3c7; color: #92400e; }
  .severity.high { background: #fee2e2; color: #991b1b; }
  .severity.critical { background: #7f1d1d; color: #fecaca; }

  .threat-score {
    font-weight: 700;
    color: #111827;
  }

  .attention {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .attention.yes {
    background: #fee2e2;
    color: #991b1b;
  }

  .attention.no {
    background: #f3f4f6;
    color: #374151;
  }
</style>