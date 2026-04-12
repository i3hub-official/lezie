<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Chart from 'chart.js/auto';
  import {
    TrendingUp, TrendingDown, BarChart3, PieChart, LineChart,
    Calendar, MapPin, AlertTriangle, CheckCircle, Clock,
    ArrowUp, ArrowDown, Download, Filter, X,
    ChevronLeft, Shield, Users, Bell, Flame, Car,
    Building, Volume2, AlertOctagon, Home, Activity,
    Zap, Award, Target, Eye, ThumbsUp, MessageCircle,
    FileText   // Fixed: Added missing import
  } from 'lucide-svelte';

  let isLoading = $state(true);
 
  let timeRange = $state('month');

  // Re-fetch and re-render charts when timeRange changes
  $effect(() => {
    const range = timeRange; // track dependency
    if (!isLoading) {
      loadStatistics().then(() => {
        setTimeout(() => initCharts(), 100);
      });
    }
  });

  let selectedCategory = $state('all');
  let selectedSeverity = $state('all');
  let showFilters = $state(false);

  // Chart instances
  let trendChart: Chart | null = null;
  let categoryChart: Chart | null = null;
  let severityChart: Chart | null = null;
  let engagementChart: Chart | null = null;

  // Stats data
  let stats = $state({
    totalIncidents: 0,
    verifiedReports: 0,
    avgResponseTime: 0,
    safetyScore: 0,
    activeUsers: 0,
    communityReports: 0
  });

  // Chart data
  let incidentTrend = $state<any[]>([]);
  let categoryDistribution = $state<any[]>([]);
  let severityDistribution = $state<any[]>([]);
  let responseTimes = $state<any[]>([]);
  let topLocations = $state<any[]>([]);
  let userEngagement = $state<any[]>([]);

  const categories = [
    { value: 'all', label: 'All Categories', icon: Activity, color: '#6B7280' },
    { value: 'suspicious', label: 'Suspicious', icon: AlertTriangle, color: '#F59E0B' },
    { value: 'theft', label: 'Theft', icon: AlertOctagon, color: '#EF4444' },
    { value: 'vandalism', label: 'Vandalism', icon: Building, color: '#F97316' },
    { value: 'fire', label: 'Fire', icon: Flame, color: '#DC2626' },
    { value: 'accident', label: 'Accident', icon: Car, color: '#F59E0B' },
    { value: 'noise', label: 'Noise', icon: Volume2, color: '#8B5CF6' }
  ];

  const severityLevels = [
    { value: 'all', label: 'All Severities', color: '#6B7280' },
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'high', label: 'High', color: '#F97316' },
    { value: 'critical', label: 'Critical', color: '#EF4444' }
  ];

  onMount(async () => {
    await loadStatistics();
    isLoading = false;
    
    // Initialize charts after DOM is ready
    setTimeout(() => {
      initCharts();
    }, 100);
  });

  async function loadStatistics() {
    try {
      const res = await fetch(`/api/statistics?timeRange=${timeRange}`);
      if (!res.ok) throw new Error(`Statistics API error (${res.status})`);
      const data = await res.json();

      // ── Stats ─────────────────────────────────────────────────────────────
      stats = {
        totalIncidents:   data.communityStats.totalIncidents,
        verifiedReports:  data.communityStats.verifiedReports,
        avgResponseTime:  data.communityStats.avgResponseTime,
        safetyScore:      data.communityStats.safetyScore,
        activeUsers:      data.communityStats.activeUsers,
        communityReports: data.communityStats.communityReports,
      };

      // ── Charts ────────────────────────────────────────────────────────────
      incidentTrend        = data.incidentTrend;
      categoryDistribution = data.categoryDistribution;
      severityDistribution = data.severityDistribution;
      topLocations         = data.topLocations;
      userEngagement       = data.userEngagement;

      // responseTimes has no live data yet — keep static until
      // response_time column is added to reports table
      responseTimes = [
        { category: 'Fire',       time: 5.2,  target: 8,  color: '#DC2626' },
        { category: 'Critical',   time: 6.8,  target: 10, color: '#EF4444' },
        { category: 'Theft',      time: 12.4, target: 15, color: '#EF4444' },
        { category: 'Accident',   time: 10.1, target: 12, color: '#F59E0B' },
        { category: 'Suspicious', time: 14.7, target: 20, color: '#F59E0B' },
        { category: 'Vandalism',  time: 16.3, target: 24, color: '#F97316' },
        { category: 'Noise',      time: 18.2, target: 30, color: '#8B5CF6' },
      ];

    } catch (err) {
      console.error('[StatisticsPage] loadStatistics failed:', err);
      // Keep zeroed defaults on failure so the page still renders
    }
  }

  function initCharts() {
    // Trend Chart
    const trendCtx = document.getElementById('trendChart') as HTMLCanvasElement;
    if (trendCtx) {
      if (trendChart) trendChart.destroy();
      trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: incidentTrend.map(d => d.month),
          datasets: [
            {
              label: 'Total Incidents',
              data: incidentTrend.map(d => d.count),
              borderColor: '#6a2c91',
              backgroundColor: 'rgba(106, 44, 145, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Verified Reports',
              data: incidentTrend.map(d => d.verified),
              borderColor: '#A5B4FC',
              backgroundColor: 'rgba(165, 180, 252, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'top' }
          }
        }
      });
    }

    // Category Distribution (Pie Chart)
    const categoryCtx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (categoryCtx) {
      if (categoryChart) categoryChart.destroy();
      categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
          labels: categoryDistribution.map(d => d.category),
          datasets: [{
            data: categoryDistribution.map(d => d.count),
            backgroundColor: categoryDistribution.map(d => d.color),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    // Severity Distribution (Pie Chart)
    const severityCtx = document.getElementById('severityChart') as HTMLCanvasElement;
    if (severityCtx) {
      if (severityChart) severityChart.destroy();
      severityChart = new Chart(severityCtx, {
        type: 'pie',
        data: {
          labels: severityDistribution.map(d => d.severity),
          datasets: [{
            data: severityDistribution.map(d => d.count),
            backgroundColor: severityDistribution.map(d => d.color),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    // User Engagement Chart
    const engagementCtx = document.getElementById('engagementChart') as HTMLCanvasElement;
    if (engagementCtx) {
      if (engagementChart) engagementChart.destroy();
      engagementChart = new Chart(engagementCtx, {
        type: 'bar',
        data: {
          labels: userEngagement.map(d => d.month),
          datasets: [
            {
              label: 'Reports',
              data: userEngagement.map(d => d.reports),
              backgroundColor: '#8B5CF6',
              borderRadius: 8
            },
            {
              label: 'Verifications',
              data: userEngagement.map(d => d.verifications),
              backgroundColor: '#10B981',
              borderRadius: 8
            },
            {
              label: 'Comments',
              data: userEngagement.map(d => d.comments),
              backgroundColor: '#F59E0B',
              borderRadius: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'top' }
          }
        }
      });
    }
  }

  function formatNumber(num: number): string {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  }

  function getTrendColor(trend: string) {
    return trend.includes('+') ? '#10B981' : '#EF4444';
  }
</script>

<div class="stats-page">
  <div class="stats-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
      </div>
      <div class="header-center">
        <div class="logo-badge">
          <BarChart3 size={24} />
        </div>
        <div>
          <h1>Safety Statistics</h1>
          <p>Comprehensive analytics and insights</p>
        </div>
      </div>
      <div class="header-right">
        <button class="filter-btn" onclick={() => showFilters = !showFilters}>
          <Filter size={16} />
          <span>Filters</span>
        </button>
        <button class="export-btn" onclick={() => console.log('Export data')}>
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Filters Panel -->
    {#if showFilters}
      <div class="filters-panel">
        <div class="filter-group">
          <label>Time Range</label>
          <div class="time-buttons">
            <button class="time-btn {timeRange === 'week' ? 'active' : ''}" onclick={() => timeRange = 'week'}>
              Last 7 Days
            </button>
            <button class="time-btn {timeRange === 'month' ? 'active' : ''}" onclick={() => timeRange = 'month'}>
              Last 30 Days
            </button>
            <button class="time-btn {timeRange === 'year' ? 'active' : ''}" onclick={() => timeRange = 'year'}>
              Last 12 Months
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>Category</label>
          <div class="category-filters">
            {#each categories as cat}
              <button
                class="category-filter {selectedCategory === cat.value ? 'active' : ''}"
                style={selectedCategory === cat.value ? `border-color: ${cat.color}; background: ${cat.color}10;` : ''}
                onclick={() => selectedCategory = cat.value}
              >
                <svelte:component this={cat.icon} size={14} style={selectedCategory === cat.value ? `color: ${cat.color}` : ''} />
                <span>{cat.label}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="filter-group">
          <label>Severity</label>
          <div class="severity-filters">
            {#each severityLevels as sev}
              <button
                class="severity-filter {selectedSeverity === sev.value ? 'active' : ''}"
                style={selectedSeverity === sev.value ? `border-color: ${sev.color}; background: ${sev.color}10;` : ''}
                onclick={() => selectedSeverity = sev.value}
              >
                <span class="severity-dot" style="background: {sev.color}"></span>
                <span>{sev.label}</span>
              </button>
            {/each}
          </div>
        </div>

        <button class="clear-filters" onclick={() => {
          selectedCategory = 'all';
          selectedSeverity = 'all';
        }}>
          <X size={14} />
          Clear all
        </button>
      </div>
    {/if}

    {#if isLoading}
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading statistics...</p>
      </div>
    {:else}
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total-icon">
            <AlertTriangle size={22} />
          </div>
          <div class="stat-content">
            <span class="stat-value">{formatNumber(stats.totalIncidents)}</span>
            <span class="stat-label">Total Incidents</span>
          </div>
          <div class="stat-trend positive">
            <TrendingUp size={12} />
            <span>+8%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon verified-icon">
            <CheckCircle size={22} />
          </div>
          <div class="stat-content">
            <span class="stat-value">{formatNumber(stats.verifiedReports)}</span>
            <span class="stat-label">Verified Reports</span>
          </div>
          <div class="stat-trend positive">
            <TrendingUp size={12} />
            <span>+12%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon time-icon">
            <Clock size={22} />
          </div>
          <div class="stat-content">
            <span class="stat-value">{stats.avgResponseTime} min</span>
            <span class="stat-label">Avg Response Time</span>
          </div>
          <div class="stat-trend negative">
            <TrendingDown size={12} />
            <span>-5%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon safety-icon">
            <Shield size={22} />
          </div>
          <div class="stat-content">
            <span class="stat-value">{stats.safetyScore}%</span>
            <span class="stat-label">Safety Score</span>
          </div>
          <div class="stat-trend positive">
            <TrendingUp size={12} />
            <span>+3%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon users-icon">
            <Users size={22} />
          </div>
          <div class="stat-content">
            <span class="stat-value">{formatNumber(stats.activeUsers)}</span>
            <span class="stat-label">Active Users</span>
          </div>
          <div class="stat-trend positive">
            <TrendingUp size={12} />
            <span>+18%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon reports-icon">
            <FileText size={22} />
          </div>
          <div class="stat-content">
            <span class="stat-value">{formatNumber(stats.communityReports)}</span>
            <span class="stat-label">Community Reports</span>
          </div>
          <div class="stat-trend positive">
            <TrendingUp size={12} />
            <span>+22%</span>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Trend Chart -->
        <div class="chart-card large">
          <div class="chart-header">
            <h3>Incident Trends</h3>
            <LineChart size={16} class="chart-icon" />
          </div>
          <canvas id="trendChart" width="400" height="200"></canvas>
        </div>

        <!-- Category Distribution -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>By Category</h3>
            <PieChart size={16} class="chart-icon" />
          </div>
          <canvas id="categoryChart" width="300" height="200"></canvas>
        </div>

        <!-- Severity Distribution -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>By Severity</h3>
            <Activity size={16} class="chart-icon" />
          </div>
          <canvas id="severityChart" width="300" height="200"></canvas>
        </div>
      </div>

      <!-- Response Times -->
      <div class="chart-card full-width">
        <div class="chart-header">
          <h3>Response Times (minutes)</h3>
          <Target size={16} class="chart-icon" />
        </div>
        <div class="response-chart">
          {#each responseTimes as rt}
            <div class="response-item">
              <div class="response-label">{rt.category}</div>
              <div class="response-bar-container">
                <div class="response-bar" style="width: {(rt.time / 35) * 100}%; background: {rt.time <= rt.target ? '#10B981' : '#F59E0B'}">
                  <span class="response-value">{rt.time} min</span>
                </div>
                <div class="response-target" style="left: {(rt.target / 35) * 100}%">
                  <div class="target-marker"></div>
                  <span class="target-label">Target: {rt.target}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- User Engagement -->
      <div class="chart-card full-width">
        <div class="chart-header">
          <h3>Community Engagement</h3>
          <Users size={16} class="chart-icon" />
        </div>
        <canvas id="engagementChart" width="800" height="300"></canvas>
      </div>

      <!-- Two Columns: Hotspots + Safety Insights -->
      <div class="two-columns">
        <!-- Hotspots -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Hotspots</h3>
            <MapPin size={16} class="chart-icon" />
          </div>
          <div class="locations-list">
            {#each topLocations as loc}
              <div class="location-item">
                <div class="location-rank">#{topLocations.indexOf(loc) + 1}</div>
                <div class="location-info">
                  <div class="location-name">{loc.location}</div>
                  <div class="location-count">{loc.count} incidents</div>
                </div>

                <div class="location-trend" style="color: {getTrendColor(loc.trend)}">
                  {#if loc.trend.includes('+')}
                    <ArrowUp size={12} />
                  {:else}
                    <ArrowDown size={12} />
                  {/if}
                  <span>{loc.trend}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Safety Insights -->
        <div class="insights-card">
          <div class="insights-header">
            <Award size={20} style="color: var(--primary-color)" />
            <h3>Safety Insights</h3>
          </div>
          <div class="insights-grid">
            <div class="insight">
              <div class="insight-icon positive">
                <TrendingUp size={16} />
              </div>
              <div>
                <strong>12% decrease</strong>
                <p>in incidents compared to last month</p>
              </div>
            </div>
            <div class="insight">
              <div class="insight-icon positive">
                <CheckCircle size={16} />
              </div>
              <div>
                <strong>71.5% verification rate</strong>
                <p>of community reports are verified</p>
              </div>
            </div>
            <div class="insight">
              <div class="insight-icon warning">
                <AlertTriangle size={16} />
              </div>
              <div>
                <strong>Friday evenings</strong>
                <p>have the highest incident frequency</p>
              </div>
            </div>
            <div class="insight">
              <div class="insight-icon positive">
                <ThumbsUp size={16} />
              </div>
              <div>
                <strong>86% satisfaction rate</strong>
                <p>from community feedback</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Your existing styles remain unchanged */
  .stats-page {
    min-height: 100vh;
    background: transparent;
    padding: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .stats-container {
    max-width: 100%;
    margin: 0 auto;
  }

  /* Header */
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
  }

  .header-center {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-right {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
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

  .filter-btn, .export-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: white;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.813rem;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-btn:hover, .export-btn:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: var(--primary-bg);
  }

  /* Filters Panel */
  .filters-panel {
    background: white;
    border-radius: 1rem;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e2e8f0;
  }

  .filter-group {
    margin-bottom: 1rem;
  }

  .filter-group label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.5rem;
  }

  .time-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .time-btn {
    padding: 0.375rem 0.875rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.625rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }

  .time-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }

  .category-filters, .severity-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .category-filter, .severity-filter {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.625rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
  }

  .category-filter.active, .severity-filter.active {
    border-color: currentColor;
  }

  .severity-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .clear-filters {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background: none;
    border: 1px solid #fee2e2;
    border-radius: 0.625rem;
    font-size: 0.688rem;
    color: #dc2626;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  /* Loading */
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

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
    position: relative;
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

  .total-icon { background: #FEE2E2; color: #DC2626; }
  .verified-icon { background: #D1FAE5; color: #10B981; }
  .time-icon { background: #DBEAFE; color: #3B82F6; }
  .safety-icon { background: #EDE9FE; color: #8B5CF6; }
  .users-icon { background: #FEF3C7; color: #F59E0B; }
  .reports-icon { background: #E0E7FF; color: #6366F1; }

  .stat-content {
    flex: 1;
  }

  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }

  .stat-label {
    font-size: 0.688rem;
    color: #64748b;
  }

  .stat-trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.688rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
  }

  .stat-trend.positive {
    background: #D1FAE5;
    color: #059669;
  }

  .stat-trend.negative {
    background: #FEE2E2;
    color: #DC2626;
  }

  /* Charts Grid */
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 1024px) {
    .charts-grid {
      grid-template-columns: 1fr;
    }
  }

  .chart-card {
    background: white;
    border-radius: 1rem;
    padding: 1.25rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
  }

  .chart-card.large {
    grid-column: span 1;
  }

  .chart-card.full-width {
    margin-bottom: 1rem;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .chart-header h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }

  .chart-icon {
    color: #94a3b8;
  }

  canvas {
    max-height: 300px;
    width: 100% !important;
  }

  /* Two Columns */
  .two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  @media (max-width: 1024px) {
    .two-columns {
      grid-template-columns: 1fr;
    }
  }

  /* Response Times */
  .response-chart {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .response-item {
    position: relative;
  }

  .response-label {
    font-size: 0.688rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.25rem;
  }

  .response-bar-container {
    position: relative;
    height: 32px;
    background: #f1f5f9;
    border-radius: 6px;
    overflow: visible;
  }

  .response-bar {
    height: 100%;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.5rem;
    position: relative;
    transition: width 0.3s ease;
  }

  .response-value {
    font-size: 0.688rem;
    font-weight: 600;
    color: white;
  }

  .response-target {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    pointer-events: none;
  }

  .target-marker {
    width: 2px;
    height: 100%;
    background: #ef4444;
  }

  .target-label {
    font-size: 0.5625rem;
    color: #ef4444;
    white-space: nowrap;
    margin-top: 0.25rem;
  }

  /* Locations List */
  .locations-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .location-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 0.75rem;
    transition: background 0.2s;
  }

  .location-item:hover {
    background: #f8fafc;
  }

  .location-rank {
    width: 28px;
    height: 28px;
    background: #f1f5f9;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
  }

  .location-info {
    flex: 1;
  }

  .location-name {
    font-size: 0.75rem;
    font-weight: 600;
    color: #0f172a;
  }

  .location-count {
    font-size: 0.625rem;
    color: #64748b;
  }

  .location-trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.688rem;
    font-weight: 600;
  }

  /* Insights Card */
  .insights-card {
    background: linear-gradient(135deg, #f8fafc 0%, white 100%);
    border-radius: 1rem;
    padding: 1.25rem;
    border: 1px solid #e2e8f0;
  }

  .insights-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .insights-header h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }

  .insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .insight {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #f1f5f9;
  }

  .insight-icon {
    width: 32px;
    height: 32px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .insight-icon.positive {
    background: #D1FAE5;
    color: #059669;
  }

  .insight-icon.warning {
    background: #FEE2E2;
    color: #DC2626;
  }

  .insight strong {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: #0f172a;
  }

  .insight p {
    font-size: 0.625rem;
    color: #64748b;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .header-left, .header-right {
      width: 100%;
    }

    .header-right {
      justify-content: center;
    }

    .header-center {
      flex-direction: column;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .time-buttons {
      flex-wrap: wrap;
    }
  }
</style>