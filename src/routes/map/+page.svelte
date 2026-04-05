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
  let mapView = $state('default'); // 'default', 'heatmap', 'clusters'
  
  const categories = [
    { value: 'suspicious', label: 'Suspicious', color: '#F59E0B', icon: AlertTriangle, gradient: 'from-amber-500/10 to-amber-500/5' },
    { value: 'theft', label: 'Theft', color: '#EF4444', icon: AlertOctagon, gradient: 'from-red-500/10 to-red-500/5' },
    { value: 'vandalism', label: 'Vandalism', color: '#F97316', icon: Building, gradient: 'from-orange-500/10 to-orange-500/5' },
    { value: 'fire', label: 'Fire', color: '#DC2626', icon: Flame, gradient: 'from-rose-600/10 to-rose-600/5' },
    { value: 'accident', label: 'Accident', color: '#F59E0B', icon: Car, gradient: 'from-amber-500/10 to-amber-500/5' },
    { value: 'noise', label: 'Noise', color: '#8B5CF6', icon: Volume2, gradient: 'from-purple-500/10 to-purple-500/5' }
  ];
  
  const severityLevels = [
    { value: 'low', label: 'Low', color: '#10B981', description: 'Non-urgent', icon: CircleDot },
    { value: 'medium', label: 'Medium', color: '#F59E0B', description: 'Caution advised', icon: AlertCircle },
    { value: 'high', label: 'High', color: '#F97316', description: 'Urgent', icon: AlertTriangle },
    { value: 'critical', label: 'Critical', color: '#EF4444', description: 'Emergency', icon: AlertOctagon }
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
        description: 'Person acting suspiciously near the elementary school. Please avoid the area.',
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
        description: 'Multiple cars broken into overnight. Police are investigating.',
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
        description: 'Graffiti on park equipment. Cleanup in progress.',
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
        description: 'Structure fire, emergency services on scene. Avoid the area.',
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
    
    if (hours < 1) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return date.toLocaleDateString();
  }
</script>

<svelte:head>
  <title>Live Incident Map - Lezie</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="map-page">
  <!-- Modern Header with Glassmorphism -->
  <header class="map-header">
    <div class="header-container">
      <div class="header-left">
        <button class="nav-button" onclick={() => goto('/dashboard')} aria-label="Go back">
          <ChevronLeft size={20} />
          <span>Dashboard</span>
        </button>
        <div class="brand-badge">
          <MapPin size={18} />
          <h1>Live Incident Map</h1>
        </div>
      </div>

      <div class="header-right">
        <div class="search-wrapper">
          <Search size={18} class="search-icon" />
          <input
            type="text"
            placeholder="Search incidents, locations..."
            bind:value={searchQuery}
            class="search-input"
          />
          {#if searchQuery}
            <button class="search-clear" onclick={() => searchQuery = ''}>
              <X size={14} />
            </button>
          {/if}
        </div>

        <div class="action-buttons">
          <button class="icon-button" onclick={() => showFilters = !showFilters} class:active={showFilters}>
            <SlidersHorizontal size={18} />
          </button>
          <button class="icon-button" onclick={getCurrentLocation}>
            <Navigation size={18} />
          </button>
        </div>
      </div>
    </div>
  </header>

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
        <!-- Map markers -->
        {#each getFilteredIncidents() as incident}
          <button 
            class="map-marker"
            style="left: {((incident.lng + 74.02) / 0.04) * 100}%; top: {((40.73 - incident.lat) / 0.04) * 100}%"
            onclick={() => selectedIncident = incident}
            aria-label={`View ${incident.title} details`}
          >
            <div class="marker-dot" style="background: {getSeverityColor(incident.severity)}">
              <svelte:component this={getCategoryIcon(incident.category)} size={8} />
            </div>
            <div class="marker-pulse" style="background: {getSeverityColor(incident.severity)}"></div>
          </button>
        {/each}

        <!-- Map overlay controls -->
        <div class="map-controls">
          <div class="view-toggle">
            <button class="view-btn {mapView === 'default' ? 'active' : ''}" onclick={() => mapView = 'default'}>
              <Layers size={14} /> Default
            </button>
            <button class="view-btn {mapView === 'heatmap' ? 'active' : ''}" onclick={() => mapView = 'heatmap'}>
              <TrendingUp size={14} /> Heatmap
            </button>
          </div>
          <div class="stats-badge">
            <div class="stats-dot"></div>
            <span>{getFilteredIncidents().length} active incidents</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Incidents Sidebar (Modern Card List) -->
    <aside class="incidents-sidebar">
      <div class="sidebar-header">
        <div>
          <h3>Recent Reports</h3>
          <p>{getFilteredIncidents().length} incidents in your area</p>
        </div>
        <div class="live-indicator">
          <span class="live-dot"></span>
          <span>Live feed</span>
        </div>
      </div>

      <div class="incidents-list">
        {#if getFilteredIncidents().length === 0}
          <div class="empty-state">
            <AlertTriangle size={40} />
            <h4>No incidents found</h4>
            <p>Try adjusting your filters or search query</p>
            <button class="clear-btn" onclick={clearFilters}>Clear all filters</button>
          </div>
        {:else}
          {#each getFilteredIncidents() as incident}
            <div 
              class="incident-card {selectedIncident?.id === incident.id ? 'selected' : ''}"
              onclick={() => selectedIncident = incident}
              role="button"
              tabindex="0"
            >
              <div class="card-status" style="background: {getSeverityColor(incident.severity)}"></div>
              <div class="card-content">
                <div class="card-header">
                  <div class="card-title">
                    <svelte:component this={getCategoryIcon(incident.category)} size={14} style="color: {getCategoryColor(incident.category)}" />
                    <h4>{incident.title}</h4>
                  </div>
                  {#if incident.isLive}
                    <span class="live-badge">LIVE</span>
                  {/if}
                </div>
                <p class="card-description">{incident.description}</p>
                <div class="card-meta">
                  <div class="meta-item">
                    <Clock size={12} />
                    <span>{formatTime(incident.time)}</span>
                  </div>
                  <div class="meta-item">
                    <Users size={12} />
                    <span>{incident.witnesses} witnesses</span>
                  </div>
                  <div class="meta-item">
                    <Eye size={12} />
                    <span>{incident.updates} updates</span>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="severity-badge" style="background: {getSeverityColor(incident.severity)}20; color: {getSeverityColor(incident.severity)}">
                    {incident.severity} severity
                  </span>
                  <button class="view-details" onclick={(e) => { e.stopPropagation(); goto(`/incident/${incident.id}`); }}>
                    Details <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </aside>

    <!-- Filters Drawer -->
    {#if showFilters}
      <div class="filters-drawer">
        <div class="drawer-header">
          <h3>Filter Incidents</h3>
          <button class="close-drawer" onclick={() => showFilters = false}>
            <X size={20} />
          </button>
        </div>

        <div class="drawer-content">
          <!-- Categories -->
          <div class="filter-section">
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

          <!-- Severity -->
          <div class="filter-section">
            <label>Severity Level</label>
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

          <!-- Date Range -->
          <div class="filter-section">
            <label>Date Range</label>
            <div class="filter-chips">
              <button class="chip {filters.dateRange === 'day' ? 'active' : ''}" onclick={() => filters.dateRange = 'day'}>Today</button>
              <button class="chip {filters.dateRange === 'week' ? 'active' : ''}" onclick={() => filters.dateRange = 'week'}>This Week</button>
              <button class="chip {filters.dateRange === 'month' ? 'active' : ''}" onclick={() => filters.dateRange = 'month'}>This Month</button>
            </div>
          </div>

          <button class="clear-all" onclick={clearFilters}>Clear all filters</button>
        </div>
      </div>
    {/if}

    <!-- Incident Detail Popup -->
    {#if selectedIncident}
      <div class="incident-popup" role="dialog">
        <button class="popup-close" onclick={() => selectedIncident = null}>
          <X size={18} />
        </button>
        <div class="popup-header">
          <svelte:component this={getCategoryIcon(selectedIncident.category)} size={20} style="color: {getCategoryColor(selectedIncident.category)}" />
          <h4>{selectedIncident.title}</h4>
        </div>
        <div class="popup-meta">
          <span class="popup-category" style="background: {getCategoryColor(selectedIncident.category)}20; color: {getCategoryColor(selectedIncident.category)}">
            {selectedIncident.category}
          </span>
          <span class="popup-severity" style="color: {getSeverityColor(selectedIncident.severity)}">
            {selectedIncident.severity} severity
          </span>
        </div>
        <p class="popup-description">{selectedIncident.description}</p>
        <div class="popup-stats">
          <div><Clock size={12} /> {formatTime(selectedIncident.time)}</div>
          <div><Users size={12} /> {selectedIncident.witnesses} witnesses</div>
        </div>
        <button class="popup-view" onclick={() => goto(`/incident/${selectedIncident.id}`)}>
          Full details →
        </button>
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

  /* Header */
  .map-header {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .header-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0.875rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-button:hover {
    background: #e2e8f0;
    color: var(--primary-color);
  }

  .brand-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .brand-badge svg {
    color: var(--primary-color);
  }

  .brand-badge h1 {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    max-width: 500px;
  }

  .search-wrapper {
    flex: 1;
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.625rem 2rem 0.625rem 2.5rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.875rem;
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
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 0.25rem;
    display: flex;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    color: #64748b;
  }

  .icon-button:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: white;
  }

  .icon-button.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }

  /* Map Layout */
  .map-layout {
    display: flex;
    height: calc(100vh - 70px);
    position: relative;
  }

  .map-canvas {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    z-index: 20;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
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
    background-size: 60px 60px;
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
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s;
  }

  .marker-dot svg {
    color: white;
  }

  .map-marker:hover .marker-dot {
    transform: scale(1.2);
  }

  .marker-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    opacity: 0.4;
    animation: pulse 2s infinite;
    z-index: -1;
  }

  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.6; }
    100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
  }

  .map-controls {
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
    right: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    pointer-events: none;
  }

  .view-toggle {
    display: flex;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    padding: 0.25rem;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    pointer-events: auto;
  }

  .view-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.875rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }

  .view-btn.active {
    background: var(--primary-color);
    color: white;
  }

  .stats-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
    pointer-events: auto;
  }

  .stats-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

  /* Incidents Sidebar */
  .incidents-sidebar {
    width: 380px;
    background: white;
    border-left: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .sidebar-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .sidebar-header h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
  }

  .sidebar-header p {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  .live-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #fef2f2;
    padding: 0.375rem 0.75rem;
    border-radius: 2rem;
    font-size: 0.688rem;
    font-weight: 600;
    color: #dc2626;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    background: #dc2626;
    border-radius: 50%;
    animation: pulse 1s infinite;
  }

  .incidents-list {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1.5rem;
    color: #64748b;
  }

  .empty-state svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-state h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    font-size: 0.75rem;
    margin-bottom: 1rem;
  }

  .clear-btn {
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .incident-card {
    display: flex;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
  }

  .incident-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: var(--primary-border);
  }

  .incident-card.selected {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(106, 44, 145, 0.12);
  }

  .card-status {
    width: 4px;
    flex-shrink: 0;
  }

  .card-content {
    flex: 1;
    padding: 1rem;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .card-title h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }

  .live-badge {
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.125rem 0.5rem;
    background: #fee2e2;
    color: #dc2626;
    border-radius: 1rem;
  }

  .card-description {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.4;
    margin-bottom: 0.75rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-meta {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.688rem;
    color: #94a3b8;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .severity-badge {
    font-size: 0.625rem;
    font-weight: 600;
    padding: 0.25rem 0.625rem;
    border-radius: 1rem;
    text-transform: capitalize;
  }

  .view-details {
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
    border-radius: 0.375rem;
    transition: background 0.2s;
  }

  .view-details:hover {
    background: #f5f3ff;
  }

  /* Filters Drawer */
  .filters-drawer {
    position: absolute;
    top: 0;
    left: 0;
    width: 320px;
    height: 100%;
    background: white;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
    z-index: 40;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .drawer-header h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
  }

  .close-drawer {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 0.25rem;
    display: flex;
  }

  .drawer-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .filter-section {
    margin-bottom: 1.5rem;
  }

  .filter-section label {
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
    padding: 0.375rem 0.875rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 2rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
  }

  .chip.active {
    color: white;
  }

  .clear-all {
    width: 100%;
    padding: 0.75rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 500;
    color: #dc2626;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.2s;
  }

  .clear-all:hover {
    background: #fee2e2;
  }

  /* Incident Popup */
  .incident-popup {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    width: 340px;
    background: white;
    border-radius: 1.25rem;
    padding: 1.25rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    z-index: 45;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .popup-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 0.25rem;
    display: flex;
  }

  .popup-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .popup-header h4 {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
  }

  .popup-meta {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .popup-category {
    font-size: 0.688rem;
    font-weight: 600;
    padding: 0.25rem 0.625rem;
    border-radius: 1rem;
    text-transform: capitalize;
  }

  .popup-severity {
    font-size: 0.688rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  .popup-description {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .popup-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.688rem;
    color: #94a3b8;
    margin-bottom: 1rem;
  }

  .popup-stats div {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .popup-view {
    width: 100%;
    padding: 0.625rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .popup-view:hover {
    background: var(--primary-dark);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .incidents-sidebar {
      width: 320px;
    }
  }

  @media (max-width: 768px) {
    .header-container {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
    }

    .header-right {
      max-width: 100%;
    }

    .map-layout {
      flex-direction: column;
      height: auto;
    }

    .map-canvas {
      height: 60vh;
      min-height: 400px;
    }

    .incidents-sidebar {
      width: 100%;
      border-left: none;
      border-top: 1px solid #e2e8f0;
      max-height: 400px;
    }

    .filters-drawer {
      width: 100%;
    }

    .incident-popup {
      width: calc(100% - 2rem);
      left: 1rem;
      right: 1rem;
      transform: none;
      bottom: 1rem;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  }

  @media (max-width: 480px) {
    .map-controls {
      flex-direction: column;
      align-items: flex-start;
    }

    .card-meta {
      flex-wrap: wrap;
    }
  }
</style>