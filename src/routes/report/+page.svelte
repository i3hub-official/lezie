//
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
    Layers,
    Compass,
    Crosshair,
    ZoomIn,
    ZoomOut
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
  let mapZoom = $state(14);
  let userLocation = $state<{ lat: number; lng: number; address: string } | null>(null);
  let isLocating = $state(false);
  
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
    await getUserFullLocation();
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
        isLive: true,
        address: '123 Main Street, Brooklyn, NY 11201',
        coordinates: { lat: 40.7128, lng: -74.0060 }
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
        isLive: false,
        address: '456 Oak Avenue, Brooklyn, NY 11215',
        coordinates: { lat: 40.7140, lng: -74.0080 }
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
        isLive: false,
        address: '789 Park Drive, Brooklyn, NY 11217',
        coordinates: { lat: 40.7110, lng: -74.0040 }
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
        isLive: true,
        address: '321 Commercial Street, Brooklyn, NY 11231',
        coordinates: { lat: 40.7150, lng: -74.0100 }
      }
    ];
  }
  
  async function getUserFullLocation() {
    if (!navigator.geolocation) return;
    
    isLocating = true;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const fullAddress = await reverseGeocode(latitude, longitude);
        userLocation = {
          lat: latitude,
          lng: longitude,
          address: fullAddress
        };
        isLocating = false;
      },
      (err) => {
        console.error('Geolocation error:', err);
        isLocating = false;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }
  
  async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'Lezie Safety App' } }
      );
      const data = await response.json();
      
      if (data.address) {
        const parts = [];
        if (data.address.road) parts.push(data.address.road);
        if (data.address.house_number) parts.unshift(data.address.house_number);
        if (data.address.suburb) parts.push(data.address.suburb);
        if (data.address.city || data.address.town) parts.push(data.address.city || data.address.town);
        if (data.address.state) parts.push(data.address.state);
        if (data.address.postcode) parts.push(data.address.postcode);
        if (data.address.country) parts.push(data.address.country);
        
        return parts.join(', ');
      }
      return data.display_name?.split(',')[0] || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }
  
  async function searchLocation(query: string) {
    if (!query.trim() || query.length < 3) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        { headers: { 'User-Agent': 'Lezie Safety App' } }
      );
      const results = await response.json();
      if (results.length > 0) {
        const result = results[0];
        userLocation = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: result.display_name
        };
      }
    } catch (err) {
      console.error('Location search error:', err);
    }
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
        i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.address?.toLowerCase().includes(searchQuery.toLowerCase())
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
  
  function zoomIn() { mapZoom = Math.min(mapZoom + 1, 20); }
  function zoomOut() { mapZoom = Math.max(mapZoom - 1, 3); }
</script>

<svelte:head>
  <title>Live Incident Map - Lezie</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="map-page">
  <!-- Header -->
  <header class="map-header">
    <div class="header-content">
      <button class="back-btn" onclick={() => goto('/dashboard')}>
        <ChevronLeft size={20} />
      </button>
      
      <div class="header-title">
        <MapPin size={20} />
        <h1>Live Map</h1>
      </div>
      
      <button class="filter-btn" onclick={() => showFilters = !showFilters}>
        <SlidersHorizontal size={20} />
      </button>
    </div>
    
    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-wrapper">
        <Search size={18} class="search-icon" />
        <input
          type="text"
          placeholder="Search address, incident, or location..."
          bind:value={searchQuery}
          class="search-input"
          onkeypress={(e) => { if (e.key === 'Enter') searchLocation(searchQuery); }}
        />
        {#if searchQuery}
          <button class="clear-search" onclick={() => searchQuery = ''}>
            <X size={16} />
          </button>
        {/if}
      </div>
      <button class="location-btn" onclick={getUserFullLocation} disabled={isLocating}>
        {#if isLocating}
          <div class="spinner-small"></div>
        {:else}
          <Crosshair size={18} />
        {/if}
      </button>
    </div>
    
    <!-- User Location Display -->
    {#if userLocation?.address}
      <div class="location-badge">
        <MapPin size={12} />
        <span>{userLocation.address.split(',')[0]}</span>
      </div>
    {/if}
  </header>

  <!-- Filter Drawer -->
  {#if showFilters}
    <div class="filter-overlay" onclick={() => showFilters = false}>
      <div class="filter-drawer" onclick={(e) => e.stopPropagation()}>
        <div class="filter-header">
          <h3>Filters</h3>
          <button class="close-filter" onclick={() => showFilters = false}>
            <X size={20} />
          </button>
        </div>
        <div class="filter-body">
          <div class="filter-group">
            <label>Categories</label>
            <div class="filter-chips">
              {#each categories as cat}
                <button
                  class="filter-chip {filters.categories.includes(cat.value) ? 'active' : ''}"
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
                  class="filter-chip {filters.severity.includes(level.value) ? 'active' : ''}"
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
              <button class="filter-chip {filters.dateRange === 'day' ? 'active' : ''}" onclick={() => filters.dateRange = 'day'}>Today</button>
              <button class="filter-chip {filters.dateRange === 'week' ? 'active' : ''}" onclick={() => filters.dateRange = 'week'}>This Week</button>
              <button class="filter-chip {filters.dateRange === 'month' ? 'active' : ''}" onclick={() => filters.dateRange = 'month'}>This Month</button>
            </div>
          </div>
          <button class="clear-filters" onclick={clearFilters}>Clear All</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Main Map Area -->
  <div class="map-container">
    <!-- Map Canvas -->
    <div class="map-wrapper">
      {#if isLoading}
        <div class="map-loading">
          <div class="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      {/if}
      
      <div class="map-canvas" style="--map-zoom: {mapZoom}">
        <div class="map-grid">
          <!-- User Location Marker -->
          {#if userLocation}
            <div class="user-marker" style="left: {((userLocation.lng + 74.02) / 0.04) * 100}%; top: {((40.73 - userLocation.lat) / 0.04) * 100}%">
              <div class="user-dot"></div>
              <div class="user-pulse"></div>
            </div>
          {/if}
          
          <!-- Incident Markers -->
          {#each getFilteredIncidents() as incident}
            <button 
              class="incident-marker"
              style="left: {((incident.lng + 74.02) / 0.04) * 100}%; top: {((40.73 - incident.lat) / 0.04) * 100}%"
              onclick={() => selectedIncident = incident}
            >
              <div class="marker-dot" style="background: {getSeverityColor(incident.severity)}">
                <svelte:component this={getCategoryIcon(incident.category)} size={10} />
              </div>
              {#if incident.isLive}
                <span class="live-indicator"></span>
              {/if}
            </button>
          {/each}
        </div>
        
        <!-- Map Controls -->
        <div class="map-controls">
          <button class="zoom-btn" onclick={zoomIn}>
            <ZoomIn size={18} />
          </button>
          <button class="zoom-btn" onclick={zoomOut}>
            <ZoomOut size={18} />
          </button>
        </div>
        
        <!-- Map Stats -->
        <div class="map-stats">
          <div class="stat-badge">
            <span class="stat-dot"></span>
            <span>{getFilteredIncidents().length} incidents</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Incidents List -->
    <div class="incidents-panel">
      <div class="panel-header">
        <h3>Nearby Incidents</h3>
        <span class="incident-count">{getFilteredIncidents().length} reports</span>
      </div>
      
      <div class="incidents-list">
        {#if getFilteredIncidents().length === 0}
          <div class="empty-incidents">
            <AlertCircle size={40} />
            <h4>No incidents found</h4>
            <p>Try adjusting your search or filters</p>
            <button class="reset-btn" onclick={clearFilters}>Clear filters</button>
          </div>
        {:else}
          {#each getFilteredIncidents() as incident}
            <div 
              class="incident-card {selectedIncident?.id === incident.id ? 'selected' : ''}"
              onclick={() => selectedIncident = incident}
            >
              <div class="incident-status" style="background: {getSeverityColor(incident.severity)}"></div>
              <div class="incident-content">
                <div class="incident-header">
                  <div class="incident-title">
                    <svelte:component this={getCategoryIcon(incident.category)} size={14} style="color: {getCategoryColor(incident.category)}" />
                    <h4>{incident.title}</h4>
                  </div>
                  {#if incident.isLive}
                    <span class="live-badge">LIVE</span>
                  {/if}
                </div>
                <p class="incident-description">{incident.description}</p>
                <div class="incident-address">
                  <MapPin size={10} />
                  <span>{incident.address?.split(',')[0] || 'Unknown location'}</span>
                </div>
                <div class="incident-meta">
                  <span><Clock size={10} /> {formatTime(incident.time)}</span>
                  <span><Users size={10} /> {incident.witnesses} witnesses</span>
                </div>
                <button class="details-btn" onclick={(e) => { e.stopPropagation(); goto(`/incident/${incident.id}`); }}>
                  View Details →
                </button>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <!-- Incident Detail Popup -->
    {#if selectedIncident}
      <div class="popup-overlay" onclick={() => selectedIncident = null}>
        <div class="incident-popup" onclick={(e) => e.stopPropagation()}>
          <button class="popup-close" onclick={() => selectedIncident = null}>
            <X size={18} />
          </button>
          <div class="popup-header">
            <svelte:component this={getCategoryIcon(selectedIncident.category)} size={22} style="color: {getCategoryColor(selectedIncident.category)}" />
            <h3>{selectedIncident.title}</h3>
          </div>
          <div class="popup-badges">
            <span class="category-badge" style="background: {getCategoryColor(selectedIncident.category)}20; color: {getCategoryColor(selectedIncident.category)}">
              {selectedIncident.category}
            </span>
            <span class="severity-badge" style="color: {getSeverityColor(selectedIncident.severity)}">
              {selectedIncident.severity}
            </span>
          </div>
          <p class="popup-description">{selectedIncident.description}</p>
          <div class="popup-location">
            <MapPin size={14} />
            <span>{selectedIncident.address || 'Location details available'}</span>
          </div>
          <div class="popup-stats">
            <div><Clock size={12} /> {formatTime(selectedIncident.time)}</div>
            <div><Users size={12} /> {selectedIncident.witnesses} witnesses</div>
          </div>
          <button class="popup-action" onclick={() => goto(`/incident/${selectedIncident.id}`)}>
            Full Incident Report →
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .map-page {
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  /* Header */
  .map-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 12px 16px;
    position: sticky;
    top: 0;
    z-index: 30;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .back-btn, .filter-btn {
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

  .back-btn:active, .filter-btn:active {
    transform: scale(0.95);
    background: #e2e8f0;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-title svg {
    color: #6a2c91;
  }

  .header-title h1 {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, #6a2c91, #4b1d68);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  /* Search Section */
  .search-section {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 8px;
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
    padding: 0 32px 0 40px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 0.875rem;
    font-family: inherit;
    transition: all 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: #6a2c91;
    background: white;
    box-shadow: 0 0 0 3px rgba(106, 44, 145, 0.1);
  }

  .clear-search {
    position: absolute;
    right: 10px;
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
    flex-shrink: 0;
    transition: all 0.2s;
  }

  .location-btn:active {
    transform: scale(0.95);
    background: #e2e8f0;
  }

  .location-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinner-small {
    width: 18px;
    height: 18px;
    border: 2px solid #e2e8f0;
    border-top-color: #6a2c91;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  .location-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #f1f5f9;
    border-radius: 20px;
    font-size: 0.688rem;
    color: #475569;
    margin-top: 8px;
  }

  /* Filter Drawer */
  .filter-overlay {
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

  .filter-drawer {
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

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
  }

  .filter-header h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #0f172a;
  }

  .close-filter {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 4px;
  }

  .filter-body {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }

  .filter-group {
    margin-bottom: 24px;
  }

  .filter-group label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .filter-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 40px;
    font-size: 0.75rem;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-chip:active {
    transform: scale(0.96);
  }

  .filter-chip.active {
    color: white;
  }

  .clear-filters {
    width: 100%;
    padding: 12px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #dc2626;
    cursor: pointer;
    margin-top: 16px;
  }

  /* Map Container */
  .map-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 130px);
  }

  .map-wrapper {
    height: 45vh;
    min-height: 320px;
    position: relative;
  }

  .map-loading {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    z-index: 10;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top-color: #6a2c91;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .map-canvas {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .map-grid {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);
    background-image: 
      linear-gradient(#e2e8f0 1px, transparent 1px),
      linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
    background-size: 50px 50px;
    position: relative;
  }

  /* User Marker */
  .user-marker {
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 15;
  }

  .user-dot {
    width: 16px;
    height: 16px;
    background: #3b82f6;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .user-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: #3b82f6;
    border-radius: 50%;
    opacity: 0.3;
    animation: pulse 2s infinite;
  }

  /* Incident Markers */
  .incident-marker {
    position: absolute;
    transform: translate(-50%, -50%);
    background: none;
    border: none;
    cursor: pointer;
    z-index: 20;
    padding: 0;
  }

  .marker-dot {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
  }

  .marker-dot svg {
    color: white;
  }

  .incident-marker:active .marker-dot {
    transform: scale(1.15);
  }

  .live-indicator {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    background: #ef4444;
    border: 2px solid white;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }

  /* Map Controls */
  .map-controls {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 25;
  }

  .zoom-btn {
    width: 40px;
    height: 40px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #475569;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  }

  .zoom-btn:active {
    transform: scale(0.95);
  }

  .map-stats {
    position: absolute;
    bottom: 16px;
    left: 16px;
    z-index: 25;
  }

  .stat-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    padding: 8px 14px;
    border-radius: 40px;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
  }

  .stat-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
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
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    padding: 4px 8px;
    border-radius: 20px;
  }

  .incidents-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .empty-incidents {
    text-align: center;
    padding: 40px 20px;
    color: #64748b;
  }

  .empty-incidents svg {
    margin-bottom: 12px;
    opacity: 0.5;
  }

  .empty-incidents h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 8px;
  }

  .empty-incidents p {
    font-size: 0.75rem;
    margin-bottom: 16px;
  }

  .reset-btn {
    padding: 8px 16px;
    background: #f1f5f9;
    border: none;
    border-radius: 10px;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .incident-card {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .incident-card:active {
    transform: scale(0.99);
    background: #fafafa;
  }

  .incident-card.selected {
    border-color: #6a2c91;
    background: #f5f3ff;
  }

  .incident-status {
    width: 4px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .incident-content {
    flex: 1;
    min-width: 0;
  }

  .incident-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .incident-title {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
  }

  .incident-title h4 {
    font-size: 0.813rem;
    font-weight: 600;
    color: #0f172a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .live-badge {
    font-size: 0.563rem;
    font-weight: 700;
    padding: 2px 8px;
    background: #fee2e2;
    color: #dc2626;
    border-radius: 12px;
    flex-shrink: 0;
  }

  .incident-description {
    font-size: 0.688rem;
    color: #64748b;
    line-height: 1.4;
    margin-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .incident-address {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.625rem;
    color: #94a3b8;
    margin-bottom: 6px;
  }

  .incident-meta {
    display: flex;
    gap: 12px;
    font-size: 0.625rem;
    color: #94a3b8;
    margin-bottom: 8px;
  }

  .incident-meta span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .details-btn {
    background: none;
    border: none;
    font-size: 0.625rem;
    font-weight: 500;
    color: #6a2c91;
    cursor: pointer;
    padding: 4px 0;
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
    padding: 20px;
    animation: slideUp 0.3s ease;
    position: relative;
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .popup-close {
    position: absolute;
    top: 16px;
    right: 16px;
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
    gap: 12px;
    margin-bottom: 12px;
    padding-right: 32px;
  }

  .popup-header h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
  }

  .popup-badges {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .category-badge, .severity-badge {
    font-size: 0.625rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    text-transform: capitalize;
  }

  .popup-description {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .popup-location {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.688rem;
    color: #475569;
    background: #f8fafc;
    padding: 8px 12px;
    border-radius: 10px;
    margin-bottom: 12px;
  }

  .popup-stats {
    display: flex;
    gap: 16px;
    font-size: 0.688rem;
    color: #94a3b8;
    margin-bottom: 16px;
  }

  .popup-stats div {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .popup-action {
    width: 100%;
    padding: 12px;
    background: #6a2c91;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 0.813rem;
    font-weight: 600;
    cursor: pointer;
  }

  .popup-action:active {
    transform: scale(0.98);
    background: #4b1d68;
  }

  /* Tablet and Desktop */
  @media (min-width: 768px) {
    .map-container {
      flex-direction: row;
      height: calc(100vh - 110px);
    }

    .map-wrapper {
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
      width: 380px;
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