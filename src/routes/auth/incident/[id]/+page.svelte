<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import {
    MapPin,
    Clock,
    AlertTriangle,
    FlagTriangleRight,
    ThumbsUp,
    MessageCircle,
    Share2,
    Shield,
    Eye,
    ChevronLeft,
    CheckCircle,
    AlertCircle,
    Loader2,
    User,
    Calendar,
    Navigation
  } from 'lucide-svelte';
  
  let isLoading = $state(true);
  let incident = $state<any>(null);
  let userVote = $state<'up' | null>(null);
  let commentText = $state('');
  let isSubmitting = $state(false);
  
  const id = $page.params.id;
  
  onMount(async () => {
    await loadIncident();
    isLoading = false;
  });
  
  async function loadIncident() {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    incident = {
      id: parseInt(id),
      title: 'Suspicious person near school',
      description: `A suspicious individual has been seen loitering around the elementary school for the past three days. They appear to be taking photos of the building and watching children during recess. Local authorities have been notified and are investigating.

The person is described as:
- Male, approximately 40-50 years old
- Wearing a dark hoodie and jeans
- Driving a white van with tinted windows

If you see this person, do not approach them. Contact local police immediately and report to Lezie.`,
      category: 'suspicious',
      severity: 'high',
      status: 'verified',
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: 'Maple Street Elementary School, 123 Maple Street'
      },
      time: '2024-01-15T14:30:00Z',
      reportedBy: {
        name: 'Sarah Johnson',
        verified: true,
        anonymous: false
      },
      stats: {
        views: 234,
        verifications: 45,
        comments: 12
      },
      media: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2'
      ],
      comments: [
        {
          id: 1,
          user: 'Mike Thompson',
          content: 'I saw this person yesterday near the park as well. Very suspicious behavior.',
          time: '2024-01-15T15:30:00Z',
          verified: true
        },
        {
          id: 2,
          user: 'Anonymous',
          content: 'Police have been notified and are increasing patrols in the area.',
          time: '2024-01-15T16:45:00Z',
          verified: false,
          isAnonymous: true
        }
      ],
      timeline: [
        { action: 'Report submitted', time: '2024-01-15T14:30:00Z', user: 'Sarah Johnson' },
        { action: 'Verified by community', time: '2024-01-15T15:00:00Z', user: '15 community members' },
        { action: 'Police notified', time: '2024-01-15T15:30:00Z', user: 'System' },
        { action: 'Under investigation', time: '2024-01-15T16:00:00Z', user: 'Local Police' }
      ]
    };
  }
  
  function getSeverityColor(severity: string) {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#F97316',
      critical: '#EF4444'
    };
    return colors[severity as keyof typeof colors] || '#6B7280';
  }
  
  function getStatusColor(status: string) {
    switch(status) {
      case 'verified': return 'var(--success-color)';
      case 'resolved': return '#6B7280';
      case 'investigating': return 'var(--warning-color)';
      default: return 'var(--danger-color)';
    }
  }
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  async function handleVote() {
    if (userVote === 'up') {
      userVote = null;
      incident.stats.verifications--;
    } else {
      userVote = 'up';
      incident.stats.verifications++;
    }
    // TODO: API call to save vote
  }
  
  async function handleComment() {
    if (!commentText.trim()) return;
    
    isSubmitting = true;
    
    // TODO: API call to submit comment
    await new Promise(resolve => setTimeout(resolve, 500));
    
    incident.comments.unshift({
      id: Date.now(),
      user: 'You',
      content: commentText,
      time: new Date().toISOString(),
      verified: false
    });
    
    commentText = '';
    isSubmitting = false;
  }
  
  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: incident.title,
        text: 'Check out this incident report on Lezie',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }
</script>

<svelte:head>
  <title>{incident?.title || 'Incident Details'} - Lezie</title>
</svelte:head>

<div class="incident-page">
  <div class="incident-container">
    {#if isLoading}
      <div class="loading-state">
        <Loader2 size={40} class="spinning" />
        <p>Loading incident details...</p>
      </div>
    {:else}
      <!-- Back Button -->
      <button class="back-button" onclick={() => goto('/dashboard')}>
        <ChevronLeft size={20} />
        Back to Dashboard
      </button>
      
      <!-- Header -->
      <div class="incident-header">
        <div class="header-top">
          <div class="category-badge" style="background: {getSeverityColor(incident.severity)}20; color: {getSeverityColor(incident.severity)}">
            <AlertTriangle size={14} />
            <span>{incident.category} • {incident.severity} severity</span>
          </div>
          <div class="status-badge" style="background: {getStatusColor(incident.status)}20; color: {getStatusColor(incident.status)}">
            {#if incident.status === 'verified'}
              <CheckCircle size={14} />
            {:else}
              <AlertCircle size={14} />
            {/if}
            <span>{incident.status}</span>
          </div>
        </div>
        
        <h1>{incident.title}</h1>
        
        <div class="meta-info">
          <div class="meta-item">
            <MapPin size={16} />
            <span>{incident.location.address}</span>
          </div>
          <div class="meta-item">
            <Clock size={16} />
            <span>{formatDate(incident.time)}</span>
          </div>
          <div class="meta-item">
            <Eye size={16} />
            <span>{incident.stats.views} views</span>
          </div>
        </div>
      </div>
      
      <!-- Main Content Grid -->
      <div class="incident-grid">
        <!-- Left Column -->
        <div class="incident-main">
          <!-- Description -->
          <div class="card">
            <h3>Description</h3>
            <div class="description">
              {#each incident.description.split('\n\n') as paragraph}
                <p>{paragraph}</p>
              {/each}
            </div>
          </div>
          
          <!-- Media -->
          {#if incident.media.length > 0}
            <div class="card">
              <h3>Media</h3>
              <div class="media-grid">
                {#each incident.media as image}
                  <img src={image} alt="Incident media" class="media-image" />
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Map -->
          <div class="card">
            <h3>Location Map</h3>
            <div class="map-placeholder">
              <MapPin size={32} />
              <p>{incident.location.address}</p>
              <button class="map-button" onclick={() => window.open(`https://maps.google.com/?q=${incident.location.lat},${incident.location.lng}`, '_blank')}>
                <Navigation size={16} />
                Open in Maps
              </button>
            </div>
          </div>
          
          <!-- Timeline -->
          <div class="card">
            <h3>Timeline</h3>
            <div class="timeline">
              {#each incident.timeline as event}
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <span class="timeline-action">{event.action}</span>
                      <span class="timeline-time">{formatDate(event.time)}</span>
                    </div>
                    <div class="timeline-user">by {event.user}</div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
          
          <!-- Comments -->
          <div class="card">
            <h3>Comments ({incident.comments.length})</h3>
            
            <!-- Add Comment -->
            <div class="add-comment">
              <textarea
                bind:value={commentText}
                placeholder="Share your thoughts or additional information..."
                class="comment-input"
                rows="3"
              ></textarea>
              <button class="submit-comment" onclick={handleComment} disabled={isSubmitting}>
                {#if isSubmitting}
                  <Loader2 size={16} class="spinning" />
                  Posting...
                {:else}
                  <MessageCircle size={16} />
                  Post Comment
                {/if}
              </button>
            </div>
            
            <!-- Comments List -->
            <div class="comments-list">
              {#each incident.comments as comment}
                <div class="comment">
                  <div class="comment-header">
                    <div class="comment-user">
                      <User size={14} />
                      <span>{comment.isAnonymous ? 'Anonymous' : comment.user}</span>
                      {#if comment.verified}
                        <CheckCircle size={12} class="verified-icon" />
                      {/if}
                    </div>
                    <span class="comment-time">{formatDate(comment.time)}</span>
                  </div>
                  <p class="comment-content">{comment.content}</p>
                </div>
              {/each}
            </div>
          </div>
        </div>
        
        <!-- Right Column - Sidebar -->
        <div class="incident-sidebar">
          <!-- Reported By -->
          <div class="card">
            <h3>Reported by</h3>
            <div class="reporter-info">
              <div class="reporter-avatar">
                {incident.reportedBy.name.charAt(0)}
              </div>
              <div>
                <div class="reporter-name">
                  {incident.reportedBy.name}
                  {#if incident.reportedBy.verified}
                    <CheckCircle size={14} class="verified-icon" />
                  {/if}
                </div>
                <div class="reporter-status">
                  {#if incident.reportedBy.anonymous}
                    <Eye size={12} />
                    <span>Anonymous report</span>
                  {:else}
                    <Shield size={12} />
                    <span>Verified reporter</span>
                  {/if}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="card">
            <h3>Actions</h3>
            <div class="action-buttons">
              <button class="action-btn" onclick={handleVote}>
                <ThumbsUp size={18} />
                <span>Verify ({incident.stats.verifications})</span>
              </button>
              <button class="action-btn" onclick={handleShare}>
                <Share2 size={18} />
                <span>Share</span>
              </button>
              <button class="action-btn report-btn-sidebar" onclick={() => goto('/auth/report')}>
                <FlagTriangleRight size={18} />
                <span>Report similar</span>
              </button>
            </div>
          </div>
          
          <!-- Safety Tips -->
          <div class="card safety-card">
            <h3>Safety Tips</h3>
            <ul class="safety-tips">
              <li>Stay aware of your surroundings</li>
              <li>Don't approach suspicious individuals</li>
              <li>Report any new information</li>
              <li>Share with neighbors</li>
              <li>Keep emergency numbers handy</li>
            </ul>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .incident-page {
    min-height: 100vh;
    background: #f9fafb;
    padding: 2rem;
  }
  
  .incident-container {
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
    gap: 1rem;
    color: var(--gray-color);
  }
  
  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: var(--gray-color);
    cursor: pointer;
    padding: 0.5rem;
    margin-bottom: 1.5rem;
    transition: color 0.2s;
  }
  
  .back-button:hover {
    color: var(--primary-color);
  }
  
  .incident-header {
    margin-bottom: 2rem;
  }
  
  .header-top {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .category-badge, .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .incident-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 1rem;
  }
  
  .meta-info {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--gray-color);
  }
  
  .incident-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1.5rem;
  }
  
  .card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .card h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 1rem;
  }
  
  .description p {
    color: var(--gray-color);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .media-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .media-image:hover {
    transform: scale(1.02);
  }
  
  .map-placeholder {
    background: var(--primary-bg);
    border-radius: 0.75rem;
    padding: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .map-placeholder svg {
    color: var(--primary-color);
  }
  
  .map-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.813rem;
  }
  
  .timeline {
    position: relative;
    padding-left: 1.5rem;
  }
  
  .timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e5e7eb;
  }
  
  .timeline-item {
    position: relative;
    margin-bottom: 1.5rem;
  }
  
  .timeline-dot {
    position: absolute;
    left: -1.5rem;
    top: 0.25rem;
    width: 10px;
    height: 10px;
    background: var(--primary-color);
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 0 2px #e5e7eb;
  }
  
  .timeline-content {
    flex: 1;
  }
  
  .timeline-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;
    flex-wrap: wrap;
  }
  
  .timeline-action {
    font-weight: 600;
    color: var(--dark-color);
    font-size: 0.875rem;
  }
  
  .timeline-time {
    font-size: 0.75rem;
    color: var(--gray-color);
  }
  
  .timeline-user {
    font-size: 0.75rem;
    color: var(--gray-color);
  }
  
  .add-comment {
    margin-bottom: 1.5rem;
  }
  
  .comment-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-family: inherit;
    resize: vertical;
    margin-bottom: 0.75rem;
  }
  
  .comment-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  .submit-comment {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.813rem;
  }
  
  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .comment {
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.75rem;
  }
  
  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  
  .comment-user {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.813rem;
    font-weight: 500;
    color: var(--dark-color);
  }
  
  .comment-time {
    font-size: 0.688rem;
    color: var(--gray-color);
  }
  
  .comment-content {
    font-size: 0.813rem;
    color: var(--gray-color);
    line-height: 1.5;
  }
  
  .verified-icon {
    color: var(--success-color);
  }
  
  .reporter-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .reporter-avatar {
    width: 48px;
    height: 48px;
    background: var(--primary-bg);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
  }
  
  .reporter-name {
    font-weight: 600;
    color: var(--dark-color);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .reporter-status {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--gray-color);
    margin-top: 0.25rem;
  }
  
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--light-color);
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--dark-color);
    transition: all 0.2s;
  }
  
  .action-btn:hover {
    border-color: var(--primary-color);
    background: var(--primary-bg);
    color: var(--primary-color);
  }
  
  .report-btn-sidebar {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
  
  .report-btn-sidebar:hover {
    background: var(--primary-dark);
    color: white;
  }
  
  .safety-card {
    background: linear-gradient(135deg, var(--primary-bg) 0%, #ffffff 100%);
  }
  
  .safety-tips {
    list-style: none;
    padding: 0;
  }
  
  .safety-tips li {
    padding: 0.5rem 0;
    padding-left: 1.25rem;
    position: relative;
    font-size: 0.813rem;
    color: var(--gray-color);
  }
  
  .safety-tips li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--primary-color);
    font-weight: bold;
  }
  
  .spinning {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (max-width: 768px) {
    .incident-page {
      padding: 1rem;
    }
    
    .incident-grid {
      grid-template-columns: 1fr;
    }
    
    .incident-header h1 {
      font-size: 1.5rem;
    }
    
    .meta-info {
      gap: 1rem;
    }
  }
</style>