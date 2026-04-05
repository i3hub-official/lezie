<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    Bell,
    MapPin,
    AlertTriangle,
    TrendingUp,
    Shield,
    Eye,
    Clock,
    ChevronRight,
    FlagTriangleRight,
    Users,
    CheckCircle,
    AlertCircle,
    Loader2,
    Home,
    BarChart3,
    User,
    Settings,
    BellRing,
    Calendar,
    MessageCircle,
    ThumbsUp,
    Flame,
    Car,
    Building,
    Volume2,
    AlertOctagon
  } from 'lucide-svelte';
  
  let isLoading = $state(true);
  let user = $state<{ name: string; email: string; avatar?: string } | null>(null);
  let recentIncidents = $state<any[]>([]);
  let stats = $state({
    totalReports: 0,
    activeAlerts: 0,
    communityMembers: 0,
    safetyScore: 0,
    verifiedReports: 0,
    pendingReviews: 0
  });
  let notifications = $state<any[]>([]);
  let safetyTips = $state<string[]>([]);
  
  onMount(async () => {
    await loadDashboardData();
    isLoading = false;
  });
  
  async function loadDashboardData() {
    // TODO: Replace with actual API calls
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    user = {
      name: 'Alex Morgan',
      email: 'alex@example.com'
    };
    
    stats = {
      totalReports: 47,
      activeAlerts: 3,
      communityMembers: 1250,
      safetyScore: 86,
      verifiedReports: 32,
      pendingReviews: 8
    };
    
    recentIncidents = [
      {
        id: 1,
        title: 'Suspicious person near school',
        category: 'suspicious',
        severity: 'high',
        time: new Date(Date.now() - 2 * 3600000).toISOString(),
        location: 'Maple Street Elementary',
        status: 'verified',
        description: 'Person acting suspiciously near school entrance',
        verificationCount: 15,
        commentCount: 8
      },
      {
        id: 2,
        title: 'Car break-in on Main St',
        category: 'theft',
        severity: 'medium',
        time: new Date(Date.now() - 5 * 3600000).toISOString(),
        location: 'Main Street',
        status: 'investigating',
        description: 'Multiple vehicles broken into overnight',
        verificationCount: 12,
        commentCount: 5
      },
      {
        id: 3,
        title: 'Vandalism at community park',
        category: 'vandalism',
        severity: 'low',
        time: new Date(Date.now() - 1 * 86400000).toISOString(),
        location: 'Oak Park',
        status: 'resolved',
        description: 'Graffiti on park equipment and benches',
        verificationCount: 8,
        commentCount: 3
      },
      {
        id: 4,
        title: 'Structure fire reported',
        category: 'fire',
        severity: 'critical',
        time: new Date(Date.now() - 3 * 3600000).toISOString(),
        location: 'Downtown Business District',
        status: 'active',
        description: 'Fire at commercial building, emergency services on scene',
        verificationCount: 25,
        commentCount: 12
      }
    ];
    
    notifications = [
      {
        id: 1,
        title: 'New incident in your area',
        message: 'Suspicious activity reported on Maple Street',
        time: new Date(Date.now() - 10 * 60000).toISOString(),
        read: false,
        type: 'alert',
        incidentId: 1
      },
      {
        id: 2,
        title: 'Your report was verified',
        message: 'Community members confirmed your report about the suspicious vehicle',
        time: new Date(Date.now() - 1 * 3600000).toISOString(),
        read: false,
        type: 'success',
        incidentId: null
      },
      {
        id: 3,
        title: 'Weekly safety report ready',
        message: 'Your neighborhood safety score improved by 5% this week',
        time: new Date(Date.now() - 1 * 86400000).toISOString(),
        read: true,
        type: 'info',
        incidentId: null
      },
      {
        id: 4,
        title: 'Critical alert nearby',
        message: 'Fire reported 0.5km from your location',
        time: new Date(Date.now() - 2 * 3600000).toISOString(),
        read: false,
        type: 'critical',
        incidentId: 4
      }
    ];
    
    safetyTips = [
      'Always be aware of your surroundings',
      'Report suspicious activity immediately',
      'Share your location with trusted contacts',
      'Keep emergency numbers saved in your phone',
      'Join your neighborhood watch group',
      'Install security cameras at entry points'
    ];
  }
  
  function getCategoryIcon(category: string) {
    const icons: Record<string, any> = {
      suspicious: AlertTriangle,
      theft: AlertOctagon,
      vandalism: Building,
      fire: Flame,
      accident: Car,
      noise: Volume2
    };
    return icons[category] || AlertTriangle;
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
      case 'active': return 'var(--danger-color)';
      default: return 'var(--gray-color)';
    }
  }
  
  function getStatusIcon(status: string) {
    if (status === 'verified' || status === 'resolved') return CheckCircle;
    return AlertCircle;
  }
  
  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'Just now';
    if (hours < 1) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  }
  
  function markNotificationAsRead(notificationId: number) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      // TODO: API call to mark as read
    }
  }
  
  function getUnreadCount() {
    return notifications.filter(n => !n.read).length;
  }
</script>

<svelte:head>
  <title>Dashboard - Lezie</title>
</svelte:head>

<div class="dashboard-page">
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-mark">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L1 4.5L8 8L15 4.5L8 1Z" fill="white" fill-opacity=".9"/>
              <path d="M1 4.5V11.5L8 15L15 11.5V4.5" stroke="white" stroke-opacity=".6" stroke-width="1.2" fill="none"/>
            </svg>
          </div>
          <span>Lezie</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <button class="nav-item active" onclick={() => goto('/dashboard')}>
          <Home size={20} />
          <span>Dashboard</span>
        </button>
        <button class="nav-item" onclick={() => goto('/map')}>
          <MapPin size={20} />
          <span>Map View</span>
        </button>
        <button class="nav-item" onclick={() => goto('/alerts')}>
          <Bell size={20} />
          <span>Alerts</span>
        </button>
        <button class="nav-item" onclick={() => goto('/statistics')}>
          <BarChart3 size={20} />
          <span>Statistics</span>
        </button>
        <button class="nav-item" onclick={() => goto('/profile')}>
          <User size={20} />
          <span>Profile</span>
        </button>
        <button class="nav-item" onclick={() => goto('/settings')}>
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>
      
      <div class="sidebar-footer">
        <button class="report-btn" onclick={() => goto('/auth/report')}>
          <FlagTriangleRight size={18} />
          Report Incident
        </button>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="main-content">
      {#if isLoading}
        <div class="loading-state">
          <Loader2 size={40} class="spinning" />
          <p>Loading your dashboard...</p>
        </div>
      {:else}
        <!-- Welcome Header -->
        <div class="welcome-header">
          <div>
            <h1>Welcome back, {user?.name.split(' ')[0]}</h1>
            <p>Here's what's happening in your community</p>
          </div>
          <div class="header-actions">
            <button class="icon-btn" onclick={() => goto('/alerts')} aria-label="Notifications">
              <BellRing size={20} />
              {#if getUnreadCount() > 0}
                <span class="notification-badge">{getUnreadCount()}</span>
              {/if}
            </button>
          </div>
        </div>
        
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(106, 44, 145, 0.1); color: var(--primary-color);">
              <FlagTriangleRight size={24} />
            </div>
            <div class="stat-info">
              <span class="stat-value">{stats.totalReports}</span>
              <span class="stat-label">Total Reports</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: #10B981;">
              <CheckCircle size={24} />
            </div>
            <div class="stat-info">
              <span class="stat-value">{stats.verifiedReports}</span>
              <span class="stat-label">Verified Reports</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1); color: #F59E0B;">
              <Bell size={24} />
            </div>
            <div class="stat-info">
              <span class="stat-value">{stats.activeAlerts}</span>
              <span class="stat-label">Active Alerts</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(59, 130, 246, 0.1); color: #3B82F6;">
              <Shield size={24} />
            </div>
            <div class="stat-info">
              <span class="stat-value">{stats.safetyScore}%</span>
              <span class="stat-label">Safety Score</span>
            </div>
          </div>
        </div>
        
        <!-- Two Column Layout -->
        <div class="two-columns">
          <!-- Left Column -->
          <div class="left-column">
            <!-- Recent Incidents -->
            <div class="section">
              <div class="section-header">
                <h2>Recent Incidents</h2>
                <button class="section-link" onclick={() => goto('/map')}>
                  View all
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div class="incidents-list">
                {#each recentIncidents as incident}
                  {@const IconComponent = getCategoryIcon(incident.category)}
                  <button class="incident-card" onclick={() => goto(`/incident/${incident.id}`)}>
                    <div class="incident-header">
                      <div class="incident-title">
                        <div class="incident-icon" style="background: {getSeverityColor(incident.severity)}20;">
                          <IconComponent size={16} style="color: {getSeverityColor(incident.severity)};" />
                        </div>
                        <div>
                          <h3>{incident.title}</h3>
                          <div class="incident-meta">
                            <span class="meta-item">
                              <MapPin size={12} />
                              {incident.location}
                            </span>
                            <span class="meta-item">
                              <Clock size={12} />
                              {formatTime(incident.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="incident-status" style="color: {getStatusColor(incident.status)}">
                        {@const StatusIcon = getStatusIcon(incident.status)}
                        <StatusIcon size={14} />
                        <span>{incident.status}</span>
                      </div>
                    </div>
                    
                    <p class="incident-description">{incident.description}</p>
                    
                    <div class="incident-stats">
                      <span class="stat-badge">
                        <ThumbsUp size={12} />
                        {incident.verificationCount} verifications
                      </span>
                      <span class="stat-badge">
                        <MessageCircle size={12} />
                        {incident.commentCount} comments
                      </span>
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          </div>
          
          <!-- Right Column -->
          <div class="right-column">
            <!-- Quick Actions -->
            <div class="section">
              <div class="section-header">
                <h2>Quick Actions</h2>
              </div>
              <div class="quick-actions">
                <button class="action-card" onclick={() => goto('/auth/report')}>
                  <FlagTriangleRight size={24} style="color: var(--primary-color);" />
                  <div>
                    <h4>Report Incident</h4>
                    <p>File a new incident report</p>
                  </div>
                </button>
                <button class="action-card" onclick={() => goto('/alerts')}>
                  <Bell size={24} style="color: var(--primary-color);" />
                  <div>
                    <h4>Manage Alerts</h4>
                    <p>Customize your alert zones</p>
                  </div>
                </button>
                <button class="action-card" onclick={() => goto('/statistics')}>
                  <TrendingUp size={24} style="color: var(--primary-color);" />
                  <div>
                    <h4>View Statistics</h4>
                    <p>See community safety trends</p>
                  </div>
                </button>
              </div>
            </div>
            
            <!-- Notifications -->
            <div class="section">
              <div class="section-header">
                <h2>Recent Notifications</h2>
                {#if getUnreadCount() > 0}
                  <span class="unread-badge">{getUnreadCount()} new</span>
                {/if}
              </div>
              
              <div class="notifications-list">
                {#each notifications.slice(0, 5) as notification}
                  <div 
                    class="notification-card {!notification.read ? 'unread' : ''}"
                    onclick={() => {
                      markNotificationAsRead(notification.id);
                      if (notification.incidentId) {
                        goto(`/incident/${notification.incidentId}`);
                      }
                    }}
                  >
                    <div class="notification-icon">
                      {#if notification.type === 'critical'}
                        <AlertTriangle size={18} style="color: var(--danger-color);" />
                      {:else if notification.type === 'success'}
                        <CheckCircle size={18} style="color: var(--success-color);" />
                      {:else if notification.type === 'alert'}
                        <Bell size={18} style="color: var(--warning-color);" />
                      {:else}
                        <BellRing size={18} style="color: var(--primary-color);" />
                      {/if}
                    </div>
                    <div class="notification-content">
                      <div class="notification-header">
                        <h4>{notification.title}</h4>
                        <span class="notification-time">{formatTime(notification.time)}</span>
                      </div>
                      <p>{notification.message}</p>
                    </div>
                  </div>
                {/each}
              </div>
              
              {#if notifications.length > 5}
                <button class="view-all-btn" onclick={() => goto('/alerts')}>
                  View all notifications
                  <ChevronRight size={16} />
                </button>
              {/if}
            </div>
            
            <!-- Safety Tips -->
            <div class="section safety-section">
              <div class="section-header">
                <h2>Safety Tips</h2>
                <Shield size={18} style="color: var(--primary-color);" />
              </div>
              <ul class="safety-tips-list">
                {#each safetyTips.slice(0, 5) as tip}
                  <li>
                    <span class="tip-dot"></span>
                    <span>{tip}</span>
                  </li>
                {/each}
              </ul>
              <button class="tips-link" onclick={() => goto('/safety-tips')}>
                View all safety tips
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      {/if}
    </main>
  </div>
</div>

<style>
  .dashboard-page {
    min-height: 100vh;
    background: #f9fafb;
  }
  
  .dashboard-container {
    display: flex;
    min-height: 100vh;
  }
  
  /* Sidebar */
  .sidebar {
    width: 280px;
    background: white;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 10;
  }
  
  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-dark);
  }
  
  .logo-mark {
    width: 32px;
    height: 32px;
    background: var(--primary-color);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #6b7280;
    background: none;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    text-align: left;
    font-size: 0.875rem;
  }
  
  .nav-item:hover {
    background: var(--primary-bg);
    color: var(--primary-color);
  }
  
  .nav-item.active {
    background: var(--primary-bg);
    color: var(--primary-color);
    font-weight: 500;
  }
  
  .sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .report-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .report-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  /* Main Content */
  .main-content {
    flex: 1;
    margin-left: 280px;
    padding: 2rem;
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
  
  .spinning {
    animation: spin 1s linear infinite;
  }
  
  /* Welcome Header */
  .welcome-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .welcome-header h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 0.25rem;
  }
  
  .welcome-header p {
    color: var(--gray-color);
  }
  
  .header-actions {
    position: relative;
  }
  
  .icon-btn {
    position: relative;
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: var(--gray-color);
    border-radius: 0.5rem;
    transition: all 0.2s;
  }
  
  .icon-btn:hover {
    background: var(--primary-bg);
    color: var(--primary-color);
  }
  
  .notification-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    background: var(--danger-color);
    color: white;
    font-size: 0.625rem;
    padding: 0.125rem 0.375rem;
    border-radius: 0.75rem;
    font-weight: 600;
  }
  
  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
  }
  
  .stat-info {
    flex: 1;
  }
  
  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark-color);
  }
  
  .stat-label {
    font-size: 0.813rem;
    color: var(--gray-color);
  }
  
  /* Two Column Layout */
  .two-columns {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 1.5rem;
  }
  
  /* Sections */
  .section {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .section-header h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--dark-color);
  }
  
  .section-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--primary-color);
    background: none;
    border: none;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
  }
  
  /* Incidents */
  .incidents-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .incident-card {
    width: 100%;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
    text-align: left;
  }
  
  .incident-card:hover {
    border-color: var(--primary-color);
    background: var(--primary-bg);
    transform: translateX(4px);
  }
  
  .incident-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }
  
  .incident-title {
    display: flex;
    gap: 0.75rem;
    flex: 1;
  }
  
  .incident-icon {
    width: 32px;
    height: 32px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .incident-title h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 0.25rem;
  }
  
  .incident-meta {
    display: flex;
    gap: 0.75rem;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.688rem;
    color: var(--gray-color);
  }
  
  .incident-status {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.688rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .incident-description {
    font-size: 0.75rem;
    color: var(--gray-color);
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }
  
  .incident-stats {
    display: flex;
    gap: 1rem;
  }
  
  .stat-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.688rem;
    color: var(--gray-color);
  }
  
  /* Quick Actions */
  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .action-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--light-color);
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  
  .action-card:hover {
    border-color: var(--primary-color);
    background: var(--primary-bg);
    transform: translateX(4px);
  }
  
  .action-card h4 {
    font-size: 0.813rem;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 0.125rem;
  }
  
  .action-card p {
    font-size: 0.688rem;
    color: var(--gray-color);
  }
  
  /* Notifications */
  .unread-badge {
    font-size: 0.688rem;
    padding: 0.125rem 0.5rem;
    background: var(--danger-color);
    color: white;
    border-radius: 0.75rem;
  }
  
  .notifications-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .notification-card {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .notification-card.unread {
    background: var(--primary-bg);
  }
  
  .notification-card:hover {
    background: #f3f4f6;
  }
  
  .notification-icon {
    flex-shrink: 0;
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }
  
  .notification-header h4 {
    font-size: 0.813rem;
    font-weight: 600;
    color: var(--dark-color);
  }
  
  .notification-time {
    font-size: 0.688rem;
    color: var(--gray-color);
  }
  
  .notification-content p {
    font-size: 0.75rem;
    color: var(--gray-color);
  }
  
  .view-all-btn {
    width: 100%;
    margin-top: 1rem;
    padding: 0.5rem;
    background: none;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    color: var(--primary-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
  }
  
  /* Safety Tips */
  .safety-section {
    background: linear-gradient(135deg, var(--primary-bg) 0%, #ffffff 100%);
  }
  
  .safety-tips-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
  }
  
  .safety-tips-list li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    font-size: 0.75rem;
    color: var(--gray-color);
  }
  
  .tip-dot {
    width: 4px;
    height: 4px;
    background: var(--primary-color);
    border-radius: 50%;
  }
  
  .tips-link {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .two-columns {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s;
      z-index: 100;
    }
    
    .sidebar.open {
      transform: translateX(0);
    }
    
    .main-content {
      margin-left: 0;
      padding: 1rem;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .welcome-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .welcome-header h1 {
      font-size: 1.5rem;
    }
  }
</style>