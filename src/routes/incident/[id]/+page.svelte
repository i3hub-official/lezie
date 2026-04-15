<!-- src/routes/incident/[id]/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import {
    MapPin, Camera, Clock, Eye, MessageCircle, Share2, ThumbsUp,
    Flag, AlertTriangle, Shield, CheckCircle, X, ArrowLeft,
    Loader2, Building, Car, Flame, Volume2, MoreHorizontal,
    AlertOctagon, User, EyeOff, Navigation, Calendar, Tag
  } from 'lucide-svelte';

  let { data } = $props();
  
  let incident = $state<any>(null);
  let isLoading = $state(true);
  let error = $state('');
  let userLiked = $state(false);
  let showShareMenu = $state(false);
  let commentText = $state('');
  let isSubmittingComment = $state(false);

  const severityColours: Record<string, string> = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#F97316',
    critical: '#EF4444',
  };

  const categoryIcons: Record<string, any> = {
    'Suspicious Activity': AlertTriangle,
    'Theft / Robbery': AlertOctagon,
    'Vandalism': Building,
    'Fire / Emergency': Flame,
    'Accident': Car,
    'Noise Complaint': Volume2,
    'Other': MoreHorizontal,
  };

  onMount(() => {
    loadIncident();
  });

  async function loadIncident() {
    isLoading = true;
    error = '';
    
    try {
      const response = await fetch(`/api/reports/${data.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Incident not found');
        }
        throw new Error('Failed to load incident');
      }
      
      incident = await response.json();
    } catch (err) {
      console.error('Error loading incident:', err);
      error = err instanceof Error ? err.message : 'Failed to load incident';
    } finally {
      isLoading = false;
    }
  }

  async function handleLike() {
    if (!incident) return;
    
    try {
      const response = await fetch(`/api/reports/${incident.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        userLiked = true;
        incident.viewCount = (incident.viewCount || 0) + 1;
      }
    } catch (err) {
      console.error('Error liking incident:', err);
    }
  }

  async function handleComment() {
    if (!commentText.trim() || !incident) return;
    
    isSubmittingComment = true;
    
    try {
      const response = await fetch(`/api/reports/${incident.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: commentText })
      });
      
      if (response.ok) {
        const newComment = await response.json();
        incident.comments = [newComment, ...(incident.comments || [])];
        incident.commentCount = (incident.commentCount || 0) + 1;
        commentText = '';
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      isSubmittingComment = false;
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: incident?.title,
          text: incident?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
    showShareMenu = false;
  }

  function formatDate(dateString: string) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  function getSeverityLabel(severity: string): string {
    const labels: Record<string, string> = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical'
    };
    return labels[severity] || severity;
  }

  function getStatusBadge(status: string) {
    const statusConfig: Record<string, { label: string; color: string }> = {
      'active': { label: 'Active', color: '#EF4444' },
      'investigating': { label: 'Investigating', color: '#F59E0B' },
      'resolved': { label: 'Resolved', color: '#10B981' },
      'closed': { label: 'Closed', color: '#6B7280' }
    };
    return statusConfig[status?.toLowerCase()] || { label: status || 'Unknown', color: '#6B7280' };
  }

  const CategoryIcon = $derived(categoryIcons[incident?.categoryName] || AlertTriangle);
</script>

<svelte:head>
  <title>{incident?.title || 'Incident Details'} – Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<div class="incident-page">
  <div class="incident-blob incident-blob--1"></div>
  <div class="incident-blob incident-blob--2"></div>

  <main class="incident-main">
    <div class="incident-container">
      
      <!-- Back Button -->
      <button class="incident-back-btn" onclick={() => goto('/dashboard#map')}>
        <ArrowLeft size={18} />
        <span>Back to Reports</span>
      </button>

      <!-- Loading State -->
      {#if isLoading}
        <div class="incident-loading">
          <Loader2 size={40} class="incident-spinning" />
          <span>Loading incident details...</span>
        </div>

      <!-- Error State -->
      {:else if error}
        <div class="incident-error">
          <AlertTriangle size={48} />
          <h2>Unable to Load Incident</h2>
          <p>{error}</p>
          <button class="incident-retry-btn" onclick={loadIncident}>Try Again</button>
        </div>

      <!-- Incident Content -->
      {:else if incident}
        <div class="incident-card">
          
          <!-- Header -->
          <div class="incident-header">
            <div class="incident-badges">
              <span class="incident-category" style="background:{incident.categoryColor || '#6a2c91'}20; color:{incident.categoryColor || '#6a2c91'}">
                <svelte:component this={CategoryIcon} size={14} />
                <span>{incident.categoryName}</span>
              </span>
              <span class="incident-severity" style="background:{severityColours[incident.severity]}20; color:{severityColours[incident.severity]}">
                {getSeverityLabel(incident.severity)} Severity
              </span>
              <span class="incident-status" style="background:{getStatusBadge(incident.statusName).color}20; color:{getStatusBadge(incident.statusName).color}">
                {getStatusBadge(incident.statusName).label}
              </span>
            </div>
            
            <h1 class="incident-title">{incident.title}</h1>
            
            <div class="incident-meta">
              <span class="incident-meta-item">
                <Calendar size={14} />
                <span>{formatDate(incident.createdAt)}</span>
              </span>
              <span class="incident-meta-item">
                <Clock size={14} />
                <span>{formatTimeAgo(incident.createdAt)}</span>
              </span>
              {#if incident.isAnonymous}
                <span class="incident-meta-item">
                  <EyeOff size={14} />
                  <span>Anonymous Report</span>
                </span>
              {:else if incident.authorName}
                <span class="incident-meta-item">
                  <User size={14} />
                  <span>Reported by {incident.authorName}</span>
                </span>
              {/if}
            </div>
          </div>

          <!-- Location -->
          {#if incident.locationName || incident.address}
            <div class="incident-section">
              <div class="incident-section-header">
                <MapPin size={18} />
                <h3>Location</h3>
              </div>
              <div class="incident-location">
                <p>{incident.locationName || incident.address}</p>
                {#if incident.lat && incident.lng}
                  <div class="incident-coords">
                    <span>Lat: {incident.lat.toFixed(6)}</span>
                    <span>Lng: {incident.lng.toFixed(6)}</span>
                  </div>
                {/if}
                <button class="incident-map-btn" onclick={() => window.open(`https://maps.google.com/?q=${incident.lat},${incident.lng}`, '_blank')}>
                  <Navigation size={14} />
                  <span>View on Map</span>
                </button>
              </div>
            </div>
          {/if}

          <!-- Description -->
          <div class="incident-section">
            <div class="incident-section-header">
              <AlertTriangle size={18} />
              <h3>Description</h3>
            </div>
            <div class="incident-description">
              <p>{incident.description}</p>
            </div>
          </div>

          <!-- Media Gallery -->
          {#if incident.media && incident.media.length > 0}
            <div class="incident-section">
              <div class="incident-section-header">
                <Camera size={18} />
                <h3>Media ({incident.media.length})</h3>
              </div>
              <div class="incident-media-grid">
                {#each incident.media as mediaItem}
                  <div class="incident-media-item" onclick={() => window.open(mediaItem.url, '_blank')}>
                    {#if mediaItem.type === 'image'}
                      <img src={mediaItem.url} alt="Incident media" />
                    {:else}
                      <video src={mediaItem.url} />
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Stats -->
          <div class="incident-stats">
            <div class="incident-stat">
              <Eye size={16} />
              <span>{incident.viewCount || 0} views</span>
            </div>
            <div class="incident-stat">
              <MessageCircle size={16} />
              <span>{incident.commentCount || 0} comments</span>
            </div>
            <div class="incident-stat">
              <ThumbsUp size={16} />
              <span>{incident.likeCount || 0} helpful</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="incident-actions">
            <button class="incident-action-btn" onclick={handleLike} disabled={userLiked}>
              <ThumbsUp size={18} />
              <span>{userLiked ? 'Marked Helpful' : 'Mark as Helpful'}</span>
            </button>
            <button class="incident-action-btn" onclick={() => document.getElementById('comment-input')?.focus()}>
              <MessageCircle size={18} />
              <span>Add Comment</span>
            </button>
            <button class="incident-action-btn" onclick={handleShare}>
              <Share2 size={18} />
              <span>Share</span>
            </button>
            <button class="incident-action-btn incident-action-btn--report">
              <Flag size={18} />
              <span>Report</span>
            </button>
          </div>

          <!-- Comments Section -->
          <div class="incident-section incident-comments">
            <div class="incident-section-header">
              <MessageCircle size={18} />
              <h3>Comments ({incident.commentCount || 0})</h3>
            </div>

            <!-- Add Comment -->
            <div class="incident-add-comment">
              <textarea
                id="comment-input"
                class="incident-comment-input"
                placeholder="Share your thoughts or additional information..."
                bind:value={commentText}
                rows="3"
              ></textarea>
              <button class="incident-submit-comment" onclick={handleComment} disabled={isSubmittingComment || !commentText.trim()}>
                {#if isSubmittingComment}
                  <Loader2 size={16} class="incident-spinning" />
                  <span>Posting...</span>
                {:else}
                  <span>Post Comment</span>
                {/if}
              </button>
            </div>

            <!-- Comments List -->
            {#if incident.comments && incident.comments.length > 0}
              <div class="incident-comments-list">
                {#each incident.comments as comment}
                  <div class="incident-comment">
                    <div class="incident-comment-header">
                      <strong>{comment.authorName || 'Anonymous'}</strong>
                      <span class="incident-comment-time">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p class="incident-comment-text">{comment.text}</p>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="incident-no-comments">
                <MessageCircle size={32} />
                <p>No comments yet. Be the first to share your thoughts.</p>
              </div>
            {/if}
          </div>

          <!-- Safety Note -->
          <div class="incident-safety-note">
            <Shield size={18} />
            <div>
              <strong>Safety First</strong>
              <p>If this is an emergency or you're in immediate danger, please call your local emergency services immediately.</p>
            </div>
          </div>

        </div>
      {/if}
    </div>
  </main>
</div>

<style>
:global(.incident-page *) {
  font-family: 'DM Sans', system-ui, sans-serif;
  box-sizing: border-box;
}

.incident-page {
  min-height: 100vh;
  background: linear-gradient(145deg, #faf9ff 0%, #f3f0ff 60%, #fdf4ff 100%);
  --primary-color: #6a2c91;
  --primary-dark: #4a1d6e;
  --primary-bg: #f3e8ff;
  --primary-border: #e9d5ff;
  --dark-color: #1e1b4b;
  --gray-color: #64748b;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --success-color: #10b981;
  --light-color: #f8fafc;
  position: relative;
  overflow-x: hidden;
}

.incident-blob {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.incident-blob--1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(106,44,145,.1), transparent 70%);
  top: -100px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.incident-blob--2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(139,92,246,.08), transparent 70%);
  bottom: -80px;
  left: -80px;
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0%,100% { transform: translate(0,0); }
  50% { transform: translate(20px,20px); }
}

.incident-main {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  padding: 2rem 1.25rem;
  min-height: 100vh;
}

.incident-container {
  width: 100%;
  max-width: 860px;
}

.incident-back-btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  background: white;
  border: 1px solid #e2e8f0;
  padding: .5rem 1rem;
  border-radius: .75rem;
  font-size: .875rem;
  font-weight: 500;
  color: var(--gray-color);
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all .2s;
}

.incident-back-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--primary-bg);
  transform: translateX(-4px);
}

.incident-loading,
.incident-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: white;
  border-radius: 1.5rem;
  padding: 3rem;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.incident-loading span,
.incident-error p {
  color: var(--gray-color);
}

.incident-error h2 {
  font-family: 'DM Serif Display', Georgia, serif;
  color: var(--dark-color);
  margin: 0;
}

.incident-retry-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  padding: .75rem 1.5rem;
  border-radius: .75rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: .5rem;
}

.incident-card {
  background: white;
  border-radius: 1.75rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 24px 48px -12px rgba(26,11,46,.12);
  animation: slideUp .5s cubic-bezier(.16,1,.3,1) both;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.incident-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.incident-badges {
  display: flex;
  gap: .75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.incident-category,
.incident-severity,
.incident-status {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .375rem .875rem;
  border-radius: .625rem;
  font-size: .75rem;
  font-weight: 600;
}

.incident-title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(1.5rem, 5vw, 2.25rem);
  color: var(--dark-color);
  margin: 0 0 1rem 0;
  line-height: 1.3;
  letter-spacing: -.02em;
}

.incident-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.incident-meta-item {
  display: inline-flex;
  align-items: center;
  gap: .375rem;
  font-size: .813rem;
  color: var(--gray-color);
}

.incident-section {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
}

.incident-section:last-of-type {
  border-bottom: none;
}

.incident-section-header {
  display: flex;
  align-items: center;
  gap: .625rem;
  margin-bottom: 1rem;
}

.incident-section-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0;
}

.incident-section-header svg {
  color: var(--primary-color);
}

.incident-location p {
  margin: 0 0 .75rem 0;
  color: #475569;
  font-size: .938rem;
}

.incident-coords {
  display: flex;
  gap: 1rem;
  font-size: .75rem;
  font-family: monospace;
  color: var(--gray-color);
  margin-bottom: .75rem;
}

.incident-map-btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  background: var(--primary-bg);
  border: 1px solid var(--primary-border);
  padding: .5rem 1rem;
  border-radius: .625rem;
  font-size: .813rem;
  font-weight: 500;
  color: var(--primary-color);
  cursor: pointer;
  transition: all .2s;
}

.incident-map-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.incident-description p {
  margin: 0;
  line-height: 1.7;
  color: #334155;
  font-size: .938rem;
  white-space: pre-wrap;
}

.incident-media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: .75rem;
}

.incident-media-item {
  aspect-ratio: 1;
  border-radius: .75rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform .2s;
}

.incident-media-item:hover {
  transform: scale(1.02);
}

.incident-media-item img,
.incident-media-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.incident-stats {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background: #faf9ff;
  border-bottom: 1px solid #f1f5f9;
}

.incident-stat {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-size: .813rem;
  color: var(--gray-color);
}

.incident-actions {
  display: flex;
  gap: .75rem;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
}

.incident-action-btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .5rem 1rem;
  background: var(--light-color);
  border: 1px solid #e2e8f0;
  border-radius: .625rem;
  font-size: .813rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all .2s;
}

.incident-action-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--primary-bg);
}

.incident-action-btn--report:hover {
  border-color: var(--danger-color);
  color: var(--danger-color);
  background: #fef2f2;
}

.incident-action-btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.incident-comments {
  background: #faf9ff;
}

.incident-add-comment {
  margin-bottom: 1.5rem;
}

.incident-comment-input {
  width: 100%;
  padding: .875rem;
  border: 1.5px solid #e5e7eb;
  border-radius: .75rem;
  font-size: .875rem;
  font-family: 'DM Sans', sans-serif;
  resize: vertical;
  margin-bottom: .75rem;
  transition: all .2s;
}

.incident-comment-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(106,44,145,.1);
}

.incident-submit-comment {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .625rem 1.25rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  border-radius: .75rem;
  font-weight: 600;
  font-size: .875rem;
  cursor: pointer;
  transition: all .2s;
}

.incident-submit-comment:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(106,44,145,.3);
}

.incident-submit-comment:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.incident-comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.incident-comment {
  background: white;
  border-radius: .75rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.incident-comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .5rem;
}

.incident-comment-header strong {
  font-size: .813rem;
  color: var(--dark-color);
}

.incident-comment-time {
  font-size: .688rem;
  color: var(--gray-color);
}

.incident-comment-text {
  margin: 0;
  font-size: .875rem;
  color: #475569;
  line-height: 1.6;
}

.incident-no-comments {
  text-align: center;
  padding: 2rem;
  color: var(--gray-color);
}

.incident-no-comments svg {
  opacity: .5;
  margin-bottom: .75rem;
}

.incident-no-comments p {
  margin: 0;
  font-size: .875rem;
}

.incident-safety-note {
  display: flex;
  gap: .75rem;
  padding: 1.25rem 2rem;
  background: #fef3c7;
  border-top: 1px solid #fde68a;
}

.incident-safety-note svg {
  color: #92400e;
  flex-shrink: 0;
}

.incident-safety-note strong {
  display: block;
  font-size: .813rem;
  color: #78350f;
  margin-bottom: .25rem;
}

.incident-safety-note p {
  font-size: .75rem;
  color: #92400e;
  margin: 0;
}

.incident-spinning {
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .incident-main {
    padding: 1rem;
  }
  
  .incident-header,
  .incident-section,
  .incident-stats,
  .incident-actions,
  .incident-safety-note {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .incident-media-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .incident-actions {
    justify-content: center;
  }
}
</style>