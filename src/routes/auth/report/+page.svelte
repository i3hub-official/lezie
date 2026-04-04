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
    AlertOctagon
  } from 'lucide-svelte';

  // State declarations using $state
  let isSubmitting = $state(false);
  let error = $state('');
  let success = $state(false);
  
  // Form fields
  let title = $state('');
  let description = $state('');
  let category = $state('');
  let severity = $state('medium');
  let isAnonymous = $state(false);
  let location = $state<{ lat: number; lng: number } | null>(null);
  let locationName = $state('');
  
  // Media files
  let mediaFiles = $state<File[]>([]);
  let mediaPreviews = $state<string[]>([]);
  
  // Categories with proper icons
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
  
  onMount(() => {
    // Get user's current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          // Try to get address from coordinates
          getAddressFromCoords(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
        }
      );
    }
  });
  
  async function getAddressFromCoords(lat: number, lng: number) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await response.json();
      if (data.display_name) {
        locationName = data.display_name.split(',')[0];
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  }
  
  function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    
    // Limit to 5 files, max 10MB each
    const remaining = 5 - mediaFiles.length;
    const newFiles = files.slice(0, remaining);
    
    // Check file sizes
    const validFiles = newFiles.filter(file => file.size <= 10 * 1024 * 1024);
    if (validFiles.length !== newFiles.length) {
      error = 'Some files exceed 10MB limit and were skipped';
      setTimeout(() => error = '', 3000);
    }
    
    mediaFiles = [...mediaFiles, ...validFiles];
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        mediaPreviews = [...mediaPreviews, e.target?.result as string];
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    input.value = '';
  }
  
  function removeMedia(index: number) {
    mediaFiles = mediaFiles.filter((_, i) => i !== index);
    mediaPreviews = mediaPreviews.filter((_, i) => i !== index);
  }
  
  async function getCurrentLocation() {
    if (navigator.geolocation) {
      error = '';
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          await getAddressFromCoords(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          error = 'Unable to get your location. Please enable location services.';
          setTimeout(() => error = '', 3000);
        }
      );
    } else {
      error = 'Geolocation is not supported by your browser.';
      setTimeout(() => error = '', 3000);
    }
  }
  
  async function handleSubmit() {
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
      formData.append('locationName', locationName);
      
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
        locationName,
        mediaCount: mediaFiles.length
      });
      
      success = true;
      
      // Reset form after 2 seconds and redirect
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

      <!-- Location -->
      <div class="form-group">
        <label class="form-label">
          Location <span class="required">*</span>
        </label>
        <div class="location-area">
          <button
            type="button"
            class="location-button"
            onclick={getCurrentLocation}
          >
            <Navigation size={18} />
            Use my current location
          </button>

          <div class="location-input-group">
            <MapPin size={18} class="location-icon" />
            <input
              type="text"
              bind:value={locationName}
              class="location-input"
              placeholder="Search for an address or place"
            />
          </div>

          {#if location}
            <div class="location-confirmed">
              <CheckCircle size={16} />
              <span>Location selected</span>
              <button type="button" class="location-clear" onclick={() => { location = null; locationName = ''; }}>
                <X size={14} />
              </button>
            </div>
          {/if}
        </div>
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

        <!-- Media Previews -->
        {#if mediaPreviews.length > 0}
          <div class="media-grid">
            {#each mediaPreviews as preview, index}
              <div class="media-item">
                <img src={preview} alt="Preview" class="media-preview" />
                <button
                  type="button"
                  class="remove-media"
                  onclick={() => removeMedia(index)}
                >
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
          <input
            type="checkbox"
            bind:checked={isAnonymous}
            class="checkbox"
          />
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
        <button
          type="submit"
          class="submit-button"
          disabled={isSubmitting}
        >
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
