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
    SlidersHorizontal
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
    // TODO: Replace with actual API call
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
        description: 'Person acting suspiciously near the elementary school'
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
        description: 'Multiple cars broken into overnight'
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
        description: 'Graffiti on park equipment'
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
        description: 'Structure fire, emergency services on scene'
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
  <title>Map View - Lezie</title>
</svelte:head>

<div class="map-page">
  <!-- Header -->
  <div class="map-header">
    <div class="header-left">
      <button class="back-button" onclick={() => goto('/dashboard')} aria-label="Go back">
        <ChevronLeft size={20} />
        Back
      </button>
      <h1>Incident Map</h1>
    </div>
    
    <div class="header-right">
      <div class="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search incidents..."
          bind:value={searchQuery}
          aria-label="Search incidents"
        />
      </div>
      
      <button class="filter-toggle" onclick={() => showFilters = !showFilters} aria-label="Toggle filters">
        <SlidersHorizontal size={18} />
        Filters
      </button>
      
      <button class="location-btn" onclick={getCurrentLocation} aria-label="Use my current location">
        <Navigation size={18} />
      </button>
    </div>
  </div>
  
  <div class="map-container">
    <!-- Map Area -->
    <div class="map-area">
      <div class="map-grid">
        {#each getFilteredIncidents() as incident}
          <button 
            class="map-marker"
            style="left: {((incident.lng + 74.02) / 0.04) * 100}%; top: {((40.73 - incident.lat) / 0.04) * 100}%"
            onclick={() => selectedIncident = incident}
            aria-label={`View ${incident.title} details`}
          >
            <div class="marker-dot" style="background: {getSeverityColor(incident.severity)}"></div>
            <div class="marker-pulse" style="background: {getSeverityColor(incident.severity)}"></div>
          </button>
        {/each}
        
        <div class="map-overlay">
          <MapPin size={14} />
          <span>Interactive map - {getFilteredIncidents().length} incidents shown</span>
        </div>
      </div>
    </div>
    
    <!-- Filters Sidebar -->
    {#if showFilters}
      <div class="filters-sidebar" role="dialog" aria-label="Filter incidents">
        <div class="filters-header">
          <h3>Filters</h3>
          <button class="close-filters" onclick={() => showFilters = false} aria-label="Close filters">
            <X size={18} />
          </button>
        </div>
        
        <div class="filters-content">
          <!-- Categories -->
          <div class="filter-group">
            <span class="filter-label">Categories</span>
            <div class="filter-options" role="group" aria-label="Incident categories">
              {#each categories as cat}
                <button
                  class="filter-chip {filters.categories.includes(cat.value) ? 'active' : ''}"
                  style={filters.categories.includes(cat.value) ? `background: ${cat.color}; border-color: ${cat.color};` : ''}
                  onclick={() => toggleCategory(cat.value)}
                  aria-pressed={filters.categories.includes(cat.value)}
                >
                  <cat.icon size={14} />
                  {cat.label}
                </button>
              {/each}
            </div>
          </div>
          
          <!-- Severity -->
          <div class="filter-group">
            <span class="filter-label">Severity</span>
            <div class="filter-options" role="group" aria-label="Severity levels">
              {#each severityLevels as level}
                <button
                  class="filter-chip {filters.severity.includes(level.value) ? 'active' : ''}"
                  style={filters.severity.includes(level.value) ? `background: ${level.color}; border-color: ${level.color};` : ''}
                  onclick={() => toggleSeverity(level.value)}
                  aria-pressed={filters.severity.includes(level.value)}
                >
                  {level.label}
                </button>
              {/each}
            </div>
          </div>
          
          <!-- Date Range -->
          <div class="filter-group">
            <span class="filter-label">Date Range</span>
            <div class="filter-options" role="group" aria-label="Date range">
              <button 
                class="filter-chip {filters.dateRange === 'day' ? 'active' : ''}" 
                onclick={() => filters.dateRange = 'day'}
                aria-pressed={filters.dateRange === 'day'}
              >
                Today
              </button>
              <button 
                class="filter-chip {filters.dateRange === 'week' ? 'active' : ''}" 
                onclick={() => filters.dateRange = 'week'}
                aria-pressed={filters.dateRange === 'week'}
              >
                This Week
              </button>
              <button 
                class="filter-chip {filters.dateRange === 'month' ? 'active' : ''}" 
                onclick={() => filters.dateRange = 'month'}
                aria-pressed={filters.dateRange === 'month'}
              >
                This Month
              </button>
            </div>
          </div>
          
          <button class="clear-filters" onclick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      </div>
    {/if}
    
    <!-- Incidents Sidebar -->
    <div class="incidents-sidebar">
      <div class="incidents-header">
        <h3>Nearby Incidents</h3>
        <span class="incident-count">{getFilteredIncidents().length} reports</span>
      </div>
      
      <div class="incidents-list">
        {#if getFilteredIncidents().length === 0}
          <div class="no-results">
            <AlertTriangle size={32} />
            <p>No incidents found</p>
            <button class="clear-filters-btn" onclick={clearFilters}>Clear filters</button>
          </div>
        {:else}
          {#each getFilteredIncidents() as incident}
            <div 
              class="incident-item {selectedIncident?.id === incident.id ? 'selected' : ''}"
              onclick={() => selectedIncident = incident}
              role="button"
              tabindex="0"
              onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectedIncident = incident; }}
            >
              <div class="incident-status-dot" style="background: {getSeverityColor(incident.severity)}"></div>
              <div class="incident-info">
                <h4>{incident.title}</h4>
                <div class="incident-meta">
                  <span class="category" style="color: {getCategoryColor(incident.category)}">
                    {incident.category}
                  </span>
                  <span class="time">{formatTime(incident.time)}</span>
                </div>
              </div>
              <button 
                class="view-btn" 
                onclick={(e) => { e.stopPropagation(); goto(`/incident/${incident.id}`); }}
                aria-label={`View details for ${incident.title}`}
              >
                View →
              </button>
            </div>
          {/each}
        {/if}
      </div>
    </div>
    
    <!-- Selected Incident Popup -->
    {#if selectedIncident}
      <div class="incident-popup" role="dialog" aria-label="Incident details">
        <button class="popup-close" onclick={() => selectedIncident = null} aria-label="Close popup">
          <X size={18} />
        </button>
        <h4>{selectedIncident.title}</h4>
        <div class="popup-meta">
          <span class="popup-category">{selectedIncident.category}</span>
          <span class="popup-severity" style="color: {getSeverityColor(selectedIncident.severity)}">
            {selectedIncident.severity} severity
          </span>
        </div>
        <p class="popup-time">{formatTime(selectedIncident.time)}</p>
        <button class="popup-view" onclick={() => goto(`/incident/${selectedIncident.id}`)}>
          View Details →
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .map-page {
    min-height: 100vh;
    background: #f9fafb;
    display: flex;
    flex-direction: column;
  }
  
  .map-header {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
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
  
  .map-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark-color);
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--light-color);
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
  }
  
  .search-bar input {
    border: none;
    background: none;
    outline: none;
    font-size: 0.875rem;
    width: 200px;
  }
  
  .filter-toggle, .location-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--light-color);
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .filter-toggle:hover, .location-btn:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
  
  .map-container {
    flex: 1;
    position: relative;
    display: flex;
    height: calc(100vh - 73px);
  }
  
  .map-area {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  
  .map-grid {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--primary-bg) 0%, #ffffff 100%);
    background-image: 
      linear-gradient(#e5e7eb 1px, transparent 1px),
      linear-gradient(90deg, #e5e7eb 1px, transparent 1px);
    background-size: 50px 50px;
  }
  
  .map-marker {
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: pointer;
    z-index: 10;
    background: none;
    border: none;
    padding: 0;
  }
  
  .marker-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 2;
  }
  
  .marker-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    opacity: 0.4;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0.8;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }
  
  .map-overlay {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 20;
    white-space: nowrap;
  }
  
  /* Filters Sidebar */
  .filters-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    width: 320px;
    height: 100%;
    background: white;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    z-index: 30;
    display: flex;
    flex-direction: column;
  }
  
  .filters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .filters-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--dark-color);
  }
  
  .close-filters {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    color: var(--gray-color);
  }
  
  .filters-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }
  
  .filter-group {
    margin-bottom: 1.5rem;
  }
  
  .filter-label {
    display: block;
    font-size: 0.813rem;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 0.75rem;
  }
  
  .filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .filter-chip {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background: var(--light-color);
    border: 1px solid #e5e7eb;
    border-radius: 9999px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .filter-chip.active {
    color: white;
  }
  
  .clear-filters {
    width: 100%;
    padding: 0.75rem;
    background: none;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--gray-color);
    margin-top: 1rem;
    transition: all 0.2s;
  }
  
  .clear-filters:hover {
    border-color: var(--danger-color);
    color: var(--danger-color);
  }
  
  /* Incidents Sidebar */
  .incidents-sidebar {
    width: 320px;
    background: white;
    border-left: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
  }
  
  .incidents-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .incidents-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--dark-color);
  }
  
  .incident-count {
    font-size: 0.75rem;
    color: var(--gray-color);
  }
  
  .incidents-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .no-results {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--gray-color);
  }
  
  .no-results svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .clear-filters-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  
  .incident-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 0.5rem;
    width: 100%;
    background: none;
    border: none;
    text-align: left;
  }
  
  .incident-item:hover {
    background: var(--primary-bg);
  }
  
  .incident-item.selected {
    background: var(--primary-bg);
    border-left: 3px solid var(--primary-color);
  }
  
  .incident-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .incident-info {
    flex: 1;
  }
  
  .incident-info h4 {
    font-size: 0.813rem;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 0.25rem;
  }
  
  .incident-meta {
    display: flex;
    gap: 0.5rem;
    font-size: 0.688rem;
  }
  
  .category {
    text-transform: capitalize;
  }
  
  .time {
    color: var(--gray-color);
  }
  
  .view-btn {
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
  
  .view-btn:hover {
    background: var(--primary-bg);
  }
  
  /* Incident Popup */
  .incident-popup {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 1rem;
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    min-width: 280px;
    z-index: 40;
  }
  
  .popup-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gray-color);
  }
  
  .incident-popup h4 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    padding-right: 1.5rem;
    color: var(--dark-color);
  }
  
  .popup-meta {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }
  
  .popup-category {
    font-size: 0.688rem;
    padding: 0.125rem 0.5rem;
    background: var(--light-color);
    border-radius: 9999px;
    text-transform: capitalize;
  }
  
  .popup-severity {
    font-size: 0.688rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .popup-time {
    font-size: 0.688rem;
    color: var(--gray-color);
    margin-bottom: 0.75rem;
  }
  
  .popup-view {
    width: 100%;
    padding: 0.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.813rem;
    transition: background 0.2s;
  }
  
  .popup-view:hover {
    background: var(--primary-dark);
  }
  
  @media (max-width: 768px) {
    .map-header {
      flex-direction: column;
      align-items: stretch;
      padding: 1rem;
    }
    
    .header-right {
      flex-wrap: wrap;
    }
    
    .search-bar input {
      width: 100%;
    }
    
    .filters-sidebar {
      width: 100%;
    }
    
    .map-overlay {
      white-space: normal;
      text-align: center;
      font-size: 0.688rem;
      max-width: 90%;
    }
  }
</style>