<script lang="ts">
console.log('🔵 Component initializing');

import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';

  import {
    Users, MessageCircle, ThumbsUp, Share2, UserPlus,
    Search, Filter, X, ChevronLeft, Plus, Clock,
    MapPin, Award, Shield, Star, TrendingUp,
    MessageSquare, Eye, Send, Image as ImageIcon,
    Link, Smile, Calendar, Bell, CheckCircle,
    HelpCircle, LayoutGrid, Radio
  } from 'lucide-svelte';
  // ❌ Remove NeighbourhoodFeed import
  // import NeighbourhoodFeed from '$lib/components/NeighbourhoodFeed.svelte';

  let { data } = $props();

console.log('📦 Data received:', { 
    postsCount: data?.posts?.length,
    discussionsCount: data?.discussions?.length,
    membersCount: data?.members?.length,
    eventsCount: data?.events?.length
  });

  let showCreatePost        = $state(false);
  let searchQuery           = $state('');
  let showFeed              = $state(true);
  let showDiscussions       = $state(true);
  let showMembers           = $state(true);
  let showEvents            = $state(true);
  let showNeighbourhoodFeed = $state(true);
  let userLat               = $state<number | null>(null);
  let userLng               = $state<number | null>(null);
  
  let newPost = $state({
    content:     '',
    category:    'general',
    isAnonymous: false,
    scope:       'global' as 'global' | 'local',
  });

  // Simple debounce
  let debouncedSearchQuery = $state('');
  let searchTimeout: ReturnType<typeof setTimeout>;
  
  function handleSearchInput(e: Event) {
    const target = e.target as HTMLInputElement;
    searchQuery = target.value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      debouncedSearchQuery = searchQuery;
    }, 300);
  }
  onMount(() => {
    console.log('✅ Component mounted');
  });

  // Filter functions
  function getFilteredPosts() {
    if (!debouncedSearchQuery) return data.posts;
    const query = debouncedSearchQuery.toLowerCase();
    return data.posts.filter(p =>
      p.content.toLowerCase().includes(query) ||
      p.authorName.toLowerCase().includes(query)
    );
  }

  function getFilteredDiscussions() {
    if (!debouncedSearchQuery) return data.discussions;
    const query = debouncedSearchQuery.toLowerCase();
    return data.discussions.filter(d =>
      d.title.toLowerCase().includes(query) ||
      d.authorName.toLowerCase().includes(query)
    );
  }

  function getFilteredMembers() {
    if (!debouncedSearchQuery) return data.members;
    const query = debouncedSearchQuery.toLowerCase();
    return data.members.filter(m =>
      m.name.toLowerCase().includes(query)
    );
  }

  function getFilteredEvents() {
    if (!debouncedSearchQuery) return data.events;
    const query = debouncedSearchQuery.toLowerCase();
    return data.events.filter(e =>
      e.title.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query)
    );
  }

  onDestroy(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
  });

  // Categories
  const categories = [
    { id: 'general',   label: 'General Discussion', icon: MessageCircle, color: '#6B7280' },
    { id: 'safety',    label: 'Safety Tips',         icon: Shield,        color: '#10B981' },
    { id: 'alerts',    label: 'Alert Sharing',       icon: Bell,          color: '#F59E0B' },
    { id: 'questions', label: 'Questions',           icon: HelpCircle,    color: '#3B82F6' },
    { id: 'success',   label: 'Success Stories',     icon: Award,         color: '#8B5CF6' },
  ];

  function getCategoryIcon(id: string)  { return categories.find(c => c.id === id)?.icon  ?? MessageCircle; }
  function getCategoryColor(id: string) { return categories.find(c => c.id === id)?.color ?? '#6B7280'; }
  function getCategoryLabel(id: string) { return categories.find(c => c.id === id)?.label ?? id; }

  function formatDate(iso: string) {
    const diff  = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(hours / 24);
    if (hours < 1)  return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days  < 7)  return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
  }

  function formatEventDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function tierToRole(tier: string) {
    const map: Record<string, string> = {
      '1': 'Member', '2': 'Active Member',
      '3': 'Safety Ambassador', '4': 'Community Leader',
    };
    return map[tier] ?? 'Member';
  }

  function toggleAllSections() {
    const all = showNeighbourhoodFeed && showFeed && showDiscussions && showMembers && showEvents;
    showNeighbourhoodFeed = showFeed = showDiscussions = showMembers = showEvents = !all;
  }
</script>

<div class="community-page">
  <div class="community-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" onclick={() => goto('/dashboard')}>
          <ChevronLeft size={18} />
          <span>Dashboard</span>
        </button>
      </div>
      <div class="header-center">
        <div class="logo-badge">
          <Users size={24} />
        </div>
        <div>
          <h1>Community Hub</h1>
          <p>Connect, share, and grow together</p>
        </div>
      </div>
      <div class="header-right">
        <button class="create-btn" onclick={() => showCreatePost = true}>
          <Plus size={18} />
          <span>Create Post</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stat-card">
      <div class="stat-icon members-icon"><Users size={22} /></div>
      <div class="stat-content">
        <span class="stat-value">{data.stats.memberCount.toLocaleString()}</span>
        <span class="stat-label">Active Members</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon posts-icon"><MessageCircle size={22} /></div>
      <div class="stat-content">
        <span class="stat-value">{data.stats.postCount.toLocaleString()}</span>
        <span class="stat-label">Total Posts</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon discussions-icon"><MessageSquare size={22} /></div>
      <div class="stat-content">
        <span class="stat-value">{data.stats.discussionCount.toLocaleString()}</span>
        <span class="stat-label">Discussions</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon events-icon"><Calendar size={22} /></div>
      <div class="stat-content">
        <span class="stat-value">{data.stats.eventCount.toLocaleString()}</span>
        <span class="stat-label">Upcoming Events</span>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="search-bar-wrapper">
      <div class="search-bar">
        <div class="search-icon-wrapper">
          <Search size={18} class="search-icon" />
        </div>
        <input 
          type="text" 
          placeholder="Search discussions, posts, or members..." 
          oninput={handleSearchInput}
          class="search-input"
        />
        {#if searchQuery}
          <button class="clear-search" onclick={() => {
            searchQuery = '';
            debouncedSearchQuery = '';
          }}>
            <X size={16} />
          </button>
        {/if}
      </div>
    </div>

    <!-- Filter Toggle Buttons -->
    <div class="filter-bar">
      <div class="filter-label">
        <Filter size={14} />
        <span>Show sections:</span>
      </div>
      <div class="filter-buttons">
        <button
          class="filter-btn {showNeighbourhoodFeed ? 'active' : ''}"
          onclick={() => showNeighbourhoodFeed = !showNeighbourhoodFeed}
        >
          <Radio size={14} />
          <span>Nearby Feed</span>
          <span class="filter-count">live</span>
        </button>
        <button 
          class="filter-btn {showDiscussions ? 'active' : ''}" 
          onclick={() => showDiscussions = !showDiscussions}
        >
          <MessageSquare size={14} />
          <span>Discussions</span>
          <span class="filter-count">{getFilteredDiscussions().length}</span>
        </button>
        <button 
          class="filter-btn {showMembers ? 'active' : ''}" 
          onclick={() => showMembers = !showMembers}
        >
          <Users size={14} />
          <span>Members</span>
          <span class="filter-count">{getFilteredMembers().length}</span>
        </button>
        <button 
          class="filter-btn {showEvents ? 'active' : ''}" 
          onclick={() => showEvents = !showEvents}
        >
          <Calendar size={14} />
          <span>Events</span>
          <span class="filter-count">{getFilteredEvents().length}</span>
        </button>
      </div>
      <button class="toggle-all-btn" onclick={toggleAllSections}>
        <LayoutGrid size={14} />
        {showNeighbourhoodFeed && showFeed && showDiscussions && showMembers && showEvents ? 'Hide All' : 'Show All'}
      </button>
    </div>

    <!-- ❌ Temporarily removed Neighbourhood Feed Section -->
    {#if showNeighbourhoodFeed}
      <div class="section-container">
        <div class="section-header">
          <div class="section-title">
            <Radio size={18} class="section-icon" />
            <h2>Nearby Activity</h2>
            <span class="section-count">within 2km</span>
          </div>
        </div>
        <div class="section-content section-content--flush">
          <div class="debug-placeholder">
            <p>🔍 Debug: Neighbourhood Feed component removed for testing</p>
            <p>Lat: {userLat ?? 'null'}, Lng: {userLng ?? 'null'}</p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Community Feed Section -->
    {#if showFeed}
      <div class="section-container">
        <div class="section-header">
          <div class="section-title">
            <TrendingUp size={18} class="section-icon" />
            <h2>Community Feed</h2>
            <span class="section-count">{getFilteredPosts().length} posts</span>
          </div>
        </div>

        <div class="section-content">
          {#if getFilteredPosts().length === 0}
            <div class="empty-state">
              <MessageCircle size={48} />
              <p>No posts found matching your search</p>
            </div>
          {:else}
            {@const filteredPosts = getFilteredPosts()}
            <div class="posts-grid">
              {#each filteredPosts as post (post.id)}
                {@const CategoryIcon = getCategoryIcon(post.category)}
                <div class="post-card">
                  {#if post.isPinned}
                    <div class="post-pinned">
                      <Star size={12} />
                      <span>Pinned</span>
                    </div>
                  {/if}

                  <div class="post-header">
                    <img 
                      src="https://ui-avatars.com/api/?name={encodeURIComponent(post.authorName)}&background=6a2c91&color=fff" 
                      alt={post.authorName} 
                      class="post-avatar" 
                    />
                    <div class="post-author">
                      <div class="author-name">
                        {post.authorName}
                        {#if post.isVerified}
                          <CheckCircle size={14} class="verified-badge" />
                        {/if}
                      </div>
                      <div class="author-role">{formatDate(post.createdAt)}</div>
                    </div>
                    <div class="post-category" style="background: {getCategoryColor(post.category)}10; color: {getCategoryColor(post.category)}">
                      <CategoryIcon size={12} />
                      <span>{getCategoryLabel(post.category)}</span>
                    </div>
                  </div>

                  <div class="post-content">
                    <p>{post.content}</p>
                  </div>

                  <div class="post-footer">
                    <div class="post-stats">
                      <form method="POST" action="?/toggleLike" use:enhance>
                        <input type="hidden" name="postId" value={post.id} />
                        <button type="submit" class="stat-btn {post.isLiked ? 'liked' : ''}">
                          <ThumbsUp size={14} />
                          <span>{post.likeCount}</span>
                        </button>
                      </form>
                      <button class="stat-btn">
                        <MessageCircle size={14} />
                        <span>{post.commentCount}</span>
                      </button>
                      <button class="stat-btn">
                        <Share2 size={14} />
                        <span>{post.shareCount}</span>
                      </button>
                    </div>
                    <div class="post-time">
                      <Clock size={12} />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Discussions Section -->
    {#if showDiscussions}
      <div class="section-container">
        <div class="section-header">
          <div class="section-title">
            <MessageSquare size={18} class="section-icon" />
            <h2>Discussions</h2>
            <span class="section-count">{getFilteredDiscussions().length} discussions</span>
          </div>
        </div>

        <div class="section-content">
          {#if getFilteredDiscussions().length === 0}
            <div class="empty-state">
              <MessageSquare size={48} />
              <p>No discussions found matching your search</p>
            </div>
          {:else}
            {@const filteredDiscussions = getFilteredDiscussions()}
            <div class="discussions-list">
              {#each filteredDiscussions as discussion (discussion.id)}
                {@const CategoryIcon = getCategoryIcon(discussion.category)}
                <div class="discussion-card">
                  {#if discussion.isSticky}
                    <div class="discussion-sticky">
                      <Star size={12} />
                      <span>Sticky</span>
                    </div>
                  {/if}

                  <div class="discussion-header">
                    <div class="discussion-category" style="background: {getCategoryColor(discussion.category)}10; color: {getCategoryColor(discussion.category)}">
                      <CategoryIcon size={12} />
                      <span>{getCategoryLabel(discussion.category)}</span>
                    </div>
                    <div class="discussion-stats">
                      <span><MessageCircle size={12} /> {discussion.replyCount} replies</span>
                      <span><Eye size={12} /> {discussion.viewCount} views</span>
                    </div>
                  </div>

                  <h3 class="discussion-title">{discussion.title}</h3>

                  <div class="discussion-footer">
                    <span class="discussion-author">by {discussion.authorName}</span>
                    <span class="discussion-time">Last activity {formatDate(discussion.lastActivityAt)}</span>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Members Section -->
    {#if showMembers}
      <div class="section-container">
        <div class="section-header">
          <div class="section-title">
            <Users size={18} class="section-icon" />
            <h2>Members</h2>
            <span class="section-count">{getFilteredMembers().length} members</span>
          </div>
        </div>

        <div class="section-content">
          {#if getFilteredMembers().length === 0}
            <div class="empty-state">
              <Users size={48} />
              <p>No members found matching your search</p>
            </div>
          {:else}
            {@const filteredMembers = getFilteredMembers()}
            <div class="members-grid">
              {#each filteredMembers as member (member.id)}
                <div class="member-card">
                  <div class="member-avatar-wrapper">
                    <img 
                      src="https://ui-avatars.com/api/?name={encodeURIComponent(member.name)}&background=6a2c91&color=fff" 
                      alt={member.name} 
                      class="member-avatar" 
                    />
                  </div>

                  <h4 class="member-name">{member.name}</h4>
                  <div class="member-role">{tierToRole(member.tier)}</div>

                  <div class="member-stats">
                    <div class="member-stat">
                      <Award size={14} />
                      <span>{member.trustScore}</span>
                    </div>
                  </div>

                  {#if !member.isCurrentUser}
                    <form method="POST" action="?/toggleFollow" use:enhance>
                      <input type="hidden" name="followedId" value={member.id} />
                      <button type="submit" class="follow-btn {member.isFollowing ? 'following' : ''}">
                        <UserPlus size={14} />
                        {member.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </form>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Events Section -->
    {#if showEvents}
      <div class="section-container">
        <div class="section-header">
          <div class="section-title">
            <Calendar size={18} class="section-icon" />
            <h2>Upcoming Events</h2>
            <span class="section-count">{getFilteredEvents().length} events</span>
          </div>
        </div>

        <div class="section-content">
          {#if getFilteredEvents().length === 0}
            <div class="empty-state">
              <Calendar size={48} />
              <p>No events found matching your search</p>
            </div>
          {:else}
            {@const filteredEvents = getFilteredEvents()}
            <div class="events-grid">
              {#each filteredEvents as event (event.id)}
                <div class="event-card">
                  <div class="event-date-badge">
                    <span class="event-month">{formatEventDate(event.startsAt).split(' ')[0]}</span>
                    <span class="event-day">{formatEventDate(event.startsAt).split(' ')[1]}</span>
                  </div>

                  <div class="event-details">
                    <h4 class="event-title">{event.title}</h4>
                    <div class="event-info">
                      <span><MapPin size={12} /> {event.location}</span>
                      <span><Users size={12} /> {event.attendeeCount}{event.maxAttendees ? `/${event.maxAttendees}` : ''} attending</span>
                    </div>
                    {#if event.maxAttendees}
                      <div class="event-progress">
                        <div class="progress-bar" style="width: {(event.attendeeCount / event.maxAttendees) * 100}%"></div>
                      </div>
                    {/if}
                    <form method="POST" action="?/toggleRsvp" use:enhance>
                      <input type="hidden" name="eventId" value={event.id} />
                      <button type="submit" class="rsvp-btn {event.isAttending ? 'attending' : ''}">
                        {event.isAttending ? '✓ Going' : 'RSVP Now'}
                      </button>
                    </form>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Empty state -->
    {#if !showFeed && !showDiscussions && !showMembers && !showEvents && !showNeighbourhoodFeed}
      <div class="empty-state-all">
        <Filter size={64} />
        <h3>No sections visible</h3>
        <p>Use the filter buttons above to show community content</p>
        <button class="reset-btn" onclick={toggleAllSections}>
          Show All Sections
        </button>
      </div>
    {/if}
  </div>

  <!-- Create Post Modal -->
  {#if showCreatePost}
    <div class="modal-overlay" onclick={() => showCreatePost = false}>
      <div class="modal" onclick={(e) => e.stopPropagation()}>
        <form 
          method="POST" 
          action="?/createPost" 
          use:enhance={() => {
            return async ({ result, update }) => {
              if (result.type === 'success') {
                showCreatePost = false;
                newPost = { content: '', category: 'general', isAnonymous: false, scope: 'global' };
                await update();
              }
            };
          }}
        >
          <div class="modal-header">
            <div class="modal-title">
              <div class="modal-icon">
                <Plus size={20} />
              </div>
              <h2>Create New Post</h2>
            </div>
            <button type="button" class="modal-close" onclick={() => showCreatePost = false}>
              <X size={20} />
            </button>
          </div>

          <div class="modal-body">
            <div class="form-field">
              <label>Category</label>
              <div class="category-select">
                <input type="hidden" name="category" value={newPost.category} />
                {#each categories as cat}
                  <button 
                    type="button"
                    class="category-option {newPost.category === cat.id ? 'selected' : ''}"
                    style={newPost.category === cat.id ? `border-color: ${cat.color}; background: ${cat.color}10;` : ''}
                    onclick={() => newPost.category = cat.id}
                  >
                    <cat.icon size={16} style={newPost.category === cat.id ? `color: ${cat.color}` : ''} />
                    <span>{cat.label}</span>
                  </button>
                {/each}
              </div>
            </div>

            <div class="form-field">
              <label>Content</label>
              <textarea 
                name="content"
                bind:value={newPost.content}
                placeholder="Share your thoughts, safety tips, or questions with the community..."
                class="post-input"
                rows={6}
              ></textarea>
            </div>

            <div class="form-field">
              <label class="checkbox-label">
                <input type="checkbox" bind:checked={newPost.isAnonymous} />
                <span>Post anonymously</span>
              </label>
              <p class="field-hint">Your name won't be displayed publicly</p>
            </div>

            <div class="form-field">
              <label class="checkbox-label">
                <input type="radio" bind:group={newPost.scope} value="global" />
                <span>Global - Visible to everyone</span>
              </label>
              <label class="checkbox-label">
                <input type="radio" bind:group={newPost.scope} value="local" />
                <span>Local - Only visible in your area</span>
              </label>
            </div>

            <div class="post-actions">
              <button type="button" class="action-btn">
                <ImageIcon size={16} />
                Add Image
              </button>
              <button type="button" class="action-btn">
                <Link size={16} />
                Add Link
              </button>
              <button type="button" class="action-btn">
                <Smile size={16} />
                Add Emoji
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" onclick={() => showCreatePost = false}>
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              <Send size={16} />
              Publish Post
            </button>
          </div>

          <input type="hidden" name="isAnonymous" value={newPost.isAnonymous} />
          <input type="hidden" name="scope" value={newPost.scope} />
        </form>
      </div>
    </div>
  {/if}
</div>


<style>
.loading-placeholder {
    padding: 2rem;
    text-align: center;
    color: #666;
  }

  .debug-placeholder {
    padding: 2rem;
    text-align: center;
    background: #f0f9ff;
    border: 2px dashed #3b82f6;
    border-radius: 8px;
    color: #1e40af;
  }

  .community-page {
    min-height: 100vh;
    background: transparent;
    padding: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .community-container {
    max-width: 100%;
    margin: 0 auto;
  }

  /* Header Styles */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 1.5rem;
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    border: 1px solid #e2e8f0;
  }

  .header-left, .header-right {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .header-left { justify-content: flex-start; }
  .header-right { justify-content: flex-end; }

  .header-center {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #64748b;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
    transition: all 0.2s;
  }

  .back-btn:hover {
    background: #f1f5f9;
    color: var(--primary-color);
  }

  .logo-badge {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .header-center h1 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.125rem;
  }

  .header-center p {
    font-size: 0.75rem;
    color: #64748b;
  }

  .create-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .create-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  /* Stats Cards */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    background: white;
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .members-icon { background: #EDE9FE; color: #8B5CF6; }
  .posts-icon { background: #DBEAFE; color: #3B82F6; }
  .discussions-icon { background: #D1FAE5; color: #10B981; }
  .events-icon { background: #FEF3C7; color: #F59E0B; }

  .stat-content { flex: 1; }
  .stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: #0f172a; }
  .stat-label { font-size: 0.688rem; color: #64748b; }

  /* Search Bar */
  .search-bar-wrapper {
    margin-bottom: 1.5rem;
  }

  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
    background: white;
    border: 1.5px solid #e2e8f0;
    border-radius: 1rem;
    transition: all 0.2s;
  }

  .search-bar:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(106, 44, 145, 0.1);
  }

  .search-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 1rem;
  }

  .search-icon {
    color: #94a3b8;
  }

  .search-input {
    flex: 1;
    padding: 0.75rem 0.75rem;
    border: none;
    font-size: 0.875rem;
    background: transparent;
    outline: none;
  }

  .search-input::placeholder {
    color: #94a3b8;
  }

  .clear-search {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .clear-search:hover {
    background: #f1f5f9;
    color: #475569;
  }

  /* Filter Bar */
  .filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: white;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .filter-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.813rem;
    font-weight: 500;
    color: #64748b;
  }

  .filter-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .filter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }

  .filter-btn:hover {
    background: #f1f5f9;
    border-color: var(--primary-border);
  }

  .filter-btn.active {
    background: var(--primary-bg);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  .filter-count {
    background: #e2e8f0;
    padding: 0.125rem 0.375rem;
    border-radius: 0.5rem;
    font-size: 0.688rem;
    font-weight: 600;
  }

  .filter-btn.active .filter-count {
    background: var(--primary-color);
    color: white;
  }

  .toggle-all-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: none;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }

  .toggle-all-btn:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: var(--primary-bg);
  }

  /* Section Containers */
  .section-container {
    background: white;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    margin-bottom: 1rem;
    overflow: hidden;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: #fafafa;
    border-bottom: 1px solid #f1f5f9;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .section-icon {
    color: var(--primary-color);
  }

  .section-title h2 {
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
  }

  .section-count {
    font-size: 0.75rem;
    color: #64748b;
    background: #f1f5f9;
    padding: 0.125rem 0.5rem;
    border-radius: 0.5rem;
  }

  .section-content {
    padding: 1.25rem;
  }

  /* Empty States */
  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #94a3b8;
  }

  .empty-state svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-state p {
    font-size: 0.875rem;
  }

  .empty-state-all {
    text-align: center;
    padding: 4rem;
    background: white;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
  }

  .empty-state-all svg {
    margin-bottom: 1rem;
    opacity: 0.5;
    color: #94a3b8;
  }

  .empty-state-all h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .empty-state-all p {
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 1.5rem;
  }

  .reset-btn {
    padding: 0.625rem 1.25rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .reset-btn:hover {
    background: var(--primary-dark);
  }

  /* Loading State */
  .loading-container {
    text-align: center;
    padding: 4rem;
    background: white;
    border-radius: 1.5rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Posts Grid */
  .posts-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .post-card {
    background: white;
    border-radius: 1rem;
    padding: 1.25rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
    position: relative;
  }

  .post-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .post-pinned {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.625rem;
    color: #F59E0B;
    background: #FEF3C7;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
  }

  .post-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .post-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .post-author { flex: 1; }
  .author-name { display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; font-weight: 600; color: #0f172a; }
  .verified-badge { color: #3B82F6; }
  .author-role { font-size: 0.688rem; color: #64748b; }

  .post-category {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.688rem;
    font-weight: 500;
  }

  .post-content { margin-bottom: 1rem; }
  .post-content p { font-size: 0.875rem; color: #475569; line-height: 1.6; }

  .post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.75rem;
    border-top: 1px solid #f1f5f9;
  }

  .post-stats { display: flex; gap: 1rem; }
  .stat-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background: none;
    border: none;
    font-size: 0.75rem;
    color: #64748b;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .stat-btn:hover {
    background: #f1f5f9;
    color: var(--primary-color);
  }

  .post-time {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.688rem;
    color: #94a3b8;
  }

  /* Discussions List */
  .discussions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .discussion-card {
    background: white;
    border-radius: 1rem;
    padding: 1.25rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
    position: relative;
  }

  .discussion-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .discussion-sticky {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.625rem;
    color: #F59E0B;
    background: #FEF3C7;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
  }

  .discussion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .discussion-category {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.688rem;
    font-weight: 500;
  }

  .discussion-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.688rem;
    color: #64748b;
  }

  .discussion-stats span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .discussion-title {
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.75rem;
  }

  .discussion-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.688rem;
    color: #64748b;
  }

  /* Members Grid */
  .members-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .member-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
  }

  .member-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .member-avatar-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 1rem;
  }

  .member-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--primary-color);
  }

  .online-dot {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 12px;
    height: 12px;
    background: #10B981;
    border-radius: 50%;
    border: 2px solid white;
  }

  .member-name {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.25rem;
  }

  .member-role {
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 0.75rem;
  }

  .member-badges {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.375rem;
    margin-bottom: 1rem;
  }

  .badge {
    font-size: 0.625rem;
    padding: 0.1875rem 0.5rem;
    background: #f1f5f9;
    border-radius: 0.5rem;
    color: #475569;
  }

  .member-stats {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .member-stat {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--primary-color);
  }

  .follow-btn {
    width: 100%;
    padding: 0.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .follow-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  /* Events Grid */
  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 1rem;
  }

  .event-card {
    background: white;
    border-radius: 1rem;
    padding: 1.25rem;
    border: 1px solid #e2e8f0;
    display: flex;
    gap: 1rem;
    transition: all 0.2s;
  }

  .event-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .event-date-badge {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .event-month { font-size: 0.688rem; font-weight: 600; text-transform: uppercase; }
  .event-day { font-size: 1.5rem; font-weight: 800; line-height: 1; }

  .event-details { flex: 1; }
  .event-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem; }

  .event-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }

  .event-info span {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.688rem;
    color: #64748b;
  }

  .event-progress {
    height: 6px;
    background: #f1f5f9;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color), var(--primary-dark));
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .rsvp-btn {
    width: 100%;
    padding: 0.5rem;
    background: var(--primary-bg);
    border: 1px solid var(--primary-border);
    color: var(--primary-color);
    border-radius: 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .rsvp-btn:hover {
    background: var(--primary-color);
    color: white;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 1.5rem;
    width: 90%;
    max-width: 600px;
    max-height: 85vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .modal-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .modal-icon {
    width: 36px;
    height: 36px;
    background: #f1f5f9;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-header h2 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #0f172a;
  }

  .modal-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 0.375rem;
    border-radius: 0.5rem;
  }

  .modal-body { padding: 1.5rem; }
  .modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #f1f5f9;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  .form-field { margin-bottom: 1.25rem; }
  .form-field label { display: block; font-size: 0.813rem; font-weight: 600; color: #0f172a; margin-bottom: 0.5rem; }

  .category-select {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .category-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
  }

  .category-option.selected { border-color: currentColor; }

  .post-input {
    width: 100%;
    padding: 0.75rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    resize: vertical;
  }

  .post-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(106, 44, 145, 0.1);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .checkbox-label input { cursor: pointer; }
  .field-hint { font-size: 0.625rem; color: #94a3b8; margin-top: 0.25rem; }

  .post-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.75rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.75rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: #f1f5f9;
    color: var(--primary-color);
  }

  .btn-primary, .btn-secondary {
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: var(--primary-color);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-primary:hover { background: var(--primary-dark); }

  .btn-secondary {
    background: none;
    border: 1.5px solid #e2e8f0;
    color: #64748b;
  }

  .btn-secondary:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .header-left, .header-right {
      width: 100%;
      justify-content: center;
    }

    .header-center { flex-direction: column; }
    .stats-row { grid-template-columns: 1fr; }
    .members-grid, .events-grid { grid-template-columns: 1fr; }
    
    .filter-bar {
      flex-direction: column;
      align-items: stretch;
    }
    
    .filter-buttons {
      justify-content: center;
    }
    
    .toggle-all-btn {
      justify-content: center;
    }
  }
  
  /* NeighbourhoodFeed sits flush inside the section card */
  .section-content--flush {
    padding: 0;
  }

  /* NeighbourhoodFeed's own header has rounded top corners inside the card */
  .section-content--flush :global(.nf-header) {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #e2e8f0;
  }

  /* Feed items list gets a little breathing room */
  .section-content--flush :global(.nf-list),
  .section-content--flush :global(.nf-loading),
  .section-content--flush :global(.nf-empty),
  .section-content--flush :global(.nf-filters),
  .section-content--flush :global(.nf-summary-wrap) {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }

  .section-content--flush :global(.nf-filters) {
    padding-top: .875rem;
  }

  .section-content--flush :global(.nf-list) {
    padding-bottom: 1.25rem;
  }

  .section-content--flush :global(.nf-loading),
  .section-content--flush :global(.nf-empty) {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  /* Remove outer border/shadow from feed items — card already provides them */
  .section-content--flush :global(.nf-item) {
    border-left-width: 3px;
  }
</style>