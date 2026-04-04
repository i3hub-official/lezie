
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
    Loader2
  } from 'lucide-svelte';

  let isSubmitting = false;
  let error = '';
  let success = false;
  
  // Form fields
  let title = '';
  let description = '';
  let category = '';
  let severity = 'medium';
  let isAnonymous = false;
  let location: { lat: number; lng: number } | null = null;
  let locationName = '';
  
  // Media files
  let mediaFiles: File[] = [];
  let mediaPreviews: string[] = [];
  
  // Categories
  const categories = [
    { value: 'suspicious', label: 'Suspicious Activity', icon: AlertTriangle },
    { value: 'theft', label: 'Theft / Robbery', icon: AlertTriangle },
    { value: 'vandalism', label: 'Vandalism', icon: AlertTriangle },
    { value: 'fire', label: 'Fire / Emergency', icon: AlertTriangle },
    { value: 'accident', label: 'Accident', icon: AlertTriangle },
    { value: 'noise', label: 'Noise Complaint', icon: AlertTriangle },
    { value: 'other', label: 'Other', icon: AlertTriangle }
  ];
  
  // Severity options
  const severityOptions = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'high', label: 'High', color: '#F97316' },
    { value: 'critical', label: 'Critical', color: '#EF4444' }
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
        },
        (err) => {
          console.error('Geolocation error:', err);
        }
      );
    }
  });
  
  function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    
    // Limit to 5 files
    const remaining = 5 - mediaFiles.length;
    const newFiles = files.slice(0, remaining);
    
    mediaFiles = [...mediaFiles, ...newFiles];
    
    // Create previews
    newFiles.forEach(file => {
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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
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
    if (!description.trim()) {
      error = 'Please enter a description';
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
      // TODO: Submit to API
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
      
      // Simulate API call
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
        goto('/');
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
      <button class="back-button" on:click={goBack}>
        <ChevronLeft size={20} />
        Back
      </button>
      <h1 class="report-title">Report an Incident</h1>
      <p class="report-subtitle">Your report helps keep the community safe</p>
    </div>
    
    <!-- Success Message -->
    {#if success}
      <div class="success-message">
        <CheckCircle size={48} />
        <h3>Report Submitted Successfully!</h3>
        <p>Thank you for helping keep your community safe.</p>
        <p>Redirecting you back...</p>
      </div>
    {:else}
    
    <!-- Form -->
    <form on:submit|preventDefault={handleSubmit} class="report-form">
      
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
          required
        />
        <p class="form-hint">{title.length}/200 characters</p>
      </div>
      
      <!-- Category -->
      <div class="form-group">
        <label class="form-label" for="category">
          Category <span class="required">*</span>
        </label>
        <div class="category-grid">
          {#each categories as cat}
            <button
              type="button"
              class="category-btn {category === cat.value ? 'selected' : ''}"
              on:click={() => category = cat.value}
            >
              <cat.icon size={18} />
              {cat.label}
            </button>
          {/each}
        </div>
      </div>
      
      <!-- Severity -->
      <div class="form-group">
        <label class="form-label" for="severity">
          Severity Level
        </label>
        <div class="severity-grid">
          {#each severityOptions as opt}
            <button
              type="button"
              class="severity-btn {severity === opt.value ? 'selected' : ''}"
              style="--severity-color: {opt.color}"
              on:click={() => severity = opt.value}
            >
              <span class="severity-dot" style="background: {opt.color}"></span>
              {opt.label}
            </button>
          {/each}
        </div>
        <p class="form-hint">Rate the urgency of this incident</p>
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
          placeholder="Provide detailed information about what happened..."
          required
        ></textarea>
        <p class="form-hint">Include time, location details, and any relevant information</p>
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
            on:click={getCurrentLocation}
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
              <span>Location selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
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
          <label class="upload-button">
            <Camera size={20} />
            <span>Add Media</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              hidden
              on:change={handleFileUpload}
              disabled={mediaFiles.length >= 5}
            />
          </label>
          <p class="upload-hint">Upload up to 5 files (max 10MB each)</p>
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
                  on:click={() => removeMedia(index)}
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
        <p class="form-hint">Your identity will be hidden, but authorities can still contact you if needed</p>
      </div>
      
      <!-- Error Message -->
      {#if error}
        <div class="error-message">
          <AlertCircle size={18} />
          {error}
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