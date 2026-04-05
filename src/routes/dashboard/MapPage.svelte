<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    MapPin,
    X,
    AlertTriangle,
    Navigation,
    CheckCircle,
    AlertCircle,
    ChevronLeft,
    Flame,
    Car,
    Building,
    Volume2,
    MoreHorizontal,
    TrendingUp,
    AlertOctagon,
    Filter,
    Search,
    SlidersHorizontal,
    Clock,
    CircleDot,
    Users,
    Eye,
    Shield,
    Layers,
    Compass
  } from 'lucide-svelte';
  
  let isLoading = $state(true);
  let incidents = $state<any[]>([]);
  let filters = $state({
    categories: [] as string[],
    severity: [] as string[],
    dateRange: 'week'
  });
  let showFilters = $state(false);
  let searchQuery = $state('');
  let selectedIncident = $state<any>(null);
  let mapView = $state('default');
  let isMobileMenuOpen = $state(false);
  
  const categories = [
    { value: 'suspicious', label: 'Suspicious', color: '#F59E0B', icon: AlertTriangle },
    { value: 'theft', label: 'Theft', color: '#EF4444', icon: AlertOctagon },
    { value: 'vandalism', label: 'Vandalism', color: '#F97316', icon: Building },
    { value: 'fire', label: 'Fire', color: '#DC2626', icon: Flame },
    { value: 'accident', label: 'Accident', color: '#F59E0B', icon: Car },
    { value: 'noise', label: 'Noise', color: '#8B5CF6', icon: Volume2 }
  ];
  
  const severityLevels = [
    { value: 'low', label: 'Low', color: '#10B981', description: 'Non-urgent' },
    { value: 'medium', label: 'Medium', color: '#F59E0B', description: 'Caution advised' },
    { value: 'high', label: 'High', color: '#F97316', description: 'Urgent' },
    { value: 'critical', label: 'Critical', color: '#EF4444', description: 'Emergency' }
  ];
  
  onMount(async () => {
    await loadIncidents();
    isLoading = false;
  });
  
  async function loadIncidents() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    incidents = [
      {
        id: 1,
        title: 'Suspicious person near school',
        category: 'suspicious',
        severity: 'high',
        lat: 40.7128,
        lng: -74.0060,
        time: new Date().toISOString(),
        status: 'active',
        description: 'Person acting suspiciously near the elementary school.',
        witnesses: 3,
        updates: 2,
        isLive: true
      },
      {
        id: 2,
        title: 'Car break-in on Main St',
        category: 'theft',
        severity: 'medium',
        lat: 40.7140,
        lng: -74.0080,
        time: new Date(Date.now() - 3600000).toISOString(),
        status: 'investigating',
        description: 'Multiple cars broken into overnight.',
        witnesses: 5,
        updates: 1,
        isLive: false
      },
      {
        id: 3,
        title: 'Vandalism at park',
        category: 'vandalism',
        severity: 'low',
        lat: 40.7110,
        lng: -74.0040,
        time: new Date(Date.now() - 86400000).toISOString(),
        status: 'resolved',
        description: 'Graffiti on park equipment.',
        witnesses: 2,
        updates: 3,
        isLive: false
      },
      {
        id: 4,
        title: 'Fire reported downtown',
        category: 'fire',
        severity: 'critical',
        lat: 40.7150,
        lng: -74.0100,
        time: new Date(Date.now() - 7200000).toISOString(),
        status: 'active',
        description: 'Structure fire, emergency services on scene.',
        witnesses: 12,
        updates: 5,
        isLive: true
      }
    ];
  }
  
  function getCategoryColor(category: string) {
    return categories.find(c => c.value === category)?.color || '#6B7280';
  }
  
  function getSeverityColor(severity: string) {
    return severityLevels.find(s => s.value === severity)?.color || '#6B7280';
  }
  
  function getCategoryIcon(category: string) {
    const cat = categories.find(c => c.value === category);
    return cat?.icon || AlertTriangle;
  }
  
  function toggleCategory(category: string) {
    if (filters.categories.includes(category)) {
      filters.categories = filters.categories.filter(c => c !== category);
    } else {
      filters.categories = [...filters.categories, category];
    }
  }
  
  function toggleSeverity(severity: string) {
    if (filters.severity.includes(severity)) {
      filters.severity = filters.severity.filter(s => s !== severity);
    } else {
      filters.severity = [...filters.severity, severity];
    }
  }
  
  function clearFilters() {
    filters.categories = [];
    filters.severity = [];
    filters.dateRange = 'week';
    searchQuery = '';
  }
  
  function getFilteredIncidents() {
    let filtered = incidents;
    
    if (searchQuery) {
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filters.categories.length > 0) {
      filtered = filtered.filter(i => filters.categories.includes(i.category));
    }
    
    if (filters.severity.length > 0) {
      filtered = filtered.filter(i => filters.severity.includes(i.severity));
    }
    
    return filtered;
  }
  
  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('User location:', position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
        }
      );
    }
  }
  
  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours < 1) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return date.toLocaleDateString();
  }
</script>

<svelte:head>
  <title>Live Incident Map - Lezie</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="map-page">
  <!-- Mobile Header -->
  <header class="map-header">
    <div class="header-container">
      <div class="header-row">
        <button class="back-btn" onclick={() => goto('/dashboard')}>
          <ChevronLeft size={20} />
        </button>
        <div class="header-title">
          <MapPin size={18} />
          <h1>Live Map</h1>
        </div>
        <button class="menu-btn" onclick={() => isMobileMenuOpen = !isMobileMenuOpen}>
          <Filter size={18} />
        </button>
      </div>

      <!-- Search Bar - Full Width -->
      <div class="search-container">
        <div class="search-wrapper">
          <Search size={16} class="search-icon" />
          <input
            type="text"
            placeholder="Search incidents or locations..."
            bind:value={searchQuery}
            class="search-input"
          />
          {#if searchQuery}
            <button class="search-clear" onclick={() => searchQuery = ''}>
              <X size={14} />
            </button>
          {/if}
        </div>
        <button class="location-btn" onclick={getCurrentLocation}>
          <Navigation size={16} />
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Filter Drawer -->
  {#if isMobileMenuOpen}
    <div class="mobile-drawer-overlay" onclick={() => isMobileMenuOpen = false}>
      <div class="mobile-drawer" onclick={(e) => e.stopPropagation()}>
        <div class="drawer-header">
          <h3>Filters</h3>
          <button class="close-drawer" onclick={() => isMobileMenuOpen = false}>
            <X size={20} />
          </button>
        </div>
        <div class="drawer-content">
          <div class="filter-group">
            <label>Categories</label>
            <div class="filter-chips">
              {#each categories as cat}
                <button
                  class="chip {filters.categories.includes(cat.value) ? 'active' : ''}"
                  style={filters.categories.includes(cat.value) ? `background: ${cat.color}; border-color: ${cat.color};` : ''}
                  onclick={() => toggleCategory(cat.value)}
                >
                  <svelte:component this={cat.icon} size={12} />
                  {cat.label}
                </button>
              {/each}
            </div>
          </div>
          <div class="filter-group">
            <label>Severity</label>
            <div class="filter-chips">
              {#each severityLevels as level}
                <button
                  class="chip {filters.severity.includes(level.value) ? 'active' : ''}"
                  style={filters.severity.includes(level.value) ? `background: ${level.color}; border-color: ${level.color};` : ''}
                  onclick={() => toggleSeverity(level.value)}
                >
                  {level.label}
                </button>
              {/each}
            </div>
          </div>
          <div class="filter-group">
            <label>Date Range</label>
            <div class="filter-chips">
              <button class="chip {filters.dateRange === 'day' ? 'active' : ''}" onclick={() => filters.dateRange = 'day'}>Today</button>
              <button class="chip {filters.dateRange === 'week' ? 'active' : ''}" onclick={() => filters.dateRange = 'week'}>This Week</button>
              <button class="chip {filters.dateRange === 'month' ? 'active' : ''}" onclick={() => filters.dateRange = 'month'}>This Month</button>
            </div>
          </div>
          <button class="clear-filters-btn" onclick={clearFilters}>Clear All Filters</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Main Map Layout -->
  <div class="map-layout">
    <!-- Map Canvas -->
    <div class="map-canvas">
      {#if isLoading}
        <div class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>Loading map data...</p>
        </div>
      {/if}

      <div class="map-grid">
        {#each getFilteredIncidents() as incident}
          <button 
            class="map-marker"
            style="left: {((incident.lng + 74.02) / 0.04) * 100}%; top: {((40.73 - incident.lat) / 0.04) * 100}%"
            onclick={() => selectedIncident = incident}
          >
            <div class="marker-dot" style="background: {getSeverityColor(incident.severity)}">
              <svelte:component this={getCategoryIcon(incident.category)} size={10} />
            </div>
            <div class="marker-pulse" style="background: {getSeverityColor(incident.severity)}"></div>
          </button>
        {/each}

        <div class="map-stats">
          <div class="stats-badge">
            <span class="stats-dot"></span>
            <span>{getFilteredIncidents().length} active</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Incidents List -->
    <div class="incidents-panel">
      <div class="panel-header">
        <h3>Recent Reports</h3>
        <span class="incident-count">{getFilteredIncidents().length} incidents</span>
      </div>

      <div class="incidents-list">
        {#if getFilteredIncidents().length === 0}
          <div class="empty-state">
            <AlertTriangle size={40} />
            <h4>No incidents found</h4>
            <button class="clear-btn" onclick={clearFilters}>Clear filters</button>
          </div>
        {:else}
          {#each getFilteredIncidents() as incident}
            <div 
              class="incident-item"
              onclick={() => selectedIncident = incident}
            >
              <div class="incident-status" style="background: {getSeverityColor(incident.severity)}"></div>
              <div class="incident-details">
                <div class="incident-header">
                  <div class="incident-title">
                    <svelte:component this={getCategoryIcon(incident.category)} size={14} style="color: {getCategoryColor(incident.category)}" />
                    <h4>{incident.title}</h4>
                  </div>
                  {#if incident.isLive}
                    <span class="live-tag">LIVE</span>
                  {/if}
                </div>
                <p class="incident-desc">{incident.description}</p>
                <div class="incident-footer">
                  <span class="time">{formatTime(incident.time)}</span>
                  <button class="view-btn" onclick={(e) => { e.stopPropagation(); goto(`/incident/${incident.id}`); }}>
                    Details →
                  </button>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <!-- Incident Popup -->
    {#if selectedIncident}
      <div class="popup-overlay" onclick={() => selectedIncident = null}>
        <div class="incident-popup" onclick={(e) => e.stopPropagation()}>
          <button class="popup-close" onclick={() => selectedIncident = null}>
            <X size={18} />
          </button>
          <div class="popup-header">
            <svelte:component this={getCategoryIcon(selectedIncident.category)} size={20} style="color: {getCategoryColor(selectedIncident.category)}" />
            <h4>{selectedIncident.title}</h4>
          </div>
          <div class="popup-tags">
            <span class="category-tag" style="background: {getCategoryColor(selectedIncident.category)}20; color: {getCategoryColor(selectedIncident.category)}">
              {selectedIncident.category}
            </span>
            <span class="severity-tag" style="color: {getSeverityColor(selectedIncident.severity)}">
              {selectedIncident.severity}
            </span>
          </div>
          <p class="popup-desc">{selectedIncident.description}</p>
          <div class="popup-meta">
            <span><Clock size={12} /> {formatTime(selectedIncident.time)}</span>
            <span><Users size={12} /> {selectedIncident.witnesses} witnesses</span>
          </div>
          <button class="full-details-btn" onclick={() => goto(`/incident/${selectedIncident.id}`)}>
            View Full Details →
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .map-page {
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  /* Header Styles */
  .map-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 30;
    padding: 0.75rem 1rem;
  }

  .header-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .back-btn, .menu-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    color: #475569;
    transition: all 0.2s;
  }

  .back-btn:active, .menu-btn:active {
    background: #e2e8f0;
    transform: scale(0.95);
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .header-title svg {
    color: var(--primary-color);
  }

  .header-title h1 {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  /* Search Container */
  .search-container {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .search-wrapper {
    flex: 1;
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    height: 44px;
    padding: 0 1rem 0 2.5rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 0.875rem;
    font-family: inherit;
    transition: all 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--primary-color);
    background: white;
    box-shadow: 0 0 0 3px rgba(106, 44, 145, 0.1);
  }

  .search-clear {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 4px;
    display: flex;
  }

  .location-btn {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    color: #475569;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .location-btn:active {
    background: #e2e8f0;
    transform: scale(0.95);
  }

  /* Mobile Drawer */
  .mobile-drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    justify-content: flex-end;
  }

  .mobile-drawer {
    width: 85%;
    max-width: 320px;
    height: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .drawer-header h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #0f172a;
  }

  .close-drawer {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 8px;
    display: flex;
  }

  .drawer-content {
    flex: 1;
    padding: 1.25rem;
    overflow-y: auto;
  }

  .filter-group {
    margin-bottom: 1.5rem;
  }

  .filter-group label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .chip {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 40px;
    font-size: 0.75rem;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
  }

  .chip:active {
    transform: scale(0.96);
  }

  .chip.active {
    color: white;
  }

  .clear-filters-btn {
    width: 100%;
    padding: 0.875rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #dc2626;
    cursor: pointer;
    margin-top: 1rem;
  }

  .clear-filters-btn:active {
    background: #fee2e2;
  }

  /* Map Layout */
  .map-layout {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 125px);
  }

  .map-canvas {
    height: 45vh;
    min-height: 300px;
    position: relative;
    overflow: hidden;
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    z-index: 10;
  }

  .loading-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #e2e8f0;
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .map-grid {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);
    background-image: 
      linear-gradient(#e2e8f0 1px, transparent 1px),
      linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
    background-size: 40px 40px;
    position: relative;
  }

  .map-marker {
    position: absolute;
    transform: translate(-50%, -50%);
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10;
    padding: 0;
  }

  .marker-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s;
  }

  .marker-dot svg {
    color: white;
  }

  .map-marker:active .marker-dot {
    transform: scale(1.15);
  }

  .marker-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    opacity: 0.4;
    animation: pulse 2s infinite;
    z-index: -1;
  }

  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.5; }
    100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
  }

  .map-stats {
    position: absolute;
    bottom: 12px;
    left: 12px;
    right: 12px;
    display: flex;
    justify-content: center;
  }

  .stats-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    padding: 0.5rem 1rem;
    border-radius: 40px;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
  }

  .stats-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

  /* Incidents Panel */
  .incidents-panel {
    flex: 1;
    background: white;
    border-top: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .panel-header {
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .panel-header h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }

  .incident-count {
    font-size: 0.688rem;
    color: #64748b;
    background: #f1f5f9;
    padding: 0.25rem 0.5rem;
    border-radius: 20px;
  }

  .incidents-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #64748b;
  }

  .empty-state svg {
    margin-bottom: 0.75rem;
    opacity: 0.5;
  }

  .empty-state h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 0.5rem;
  }

  .clear-btn {
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    border: none;
    border-radius: 8px;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .incident-item {
    display: flex;
    gap: 0.75rem;
    padding: 0.875rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .incident-item:active {
    transform: scale(0.99);
    background: #fafafa;
  }

  .incident-status {
    width: 4px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .incident-details {
    flex: 1;
    min-width: 0;
  }

  .incident-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .incident-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .incident-title h4 {
    font-size: 0.813rem;
    font-weight: 600;
    color: #0f172a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .live-tag {
    font-size: 0.563rem;
    font-weight: 700;
    padding: 0.125rem 0.5rem;
    background: #fee2e2;
    color: #dc2626;
    border-radius: 12px;
    flex-shrink: 0;
  }

  .incident-desc {
    font-size: 0.688rem;
    color: #64748b;
    line-height: 1.4;
    margin-bottom: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .incident-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .time {
    font-size: 0.625rem;
    color: #94a3b8;
  }

  .view-btn {
    background: none;
    border: none;
    font-size: 0.625rem;
    font-weight: 500;
    color: var(--primary-color);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
  }

  /* Popup */
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .incident-popup {
    width: 100%;
    max-width: 400px;
    background: white;
    border-radius: 24px 24px 0 0;
    padding: 1.25rem;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .popup-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #f1f5f9;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
  }

  .popup-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    padding-right: 2rem;
  }

  .popup-header h4 {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
  }

  .popup-tags {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .category-tag, .severity-tag {
    font-size: 0.625rem;
    font-weight: 600;
    padding: 0.25rem 0.625rem;
    border-radius: 20px;
    text-transform: capitalize;
  }

  .popup-desc {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .popup-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.688rem;
    color: #94a3b8;
    margin-bottom: 1.25rem;
  }

  .popup-meta span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .full-details-btn {
    width: 100%;
    padding: 0.75rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 0.813rem;
    font-weight: 600;
    cursor: pointer;
  }

  .full-details-btn:active {
    background: var(--primary-dark);
    transform: scale(0.98);
  }

  /* Tablet and Desktop Adjustments */
  @media (min-width: 768px) {
    .map-layout {
      flex-direction: row;
      height: calc(100vh - 80px);
    }

    .map-canvas {
      flex: 1;
      height: auto;
    }

    .incidents-panel {
      width: 360px;
      border-top: none;
      border-left: 1px solid #e2e8f0;
    }

    .popup-overlay {
      align-items: center;
    }

    .incident-popup {
      border-radius: 24px;
      width: 360px;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  }

  @media (min-width: 1024px) {
    .incidents-panel {
      width: 400px;
    }
  }
</style>