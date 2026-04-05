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
    Compass,
    Menu,
    Zap,
    Activity,
    Radio
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
  let userLocation = $state<{ lat: number; lng: number } | null>(null);
  
  const categories = [
    { value: 'suspicious', label: 'Suspicious', color: '#F59E0B', bg: '#FEF3C7', icon: AlertTriangle },
    { value: 'theft', label: 'Theft', color: '#EF4444', bg: '#FEE2E2', icon: AlertOctagon },
    { value: 'vandalism', label: 'Vandalism', color: '#F97316', bg: '#FFEDD5', icon: Building },
    { value: 'fire', label: 'Fire', color: '#DC2626', bg: '#FEE2E2', icon: Flame },
    { value: 'accident', label: 'Accident', color: '#F59E0B', bg: '#FEF3C7', icon: Car },
    { value: 'noise', label: 'Noise', color: '#8B5CF6', bg: '#EDE9FE', icon: Volume2 }
  ];
  
  const severityLevels = [
    { value: 'low', label: 'Low', color: '#10B981', bg: '#D1FAE5', description: 'Non-urgent' },
    { value: 'medium', label: 'Medium', color: '#F59E0B', bg: '#FEF3C7', description: 'Caution advised' },
    { value: 'high', label: 'High', color: '#F97316', bg: '#FFEDD5', description: 'Urgent' },
    { value: 'critical', label: 'Critical', color: '#EF4444', bg: '#FEE2E2', description: 'Emergency' }
  ];
  
  onMount(async () => {
    await loadIncidents();
    getCurrentLocation();
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
  
  function getCategoryBg(category: string) {
    return categories.find(c => c.value === category)?.bg || '#F3F4F6';
  }
  
  function getSeverityColor(severity: string) {
    return severityLevels.find(s => s.value === severity)?.color || '#6B7280';
  }
  
  function getSeverityBg(severity: string) {
    return severityLevels.find(s => s.value === severity)?.bg || '#F3F4F6';
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
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
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
    
    if (minutes < 1) return 'Just now';
    if (hours < 1) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  }
  
  function getActiveCount() {
    return getFilteredIncidents().filter(i => i.isLive).length;
  }
</script>

<svelte:head>
  <title>Live Incident Map - Lezie</title>
</svelte:head>

<div class="map-page">
  <!-- Modern Header -->
  <header class="map-header">
    <div class="header-container">
      <div class="header-left">
        <button class="back-btn" onclick={() => goto('/dashboard')}>
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <div class="header-title">
          <div class="title-icon">
            <MapPin size={18} />
          </div>
          <h1>Incident Map</h1>
        </div>
      </div>

      <div class="header-right">
        <div class="search-wrapper">
          <Search size={16} class="search-icon" />
          <input
            type="text"
            placeholder="Search incidents..."
            bind:value={searchQuery}
            class="search-input"
          />
          {#if searchQuery}
            <button class="search-clear" onclick={() => searchQuery = ''}>
              <X size={14} />
            </button>
          {/if}
        </div>
        
        <button class="filter-btn" onclick={() => showFilters = !showFilters}>
          <Filter size={16} />
          <span>Filter</span>
        </button>
        
        <button class="location-btn" onclick={getCurrentLocation} title="My location">
          <Navigation size={16} />
        </button>
      </div>
    </div>
  </header>

  <!-- Filter Drawer -->
  {#if showFilters}
    <div class="filter-drawer">
      <div class="filter-drawer-header">
        <h3>Filter Incidents</h3>
        <button class="close-filter" onclick={() => showFilters = false}>
          <X size={18} />
        </button>
      </div>
      <div class="filter-drawer-content">
        <div class="filter-section">
          <label>Categories</label>
          <div class="filter-chips">
            {#each categories as cat}
              <button
                class="filter-chip {filters.categories.includes(cat.value) ? 'active' : ''}"
                style={filters.categories.includes(cat.value) ? `background: ${cat.color}; border-color: ${cat.color}; color: white;` : ''}
                onclick={() => toggleCategory(cat.value)}
              >
                <svelte:component this={cat.icon} size={12} />
                {cat.label}
              </button>
            {/each}
          </div>
        </div>
        
        <div class="filter-section">
          <label>Severity</label>
          <div class="filter-chips">
            {#each severityLevels as level}
              <button
                class="filter-chip {filters.severity.includes(level.value) ? 'active' : ''}"
                style={filters.severity.includes(level.value) ? `background: ${level.color}; border-color: ${level.color}; color: white;` : ''}
                onclick={() => toggleSeverity(level.value)}
              >
                {level.label}
              </button>
            {/each}
          </div>
        </div>
        
        <div class="filter-section">
          <label>Date Range</label>
          <div class="filter-chips">
            <button class="filter-chip {filters.dateRange === 'day' ? 'active' : ''}" onclick={() => filters.dateRange = 'day'}>Today</button>
            <button class="filter-chip {filters.dateRange === 'week' ? 'active' : ''}" onclick={() => filters.dateRange = 'week'}>This Week</button>
            <button class="filter-chip {filters.dateRange === 'month' ? 'active' : ''}" onclick={() => filters.dateRange = 'month'}>This Month</button>
          </div>
        </div>
        
        <button class="clear-filters" onclick={clearFilters}>
          Clear all filters
        </button>
      </div>
    </div>
  {/if}

  <!-- Main Content -->
  <div class="map-content">
    <!-- Map Area -->
    <div class="map-area">
      {#if isLoading}
        <div class="map-loading">
          <div class="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      {:else}
        <div class="map-container">
          <!-- Map Grid Background -->
          <div class="map-grid">
            <!-- Map Markers -->
            {#each getFilteredIncidents() as incident}
              <button 
                class="map-marker"
                style="left: {((incident.lng + 74.02) / 0.04) * 100}%; top: {((40.73 - incident.lat) / 0.04) * 100}%"
                onclick={() => selectedIncident = incident}
              >
                <div class="marker-outer" style="background: {getSeverityColor(incident.severity)}20;">
                  <div class="marker-inner" style="background: {getSeverityColor(incident.severity)};">
                    <svelte:component this={getCategoryIcon(incident.category)} size={10} />
                  </div>
                </div>
                <div class="marker-pulse" style="background: {getSeverityColor(incident.severity)};"></div>
              </button>
            {/each}
          </div>
          
          <!-- Map Overlay Controls -->
          <div class="map-overlay">
            <div class="live-stats">
              <span class="live-dot"></span>
              <span>{getActiveCount()} active incidents</span>
            </div>
            <div class="map-controls">
              <button class="map-control" onclick={() => getCurrentLocation()}>
                <Compass size={14} />
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Incidents Sidebar -->
    <div class="incidents-sidebar">
      <div class="sidebar-header">
        <div>
          <h3>Recent Reports</h3>
          <p>{getFilteredIncidents().length} incidents nearby</p>
        </div>
        <div class="live-indicator">
          <Radio size={12} />
          <span>Live feed</span>
        </div>
      </div>

      <div class="incidents-list">
        {#if getFilteredIncidents().length === 0}
          <div class="empty-incidents">
            <div class="empty-icon">
              <AlertTriangle size={40} />
            </div>
            <h4>No incidents found</h4>
            <p>Try adjusting your filters</p>
            <button class="empty-clear" onclick={clearFilters}>Clear filters</button>
          </div>
        {:else}
          {#each getFilteredIncidents() as incident}
            <div 
              class="incident-card {selectedIncident?.id === incident.id ? 'selected' : ''}"
              onclick={() => selectedIncident = incident}
            >
              <div class="incident-status-bar" style="background: {getSeverityColor(incident.severity)};"></div>
              <div class="incident-card-content">
                <div class="incident-card-header">
                  <div class="incident-type">
                    <div class="type-icon" style="background: {getCategoryBg(incident.category)};">
                      <svelte:component this={getCategoryIcon(incident.category)} size={12} style="color: {getCategoryColor(incident.category)};" />
                    </div>
                    <h4>{incident.title}</h4>
                  </div>
                  {#if incident.isLive}
                    <span class="live-badge">LIVE</span>
                  {/if}
                </div>
                <p class="incident-description">{incident.description}</p>
                <div class="incident-meta">
                  <span class="meta-time">
                    <Clock size={10} />
                    {formatTime(incident.time)}
                  </span>
                  <span class="meta-witnesses">
                    <Users size={10} />
                    {incident.witnesses} witnesses
                  </span>
                </div>
                <div class="incident-tags">
                  <span class="category-tag" style="background: {getCategoryBg(incident.category)}; color: {getCategoryColor(incident.category)};">
                    {incident.category}
                  </span>
                  <span class="severity-tag" style="background: {getSeverityBg(incident.severity)}; color: {getSeverityColor(incident.severity)};">
                    {incident.severity}
                  </span>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>

  <!-- Incident Detail Modal -->
  {#if selectedIncident}
    <div class="modal-overlay" onclick={() => selectedIncident = null}>
      <div class="incident-modal" onclick={(e) => e.stopPropagation()}>
        <button class="modal-close" onclick={() => selectedIncident = null}>
          <X size={18} />
        </button>
        
        <div class="modal-header">
          <div class="modal-type-icon" style="background: {getCategoryBg(selectedIncident.category)};">
            <svelte:component this={getCategoryIcon(selectedIncident.category)} size={20} style="color: {getCategoryColor(selectedIncident.category)};" />
          </div>
          <div>
            <h2>{selectedIncident.title}</h2>
            <div class="modal-status">
              <span class="status-dot" style="background: {getSeverityColor(selectedIncident.severity)};"></span>
              <span>{selectedIncident.severity.toUpperCase()} severity</span>
            </div>
          </div>
        </div>
        
        <div class="modal-body">
          <p class="modal-description">{selectedIncident.description}</p>
          
          <div class="modal-details">
            <div class="detail-item">
              <MapPin size={14} />
              <span>Location: {selectedIncident.lat.toFixed(4)}, {selectedIncident.lng.toFixed(4)}</span>
            </div>
            <div class="detail-item">
              <Clock size={14} />
              <span>Reported: {formatTime(selectedIncident.time)}</span>
            </div>
            <div class="detail-item">
              <Users size={14} />
              <span>{selectedIncident.witnesses} community witnesses</span>
            </div>
            <div class="detail-item">
              <Activity size={14} />
              <span>{selectedIncident.updates} status updates</span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" onclick={() => selectedIncident = null}>
            Close
          </button>
          <button class="btn-primary" onclick={() => goto(`/incident/${selectedIncident.id}`)}>
            View Full Report
            <ChevronLeft size={14} class="rotate" />
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .map-page {
    min-height: 100vh;
    background: #F8FAFC;
  }

  /* Header */
  .map-header {
    background: white;
    border-bottom: 1px solid #E5E7EB;
    position: sticky;
    top: 0;
    z-index: 20;
    padding: 0.75rem 1.5rem;
  }

  .header-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background: none;
    border: none;
    color: #64748B;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .back-btn:hover {
    background: #F1F5F9;
    color: var(--primary-color);
  }

  .title-icon {
    width: 32px;
    height: 32px;
    background: var(--primary-bg);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .header-title h1 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #0F172A;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .search-wrapper {
    position: relative;
    width: 280px;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94A3B8;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 2.25rem;
    background: #F8FAFC;
    border: 1px solid #E5E7EB;
    border-radius: 0.75rem;
    font-size: 0.813rem;
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
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #94A3B8;
    padding: 2px;
  }

  .filter-btn, .location-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    background: #F8FAFC;
    border: 1px solid #E5E7EB;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-btn:hover, .location-btn:hover {
    background: white;
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  /* Filter Drawer */
  .filter-drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 320px;
    height: 100vh;
    background: white;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
    z-index: 50;
    display: flex;
    flex-direction: column;
    animation: slideInRight 0.3s ease;
  }

  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  .filter-drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #F1F5F9;
  }

  .filter-drawer-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #0F172A;
  }

  .close-filter {
    background: none;
    border: none;
    cursor: pointer;
    color: #94A3B8;
    padding: 0.25rem;
  }

  .filter-drawer-content {
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
    color: #475569;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .filter-chip {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.875rem;
    background: #F8FAFC;
    border: 1px solid #E5E7EB;
    border-radius: 2rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-chip.active {
    color: white;
  }

  .clear-filters {
    width: 100%;
    padding: 0.75rem;
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 500;
    color: #DC2626;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.2s;
  }

  .clear-filters:hover {
    background: #FEE2E2;
  }

  /* Map Content */
  .map-content {
    display: flex;
    height: calc(100vh - 73px);
  }

  /* Map Area */
  .map-area {
    flex: 1;
    position: relative;
    background: #F1F5F9;
  }

  .map-loading {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: white;
  }

  .loading-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #E2E8F0;
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .map-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .map-grid {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #F5F3FF 0%, #FFFFFF 100%);
    background-image: 
      linear-gradient(#E2E8F0 1px, transparent 1px),
      linear-gradient(90deg, #E2E8F0 1px, transparent 1px);
    background-size: 50px 50px;
    position: relative;
  }

  /* Map Markers */
  .map-marker {
    position: absolute;
    transform: translate(-50%, -50%);
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10;
    padding: 0;
  }

  .marker-outer {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
  }

  .marker-inner {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .marker-inner svg {
    color: white;
  }

  .map-marker:hover .marker-outer {
    transform: scale(1.1);
  }

  .marker-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    opacity: 0.4;
    animation: markerPulse 2s infinite;
    z-index: -1;
  }

  @keyframes markerPulse {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.5; }
    100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
  }

  /* Map Overlay */
  .map-overlay {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
  }

  .live-stats {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
    pointer-events: auto;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    background: #10B981;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .map-controls {
    display: flex;
    gap: 0.5rem;
    pointer-events: auto;
  }

  .map-control {
    width: 36px;
    height: 36px;
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748B;
    transition: all 0.2s;
  }

  .map-control:hover {
    background: var(--primary-bg);
    color: var(--primary-color);
    border-color: var(--primary-color);
  }

  /* Incidents Sidebar */
  .incidents-sidebar {
    width: 380px;
    background: white;
    border-left: 1px solid #E5E7EB;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #F1F5F9;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .sidebar-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #0F172A;
    margin-bottom: 0.25rem;
  }

  .sidebar-header p {
    font-size: 0.75rem;
    color: #64748B;
  }

  .live-indicator {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background: #FEF2F2;
    padding: 0.375rem 0.75rem;
    border-radius: 2rem;
    font-size: 0.688rem;
    font-weight: 500;
    color: #DC2626;
  }

  /* Incidents List */
  .incidents-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .empty-incidents {
    text-align: center;
    padding: 3rem 1rem;
  }

  .empty-icon {
    width: 64px;
    height: 64px;
    background: #F1F5F9;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: #94A3B8;
  }

  .empty-incidents h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 0.25rem;
  }

  .empty-incidents p {
    font-size: 0.75rem;
    color: #64748B;
    margin-bottom: 1rem;
  }

  .empty-clear {
    padding: 0.5rem 1rem;
    background: #F1F5F9;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .incident-card {
    display: flex;
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 0.75rem;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
  }

  .incident-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: var(--primary-border);
  }

  .incident-card.selected {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(106, 44, 145, 0.12);
  }

  .incident-status-bar {
    width: 4px;
    flex-shrink: 0;
  }

  .incident-card-content {
    flex: 1;
    padding: 1rem;
  }

  .incident-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .incident-type {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .type-icon {
    width: 28px;
    height: 28px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .incident-type h4 {
    font-size: 0.813rem;
    font-weight: 600;
    color: #0F172A;
  }

  .live-badge {
    font-size: 0.563rem;
    font-weight: 700;
    padding: 0.125rem 0.5rem;
    background: #FEE2E2;
    color: #DC2626;
    border-radius: 1rem;
  }

  .incident-description {
    font-size: 0.688rem;
    color: #64748B;
    line-height: 1.4;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .incident-meta {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
    font-size: 0.625rem;
    color: #94A3B8;
  }

  .incident-meta span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .incident-tags {
    display: flex;
    gap: 0.5rem;
  }

  .category-tag, .severity-tag {
    font-size: 0.563rem;
    font-weight: 600;
    padding: 0.125rem 0.5rem;
    border-radius: 1rem;
    text-transform: capitalize;
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
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .incident-modal {
    background: white;
    border-radius: 1.5rem;
    width: 90%;
    max-width: 500px;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    animation: modalFadeIn 0.2s ease;
  }

  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #F1F5F9;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748B;
    z-index: 1;
  }

  .modal-header {
    display: flex;
    gap: 1rem;
    padding: 1.5rem 1.5rem 0;
  }

  .modal-type-icon {
    width: 48px;
    height: 48px;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-header h2 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 0.25rem;
  }

  .modal-status {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .modal-status span {
    font-size: 0.688rem;
    font-weight: 600;
    color: #64748B;
  }

  .modal-body {
    padding: 1rem 1.5rem;
  }

  .modal-description {
    font-size: 0.813rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .modal-details {
    background: #F8FAFC;
    border-radius: 0.75rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #64748B;
  }

  .modal-footer {
    padding: 1rem 1.5rem 1.5rem;
    display: flex;
    gap: 0.75rem;
  }

  .btn-primary, .btn-secondary {
    flex: 1;
    padding: 0.625rem;
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
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-primary:hover {
    background: var(--primary-dark);
  }

  .btn-secondary {
    background: none;
    border: 1px solid #E5E7EB;
    color: #64748B;
  }

  .btn-secondary:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  .rotate {
    transform: rotate(180deg);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .incidents-sidebar {
      width: 320px;
    }
  }

  @media (max-width: 768px) {
    .map-header {
      padding: 0.75rem 1rem;
    }

    .header-container {
      flex-direction: column;
      gap: 0.75rem;
    }

    .header-left {
      width: 100%;
      justify-content: space-between;
    }

    .header-right {
      width: 100%;
    }

    .search-wrapper {
      flex: 1;
    }

    .map-content {
      flex-direction: column;
    }

    .map-area {
      height: 50vh;
      min-height: 300px;
    }

    .incidents-sidebar {
      width: 100%;
      border-left: none;
      border-top: 1px solid #E5E7EB;
      max-height: 40vh;
    }

    .filter-drawer {
      width: 100%;
    }

    .incident-modal {
      width: calc(100% - 2rem);
      margin: 1rem;
    }
  }

  @media (max-width: 640px) {
    .header-right {
      flex-wrap: wrap;
    }

    .filter-btn span {
      display: none;
    }

    .filter-btn {
      padding: 0.5rem;
    }
  }
</style>