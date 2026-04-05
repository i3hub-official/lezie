<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    MapPin,
    Camera,
    X,
    AlertTriangle,
    Send,
    Navigation,
    Shield,
    EyeOff,
    CheckCircle,
    AlertCircle,
    ChevronLeft,
    Loader2,
    Flame,
    Car,
    Building,
    Volume2,
    MoreHorizontal,
    TrendingUp,
    AlertOctagon,
    Search,
    Plus,
    Trash2,
    Home,
    Store,
    Building2,
    Map,
    Clock,
    Crosshair,
    Layers,
    Check
  } from 'lucide-svelte';

  // State declarations
  let isSubmitting = $state(false);
  let error = $state('');
  let success = $state(false);
  let isSearchingLocation = $state(false);
  let locationSearchResults = $state<any[]>([]);
  let showLocationSearch = $state(false);
  let isGettingUserLocation = $state(false);
  
  // Form fields
  let title = $state('');
  let description = $state('');
  let category = $state('');
  let severity = $state('medium');
  let isAnonymous = $state(false);
  
  // User's fixed location (cannot be removed)
  let userLocation = $state<{ lat: number; lng: number; details: any } | null>(null);
  let isLoadingUserLocation = $state(true);
  let locationError = $state('');
  
  // Additional location (can be added from search, max 1)
  let additionalLocation = $state<{ lat: number; lng: number; details: any } | null>(null);
  
  // Categories
  const categories = [
    { value: 'suspicious', label: 'Suspicious Activity', icon: AlertTriangle, color: '#F59E0B', bg: '#FEF3C7' },
    { value: 'theft', label: 'Theft / Robbery', icon: AlertOctagon, color: '#EF4444', bg: '#FEE2E2' },
    { value: 'vandalism', label: 'Vandalism', icon: Building, color: '#F97316', bg: '#FFEDD5' },
    { value: 'fire', label: 'Fire / Emergency', icon: Flame, color: '#DC2626', bg: '#FEE2E2' },
    { value: 'accident', label: 'Accident', icon: Car, color: '#F59E0B', bg: '#FEF3C7' },
    { value: 'noise', label: 'Noise Complaint', icon: Volume2, color: '#8B5CF6', bg: '#EDE9FE' },
    { value: 'other', label: 'Other', icon: MoreHorizontal, color: '#6B7280', bg: '#F3F4F6' }
  ];
  
  // Severity options
  const severityOptions = [
    { value: 'low', label: 'Low', color: '#10B981', bg: '#D1FAE5', description: 'Non-urgent, monitor situation' },
    { value: 'medium', label: 'Medium', color: '#F59E0B', bg: '#FEF3C7', description: 'Caution advised' },
    { value: 'high', label: 'High', color: '#F97316', bg: '#FFEDD5', description: 'Urgent, attention needed' },
    { value: 'critical', label: 'Critical', color: '#EF4444', bg: '#FEE2E2', description: 'Emergency, immediate action' }
  ];
  
  // Media files
  let mediaFiles = $state<File[]>([]);
  let mediaPreviews = $state<string[]>([]);
  
  onMount(async () => {
    await getUserFixedLocation();
  });
  
  // Get user's fixed location (cannot be removed)
  async function getUserFixedLocation() {
    isLoadingUserLocation = true;
    locationError = '';
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const details = await getFullAddressFromCoords(lat, lng);
          userLocation = { lat, lng, details };
          isLoadingUserLocation = false;
        },
        async (err) => {
          console.error('Geolocation error:', err);
          locationError = 'Unable to get your location. Please enable location services.';
          await getFallbackLocation();
          isLoadingUserLocation = false;
        }
      );
    } else {
      locationError = 'Geolocation is not supported by your browser.';
      await getFallbackLocation();
      isLoadingUserLocation = false;
    }
  }
  
  // Fallback location using IP
  async function getFallbackLocation() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.latitude && data.longitude) {
        const lat = data.latitude;
        const lng = data.longitude;
        const details = await getFullAddressFromCoords(lat, lng);
        userLocation = { lat, lng, details };
      }
    } catch (err) {
      console.error('IP location error:', err);
    }
  }
  
  // Retry getting location
  async function retryGetLocation() {
    locationError = '';
    await getUserFixedLocation();
  }
  
  // Get full address and nearby places
  async function getFullAddressFromCoords(lat: number, lng: number) {
    try {
      // Get reverse geocoding for address
      const reverseResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const reverseData = await reverseResponse.json();
      
      // Get nearby places (within 500m)
      const nearbyResponse = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json];(node["name"] around:500,${lat},${lng};way["name"] around:500,${lat},${lng});out body;`
      );
      const nearbyData = await nearbyResponse.json();
      
      // Extract nearby places
      const nearbyPlaces = [];
      const seenNames = new Set();
      
      if (nearbyData.elements) {
        for (const element of nearbyData.elements) {
          if (element.tags && element.tags.name && !seenNames.has(element.tags.name)) {
            seenNames.add(element.tags.name);
            const placeType = element.tags.shop || element.tags.amenity || element.tags.tourism || element.tags.leisure || 'place';
            nearbyPlaces.push({
              name: element.tags.name,
              type: placeType,
              distance: calculateDistance(lat, lng, element.lat, element.lon)
            });
          }
        }
      }
      
      nearbyPlaces.sort((a, b) => a.distance - b.distance);
      
      const addr = reverseData.address || {};
      return {
        fullAddress: reverseData.display_name || '',
        street: [addr.road, addr.house_number].filter(Boolean).join(' ') || '',
        city: addr.city || addr.town || addr.village || addr.municipality || '',
        state: addr.state || addr.region || '',
        postalCode: addr.postcode || '',
        country: addr.country || '',
        neighbourhood: addr.neighbourhood || addr.suburb || '',
        road: addr.road || '',
        nearbyPlaces: nearbyPlaces.slice(0, 8)
      };
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      return {
        fullAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        neighbourhood: '',
        road: '',
        nearbyPlaces: []
      };
    }
  }
  
  // Calculate distance
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }
  
  // Search for locations
  async function searchLocation(query: string) {
    if (!query.trim() || query.length < 3) {
      locationSearchResults = [];
      return;
    }
    
    isSearchingLocation = true;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1&dedupe=1`
      );
      const data = await response.json();
      
      locationSearchResults = await Promise.all(data.map(async (result: any) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        
        const detailsResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
        );
        const detailsData = await detailsResponse.json();
        
        const addr = detailsData.address || {};
        return {
          lat,
          lon,
          displayName: result.display_name,
          category: result.category,
          type: result.type,
          details: {
            fullAddress: result.display_name,
            street: [addr.road, addr.house_number].filter(Boolean).join(' ') || '',
            city: addr.city || addr.town || addr.village || '',
            state: addr.state || '',
            postalCode: addr.postcode || '',
            country: addr.country || '',
            neighbourhood: addr.neighbourhood || addr.suburb || ''
          }
        };
      }));
    } catch (err) {
      console.error('Location search error:', err);
    } finally {
      isSearchingLocation = false;
    }
  }
  
  // Add location from search
  function addLocationFromSearch(result: any) {
    additionalLocation = {
      lat: result.lat,
      lng: result.lon,
      details: {
        ...result.details,
        displayName: result.displayName,
        category: result.category
      }
    };
    showLocationSearch = false;
    locationSearchResults = [];
  }
  
  // Remove additional location
  function removeAdditionalLocation() {
    additionalLocation = null;
  }
  
  // Handle file upload
  function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    
    const remaining = 5 - mediaFiles.length;
    const newFiles = files.slice(0, remaining);
    
    const validFiles = newFiles.filter(file => file.size <= 10 * 1024 * 1024);
    if (validFiles.length !== newFiles.length) {
      error = 'Some files exceed 10MB limit and were skipped';
      setTimeout(() => error = '', 3000);
    }
    
    mediaFiles = [...mediaFiles, ...validFiles];
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        mediaPreviews = [...mediaPreviews, e.target?.result as string];
      };
      reader.readAsDataURL(file);
    });
    
    input.value = '';
  }
  
  function removeMedia(index: number) {
    mediaFiles = mediaFiles.filter((_, i) => i !== index);
    mediaPreviews = mediaPreviews.filter((_, i) => i !== index);
  }
  
  // Submit form
  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!title.trim()) {
      error = 'Please enter a title';
      setTimeout(() => error = '', 3000);
      return;
    }
    if (title.length < 5) {
      error = 'Title must be at least 5 characters';
      setTimeout(() => error = '', 3000);
      return;
    }
    if (!description.trim()) {
      error = 'Please enter a description';
      setTimeout(() => error = '', 3000);
      return;
    }
    if (description.length < 20) {
      error = 'Please provide more details (at least 20 characters)';
      setTimeout(() => error = '', 3000);
      return;
    }
    if (!category) {
      error = 'Please select a category';
      setTimeout(() => error = '', 3000);
      return;
    }
    if (!userLocation) {
      error = 'Unable to detect your location';
      setTimeout(() => error = '', 3000);
      return;
    }
    
    isSubmitting = true;
    error = '';
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Report submitted:', {
        title,
        description,
        category,
        severity,
        isAnonymous,
        userLocation,
        additionalLocation,
        mediaCount: mediaFiles.length
      });
      
      success = true;
      
      setTimeout(() => {
        goto('/dashboard');
      }, 2000);
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to submit report';
      setTimeout(() => error = '', 3000);
    } finally {
      isSubmitting = false;
    }
  }
  
  function goBack() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Report Incident - Lezie</title>
  <meta name="description" content="Report an incident in your community. Help keep your neighbourhood safe." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
</svelte:head>

<div class="report-page">
  <div class="report-container">
    <!-- Header -->
    <div class="report-header">
      <button class="back-button" onclick={goBack}>
        <ChevronLeft size={20} />
        Back to Dashboard
      </button>
      <div class="report-icon-wrapper">
        <AlertTriangle size={32} />
      </div>
      <h1 class="report-title">Report an Incident</h1>
      <p class="report-subtitle">Your report helps keep the community safe and informed</p>
    </div>

    <!-- Success Message -->
    {#if success}
      <div class="success-state">
        <div class="success-animation">
          <CheckCircle size={64} />
        </div>
        <h2>Report Submitted Successfully!</h2>
        <p>Thank you for helping keep your community safe.</p>
        <p class="success-note">Redirecting you to dashboard...</p>
        <div class="success-spinner">
          <Loader2 size={24} class="spinning" />
        </div>
      </div>
    {:else}

    <!-- Form -->
    <form class="report-form" onsubmit={handleSubmit}>
      <div class="form-two-columns">
        <!-- Left Column -->
        <div class="form-column">
          <!-- Title -->
          <div class="form-group">
            <label class="form-label" for="title">
              Incident Title <span class="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              bind:value={title}
              class="form-input"
              placeholder="e.g., Suspicious person near school, Break-in on Main St"
              maxlength="200"
            />
            <div class="form-hint">
              <span>{title.length}/200 characters</span>
              {#if title.length < 5 && title.length > 0}
                <span class="hint-warning">Minimum 5 characters</span>
              {/if}
            </div>
          </div>

          <!-- Category -->
          <div class="form-group">
            <label class="form-label">
              Category <span class="required">*</span>
            </label>
            <div class="category-grid">
              {#each categories as cat}
                <button
                  type="button"
                  class="category-btn {category === cat.value ? 'selected' : ''}"
                  style={category === cat.value ? `--category-color: ${cat.color}; --category-bg: ${cat.bg}` : ''}
                  onclick={() => category = cat.value}
                >
                  <cat.icon size={18} />
                  <span>{cat.label}</span>
                  {#if category === cat.value}
                    <Check size={14} class="check-icon" />
                  {/if}
                </button>
              {/each}
            </div>
          </div>

          <!-- Severity -->
          <div class="form-group">
            <label class="form-label">
              Severity Level
            </label>
            <div class="severity-grid">
              {#each severityOptions as opt}
                <button
                  type="button"
                  class="severity-btn {severity === opt.value ? 'selected' : ''}"
                  style={severity === opt.value ? `--severity-color: ${opt.color}; --severity-bg: ${opt.bg}` : ''}
                  onclick={() => severity = opt.value}
                >
                  <TrendingUp size={16} />
                  <div class="severity-info">
                    <span class="severity-label">{opt.label}</span>
                    <span class="severity-desc">{opt.description}</span>
                  </div>
                  {#if severity === opt.value}
                    <Check size={14} class="check-icon" />
                  {/if}
                </button>
              {/each}
            </div>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label" for="description">
              Description <span class="required">*</span>
            </label>
            <textarea
              id="description"
              bind:value={description}
              class="form-textarea"
              rows="5"
              placeholder="Provide detailed information about what happened. Include time, people involved, and any other relevant details..."
            ></textarea>
            <div class="form-hint">
              <span>{description.length} characters</span>
              {#if description.length < 20 && description.length > 0}
                <span class="hint-warning">Minimum 20 characters</span>
              {/if}
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="form-column">
          <!-- User's Fixed Location -->
          <div class="form-group">
            <label class="form-label">
              <Home size={14} />
              Your Location <span class="required">*</span>
              <span class="fixed-badge">Fixed - Cannot be removed</span>
            </label>
            
            {#if isLoadingUserLocation}
              <div class="loading-location">
                <Loader2 size={20} class="spinning" />
                <span>Detecting your location...</span>
              </div>
            {:else if locationError}
              <div class="location-error">
                <AlertCircle size={18} />
                <span>{locationError}</span>
                <button type="button" class="retry-btn" onclick={retryGetLocation}>
                  <Crosshair size={14} />
                  Retry
                </button>
              </div>
            {:else if userLocation}
              <div class="location-card fixed-location">
                <div class="location-card-header">
                  <div class="header-icon">
                    <MapPin size={16} />
                  </div>
                  <div class="header-text">
                    <strong>Your Current Location</strong>
                    <span class="coords">{userLocation.lat.toFixed(6)}°, {userLocation.lng.toFixed(6)}°</span>
                  </div>
                </div>
                
                <div class="location-details">
                  {#if userLocation.details.fullAddress}
                    <div class="detail-row full-address">
                      <Map size={14} />
                      <span>{userLocation.details.fullAddress}</span>
                    </div>
                  {/if}
                  
                  <div class="detail-grid">
                    {#if userLocation.details.street}
                      <div class="detail-item">
                        <span class="detail-label">Street:</span>
                        <span class="detail-value">{userLocation.details.street}</span>
                      </div>
                    {/if}
                    {#if userLocation.details.neighbourhood}
                      <div class="detail-item">
                        <span class="detail-label">Neighbourhood:</span>
                        <span class="detail-value">{userLocation.details.neighbourhood}</span>
                      </div>
                    {/if}
                    {#if userLocation.details.city}
                      <div class="detail-item">
                        <span class="detail-label">City:</span>
                        <span class="detail-value">{userLocation.details.city}</span>
                      </div>
                    {/if}
                    {#if userLocation.details.state}
                      <div class="detail-item">
                        <span class="detail-label">State:</span>
                        <span class="detail-value">{userLocation.details.state}</span>
                      </div>
                    {/if}
                    {#if userLocation.details.postalCode}
                      <div class="detail-item">
                        <span class="detail-label">Postal Code:</span>
                        <span class="detail-value">{userLocation.details.postalCode}</span>
                      </div>
                    {/if}
                    {#if userLocation.details.country}
                      <div class="detail-item">
                        <span class="detail-label">Country:</span>
                        <span class="detail-value">{userLocation.details.country}</span>
                      </div>
                    {/if}
                  </div>
                </div>
                
                <!-- Nearby Places -->
                {#if userLocation.details.nearbyPlaces && userLocation.details.nearbyPlaces.length > 0}
                  <div class="nearby-section">
                    <div class="nearby-header">
                      <Layers size={14} />
                      <span>Nearby landmarks & places (within 500m)</span>
                    </div>
                    <div class="nearby-grid">
                      {#each userLocation.details.nearbyPlaces as place}
                        <div class="nearby-item">
                          <Store size={12} />
                          <span>{place.name}</span>
                          <span class="distance">{place.distance}m</span>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>

          <!-- Additional Location -->
          <div class="form-group">
            <label class="form-label">
              <Store size={14} />
              Additional Location
              <span class="optional-badge">Optional - Add one specific place</span>
            </label>
            
            {#if !additionalLocation}
              <div class="add-location-area">
                <button type="button" class="add-location-btn" onclick={() => showLocationSearch = !showLocationSearch}>
                  <Plus size={18} />
                  Add a specific location (shop, restaurant, landmark, event center)
                </button>
                
                {#if showLocationSearch}
                  <div class="location-search">
                    <div class="search-input-wrapper">
                      <Search size={16} class="search-icon" />
                      <input
                        type="text"
                        placeholder="Search for shop, restaurant, landmark, event center..."
                        class="location-search-input"
                        oninput={(e) => searchLocation(e.currentTarget.value)}
                      />
                    </div>
                    
                    {#if isSearchingLocation}
                      <div class="search-loading">
                        <Loader2 size={20} class="spinning" />
                        <span>Searching places...</span>
                      </div>
                    {/if}
                    
                    {#if locationSearchResults.length > 0}
                      <div class="search-results">
                        {#each locationSearchResults as result}
                          <button type="button" class="search-result-item" onclick={() => addLocationFromSearch(result)}>
                            <MapPin size={16} class="result-icon" />
                            <div class="result-info">
                              <strong>{result.displayName.split(',')[0]}</strong>
                              <span>{result.details.city || result.details.state}</span>
                              <span class="result-address">{result.details.street}</span>
                            </div>
                          </button>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            {:else}
              <div class="location-card additional-location">
                <div class="location-card-header">
                  <div class="header-icon">
                    <MapPin size={16} />
                  </div>
                  <div class="header-text">
                    <strong>{additionalLocation.details.displayName.split(',')[0]}</strong>
                    <span class="coords">{additionalLocation.lat.toFixed(6)}°, {additionalLocation.lng.toFixed(6)}°</span>
                  </div>
                  <button type="button" class="remove-btn" onclick={removeAdditionalLocation}>
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div class="location-details">
                  {#if additionalLocation.details.fullAddress}
                    <div class="detail-row">
                      <Map size={14} />
                      <span>{additionalLocation.details.fullAddress}</span>
                    </div>
                  {/if}
                  <div class="detail-grid">
                    {#if additionalLocation.details.street}
                      <div class="detail-item">
                        <span class="detail-label">Street:</span>
                        <span class="detail-value">{additionalLocation.details.street}</span>
                      </div>
                    {/if}
                    {#if additionalLocation.details.city}
                      <div class="detail-item">
                        <span class="detail-label">City:</span>
                        <span class="detail-value">{additionalLocation.details.city}</span>
                      </div>
                    {/if}
                    {#if additionalLocation.details.state}
                      <div class="detail-item">
                        <span class="detail-label">State:</span>
                        <span class="detail-value">{additionalLocation.details.state}</span>
                      </div>
                    {/if}
                  </div>
                </div>
              </div>
            {/if}
          </div>

          <!-- Media Upload -->
          <div class="form-group">
            <label class="form-label">
              <Camera size={14} />
              Photos & Videos
            </label>
            <div class="upload-area">
              <label class="upload-button {mediaFiles.length >= 5 ? 'disabled' : ''}">
                <Camera size={20} />
                <span>Add Media</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  hidden
                  onchange={handleFileUpload}
                  disabled={mediaFiles.length >= 5}
                />
              </label>
              <p class="upload-hint">{mediaFiles.length}/5 files (max 10MB each)</p>
            </div>

            {#if mediaPreviews.length > 0}
              <div class="media-grid">
                {#each mediaPreviews as preview, index}
                  <div class="media-item">
                    <img src={preview} alt="Preview" class="media-preview" />
                    <button type="button" class="remove-media" onclick={() => removeMedia(index)}>
                      <X size={16} />
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Anonymous Option -->
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" bind:checked={isAnonymous} class="checkbox" />
              <EyeOff size={16} />
              <span>Report anonymously</span>
            </label>
            <p class="form-hint">Your identity will be hidden from public view</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      {#if error}
        <div class="error-message">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      {/if}

      <!-- Submit Button -->
      <div class="form-actions">
        <button type="submit" class="submit-button" disabled={isSubmitting}>
          {#if isSubmitting}
            <Loader2 size={18} class="spinning" />
            Submitting Report...
          {:else}
            <Send size={18} />
            Submit Report
          {/if}
        </button>
      </div>

      <!-- Safety Note -->
      <div class="safety-note">
        <Shield size={18} />
        <div>
          <strong>Emergency?</strong> If this is an emergency, call your local emergency services immediately.
        </div>
      </div>
    </form>
    {/if}
  </div>
</div>

<style>
  .report-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);
  }

  .report-container {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: clamp(1rem, 3vw, 2rem);
  }

  /* Header */
  .report-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #64748b;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .back-button:hover {
    background: #f1f5f9;
    color: var(--primary-color);
  }

  .report-icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 8px 24px rgba(106, 44, 145, 0.2);
  }

  .report-icon-wrapper svg {
    color: white;
  }

  .report-title {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .report-subtitle {
    color: #64748b;
    font-size: 0.875rem;
  }

  /* Form - Two Columns for Desktop */
  .report-form {
    background: white;
    border-radius: 1.5rem;
    padding: clamp(1.5rem, 4vw, 2rem);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
  }

  .form-two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .form-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
    color: #0f172a;
    margin-bottom: 0.75rem;
  }

  .required {
    color: #ef4444;
  }

  .fixed-badge, .optional-badge {
    font-size: 0.625rem;
    font-weight: 500;
    padding: 0.1875rem 0.5rem;
    border-radius: 20px;
    background: #f1f5f9;
    color: #64748b;
  }

  .fixed-badge {
    background: #dbeafe;
    color: #2563eb;
  }

  .form-input, .form-textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-family: inherit;
    transition: all 0.2s;
  }

  .form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(106, 44, 145, 0.1);
  }

  .form-hint {
    font-size: 0.688rem;
    color: #94a3b8;
    margin-top: 0.375rem;
  }

  .hint-warning {
    color: #f59e0b;
  }

  /* Category Grid */
  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem;
  }

  .category-btn {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 500;
    color: #334155;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .category-btn:hover {
    border-color: var(--primary-color);
    background: #f5f3ff;
  }

  .category-btn.selected {
    background: var(--category-bg, #f5f3ff);
    border-color: var(--category-color, var(--primary-color));
    color: var(--category-color, var(--primary-color));
  }

  .check-icon {
    margin-left: auto;
    color: currentColor;
  }

  /* Severity Grid */
  .severity-grid {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .severity-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .severity-btn:hover {
    border-color: var(--primary-color);
  }

  .severity-btn.selected {
    background: var(--severity-bg, #fef3c7);
    border-color: var(--severity-color, #f59e0b);
  }

  .severity-info {
    flex: 1;
  }

  .severity-label {
    display: block;
    font-size: 0.813rem;
    font-weight: 600;
    color: #0f172a;
  }

  .severity-desc {
    display: block;
    font-size: 0.688rem;
    color: #64748b;
  }

  /* Location Cards */
  .loading-location {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.75rem;
    color: #64748b;
  }

  .location-error {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #fef2f2;
    border-radius: 0.75rem;
    color: #dc2626;
    font-size: 0.813rem;
  }

  .retry-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-left: auto;
    padding: 0.375rem 0.75rem;
    background: white;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    font-size: 0.688rem;
    cursor: pointer;
    color: #dc2626;
  }

  .location-card {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 1rem;
    overflow: hidden;
  }

  .fixed-location {
    border-left: 4px solid #2563eb;
  }

  .additional-location {
    border-left: 4px solid #10b981;
  }

  .location-card-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    background: white;
    border-bottom: 1px solid #e2e8f0;
  }

  .header-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    border-radius: 0.5rem;
    color: #64748b;
  }

  .header-text {
    flex: 1;
  }

  .header-text strong {
    display: block;
    font-size: 0.875rem;
    color: #0f172a;
    margin-bottom: 0.125rem;
  }

  .coords {
    font-size: 0.625rem;
    font-family: monospace;
    color: #94a3b8;
  }

  .remove-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 0.375rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }

  .remove-btn:hover {
    background: #fee2e2;
    color: #dc2626;
  }

  .location-details {
    padding: 1rem;
  }

  .full-address {
    background: white;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.75rem;
    color: #475569;
    border: 1px solid #e2e8f0;
  }

  .detail-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #475569;
    margin-bottom: 0.5rem;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .detail-item {
    display: flex;
    gap: 0.5rem;
    font-size: 0.688rem;
  }

  .detail-label {
    font-weight: 600;
    color: #64748b;
    min-width: 80px;
  }

  .detail-value {
    color: #0f172a;
  }

  /* Nearby Places */
  .nearby-section {
    padding: 1rem;
    border-top: 1px solid #e2e8f0;
    background: white;
  }

  .nearby-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.688rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.75rem;
  }

  .nearby-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.5rem;
  }

  .nearby-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.688rem;
    color: #475569;
    background: #f8fafc;
    padding: 0.375rem 0.625rem;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .distance {
    margin-left: auto;
    font-size: 0.563rem;
    color: #94a3b8;
  }

  /* Add Location */
  .add-location-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.875rem;
    background: #f8fafc;
    border: 1.5px dashed #cbd5e1;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 500;
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.2s;
  }

  .add-location-btn:hover {
    background: #f5f3ff;
    border-color: var(--primary-color);
  }

  /* Search */
  .location-search {
    margin-top: 0.75rem;
  }

  .search-input-wrapper {
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }

  .location-search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.875rem;
  }

  .location-search-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(106, 44, 145, 0.1);
  }

  .search-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    color: #64748b;
  }

  .search-results {
    margin-top: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    overflow: hidden;
    max-height: 280px;
    overflow-y: auto;
  }

  .search-result-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: white;
    border: none;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s;
  }

  .search-result-item:hover {
    background: #f8fafc;
  }

  .result-icon {
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: #94a3b8;
  }

  .result-info {
    flex: 1;
  }

  .result-info strong {
    display: block;
    font-size: 0.813rem;
    color: #0f172a;
  }

  .result-info span {
    display: block;
    font-size: 0.688rem;
    color: #64748b;
  }

  .result-address {
    font-size: 0.625rem !important;
    color: #94a3b8 !important;
  }

  /* Upload */
  .upload-area {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .upload-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: #f8fafc;
    border: 1.5px dashed #cbd5e1;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .upload-button:hover:not(.disabled) {
    background: #f5f3ff;
    border-color: var(--primary-color);
  }

  .upload-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .upload-hint {
    font-size: 0.688rem;
    color: #94a3b8;
  }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .media-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .media-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-media {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background: rgba(0, 0, 0, 0.6);
    border: none;
    color: white;
    padding: 0.25rem;
    border-radius: 0.25rem;
    cursor: pointer;
    display: flex;
  }

  /* Checkbox */
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.813rem;
    color: #0f172a;
  }

  .checkbox {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    accent-color: var(--primary-color);
  }

  /* Error */
  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.75rem;
    color: #dc2626;
    font-size: 0.813rem;
    margin: 1rem 0;
  }

  /* Submit */
  .form-actions {
    margin-top: 1.5rem;
  }

  .submit-button {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(106, 44, 145, 0.3);
  }

  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Safety Note */
  .safety-note {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    background: #fef3c7;
    border-radius: 0.75rem;
    margin-top: 1rem;
    font-size: 0.75rem;
    color: #92400e;
  }

  /* Success State */
  .success-state {
    text-align: center;
    padding: 3rem 2rem;
    background: white;
    border-radius: 1.5rem;
    animation: fadeInUp 0.5s ease;
  }

  .success-animation svg {
    color: #10b981;
    animation: scaleUp 0.5s ease;
  }

  .success-state h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .success-state p {
    color: #64748b;
  }

  .success-note {
    font-size: 0.75rem;
  }

  .success-spinner {
    margin-top: 1rem;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleUp {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  /* Mobile Responsive */
  @media (max-width: 900px) {
    .form-two-columns {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  @media (max-width: 640px) {
    .category-grid {
      grid-template-columns: 1fr;
    }

    .detail-grid {
      grid-template-columns: 1fr;
    }

    .nearby-grid {
      grid-template-columns: 1fr;
    }

    .detail-label {
      min-width: 70px;
    }
  }
</style>
