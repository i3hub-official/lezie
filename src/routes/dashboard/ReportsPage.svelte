<!-- src/routes/reports/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import {
    MapPin, Camera, X, AlertTriangle, Send, Navigation, Shield,
    EyeOff, CheckCircle, AlertCircle, ChevronLeft, Loader2,
    Flame, Car, Building, Volume2, MoreHorizontal, TrendingUp,
    AlertOctagon, Search, Bell, Users, PlusCircle, Trash2,
    List, Grid3x3, Filter, Clock, Eye, ThumbsUp, MessageCircle, Share2
  } from 'lucide-svelte';

  // ── Tab State ─────────────────────────────────────────────
  let activeTab = $state<'submit' | 'view'>('submit');

  // ── Submit Report State ───────────────────────────────────
  let isSubmitting = $state(false);
  let error = $state('');
  let success = $state(false);
  let isSearchingLocation = $state(false);
  let locationSearchResults = $state<any[]>([]);
  let showLocationSearch = $state(false);

  let title = $state('');
  let description = $state('');
  let category = $state('');
  let severity = $state('medium');
  let isAnonymous = $state(false);

  let aiAnalysis = $state<null | {
    category: string;
    severity: string;
    severity_score: number;
    tags: string[];
    summary: string;
    recommended_action: string;
    prevention_tips: string[];
    confidence: number;
  }>(null);
  let isAnalysing = $state(false);
  let analysisError = $state('');

  const severityColours: Record<string, string> = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#F97316',
    critical: '#EF4444',
  };

  let userLocation = $state<{ lat: number; lng: number } | null>(null);
  let userLocationDetails = $state({
    street: '', city: '', state: '', postalCode: '', country: '', displayName: ''
  });
  let isGettingUserLocation = $state(false);

  let additionalLocation = $state<{ lat: number; lng: number } | null>(null);
  let additionalLocationDetails = $state({
    street: '', city: '', state: '', postalCode: '', country: '', displayName: ''
  });
  let showAdditionalLocationSearch = $state(false);
  let additionalLocationSearchQuery = $state('');
  let additionalLocationSearchResults = $state<any[]>([]);
  let isSearchingAdditionalLocation = $state(false);

  const categories = [
    { value: 'suspicious', label: 'Suspicious Activity', icon: AlertTriangle, color: '#F59E0B' },
    { value: 'theft', label: 'Theft / Robbery', icon: AlertOctagon, color: '#EF4444' },
    { value: 'vandalism', label: 'Vandalism', icon: Building, color: '#F97316' },
    { value: 'fire', label: 'Fire / Emergency', icon: Flame, color: '#DC2626' },
    { value: 'accident', label: 'Accident', icon: Car, color: '#F59E0B' },
    { value: 'noise', label: 'Noise Complaint', icon: Volume2, color: '#8B5CF6' },
    { value: 'other', label: 'Other', icon: MoreHorizontal, color: '#6B7280' }
  ];

  const severityOptions = [
    { value: 'low', label: 'Low', color: '#10B981', description: 'Non-urgent, monitor situation' },
    { value: 'medium', label: 'Medium', color: '#F59E0B', description: 'Caution advised' },
    { value: 'high', label: 'High', color: '#F97316', description: 'Urgent, attention needed' },
    { value: 'critical', label: 'Critical', color: '#EF4444', description: 'Emergency, immediate action' }
  ];

  let mediaFiles = $state<File[]>([]);
  let mediaPreviews = $state<string[]>([]);

  // ── View Reports State ────────────────────────────────────
  let reports = $state<any[]>([]);
  let isLoadingReports = $state(false);
  let viewMode = $state<'grid' | 'list'>('grid');
  let filterCategory = $state('all');
  let filterSeverity = $state('all');
  let searchQuery = $state('');
  let selectedReport = $state<any | null>(null);
  let showReportModal = $state(false);
  let reportError = $state('');
  let categoriesList = $state<any[]>([]);
  let statusesList = $state<any[]>([]);
  let pagination = $state<any>(null);
  let currentPage = $state(1);

  onMount(() => {
    if (activeTab === 'submit') {
      getUserRealTimeLocation();
    }
    loadReports();
  });

  // ── Real API Calls ─────────────────────────────────────────
  async function loadReports(page = 1) {
    isLoadingReports = true;
    reportError = '';
    currentPage = page;
    
    try {
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (filterSeverity !== 'all') params.append('severity', filterSeverity);
      if (searchQuery) params.append('q', searchQuery);
      params.append('page', String(page));
      
      const response = await fetch(`/api/reports?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to load reports');
      }
      
      const data = await response.json();
      reports = data.reports || [];
      categoriesList = data.categories || [];
      statusesList = data.statuses || [];
      pagination = data.pagination;
    } catch (err) {
      console.error('Error loading reports:', err);
      reportError = 'Unable to load reports. Please try again.';
      reports = [];
    } finally {
      isLoadingReports = false;
    }
  }

  async function submitReportToAPI(formData: FormData) {
    const response = await fetch('/api/reports', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit report');
    }
    
    return await response.json();
  }

  async function likeReport(reportId: number) {
    try {
      const response = await fetch(`/api/reports/${reportId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        await loadReports(currentPage);
        if (selectedReport && selectedReport.id === reportId) {
          const updated = reports.find(r => r.id === reportId);
          if (updated) selectedReport = updated;
        }
      }
    } catch (err) {
      console.error('Error liking report:', err);
    }
  }

  function getCategoryLabelFromId(categoryId: string): string {
    const cat = categoriesList.find(c => c.id === categoryId);
    return cat?.name || 'Other';
  }

  function getCategoryColor(categoryId: string): string {
    const cat = categoriesList.find(c => c.id === categoryId);
    return cat?.color || '#6B7280';
  }

  function getStatusBadge(statusId: string) {
    const status = statusesList.find(s => s.id === statusId);
    return { 
      label: status?.name || 'Unknown', 
      color: status?.color || '#6B7280' 
    };
  }

  function formatTimeAgo(dateString: string) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  function openReportModal(report: any) {
    selectedReport = report;
    showReportModal = true;
  }

  // ── Submit Report Functions ───────────────────────────────
  async function getUserRealTimeLocation() {
    if (!navigator.geolocation) {
      error = 'Geolocation is not supported by your browser';
      return;
    }
    
    isGettingUserLocation = true;
    error = '';
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        await getUserAddressFromCoords(userLocation.lat, userLocation.lng);
        isGettingUserLocation = false;
      },
      (err) => {
        console.error('Geolocation error:', err);
        let errorMsg = 'Unable to get your location. ';
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMsg += 'Please enable location permissions.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMsg += 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMsg += 'Location request timed out.';
            break;
          default:
            errorMsg += 'Please check your location settings.';
        }
        error = errorMsg;
        isGettingUserLocation = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  async function getUserAddressFromCoords(lat: number, lng: number) {
    if (!browser) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data.address) {
        const a = data.address;
        userLocationDetails = {
          street: [a.road, a.house_number].filter(Boolean).join(' ') || a.suburb || a.neighbourhood || '',
          city: a.city || a.town || a.village || a.municipality || '',
          state: a.state || a.region || '',
          postalCode: a.postcode || '',
          country: a.country || '',
          displayName: data.display_name || ''
        };
      }
    } catch (err) {
      console.error('Failed to get address:', err);
    }
  }

  async function searchAdditionalLocation(query: string) {
    additionalLocationSearchQuery = query;
    if (!browser) return;
    if (!query.trim() || query.length < 3) {
      additionalLocationSearchResults = [];
      return;
    }
    isSearchingAdditionalLocation = true;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
      const data = await res.json();
      additionalLocationSearchResults = data.map((r: any) => ({
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
        displayName: r.display_name,
        address: r.address
      }));
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      isSearchingAdditionalLocation = false;
    }
  }

  function selectAdditionalLocation(result: any) {
    additionalLocation = { lat: result.lat, lng: result.lng };
    const a = result.address || {};
    additionalLocationDetails = {
      street: [a.road, a.house_number].filter(Boolean).join(' ') || a.suburb || '',
      city: a.city || a.town || a.village || a.municipality || '',
      state: a.state || a.region || '',
      postalCode: a.postcode || '',
      country: a.country || '',
      displayName: result.displayName
    };
    showAdditionalLocationSearch = false;
    additionalLocationSearchResults = [];
    additionalLocationSearchQuery = '';
  }

  function removeAdditionalLocation() {
    additionalLocation = null;
    additionalLocationDetails = {
      street: '', city: '', state: '', postalCode: '', country: '', displayName: ''
    };
  }

  function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []).slice(0, 5 - mediaFiles.length);
    const valid = files.filter(f => f.size <= 10 * 1024 * 1024);
    if (valid.length !== files.length) {
      error = 'Some files exceed 10MB and were skipped';
    }
    mediaFiles = [...mediaFiles, ...valid];
    valid.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        mediaPreviews = [...mediaPreviews, e.target?.result as string];
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  function removeMedia(i: number) {
    mediaFiles = mediaFiles.filter((_, j) => j !== i);
    mediaPreviews = mediaPreviews.filter((_, j) => j !== i);
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!title.trim() || title.length < 5) {
      error = 'Title must be at least 5 characters';
      return;
    }
    if (!description.trim() || description.length < 20) {
      error = 'Description must be at least 20 characters';
      return;
    }
    if (!category) {
      error = 'Please select a category';
      return;
    }
    if (!userLocation) {
      error = 'Unable to get your location. Please enable location services.';
      return;
    }

    isSubmitting = true;
    error = '';
    
    try {
      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('severity', severity);
      formData.append('isAnonymous', String(isAnonymous));
      formData.append('lat', String(userLocation.lat));
      formData.append('lng', String(userLocation.lng));
      formData.append('address', userLocationDetails.displayName || 
        `${userLocationDetails.street}, ${userLocationDetails.city}, ${userLocationDetails.state}`.trim());
      formData.append('locationName', userLocationDetails.city || userLocationDetails.state || 'Unknown');
      formData.append('location', JSON.stringify({ lat: userLocation.lat, lng: userLocation.lng }));
      
      if (additionalLocation) {
        formData.append('additionalLat', String(additionalLocation.lat));
        formData.append('additionalLng', String(additionalLocation.lng));
        formData.append('additionalAddress', additionalLocationDetails.displayName);
      }
      
      // Append media files
      mediaFiles.forEach(file => {
        formData.append('media', file);
      });
      
      // Submit to API
      const result = await submitReportToAPI(formData);
      
      // Trigger AI analysis
      isAnalysing = true;
      try {
        const aiRes = await fetch('/api/ai/analyse-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title, description,
            location: userLocationDetails.city ? `${userLocationDetails.city}, ${userLocationDetails.state}` : undefined,
            reported_at: new Date().toISOString(),
          }),
        });
        if (aiRes.ok) {
          aiAnalysis = await aiRes.json();
        } else {
          analysisError = 'AI analysis unavailable — report still submitted.';
        }
      } catch {
        analysisError = 'AI analysis unavailable — report still submitted.';
      } finally {
        isAnalysing = false;
      }
      
      success = true;
      setTimeout(() => {
        success = false;
        // Reset form
        title = ''; description = ''; category = ''; severity = 'medium';
        mediaFiles = []; mediaPreviews = [];
        aiAnalysis = null; analysisError = '';
        activeTab = 'view';
        loadReports(1);
      }, 5000);
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to submit report';
    } finally {
      isSubmitting = false;
    }
  }

  function handleFilterChange() {
    loadReports(1);
  }
</script>

<svelte:head>
  <title>Reports – Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="rp-page">
  <main class="rp-main">
    <div class="rp-shell">
      <!-- Tab Navigation -->
      <div class="rp-tabs">
        <button class="rp-tab {activeTab === 'submit' ? 'rp-tab--active' : ''}" onclick={() => { activeTab = 'submit'; if (activeTab === 'submit' && !userLocation) getUserRealTimeLocation(); }}>
          <AlertTriangle size={16} />
          <span>Submit Report</span>
        </button>
        <button class="rp-tab {activeTab === 'view' ? 'rp-tab--active' : ''}" onclick={() => { activeTab = 'view'; loadReports(1); }}>
          <List size={16} />
          <span>View Reports</span>
        </button>
      </div>

      <!-- Submit Report Tab -->
      {#if activeTab === 'submit'}
        {#if success}
          <div class="rp-card rp-success">
            <div class="rp-success-icon"><CheckCircle size={44} strokeWidth={1.5} /></div>
            <h2 class="rp-success-title">Report Submitted Successfully!</h2>
            <p class="rp-success-body">Thank you for contributing to community safety.</p>
            {#if isAnalysing}
              <div class="rp-ai-loading"><Loader2 size={22} class="rp-spinning" /><span>Analysing your report with AI…</span></div>
            {:else if aiAnalysis}
              <div class="rp-ai-card"><div class="rp-ai-head"><div class="rp-ai-badge"><TrendingUp size={15} /><span>AI Analysis</span></div><span class="rp-ai-confidence">{Math.round(aiAnalysis.confidence * 100)}% confidence</span></div>
              <div class="rp-ai-severity" style="background:{severityColours[aiAnalysis.severity]}18;border-color:{severityColours[aiAnalysis.severity]}40;"><div class="rp-ai-score-ring" style="--ring-color:{severityColours[aiAnalysis.severity]}"><span>{aiAnalysis.severity_score}</span><small>/10</small></div><div><strong style="color:{severityColours[aiAnalysis.severity]}">{aiAnalysis.severity.charAt(0).toUpperCase() + aiAnalysis.severity.slice(1)} Severity</strong><p class="rp-ai-category">Category: {aiAnalysis.category.replace(/_/g, ' ')}</p></div></div>
              <p class="rp-ai-summary">{aiAnalysis.summary}</p>
              {#if aiAnalysis.tags.length > 0}<div class="rp-ai-tags">{#each aiAnalysis.tags as tag}<span class="rp-ai-tag">{tag}</span>{/each}</div>{/if}
              <div class="rp-ai-rec"><Shield size={14} /><div><strong>Recommended Action</strong><p>{aiAnalysis.recommended_action}</p></div></div>
              {#if aiAnalysis.prevention_tips.length > 0}<div class="rp-ai-tips"><strong>Prevention Tips</strong><ul>{#each aiAnalysis.prevention_tips as tip}<li><span class="rp-ai-tip-dot"></span>{tip}</li>{/each}</ul></div>{/if}</div>
            {:else if analysisError}<div class="rp-ai-card rp-ai-card--error"><AlertCircle size={15} /><span>{analysisError}</span></div>{/if}
            <p class="rp-success-note">Redirecting to reports…</p><Loader2 size={20} class="rp-spinning" />
          </div>
        {:else}
          <form onsubmit={handleSubmit}>
            {#if error}<div class="rp-alert-error"><AlertCircle size={16} /><span>{error}</span></div>{/if}
            <div class="rp-card rp-section"><div class="rp-section-head"><div class="rp-section-num">1</div><h3 class="rp-section-title">Incident Title <span class="rp-req">*</span></h3></div><div class="rp-field"><label class="rp-label" for="title">Brief title</label><input id="title" type="text" bind:value={title} class="rp-input" placeholder="e.g., Suspicious person near school, Break-in on Main St" maxlength="200" /><div class="rp-field-foot"><span class="rp-hint">{title.length}/200 characters</span>{#if title.length > 0 && title.length < 5}<span class="rp-hint rp-hint--warn">Minimum 5 characters required</span>{/if}</div></div></div>
            <div class="rp-card rp-section"><div class="rp-section-head"><div class="rp-section-num">2</div><h3 class="rp-section-title">Category <span class="rp-req">*</span></h3></div><div class="rp-category-grid">{#each categories as cat}<button type="button" class="rp-cat-btn {category === cat.value ? 'rp-cat-btn--active' : ''}" style={category === cat.value ? `--cat-color:${cat.color}` : ''} onclick={() => category = cat.value}><span class="rp-cat-icon" style={category === cat.value ? '' : `color:${cat.color}`}><svelte:component this={cat.icon} size={17} /></span><span>{cat.label}</span></button>{/each}</div></div>
            <div class="rp-card rp-section"><div class="rp-section-head"><div class="rp-section-num">3</div><h3 class="rp-section-title">Severity Level</h3></div><div class="rp-severity-grid">{#each severityOptions as opt}<button type="button" class="rp-sev-btn {severity === opt.value ? 'rp-sev-btn--active' : ''}" style={severity === opt.value ? `--sev-color:${opt.color}` : ''} onclick={() => severity = opt.value}><span class="rp-sev-pip" style="background:{opt.color}"></span><div class="rp-sev-info"><span class="rp-sev-label">{opt.label}</span><span class="rp-sev-desc">{opt.description}</span></div>{#if severity === opt.value}<CheckCircle size={15} class="rp-sev-check" />{/if}</button>{/each}</div></div>
            <div class="rp-card rp-section"><div class="rp-section-head"><div class="rp-section-num">4</div><h3 class="rp-section-title">Description <span class="rp-req">*</span></h3></div><div class="rp-field"><label class="rp-label" for="description">What happened?</label><textarea id="description" bind:value={description} class="rp-textarea" rows="5" placeholder="Describe what happened — include time, people involved, vehicles, and any other relevant details…"></textarea><div class="rp-field-foot"><span class="rp-hint">{description.length} characters</span>{#if description.length > 0 && description.length < 20}<span class="rp-hint rp-hint--warn">Minimum 20 characters required</span>{/if}</div></div></div>
            <div class="rp-card rp-section"><div class="rp-section-head"><div class="rp-section-num">5</div><h3 class="rp-section-title">Your Location <span class="rp-req">*</span></h3></div>{#if isGettingUserLocation}<div class="rp-loc-loading"><Loader2 size={20} class="rp-spinning" /><span>Getting your real-time location...</span></div>{:else if userLocation}<div class="rp-loc-card rp-loc-card--fixed"><div class="rp-loc-card-head"><Navigation size={15} /><strong>Your Current Location (Auto-detected)</strong><button type="button" class="rp-loc-refresh" onclick={getUserRealTimeLocation} title="Refresh location"><Loader2 size={14} /></button></div><div class="rp-loc-details">{#if userLocationDetails.street}<div class="rp-loc-row"><span>Street</span><span>{userLocationDetails.street}</span></div>{/if}{#if userLocationDetails.city}<div class="rp-loc-row"><span>City</span><span>{userLocationDetails.city}</span></div>{/if}{#if userLocationDetails.state}<div class="rp-loc-row"><span>State</span><span>{userLocationDetails.state}</span></div>{/if}{#if userLocationDetails.postalCode}<div class="rp-loc-row"><span>Postcode</span><span>{userLocationDetails.postalCode}</span></div>{/if}{#if userLocationDetails.country}<div class="rp-loc-row"><span>Country</span><span>{userLocationDetails.country}</span></div>{/if}</div><div class="rp-loc-coords"><span>Lat {userLocation.lat.toFixed(6)}</span><span>·</span><span>Lng {userLocation.lng.toFixed(6)}</span></div></div>{:else}<div class="rp-loc-error"><AlertCircle size={16} /><span>Unable to get your location.</span><button type="button" class="rp-retry-btn" onclick={getUserRealTimeLocation}>Retry</button></div>{/if}</div>
            <div class="rp-card rp-section"><div class="rp-section-head"><div class="rp-section-num">6</div><h3 class="rp-section-title">Additional Location <span class="rp-optional">optional</span></h3></div>{#if !additionalLocation}<div class="rp-add-location-btn-wrap"><button type="button" class="rp-add-location-btn" onclick={() => showAdditionalLocationSearch = !showAdditionalLocationSearch}><PlusCircle size={16} /><span>Add one more location</span></button><p class="rp-hint">Add a related location if the incident spans multiple areas</p></div>{/if}{#if showAdditionalLocationSearch && !additionalLocation}<div class="rp-loc-search"><div class="rp-search-wrap"><Search size={15} class="rp-search-ico" /><input type="text" placeholder="Search by street, city, or postcode…" class="rp-search-input" bind:value={additionalLocationSearchQuery} oninput={(e) => searchAdditionalLocation(e.currentTarget.value)} /></div>{#if isSearchingAdditionalLocation}<div class="rp-search-loading"><Loader2 size={18} class="rp-spinning" /> Searching…</div>{/if}{#if additionalLocationSearchResults.length > 0}<div class="rp-search-results">{#each additionalLocationSearchResults as result}<button type="button" class="rp-search-item" onclick={() => selectAdditionalLocation(result)}><MapPin size={14} /><div class="rp-search-item-info"><strong>{result.displayName.split(',')[0]}</strong><span>{result.displayName}</span></div></button>{/each}</div>{/if}</div>{/if}{#if additionalLocation && additionalLocationDetails.displayName}<div class="rp-loc-card rp-loc-card--additional"><div class="rp-loc-card-head"><MapPin size={15} /><strong>Additional Location</strong><button type="button" class="rp-loc-clear" onclick={removeAdditionalLocation}><Trash2 size={14} /></button></div><div class="rp-loc-details">{#if additionalLocationDetails.street}<div class="rp-loc-row"><span>Street</span><span>{additionalLocationDetails.street}</span></div>{/if}{#if additionalLocationDetails.city}<div class="rp-loc-row"><span>City</span><span>{additionalLocationDetails.city}</span></div>{/if}{#if additionalLocationDetails.state}<div class="rp-loc-row"><span>State</span><span>{additionalLocationDetails.state}</span></div>{/if}{#if additionalLocationDetails.postalCode}<div class="rp-loc-row"><span>Postcode</span><span>{additionalLocationDetails.postalCode}</span></div>{/if}{#if additionalLocationDetails.country}<div class="rp-loc-row"><span>Country</span><span>{additionalLocationDetails.country}</span></div>{/if}</div><div class="rp-loc-coords"><span>Lat {additionalLocation.lat.toFixed(6)}</span><span>·</span><span>Lng {additionalLocation.lng.toFixed(6)}</span></div></div>{/if}</div>
            <div class="rp-card rp-section"><div class="rp-section-head"><div class="rp-section-num">7</div><h3 class="rp-section-title">Photos & Videos <span class="rp-optional">optional</span></h3></div><div class="rp-upload-row"><label class="rp-upload-btn {mediaFiles.length >= 5 ? 'rp-upload-btn--disabled' : ''}"><Camera size={18} /><span>Add Media</span><input type="file" accept="image/*,video/*" multiple hidden onchange={handleFileUpload} disabled={mediaFiles.length >= 5} /></label><p class="rp-hint">{mediaFiles.length}/5 files · max 10 MB each</p></div>{#if mediaPreviews.length > 0}<div class="rp-media-grid">{#each mediaPreviews as preview, i}<div class="rp-media-item"><img src={preview} alt="Preview" /><button type="button" class="rp-media-remove" onclick={() => removeMedia(i)}><X size={14} /></button></div>{/each}</div>{/if}</div>
            <div class="rp-card rp-section rp-anon-section"><label class="rp-anon-label"><input type="checkbox" bind:checked={isAnonymous} class="rp-checkbox" /><div class="rp-anon-icon"><EyeOff size={16} /></div><div><span class="rp-anon-title">Report anonymously</span><span class="rp-anon-desc">Your identity will be hidden from public view</span></div></label></div>
            <button type="submit" disabled={isSubmitting || !userLocation} class="rp-submit-btn">{#if isSubmitting}<Loader2 size={18} class="rp-spinning" /> Submitting Report…{:else if !userLocation}<AlertCircle size={18} /> Waiting for location…{:else}<Send size={18} /> Submit Report{/if}</button>
            <div class="rp-safety-note"><AlertTriangle size={16} /><p><strong>Emergency?</strong> Call local emergency services immediately — do not wait to submit this report.</p></div>
          </form>
        {/if}

     <!-- View Reports Tab -->
{:else if activeTab === 'view'}
  <div class="rp-view-header">
    <h2 class="rp-view-title">Community Reports</h2>
    <p class="rp-view-subtitle">Stay informed about safety in your area</p>
  </div>

  <!-- Filters -->
  <div class="rp-filters">
    <div class="rp-search-wrap rp-search-wrap--full">
      <Search size={15} class="rp-search-ico" />
      <input type="text" placeholder="Search reports..." class="rp-search-input" bind:value={searchQuery} oninput={() => handleFilterChange()} />
    </div>
    <div class="rp-filter-group">
      <select class="rp-select" bind:value={filterCategory} onchange={() => handleFilterChange()}>
        <option value="all">All Categories</option>
        {#each categoriesList as cat}
          <option value={cat.id}>{cat.name}</option>
        {/each}
      </select>
      <select class="rp-select" bind:value={filterSeverity} onchange={() => handleFilterChange()}>
        <option value="all">All Severity</option>
        {#each severityOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
    <div class="rp-view-toggle">
      <button class="rp-toggle-btn {viewMode === 'grid' ? 'rp-toggle-btn--active' : ''}" onclick={() => viewMode = 'grid'}>
        <Grid3x3 size={16} />
      </button>
      <button class="rp-toggle-btn {viewMode === 'list' ? 'rp-toggle-btn--active' : ''}" onclick={() => viewMode = 'list'}>
        <List size={16} />
      </button>
    </div>
  </div>

  <!-- Reports List -->
  {#if isLoadingReports}
    <div class="rp-loading-reports">
      <Loader2 size={32} class="rp-spinning" />
      <span>Loading reports...</span>
    </div>
  {:else if reportError}
    <div class="rp-empty-state">
      <AlertCircle size={48} />
      <h3>Error loading reports</h3>
      <p>{reportError}</p>
      <button class="rp-retry-btn" onclick={() => loadReports(1)}>Try Again</button>
    </div>
  {:else if reports.length === 0}
    <div class="rp-empty-state">
      <AlertCircle size={48} />
      <h3>No reports found</h3>
      <p>Try adjusting your filters or be the first to submit a report</p>
    </div>
  {:else}
    <div class="rp-reports-container {viewMode === 'grid' ? 'rp-reports-grid' : 'rp-reports-list'}">
      {#each reports as report}
        <div class="rp-report-card {viewMode === 'list' ? 'rp-report-card--list' : ''}" onclick={() => openReportModal(report)}>
          <div class="rp-report-header">
            <div class="rp-report-category">
              <span class="rp-category-dot" style="background:{getCategoryColor(report.categoryId)}"></span>
              <span>{getCategoryLabelFromId(report.categoryId)}</span>
            </div>
            <span class="rp-report-time">{formatTimeAgo(report.createdAt)}</span>
          </div>
          <h3 class="rp-report-title">{report.title}</h3>
          <p class="rp-report-description">{report.description?.length > 120 ? report.description.slice(0,120)+'...' : report.description}</p>
          <div class="rp-report-footer">
            <div class="rp-report-location">
              <MapPin size={12} />
              <span>{report.locationName || report.address?.split(',')[0] || 'Location unknown'}</span>
            </div>
            <div class="rp-report-stats">
              <span><Eye size={12} /> {report.viewCount || 0}</span>
              <span><MessageCircle size={12} /> {report.commentCount || 0}</span>
              {#if report.mediaCount > 0}
                <span><Camera size={12} /> {report.mediaCount}</span>
              {/if}
            </div>
          </div>
          <div class="rp-report-status" style="background:{getStatusBadge(report.statusId).color}20;color:{getStatusBadge(report.statusId).color}">
            {getStatusBadge(report.statusId).label}
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Pagination -->
    {#if pagination && pagination.pages > 1}
      <div class="rp-pagination">
        <button class="rp-page-btn" disabled={currentPage === 1} onclick={() => loadReports(currentPage - 1)}>
          Previous
        </button>
        <span class="rp-page-info">Page {currentPage} of {pagination.pages}</span>
        <button class="rp-page-btn" disabled={currentPage === pagination.pages} onclick={() => loadReports(currentPage + 1)}>
          Next
        </button>
      </div>
    {/if}
  {/if}
{/if}
      
    </div>
  </main>

  <!-- Report Detail Modal -->
  {#if showReportModal && selectedReport}
    <div class="rp-modal-overlay" onclick={() => showReportModal = false}>
      <div class="rp-modal" onclick={(e) => e.stopPropagation()}>
        <button class="rp-modal-close" onclick={() => showReportModal = false}><X size={20} /></button>
        <div class="rp-modal-header"><div class="rp-report-category"><span class="rp-category-dot" style="background:{getCategoryColor(selectedReport.categoryId)}"></span><span>{getCategoryLabelFromId(selectedReport.categoryId)}</span></div><div class="rp-report-status" style="background:{getStatusBadge(selectedReport.statusId).color}20;color:{getStatusBadge(selectedReport.statusId).color}">{getStatusBadge(selectedReport.statusId).label}</div></div>
        <h2 class="rp-modal-title">{selectedReport.title}</h2>
        <div class="rp-modal-meta"><span><Clock size={14} /> {formatTimeAgo(selectedReport.createdAt)}</span><span><MapPin size={14} /> {selectedReport.locationName || selectedReport.address?.split(',')[0] || 'Location unknown'}</span>{#if selectedReport.isAnonymous}<span><EyeOff size={14} /> Anonymous</span>{/if}</div>
        <p class="rp-modal-description">{selectedReport.description}</p>
        <div class="rp-modal-actions"><button class="rp-action-btn" onclick={() => likeReport(selectedReport.id)}><ThumbsUp size={16} /> Helpful ({selectedReport.viewCount || 0})</button><button class="rp-action-btn" onclick={() => {/* Implement comment modal */}}><MessageCircle size={16} /> Comment ({selectedReport.commentCount || 0})</button><button class="rp-action-btn" onclick={() => {if (navigator.share) navigator.share({ title: selectedReport.title, text: selectedReport.description });}}><Share2 size={16} /> Share</button></div>
      </div>
    </div>
  {/if}
</div>

<style>
:global(.rp-page *){font-family:'DM Sans',system-ui,sans-serif;box-sizing:border-box}.rp-page{min-height:100vh;background:linear-gradient(145deg,#faf9ff 0%,#f3f0ff 60%,#fdf4ff 100%);--primary-color:#6a2c91;--primary-dark:#4a1d6e;--primary-bg:#f3e8ff;--primary-border:#e9d5ff;--dark-color:#1e1b4b;--gray-color:#64748b;--danger-color:#ef4444;--warning-color:#f59e0b;--success-color:#10b981;--light-color:#f8fafc}.rp-main{display:flex;justify-content:center;padding:2rem 1.25rem;min-height:100vh}.rp-shell{width:100%;max-width:720px;display:flex;flex-direction:column;gap:1rem}.rp-tabs{display:flex;gap:.5rem;background:white;padding:.5rem;border-radius:1rem;border:1px solid #e2e8f0}.rp-tab{flex:1;display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1rem;background:transparent;border:none;border-radius:.75rem;font-size:.875rem;font-weight:600;color:var(--gray-color);cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}.rp-tab--active{background:linear-gradient(135deg,var(--primary-color),var(--primary-dark));color:white;box-shadow:0 2px 8px rgba(106,44,145,.25)}.rp-card{background:white;border-radius:1.25rem;border:1px solid #e2e8f0;padding:clamp(1.125rem,4vw,1.5rem);box-shadow:0 1px 2px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.05)}.rp-section-head{display:flex;align-items:center;gap:.75rem;margin-bottom:1.125rem;padding-bottom:.875rem;border-bottom:1px solid #f1f5f9}.rp-section-num{width:26px;height:26px;border-radius:50%;background:var(--primary-bg);border:1.5px solid var(--primary-border);color:var(--primary-color);font-size:.75rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.rp-section-title{font-size:.9375rem;font-weight:700;color:var(--dark-color);margin:0}.rp-field{display:flex;flex-direction:column;gap:.375rem}.rp-label{font-size:.813rem;font-weight:600;color:#374151}.rp-req{color:var(--primary-color)}.rp-optional{font-size:.688rem;font-weight:500;color:var(--gray-color);margin-left:.25rem}.rp-input,.rp-textarea{width:100%;padding:.75rem .875rem;border:1.5px solid #e5e7eb;border-radius:.75rem;font-size:.875rem;font-family:'DM Sans',sans-serif;color:var(--dark-color);background:var(--light-color);transition:all .2s;outline:none}.rp-textarea{resize:vertical}.rp-input:focus,.rp-textarea:focus{border-color:var(--primary-color);box-shadow:0 0 0 3px rgba(106,44,145,.1)}.rp-field-foot{display:flex;justify-content:space-between}.rp-hint{font-size:.688rem;color:#94a3b8}.rp-hint--warn{color:var(--warning-color)}.rp-category-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:.5rem}.rp-cat-btn{display:flex;align-items:center;gap:.5rem;padding:.625rem .875rem;background:var(--light-color);border:1.5px solid #e5e7eb;border-radius:.75rem;font-size:.813rem;color:#334155;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;text-align:left}.rp-cat-btn:hover{border-color:var(--primary-color);background:white}.rp-cat-btn--active{background:var(--cat-color,var(--primary-color));border-color:var(--cat-color,var(--primary-color));color:white!important}.rp-cat-btn--active .rp-cat-icon{color:white!important}.rp-severity-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}.rp-sev-btn{display:flex;align-items:center;gap:.625rem;padding:.75rem .875rem;background:var(--light-color);border:1.5px solid #e5e7eb;border-radius:.75rem;cursor:pointer;text-align:left;font-family:'DM Sans',sans-serif;transition:all .2s}.rp-sev-btn:hover{border-color:var(--primary-color);background:white}.rp-sev-btn--active{border-color:var(--sev-color);background:color-mix(in srgb,var(--sev-color)12%,white);box-shadow:0 0 0 3px color-mix(in srgb,var(--sev-color)15%,transparent)}.rp-sev-pip{width:10px;height:10px;border-radius:50%;flex-shrink:0}.rp-sev-info{flex:1}.rp-sev-label{display:block;font-size:.813rem;font-weight:700;color:var(--dark-color)}.rp-sev-desc{display:block;font-size:.688rem;color:var(--gray-color);margin-top:.1rem}.rp-sev-check{color:var(--primary-color);flex-shrink:0}.rp-loc-loading{display:flex;align-items:center;gap:.75rem;padding:1rem;background:var(--primary-bg);border-radius:.75rem;color:var(--primary-color);font-size:.813rem}.rp-loc-error{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;background:#fef2f2;border-radius:.75rem;color:var(--danger-color);font-size:.813rem;flex-wrap:wrap}.rp-retry-btn{background:var(--danger-color);color:white;border:none;padding:.25rem .75rem;border-radius:.5rem;cursor:pointer;font-size:.75rem;margin-left:auto}.rp-loc-card--fixed{background:linear-gradient(135deg,var(--primary-bg),#f0eaf5);border-color:var(--primary-color)}.rp-loc-card--additional{background:#f8fafc;border-color:#cbd5e1}.rp-loc-refresh{background:none;border:none;cursor:pointer;padding:.2rem;border-radius:.375rem;color:var(--primary-color)}.rp-loc-refresh:hover{background:rgba(106,44,145,.1);transform:rotate(180deg)}.rp-add-location-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.25rem;background:white;border:2px dashed #cbd5e1;border-radius:.75rem;font-size:.875rem;font-weight:600;color:var(--primary-color);cursor:pointer;width:100%;justify-content:center}.rp-add-location-btn:hover{border-color:var(--primary-color);background:var(--primary-bg)}.rp-loc-card{background:var(--primary-bg);border:1px solid var(--primary-border);border-radius:.75rem;padding:.875rem;margin-top:.5rem}.rp-loc-card-head{display:flex;align-items:center;gap:.5rem;margin-bottom:.625rem;padding-bottom:.5rem;border-bottom:1px solid var(--primary-border);color:var(--primary-color)}.rp-loc-card-head strong{flex:1;font-size:.813rem;color:var(--dark-color)}.rp-loc-clear{background:none;border:none;cursor:pointer;color:var(--gray-color);padding:.2rem;border-radius:.375rem}.rp-loc-clear:hover{background:rgba(239,68,68,.1);color:var(--danger-color)}.rp-loc-details{display:flex;flex-direction:column;gap:.375rem;margin-bottom:.5rem}.rp-loc-row{display:flex;gap:.625rem;font-size:.75rem}.rp-loc-row span:first-child{font-weight:600;color:#475569;min-width:60px}.rp-loc-coords{display:flex;gap:.5rem;padding-top:.5rem;border-top:1px solid var(--primary-border);font-size:.688rem;font-family:monospace;color:var(--gray-color)}.rp-loc-search{margin-bottom:.875rem}.rp-search-wrap{position:relative}.rp-search-ico{position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:#94a3b8}.rp-search-input{width:100%;padding:.75rem 1rem .75rem 2.5rem;border:1.5px solid #e5e7eb;border-radius:.75rem;font-size:.875rem;outline:none}.rp-search-input:focus{border-color:var(--primary-color);box-shadow:0 0 0 3px rgba(106,44,145,.1)}.rp-search-loading{display:flex;align-items:center;gap:.5rem;padding:.875rem;color:var(--gray-color);font-size:.813rem;justify-content:center}.rp-search-results{margin-top:.5rem;border:1px solid #e2e8f0;border-radius:.75rem;overflow:hidden}.rp-search-item{display:flex;align-items:flex-start;gap:.625rem;width:100%;padding:.75rem;background:white;border:none;border-bottom:1px solid #f1f5f9;text-align:left;cursor:pointer}.rp-search-item:last-child{border-bottom:none}.rp-search-item:hover{background:var(--primary-bg)}.rp-search-item-info strong{display:block;font-size:.813rem;color:var(--dark-color)}.rp-search-item-info span{font-size:.688rem;color:var(--gray-color)}.rp-upload-row{display:flex;align-items:center;gap:1rem;flex-wrap:wrap}.rp-upload-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.625rem 1.125rem;background:var(--light-color);border:1.5px dashed #cbd5e1;border-radius:.75rem;font-size:.813rem;cursor:pointer;color:#475569}.rp-upload-btn:hover{border-color:var(--primary-color);color:var(--primary-color);background:var(--primary-bg)}.rp-media-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:.5rem;margin-top:.875rem}.rp-media-item{position:relative;aspect-ratio:1;border-radius:.625rem;overflow:hidden}.rp-media-item img{width:100%;height:100%;object-fit:cover}.rp-media-remove{position:absolute;top:.25rem;right:.25rem;background:rgba(0,0,0,.6);border:none;color:white;padding:.25rem;border-radius:.25rem;cursor:pointer}.rp-media-remove:hover{background:var(--danger-color)}.rp-anon-label{display:flex;align-items:center;gap:.875rem;cursor:pointer}.rp-checkbox{width:17px;height:17px;accent-color:var(--primary-color)}.rp-anon-icon{width:34px;height:34px;background:var(--primary-bg);border:1px solid var(--primary-border);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--primary-color)}.rp-anon-title{display:block;font-size:.875rem;font-weight:600;color:var(--dark-color)}.rp-anon-desc{display:block;font-size:.75rem;color:var(--gray-color)}.rp-alert-error{display:flex;align-items:center;gap:.625rem;padding:.75rem 1rem;background:#fef2f2;border:1px solid #fecaca;border-radius:.75rem;color:var(--danger-color);font-size:.813rem}.rp-submit-btn{width:100%;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.9375rem 1.5rem;background:linear-gradient(135deg,var(--primary-color),var(--primary-dark));color:white;border:none;border-radius:.875rem;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(106,44,145,.3)}.rp-submit-btn:disabled{opacity:.65;cursor:not-allowed}.rp-safety-note{display:flex;align-items:flex-start;gap:.75rem;padding:.875rem 1rem;background:#fef3c7;border-radius:.75rem}.rp-safety-note p{font-size:.75rem;color:#92400e;margin:0}.rp-success{display:flex;flex-direction:column;align-items:center;text-align:center;gap:.75rem;padding:3rem 2rem}.rp-success-icon{width:80px;height:80px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--success-color)}.rp-success-title{font-family:'DM Serif Display',Georgia,serif;font-size:1.5rem;color:var(--dark-color)}.rp-spinning{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.rp-ai-card{animation:stepIn .4s ease;border-color:var(--primary-border);background:linear-gradient(135deg,var(--primary-bg),white)}.rp-ai-card--error{display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:#92400e;background:#fef3c7}.rp-ai-loading{display:flex;align-items:center;justify-content:center;gap:.75rem;padding:1.25rem;font-size:.875rem;color:var(--primary-color)}.rp-ai-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:.75rem;border-bottom:1px solid var(--primary-border)}.rp-ai-badge{display:flex;align-items:center;gap:.375rem;font-size:.8125rem;font-weight:700;color:var(--primary-color)}.rp-ai-confidence{font-size:.688rem;color:#64748b;background:white;border:1px solid #e2e8f0;padding:.2rem .625rem;border-radius:9999px}.rp-ai-severity{display:flex;align-items:center;gap:.875rem;padding:.875rem;border-radius:.875rem;border:1px solid;margin-bottom:.875rem}.rp-ai-score-ring{width:52px;height:52px;border-radius:50%;border:3px solid var(--ring-color);display:flex;flex-direction:column;align-items:center;justify-content:center;background:white}.rp-ai-score-ring span{font-size:1rem;font-weight:800}.rp-ai-category{font-size:.75rem;color:#64748b;text-transform:capitalize}.rp-ai-summary{font-size:.8125rem;color:#334155;line-height:1.6;margin-bottom:.875rem}.rp-ai-tags{display:flex;flex-wrap:wrap;gap:.375rem;margin-bottom:.875rem}.rp-ai-tag{font-size:.625rem;font-weight:500;padding:.25rem .625rem;background:white;border:1px solid var(--primary-border);color:var(--primary-color);border-radius:.375rem}.rp-ai-rec{display:flex;align-items:flex-start;gap:.625rem;padding:.75rem;background:white;border:1px solid #e2e8f0;border-radius:.75rem;margin-bottom:.875rem}.rp-ai-tips strong{display:block;font-size:.75rem;margin-bottom:.5rem}.rp-ai-tips ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:.5rem}.rp-ai-tips li{display:flex;align-items:flex-start;gap:.5rem;font-size:.75rem;color:#475569}.rp-ai-tip-dot{width:6px;height:6px;border-radius:50%;background:var(--primary-color);margin-top:.35rem}@keyframes stepIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.rp-view-header{text-align:center;margin-bottom:1rem}.rp-view-title{font-family:'DM Serif Display',Georgia,serif;font-size:1.5rem;color:var(--dark-color);margin-bottom:.25rem}.rp-view-subtitle{font-size:.875rem;color:var(--gray-color)}.rp-filters{display:flex;flex-direction:column;gap:.75rem;margin-bottom:1.5rem}.rp-search-wrap--full{width:100%}.rp-filter-group{display:flex;gap:.5rem}.rp-select{flex:1;padding:.625rem .875rem;border:1.5px solid #e5e7eb;border-radius:.75rem;font-size:.813rem;background:white;cursor:pointer}.rp-view-toggle{display:flex;gap:.25rem;background:#f1f5f9;padding:.25rem;border-radius:.5rem;align-self:flex-start}.rp-toggle-btn{padding:.375rem .625rem;background:transparent;border:none;border-radius:.375rem;cursor:pointer;color:#64748b}.rp-toggle-btn--active{background:white;color:var(--primary-color);box-shadow:0 1px 2px rgba(0,0,0,.05)}.rp-reports-container{margin-top:1rem}.rp-reports-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem}.rp-reports-list{display:flex;flex-direction:column;gap:.75rem}.rp-report-card{background:white;border:1px solid #e2e8f0;border-radius:1rem;padding:1rem;cursor:pointer;transition:all .2s;position:relative}.rp-report-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.08);border-color:var(--primary-border)}.rp-report-card--list{display:flex;flex-direction:column;gap:.5rem}.rp-report-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem}.rp-report-category{display:flex;align-items:center;gap:.375rem;font-size:.688rem;font-weight:600;text-transform:uppercase;color:var(--gray-color)}.rp-category-dot{width:8px;height:8px;border-radius:50%}.rp-report-time{font-size:.688rem;color:#94a3b8}.rp-report-title{font-size:1rem;font-weight:700;color:var(--dark-color);margin:0 0 .5rem 0}.rp-report-description{font-size:.813rem;color:#475569;line-height:1.5;margin:0 0 .75rem 0}.rp-report-footer{display:flex;justify-content:space-between;align-items:center;font-size:.688rem;color:var(--gray-color)}.rp-report-location{display:flex;align-items:center;gap:.25rem}.rp-report-stats{display:flex;gap:.5rem}.rp-report-stats span{display:flex;align-items:center;gap:.25rem}.rp-report-status{position:absolute;top:1rem;right:1rem;font-size:.625rem;font-weight:600;padding:.25rem .5rem;border-radius:.375rem}.rp-loading-reports{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:3rem}.rp-empty-state{text-align:center;padding:3rem;color:var(--gray-color)}.rp-empty-state svg{color:#cbd5e1;margin-bottom:1rem}.rp-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000;padding:1rem}.rp-modal{background:white;border-radius:1.5rem;max-width:500px;width:100%;max-height:80vh;overflow-y:auto;padding:1.5rem;position:relative}.rp-modal-close{position:absolute;top:1rem;right:1rem;background:var(--light-color);border:none;border-radius:.5rem;padding:.25rem;cursor:pointer;display:flex}.rp-modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}.rp-modal-title{font-size:1.25rem;font-weight:700;color:var(--dark-color);margin:0 0 .5rem 0}.rp-modal-meta{display:flex;flex-wrap:wrap;gap:1rem;font-size:.75rem;color:var(--gray-color);margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid #e2e8f0}.rp-modal-meta span{display:flex;align-items:center;gap:.25rem}.rp-modal-description{font-size:.875rem;color:#475569;line-height:1.6;margin-bottom:1.5rem}.rp-modal-actions{display:flex;gap:.5rem;padding-top:1rem;border-top:1px solid #e2e8f0}.rp-action-btn{display:flex;align-items:center;gap:.375rem;padding:.5rem .875rem;background:var(--light-color);border:1px solid #e5e7eb;border-radius:.5rem;font-size:.75rem;cursor:pointer}.rp-action-btn:hover{background:var(--primary-bg);border-color:var(--primary-color)}.rp-pagination{display:flex;justify-content:center;align-items:center;gap:1rem;margin-top:1.5rem;padding:1rem}.rp-page-btn{padding:.5rem 1rem;background:white;border:1px solid #e2e8f0;border-radius:.5rem;cursor:pointer;font-size:.813rem}.rp-page-btn:hover:not(:disabled){background:var(--primary-bg);border-color:var(--primary-color)}.rp-page-btn:disabled{opacity:.5;cursor:not-allowed}.rp-page-info{font-size:.813rem;color:var(--gray-color)}@media (max-width:640px){.rp-main{padding:1rem}.rp-category-grid{grid-template-columns:repeat(2,1fr)}.rp-severity-grid{grid-template-columns:1fr}.rp-reports-grid{grid-template-columns:1fr}}
</style>