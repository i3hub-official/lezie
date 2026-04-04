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
          {title.length < 5 && title.length > 0 && <span class="hint-warning">Minimum 5 characters</span>}
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
          {description.length < 20 && description.length > 0 && <span class="hint-warning">Minimum 20 characters</span>}
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
          <strong>⚠️ Emergency?</strong> If this is an emergency, call your local emergency services immediately.
        </div>
      </div>
    </form>
    {/if}
  </div>
</div>

<style>
  .report-page {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-bg) 0%, #ffffff 100%);
    padding: 0;
  }

  .report-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: clamp(1rem, 4vw, 2rem);
  }

  /* Header */
  .report-header {
    text-align: center;
    margin-bottom: clamp(1.5rem, 4vw, 2rem);
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: var(--gray-color);
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.5rem;
    margin-bottom: 1rem;
    transition: color 0.2s;
  }

  .back-button:hover {
    color: var(--primary-color);
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
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  .report-subtitle {
    color: var(--gray-color);
    font-size: clamp(0.75rem, 2vw, 0.875rem);
  }

  /* Form */
  .report-form {
    background: white;
    border-radius: clamp(1rem, 3vw, 1.5rem);
    padding: clamp(1rem, 4vw, 2rem);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  .form-group {
    margin-bottom: clamp(1rem, 3vw, 1.5rem);
  }

  .form-label {
    display: block;
    font-weight: 600;
    font-size: clamp(0.813rem, 2vw, 0.875rem);
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  .required {
    color: var(--danger-color);
  }

  .form-input,
  .location-input {
    width: 100%;
    padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 2vw, 1rem);
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: clamp(0.813rem, 2vw, 0.875rem);
    transition: all 0.2s;
  }

  .form-input:focus,
  .location-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(106, 44, 145, 0.1);
  }

  .form-textarea {
    width: 100%;
    padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 2vw, 1rem);
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: clamp(0.813rem, 2vw, 0.875rem);
    font-family: inherit;
    resize: vertical;
  }

  .form-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(106, 44, 145, 0.1);
  }

  .form-hint {
    font-size: 0.75rem;
    color: var(--gray-color);
    margin-top: 0.25rem;
    display: flex;
    justify-content: space-between;
  }

  .hint-warning {
    color: var(--warning-color);
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
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: var(--light-color);
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    color: var(--dark-color);
    cursor: pointer;
    transition: all 0.2s;
  }

  .category-btn:hover {
    border-color: var(--primary-color);
    background: var(--primary-bg);
  }

  .category-btn.selected {
    background: var(--category-color);
    border-color: var(--category-color);
    color: white;
  }

  .category-btn.selected svg {
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
    background: var(--light-color);
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .severity-btn:hover {
    border-color: var(--primary-color);
    background: var(--primary-bg);
  }

  .severity-btn.selected {
    background: var(--severity-color);
    border-color: var(--severity-color);
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
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--dark-color);
  }

  .severity-desc {
    display: block;
    font-size: 0.688rem;
    color: var(--gray-color);
  }

  /* Location */
  .location-area {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .location-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    border-radius: 0.75rem;
    font-size: 0.875rem;
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.2s;
    width: fit-content;
  }

  .location-button:hover {
    background: var(--primary-color);
    color: white;
  }

  .location-input-group {
    position: relative;
  }

  .location-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-color);
  }

  .location-input {
    padding-left: 2.5rem;
  }

  .location-confirmed {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--success-color);
    background: #f0fdf4;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
  }

  .location-clear {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--success-color);
    padding: 0;
    display: flex;
    align-items: center;
    margin-left: auto;
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
    padding: 0.6rem 1.25rem;
    background: var(--light-color);
    border: 1px dashed #d1d5db;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .upload-button:hover:not(.disabled) {
    border-color: var(--primary-color);
    background: var(--primary-bg);
  }

  .upload-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .upload-hint {
    font-size: 0.75rem;
    color: var(--gray-color);
  }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
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
    font-size: 0.875rem;
    color: var(--dark-color);
  }

  .checkbox {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
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
    color: var(--danger-color);
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  /* Submit */
  .form-actions {
    margin-top: 2rem;
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
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .submit-button:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  .submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Safety Note */
  .safety-note {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #fef3c7;
    border-radius: 0.75rem;
    margin-top: 1.5rem;
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

  .success-animation {
    margin-bottom: 1.5rem;
  }

  .success-animation svg {
    color: var(--success-color);
    animation: scaleUp 0.5s ease;
  }

  .success-state h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  .success-state p {
    color: var(--gray-color);
    margin-bottom: 0.5rem;
  }

  .success-note {
    font-size: 0.875rem;
  }

  .success-spinner {
    margin-top: 1.5rem;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  /* Animations */
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

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .report-form {
      padding: 1.25rem;
    }

    .category-grid {
      grid-template-columns: 1fr;
    }

    .location-button {
      width: 100%;
      justify-content: center;
    }

    .upload-area {
      flex-direction: column;
      align-items: flex-start;
    }

    .upload-button {
      width: 100%;
      justify-content: center;
    }
  }
</style>