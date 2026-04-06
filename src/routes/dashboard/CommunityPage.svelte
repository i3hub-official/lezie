<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    Users, MessageCircle, Heart, Share2, Flag, ThumbsUp,
    UserPlus, Search, Filter, X, ChevronLeft, Plus,
    Clock, MapPin, Award, Shield, Crown, Star,
    TrendingUp, MessageSquare, Eye, MoreHorizontal,
    Send, Image as ImageIcon, Link, Smile,
    ChevronRight, Calendar, Bell, CheckCircle,
    AlertCircle, HelpCircle, BookOpen, Target
  } from 'lucide-svelte';

  let isLoading = $state(true);
  let activeTab = $state('feed');
  let showCreatePost = $state(false);
  let searchQuery = $state('');
  let selectedPost = $state<any>(null);
  let expandedSections = $state({
    feed: true,
    discussions: true,
    members: true,
    events: true
  });
  let newPost = $state({
    content: '',
    category: 'general',
    isAnonymous: false
  });

  let posts = $state<any[]>([]);
  let discussions = $state<any[]>([]);
  let members = $state<any[]>([]);
  let events = $state<any[]>([]);
  let currentUser = $state<any>(null);
  
  let categories = $state([
    { id: 'general', label: 'General Discussion', icon: MessageCircle, color: '#6B7280' },
    { id: 'safety', label: 'Safety Tips', icon: Shield, color: '#10B981' },
    { id: 'alerts', label: 'Alert Sharing', icon: Bell, color: '#F59E0B' },
    { id: 'questions', label: 'Questions', icon: HelpCircle, color: '#3B82F6' },
    { id: 'success', label: 'Success Stories', icon: Award, color: '#8B5CF6' }
  ]);

  onMount(async () => {
    await loadData();
    isLoading = false;
  });

  async function loadData() {
    await new Promise(resolve => setTimeout(resolve, 800));

    currentUser = {
      id: 1,
      name: 'Ogwo GP',
      avatar: 'https://ui-avatars.com/api/?name=Ogwo+Godspower&background=6a2c91&color=fff',
      role: 'Safety Ambassador',
      joinDate: '2024-01-15',
      posts: 47,
      reputation: 1250,
      badges: ['Helper', 'Vigilant', 'Community Hero']
    };

    posts = [
      {
        id: 1,
        author: {
          name: 'Okpala Ebubechukwu Favour',
          avatar: 'https://ui-avatars.com/api/?name=Okpala+Ebubechukwu&background=10B981&color=fff',
          role: 'Neighborhood Watch'
        },
        content: 'Just wanted to share that the new street lights on Maple Avenue have made a huge difference! Haven\'t seen any suspicious activity in weeks. Great job everyone!',
        category: 'success',
        likes: 234,
        comments: 45,
        shares: 12,
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        isPinned: true,
        isVerified: true
      },
      {
        id: 2,
        author: {
          name: 'Ephraim Joy',
          avatar: 'https://ui-avatars.com/api/?name=Ephraim+Joy&background=F59E0B&color=fff',
          role: 'Safety Officer'
        },
        content: 'Safety tip: Always keep your emergency contacts updated in your profile. In case of an incident, having quick access to emergency contacts can save precious minutes.',
        category: 'safety',
        likes: 189,
        comments: 32,
        shares: 67,
        timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
        isPinned: true,
        isVerified: true
      },
      {
        id: 3,
        author: {
          name: 'Onyeukwu Damain',
          avatar: 'https://ui-avatars.com/api/?name=Onyeukwu+Damain&background=EF4444&color=fff',
          role: 'Active Member'
        },
        content: 'Has anyone noticed increased police presence near the downtown area? I\'ve seen more patrols lately and wondering if there\'s a specific reason.',
        category: 'questions',
        likes: 67,
        comments: 23,
        shares: 4,
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
        isPinned: false,
        isVerified: false
      }
    ];

    discussions = [
      {
        id: 1,
        title: 'Neighborhood Watch Program Expansion',
        author: 'Community Board',
        category: 'general',
        replies: 234,
        views: 1245,
        lastActivity: new Date(Date.now() - 3 * 3600000).toISOString(),
        isSticky: true
      },
      {
        id: 2,
        title: 'How to improve lighting in our area?',
        author: 'Safety Committee',
        category: 'safety',
        replies: 89,
        views: 567,
        lastActivity: new Date(Date.now() - 1 * 86400000).toISOString(),
        isSticky: false
      },
      {
        id: 3,
        title: 'Emergency response times - share your experience',
        author: 'John Parker',
        category: 'alerts',
        replies: 145,
        views: 890,
        lastActivity: new Date(Date.now() - 2 * 86400000).toISOString(),
        isSticky: false
      }
    ];

    members = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6a2c91&color=fff',
        role: 'Safety Ambassador',
        reputation: 2450,
        badges: ['Expert', 'Helper', 'Leader'],
        isOnline: true
      },
      {
        id: 2,
        name: 'Michael Chen',
        avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10B981&color=fff',
        role: 'Neighborhood Watch',
        reputation: 1870,
        badges: ['Vigilant', 'Helper'],
        isOnline: true
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=F59E0B&color=fff',
        role: 'Active Member',
        reputation: 890,
        badges: ['Newcomer'],
        isOnline: false
      },
      {
        id: 4,
        name: 'David Kim',
        avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=3B82F6&color=fff',
        role: 'Community Organizer',
        reputation: 3100,
        badges: ['Leader', 'Expert', 'Helper', 'Vigilant'],
        isOnline: true
      },
      {
        id: 5,
        name: 'Maria Garcia',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=EF4444&color=fff',
        role: 'Safety Monitor',
        reputation: 1560,
        badges: ['Vigilant', 'Helper'],
        isOnline: false
      },
      {
        id: 6,
        name: 'James Wilson',
        avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=8B5CF6&color=fff',
        role: 'Active Member',
        reputation: 720,
        badges: ['Newcomer'],
        isOnline: true
      }
    ];

    events = [
      {
        id: 1,
        title: 'Community Safety Workshop',
        date: new Date(Date.now() + 5 * 86400000).toISOString(),
        location: 'Community Center',
        attendees: 45,
        maxAttendees: 100,
        category: 'workshop',
        description: 'Learn essential safety tips and emergency response techniques'
      },
      {
        id: 2,
        title: 'Neighborhood Watch Meeting',
        date: new Date(Date.now() + 12 * 86400000).toISOString(),
        location: 'Maple Street School',
        attendees: 32,
        maxAttendees: 50,
        category: 'meeting',
        description: 'Monthly meeting to discuss community safety initiatives'
      },
      {
        id: 3,
        title: 'First Aid Certification Course',
        date: new Date(Date.now() + 19 * 86400000).toISOString(),
        location: 'Red Cross Building',
        attendees: 18,
        maxAttendees: 25,
        category: 'training',
        description: 'Get certified in first aid and CPR'
      }
    ];
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }

  function formatEventDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function getCategoryIcon(categoryId: string) {
    return categories.find(c => c.id === categoryId)?.icon || MessageCircle;
  }

  function getCategoryColor(categoryId: string) {
    return categories.find(c => c.id === categoryId)?.color || '#6B7280';
  }

  function getFilteredPosts() {
    if (!searchQuery) return posts;
    return posts.filter(p => 
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function getFilteredDiscussions() {
    if (!searchQuery) return discussions;
    return discussions.filter(d => 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function getFilteredMembers() {
    if (!searchQuery) return members;
    return members.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function getFilteredEvents() {
    if (!searchQuery) return events;
    return events.filter(e => 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function getCategoryLabel(categoryId: string) {
    return categories.find(c => c.id === categoryId)?.label || categoryId;
  }

  function toggleSection(section: keyof typeof expandedSections) {
    expandedSections[section] = !expandedSections[section];
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
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon members-icon">
          <Users size={22} />
        </div>
        <div class="stat-content">
          <span class="stat-value">1,250</span>
          <span class="stat-label">Active Members</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon posts-icon">
          <MessageCircle size={22} />
        </div>
        <div class="stat-content">
          <span class="stat-value">3,421</span>
          <span class="stat-label">Total Posts</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon discussions-icon">
          <MessageSquare size={22} />
        </div>
        <div class="stat-content">
          <span class="stat-value">847</span>
          <span class="stat-label">Discussions</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon events-icon">
          <Calendar size={22} />
        </div>
        <div class="stat-content">
          <span class="stat-value">12</span>
          <span class="stat-label">Upcoming Events</span>
        </div>
      </div>
    </div>

    <!-- Search Bar - Fixed alignment -->
    <div class="search-bar-wrapper">
      <div class="search-bar">
        <div class="search-icon-wrapper">
          <Search size={18} class="search-icon" />
        </div>
        <input 
          type="text" 
          placeholder="Search discussions, posts, or members..." 
          bind:value={searchQuery}
          class="search-input"
        />
        {#if searchQuery}
          <button class="clear-search" onclick={() => searchQuery = ''}>
            <X size={16} />
          </button>
        {/if}
      </div>
    </div>

    {#if isLoading}
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading community content...</p>
      </div>
    {:else}
      <!-- Expandable Sections -->
      
      <!-- Community Feed Section -->
      <div class="expandable-section">
        <button class="section-header" onclick={() => toggleSection('feed')}>
          <div class="section-title">
            <TrendingUp size={18} class="section-icon" />
            <h2>Community Feed</h2>
            <span class="section-count">{getFilteredPosts().length} posts</span>
          </div>
          <ChevronRight size={18} class={`section-chevron ${expandedSections.feed ? 'expanded' : ''}`} />
        </button>
        
        {#if expandedSections.feed}
          <div class="section-content">
            {#if getFilteredPosts().length === 0}
              <div class="empty-state">
                <MessageCircle size={48} />
                <p>No posts found matching your search</p>
              </div>
            {:else}
              <div class="posts-grid">
                {#each getFilteredPosts() as post}
                  {@const CategoryIcon = getCategoryIcon(post.category)}
                  <div class="post-card">
                    {#if post.isPinned}
                      <div class="post-pinned">
                        <Star size={12} />
                        <span>Pinned</span>
                      </div>
                    {/if}

                    <div class="post-header">
                      <img src={post.author.avatar} alt={post.author.name} class="post-avatar" />
                      <div class="post-author">
                        <div class="author-name">
                          {post.author.name}
                          {#if post.isVerified}
                            <CheckCircle size={14} class="verified-badge" />
                          {/if}
                        </div>
                        <div class="author-role">{post.author.role}</div>
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
                        <button class="stat-btn">
                          <ThumbsUp size={14} />
                          <span>{post.likes}</span>
                        </button>
                        <button class="stat-btn">
                          <MessageCircle size={14} />
                          <span>{post.comments}</span>
                        </button>
                        <button class="stat-btn">
                          <Share2 size={14} />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                      <div class="post-time">
                        <Clock size={12} />
                        <span>{formatDate(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Discussions Section -->
      <div class="expandable-section">
        <button class="section-header" onclick={() => toggleSection('discussions')}>
          <div class="section-title">
            <MessageSquare size={18} class="section-icon" />
            <h2>Discussions</h2>
            <span class="section-count">{getFilteredDiscussions().length} discussions</span>
          </div>
          <ChevronRight size={18} class={`section-chevron ${expandedSections.discussions ? 'expanded' : ''}`} />
        </button>
        
        {#if expandedSections.discussions}
          <div class="section-content">
            {#if getFilteredDiscussions().length === 0}
              <div class="empty-state">
                <MessageSquare size={48} />
                <p>No discussions found matching your search</p>
              </div>
            {:else}
              <div class="discussions-list">
                {#each getFilteredDiscussions() as discussion}
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
                        <span><MessageCircle size={12} /> {discussion.replies} replies</span>
                        <span><Eye size={12} /> {discussion.views} views</span>
                      </div>
                    </div>

                    <h3 class="discussion-title">{discussion.title}</h3>

                    <div class="discussion-footer">
                      <span class="discussion-author">by {discussion.author}</span>
                      <span class="discussion-time">Last activity {formatDate(discussion.lastActivity)}</span>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Members Section -->
      <div class="expandable-section">
        <button class="section-header" onclick={() => toggleSection('members')}>
          <div class="section-title">
            <Users size={18} class="section-icon" />
            <h2>Members</h2>
            <span class="section-count">{getFilteredMembers().length} members</span>
          </div>
          <ChevronRight size={18} class={`section-chevron ${expandedSections.members ? 'expanded' : ''}`} />
        </button>
        
        {#if expandedSections.members}
          <div class="section-content">
            {#if getFilteredMembers().length === 0}
              <div class="empty-state">
                <Users size={48} />
                <p>No members found matching your search</p>
              </div>
            {:else}
              <div class="members-grid">
                {#each getFilteredMembers() as member}
                  <div class="member-card">
                    <div class="member-avatar-wrapper">
                      <img src={member.avatar} alt={member.name} class="member-avatar" />
                      {#if member.isOnline}
                        <span class="online-dot"></span>
                      {/if}
                    </div>

                    <h4 class="member-name">{member.name}</h4>
                    <div class="member-role">{member.role}</div>

                    <div class="member-badges">
                      {#each member.badges as badge}
                        <span class="badge">{badge}</span>
                      {/each}
                    </div>

                    <div class="member-stats">
                      <div class="member-stat">
                        <Award size={14} />
                        <span>{member.reputation}</span>
                      </div>
                    </div>

                    <button class="follow-btn">
                      <UserPlus size={14} />
                      Follow
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Events Section -->
      <div class="expandable-section">
        <button class="section-header" onclick={() => toggleSection('events')}>
          <div class="section-title">
            <Calendar size={18} class="section-icon" />
            <h2>Upcoming Events</h2>
            <span class="section-count">{getFilteredEvents().length} events</span>
          </div>
          <ChevronRight size={18} class={`section-chevron ${expandedSections.events ? 'expanded' : ''}`} />
        </button>
        
        {#if expandedSections.events}
          <div class="section-content">
            {#if getFilteredEvents().length === 0}
              <div class="empty-state">
                <Calendar size={48} />
                <p>No events found matching your search</p>
              </div>
            {:else}
              <div class="events-grid">
                {#each getFilteredEvents() as event}
                  <div class="event-card">
                    <div class="event-date-badge">
                      <span class="event-month">{formatEventDate(event.date).split(' ')[0]}</span>
                      <span class="event-day">{formatEventDate(event.date).split(' ')[1]}</span>
                    </div>

                    <div class="event-details">
                      <h4 class="event-title">{event.title}</h4>
                      <div class="event-info">
                        <span><MapPin size={12} /> {event.location}</span>
                        <span><Users size={12} /> {event.attendees}/{event.maxAttendees} attending</span>
                      </div>
                      <div class="event-progress">
                        <div class="progress-bar" style="width: {(event.attendees / event.maxAttendees) * 100}%"></div>
                      </div>
                      <button class="rsvp-btn">
                        RSVP Now
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Create Post Modal -->
  {#if showCreatePost}
    <div class="modal-overlay" onclick={() => showCreatePost = false}>
      <div class="modal" onclick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <div class="modal-title">
            <div class="modal-icon">
              <Plus size={20} />
            </div>
            <h2>Create New Post</h2>
          </div>
          <button class="modal-close" onclick={() => showCreatePost = false}>
            <X size={20} />
          </button>
        </div>

        <div class="modal-body">
          <div class="form-field">
            <label>Category</label>
            <div class="category-select">
              {#each categories as cat}
                <button 
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

          <div class="post-actions">
            <button class="action-btn">
              <ImageIcon size={16} />
              Add Image
            </button>
            <button class="action-btn">
              <Link size={16} />
              Add Link
            </button>
            <button class="action-btn">
              <Smile size={16} />
              Add Emoji
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" onclick={() => showCreatePost = false}>
            Cancel
          </button>
          <button class="btn-primary" onclick={() => {
            showCreatePost = false;
            newPost = { content: '', category: 'general', isAnonymous: false };
          }}>
            <Send size={16} />
            Publish Post
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
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

  /* Search Bar - Fixed Alignment */
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

  /* Expandable Sections */
  .expandable-section {
    background: white;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    margin-bottom: 1rem;
    overflow: hidden;
    transition: all 0.2s;
  }

  .section-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: white;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
    font-family: 'DM Sans', sans-serif;
  }

  .section-header:hover {
    background: #f8fafc;
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

  .section-chevron {
    color: #94a3b8;
    transition: transform 0.3s ease;
  }

  .section-chevron.expanded {
    transform: rotate(90deg);
  }

  .section-content {
    padding: 0 1.25rem 1.25rem 1.25rem;
    border-top: 1px solid #f1f5f9;
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Empty State */
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
    
    .section-header {
      padding: 0.875rem 1rem;
    }
    
    .section-title h2 {
      font-size: 0.875rem;
    }
    
    .section-content {
      padding: 0 1rem 1rem 1rem;
    }
  }
</style>