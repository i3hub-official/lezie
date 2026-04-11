<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authClient } from '$lib/auth-client';
  import {
    Bell, MapPin, AlertTriangle, TrendingUp, Shield, Clock,
    ChevronRight, FlagTriangleRight, Users, CheckCircle,
    Loader2, Home, BarChart3, User, Settings, BellRing,
    Flame, Car, Building, Volume2, AlertOctagon,
    Menu as MenuIcon, X, LogOut, FileText,
    PanelLeftClose, PanelLeftOpen, Smile, ThumbsUp,
    Award, Activity, Eye, EyeOff
  } from 'lucide-svelte';

  import MapPage        from './MapPage.svelte';
  import AlertsPage     from './AlertsPage.svelte';
  import StatisticsPage from './StatisticsPage.svelte';
  import ReportsPage    from './ReportsPage.svelte';
  import CommunityPage  from './CommunityPage.svelte';
  import ProfilePage    from './ProfilePage.svelte';
  import SettingsPage   from './SettingsPage.svelte';

  // ── Props from +page.server.ts ──
  let { data } = $props();

  // ── Reactive user ──
  const user = $derived(data.user);

  // ── Formatted name (fixed: derived value, not derived function) ──
  const formattedName = $derived((() => {
    if (!user?.name) return 'User';
    const parts = user.name.trim().split(' ');
    const firstName = parts[0];
    if (parts.length > 1) {
      const initial = parts[parts.length - 1].charAt(0).toUpperCase();
      return `${firstName} ${initial}.`;
    }
    return firstName;
  })());

  // ── State ──
  let isLoading          = $state(false); // false so SSR doesn't show spinner forever
  let recentIncidents    = $state<any[]>([]);
  let stats              = $state({
    totalReports: 0,
    activeAlerts: 0,
    communityMembers: 0,
    safetyScore: 0,
    verifiedReports: 0,
    pendingReviews: 0
  });
  let notifications      = $state<any[]>([]);
  let safetyTips         = $state<string[]>([]);
  let isMobileMenuOpen   = $state(false);
  let activePage         = $state('dashboard');
  let isSidebarCollapsed = $state(false);
  let isMobile           = $state(false);

  // ── Page component map ──
  const pages: Record<string, any> = {
    dashboard:  null,
    map:        MapPage,
    alerts:     AlertsPage,
    statistics: StatisticsPage,
    reports:    ReportsPage,
    community:  CommunityPage,
    profile:    ProfilePage,
    settings:   SettingsPage
  };

  let CurrentPageComponent = $derived(pages[activePage]);

  // ── Nav items ──
  const navItems = [
    { path: 'dashboard',  icon: Home,      label: 'Dashboard'  },
    { path: 'map',        icon: MapPin,    label: 'Map View'   },
    { path: 'alerts',     icon: Bell,      label: 'Alerts'     },
    { path: 'statistics', icon: BarChart3, label: 'Statistics' },
    { path: 'reports',    icon: FileText,  label: 'My Reports' },
    { path: 'community',  icon: Users,     label: 'Community'  },
    { path: 'profile',    icon: User,      label: 'Profile'    },
    { path: 'settings',   icon: Settings,  label: 'Settings'   },
  ];

  // ── Derived ──
  const unreadCount = $derived(notifications.filter(n => !n.read).length);

  // ── Mount ──
  onMount(() => {
    // Client-side auth safety net (hooks.server.ts is the real guard)
    if (!user) {
      goto('/signin');
      return;
    }

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && pages[hash] !== undefined) {
        activePage = hash;
      } else if (!hash) {
        activePage = 'dashboard';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // run once on load

    loadData();

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('hashchange', handleHashChange);
    };
  });

  // ── Functions ──
  function checkMobile() {
    isMobile = window.innerWidth < 768;
    if (isMobile) {
      isMobileMenuOpen   = false;
      isSidebarCollapsed = true;
    }
  }

  async function loadData() {
    isLoading = true;
    await new Promise(r => setTimeout(r, 600));

    stats = {
      totalReports:     47,
      activeAlerts:     3,
      communityMembers: 1250,
      safetyScore:      86,
      verifiedReports:  32,
      pendingReviews:   8
    };

    recentIncidents = [
      {
        id: 1, title: 'Suspicious person near school',
        category: 'suspicious', severity: 'high',
        time: new Date(Date.now() - 2 * 3600000).toISOString(),
        location: 'Maple Street Elementary',
        status: 'verified', verificationCount: 15, commentCount: 8
      },
      {
        id: 2, title: 'Car break-in on Main St',
        category: 'theft', severity: 'medium',
        time: new Date(Date.now() - 5 * 3600000).toISOString(),
        location: 'Main Street',
        status: 'investigating', verificationCount: 12, commentCount: 5
      },
      {
        id: 3, title: 'Vandalism at community park',
        category: 'vandalism', severity: 'low',
        time: new Date(Date.now() - 86400000).toISOString(),
        location: 'Oak Park',
        status: 'resolved', verificationCount: 8, commentCount: 3
      }
    ];

    notifications = [
      {
        id: 1, type: 'alert', read: false,
        message: 'Suspicious activity reported on Maple Street',
        time: new Date(Date.now() - 600000).toISOString()
      },
      {
        id: 2, type: 'success', read: false,
        message: 'Community members confirmed your report',
        time: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 3, type: 'info', read: true,
        message: 'Your neighbourhood safety score improved',
        time: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    safetyTips = [
      'Always be aware of your surroundings',
      'Report suspicious activity immediately',
      'Share your location with trusted contacts',
      'Keep emergency numbers saved'
    ];

    isLoading = false;
  }

  function getCategoryIcon(cat: string) {
    const map: Record<string, any> = {
      suspicious: AlertTriangle,
      theft:      AlertOctagon,
      vandalism:  Building,
      fire:       Flame,
      accident:   Car,
      noise:      Volume2
    };
    return map[cat] ?? AlertTriangle;
  }

  function getSeverityColor(severity: string): string {
    const map: Record<string, string> = {
      critical: '#7C3AED',
      high:     '#EF4444',
      medium:   '#F59E0B',
      low:      '#10B981'
    };
    return map[severity] ?? '#6B7280';
  }

  function getStatusColor(status: string): string {
    const map: Record<string, string> = {
      verified:     '#10B981',
      investigating:'#F59E0B',
      resolved:     '#3B82F6',
      false_report: '#EF4444'
    };
    return map[status] ?? '#6B7280';
  }

  function formatTime(d: string): string {
    const diff = Date.now() - new Date(d).getTime();
    const m   = Math.floor(diff / 60000);
    const h   = Math.floor(diff / 3600000);
    const day = Math.floor(diff / 86400000);
    if (m < 1)  return 'Just now';
    if (h < 1)  return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${day}d ago`;
  }

  function navigate(page: string) {
    activePage       = page;
    isMobileMenuOpen = false;
    window.location.hash = page === 'dashboard' ? '' : page;
  }

  async function handleLogout() {
  await authClient.signOut();
  window.location.href = '/signin';
}
</script>


<svelte:head>
  <title>{activePage.charAt(0).toUpperCase() + activePage.slice(1)} – Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="db-root">

  <!-- ══ SIDEBAR (desktop) ══ -->
  <aside class="db-sidebar {isSidebarCollapsed ? 'db-sidebar--slim' : ''}">

    <!-- Logo + collapse toggle -->
    <div class="db-sidebar-top">
      <button class="db-logo-btn" onclick={() => navigate('dashboard')}>
        <img src="/icons/lz_ico.png" alt="Lezie" class="db-logo-img" />
        {#if !isSidebarCollapsed}<span class="db-logo-text">Lezie</span>{/if}
      </button>
      <button class="db-collapse-btn" onclick={() => isSidebarCollapsed = !isSidebarCollapsed}
              title={isSidebarCollapsed ? 'Expand' : 'Collapse'}>
        {#if isSidebarCollapsed}<PanelLeftOpen size={17} />{:else}<PanelLeftClose size={17} />{/if}
      </button>
    </div>

    <!-- User card -->
    {#if !isSidebarCollapsed}
      <div class="db-user-card">
        <div class="db-user-avatar"><User size={18} /></div>
        <div class="db-user-info">
          <strong>{user?.name ?? '—'}</strong>
          <span>{user?.email ?? ''}</span>
        </div>
      </div>
    {:else}
      <div class="db-user-avatar-slim"><User size={16} /></div>
    {/if}

    <!-- Nav -->
    <nav class="db-nav">
      {#each navItems as item}
        <button
          class="db-nav-item {activePage === item.path ? 'active' : ''}"
          onclick={() => navigate(item.path)}
          title={isSidebarCollapsed ? item.label : ''}
        >
          <item.icon size={17} />
          {#if !isSidebarCollapsed}<span>{item.label}</span>{/if}
          {#if item.path === 'alerts' && unreadCount > 0 && !isSidebarCollapsed}
            <span class="db-nav-badge">{unreadCount}</span>
          {/if}
        </button>
      {/each}
    </nav>

    <!-- Footer actions -->
    <div class="db-sidebar-foot">
      <button class="db-report-btn" onclick={() => goto('/report')}
              title={isSidebarCollapsed ? 'Report Incident' : ''}>
        <FlagTriangleRight size={15} />
        {#if !isSidebarCollapsed}<span>Report Incident</span>{/if}
      </button>
      <button class="db-logout-btn" onclick={handleLogout}
              title={isSidebarCollapsed ? 'Sign out' : ''}>
        <LogOut size={15} />
        {#if !isSidebarCollapsed}<span>Sign out</span>{/if}
      </button>
    </div>
  </aside>

  <!-- ══ MAIN AREA ══ -->
  <div class="db-body {isSidebarCollapsed ? 'db-body--wide' : ''}">

    <!-- ── TOPBAR (mobile hamburger + always-visible header) ── -->
    <header class="db-topbar">
      <!-- Hamburger — visible ONLY on mobile -->
      <button class="db-hamburger" onclick={() => isMobileMenuOpen = true} aria-label="Open menu">
        <MenuIcon size={20} />
      </button>

      <!-- Page title -->
      <div class="db-topbar-title">
        {#if activePage === 'dashboard'}
          <span class="db-greeting">
            <Smile size={16} class="db-greeting-icon" />
            <span>Hi, <strong>{user?.name?.split(' ')[0] ?? ''}</strong></span>
          </span>
        {:else}
          <strong>{navItems.find(n => n.path === activePage)?.label ?? ''}</strong>
        {/if}
      </div>

      <!-- Right actions -->
      <div class="db-topbar-actions">
        <button class="db-topbar-icon" onclick={() => navigate('alerts')} aria-label="Alerts">
          <Bell size={18} />
          {#if unreadCount > 0}<span class="db-topbar-badge">{unreadCount}</span>{/if}
        </button>
        <!-- Logout — visible on desktop topbar too -->
        <button class="db-topbar-logout" onclick={handleLogout}>
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </header>

    <!-- ── PAGE CONTENT ── -->
    <div class="db-page-wrap">
      {#if activePage === 'dashboard'}

        {#if isLoading}
          <div class="db-loading">
            <Loader2 size={32} class="db-spin" />
            <p>Loading dashboard…</p>
          </div>
        {:else}

          <!-- Stats row -->
          <div class="db-stats">
            {#each [
              { icon:FlagTriangleRight, value:stats.totalReports,   label:'Reports',   color:'purple' },
              { icon:CheckCircle,       value:stats.verifiedReports, label:'Verified',  color:'green' },
              { icon:Bell,              value:stats.activeAlerts,    label:'Alerts',    color:'amber' },
              { icon:Shield,            value:`${stats.safetyScore}%`, label:'Safety', color:'blue' },
            ] as s}
              <button class="db-stat-card" onclick={() => navigate('statistics')}>
                <div class="db-stat-ico db-stat-ico--{s.color}"><s.icon size={17} /></div>
                <div>
                  <span class="db-stat-val">{s.value}</span>
                  <span class="db-stat-lbl">{s.label}</span>
                </div>
              </button>
            {/each}
          </div>

          <!-- Quick access pills -->
          <div class="db-quick">
            {#each [
              { page:'map',       icon:MapPin,   label:'Live Map',  cls:'blue' },
              { page:'alerts',    icon:Bell,     label:'Alerts',    cls:'amber' },
              { page:'reports',   icon:FileText, label:'My Reports',cls:'purple' },
              { page:'community', icon:Users,    label:'Community', cls:'green' },
            ] as q}
              <button class="db-quick-pill" onclick={() => navigate(q.page)}>
                <span class="db-quick-ico db-quick-ico--{q.cls}"><q.icon size={16} /></span>
                {q.label}
              </button>
            {/each}
          </div>

          <!-- Two-column content -->
          <div class="db-content-grid">

            <!-- LEFT: recent incidents -->
            <div class="db-card">
              <div class="db-card-head">
                <h2>Recent Incidents</h2>
                <button class="db-card-link" onclick={() => navigate('map')}>
                  View all <ChevronRight size={13} />
                </button>
              </div>
              <div class="db-incidents">
                {#each recentIncidents as inc}
                  {@const Icon = getCategoryIcon(inc.category)}
                  <button class="db-incident" onclick={() => goto(`/incident/${inc.id}`)}>
                    <span class="db-inc-ico" style="background:{getSeverityColor(inc.severity)}18">
                      <Icon size={13} style="color:{getSeverityColor(inc.severity)}" />
                    </span>
                    <div class="db-inc-body">
                      <div class="db-inc-top">
                        <span class="db-inc-title">{inc.title}</span>
                        <span class="db-inc-status" style="color:{getStatusColor(inc.status)}">
                          <span class="db-inc-dot" style="background:{getStatusColor(inc.status)}"></span>
                          {inc.status}
                        </span>
                      </div>
                      <div class="db-inc-meta">
                        <span><MapPin size={9} /> {inc.location.split(' ').slice(0,2).join(' ')}</span>
                        <span><Clock size={9} /> {formatTime(inc.time)}</span>
                      </div>
                    </div>
                  </button>
                {/each}
              </div>
            </div>

            <!-- RIGHT column -->
            <div class="db-right">

              <!-- Notifications -->
              <div class="db-card">
                <div class="db-card-head">
                  <h2>Notifications</h2>
                  {#if unreadCount > 0}
                    <span class="db-notif-badge">{unreadCount} new</span>
                  {/if}
                </div>
                <div class="db-notifs">
                  {#each notifications as n}
                    <div class="db-notif {!n.read ? 'db-notif--unread' : ''}">
                      <span class="db-notif-ico">
                        {#if n.type === 'success'}<CheckCircle size={13} style="color:#10B981" />
                        {:else if n.type === 'alert'}<AlertTriangle size={13} style="color:#EF4444" />
                        {:else}<BellRing size={13} style="color:var(--primary-color)" />
                        {/if}
                      </span>
                      <div>
                        <p>{n.message}</p>
                        <span>{formatTime(n.time)}</span>
                      </div>
                    </div>
                  {/each}
                </div>
                <button class="db-view-all" onclick={() => navigate('alerts')}>
                  View all <ChevronRight size={12} />
                </button>
              </div>

              <!-- Safety score donut -->
              <div class="db-card db-score-card" onclick={() => navigate('statistics')}>
                <div class="db-donut">
                  <svg viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="27" fill="none" stroke="#E5E7EB" stroke-width="5.5"/>
                    <circle cx="32" cy="32" r="27" fill="none" stroke="var(--primary-color)" stroke-width="5.5"
                      stroke-dasharray="169.6"
                      stroke-dashoffset={169.6 - (169.6 * stats.safetyScore / 100)}
                      transform="rotate(-90 32 32)" stroke-linecap="round"/>
                  </svg>
                  <span>{stats.safetyScore}%</span>
                </div>
                <div>
                  <h4>Safety Score</h4>
                  <p class="db-score-status">
                    {#if stats.safetyScore >= 80}
                      <Award size={12} /> Good standing
                    {:else if stats.safetyScore >= 60}
                      <Activity size={12} /> Fair
                    {:else}
                      <AlertTriangle size={12} /> Needs attention
                    {/if}
                  </p>
                </div>
              </div>

              <!-- Safety tips -->
              <div class="db-card db-tips-card">
                <div class="db-card-head">
                  <h2>Safety Tips</h2>
                  <Shield size={14} style="color:var(--primary-color)" />
                </div>
                <ul>
                  {#each safetyTips as tip}
                    <li><span></span>{tip}</li>
                  {/each}
                </ul>
              </div>

            </div>
          </div>

        {/if}

      {:else if CurrentPageComponent}
        <svelte:component this={CurrentPageComponent} />
      {:else}
        <div class="db-loading">
          <Loader2 size={28} class="db-spin" /><p>Loading…</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- ══ MOBILE DRAWER ══ -->
  {#if isMobileMenuOpen}
    <div class="db-drawer-overlay" onclick={() => isMobileMenuOpen = false}>
      <aside class="db-drawer" onclick={(e) => e.stopPropagation()}>

        <div class="db-drawer-head">
          <img src="/icons/lz_ico.png" alt="Lezie" style="width:36px;height:36px;object-fit:contain" />
          <button class="db-drawer-close" onclick={() => isMobileMenuOpen = false}><X size={20} /></button>
        </div>

        <!-- User -->
        <div class="db-drawer-user">
          <div class="db-drawer-avatar"><User size={20} /></div>
          <div>
            <strong>{user?.name ?? '—'}</strong>
            <span>{user?.email ?? ''}</span>
          </div>
        </div>

        <!-- Nav -->
        <nav class="db-drawer-nav">
          {#each navItems as item}
            <button
              class="db-drawer-item {activePage === item.path ? 'active' : ''}"
              onclick={() => navigate(item.path)}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
              {#if item.path === 'alerts' && unreadCount > 0}
                <span class="db-drawer-badge">{unreadCount}</span>
              {/if}
            </button>
          {/each}
        </nav>

        <div class="db-drawer-foot">
          <button class="db-drawer-report" onclick={() => { goto('/report'); isMobileMenuOpen = false; }}>
            <FlagTriangleRight size={15} /> Report Incident
          </button>
          <button class="db-drawer-logout" onclick={handleLogout}>
            <LogOut size={15} /> Sign out
          </button>
        </div>

      </aside>
    </div>
  {/if}

</div>

<style>
  /* ── Tokens ── */
  :global(:root) {
    --primary-color:  #6a2c91;
    --primary-dark:   #4b1d68;
    --primary-light:  #9b4fcc;
    --primary-bg:     #f5f3ff;
    --primary-border: #ddd6fe;
    --success-color:  #10B981;
    --warning-color:  #F59E0B;
    --danger-color:   #EF4444;
    --dark-color:     #111827;
    --light-color:    #F9FAFB;
    --gray-color:     #6B7280;
    --sidebar-w:      240px;
    --sidebar-slim:   68px;
  }

  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }

  :global(body) {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: var(--light-color);
    color: var(--dark-color);
  }

  /* ── Root shell ── */
  .db-root {
    display: flex;
    min-height: 100vh;
    position: relative;
  }

  /* ══════════════════════════════════
     SIDEBAR (desktop — hidden <768px)
  ══════════════════════════════════ */
  .db-sidebar {
    width: var(--sidebar-w);
    flex-shrink: 0;
    background: white;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 30;
    transition: width .25s ease;
    overflow: hidden;
  }

  .db-sidebar--slim { width: var(--sidebar-slim); }

  /* Hide on mobile */
  @media (max-width: 767px) { .db-sidebar { display: none; } }

  /* Sidebar top */
  .db-sidebar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.125rem 1rem;
    border-bottom: 1px solid #f1f5f9;
    min-height: 64px;
    gap: .5rem;
  }

  .db-sidebar--slim .db-sidebar-top { justify-content: center; flex-direction: column; gap: .625rem; }

  .db-logo-btn {
    display: flex; align-items: center; gap: .5rem;
    background: none; border: none; cursor: pointer; padding: 0;
    flex-shrink: 0;
  }

  .db-logo-img { width: 34px; height: 34px; object-fit: contain; }

  .db-logo-text {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 1.125rem; color: var(--primary-dark); white-space: nowrap; letter-spacing: -.01em;
  }

  .db-collapse-btn {
    background: none; border: none; cursor: pointer; padding: .3rem;
    color: var(--gray-color); border-radius: .5rem; display: flex;
    transition: all .2s; flex-shrink: 0;
  }

  .db-collapse-btn:hover { background: var(--primary-bg); color: var(--primary-color); }

  /* User card */
  .db-user-card {
    display: flex; align-items: center; gap: .625rem;
    margin: .75rem; padding: .625rem .75rem;
    background: var(--light-color); border-radius: .75rem;
    border: 1px solid #f1f5f9;
  }

  .db-user-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--primary-bg); border: 1.5px solid var(--primary-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--primary-color); flex-shrink: 0;
  }

  .db-user-avatar-slim {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--primary-bg); border: 1.5px solid var(--primary-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--primary-color); margin: .75rem auto;
  }

  .db-user-info strong { display: block; font-size: .8125rem; font-weight: 700; color: var(--dark-color); }
  .db-user-info span   { font-size: .688rem; color: var(--gray-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; display: block; }

  /* Nav */
  .db-nav {
    flex: 1; padding: .625rem .75rem;
    display: flex; flex-direction: column; gap: .125rem; overflow-y: auto;
  }

  .db-nav-item {
    display: flex; align-items: center; gap: .625rem;
    padding: .5625rem .75rem; background: none; border: none;
    border-radius: .625rem; font-size: .8125rem; font-weight: 500;
    color: var(--gray-color); cursor: pointer; width: 100%; text-align: left;
    font-family: 'DM Sans', sans-serif; transition: all .18s; white-space: nowrap;
  }

  .db-sidebar--slim .db-nav-item { justify-content: center; padding: .625rem; }

  .db-nav-item:hover  { background: var(--primary-bg); color: var(--primary-color); }
  .db-nav-item.active { background: var(--primary-bg); color: var(--primary-color); font-weight: 600; }

  .db-nav-badge {
    margin-left: auto; background: var(--danger-color); color: white;
    font-size: .563rem; font-weight: 700; padding: .125rem .375rem;
    border-radius: 9999px; line-height: 1.4;
  }

  /* Sidebar footer */
  .db-sidebar-foot {
    padding: .75rem; border-top: 1px solid #f1f5f9;
    display: flex; flex-direction: column; gap: .375rem;
  }

  .db-report-btn {
    display: flex; align-items: center; justify-content: center; gap: .4rem;
    padding: .5625rem; background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white; border: none; border-radius: .625rem;
    font-size: .8rem; font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all .2s; white-space: nowrap;
    box-shadow: 0 2px 8px rgba(106,44,145,.25);
  }

  .db-report-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(106,44,145,.35); }

  .db-logout-btn {
    display: flex; align-items: center; justify-content: center; gap: .4rem;
    padding: .5rem; background: none; border: 1px solid #fee2e2;
    color: var(--danger-color); border-radius: .625rem;
    font-size: .8rem; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all .2s; white-space: nowrap;
  }

  .db-logout-btn:hover { background: #fef2f2; }

  /* ══════════════════════════════════
     MAIN BODY
  ══════════════════════════════════ */
  .db-body {
    flex: 1;
    margin-left: var(--sidebar-w);
    display: flex; flex-direction: column;
    min-height: 100vh;
    transition: margin-left .25s ease;
  }

  .db-body--wide { margin-left: var(--sidebar-slim); }

  @media (max-width: 767px) {
    .db-body,
    .db-body--wide { margin-left: 0; }
  }

  /* ── TOPBAR ── */
  .db-topbar {
    position: sticky; top: 0; z-index: 20;
    background: rgba(255,255,255,.97); backdrop-filter: blur(12px);
    border-bottom: 1px solid #e5e7eb;
    display: flex; align-items: center; gap: .75rem;
    padding: 0 1.25rem; height: 60px;
  }

  /* Greeting */
  .db-greeting {
    display: flex; align-items: center; gap: .5rem;
  }

  .db-greeting-icon {
    color: var(--primary-color);
  }

  /* Hamburger — ONLY mobile */
  .db-hamburger {
    display: none;
    background: none; border: none; cursor: pointer;
    padding: .375rem; color: var(--dark-color); border-radius: .5rem;
    transition: background .2s; flex-shrink: 0;
  }

  .db-hamburger:hover { background: var(--primary-bg); color: var(--primary-color); }

  @media (max-width: 767px) { .db-hamburger { display: flex; } }

  .db-topbar-title {
    flex: 1; font-size: .9375rem; color: var(--dark-color);
  }

  .db-topbar-title strong { font-weight: 700; }

  .db-topbar-actions {
    display: flex; align-items: center; gap: .625rem;
  }

  .db-topbar-icon {
    position: relative; background: none; border: none; cursor: pointer;
    padding: .375rem; color: var(--gray-color); border-radius: .5rem; display: flex;
    transition: all .2s;
  }

  .db-topbar-icon:hover { background: var(--primary-bg); color: var(--primary-color); }

  .db-topbar-badge {
    position: absolute; top: 0; right: 0;
    background: var(--danger-color); color: white;
    font-size: .5rem; font-weight: 700; padding: .1rem .3rem;
    border-radius: 9999px; line-height: 1.4;
  }

  .db-topbar-logout {
    display: flex; align-items: center; gap: .375rem;
    padding: .375rem .75rem; background: none;
    border: 1px solid #fee2e2; color: var(--danger-color);
    border-radius: .625rem; font-size: .8rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .2s;
  }

  .db-topbar-logout:hover { background: #fef2f2; }

  /* Hide "Sign out" text on very small screens */
  @media (max-width: 400px) { .db-topbar-logout span { display: none; } }

  /* ── PAGE WRAP ── */
  .db-page-wrap {
    flex: 1; padding: 1.25rem;
    max-width: 1200px; width: 100%;
    margin: 0 auto;
  }

  /* ── LOADING ── */
  .db-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 50vh; gap: .75rem; color: var(--gray-color); font-size: .875rem;
  }

  :global(.db-spin) { animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── STATS ROW ── */
  .db-stats {
    display: grid; grid-template-columns: repeat(4,1fr); gap: .875rem; margin-bottom: 1rem;
  }

  @media (max-width: 640px) { .db-stats { grid-template-columns: repeat(2,1fr); } }

  .db-stat-card {
    background: white; border: 1.5px solid #e5e7eb; border-radius: 1rem;
    padding: .875rem; display: flex; align-items: center; gap: .75rem;
    cursor: pointer; transition: all .2s; font-family: 'DM Sans', sans-serif; text-align: left;
  }

  .db-stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.06); border-color: var(--primary-border); }

  .db-stat-ico {
    width: 40px; height: 40px; border-radius: .75rem;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .db-stat-ico--purple { background: var(--primary-bg); color: var(--primary-color); }
  .db-stat-ico--green  { background: #d1fae5; color: #059669; }
  .db-stat-ico--amber  { background: #fef3c7; color: #d97706; }
  .db-stat-ico--blue   { background: #dbeafe; color: #2563eb; }

  .db-stat-val { display: block; font-size: 1.125rem; font-weight: 800; color: var(--dark-color); }
  .db-stat-lbl { display: block; font-size: .688rem; color: var(--gray-color); }

  /* ── QUICK PILLS ── */
  .db-quick {
    display: flex; gap: .625rem; flex-wrap: wrap; margin-bottom: 1.25rem;
  }

  .db-quick-pill {
    display: inline-flex; align-items: center; gap: .5rem;
    padding: .5rem .875rem; background: white;
    border: 1.5px solid #e5e7eb; border-radius: 9999px;
    font-size: .8rem; font-weight: 500; color: var(--dark-color);
    font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .2s;
  }

  .db-quick-pill:hover { border-color: var(--primary-color); color: var(--primary-color); transform: translateY(-1px); }

  .db-quick-ico {
    width: 24px; height: 24px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }

  .db-quick-ico--blue   { background: #dbeafe; color: #2563eb; }
  .db-quick-ico--amber  { background: #fef3c7; color: #d97706; }
  .db-quick-ico--purple { background: var(--primary-bg); color: var(--primary-color); }
  .db-quick-ico--green  { background: #d1fae5; color: #059669; }

  /* ── CONTENT GRID ── */
  .db-content-grid {
    display: grid; grid-template-columns: 1fr 300px; gap: 1rem; align-items: start;
  }

  @media (max-width: 1024px) { .db-content-grid { grid-template-columns: 1fr; } }

  /* ── CARD ── */
  .db-card {
    background: white; border: 1.5px solid #e5e7eb; border-radius: 1.125rem;
    padding: 1rem; margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,.04);
  }

  .db-card:last-child { margin-bottom: 0; }

  .db-card-head {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: .75rem; padding-bottom: .625rem; border-bottom: 1px solid #f1f5f9;
  }

  .db-card-head h2 { font-size: .875rem; font-weight: 700; color: var(--dark-color); }

  .db-card-link {
    display: inline-flex; align-items: center; gap: .125rem;
    color: var(--primary-color); background: none; border: none;
    font-size: .75rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: gap .15s;
  }

  .db-card-link:hover { gap: .375rem; }

  /* ── INCIDENTS ── */
  .db-incidents { display: flex; flex-direction: column; gap: .5rem; }

  .db-incident {
    display: flex; align-items: flex-start; gap: .625rem;
    padding: .625rem; border: 1px solid #f1f5f9; border-radius: .75rem;
    background: white; cursor: pointer; width: 100%; text-align: left;
    font-family: 'DM Sans', sans-serif; transition: all .18s;
  }

  .db-incident:hover { border-color: var(--primary-border); background: var(--primary-bg); }

  .db-inc-ico {
    width: 30px; height: 30px; border-radius: .5rem;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .db-inc-body { flex: 1; min-width: 0; }

  .db-inc-top {
    display: flex; justify-content: space-between; align-items: center;
    gap: .5rem; margin-bottom: .25rem; flex-wrap: wrap;
  }

  .db-inc-title { font-size: .8125rem; font-weight: 600; color: var(--dark-color); }

  .db-inc-status {
    display: flex; align-items: center; gap: .25rem;
    font-size: .625rem; font-weight: 500; text-transform: capitalize; flex-shrink: 0;
  }

  .db-inc-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  .db-inc-meta {
    display: flex; gap: .625rem; font-size: .625rem; color: var(--gray-color);
  }

  .db-inc-meta span { display: flex; align-items: center; gap: .2rem; }

  /* ── NOTIFICATIONS ── */
  .db-notif-badge {
    font-size: .625rem; font-weight: 700; padding: .15rem .5rem;
    background: var(--primary-bg); border: 1px solid var(--primary-border);
    color: var(--primary-color); border-radius: 9999px;
  }

  .db-notifs { display: flex; flex-direction: column; gap: .5rem; }

  .db-notif {
    display: flex; align-items: flex-start; gap: .625rem;
    padding: .5rem .625rem; border-radius: .625rem; transition: background .15s;
  }

  .db-notif--unread { background: var(--primary-bg); }

  .db-notif-ico { flex-shrink: 0; margin-top: 1px; }

  .db-notif p    { font-size: .75rem; color: #475569; line-height: 1.45; margin-bottom: .125rem; }
  .db-notif span { font-size: .625rem; color: #94a3b8; }

  .db-view-all {
    width: 100%; margin-top: .5rem; padding: .375rem;
    background: none; border: 1px solid #e5e7eb; border-radius: .625rem;
    font-size: .688rem; color: var(--primary-color); cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: .25rem;
    font-family: 'DM Sans', sans-serif; transition: all .15s;
  }

  .db-view-all:hover { background: var(--primary-bg); border-color: var(--primary-border); }

  /* ── SCORE CARD ── */
  .db-score-card {
    display: flex; align-items: center; gap: .875rem; cursor: pointer; transition: all .2s;
  }

  .db-score-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.06); }

  .db-score-status {
    display: flex; align-items: center; gap: .375rem;
    font-size: .688rem;
  }

  .db-donut { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
  .db-donut svg { width: 100%; height: 100%; }
  .db-donut span {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    font-size: .75rem; font-weight: 800; color: var(--primary-color);
  }

  .db-score-card h4 { font-size: .8125rem; font-weight: 700; color: var(--dark-color); margin-bottom: .2rem; }
  .db-score-card p  { font-size: .688rem; color: var(--gray-color); }

  /* ── TIPS CARD ── */
  .db-tips-card {
    background: linear-gradient(135deg, var(--primary-bg) 0%, white 100%);
  }

  .db-tips-card ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: .375rem; }

  .db-tips-card li {
    display: flex; align-items: flex-start; gap: .5rem;
    font-size: .75rem; color: #475569; line-height: 1.5;
  }

  .db-tips-card li span:first-child {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--primary-color); flex-shrink: 0; margin-top: .4rem;
  }

  /* ══════════════════════════════════
     MOBILE DRAWER
  ══════════════════════════════════ */
  .db-drawer-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.45);
    z-index: 200; display: flex;
  }

  .db-drawer {
    width: min(80vw, 300px); height: 100%; background: white;
    display: flex; flex-direction: column;
    animation: drawerIn .25s ease;
  }

  @keyframes drawerIn {
    from { transform: translateX(-100%); }
    to   { transform: translateX(0); }
  }

  .db-drawer-head {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1rem 1rem .875rem; border-bottom: 1px solid #f1f5f9;
  }

  .db-drawer-close {
    background: none; border: none; cursor: pointer;
    padding: .375rem; color: var(--gray-color); border-radius: .5rem; display: flex;
    transition: all .2s;
  }

  .db-drawer-close:hover { background: #f1f5f9; color: var(--dark-color); }

  .db-drawer-user {
    display: flex; align-items: center; gap: .75rem;
    padding: .875rem; margin: .625rem .75rem;
    background: var(--light-color); border-radius: .875rem;
  }

  .db-drawer-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: var(--primary-bg); border: 1.5px solid var(--primary-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--primary-color); flex-shrink: 0;
  }

  .db-drawer-user strong { display: block; font-size: .8125rem; font-weight: 700; color: var(--dark-color); }
  .db-drawer-user span   { font-size: .688rem; color: var(--gray-color); }

  .db-drawer-nav {
    flex: 1; padding: .5rem .75rem; display: flex; flex-direction: column;
    gap: .125rem; overflow-y: auto;
  }

  .db-drawer-item {
    display: flex; align-items: center; gap: .625rem;
    padding: .625rem .75rem; background: none; border: none; border-radius: .625rem;
    font-size: .875rem; font-weight: 500; color: var(--gray-color);
    cursor: pointer; width: 100%; text-align: left;
    font-family: 'DM Sans', sans-serif; transition: all .18s;
  }

  .db-drawer-item:hover  { background: var(--primary-bg); color: var(--primary-color); }
  .db-drawer-item.active { background: var(--primary-bg); color: var(--primary-color); font-weight: 600; }

  .db-drawer-badge {
    margin-left: auto; background: var(--danger-color); color: white;
    font-size: .563rem; font-weight: 700; padding: .125rem .375rem;
    border-radius: 9999px; line-height: 1.4;
  }

  .db-drawer-foot {
    padding: .75rem; border-top: 1px solid #f1f5f9;
    display: flex; flex-direction: column; gap: .375rem;
  }

  .db-drawer-report {
    display: flex; align-items: center; justify-content: center; gap: .5rem;
    padding: .625rem; background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white; border: none; border-radius: .75rem;
    font-size: .875rem; font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all .2s;
  }

  .db-drawer-logout {
    display: flex; align-items: center; justify-content: center; gap: .5rem;
    padding: .5625rem; background: none; border: 1px solid #fee2e2;
    color: var(--danger-color); border-radius: .75rem;
    font-size: .875rem; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all .2s;
  }

  .db-drawer-logout:hover { background: #fef2f2; }

  /* ── Right panel on tablet ── */
  .db-right { display: flex; flex-direction: column; gap: 0; }

  @media (max-width: 1024px) and (min-width: 641px) {
    .db-right {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 1rem; align-items: start;
    }
    .db-right .db-card { margin-bottom: 0; }
    .db-right .db-score-card { grid-column: span 2; }
  }

  @media (max-width: 640px) {
    .db-page-wrap { padding: .875rem; }
  }
</style>