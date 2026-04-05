<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    Bell,
    BellRing,
    BellOff,
    MapPin,
    Clock,
    AlertTriangle,
    Settings,
    Plus,
    X,
    Check,
    ChevronLeft,
    Shield,
    Eye,
    Users,
    Home,
    TrendingUp,
    AlertOctagon,
    Flame,
    Car,
    Building,
    Volume2,
    MoreHorizontal,
    ChevronRight,
    Zap,
    ShieldCheck,
    Globe,
    Radio,
    Activity,
    CircleOff
  } from 'lucide-svelte';
  
  let isLoading = $state(true);
  let alerts = $state<any[]>([]);
  let showCreateModal = $state(false);
  let selectedAlert = $state<any>(null);
  let activeTab = $state('active'); // 'active', 'inactive'
  
  // New alert form
  let newAlert = $state({
    name: '',
    radius: 1,
    categories: [] as string[],
    severity: [] as string[],
    isActive: true
  });
  
  const categories = [
    { value: 'suspicious', label: 'Suspicious Activity', icon: AlertTriangle, color: '#F59E0B', bg: '#FEF3C7' },
    { value: 'theft', label: 'Theft / Robbery', icon: AlertOctagon, color: '#EF4444', bg: '#FEE2E2' },
    { value: 'vandalism', label: 'Vandalism', icon: Building, color: '#F97316', bg: '#FFEDD5' },
    { value: 'fire', label: 'Fire / Emergency', icon: Flame, color: '#DC2626', bg: '#FEE2E2' },
    { value: 'accident', label: 'Accident', icon: Car, color: '#F59E0B', bg: '#FEF3C7' },
    { value: 'noise', label: 'Noise Complaint', icon: Volume2, color: '#8B5CF6', bg: '#EDE9FE' },
    { value: 'other', label: 'Other', icon: MoreHorizontal, color: '#6B7280', bg: '#F3F4F6' }
  ];
  
  const severityLevels = [
    { value: 'low', label: 'Low', color: '#10B981', bg: '#D1FAE5', description: 'Non-urgent' },
    { value: 'medium', label: 'Medium', color: '#F59E0B', bg: '#FEF3C7', description: 'Caution' },
    { value: 'high', label: 'High', color: '#F97316', bg: '#FFEDD5', description: 'Urgent' },
    { value: 'critical', label: 'Critical', color: '#EF4444', bg: '#FEE2E2', description: 'Emergency' }
  ];
  
  onMount(async () => {
    await loadAlerts();
    isLoading = false;
  });
  
  async function loadAlerts() {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    alerts = [
      {
        id: 1,
        name: 'Home Area Alert',
        radius: 1,
        categories: ['suspicious', 'theft'],
        severity: ['high', 'critical'],
        isActive: true,
        createdAt: new Date().toISOString(),
        lastTriggered: new Date(Date.now() - 3600000).toISOString(),
        notificationCount: 12,
        location: 'Maple Street Area'
      },
      {
        id: 2,
        name: 'Work Zone',
        radius: 0.5,
        categories: ['accident', 'fire'],
        severity: ['medium', 'high', 'critical'],
        isActive: true,
        createdAt: new Date().toISOString(),
        lastTriggered: new Date(Date.now() - 86400000).toISOString(),
        notificationCount: 5,
        location: 'Downtown Business District'
      },
      {
        id: 3,
        name: 'School Zone',
        radius: 2,
        categories: ['suspicious'],
        severity: ['high', 'critical'],
        isActive: false,
        createdAt: new Date().toISOString(),
        lastTriggered: null,
        notificationCount: 0,
        location: 'Lincoln Elementary Area'
      },
      {
        id: 4,
        name: 'Park Area',
        radius: 1.5,
        categories: ['vandalism', 'noise'],
        severity: ['low', 'medium'],
        isActive: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        lastTriggered: new Date(Date.now() - 172800000).toISOString(),
        notificationCount: 3,
        location: 'Central Park'
      }
    ];
  }
  
  function toggleAlert(alertId: number) {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isActive = !alert.isActive;
    }
  }
  
  function deleteAlert(alertId: number) {
    if (confirm('Are you sure you want to delete this alert zone?')) {
      alerts = alerts.filter(a => a.id !== alertId);
    }
  }
  
  function createAlert() {
    if (!newAlert.name.trim()) return;
    
    const alert = {
      id: Date.now(),
      name: newAlert.name,
      radius: newAlert.radius,
      categories: newAlert.categories,
      severity: newAlert.severity,
      isActive: newAlert.isActive,
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      notificationCount: 0,
      location: 'Custom Area'
    };
    
    alerts.unshift(alert);
    
    newAlert = {
      name: '',
      radius: 1,
      categories: [],
      severity: [],
      isActive: true
    };
    
    showCreateModal = false;
  }
  
  function toggleCategory(category: string) {
    if (newAlert.categories.includes(category)) {
      newAlert.categories = newAlert.categories.filter(c => c !== category);
    } else {
      newAlert.categories = [...newAlert.categories, category];
    }
  }
  
  function toggleSeverity(severity: string) {
    if (newAlert.severity.includes(severity)) {
      newAlert.severity = newAlert.severity.filter(s => s !== severity);
    } else {
      newAlert.severity = [...newAlert.severity, severity];
    }
  }
  
  function formatDate(dateString: string | null) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }
  
  function getCategoryColor(category: string) {
    return categories.find(c => c.value === category)?.color || '#6B7280';
  }
  
  function getCategoryBg(category: string) {
    return categories.find(c => c.value === category)?.bg || '#F3F4F6';
  }
  
  function getSeverityColor(severity: string) {
    return severityLevels.find(s => s.value === severity)?.color || '#6B7280';
  }
  
  function getActiveAlerts() {
    return alerts.filter(a => a.isActive);
  }
  
  function getInactiveAlerts() {
    return alerts.filter(a => !a.isActive);
  }
  
  function getDisplayAlerts() {
    return activeTab === 'active' ? getActiveAlerts() : getInactiveAlerts();
  }
</script>

<svelte:head>
  <title>Alert Zones - Lezie</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="alerts-page">
  <div class="alerts-container">
    <!-- Modern Header -->
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" onclick={() => goto('/dashboard')}>
          <ChevronLeft size={20} />
          <span>Dashboard</span>
        </button>
      </div>
      <div class="header-center">
        <div class="logo-badge">
          <BellRing size={24} />
        </div>
        <div>
          <h1>Alert Zones</h1>
          <p>Monitor incidents that matter to you</p>
        </div>
      </div>
      <div class="header-right">
        <button class="create-btn" onclick={() => showCreateModal = true}>
          <Plus size={18} />
          <span>Create Alert</span>
        </button>
      </div>
    </div>

    {#if isLoading}
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading your alert zones...</p>
      </div>
    {:else}
      <!-- Stats Cards -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon active-icon">
            <Zap size={22} />
          </div>
          <div class="stat-content">
            <span class="stat-value">{getActiveAlerts().length}</span>
            <span class="stat-label">Active Zones</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon total-icon">
            <Globe size={22} />
          </div>
          <div class="stat-content">
            <span class="stat-value">{alerts.length}</span>
            <span class="stat-label">Total Zones</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon notif-icon">
            <Bell size={22} />
          </div>
          <div class="stat-content">
            <span class="stat-value">{alerts.reduce((sum, a) => sum + a.notificationCount, 0)}</span>
            <span class="stat-label">Notifications</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon radius-icon">
            <MapPin size={22} />
          </div>
          <div class="stat-content">
            <span class="stat-value">{alerts.reduce((sum, a) => sum + a.radius, 0).toFixed(1)}</span>
            <span class="stat-label">Total km radius</span>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tabs-container">
        <button 
          class="tab-btn {activeTab === 'active' ? 'active' : ''}" 
          onclick={() => activeTab = 'active'}
        >
          <Radio size={16} />
          Active Alerts
          <span class="tab-count">{getActiveAlerts().length}</span>
        </button>
        <button 
          class="tab-btn {activeTab === 'inactive' ? 'active' : ''}" 
          onclick={() => activeTab = 'inactive'}
        >
          <CircleOff size={16} />
          Inactive Alerts
          <span class="tab-count">{getInactiveAlerts().length}</span>
        </button>
      </div>

      <!-- Alerts Grid -->
      <div class="alerts-grid">
        {#if getDisplayAlerts().length === 0}
          <div class="empty-state">
            <div class="empty-icon">
              <BellOff size={56} />
            </div>
            <h3>No {activeTab === 'active' ? 'active' : 'inactive'} alert zones</h3>
            <p>Create an alert zone to start monitoring incidents in your area.</p>
            <button class="empty-btn" onclick={() => showCreateModal = true}>
              <Plus size={18} />
              Create Alert Zone
            </button>
          </div>
        {:else}
          {#each getDisplayAlerts() as alert}
            <div class="alert-card">
              <div class="card-header">
                <div class="card-title">
                  <div class="title-icon" style="background: var(--primary-bg);">
                    <MapPin size={18} style="color: var(--primary-color);" />
                  </div>
                  <div>
                    <h3>{alert.name}</h3>
                    <div class="location-text">{alert.location}</div>
                  </div>
                </div>
                <div class="card-actions">
                  <label class="toggle">
                    <input type="checkbox" checked={alert.isActive} onchange={() => toggleAlert(alert.id)} />
                    <span class="toggle-slider"></span>
                  </label>
                  <button class="delete-btn" onclick={() => deleteAlert(alert.id)}>
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div class="card-details">
                <div class="detail-row">
                  <div class="detail-badge">
                    <MapPin size={12} />
                    <span>{alert.radius} km radius</span>
                  </div>
                  <div class="detail-badge">
                    <Clock size={12} />
                    <span>Created {formatDate(alert.createdAt)}</span>
                  </div>
                  {#if alert.lastTriggered}
                    <div class="detail-badge">
                      <Activity size={12} />
                      <span>Last {formatDate(alert.lastTriggered)}</span>
                    </div>
                  {/if}
                </div>

                <div class="detail-row">
                  <div class="detail-label">Categories:</div>
                  <div class="tags-group">
                    {#each alert.categories as cat}
                      <span class="category-tag" style="background: {getCategoryBg(cat)}; color: {getCategoryColor(cat)};">
                        {categories.find(c => c.value === cat)?.label || cat}
                      </span>
                    {/each}
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">Severity:</div>
                  <div class="tags-group">
                    {#each alert.severity as sev}
                      <span class="severity-tag" style="background: {severityLevels.find(s => s.value === sev)?.bg}; color: {getSeverityColor(sev)};">
                        {sev}
                      </span>
                    {/each}
                  </div>
                </div>
              </div>

              <div class="card-footer">
                <div class="notif-stats">
                  <Bell size={12} />
                  <span>{alert.notificationCount} notifications received</span>
                </div>
                <button class="view-btn" onclick={() => selectedAlert = alert}>
                  View Details
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    {/if}
  </div>

  <!-- Create Alert Modal -->
  {#if showCreateModal}
    <div class="modal-overlay" onclick={() => showCreateModal = false}>
      <div class="modal" onclick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <div class="modal-title">
            <div class="modal-icon">
              <Plus size={20} />
            </div>
            <h2>Create Alert Zone</h2>
          </div>
          <button class="modal-close" onclick={() => showCreateModal = false}>
            <X size={20} />
          </button>
        </div>

        <div class="modal-body">
          <div class="form-field">
            <label>Zone Name</label>
            <input 
              type="text" 
              bind:value={newAlert.name} 
              placeholder="e.g., Home, Work, School"
              class="form-input"
            />
          </div>

          <div class="form-field">
            <label>Radius (km)</label>
            <div class="radius-control">
              <input 
                type="range" 
                min="0.5" 
                max="10" 
                step="0.5" 
                bind:value={newAlert.radius}
                class="radius-slider"
              />
              <span class="radius-value">{newAlert.radius} km</span>
            </div>
            <p class="field-hint">You'll be alerted for incidents within this radius</p>
          </div>

          <div class="form-field">
            <label>Incident Categories</label>
            <div class="categories-grid">
              {#each categories as cat}
                <button 
                  type="button"
                  class="category-option {newAlert.categories.includes(cat.value) ? 'selected' : ''}"
                  style={newAlert.categories.includes(cat.value) ? `background: ${cat.bg}; border-color: ${cat.color}; color: ${cat.color};` : ''}
                  onclick={() => toggleCategory(cat.value)}
                >
                  <cat.icon size={16} />
                  <span>{cat.label}</span>
                  {#if newAlert.categories.includes(cat.value)}
                    <Check size={14} />
                  {/if}
                </button>
              {/each}
            </div>
          </div>

          <div class="form-field">
            <label>Severity Levels</label>
            <div class="severity-group">
              {#each severityLevels as level}
                <button 
                  type="button"
                  class="severity-option {newAlert.severity.includes(level.value) ? 'selected' : ''}"
                  style={newAlert.severity.includes(level.value) ? `background: ${level.color}; border-color: ${level.color}; color: white;` : ''}
                  onclick={() => toggleSeverity(level.value)}
                >
                  {level.label}
                  {#if newAlert.severity.includes(level.value)}
                    <Check size={14} />
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" onclick={() => showCreateModal = false}>
            Cancel
          </button>
          <button class="btn-primary" onclick={createAlert}>
            <Plus size={16} />
            Create Zone
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Alert Detail Modal -->
  {#if selectedAlert}
    <div class="modal-overlay" onclick={() => selectedAlert = null}>
      <div class="modal detail-modal" onclick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <div class="modal-title">
            <div class="modal-icon" style="background: var(--primary-bg);">
              <MapPin size={20} style="color: var(--primary-color);" />
            </div>
            <h2>{selectedAlert.name}</h2>
          </div>
          <button class="modal-close" onclick={() => selectedAlert = null}>
            <X size={20} />
          </button>
        </div>

        <div class="modal-body">
          <div class="detail-info">
            <div class="info-row">
              <MapPin size={16} />
              <span>{selectedAlert.location}</span>
            </div>
            <div class="info-row">
              <Globe size={16} />
              <span>{selectedAlert.radius} km radius</span>
            </div>
            <div class="info-row">
              <Clock size={16} />
              <span>Created {formatDate(selectedAlert.createdAt)}</span>
            </div>
            {#if selectedAlert.lastTriggered}
              <div class="info-row">
                <Activity size={16} />
                <span>Last triggered {formatDate(selectedAlert.lastTriggered)}</span>
              </div>
            {/if}
          </div>

          <div class="detail-section">
            <h4>Categories</h4>
            <div class="tags-group">
              {#each selectedAlert.categories as cat}
                <span class="category-tag" style="background: {getCategoryBg(cat)}; color: {getCategoryColor(cat)};">
                  {categories.find(c => c.value === cat)?.label || cat}
                </span>
              {/each}
            </div>
          </div>

          <div class="detail-section">
            <h4>Severity Levels</h4>
            <div class="tags-group">
              {#each selectedAlert.severity as sev}
                <span class="severity-tag" style="background: {severityLevels.find(s => s.value === sev)?.bg}; color: {getSeverityColor(sev)};">
                  {sev}
                </span>
              {/each}
            </div>
          </div>

          <div class="detail-section">
            <h4>Statistics</h4>
            <div class="stats-row-modal">
              <div class="stat-item">
                <Bell size={20} />
                <div>
                  <strong>{selectedAlert.notificationCount}</strong>
                  <span>Notifications</span>
                </div>
              </div>
              <div class="stat-item">
                <Activity size={20} />
                <div>
                  <strong>{selectedAlert.isActive ? 'Active' : 'Inactive'}</strong>
                  <span>Current Status</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" onclick={() => selectedAlert = null}>
            Close
          </button>
          <button class="btn-primary" onclick={() => {
            toggleAlert(selectedAlert.id);
            selectedAlert = null;
          }}>
            {selectedAlert.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Safety Banner -->
  <div class="safety-banner">
    <ShieldCheck size={20} />
    <div>
      <strong>Proactive Protection</strong> - Custom alert zones help you stay informed about incidents that matter most to you and your family.
    </div>
  </div>
</div>

<style>
  .alerts-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 1.5rem;
    font-family: 'Inter', system-ui, sans-serif;
  }

  .alerts-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Header */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 1.5rem;
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    border: 1px solid #e2e8f0;
  }

  .header-left, .header-right {
    flex: 1;
  }

  .header-center {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-right {
    display: flex;
    justify-content: flex-end;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #64748b;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
    transition: all 0.2s;
  }

  .back-btn:hover {
    background: #f1f5f9;
    color: var(--primary-color);
  }

  .logo-badge {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .header-center h1 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.125rem;
  }

  .header-center p {
    font-size: 0.75rem;
    color: #64748b;
  }

  .create-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .create-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  /* Loading */
  .loading-container {
    text-align: center;
    padding: 4rem;
    background: white;
    border-radius: 1.5rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Stats Row */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .active-icon { background: #D1FAE5; color: #10B981; }
  .total-icon { background: #EDE9FE; color: #8B5CF6; }
  .notif-icon { background: #FEF3C7; color: #F59E0B; }
  .radius-icon { background: #DBEAFE; color: #3B82F6; }

  .stat-content {
    flex: 1;
  }

  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }

  .stat-label {
    font-size: 0.688rem;
    color: #64748b;
  }

  /* Tabs */
  .tabs-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    background: white;
    padding: 0.25rem;
    border-radius: 1rem;
    width: fit-content;
    border: 1px solid #e2e8f0;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab-btn.active {
    background: var(--primary-color);
    color: white;
  }

  .tab-count {
    background: rgba(0, 0, 0, 0.1);
    padding: 0.125rem 0.375rem;
    border-radius: 0.5rem;
    font-size: 0.625rem;
  }

  .tab-btn.active .tab-count {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Alerts Grid */
  .alerts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 1.5rem;
  }

  /* Alert Card */
  .alert-card {
    background: white;
    border-radius: 1rem;
    padding: 1.25rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
  }

  .alert-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .card-title {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .title-icon {
    width: 40px;
    height: 40px;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-title h3 {
    font-size: 0.938rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.125rem;
  }

  .location-text {
    font-size: 0.688rem;
    color: #64748b;
  }

  .card-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Toggle Switch */
  .toggle {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }

  .toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e1;
    transition: 0.3s;
    border-radius: 24px;
  }

  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + .toggle-slider {
    background-color: var(--success-color);
  }

  input:checked + .toggle-slider:before {
    transform: translateX(20px);
  }

  .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.375rem;
    color: #94a3b8;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .delete-btn:hover {
    background: #fee2e2;
    color: #dc2626;
  }

  /* Card Details */
  .card-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .detail-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .detail-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.688rem;
    color: #64748b;
    background: #f8fafc;
    padding: 0.25rem 0.625rem;
    border-radius: 0.5rem;
  }

  .detail-label {
    font-size: 0.688rem;
    font-weight: 600;
    color: #475569;
    min-width: 65px;
  }

  .tags-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .category-tag, .severity-tag {
    font-size: 0.625rem;
    font-weight: 500;
    padding: 0.1875rem 0.5rem;
    border-radius: 0.5rem;
    text-transform: capitalize;
  }

  /* Card Footer */
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.75rem;
    border-top: 1px solid #f1f5f9;
  }

  .notif-stats {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.688rem;
    color: #64748b;
  }

  .view-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    font-size: 0.688rem;
    font-weight: 500;
    color: var(--primary-color);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .view-btn:hover {
    background: var(--primary-bg);
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
  }

  .empty-icon {
    width: 80px;
    height: 80px;
    background: #f1f5f9;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: #94a3b8;
  }

  .empty-state h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    font-size: 0.813rem;
    color: #64748b;
    margin-bottom: 1.5rem;
  }

  .empty-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 600;
    cursor: pointer;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 1.5rem;
    width: 90%;
    max-width: 560px;
    max-height: 85vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .modal-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .modal-icon {
    width: 36px;
    height: 36px;
    background: #f1f5f9;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-header h2 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #0f172a;
  }

  .modal-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 0.375rem;
    border-radius: 0.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #f1f5f9;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  /* Form Fields */
  .form-field {
    margin-bottom: 1.25rem;
  }

  .form-field label {
    display: block;
    font-size: 0.813rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .form-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(106, 44, 145, 0.1);
  }

  .field-hint {
    font-size: 0.625rem;
    color: #94a3b8;
    margin-top: 0.25rem;
  }

  .radius-control {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .radius-slider {
    flex: 1;
  }

  .radius-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--primary-color);
    min-width: 55px;
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.5rem;
  }

  .category-option, .severity-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .severity-group {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .btn-primary, .btn-secondary {
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: var(--primary-color);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-primary:hover {
    background: var(--primary-dark);
  }

  .btn-secondary {
    background: none;
    border: 1.5px solid #e2e8f0;
    color: #64748b;
  }

  .btn-secondary:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  /* Detail Modal */
  .detail-info {
    background: #f8fafc;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1.25rem;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #475569;
    margin-bottom: 0.5rem;
  }

  .info-row:last-child {
    margin-bottom: 0;
  }

  .detail-section {
    margin-bottom: 1.25rem;
  }

  .detail-section h4 {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stats-row-modal {
    display: flex;
    gap: 1rem;
  }

  .stat-item {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0.75rem;
  }

  .stat-item strong {
    display: block;
    font-size: 0.875rem;
    font-weight: 700;
    color: #0f172a;
  }

  .stat-item span {
    font-size: 0.625rem;
    color: #64748b;
  }

  /* Safety Banner */
  .safety-banner {
    margin-top: 2rem;
    padding: 1rem 1.25rem;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.75rem;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .stats-row {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .alerts-page {
      padding: 1rem;
    }

    .page-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .header-left, .header-right {
      width: 100%;
    }

    .header-right {
      justify-content: center;
    }

    .header-center {
      flex-direction: column;
    }

    .stats-row {
      grid-template-columns: 1fr;
    }

    .alerts-grid {
      grid-template-columns: 1fr;
    }

    .tabs-container {
      width: 100%;
      justify-content: center;
    }

    .categories-grid {
      grid-template-columns: 1fr;
    }
  }
</style>