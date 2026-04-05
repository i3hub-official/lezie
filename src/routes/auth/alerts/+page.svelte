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
    MoreHorizontal
  } from 'lucide-svelte';
  
  let isLoading = $state(true);
  let alerts = $state<any[]>([]);
  let showCreateModal = $state(false);
  let selectedAlert = $state<any>(null);
  
  // New alert form
  let newAlert = $state({
    name: '',
    radius: 1,
    categories: [] as string[],
    severity: [] as string[],
    isActive: true
  });
  
  const categories = [
    { value: 'suspicious', label: 'Suspicious Activity', icon: AlertTriangle, color: '#F59E0B' },
    { value: 'theft', label: 'Theft / Robbery', icon: AlertOctagon, color: '#EF4444' },
    { value: 'vandalism', label: 'Vandalism', icon: Building, color: '#F97316' },
    { value: 'fire', label: 'Fire / Emergency', icon: Flame, color: '#DC2626' },
    { value: 'accident', label: 'Accident', icon: Car, color: '#F59E0B' },
    { value: 'noise', label: 'Noise Complaint', icon: Volume2, color: '#8B5CF6' },
    { value: 'other', label: 'Other', icon: MoreHorizontal, color: '#6B7280' }
  ];
  
  const severityLevels = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'high', label: 'High', color: '#F97316' },
    { value: 'critical', label: 'Critical', color: '#EF4444' }
  ];
  
  onMount(async () => {
    await loadAlerts();
    isLoading = false;
  });
  
  async function loadAlerts() {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
        notificationCount: 12
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
        notificationCount: 5
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
        notificationCount: 0
      }
    ];
  }
  
  function toggleAlert(alertId: number) {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isActive = !alert.isActive;
      // TODO: API call to update alert status
    }
  }
  
  function deleteAlert(alertId: number) {
    alerts = alerts.filter(a => a.id !== alertId);
    // TODO: API call to delete alert
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
      notificationCount: 0
    };
    
    alerts.unshift(alert);
    
    // Reset form
    newAlert = {
      name: '',
      radius: 1,
      categories: [],
      severity: [],
      isActive: true
    };
    
    showCreateModal = false;
    // TODO: API call to create alert
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
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  }
  
  function getCategoryColor(category: string) {
    return categories.find(c => c.value === category)?.color || '#6B7280';
  }
  
  function getSeverityColor(severity: string) {
    return severityLevels.find(s => s.value === severity)?.color || '#6B7280';
  }
</script>

<svelte:head>
  <title>Alerts - Lezie</title>
</svelte:head>

<div class="alerts-page">
  <div class="alerts-container">
    <!-- Header -->
    <div class="page-header">
      <button class="back-button" onclick={() => goto('/dashboard')} aria-label="Go back">
        <ChevronLeft size={20} />
        Back
      </button>
      <div class="header-content">
        <div class="header-icon">
          <BellRing size={28} />
        </div>
        <div>
          <h1>Safety Alerts</h1>
          <p>Manage your notification preferences and alert zones</p>
        </div>
      </div>
      <button class="create-btn" onclick={() => showCreateModal = true}>
        <Plus size={18} />
        Create Alert
      </button>
    </div>
    
    {#if isLoading}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading your alerts...</p>
      </div>
    {:else}
      <!-- Stats Overview -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(106, 44, 145, 0.1); color: var(--primary-color);">
            <Bell size={24} />
          </div>
          <div class="stat-info">
            <span class="stat-value">{alerts.filter(a => a.isActive).length}</span>
            <span class="stat-label">Active Alerts</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: #10B981;">
            <BellRing size={24} />
          </div>
          <div class="stat-info">
            <span class="stat-value">{alerts.reduce((sum, a) => sum + a.notificationCount, 0)}</span>
            <span class="stat-label">Total Notifications</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1); color: #F59E0B;">
            <MapPin size={24} />
          </div>
          <div class="stat-info">
            <span class="stat-value">{alerts.length}</span>
            <span class="stat-label">Alert Zones</span>
          </div>
        </div>
      </div>
      
      <!-- Alerts List -->
      <div class="alerts-list">
        {#if alerts.length === 0}
          <div class="empty-state">
            <BellOff size={64} />
            <h3>No alerts set up yet</h3>
            <p>Create your first alert zone to start receiving notifications about incidents in your area.</p>
            <button class="empty-create-btn" onclick={() => showCreateModal = true}>
              <Plus size={18} />
              Create Your First Alert
            </button>
          </div>
        {:else}
          {#each alerts as alert}
            <div class="alert-card">
              <div class="alert-header">
                <div class="alert-title">
                  <div class="alert-icon" style="background: var(--primary-bg);">
                    <MapPin size={18} style="color: var(--primary-color);" />
                  </div>
                  <div>
                    <h3>{alert.name}</h3>
                    <div class="alert-meta">
                      <span class="meta-item">
                        <MapPin size={12} />
                        {alert.radius} km radius
                      </span>
                      <span class="meta-item">
                        <Clock size={12} />
                        Created {formatDate(alert.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="alert-actions">
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={alert.isActive} 
                      onchange={() => toggleAlert(alert.id)}
                    />
                    <span class="toggle-slider"></span>
                  </label>
                  <button class="delete-btn" onclick={() => deleteAlert(alert.id)} aria-label="Delete alert">
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div class="alert-details">
                <div class="detail-section">
                  <span class="detail-label">Categories:</span>
                  <div class="category-tags">
                    {#each alert.categories as cat}
                      <span class="category-tag" style="background: {getCategoryColor(cat)}20; color: {getCategoryColor(cat)};">
                        {categories.find(c => c.value === cat)?.label || cat}
                      </span>
                    {/each}
                  </div>
                </div>
                
                <div class="detail-section">
                  <span class="detail-label">Severity Levels:</span>
                  <div class="severity-tags">
                    {#each alert.severity as sev}
                      <span class="severity-tag" style="background: {getSeverityColor(sev)}20; color: {getSeverityColor(sev)};">
                        {sev}
                      </span>
                    {/each}
                  </div>
                </div>
                
                <div class="detail-section">
                  <span class="detail-label">Statistics:</span>
                  <div class="stats">
                    <span class="stat-badge">
                      <Bell size={12} />
                      {alert.notificationCount} notifications
                    </span>
                    {#if alert.lastTriggered}
                      <span class="stat-badge">
                        <Clock size={12} />
                        Last triggered {formatDate(alert.lastTriggered)}
                      </span>
                    {/if}
                  </div>
                </div>
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
      <div class="modal-content" onclick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h2>Create New Alert</h2>
          <button class="modal-close" onclick={() => showCreateModal = false}>
            <X size={20} />
          </button>
        </div>
        
        <div class="modal-body">
          <!-- Alert Name -->
          <div class="form-group">
            <label class="form-label" for="alert-name">Alert Name</label>
            <input
              id="alert-name"
              type="text"
              bind:value={newAlert.name}
              class="form-input"
              placeholder="e.g., Home Area, Work Zone"
            />
          </div>
          
          <!-- Radius -->
          <div class="form-group">
            <label class="form-label">Alert Radius</label>
            <div class="radius-input">
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
            <p class="form-hint">You'll receive alerts for incidents within this radius</p>
          </div>
          
          <!-- Categories -->
          <div class="form-group">
            <span class="form-label">Incident Categories</span>
            <div class="category-grid">
              {#each categories as cat}
                <button
                  type="button"
                  class="category-option {newAlert.categories.includes(cat.value) ? 'selected' : ''}"
                  style={newAlert.categories.includes(cat.value) ? `background: ${cat.color}20; border-color: ${cat.color}; color: ${cat.color};` : ''}
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
          
          <!-- Severity Levels -->
          <div class="form-group">
            <span class="form-label">Severity Levels</span>
            <div class="severity-options">
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
            Create Alert
          </button>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Safety Tips Banner -->
  <div class="safety-banner">
    <Shield size={20} />
    <div>
      <strong>Stay protected</strong> - Customize your alert zones to receive real-time notifications about incidents near you.
    </div>
  </div>
</div>

<style>
  .alerts-page {
    min-height: 100vh;
    background: #f9fafb;
    padding: 2rem;
  }
  
  .alerts-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Header */
  .page-header {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: var(--gray-color);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }
  
  .back-button:hover {
    background: var(--primary-bg);
    color: var(--primary-color);
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }
  
  .header-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .header-icon svg {
    color: white;
  }
  
  .header-content h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 0.25rem;
  }
  
  .header-content p {
    font-size: 0.875rem;
    color: var(--gray-color);
  }
  
  .create-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .create-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  /* Loading State */
  .loading-state {
    text-align: center;
    padding: 4rem;
    color: var(--gray-color);
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--primary-bg);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
  }
  
  .stat-info {
    flex: 1;
  }
  
  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark-color);
  }
  
  .stat-label {
    font-size: 0.813rem;
    color: var(--gray-color);
  }
  
  /* Alerts List */
  .alerts-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 1rem;
  }
  
  .empty-state svg {
    color: var(--gray-color);
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .empty-state h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }
  
  .empty-state p {
    color: var(--gray-color);
    margin-bottom: 1.5rem;
  }
  
  .empty-create-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  
  /* Alert Card */
  .alert-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s;
  }
  
  .alert-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .alert-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .alert-title {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .alert-icon {
    width: 36px;
    height: 36px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .alert-title h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 0.25rem;
  }
  
  .alert-meta {
    display: flex;
    gap: 0.75rem;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.688rem;
    color: var(--gray-color);
  }
  
  .alert-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  /* Toggle Switch */
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }
  
  .toggle-switch input {
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
    background-color: #ccc;
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
    padding: 0.25rem;
    color: var(--gray-color);
    border-radius: 0.25rem;
    transition: all 0.2s;
  }
  
  .delete-btn:hover {
    color: var(--danger-color);
    background: #fef2f2;
  }
  
  .alert-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .detail-section {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .detail-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--dark-color);
    min-width: 100px;
  }
  
  .category-tags, .severity-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .category-tag, .severity-tag {
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.688rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .stats {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .stat-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.688rem;
    color: var(--gray-color);
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    border-radius: 1rem;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .modal-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--dark-color);
  }
  
  .modal-close {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gray-color);
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }
  
  /* Form Elements */
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }
  
  .form-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }
  
  .form-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  .form-hint {
    font-size: 0.688rem;
    color: var(--gray-color);
    margin-top: 0.25rem;
  }
  
  .radius-input {
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
    min-width: 60px;
  }
  
  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
  }
  
  .category-option, .severity-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--light-color);
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.813rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .category-option.selected, .severity-option.selected {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }
  
  .severity-options {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .btn-primary, .btn-secondary {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background: var(--primary-color);
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background: var(--primary-dark);
  }
  
  .btn-secondary {
    background: none;
    border: 1px solid #e5e7eb;
    color: var(--gray-color);
  }
  
  .btn-secondary:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
  
  /* Safety Banner */
  .safety-banner {
    margin-top: 2rem;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, var(--primary-bg), white);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.813rem;
    color: var(--dark-color);
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (max-width: 768px) {
    .alerts-page {
      padding: 1rem;
    }
    
    .page-header {
      flex-direction: column;
      align-items: stretch;
    }
    
    .create-btn {
      justify-content: center;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .category-grid {
      grid-template-columns: 1fr;
    }
    
    .detail-section {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .detail-label {
      min-width: auto;
    }
  }
</style>