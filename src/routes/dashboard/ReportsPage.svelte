<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    MapPin, Camera, X, AlertTriangle, Send, Navigation, Shield,
    EyeOff, CheckCircle, AlertCircle, ChevronLeft, Loader2,
    Flame, Car, Building, Volume2, MoreHorizontal, TrendingUp,
    AlertOctagon, Search, Bell, Users, PlusCircle, Trash2
  } from 'lucide-svelte';

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
  
  // User's fixed location (auto-detected, cannot be edited)
  let userLocation = $state<{ lat: number; lng: number } | null>(null);
  let userLocationDetails = $state({
    street: '', city: '', state: '', postalCode: '', country: '', displayName: ''
  });
  let isGettingUserLocation = $state(false);
  
  // Additional location (optional, user can add one more)
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
    { value: 'theft',      label: 'Theft / Robbery',     icon: AlertOctagon,  color: '#EF4444' },
    { value: 'vandalism',  label: 'Vandalism',           icon: Building,      color: '#F97316' },
    { value: 'fire',       label: 'Fire / Emergency',    icon: Flame,         color: '#DC2626' },
    { value: 'accident',   label: 'Accident',            icon: Car,           color: '#F59E0B' },
    { value: 'noise',      label: 'Noise Complaint',     icon: Volume2,       color: '#8B5CF6' },
    { value: 'other',      label: 'Other',               icon: MoreHorizontal,color: '#6B7280' }
  ];

  const severityOptions = [
    { value: 'low',      label: 'Low',      color: '#10B981', description: 'Non-urgent, monitor situation' },
    { value: 'medium',   label: 'Medium',   color: '#F59E0B', description: 'Caution advised' },
    { value: 'high',     label: 'High',     color: '#F97316', description: 'Urgent, attention needed' },
    { value: 'critical', label: 'Critical', color: '#EF4444', description: 'Emergency, immediate action' }
  ];

  let mediaFiles = $state<File[]>([]);
  let mediaPreviews = $state<string[]>([]);

  // On mount: auto-get user's real-time location
  onMount(() => {
    getUserRealTimeLocation();
  });

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
      // Prepare report data with both locations (if additional exists)
      const reportData = {
        title,
        description,
        category,
        severity,
        isAnonymous,
        userLocation: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          address: userLocationDetails
        },
        additionalLocation: additionalLocation ? {
          lat: additionalLocation.lat,
          lng: additionalLocation.lng,
          address: additionalLocationDetails
        } : null,
        mediaFiles: mediaFiles.map(f => f.name)
      };
      console.log('Submitting report:', reportData);
      
      await new Promise(r => setTimeout(r, 1500));
      success = true;
      setTimeout(() => goto('/dashboard'), 2000);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to submit report';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="rp-page">

  <!-- Main Form Container -->
  <main class="rp-main">
    <div class="rp-shell">

      <!-- Back + Header -->
      <div class="rp-form-header">
        <p class="rp-form-subtitle">Your report helps keep the community safe</p>
      </div>

      <!-- Success State -->
      {#if success}
        <div class="rp-card rp-success">
          <div class="rp-success-icon">
            <CheckCircle size={44} strokeWidth={1.5} />
          </div>
          <h2 class="rp-success-title">Report Submitted Successfully!</h2>
          <p class="rp-success-body">Thank you for contributing to community safety.</p>
          <p class="rp-success-note">Redirecting to dashboard…</p>
          <Loader2 size={20} class="rp-spinning" />
        </div>

      {:else}
        <form onsubmit={handleSubmit}>

          <!-- Error Banner -->
          {#if error}
            <div class="rp-alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          {/if}

          <!-- Title -->
          <div class="rp-card rp-section">
            <div class="rp-section-head">
              <div class="rp-section-num">1</div>
              <h3 class="rp-section-title">Incident Title <span class="rp-req">*</span></h3>
            </div>
            <div class="rp-field">
              <label class="rp-label" for="title">Brief title</label>
              <input
                id="title"
                type="text"
                bind:value={title}
                class="rp-input"
                placeholder="e.g., Suspicious person near school, Break-in on Main St"
                maxlength="200"
              />
              <div class="rp-field-foot">
                <span class="rp-hint">{title.length}/200 characters</span>
                {#if title.length > 0 && title.length < 5}
                  <span class="rp-hint rp-hint--warn">Minimum 5 characters required</span>
                {/if}
              </div>
            </div>
          </div>

          <!-- Category -->
          <div class="rp-card rp-section">
            <div class="rp-section-head">
              <div class="rp-section-num">2</div>
              <h3 class="rp-section-title">Category <span class="rp-req">*</span></h3>
            </div>
            <div class="rp-category-grid">
              {#each categories as cat}
                <button
                  type="button"
                  class="rp-cat-btn {category === cat.value ? 'rp-cat-btn--active' : ''}"
                  style={category === cat.value ? `--cat-color:${cat.color}` : ''}
                  onclick={() => category = cat.value}
                >
                  <span class="rp-cat-icon" style={category === cat.value ? '' : `color:${cat.color}`}>
                    <svelte:component this={cat.icon} size={17} />
                  </span>
                  <span>{cat.label}</span>
                </button>
              {/each}
            </div>
          </div>

          <!-- Severity -->
          <div class="rp-card rp-section">
            <div class="rp-section-head">
              <div class="rp-section-num">3</div>
              <h3 class="rp-section-title">Severity Level</h3>
            </div>
            <div class="rp-severity-grid">
              {#each severityOptions as opt}
                <button
                  type="button"
                  class="rp-sev-btn {severity === opt.value ? 'rp-sev-btn--active' : ''}"
                  style={severity === opt.value ? `--sev-color:${opt.color}` : ''}
                  onclick={() => severity = opt.value}
                >
                  <span class="rp-sev-pip" style="background:{opt.color}"></span>
                  <div class="rp-sev-info">
                    <span class="rp-sev-label">{opt.label}</span>
                    <span class="rp-sev-desc">{opt.description}</span>
                  </div>
                  {#if severity === opt.value}
                    <CheckCircle size={15} class="rp-sev-check" />
                  {/if}
                </button>
              {/each}
            </div>
          </div>

          <!-- Description -->
          <div class="rp-card rp-section">
            <div class="rp-section-head">
              <div class="rp-section-num">4</div>
              <h3 class="rp-section-title">Description <span class="rp-req">*</span></h3>
            </div>
            <div class="rp-field">
              <label class="rp-label" for="description">What happened?</label>
              <textarea
                id="description"
                bind:value={description}
                class="rp-textarea"
                rows="5"
                placeholder="Describe what happened — include time, people involved, vehicles, and any other relevant details…"
              ></textarea>
              <div class="rp-field-foot">
                <span class="rp-hint">{description.length} characters</span>
                {#if description.length > 0 && description.length < 20}
                  <span class="rp-hint rp-hint--warn">Minimum 20 characters required</span>
                {/if}
              </div>
            </div>
          </div>

          <!-- User's Fixed Location (Auto-detected, cannot be edited) -->
          <div class="rp-card rp-section">
            <div class="rp-section-head">
              <div class="rp-section-num">5</div>
              <h3 class="rp-section-title">Your Location <span class="rp-req">*</span></h3>
            </div>

            {#if isGettingUserLocation}
              <div class="rp-loc-loading">
                <Loader2 size={20} class="rp-spinning" />
                <span>Getting your real-time location...</span>
              </div>
            {:else if userLocation}
              <div class="rp-loc-card rp-loc-card--fixed">
                <div class="rp-loc-card-head">
                  <Navigation size={15} />
                  <strong>Your Current Location (Auto-detected)</strong>
                  <button 
                    type="button" 
                    class="rp-loc-refresh" 
                    onclick={getUserRealTimeLocation}
                    title="Refresh location"
                  >
                    <Loader2 size={14} />
                  </button>
                </div>
                <div class="rp-loc-details">
                  {#if userLocationDetails.street}<div class="rp-loc-row"><span>Street</span><span>{userLocationDetails.street}</span></div>{/if}
                  {#if userLocationDetails.city}<div class="rp-loc-row"><span>City</span><span>{userLocationDetails.city}</span></div>{/if}
                  {#if userLocationDetails.state}<div class="rp-loc-row"><span>State</span><span>{userLocationDetails.state}</span></div>{/if}
                  {#if userLocationDetails.postalCode}<div class="rp-loc-row"><span>Postcode</span><span>{userLocationDetails.postalCode}</span></div>{/if}
                  {#if userLocationDetails.country}<div class="rp-loc-row"><span>Country</span><span>{userLocationDetails.country}</span></div>{/if}
                </div>
                <div class="rp-loc-coords">
                  <span>Lat {userLocation.lat.toFixed(6)}</span>
                  <span>·</span>
                  <span>Lng {userLocation.lng.toFixed(6)}</span>
                </div>
              </div>
            {:else}
              <div class="rp-loc-error">
                <AlertCircle size={16} />
                <span>Unable to get your location.</span>
                <button type="button" class="rp-retry-btn" onclick={getUserRealTimeLocation}>
                  Retry
                </button>
              </div>
            {/if}
          </div>

          <!-- Additional Location (Optional, only one can be added) -->
          <div class="rp-card rp-section">
            <div class="rp-section-head">
              <div class="rp-section-num">6</div>
              <h3 class="rp-section-title">Additional Location <span class="rp-optional">optional</span></h3>
            </div>

            {#if !additionalLocation}
              <div class="rp-add-location-btn-wrap">
                <button 
                  type="button" 
                  class="rp-add-location-btn"
                  onclick={() => showAdditionalLocationSearch = !showAdditionalLocationSearch}
                >
                  <PlusCircle size={16} />
                  <span>Add one more location</span>
                </button>
                <p class="rp-hint">Add a related location if the incident spans multiple areas</p>
              </div>
            {/if}

            {#if showAdditionalLocationSearch && !additionalLocation}
              <div class="rp-loc-search">
                <div class="rp-search-wrap">
                  <Search size={15} class="rp-search-ico" />
                  <input
                    type="text"
                    placeholder="Search by street, city, or postcode…"
                    class="rp-search-input"
                    bind:value={additionalLocationSearchQuery}
                    oninput={(e) => searchAdditionalLocation(e.currentTarget.value)}
                  />
                </div>
                {#if isSearchingAdditionalLocation}
                  <div class="rp-search-loading"><Loader2 size={18} class="rp-spinning" /> Searching…</div>
                {/if}
                {#if additionalLocationSearchResults.length > 0}
                  <div class="rp-search-results">
                    {#each additionalLocationSearchResults as result}
                      <button type="button" class="rp-search-item" onclick={() => selectAdditionalLocation(result)}>
                        <MapPin size={14} />
                        <div class="rp-search-item-info">
                          <strong>{result.displayName.split(',')[0]}</strong>
                          <span>{result.displayName}</span>
                        </div>
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}

            {#if additionalLocation && additionalLocationDetails.displayName}
              <div class="rp-loc-card rp-loc-card--additional">
                <div class="rp-loc-card-head">
                  <MapPin size={15} />
                  <strong>Additional Location</strong>
                  <button type="button" class="rp-loc-clear" onclick={removeAdditionalLocation}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div class="rp-loc-details">
                  {#if additionalLocationDetails.street}<div class="rp-loc-row"><span>Street</span><span>{additionalLocationDetails.street}</span></div>{/if}
                  {#if additionalLocationDetails.city}<div class="rp-loc-row"><span>City</span><span>{additionalLocationDetails.city}</span></div>{/if}
                  {#if additionalLocationDetails.state}<div class="rp-loc-row"><span>State</span><span>{additionalLocationDetails.state}</span></div>{/if}
                  {#if additionalLocationDetails.postalCode}<div class="rp-loc-row"><span>Postcode</span><span>{additionalLocationDetails.postalCode}</span></div>{/if}
                  {#if additionalLocationDetails.country}<div class="rp-loc-row"><span>Country</span><span>{additionalLocationDetails.country}</span></div>{/if}
                </div>
                <div class="rp-loc-coords">
                  <span>Lat {additionalLocation.lat.toFixed(6)}</span>
                  <span>·</span>
                  <span>Lng {additionalLocation.lng.toFixed(6)}</span>
                </div>
              </div>
            {/if}
          </div>

          <!-- Media Upload -->
          <div class="rp-card rp-section">
            <div class="rp-section-head">
              <div class="rp-section-num">7</div>
              <h3 class="rp-section-title">Photos & Videos <span class="rp-optional">optional</span></h3>
            </div>
            <div class="rp-upload-row">
              <label class="rp-upload-btn {mediaFiles.length >= 5 ? 'rp-upload-btn--disabled' : ''}">
                <Camera size={18} />
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
              <p class="rp-hint">{mediaFiles.length}/5 files · max 10 MB each</p>
            </div>
            {#if mediaPreviews.length > 0}
              <div class="rp-media-grid">
                {#each mediaPreviews as preview, i}
                  <div class="rp-media-item">
                    <img src={preview} alt="Preview" />
                    <button type="button" class="rp-media-remove" onclick={() => removeMedia(i)}>
                      <X size={14} />
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Anonymous Option -->
          <div class="rp-card rp-section rp-anon-section">
            <label class="rp-anon-label">
              <input type="checkbox" bind:checked={isAnonymous} class="rp-checkbox" />
              <div class="rp-anon-icon"><EyeOff size={16} /></div>
              <div>
                <span class="rp-anon-title">Report anonymously</span>
                <span class="rp-anon-desc">Your identity will be hidden from public view</span>
              </div>
            </label>
          </div>

          <!-- Submit Button -->
          <button type="submit" disabled={isSubmitting || !userLocation} class="rp-submit-btn">
            {#if isSubmitting}
              <Loader2 size={18} class="rp-spinning" /> Submitting Report…
            {:else if !userLocation}
              <AlertCircle size={18} /> Waiting for location…
            {:else}
              <Send size={18} /> Submit Report
            {/if}
          </button>

          <!-- Safety Note -->
          <div class="rp-safety-note">
            <AlertTriangle size={16} />
            <p><strong>Emergency?</strong> Call local emergency services immediately — do not wait to submit this report.</p>
          </div>

        </form>
      {/if}

    </div>
  </main>
</div>

<style>
  /* All existing styles remain exactly the same */
  :global(.rp-page *) {
    font-family: 'DM Sans', system-ui, sans-serif;
    box-sizing: border-box;
  }

  .rp-page {
    min-height: 100vh;
    background: var(--light-color);
  }

  .rp-main {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 2rem 1.25rem;
    min-height: 100vh;
  }

  .rp-shell {
    width: 100%;
    max-width: 620px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .rp-panel { display: none; }

  /* Header */
  .rp-form-header { text-align: center; margin-bottom: .5rem; }

  .rp-back-btn {
    display: inline-flex; align-items: center; gap: .375rem;
    background: none; border: none; color: var(--gray-color);
    font-size: .813rem; cursor: pointer; padding: .375rem .5rem;
    border-radius: .5rem; margin-bottom: .75rem;
    font-family: 'DM Sans', sans-serif; transition: color .2s;
  }

  .rp-back-btn:hover { color: var(--primary-color); }

  .rp-form-title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(1.625rem, 4vw, 2rem);
    color: var(--dark-color); margin-bottom: .25rem; letter-spacing: -.02em;
  }

  .rp-form-subtitle { font-size: .875rem; color: var(--gray-color); }

  /* Card */
  .rp-card {
    background: white;
    border-radius: 1.25rem;
    border: 1px solid #e2e8f0;
    padding: clamp(1.125rem, 4vw, 1.5rem);
    box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.05);
  }

  /* Section header */
  .rp-section-head {
    display: flex; align-items: center; gap: .75rem;
    margin-bottom: 1.125rem; padding-bottom: .875rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .rp-section-num {
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--primary-bg); border: 1.5px solid var(--primary-border);
    color: var(--primary-color); font-size: .75rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .rp-section-title {
    font-size: .9375rem; font-weight: 700; color: var(--dark-color); margin: 0;
  }

  /* Field */
  .rp-field { display: flex; flex-direction: column; gap: .375rem; }

  .rp-label { font-size: .813rem; font-weight: 600; color: #374151; }
  .rp-req { color: var(--primary-color); }
  .rp-optional { font-size: .688rem; font-weight: 500; color: var(--gray-color); margin-left: .25rem; }

  .rp-input, .rp-textarea {
    width: 100%; padding: .75rem .875rem;
    border: 1.5px solid #e5e7eb; border-radius: .75rem;
    font-size: .875rem; font-family: 'DM Sans', sans-serif;
    color: var(--dark-color); background: var(--light-color);
    transition: border-color .2s, box-shadow .2s, background .2s;
    outline: none; -webkit-appearance: none;
  }

  .rp-textarea { resize: vertical; }

  .rp-input:hover, .rp-textarea:hover { border-color: var(--primary-border); background: white; }
  .rp-input:focus, .rp-textarea:focus {
    border-color: var(--primary-color); background: white;
    box-shadow: 0 0 0 3px rgba(106,44,145,.1);
  }

  .rp-field-foot { display: flex; justify-content: space-between; }

  .rp-hint { font-size: .688rem; color: #94a3b8; margin-top: .125rem; }
  .rp-hint--warn { color: var(--warning-color); }

  /* Category grid */
  .rp-category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
    gap: .5rem;
  }

  .rp-cat-btn {
    display: flex; align-items: center; gap: .5rem;
    padding: .625rem .875rem;
    background: var(--light-color); border: 1.5px solid #e5e7eb;
    border-radius: .75rem; font-size: .813rem; color: #334155;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all .2s; text-align: left;
  }

  .rp-cat-btn:hover { border-color: var(--primary-color); background: white; }
  .rp-cat-btn:active { transform: scale(.98); }

  .rp-cat-btn--active {
    background: var(--cat-color, var(--primary-color));
    border-color: var(--cat-color, var(--primary-color));
    color: white !important;
  }

  .rp-cat-btn--active span,
  .rp-cat-btn--active:hover,
  .rp-cat-btn--active:active,
  .rp-cat-btn--active:focus {
    color: white !important;
    background: var(--cat-color, var(--primary-color));
  }

  .rp-cat-btn--active .rp-cat-icon { color: white !important; }

  /* Severity grid */
  .rp-severity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; }

  .rp-sev-btn {
    display: flex; align-items: center; gap: .625rem;
    padding: .75rem .875rem;
    background: var(--light-color); border: 1.5px solid #e5e7eb;
    border-radius: .75rem; cursor: pointer; text-align: left;
    font-family: 'DM Sans', sans-serif; transition: all .2s;
  }

  .rp-sev-btn:hover { border-color: var(--primary-color); background: white; }
  .rp-sev-btn:active { transform: scale(.99); }

  .rp-sev-btn--active {
    border-color: var(--sev-color);
    background: color-mix(in srgb, var(--sev-color) 12%, white);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--sev-color) 15%, transparent);
  }

  .rp-sev-btn--active:hover,
  .rp-sev-btn--active:active,
  .rp-sev-btn--active:focus {
    background: color-mix(in srgb, var(--sev-color) 12%, white);
    border-color: var(--sev-color);
  }

  .rp-sev-btn--active .rp-sev-label { color: var(--dark-color) !important; }
  .rp-sev-btn--active .rp-sev-desc  { color: var(--gray-color) !important; }

  .rp-sev-pip {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
  }

  .rp-sev-info { flex: 1; }
  .rp-sev-label { display: block; font-size: .813rem; font-weight: 700; color: var(--dark-color); }
  .rp-sev-desc  { display: block; font-size: .688rem; color: var(--gray-color); margin-top: .1rem; }

  :global(.rp-sev-check) { color: var(--primary-color); flex-shrink: 0; }

  /* Location styles */
  .rp-loc-loading {
    display: flex; align-items: center; gap: .75rem;
    padding: 1rem; background: var(--primary-bg);
    border-radius: .75rem; color: var(--primary-color);
    font-size: .813rem;
  }

  .rp-loc-error {
    display: flex; align-items: center; gap: .75rem;
    padding: .75rem 1rem; background: #fef2f2;
    border-radius: .75rem; color: var(--danger-color);
    font-size: .813rem; flex-wrap: wrap;
  }

  .rp-retry-btn {
    background: var(--danger-color); color: white;
    border: none; padding: .25rem .75rem;
    border-radius: .5rem; cursor: pointer;
    font-size: .75rem; font-family: 'DM Sans', sans-serif;
    margin-left: auto;
  }

  .rp-retry-btn:hover { opacity: .9; }

  .rp-loc-card--fixed {
    background: linear-gradient(135deg, var(--primary-bg) 0%, #f0eaf5 100%);
    border-color: var(--primary-color);
  }

  .rp-loc-card--additional {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  .rp-loc-refresh {
    background: none; border: none;
    cursor: pointer; padding: .2rem;
    border-radius: .375rem; color: var(--primary-color);
    transition: all .2s;
  }

  .rp-loc-refresh:hover {
    background: rgba(106,44,145,.1);
    transform: rotate(180deg);
  }

  .rp-add-location-btn-wrap {
    text-align: center;
  }

  .rp-add-location-btn {
    display: inline-flex; align-items: center; gap: .5rem;
    padding: .75rem 1.25rem;
    background: white; border: 2px dashed #cbd5e1;
    border-radius: .75rem; font-size: .875rem;
    font-weight: 600; color: var(--primary-color);
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all .2s; width: 100%; justify-content: center;
  }

  .rp-add-location-btn:hover {
    border-color: var(--primary-color);
    background: var(--primary-bg);
  }

  .rp-loc-card {
    background: var(--primary-bg); border: 1px solid var(--primary-border);
    border-radius: .75rem; padding: .875rem; margin-top: .5rem;
  }

  .rp-loc-card-head {
    display: flex; align-items: center; gap: .5rem;
    margin-bottom: .625rem; padding-bottom: .5rem;
    border-bottom: 1px solid var(--primary-border);
    color: var(--primary-color);
  }

  .rp-loc-card-head strong { flex: 1; font-size: .813rem; color: var(--dark-color); }

  .rp-loc-clear {
    background: none; border: none; cursor: pointer;
    color: var(--gray-color); padding: .2rem; display: flex;
    border-radius: .375rem; transition: all .2s;
  }

  .rp-loc-clear:hover { background: rgba(239,68,68,.1); color: var(--danger-color); }

  .rp-loc-details { display: flex; flex-direction: column; gap: .375rem; margin-bottom: .5rem; }

  .rp-loc-row { display: flex; gap: .625rem; font-size: .75rem; }
  .rp-loc-row span:first-child { font-weight: 600; color: #475569; min-width: 60px; }
  .rp-loc-row span:last-child { color: var(--dark-color); }

  .rp-loc-coords {
    display: flex; gap: .5rem; padding-top: .5rem;
    border-top: 1px solid var(--primary-border);
    font-size: .688rem; font-family: monospace; color: var(--gray-color);
  }

  /* Search */
  .rp-loc-search { margin-bottom: .875rem; }

  .rp-search-wrap { position: relative; }

  :global(.rp-search-ico) {
    position: absolute; left: .75rem; top: 50%; transform: translateY(-50%); color: #94a3b8;
  }

  .rp-search-input {
    width: 100%; padding: .75rem 1rem .75rem 2.5rem;
    border: 1.5px solid #e5e7eb; border-radius: .75rem; font-size: .875rem;
    font-family: 'DM Sans', sans-serif; outline: none; transition: all .2s;
  }

  .rp-search-input:focus { border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(106,44,145,.1); }

  .rp-search-loading {
    display: flex; align-items: center; gap: .5rem;
    padding: .875rem; color: var(--gray-color); font-size: .813rem; justify-content: center;
  }

  .rp-search-results {
    margin-top: .5rem; border: 1px solid #e2e8f0;
    border-radius: .75rem; overflow: hidden;
  }

  .rp-search-item {
    display: flex; align-items: flex-start; gap: .625rem;
    width: 100%; padding: .75rem; background: white; border: none;
    border-bottom: 1px solid #f1f5f9; text-align: left; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: background .15s;
  }

  .rp-search-item:last-child { border-bottom: none; }
  .rp-search-item:hover { background: var(--primary-bg); }
  .rp-search-item svg { color: var(--primary-color); flex-shrink: 0; margin-top: 2px; }

  .rp-search-item-info strong { display: block; font-size: .813rem; color: var(--dark-color); margin-bottom: .125rem; }
  .rp-search-item-info span { font-size: .688rem; color: var(--gray-color); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 420px; }

  /* Upload */
  .rp-upload-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }

  .rp-upload-btn {
    display: inline-flex; align-items: center; gap: .5rem;
    padding: .625rem 1.125rem; background: var(--light-color);
    border: 1.5px dashed #cbd5e1; border-radius: .75rem;
    font-size: .813rem; cursor: pointer; font-family: 'DM Sans', sans-serif;
    color: #475569; transition: all .2s;
  }

  .rp-upload-btn:hover:not(.rp-upload-btn--disabled) {
    border-color: var(--primary-color); color: var(--primary-color); background: var(--primary-bg);
  }

  .rp-upload-btn--disabled { opacity: .5; cursor: not-allowed; }

  .rp-media-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: .5rem; margin-top: .875rem;
  }

  .rp-media-item { position: relative; aspect-ratio: 1; border-radius: .625rem; overflow: hidden; }

  .rp-media-item img { width: 100%; height: 100%; object-fit: cover; }

  .rp-media-remove {
    position: absolute; top: .25rem; right: .25rem;
    background: rgba(0,0,0,.6); border: none; color: white;
    padding: .25rem; border-radius: .25rem; cursor: pointer; display: flex;
    transition: background .15s;
  }

  .rp-media-remove:hover { background: var(--danger-color); }

  /* Anonymous */
  .rp-anon-section { cursor: pointer; }
  .rp-anon-section:hover { border-color: var(--primary-border); }

  .rp-anon-label {
    display: flex; align-items: center; gap: .875rem; cursor: pointer;
  }

  .rp-checkbox { width: 17px; height: 17px; accent-color: var(--primary-color); cursor: pointer; flex-shrink: 0; }

  .rp-anon-icon {
    width: 34px; height: 34px;
    background: var(--primary-bg); border: 1px solid var(--primary-border);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    color: var(--primary-color); flex-shrink: 0;
  }

  .rp-anon-title { display: block; font-size: .875rem; font-weight: 600; color: var(--dark-color); }
  .rp-anon-desc  { display: block; font-size: .75rem; color: var(--gray-color); margin-top: .125rem; }

  /* Alert */
  .rp-alert-error {
    display: flex; align-items: center; gap: .625rem;
    padding: .75rem 1rem; background: #fef2f2; border: 1px solid #fecaca;
    border-radius: .75rem; color: var(--danger-color); font-size: .813rem;
  }

  /* Submit */
  .rp-submit-btn {
    width: 100%; display: inline-flex; align-items: center; justify-content: center;
    gap: .5rem; padding: .9375rem 1.5rem;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    color: white; border: none; border-radius: .875rem;
    font-size: 1rem; font-weight: 700; font-family: 'DM Sans', sans-serif;
    cursor: pointer; box-shadow: 0 4px 14px rgba(106,44,145,.3);
    transition: all .2s; margin-top: .25rem;
  }

  .rp-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(106,44,145,.4); }
  .rp-submit-btn:active:not(:disabled) { transform: translateY(0); }
  .rp-submit-btn:disabled { opacity: .65; cursor: not-allowed; }

  /* Safety note */
  .rp-safety-note {
    display: flex; align-items: flex-start; gap: .75rem;
    padding: .875rem 1rem; background: #fef3c7;
    border-radius: .75rem; margin-top: .25rem; margin-bottom: 2rem;
  }

  .rp-safety-note svg { color: #92400e; flex-shrink: 0; margin-top: 2px; }
  .rp-safety-note p { font-size: .75rem; color: #92400e; line-height: 1.6; margin: 0; }
  .rp-safety-note strong { color: #78350f; }

  /* Success */
  .rp-success {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: .75rem; padding: 3rem 2rem;
  }

  .rp-success-icon {
    width: 80px; height: 80px;
    background: #f0fdf4; border: 1px solid #bbf7d0;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    color: var(--success-color); animation: scaleUp .5s ease;
  }

  .rp-success-title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 1.5rem; color: var(--dark-color); margin: 0;
  }

  .rp-success-body { font-size: .875rem; color: var(--gray-color); margin: 0; }
  .rp-success-note { font-size: .75rem; color: var(--gray-color); margin: 0; }

  :global(.rp-spinning) { animation: spin .8s linear infinite; }

  @keyframes spin { to { transform: rotate(360deg); } }

  @keyframes stepIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes scaleUp {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  /* Responsive */
  @media (max-width: 640px) {
    .rp-main { padding: 1.25rem .875rem; }
    .rp-category-grid { grid-template-columns: repeat(2, 1fr); }
    .rp-severity-grid { grid-template-columns: 1fr 1fr; }
    .rp-upload-row { flex-direction: column; align-items: flex-start; }
    .rp-upload-btn { width: 100%; justify-content: center; }
  }

  @media (max-width: 400px) {
    .rp-severity-grid { grid-template-columns: 1fr; }
    .rp-category-grid { grid-template-columns: 1fr; }
  }
</style>