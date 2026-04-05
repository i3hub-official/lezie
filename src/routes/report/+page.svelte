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
    Search
  } from 'lucide-svelte';

  // State declarations using $state
  let isSubmitting = $state(false);
  let error = $state('');
  let success = $state(false);
  let isSearchingLocation = $state(false);
  let locationSearchResults = $state<any[]>([]);
  let showLocationSearch = $state(false);
  
  // Form fields
  let title = $state('');
  let description = $state('');
  let category = $state('');
  let severity = $state('medium');
  let isAnonymous = $state(false);
  let location = $state<{ lat: number; lng: number } | null>(null);
  
  // Full location details
  let locationDetails = $state({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    displayName: ''
  });
  
  // Categories
  const categories = [
    { value: 'suspicious', label: 'Suspicious Activity', icon: AlertTriangle, color: '#F59E0B' },
    { value: 'theft', label: 'Theft / Robbery', icon: AlertOctagon, color: '#EF4444' },
    { value: 'vandalism', label: 'Vandalism', icon: Building, color: '#F97316' },
    { value: 'fire', label: 'Fire / Emergency', icon: Flame, color: '#DC2626' },
    { value: 'accident', label: 'Accident', icon: Car, color: '#F59E0B' },
    { value: 'noise', label: 'Noise Complaint', icon: Volume2, color: '#8B5CF6' },
    { value: 'other', label: 'Other', icon: MoreHorizontal, color: '#6B7280' }
  ];
  
  // Severity options
  const severityOptions = [
    { value: 'low', label: 'Low', color: '#10B981', description: 'Non-urgent, monitor situation' },
    { value: 'medium', label: 'Medium', color: '#F59E0B', description: 'Caution advised' },
    { value: 'high', label: 'High', color: '#F97316', description: 'Urgent, attention needed' },
    { value: 'critical', label: 'Critical', color: '#EF4444', description: 'Emergency, immediate action' }
  ];
  
  // Media files
  let mediaFiles = $state<File[]>([]);
  let mediaPreviews = $state<string[]>([]);
  
  onMount(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          getFullAddressFromCoords(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
        }
      );
    }
  });
  
  // Get full address from coordinates using reverse geocoding
  async function getFullAddressFromCoords(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.address) {
        const addr = data.address;
        locationDetails = {
          street: [addr.road, addr.house_number].filter(Boolean).join(' ') || addr.suburb || addr.neighbourhood || '',
          city: addr.city || addr.town || addr.village || addr.municipality || '',
          state: addr.state || addr.region || '',
          postalCode: addr.postcode || '',
          country: addr.country || '',
          displayName: data.display_name || ''
        };
        locationDetails.street = locationDetails.street || addr.road || '';
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  }
  
  // Search for locations by query
  async function searchLocation(query: string) {
    if (!query.trim() || query.length < 3) {
      locationSearchResults = [];
      return;
    }
    
    isSearchingLocation = true;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      locationSearchResults = data.map((result: any) => ({
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
        address: result.address
      }));
    } catch (err) {
      console.error('Location search error:', err);
    } finally {
      isSearchingLocation = false;
    }
  }
  
  // Select a location from search results
  function selectLocation(result: any) {
    location = { lat: result.lat, lng: result.lng };
    
    const addr = result.address || {};
    locationDetails = {
      street: [addr.road, addr.house_number].filter(Boolean).join(' ') || addr.suburb || '',
      city: addr.city || addr.town || addr.village || addr.municipality || '',
      state: addr.state || addr.region || '',
      postalCode: addr.postcode || '',
      country: addr.country || '',
      displayName: result.displayName
    };
    
    showLocationSearch = false;
    locationSearchResults = [];
  }
  
  // Get current location with full address
  async function getCurrentLocation() {
    if (navigator.geolocation) {
      error = '';
      isSearchingLocation = true;
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          await getFullAddressFromCoords(position.coords.latitude, position.coords.longitude);
          isSearchingLocation = false;
        },
        (err) => {
          error = 'Unable to get your location. Please enable location services.';
          setTimeout(() => error = '', 3000);
          isSearchingLocation = false;
        }
      );
    } else {
      error = 'Geolocation is not supported by your browser.';
      setTimeout(() => error = '', 3000);
    }
  }
  
  // Clear selected location
  function clearLocation() {
    location = null;
    locationDetails = {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      displayName: ''
    };
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
    
    // Validation
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
    if (!location) {
      error = 'Please select a location';
      setTimeout(() => error = '', 3000);
      return;
    }
    
    isSubmitting = true;
    error = '';
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('severity', severity);
      formData.append('isAnonymous', String(isAnonymous));
      formData.append('location', JSON.stringify(location));
      formData.append('locationDetails', JSON.stringify(locationDetails));
      
      mediaFiles.forEach(file => {
        formData.append('media', file);
      });
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Report submitted:', {
        title,
        description,
        category,
        severity,
        isAnonymous,
        location,
        locationDetails,
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
        Back
      </button>
      <div class="report-icon-wrapper">
        <AlertTriangle size={32} />
      </div>
      <h1 class="report-title">Report an Incident</h1>
      <p class="report-subtitle">Your report helps keep the community safe</p>
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
              style={category === cat.value ? `--category-color: ${cat.color}` : ''}
              onclick={() => category = cat.value}
            >
              <cat.icon size={18} />
              <span>{cat.label}</span>
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
              style={severity === opt.value ? `--severity-color: ${opt.color}` : ''}
              onclick={() => severity = opt.value}
            >
              <TrendingUp size={16} />
              <div class="severity-info">
                <span class="severity-label">{opt.label}</span>
                <span class="severity-desc">{opt.description}</span>
              </div>
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

      <!-- Location with Full Details -->
      <div class="form-group">
        <label class="form-label">
          Location <span class="required">*</span>
        </label>
        
        <div class="location-actions">
          <button type="button" class="location-btn-primary" onclick={getCurrentLocation} disabled={isSearchingLocation}>
            {#if isSearchingLocation}
              <Loader2 size={18} class="spinning" />
              Getting location...
            {:else}
              <Navigation size={18} />
              Use my current location
            {/if}
          </button>
          
          <button type="button" class="location-btn-secondary" onclick={() => showLocationSearch = !showLocationSearch}>
            <Search size={18} />
            Search address
          </button>
        </div>

        <!-- Location Search -->
        {#if showLocationSearch}
          <div class="location-search">
            <div class="search-input-wrapper">
              <Search size={16} class="search-icon" />
              <input
                type="text"
                placeholder="Search by street, city, or zip code..."
                class="location-search-input"
                oninput={(e) => searchLocation(e.currentTarget.value)}
              />
            </div>
            
            {#if isSearchingLocation}
              <div class="search-loading">
                <Loader2 size={20} class="spinning" />
                <span>Searching...</span>
              </div>
            {/if}
            
            {#if locationSearchResults.length > 0}
              <div class="search-results">
                {#each locationSearchResults as result}
                  <button type="button" class="search-result-item" onclick={() => selectLocation(result)}>
                    <MapPin size={16} />
                    <div class="result-details">
                      <strong>{result.displayName.split(',')[0]}</strong>
                      <span>{result.displayName}</span>
                    </div>
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        {/if}

        <!-- Selected Location Display -->
        {#if location && locationDetails.displayName}
          <div class="location-card">
            <div class="location-card-header">
              <MapPin size={18} />
              <strong>Selected Location</strong>
              <button type="button" class="location-clear" onclick={clearLocation}>
                <X size={16} />
              </button>
            </div>
            <div class="location-details-grid">
              {#if locationDetails.street}
                <div class="location-detail-item">
                  <span class="detail-label">Street:</span>
                  <span class="detail-value">{locationDetails.street}</span>
                </div>
              {/if}
              {#if locationDetails.city}
                <div class="location-detail-item">
                  <span class="detail-label">City:</span>
                  <span class="detail-value">{locationDetails.city}</span>
                </div>
              {/if}
              {#if locationDetails.state}
                <div class="location-detail-item">
                  <span class="detail-label">State:</span>
                  <span class="detail-value">{locationDetails.state}</span>
                </div>
              {/if}
              {#if locationDetails.postalCode}
                <div class="location-detail-item">
                  <span class="detail-label">Postal Code:</span>
                  <span class="detail-value">{locationDetails.postalCode}</span>
                </div>
              {/if}
              {#if locationDetails.country}
                <div class="location-detail-item">
                  <span class="detail-label">Country:</span>
                  <span class="detail-value">{locationDetails.country}</span>
                </div>
              {/if}
            </div>
            <div class="location-coords">
              <span>Lat: {location.lat.toFixed(6)}</span>
              <span>Lng: {location.lng.toFixed(6)}</span>
            </div>
          </div>
        {/if}
        
        <p class="form-hint">Your exact location helps alert nearby community members</p>
      </div>

      <!-- Media Upload -->
      <div class="form-group">
        <label class="form-label">
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
    max-width: 800px;
    margin: 0 auto;
    padding: clamp(1rem, 4vw, 2rem);
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
    padding: 0.5rem;
    margin-bottom: 1rem;
  }

  .report-icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 1rem;
    margin-bottom: 1rem;
  }

  .report-icon-wrapper svg {
    color: white;
  }

  .report-title {
    font-size: clamp(1.5rem, 5vw, 2rem);
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .report-subtitle {
    color: #64748b;
    font-size: 0.875rem;
  }

  /* Form */
  .report-form {
    background: white;
    border-radius: 1.5rem;
    padding: clamp(1.25rem, 4vw, 2rem);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    font-weight: 600;
    font-size: 0.875rem;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .required {
    color: #ef4444;
  }

  .form-input, .form-textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
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
    margin-top: 0.25rem;
    display: flex;
    justify-content: space-between;
  }

  .hint-warning {
    color: #f59e0b;
  }

  /* Category Grid */
  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
  }

  .category-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    color: #334155;
    cursor: pointer;
    transition: all 0.2s;
  }

  .category-btn:active {
    transform: scale(0.98);
  }

  .category-btn.selected {
    background: var(--category-color, var(--primary-color));
    border-color: var(--category-color, var(--primary-color));
    color: white;
  }

  /* Severity Grid */
  .severity-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .severity-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .severity-btn:active {
    transform: scale(0.99);
  }

  .severity-btn.selected {
    background: var(--severity-color, #f59e0b);
    border-color: var(--severity-color, #f59e0b);
  }

  .severity-btn.selected .severity-label,
  .severity-btn.selected .severity-desc,
  .severity-btn.selected svg {
    color: white;
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

  /* Location Actions */
  .location-actions {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .location-btn-primary, .location-btn-secondary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .location-btn-primary {
    background: var(--primary-color);
    color: white;
    border: none;
  }

  .location-btn-primary:active {
    background: var(--primary-dark);
    transform: scale(0.98);
  }

  .location-btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .location-btn-secondary {
    background: white;
    border: 1px solid #e2e8f0;
    color: #475569;
  }

  .location-btn-secondary:active {
    background: #f8fafc;
    transform: scale(0.98);
  }

  /* Location Search */
  .location-search {
    margin-bottom: 1rem;
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
    border: 1px solid #e2e8f0;
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
  }

  .search-result-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem;
    background: white;
    border: none;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s;
  }

  .search-result-item:last-child {
    border-bottom: none;
  }

  .search-result-item:active {
    background: #f8fafc;
  }

  .result-details {
    flex: 1;
    min-width: 0;
  }

  .result-details strong {
    display: block;
    font-size: 0.813rem;
    color: #0f172a;
    margin-bottom: 0.125rem;
  }

  .result-details span {
    font-size: 0.688rem;
    color: #64748b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  /* Location Card */
  .location-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-top: 0.5rem;
  }

  .location-card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .location-card-header strong {
    flex: 1;
    font-size: 0.813rem;
    color: #0f172a;
  }

  .location-clear {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 0.25rem;
    display: flex;
  }

  .location-details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .location-detail-item {
    display: flex;
    gap: 0.5rem;
    font-size: 0.75rem;
  }

  .detail-label {
    font-weight: 600;
    color: #475569;
    min-width: 70px;
  }

  .detail-value {
    color: #0f172a;
  }

  .location-coords {
    display: flex;
    gap: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid #e2e8f0;
    font-size: 0.688rem;
    font-family: monospace;
    color: #64748b;
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
    border: 1px dashed #cbd5e1;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .upload-button:active:not(.disabled) {
    background: #f1f5f9;
    transform: scale(0.98);
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
    margin-top: 1rem;
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
    margin-bottom: 1rem;
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
    padding: 0.875rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .submit-button:active:not(:disabled) {
    background: var(--primary-dark);
    transform: scale(0.98);
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
    padding: 0.875rem;
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
    font-size: 1.25rem;
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
  @media (max-width: 640px) {
    .category-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .location-actions {
      flex-direction: column;
    }

    .location-details-grid {
      grid-template-columns: 1fr;
    }

    .detail-label {
      min-width: 60px;
    }
  }
</style>