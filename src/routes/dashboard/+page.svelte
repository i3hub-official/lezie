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
    MessageCircle,
    ThumbsUp,
    Flame,
    Car,
    Building,
    Volume2,
    AlertOctagon,
    Menu,
    X,
    LogOut,
    HelpCircle,
    Award,
    FileText,
    Calendar,
    Star,
    Globe,
    Activity
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
  let isMobileMenuOpen = $state(false);
  
  onMount(() => {
    loadDashboardData();
    isLoading = false;
  });
  
  async function loadDashboardData() {
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
        message: 'Community members confirmed your report',
        time: new Date(Date.now() - 1 * 3600000).toISOString(),
        read: false,
        type: 'success',
        incidentId: null
      },
      {
        id: 3,
        title: 'Weekly safety report ready',
        message: 'Your neighborhood safety score improved by 5%',
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
      'Keep emergency numbers saved',
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
      case 'verified': return '#10B981';
      case 'resolved': return '#6B7280';
      case 'investigating': return '#F59E0B';
      case 'active': return '#EF4444';
      default: return '#6B7280';
    }
  }
  
  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'Just now';
    if (hours < 1) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }
  
  function getUnreadCount() {
    return notifications.filter(n => !n.read).length;
  }
  
  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }
  
  // Navigation items for sidebar
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', active: true },
    { path: '/map', icon: MapPin, label: 'Map View', active: false },
    { path: '/alerts', icon: Bell, label: 'Alerts', active: false },
    { path: '/statistics', icon: BarChart3, label: 'Statistics', active: false },
    { path: '/reports-history', icon: FileText, label: 'My Reports', active: false },
    { path: '/community', icon: Users, label: 'Community', active: false },
    { path: '/profile', icon: User, label: 'Profile', active: false },
    { path: '/settings', icon: Settings, label: 'Settings', active: false },
    { path: '/help', icon: HelpCircle, label: 'Help Center', active: false }
  ];
</script>

<svelte:head>
  <title>Dashboard - Lezie</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
</svelte:head>

<div class="dashboard-page">
  <!-- Mobile Header -->
  <div class="mobile-header">
    <button class="mobile-menu-btn" onclick={() => isMobileMenuOpen = true}>
      <Menu size={24} />
    </button>
    <div class="mobile-logo" onclick={() => goto('/dashboard')}>
      <div class="logo-mark">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L1 4.5L8 8L15 4.5L8 1Z" fill="white" fill-opacity=".9"/>
          <path d="M1 4.5V11.5L8 15L15 11.5V4.5" stroke="white" stroke-opacity=".6" stroke-width="1.2" fill="none"/>
        </svg>
      </div>
      <span>Lezie</span>
    </div>
    <button class="mobile-notif-btn" onclick={() => goto('/alerts')}>
      <BellRing size={20} />
      {#if getUnreadCount() > 0}
        <span class="notif-badge">{getUnreadCount()}</span>
      {/if}
    </button>
  </div>

  <!-- Mobile Sidebar Overlay -->
  {#if isMobileMenuOpen}
    <div class="mobile-overlay" onclick={closeMobileMenu}>
      <div class="mobile-sidebar" onclick={(e) => e.stopPropagation()}>
        <div class="mobile-sidebar-header">
          <div class="mobile-logo-full" onclick={() => { goto('/dashboard'); closeMobileMenu(); }}>
            <div class="logo-mark">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L1 4.5L8 8L15 4.5L8 1Z" fill="white" fill-opacity=".9"/>
                <path d="M1 4.5V11.5L8 15L15 11.5V4.5" stroke="white" stroke-opacity=".6" stroke-width="1.2" fill="none"/>
              </svg>
            </div>
            <span>Lezie</span>
          </div>
          <button class="close-menu" onclick={closeMobileMenu}>
            <X size={24} />
          </button>
        </div>
        
        <div class="mobile-user-info">
          <div class="mobile-avatar">
            <User size={24} />
          </div>
          <div>
            <h4>{user?.name}</h4>
            <p>{user?.email}</p>
          </div>
        </div>
        
        <nav class="mobile-nav">
          {#each navItems as item}
            <button 
              class="mobile-nav-item {item.active ? 'active' : ''}" 
              onclick={() => { goto(item.path); closeMobileMenu(); }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          {/each}
        </nav>
        
        <div class="mobile-sidebar-footer">
          <button class="mobile-report-btn" onclick={() => { goto('/auth/report'); closeMobileMenu(); }}>
            <FlagTriangleRight size={18} />
            Report Incident
          </button>
          <button class="mobile-logout-btn" onclick={() => { goto('/auth/signin'); closeMobileMenu(); }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  {/if}

  <div class="dashboard-container">
    <!-- Desktop Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo" onclick={() => goto('/dashboard')}>
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
        {#each navItems as item}
          <button class="nav-item {item.active ? 'active' : ''}" onclick={() => goto(item.path)}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        {/each}
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
            <button class="icon-btn desktop-only" onclick={() => goto('/alerts')}>
              <BellRing size={20} />
              {#if getUnreadCount() > 0}
                <span class="notification-badge">{getUnreadCount()}</span>
              {/if}
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card" onclick={() => goto('/statistics')}>
            <div class="stat-icon purple">
              <FlagTriangleRight size={22} />
            </div>
            <div class="stat-info">
              <span class="stat-value">{stats.totalReports}</span>
              <span class="stat-label">Total Reports</span>
            </div>
          </div>

          <div class="stat-card" onclick={() => goto('/statistics')}>
            <div class="stat-icon green">
              <CheckCircle size={22} />
            </div>
            <div class="stat-info">
              <span class="stat-value">{stats.verifiedReports}</span>
              <span class="stat-label">Verified</span>
            </div>
          </div>

          <div class="stat-card" onclick={() => goto('/alerts')}>
            <div class="stat-icon orange">
              <Bell size={22} />
            </div>
            <div class="stat-info">
              <span class="stat-value">{stats.activeAlerts}</span>
              <span class="stat-label">Active Alerts</span>
            </div>
          </div>

          <div class="stat-card" onclick={() => goto('/statistics')}>
            <div class="stat-icon blue">
              <Shield size={22} />
            </div>
            <div class="stat-info">
              <span class="stat-value">{stats.safetyScore}%</span>
              <span class="stat-label">Safety Score</span>
            </div>
          </div>
        </div>

        <!-- Quick Navigation Cards -->
        <div class="quick-nav-section">
          <h2>Quick Navigation</h2>
          <div class="quick-nav-grid">
            <button class="quick-nav-card" onclick={() => goto('/map')}>
              <div class="quick-nav-icon map-bg">
                <MapPin size={24} />
              </div>
              <div class="quick-nav-text">
                <h4>Live Map</h4>
                <p>View incidents in real-time</p>
              </div>
              <ChevronRight size={16} class="arrow" />
            </button>
            <button class="quick-nav-card" onclick={() => goto('/alerts')}>
              <div class="quick-nav-icon alert-bg">
                <Bell size={24} />
              </div>
              <div class="quick-nav-text">
                <h4>Alert Zones</h4>
                <p>Manage your notifications</p>
              </div>
              <ChevronRight size={16} class="arrow" />
            </button>
            <button class="quick-nav-card" onclick={() => goto('/reports-history')}>
              <div class="quick-nav-icon report-bg">
                <FileText size={24} />
              </div>
              <div class="quick-nav-text">
                <h4>My Reports</h4>
                <p>View your incident history</p>
              </div>
              <ChevronRight size={16} class="arrow" />
            </button>
            <button class="quick-nav-card" onclick={() => goto('/community')}>
              <div class="quick-nav-icon community-bg">
                <Users size={24} />
              </div>
              <div class="quick-nav-text">
                <h4>Community</h4>
                <p>Connect with neighbors</p>
              </div>
              <ChevronRight size={16} class="arrow" />
            </button>
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
                {#each recentIncidents.slice(0, 3) as incident}
                  {@const IconComponent = getCategoryIcon(incident.category)}
                  <button class="incident-card" onclick={() => goto(`/incident/${incident.id}`)}>
                    <div class="incident-header">
                      <div class="incident-title">
                        <div class="incident-icon" style="background: {getSeverityColor(incident.severity)}15;">
                          <IconComponent size={14} style="color: {getSeverityColor(incident.severity)};" />
                        </div>
                        <div>
                          <h3>{incident.title}</h3>
                          <div class="incident-meta">
                            <span class="meta-item">
                              <MapPin size={10} />
                              {incident.location.split(' ').slice(0, 2).join(' ')}
                            </span>
                            <span class="meta-item">
                              <Clock size={10} />
                              {formatTime(incident.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="incident-status" style="color: {getStatusColor(incident.status)}">
                        <span class="status-dot" style="background: {getStatusColor(incident.status)}"></span>
                        <span>{incident.status}</span>
                      </div>
                    </div>
                    <p class="incident-description">{incident.description}</p>
                    <div class="incident-stats">
                      <span class="stat-badge">
                        <ThumbsUp size={10} />
                        {incident.verificationCount}
                      </span>
                      <span class="stat-badge">
                        <MessageCircle size={10} />
                        {incident.commentCount}
                      </span>
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="right-column">
            <!-- Notifications -->
            <div class="section">
              <div class="section-header">
                <h2>Notifications</h2>
                {#if getUnreadCount() > 0}
                  <span class="unread-badge">{getUnreadCount()} new</span>
                {/if}
              </div>

              <div class="notifications-list">
                {#each notifications.slice(0, 3) as notification}
                  <button class="notification-card {!notification.read ? 'unread' : ''}">
                    <div class="notification-icon">
                      {#if notification.type === 'critical'}
                        <AlertTriangle size={16} style="color: #EF4444;" />
                      {:else if notification.type === 'success'}
                        <CheckCircle size={16} style="color: #10B981;" />
                      {:else}
                        <BellRing size={16} style="color: var(--primary-color);" />
                      {/if}
                    </div>
                    <div class="notification-content">
                      <div class="notification-header">
                        <h4>{notification.title}</h4>
                        <span class="notification-time">{formatTime(notification.time)}</span>
                      </div>
                      <p>{notification.message.length > 50 ? notification.message.slice(0, 50) + '...' : notification.message}</p>
                    </div>
                  </button>
                {/each}
              </div>

              <button class="view-all-btn" onclick={() => goto('/alerts')}>
                View all notifications
                <ChevronRight size={14} />
              </button>
            </div>

            <!-- Safety Score -->
            <div class="section safety-score" onclick={() => goto('/statistics')}>
              <div class="score-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" stroke-width="8"/>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary-color)" stroke-width="8" 
                          stroke-dasharray="283" stroke-dashoffset={283 - (283 * stats.safetyScore / 100)}
                          transform="rotate(-90 50 50)"/>
                </svg>
                <div class="score-value">{stats.safetyScore}%</div>
              </div>
              <div class="score-text">
                <h4>Community Safety Score</h4>
                <p>Based on recent incidents and community reports</p>
              </div>
            </div>

            <!-- Safety Tips -->
            <div class="section safety-section">
              <div class="section-header">
                <h2>Safety Tips</h2>
                <Award size={18} style="color: var(--primary-color);" />
              </div>
              <ul class="safety-tips-list">
                {#each safetyTips.slice(0, 4) as tip}
                  <li>
                    <span class="tip-dot"></span>
                    <span>{tip}</span>
                  </li>
                {/each}
              </ul>
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
    background: #F9FAFB;
  }
  
  /* Mobile Header */
  .mobile-header {
    display: none;
    position: sticky;
    top: 0;
    z-index: 20;
    background: white;
    padding: 0.75rem 1rem;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E5E7EB;
  }
  
  .mobile-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--primary-dark);
    cursor: pointer;
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
  
  .mobile-menu-btn, .mobile-notif-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    color: #64748B;
    position: relative;
  }
  
  .mobile-menu-btn:active, .mobile-notif-btn:active {
    background: #F1F5F9;
  }
  
  .notif-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background: #EF4444;
    color: white;
    font-size: 0.625rem;
    padding: 0.125rem 0.375rem;
    border-radius: 0.75rem;
    font-weight: 600;
  }
  
  /* Mobile Sidebar */
  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
  }
  
  .mobile-sidebar {
    width: 85%;
    max-width: 320px;
    height: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease;
  }
  
  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
  
  .mobile-sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    border-bottom: 1px solid #F1F5F9;
  }
  
  .mobile-logo-full {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--primary-dark);
    cursor: pointer;
  }
  
  .close-menu {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: #64748B;
  }
  
  .mobile-user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem;
    background: #F8FAFC;
    margin: 1rem;
    border-radius: 1rem;
  }
  
  .mobile-avatar {
    width: 48px;
    height: 48px;
    background: #E2E8F0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748B;
  }
  
  .mobile-user-info h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0F172A;
    margin-bottom: 0.125rem;
  }
  
  .mobile-user-info p {
    font-size: 0.688rem;
    color: #64748B;
  }
  
  .mobile-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 1rem;
    gap: 0.25rem;
    overflow-y: auto;
  }
  
  .mobile-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748B;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }
  
  .mobile-nav-item.active {
    background: var(--primary-bg);
    color: var(--primary-color);
  }
  
  .mobile-nav-item:active {
    background: #F1F5F9;
  }
  
  .mobile-sidebar-footer {
    padding: 1rem;
    border-top: 1px solid #F1F5F9;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .mobile-report-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    cursor: pointer;
  }
  
  .mobile-logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: none;
    border: 1px solid #E5E7EB;
    border-radius: 0.75rem;
    color: #EF4444;
    font-weight: 500;
    cursor: pointer;
  }
  
  /* Desktop Sidebar */
  .sidebar {
    width: 280px;
    background: white;
    border-right: 1px solid #E5E7EB;
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
    border-bottom: 1px solid #F1F5F9;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-dark);
    cursor: pointer;
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: auto;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #64748B;
    background: none;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    width: 100%;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .nav-item:hover {
    background: #F8FAFC;
    color: var(--primary-color);
  }
  
  .nav-item.active {
    background: var(--primary-bg);
    color: var(--primary-color);
  }
  
  .sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid #F1F5F9;
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
    border-radius: 0.75rem;
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
    color: #64748B;
  }
  
  .spinning {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
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
    color: #0F172A;
    margin-bottom: 0.25rem;
  }
  
  .welcome-header p {
    color: #64748B;
    font-size: 0.875rem;
  }
  
  .icon-btn {
    position: relative;
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: #64748B;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }
  
  .icon-btn:hover {
    background: #F8FAFC;
    color: var(--primary-color);
  }
  
  .notification-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    background: #EF4444;
    color: white;
    font-size: 0.625rem;
    padding: 0.125rem 0.375rem;
    border-radius: 0.75rem;
    font-weight: 600;
  }
  
  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: white;
    padding: 1.25rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border: 1px solid #E5E7EB;
    transition: all 0.2s;
    cursor: pointer;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .stat-icon.purple { background: #F5F3FF; color: var(--primary-color); }
  .stat-icon.green { background: #D1FAE5; color: #10B981; }
  .stat-icon.orange { background: #FEF3C7; color: #F59E0B; }
  .stat-icon.blue { background: #DBEAFE; color: #3B82F6; }
  
  .stat-info {
    flex: 1;
  }
  
  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0F172A;
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: #64748B;
  }
  
  /* Quick Navigation */
  .quick-nav-section {
    margin-bottom: 2rem;
  }
  
  .quick-nav-section h2 {
    font-size: 1rem;
    font-weight: 600;
    color: #0F172A;
    margin-bottom: 1rem;
  }
  
  .quick-nav-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  
  .quick-nav-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  
  .quick-nav-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: var(--primary-color);
  }
  
  .quick-nav-icon {
    width: 48px;
    height: 48px;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .quick-nav-icon.map-bg { background: #DBEAFE; color: #3B82F6; }
  .quick-nav-icon.alert-bg { background: #FEF3C7; color: #F59E0B; }
  .quick-nav-icon.report-bg { background: #F5F3FF; color: var(--primary-color); }
  .quick-nav-icon.community-bg { background: #D1FAE5; color: #10B981; }
  
  .quick-nav-text {
    flex: 1;
  }
  
  .quick-nav-text h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0F172A;
    margin-bottom: 0.125rem;
  }
  
  .quick-nav-text p {
    font-size: 0.688rem;
    color: #64748B;
  }
  
  .arrow {
    color: #94A3B8;
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
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    border: 1px solid #E5E7EB;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #F1F5F9;
  }
  
  .section-header h2 {
    font-size: 0.938rem;
    font-weight: 600;
    color: #0F172A;
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
    gap: 0.75rem;
  }
  
  .incident-card {
    width: 100%;
    padding: 0.875rem;
    border: 1px solid #E5E7EB;
    border-radius: 0.75rem;
    cursor: pointer;
    background: white;
    text-align: left;
    transition: all 0.2s;
  }
  
  .incident-card:hover {
    border-color: var(--primary-color);
    background: #F8FAFC;
  }
  
  .incident-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }
  
  .incident-title {
    display: flex;
    gap: 0.5rem;
    flex: 1;
  }
  
  .incident-icon {
    width: 28px;
    height: 28px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .incident-title h3 {
    font-size: 0.813rem;
    font-weight: 600;
    color: #0F172A;
    margin-bottom: 0.25rem;
  }
  
  .incident-meta {
    display: flex;
    gap: 0.5rem;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.625rem;
    color: #64748B;
  }
  
  .incident-status {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.625rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  
  .incident-description {
    font-size: 0.688rem;
    color: #64748B;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  .incident-stats {
    display: flex;
    gap: 0.75rem;
  }
  
  .stat-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.625rem;
    color: #64748B;
  }
  
  /* Notifications */
  .unread-badge {
    font-size: 0.625rem;
    padding: 0.125rem 0.5rem;
    background: #EF4444;
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
    border-radius: 0.75rem;
    cursor: pointer;
    width: 100%;
    background: none;
    border: none;
    text-align: left;
  }
  
  .notification-card.unread {
    background: #F5F3FF;
  }
  
  .notification-card:active {
    background: #F1F5F9;
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
    font-size: 0.75rem;
    font-weight: 600;
    color: #0F172A;
  }
  
  .notification-time {
    font-size: 0.625rem;
    color: #64748B;
  }
  
  .notification-content p {
    font-size: 0.688rem;
    color: #64748B;
  }
  
  .view-all-btn {
    width: 100%;
    margin-top: 0.75rem;
    padding: 0.5rem;
    background: none;
    border: 1px solid #E5E7EB;
    border-radius: 0.75rem;
    font-size: 0.688rem;
    color: var(--primary-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
  }
  
  /* Safety Score */
  .safety-score {
    text-align: center;
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
  }
  
  .score-circle {
    position: relative;
    width: 80px;
    height: 80px;
    flex-shrink: 0;
  }
  
  .score-circle svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  
  .score-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1rem;
    font-weight: 700;
    color: var(--primary-color);
  }
  
  .score-text {
    text-align: left;
  }
  
  .score-text h4 {
    font-size: 0.813rem;
    font-weight: 600;
    color: #0F172A;
    margin-bottom: 0.25rem;
  }
  
  .score-text p {
    font-size: 0.688rem;
    color: #64748B;
  }
  
  /* Safety Tips */
  .safety-section {
    background: linear-gradient(135deg, #F5F3FF 0%, #FFFFFF 100%);
  }
  
  .safety-tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .safety-tips-list li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    font-size: 0.75rem;
    color: #475569;
  }
  
  .tip-dot {
    width: 4px;
    height: 4px;
    background: var(--primary-color);
    border-radius: 50%;
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .quick-nav-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .two-columns {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .mobile-header {
      display: flex;
    }
    
    .sidebar {
      display: none;
    }
    
    .main-content {
      margin-left: 0;
      padding: 1rem;
    }
    
    .welcome-header h1 {
      font-size: 1.25rem;
    }
    
    .desktop-only {
      display: none;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
    
    .stat-card {
      padding: 0.875rem;
    }
    
    .stat-icon {
      width: 40px;
      height: 40px;
    }
    
    .stat-value {
      font-size: 1.125rem;
    }
    
    .quick-nav-grid {
      grid-template-columns: 1fr;
    }
    
    .section {
      padding: 1rem;
    }
    
    .safety-score {
      flex-direction: column;
      text-align: center;
    }
    
    .score-text {
      text-align: center;
    }
  }
  
  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .incident-header {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .incident-status {
      align-self: flex-start;
    }
  }
</style>
