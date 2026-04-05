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
    Activity,
    ChevronLeft,
    Menu as MenuIcon,
    PanelLeftClose,
    PanelLeftOpen
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
  let activePage = $state('dashboard');
  let isSidebarCollapsed = $state(false);
  let isMobile = $state(false);
  
  // Page components cache
  let currentPageComponent: any = null;
  
  onMount(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    loadDashboardData();
    loadPage('dashboard');
    isLoading = false;
  });
  
  function checkMobile() {
    isMobile = window.innerWidth < 768;
    if (!isMobile && isMobileMenuOpen) {
      isMobileMenuOpen = false;
    }
    if (isMobile) {
      isSidebarCollapsed = true;
    }
  }
  
  async function loadDashboardData() {
    await new Promise(resolve => setTimeout(resolve, 800));
    
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
        description: 'Graffiti on park equipment',
        verificationCount: 8,
        commentCount: 3
      }
    ];
    
    notifications = [
      {
        id: 1,
        title: 'New incident in your area',
        message: 'Suspicious activity reported on Maple Street',
        time: new Date(Date.now() - 10 * 60000).toISOString(),
        read: false,
        type: 'alert'
      },
      {
        id: 2,
        title: 'Your report was verified',
        message: 'Community members confirmed your report',
        time: new Date(Date.now() - 1 * 3600000).toISOString(),
        read: false,
        type: 'success'
      },
      {
        id: 3,
        title: 'Weekly safety report ready',
        message: 'Your neighborhood safety score improved',
        time: new Date(Date.now() - 1 * 86400000).toISOString(),
        read: true,
        type: 'info'
      }
    ];
    
    safetyTips = [
      'Always be aware of your surroundings',
      'Report suspicious activity immediately',
      'Share your location with trusted contacts',
      'Keep emergency numbers saved'
    ];
  }
  
  async function loadPage(page: string) {
    activePage = page;
    
    // Dynamically import page components
    try {
      switch(page) {
        case 'dashboard':
          currentPageComponent = null; // Show dashboard content
          break;
        case 'map':
          const mapModule = await import('$lib/pages/MapPage.svelte');
          currentPageComponent = mapModule.default;
          break;
        case 'alerts':
          const alertsModule = await import('$lib/pages/AlertsPage.svelte');
          currentPageComponent = alertsModule.default;
          break;
        case 'statistics':
          const statsModule = await import('$lib/pages/StatisticsPage.svelte');
          currentPageComponent = statsModule.default;
          break;
        case 'reports':
          const reportsModule = await import('$lib/pages/ReportsPage.svelte');
          currentPageComponent = reportsModule.default;
          break;
        case 'community':
          const communityModule = await import('$lib/pages/CommunityPage.svelte');
          currentPageComponent = communityModule.default;
          break;
        case 'profile':
          const profileModule = await import('$lib/pages/ProfilePage.svelte');
          currentPageComponent = profileModule.default;
          break;
        case 'settings':
          const settingsModule = await import('$lib/pages/SettingsPage.svelte');
          currentPageComponent = settingsModule.default;
          break;
        default:
          currentPageComponent = null;
      }
    } catch (err) {
      console.error('Failed to load page:', err);
      currentPageComponent = null;
    }
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
  
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
  
  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }
  
  function toggleSidebar() {
    isSidebarCollapsed = !isSidebarCollapsed;
  }
  
  function handleNavigation(page: string) {
    activePage = page;
    closeMobileMenu();
    loadPage(page);
  }
  
  const navItems = [
    { path: 'dashboard', icon: Home, label: 'Dashboard' },
    { path: 'map', icon: MapPin, label: 'Map View' },
    { path: 'alerts', icon: Bell, label: 'Alerts' },
    { path: 'statistics', icon: BarChart3, label: 'Statistics' },
    { path: 'reports', icon: FileText, label: 'My Reports' },
    { path: 'community', icon: Users, label: 'Community' },
    { path: 'profile', icon: User, label: 'Profile' },
    { path: 'settings', icon: Settings, label: 'Settings' }
  ];
</script>

<svelte:head>
  <title>{activePage.charAt(0).toUpperCase() + activePage.slice(1)} - Lezie</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
</svelte:head>

<div class="dashboard-page">
  <!-- Mobile Header -->
  <div class="mobile-header">
    <button class="mobile-menu-btn" onclick={toggleMobileMenu}>
      <MenuIcon size={22} />
    </button>
    <div class="mobile-logo" onclick={() => handleNavigation('dashboard')}>
      <div class="logo-mark">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L1 4.5L8 8L15 4.5L8 1Z" fill="white" fill-opacity=".9"/>
          <path d="M1 4.5V11.5L8 15L15 11.5V4.5" stroke="white" stroke-opacity=".6" stroke-width="1.2" fill="none"/>
        </svg>
      </div>
      <span>Lezie</span>
    </div>
    <button class="mobile-notif-btn" onclick={() => handleNavigation('alerts')}>
      <BellRing size={18} />
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
          <div class="mobile-logo-full" onclick={() => handleNavigation('dashboard')}>
            <div class="logo-mark">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L1 4.5L8 8L15 4.5L8 1Z" fill="white" fill-opacity=".9"/>
                <path d="M1 4.5V11.5L8 15L15 11.5V4.5" stroke="white" stroke-opacity=".6" stroke-width="1.2" fill="none"/>
              </svg>
            </div>
            <span>Lezie</span>
          </div>
          <button class="close-menu" onclick={closeMobileMenu}>
            <X size={22} />
          </button>
        </div>
        
        <div class="mobile-user-info">
          <div class="mobile-avatar">
            <User size={22} />
          </div>
          <div>
            <h4>{user?.name}</h4>
            <p>{user?.email}</p>
          </div>
        </div>
        
        <nav class="mobile-nav">
          {#each navItems as item}
            <button 
              class="mobile-nav-item {activePage === item.path ? 'active' : ''}" 
              onclick={() => handleNavigation(item.path)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          {/each}
        </nav>
        
        <div class="mobile-sidebar-footer">
          <button class="mobile-report-btn" onclick={() => handleNavigation('report')}>
            <FlagTriangleRight size={16} />
            Report Incident
          </button>
          <button class="mobile-logout-btn" onclick={() => goto('/auth/signin')}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  {/if}

  <div class="dashboard-container">
    <!-- Desktop Sidebar - Collapsible -->
    <aside class="sidebar {isSidebarCollapsed ? 'collapsed' : ''}">
      <div class="sidebar-header">
        <div class="logo" onclick={() => handleNavigation('dashboard')}>
          <div class="logo-mark">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L1 4.5L8 8L15 4.5L8 1Z" fill="white" fill-opacity=".9"/>
              <path d="M1 4.5V11.5L8 15L15 11.5V4.5" stroke="white" stroke-opacity=".6" stroke-width="1.2" fill="none"/>
            </svg>
          </div>
          {#if !isSidebarCollapsed}
            <span>Lezie</span>
          {/if}
        </div>
        <button class="collapse-btn" onclick={toggleSidebar}>
          {#if isSidebarCollapsed}
            <PanelLeftOpen size={18} />
          {:else}
            <PanelLeftClose size={18} />
          {/if}
        </button>
      </div>

      <nav class="sidebar-nav">
        {#each navItems as item}
          <button 
            class="nav-item {activePage === item.path ? 'active' : ''}" 
            onclick={() => handleNavigation(item.path)}
            title={isSidebarCollapsed ? item.label : ''}
          >
            <item.icon size={18} />
            {#if !isSidebarCollapsed}
              <span>{item.label}</span>
            {/if}
          </button>
        {/each}
      </nav>

      <div class="sidebar-footer">
        <button class="report-btn" onclick={() => handleNavigation('report')} title={isSidebarCollapsed ? 'Report Incident' : ''}>
          <FlagTriangleRight size={16} />
          {#if !isSidebarCollapsed}
            <span>Report Incident</span>
          {/if}
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content {isSidebarCollapsed ? 'expanded' : ''}">
      {#if activePage === 'dashboard'}
        <!-- Dashboard Content -->
        {#if isLoading}
          <div class="loading-state">
            <Loader2 size={36} class="spinning" />
            <p>Loading your dashboard...</p>
          </div>
        {:else}
          <!-- Welcome Header -->
          <div class="welcome-header">
            <div>
              <h1>Hi, {user?.name.split(' ')[0]}</h1>
              <p>Your community safety summary</p>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat-card" onclick={() => handleNavigation('statistics')}>
              <div class="stat-icon purple">
                <FlagTriangleRight size={18} />
              </div>
              <div class="stat-info">
                <span class="stat-value">{stats.totalReports}</span>
                <span class="stat-label">Reports</span>
              </div>
            </div>

            <div class="stat-card" onclick={() => handleNavigation('statistics')}>
              <div class="stat-icon green">
                <CheckCircle size={18} />
              </div>
              <div class="stat-info">
                <span class="stat-value">{stats.verifiedReports}</span>
                <span class="stat-label">Verified</span>
              </div>
            </div>

            <div class="stat-card" onclick={() => handleNavigation('alerts')}>
              <div class="stat-icon orange">
                <Bell size={18} />
              </div>
              <div class="stat-info">
                <span class="stat-value">{stats.activeAlerts}</span>
                <span class="stat-label">Alerts</span>
              </div>
            </div>

            <div class="stat-card" onclick={() => handleNavigation('statistics')}>
              <div class="stat-icon blue">
                <Shield size={18} />
              </div>
              <div class="stat-info">
                <span class="stat-value">{stats.safetyScore}%</span>
                <span class="stat-label">Safety</span>
              </div>
            </div>
          </div>

          <!-- Quick Navigation -->
          <div class="quick-nav-section">
            <div class="quick-nav-scroll">
              <button class="quick-nav-card" onclick={() => handleNavigation('map')}>
                <div class="quick-nav-icon map-bg">
                  <MapPin size={18} />
                </div>
                <span>Live Map</span>
              </button>
              <button class="quick-nav-card" onclick={() => handleNavigation('alerts')}>
                <div class="quick-nav-icon alert-bg">
                  <Bell size={18} />
                </div>
                <span>Alerts</span>
              </button>
              <button class="quick-nav-card" onclick={() => handleNavigation('reports')}>
                <div class="quick-nav-icon report-bg">
                  <FileText size={18} />
                </div>
                <span>My Reports</span>
              </button>
              <button class="quick-nav-card" onclick={() => handleNavigation('community')}>
                <div class="quick-nav-icon community-bg">
                  <Users size={18} />
                </div>
                <span>Community</span>
              </button>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="content-grid">
            <!-- Recent Incidents -->
            <div class="section">
              <div class="section-header">
                <h2>Recent Incidents</h2>
                <button class="section-link" onclick={() => handleNavigation('map')}>
                  View all
                  <ChevronRight size={14} />
                </button>
              </div>

              <div class="incidents-list">
                {#each recentIncidents as incident}
                  {@const IconComponent = getCategoryIcon(incident.category)}
                  <button class="incident-card" onclick={() => goto(`/incident/${incident.id}`)}>
                    <div class="incident-row">
                      <div class="incident-icon" style="background: {getSeverityColor(incident.severity)}15;">
                        <IconComponent size={12} style="color: {getSeverityColor(incident.severity)};" />
                      </div>
                      <div class="incident-info">
                        <div class="incident-title-row">
                          <h3>{incident.title}</h3>
                          <div class="incident-status" style="color: {getStatusColor(incident.status)}">
                            <span class="status-dot" style="background: {getStatusColor(incident.status)}"></span>
                            <span>{incident.status}</span>
                          </div>
                        </div>
                        <div class="incident-meta">
                          <span><MapPin size={10} /> {incident.location.split(' ').slice(0, 2).join(' ')}</span>
                          <span><Clock size={10} /> {formatTime(incident.time)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                {/each}
              </div>
            </div>

            <!-- Right Panel -->
            <div class="right-panel">
              <!-- Notifications -->
              <div class="section">
                <div class="section-header">
                  <h2>Notifications</h2>
                  {#if getUnreadCount() > 0}
                    <span class="unread-badge">{getUnreadCount()}</span>
                  {/if}
                </div>

                <div class="notifications-list">
                  {#each notifications as notification}
                    <div class="notification-item {!notification.read ? 'unread' : ''}">
                      <div class="notification-icon">
                        {#if notification.type === 'critical'}
                          <AlertTriangle size={14} style="color: #EF4444;" />
                        {:else if notification.type === 'success'}
                          <CheckCircle size={14} style="color: #10B981;" />
                        {:else}
                          <BellRing size={14} style="color: var(--primary-color);" />
                        {/if}
                      </div>
                      <div class="notification-info">
                        <p>{notification.message}</p>
                        <span>{formatTime(notification.time)}</span>
                      </div>
                    </div>
                  {/each}
                </div>

                <button class="view-all-btn" onclick={() => handleNavigation('alerts')}>
                  View all
                  <ChevronRight size={12} />
                </button>
              </div>

              <!-- Safety Score -->
              <div class="safety-score-card" onclick={() => handleNavigation('statistics')}>
                <div class="score-ring">
                  <svg viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="26" fill="none" stroke="#E5E7EB" stroke-width="5"/>
                    <circle cx="30" cy="30" r="26" fill="none" stroke="var(--primary-color)" stroke-width="5" 
                            stroke-dasharray="163" stroke-dashoffset={163 - (163 * stats.safetyScore / 100)}
                            transform="rotate(-90 30 30)"/>
                  </svg>
                  <div class="score-value">{stats.safetyScore}%</div>
                </div>
                <div class="score-info">
                  <h4>Safety Score</h4>
                  <p>{stats.safetyScore >= 80 ? 'Good' : stats.safetyScore >= 60 ? 'Fair' : 'Needs improvement'}</p>
                </div>
              </div>

              <!-- Safety Tips -->
              <div class="section safety-section">
                <div class="section-header">
                  <h2>Safety Tips</h2>
                  <Shield size={16} style="color: var(--primary-color);" />
                </div>
                <ul class="safety-tips-list">
                  {#each safetyTips as tip}
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
      {:else if currentPageComponent}
        <!-- Dynamically loaded page component -->
        <svelte:component this={currentPageComponent} />
      {:else}
        <div class="loading-state">
          <Loader2 size={36} class="spinning" />
          <p>Loading page...</p>
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
    padding: 0.625rem 1rem;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E5E7EB;
  }
  
  .mobile-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1rem;
    color: var(--primary-dark);
    cursor: pointer;
  }
  
  .logo-mark {
    width: 28px;
    height: 28px;
    background: var(--primary-color);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .mobile-menu-btn, .mobile-notif-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.375rem;
    border-radius: 0.5rem;
    color: #64748B;
    position: relative;
  }
  
  .notif-badge {
    position: absolute;
    top: 0px;
    right: 0px;
    background: #EF4444;
    color: white;
    font-size: 0.5rem;
    padding: 0.125rem 0.3125rem;
    border-radius: 0.625rem;
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
    width: 75%;
    max-width: 280px;
    height: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.25s ease;
  }
  
  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
  
  .mobile-sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #F1F5F9;
  }
  
  .mobile-logo-full {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1rem;
    color: var(--primary-dark);
    cursor: pointer;
  }
  
  .close-menu {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.375rem;
    color: #64748B;
  }
  
  .mobile-user-info {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.875rem;
    background: #F8FAFC;
    margin: 0.75rem;
    border-radius: 0.75rem;
  }
  
  .mobile-avatar {
    width: 40px;
    height: 40px;
    background: #E2E8F0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748B;
  }
  
  .mobile-user-info h4 {
    font-size: 0.813rem;
    font-weight: 600;
    color: #0F172A;
    margin-bottom: 0.125rem;
  }
  
  .mobile-user-info p {
    font-size: 0.625rem;
    color: #64748B;
  }
  
  .mobile-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 0.75rem;
    gap: 0.125rem;
    overflow-y: auto;
  }
  
  .mobile-nav-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 0.75rem;
    background: none;
    border: none;
    border-radius: 0.625rem;
    font-size: 0.813rem;
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
  
  .mobile-sidebar-footer {
    padding: 0.75rem;
    border-top: 1px solid #F1F5F9;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .mobile-report-btn, .mobile-logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem;
    border-radius: 0.625rem;
    font-weight: 500;
    font-size: 0.75rem;
    cursor: pointer;
  }
  
  .mobile-report-btn {
    background: var(--primary-color);
    color: white;
    border: none;
  }
  
  .mobile-logout-btn {
    background: none;
    border: 1px solid #E5E7EB;
    color: #EF4444;
  }
  
  /* Desktop Sidebar - Collapsible */
  .sidebar {
    width: 260px;
    background: white;
    border-right: 1px solid #E5E7EB;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 10;
    transition: width 0.3s ease;
  }
  
  .sidebar.collapsed {
    width: 70px;
  }
  
  .sidebar-header {
    padding: 1.25rem;
    border-bottom: 1px solid #F1F5F9;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--primary-dark);
    cursor: pointer;
  }
  
  .sidebar.collapsed .logo span {
    display: none;
  }
  
  .collapse-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.375rem;
    border-radius: 0.5rem;
    color: #64748B;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .collapse-btn:hover {
    background: #F1F5F9;
    color: var(--primary-color);
  }
  
  .sidebar.collapsed .collapse-btn {
    margin-left: auto;
    margin-right: auto;
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 0.875rem;
    color: #64748B;
    background: none;
    border: none;
    border-radius: 0.625rem;
    cursor: pointer;
    width: 100%;
    text-align: left;
    font-size: 0.813rem;
    font-weight: 500;
    transition: all 0.2s;
    white-space: nowrap;
  }
  
  .sidebar.collapsed .nav-item {
    justify-content: center;
    padding: 0.625rem;
  }
  
  .sidebar.collapsed .nav-item span {
    display: none;
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
    padding: 1.25rem;
    border-top: 1px solid #F1F5F9;
  }
  
  .report-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.625rem;
    font-weight: 600;
    font-size: 0.813rem;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  
  .sidebar.collapsed .report-btn span {
    display: none;
  }
  
  .report-btn:hover {
    background: var(--primary-dark);
  }
  
  /* Main Content */
  .main-content {
    flex: 1;
    margin-left: 260px;
    padding: 1.25rem;
    transition: margin-left 0.3s ease;
  }
  
  .main-content.expanded {
    margin-left: 70px;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
    gap: 0.75rem;
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
    margin-bottom: 1.25rem;
  }
  
  .welcome-header h1 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 0.125rem;
  }
  
  .welcome-header p {
    color: #64748B;
    font-size: 0.75rem;
  }
  
  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.25rem;
  }
  
  .stat-card {
    background: white;
    padding: 0.875rem;
    border-radius: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border: 1px solid #E5E7EB;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .stat-icon.purple { background: #F5F3FF; color: var(--primary-color); }
  .stat-icon.green { background: #D1FAE5; color: #10B981; }
  .stat-icon.orange { background: #FEF3C7; color: #F59E0B; }
  .stat-icon.blue { background: #DBEAFE; color: #3B82F6; }
  
  .stat-value {
    display: block;
    font-size: 1.125rem;
    font-weight: 700;
    color: #0F172A;
  }
  
  .stat-label {
    font-size: 0.625rem;
    color: #64748B;
  }
  
  /* Quick Navigation */
  .quick-nav-section {
    margin-bottom: 1.25rem;
  }
  
  .quick-nav-scroll {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
  }
  
  .quick-nav-scroll::-webkit-scrollbar {
    display: none;
  }
  
  .quick-nav-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    padding: 0.625rem 1rem;
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 0.75rem;
    cursor: pointer;
    min-width: 70px;
    transition: all 0.2s;
  }
  
  .quick-nav-card:hover {
    transform: translateY(-2px);
    border-color: var(--primary-color);
  }
  
  .quick-nav-card span {
    font-size: 0.688rem;
    font-weight: 500;
    color: #475569;
  }
  
  .quick-nav-icon {
    width: 36px;
    height: 36px;
    border-radius: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .quick-nav-icon.map-bg { background: #DBEAFE; color: #3B82F6; }
  .quick-nav-icon.alert-bg { background: #FEF3C7; color: #F59E0B; }
  .quick-nav-icon.report-bg { background: #F5F3FF; color: var(--primary-color); }
  .quick-nav-icon.community-bg { background: #D1FAE5; color: #10B981; }
  
  /* Content Grid */
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1rem;
  }
  
  /* Sections */
  .section {
    background: white;
    border-radius: 0.875rem;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #E5E7EB;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #F1F5F9;
  }
  
  .section-header h2 {
    font-size: 0.813rem;
    font-weight: 600;
    color: #0F172A;
  }
  
  .section-link {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    color: var(--primary-color);
    background: none;
    border: none;
    font-size: 0.688rem;
    cursor: pointer;
  }
  
  /* Incidents */
  .incidents-list {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }
  
  .incident-card {
    width: 100%;
    padding: 0.625rem;
    border: 1px solid #E5E7EB;
    border-radius: 0.625rem;
    cursor: pointer;
    background: white;
    text-align: left;
    transition: all 0.2s;
  }
  
  .incident-card:hover {
    border-color: var(--primary-color);
    background: #F8FAFC;
  }
  
  .incident-row {
    display: flex;
    gap: 0.625rem;
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
  
  .incident-info {
    flex: 1;
  }
  
  .incident-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }
  
  .incident-title-row h3 {
    font-size: 0.75rem;
    font-weight: 600;
    color: #0F172A;
  }
  
  .incident-status {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.563rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }
  
  .incident-meta {
    display: flex;
    gap: 0.625rem;
    font-size: 0.563rem;
    color: #64748B;
  }
  
  .incident-meta span {
    display: flex;
    align-items: center;
    gap: 0.188rem;
  }
  
  /* Notifications */
  .unread-badge {
    font-size: 0.563rem;
    padding: 0.125rem 0.375rem;
    background: #EF4444;
    color: white;
    border-radius: 0.625rem;
  }
  
  .notifications-list {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }
  
  .notification-item {
    display: flex;
    gap: 0.625rem;
    padding: 0.5rem;
    border-radius: 0.625rem;
  }
  
  .notification-item.unread {
    background: #F5F3FF;
  }
  
  .notification-icon {
    flex-shrink: 0;
  }
  
  .notification-info {
    flex: 1;
  }
  
  .notification-info p {
    font-size: 0.688rem;
    color: #475569;
    margin-bottom: 0.188rem;
  }
  
  .notification-info span {
    font-size: 0.563rem;
    color: #94A3B8;
  }
  
  .view-all-btn {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.375rem;
    background: none;
    border: 1px solid #E5E7EB;
    border-radius: 0.625rem;
    font-size: 0.625rem;
    color: var(--primary-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
  }
  
  /* Safety Score Card */
  .safety-score-card {
    background: white;
    border-radius: 0.875rem;
    padding: 0.875rem;
    margin-bottom: 1rem;
    border: 1px solid #E5E7EB;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .safety-score-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .score-ring {
    position: relative;
    width: 60px;
    height: 60px;
    flex-shrink: 0;
  }
  
  .score-ring svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  
  .score-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--primary-color);
  }
  
  .score-info h4 {
    font-size: 0.75rem;
    font-weight: 600;
    color: #0F172A;
    margin-bottom: 0.125rem;
  }
  
  .score-info p {
    font-size: 0.625rem;
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
    padding: 0.375rem 0;
    font-size: 0.688rem;
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
    .content-grid {
      grid-template-columns: 1fr;
    }
    
    .right-panel {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    
    .safety-score-card, .safety-section {
      margin-bottom: 0;
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
      padding: 0.875rem;
    }
    
    .main-content.expanded {
      margin-left: 0;
    }
    
    .stats-grid {
      gap: 0.75rem;
    }
    
    .stat-card {
      padding: 0.625rem;
    }
    
    .stat-icon {
      width: 32px;
      height: 32px;
    }
    
    .stat-value {
      font-size: 0.875rem;
    }
    
    .right-panel {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    
    .safety-score-card, .safety-section {
      margin-bottom: 0.75rem;
    }
  }
  
  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .incident-title-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }
  }
</style>