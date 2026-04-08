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
    Activity,
    ChevronLeft   // ← Added
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
  let session = $state<any>(null);
  let isCheckingAuth = $state(true);

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

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' });
      const data = await res.json();
      session = data.session;
      if (!session) {
        error = 'Not authenticated. Please log in first.';
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      error = 'Failed to check authentication status';
    } finally {
      isCheckingAuth = false;
    }
  }

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
        credentials: 'include',
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
      if (!res.ok) throw new Error(data.error || data.message || 'Failed to create report');

      result = data;
      console.log('✅ Report created with AI analysis:', data);
    } catch (err: any) {
      console.error('Fetch error:', err);
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
    checkAuth();
    autoFillTest(0);
  });
</script>

<div class="test-container">
  <!-- Back to Home -->
  <a href="/" class="back-link">
    <ChevronLeft size={20} />
    <span>Back to Home</span>
  </a>

  <div class="header">
    <Shield size={36} class="header-icon" />
    <div>
      <h1>AI Report Analysis Test</h1>
      <p class="subtitle">Test your AI middleware and incident reporting flow</p>
    </div>
  </div>

  <!-- Auth Status -->
  {#if isCheckingAuth}
    <div class="status-box info">
      <RefreshCw size={18} class="spinning" />
      Checking authentication...
    </div>
  {:else if !session}
    <div class="status-box warning">
      <AlertCircle size={20} />
      <div>
        <strong>Not authenticated</strong>
        <p>Please <a href="/signin">log in</a> to create reports.</p>
      </div>
    </div>
  {:else}
    <div class="status-box success">
      <CheckCircle size={18} />
      Authenticated as: <strong>{session.user?.email || session.user?.id}</strong>
    </div>
  {/if}

  <!-- Quick Test Scenarios -->
  <div class="quick-fill-section">
    <div class="section-header">
      <Activity size={20} />
      <span>Quick Test Scenarios</span>
    </div>
    <div class="scenario-buttons">
      {#each testScenarios as scenario, index}
        <button 
          class="scenario-btn {selectedScenario === index ? 'active' : ''}"
          onclick={() => autoFillTest(index)}
          disabled={!session}
        >
          {scenario.name}
        </button>
      {/each}
    </div>
    <button onclick={randomFill} class="random-btn" disabled={!session}>
      <RefreshCw size={18} />
      Random Scenario
    </button>
  </div>

  <!-- Report Form -->
  <div class="form-card">
    <div class="form-group">
      <label><FileText size={18} /> Title</label>
      <input 
        type="text" 
        bind:value={title} 
        placeholder="E.g., Suspicious person near school"
        disabled={!session}
      />
    </div>

    <div class="form-group">
      <label><FileText size={18} /> Description</label>
      <textarea 
        bind:value={description} 
        rows="6" 
        placeholder="Provide detailed description of the incident..."
        disabled={!session}
      ></textarea>
    </div>

    <div class="form-row">
      <div class="form-group half">
        <label><List size={18} /> Category</label>
        <select bind:value={categoryId} disabled={!session}>
          <option value="">Select Category</option>
          {#each categories as cat}
            <option value={cat.id}>{cat.name}</option>
          {/each}
        </select>
      </div>

      <div class="form-group half">
        <label><MapPin size={18} /> Location Name</label>
        <input 
          type="text" 
          bind:value={locationName} 
          placeholder="E.g., GRA Phase 2"
          disabled={!session}
        />
      </div>
    </div>

    <div class="actions">
      <button onclick={testReport} disabled={isLoading || !session} class="btn-primary">
        {#if isLoading}
          <RefreshCw size={20} class="spinning" />
          Creating Report & Analyzing...
        {:else}
          <Send size={20} />
          Submit Report for AI Analysis
        {/if}
      </button>
      <button onclick={resetForm} class="btn-secondary" disabled={!session}>
        <Trash2 size={20} />
        Clear Form
      </button>
    </div>
  </div>

  {#if error}
    <div class="error-box">
      <AlertCircle size={22} />
      <div><strong>Error:</strong> {error}</div>
    </div>
  {/if}

  {#if result}
    <div class="result-box">
      <div class="result-header">
        <CheckCircle size={28} />
        <h2>Report Created Successfully</h2>
      </div>
      <p class="report-id">Report ID: <strong>{result.reportId}</strong></p>

      <div class="analysis">
        <div class="analysis-header">
          <TrendingUp size={22} />
          <h3>AI Analysis Result</h3>
        </div>

        <div class="analysis-grid">
          <div class="analysis-item">
            <Shield size={18} />
            <span class="label">Severity</span>
            <span class="severity {result.severity}">{result.severity?.toUpperCase() || 'N/A'}</span>
          </div>

          <div class="analysis-item">
            <Target size={18} />
            <span class="label">Threat Score</span>
            <span class="threat-score">{result.threatScore || 0}/100</span>
          </div>

          <div class="analysis-item full-width">
            <FileText size={18} />
            <span class="label">Summary</span>
            <p>{result.summary || 'No summary available'}</p>
          </div>

          <div class="analysis-item full-width">
            <Bell size={18} />
            <span class="label">Recommended Action</span>
            <p>{result.analysis?.recommendedAction || 'Manual review recommended'}</p>
          </div>

          <div class="analysis-item">
            <AlertCircle size={18} />
            <span class="label">Immediate Attention</span>
            <span class="attention {result.needsImmediateAttention ? 'yes' : 'no'}">
              {result.needsImmediateAttention ? 'YES' : 'NO'}
            </span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .test-container {
    max-width: 960px;
    margin: 2rem auto;
    padding: 2rem;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 30px -10px rgba(106, 44, 145, 0.15);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #6a2c91;
    font-weight: 500;
    margin-bottom: 1.5rem;
    text-decoration: none;
    transition: color 0.2s;
  }

  .back-link:hover {
    color: #5a237a;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .header-icon {
    color: #6a2c91;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .subtitle {
    color: #6b7280;
    font-size: 0.95rem;
    margin: 0.25rem 0 0 0;
  }

  .status-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    font-size: 0.95rem;
  }

  .status-box.info { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; }
  .status-box.warning { background: #fef3c7; border: 1px solid #fde68a; color: #92400e; }
  .status-box.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }

  .quick-fill-section {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }

  .scenario-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .scenario-btn {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
    font-weight: 500;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s;
    color: #374151;
  }

  .scenario-btn:hover:not(:disabled) {
    border-color: #6a2c91;
    background: #f3f4f6;
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
    padding: 0.65rem 1.25rem;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 9999px;
    color: #6a2c91;
    font-weight: 500;
    cursor: pointer;
  }

  .form-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    font-size: 0.95rem;
    transition: all 0.2s;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #6a2c91;
    box-shadow: 0 0 0 4px rgba(106, 44, 145, 0.08);
  }

  input:disabled, textarea:disabled, select:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }

  textarea {
    resize: vertical;
    min-height: 130px;
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .btn-primary, .btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.85rem 1.75rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #6a2c91;
    color: white;
    border: none;
    flex: 1;
  }

  .btn-primary:hover:not(:disabled) {
    background: #5a237a;
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: white;
    border: 1px solid #d1d5db;
    color: #374151;
  }

  .btn-secondary:hover:not(:disabled) {
    border-color: #6a2c91;
    color: #6a2c91;
    background: #f9fafb;
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
    padding: 1.25rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    color: #dc2626;
    margin-top: 1rem;
  }

  .result-box {
    margin-top: 2rem;
    padding: 2rem;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 16px;
  }

  .result-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .result-header h2 {
    font-size: 1.4rem;
    font-weight: 600;
    color: #166534;
    margin: 0;
  }

  .report-id {
    font-size: 0.95rem;
    color: #374151;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid #bbf7d0;
    margin-bottom: 1.5rem;
  }

  .analysis-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .analysis-header h3 {
    font-size: 1.15rem;
    font-weight: 600;
    margin: 0;
  }

  .analysis-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .analysis-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .analysis-item.full-width {
    grid-column: span 2;
    flex-direction: column;
  }

  .label {
    font-weight: 600;
    color: #374151;
    min-width: 130px;
    margin-top: 2px;
  }

  .analysis-item p {
    margin: 0.25rem 0 0 0;
    color: #4b5563;
    line-height: 1.6;
  }

  .severity {
    padding: 0.35rem 1rem;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .severity.low { background: #d1fae5; color: #065f46; }
  .severity.medium { background: #fef3c7; color: #92400e; }
  .severity.high { background: #fee2e2; color: #991b1b; }
  .severity.critical { background: #7f1d1d; color: #fecaca; }

  .threat-score {
    font-weight: 700;
    font-size: 1.1rem;
    color: #111827;
  }

  .attention {
    padding: 0.35rem 1rem;
    border-radius: 9999px;
    font-size: 0.8rem;
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

  /* Mobile responsiveness */
  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }
    .test-container {
      margin: 1rem;
      padding: 1.5rem;
      border-radius: 12px;
    }
  }
</style>