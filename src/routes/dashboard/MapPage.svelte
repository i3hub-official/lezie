<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    MapPin, X, AlertTriangle, Navigation, Clock,
    Flame, Car, Building, Volume2, AlertOctagon,
    Filter, Search, Users
  } from 'lucide-svelte';

  let isLoading    = $state(true);
  let incidents    = $state<any[]>([]);
  let filters      = $state({ categories: [] as string[], severity: [] as string[], dateRange: 'week' });
  let showFilters  = $state(false);
  let searchQuery  = $state('');
  let selected     = $state<any>(null);

  const categories = [
    { value:'suspicious', label:'Suspicious', color:'#F59E0B', icon:AlertTriangle },
    { value:'theft',      label:'Theft',       color:'#EF4444', icon:AlertOctagon  },
    { value:'vandalism',  label:'Vandalism',   color:'#F97316', icon:Building      },
    { value:'fire',       label:'Fire',        color:'#DC2626', icon:Flame         },
    { value:'accident',   label:'Accident',    color:'#F59E0B', icon:Car           },
    { value:'noise',      label:'Noise',       color:'#8B5CF6', icon:Volume2       },
  ];

  const severityLevels = [
    { value:'low',      label:'Low',      color:'#10B981' },
    { value:'medium',   label:'Medium',   color:'#F59E0B' },
    { value:'high',     label:'High',     color:'#F97316' },
    { value:'critical', label:'Critical', color:'#EF4444' },
  ];

  onMount(async () => {
    await new Promise(r => setTimeout(r, 700));
    incidents = [
      { id:1, title:'Suspicious person near school', category:'suspicious', severity:'high',
        lat:40.7128, lng:-74.0060, time:new Date().toISOString(), status:'active',
        description:'Person acting suspiciously near the elementary school.', witnesses:3, isLive:true },
      { id:2, title:'Car break-in on Main St', category:'theft', severity:'medium',
        lat:40.7140, lng:-74.0080, time:new Date(Date.now()-3600000).toISOString(), status:'investigating',
        description:'Multiple cars broken into overnight.', witnesses:5, isLive:false },
      { id:3, title:'Vandalism at park', category:'vandalism', severity:'low',
        lat:40.7110, lng:-74.0040, time:new Date(Date.now()-86400000).toISOString(), status:'resolved',
        description:'Graffiti on park equipment.', witnesses:2, isLive:false },
      { id:4, title:'Fire reported downtown', category:'fire', severity:'critical',
        lat:40.7150, lng:-74.0100, time:new Date(Date.now()-7200000).toISOString(), status:'active',
        description:'Structure fire, emergency services on scene.', witnesses:12, isLive:true },
    ];
    isLoading = false;
  });

  const catColor  = (c: string) => categories.find(x => x.value === c)?.color ?? '#6B7280';
  const sevColor  = (s: string) => severityLevels.find(x => x.value === s)?.color ?? '#6B7280';
  const catIcon   = (c: string) => categories.find(x => x.value === c)?.icon ?? AlertTriangle;

  function toggleCategory(v: string) {
    filters.categories = filters.categories.includes(v)
      ? filters.categories.filter(x => x !== v)
      : [...filters.categories, v];
  }

  function toggleSeverity(v: string) {
    filters.severity = filters.severity.includes(v)
      ? filters.severity.filter(x => x !== v)
      : [...filters.severity, v];
  }

  function clearFilters() {
    filters = { categories:[], severity:[], dateRange:'week' };
    searchQuery = '';
  }

  const filtered = $derived(incidents.filter(i => {
    if (searchQuery && !i.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !i.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.categories.length && !filters.categories.includes(i.category)) return false;
    if (filters.severity.length && !filters.severity.includes(i.severity)) return false;
    return true;
  }));

  function formatTime(d: string) {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff/60000), h = Math.floor(diff/3600000), day = Math.floor(diff/86400000);
    if (h < 1)  return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${day}d ago`;
  }

  function getCurrentLocation() {
    navigator.geolocation?.getCurrentPosition(() => {}, () => {});
  }
</script>

<div class="mp-wrap">

  <!-- ── TOOLBAR ── -->
  <div class="mp-toolbar">
    <!-- Search -->
    <div class="mp-search">
      <Search size={15} class="mp-search-ico" />
      <input
        type="text"
        placeholder="Search incidents…"
        bind:value={searchQuery}
        class="mp-search-input"
      />
      {#if searchQuery}
        <button class="mp-search-clear" onclick={() => searchQuery = ''}><X size={13} /></button>
      {/if}
    </div>

    <!-- Locate me -->
    <button class="mp-tool-btn" onclick={getCurrentLocation} title="My location">
      <Navigation size={16} />
    </button>

    <!-- Filter toggle -->
    <button
      class="mp-tool-btn {showFilters ? 'mp-tool-btn--active' : ''} {(filters.categories.length + filters.severity.length) > 0 ? 'mp-tool-btn--dot' : ''}"
      onclick={() => showFilters = !showFilters}
      title="Filters"
    >
      <Filter size={16} />
    </button>
  </div>

  <!-- ── FILTER PANEL ── -->
  {#if showFilters}
    <div class="mp-filters">
      <div class="mp-filter-group">
        <span class="mp-filter-label">Category</span>
        <div class="mp-chips">
          {#each categories as cat}
            <button
              class="mp-chip {filters.categories.includes(cat.value) ? 'mp-chip--on' : ''}"
              style={filters.categories.includes(cat.value) ? `--chip-c:${cat.color}` : ''}
              onclick={() => toggleCategory(cat.value)}
            >
              <cat.icon size={11} />
              {cat.label}
            </button>
          {/each}
        </div>
      </div>
      <div class="mp-filter-group">
        <span class="mp-filter-label">Severity</span>
        <div class="mp-chips">
          {#each severityLevels as lv}
            <button
              class="mp-chip {filters.severity.includes(lv.value) ? 'mp-chip--on' : ''}"
              style={filters.severity.includes(lv.value) ? `--chip-c:${lv.color}` : ''}
              onclick={() => toggleSeverity(lv.value)}
            >{lv.label}</button>
          {/each}
        </div>
      </div>
      <div class="mp-filter-group">
        <span class="mp-filter-label">Date range</span>
        <div class="mp-chips">
          {#each [['day','Today'],['week','This week'],['month','This month']] as [v,l]}
            <button
              class="mp-chip {filters.dateRange === v ? 'mp-chip--on' : ''}"
              style={filters.dateRange === v ? '--chip-c:var(--primary-color)' : ''}
              onclick={() => filters.dateRange = v}
            >{l}</button>
          {/each}
        </div>
      </div>
      {#if (filters.categories.length + filters.severity.length) > 0}
        <button class="mp-clear-btn" onclick={clearFilters}>Clear all filters</button>
      {/if}
    </div>
  {/if}

  <!-- ── MAP + LIST ── -->
  <div class="mp-body">

    <!-- MAP CANVAS -->
    <div class="mp-canvas">
      {#if isLoading}
        <div class="mp-loading">
          <div class="mp-spinner"></div>
          <p>Loading map data…</p>
        </div>
      {/if}

      <!-- Fake grid map -->
      <div class="mp-grid" aria-hidden="true"></div>

      <!-- Markers -->
      {#each filtered as inc}
        <button
          class="mp-marker"
          style="left:{((inc.lng + 74.02) / 0.04) * 100}%;top:{((40.73 - inc.lat) / 0.04) * 100}%"
          onclick={() => selected = inc}
          title={inc.title}
        >
          <span class="mp-marker-dot" style="background:{sevColor(inc.severity)}">
            {#snippet icon()}
              {@const Icon = catIcon(inc.category)}
              <Icon size={10} />
            {/snippet}
            {@render icon()}
          </span>
          <span class="mp-marker-ring" style="background:{sevColor(inc.severity)}"></span>
        </button>
      {/each}

      <!-- Live badge -->
      <div class="mp-live-badge">
        <span class="mp-live-dot"></span>
        {filtered.length} incident{filtered.length !== 1 ? 's' : ''} active
      </div>
    </div>

    <!-- INCIDENT LIST -->
    <div class="mp-list-panel">
      <div class="mp-list-head">
        <span class="mp-list-title">Recent Reports</span>
        <span class="mp-list-count">{filtered.length}</span>
      </div>

      <div class="mp-list">
        {#if filtered.length === 0}
          <div class="mp-empty">
            <AlertTriangle size={32} />
            <p>No incidents match your filters</p>
            <button onclick={clearFilters}>Clear filters</button>
          </div>
        {:else}
          {#each filtered as inc}
  <div class="mp-item" onclick={() => selected = inc}>
    <span class="mp-item-bar" style="background:{sevColor(inc.severity)}"></span>
    <span class="mp-item-ico" style="background:{catColor(inc.category)}18">
      {#snippet icon()}
        {@const Icon = catIcon(inc.category)}
        <Icon size={13} style="color:{catColor(inc.category)}" />
      {/snippet}
      {@render icon()}
    </span>
    <div class="mp-item-body">
      <div class="mp-item-top">
        <span class="mp-item-title">{inc.title}</span>
        {#if inc.isLive}<span class="mp-live-tag">LIVE</span>{/if}
      </div>
      <p class="mp-item-desc">{inc.description}</p>
      <div class="mp-item-foot">
        <span><Clock size={10} /> {formatTime(inc.time)}</span>
        <button 
          class="mp-item-link" 
          onclick={(e) => { 
            e.stopPropagation(); 
            goto(`/incident/${inc.id}`); 
          }}
        >
          Details →
        </button>
      </div>
    </div>
  </div>
{/each}
        {/if}
      </div>
    </div>
  </div>

  <!-- ── INCIDENT POPUP ── -->
  {#if selected}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="mp-popup-overlay" onclick={() => selected = null}>
      <div class="mp-popup" onclick={(e) => e.stopPropagation()}>
        <button class="mp-popup-close" onclick={() => selected = null}><X size={16} /></button>

        <div class="mp-popup-head">
          <span class="mp-popup-ico" style="background:{catColor(selected.category)}18">
            {#snippet icon()}
              {@const Icon = catIcon(selected.category)}
              <Icon size={18} style="color:{catColor(selected.category)}" />
            {/snippet}
            {@render icon()}
          </span>
          <h3>{selected.title}</h3>
        </div>

        <div class="mp-popup-tags">
          <span style="background:{catColor(selected.category)}18;color:{catColor(selected.category)}">{selected.category}</span>
          <span style="background:{sevColor(selected.severity)}18;color:{sevColor(selected.severity)}">{selected.severity}</span>
          {#if selected.isLive}<span class="mp-live-tag">LIVE</span>{/if}
        </div>

        <p class="mp-popup-desc">{selected.description}</p>

        <div class="mp-popup-meta">
          <span><Clock size={11} /> {formatTime(selected.time)}</span>
          <span><Users size={11} /> {selected.witnesses} witnesses</span>
          <span style="color:{sevColor(selected.status === 'active' ? 'critical' : 'low')}">
            ● {selected.status}
          </span>
        </div>

        <button class="mp-popup-btn" onclick={() => goto(`/incident/${selected.id}`)}>
          View full details →
        </button>
      </div>
    </div>
  {/if}

</div>

<style>
  /* ── Reset / tokens assumed from :root ── */
  .mp-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-family: 'DM Sans', system-ui, sans-serif;
    gap: 0;
  }

  /* ── TOOLBAR ── */
  .mp-toolbar {
    display: flex;
    align-items: center;
    gap: .625rem;
    padding: 0 0 .875rem;
  }

  .mp-search {
    flex: 1;
    position: relative;
  }

  :global(.mp-search-ico) {
    position: absolute; left: .75rem; top: 50%;
    transform: translateY(-50%); color: #94a3b8; pointer-events: none;
  }

  .mp-search-input {
    width: 100%; height: 38px;
    padding: 0 2.5rem 0 2.25rem;
    border: 1.5px solid #e5e7eb; border-radius: .75rem;
    font-size: .8125rem; font-family: 'DM Sans', sans-serif;
    background: var(--light-color); color: var(--dark-color);
    transition: all .2s; outline: none;
  }

  .mp-search-input:focus {
    border-color: var(--primary-color); background: white;
    box-shadow: 0 0 0 3px rgba(106,44,145,.08);
  }

  .mp-search-clear {
    position: absolute; right: .75rem; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #94a3b8;
    display: flex; padding: .2rem;
  }

  .mp-tool-btn {
    width: 38px; height: 38px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: white; border: 1.5px solid #e5e7eb; border-radius: .75rem;
    color: var(--gray-color); cursor: pointer; transition: all .2s;
    position: relative;
  }

  .mp-tool-btn:hover { border-color: var(--primary-border); color: var(--primary-color); }

  .mp-tool-btn--active {
    border-color: var(--primary-color); background: var(--primary-bg); color: var(--primary-color);
  }

  .mp-tool-btn--dot::after {
    content: ''; position: absolute; top: 4px; right: 4px;
    width: 7px; height: 7px; background: var(--primary-color);
    border-radius: 50%; border: 1.5px solid white;
  }

  /* ── FILTER PANEL ── */
  .mp-filters {
    background: white; border: 1.5px solid #e5e7eb; border-radius: 1rem;
    padding: 1rem; margin-bottom: .875rem;
    display: flex; flex-direction: column; gap: .875rem;
  }

  .mp-filter-group { display: flex; flex-direction: column; gap: .5rem; }

  .mp-filter-label {
    font-size: .688rem; font-weight: 700; color: #475569;
    text-transform: uppercase; letter-spacing: .06em;
  }

  .mp-chips { display: flex; flex-wrap: wrap; gap: .375rem; }

  .mp-chip {
    display: inline-flex; align-items: center; gap: .3rem;
    padding: .3125rem .75rem;
    background: var(--light-color); border: 1.5px solid #e5e7eb;
    border-radius: 9999px; font-size: .75rem; font-weight: 500;
    color: #475569; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all .18s;
  }

  .mp-chip:hover { border-color: var(--primary-border); color: var(--primary-color); }

  .mp-chip--on {
    background: var(--chip-c, var(--primary-color));
    border-color: var(--chip-c, var(--primary-color));
    color: white !important;
  }

  .mp-chip--on:hover { opacity: .9; }

  .mp-clear-btn {
    align-self: flex-start; padding: .375rem .875rem;
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: .625rem; font-size: .75rem; font-weight: 500;
    color: var(--danger-color); cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .18s;
  }

  .mp-clear-btn:hover { background: #fee2e2; }

  /* ── BODY (map + list) ── */
  .mp-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .875rem;
    min-height: 0;
  }

  @media (min-width: 900px) {
    .mp-body { flex-direction: row; }
  }

  /* ── MAP CANVAS ── */
  .mp-canvas {
    position: relative;
    height: 260px;
    border-radius: 1.125rem;
    overflow: hidden;
    border: 1.5px solid #e5e7eb;
    flex-shrink: 0;
    background: white;
  }

  @media (min-width: 900px) {
    .mp-canvas { flex: 1; height: auto; }
  }

  .mp-loading {
    position: absolute; inset: 0; background: rgba(255,255,255,.9);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: .625rem; z-index: 10; font-size: .8125rem; color: var(--gray-color);
  }

  .mp-spinner {
    width: 28px; height: 28px;
    border: 3px solid #e5e7eb; border-top-color: var(--primary-color);
    border-radius: 50%; animation: spin .7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .mp-grid {
    width: 100%; height: 100%;
    background:
      linear-gradient(var(--primary-bg) 1px, transparent 1px),
      linear-gradient(90deg, var(--primary-bg) 1px, transparent 1px);
    background-size: 36px 36px;
    background-color: #fafafa;
  }

  /* Markers */
  .mp-marker {
    position: absolute; transform: translate(-50%,-50%);
    background: none; border: none; cursor: pointer; padding: 0; z-index: 5;
  }

  .mp-marker-dot {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,.15);
    position: relative; z-index: 2; transition: transform .2s;
  }

  .mp-marker-dot :global(svg) { color: white; }

  .mp-marker:hover .mp-marker-dot { transform: scale(1.15); }

  .mp-marker-ring {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 44px; height: 44px; border-radius: 50%;
    opacity: .35; animation: ring 2s infinite; z-index: 1;
  }

  @keyframes ring {
    0%   { transform: translate(-50%,-50%) scale(.5); opacity:.4; }
    100% { transform: translate(-50%,-50%) scale(1.8); opacity:0; }
  }

  /* Live badge on map */
  .mp-live-badge {
    position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: .5rem;
    background: rgba(17,24,39,.82); backdrop-filter: blur(6px);
    padding: .375rem .875rem; border-radius: 9999px;
    font-size: .75rem; font-weight: 500; color: white; white-space: nowrap;
  }

  .mp-live-dot {
    width: 7px; height: 7px; border-radius: 50%; background: var(--success-color);
    animation: livePulse 1.6s infinite;
  }

  @keyframes livePulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.5; transform:scale(1.3); }
  }

  /* ── INCIDENT LIST ── */
  .mp-list-panel {
    display: flex; flex-direction: column;
    border: 1.5px solid #e5e7eb; border-radius: 1.125rem;
    background: white; overflow: hidden;
  }

  @media (min-width: 900px) {
    .mp-list-panel { width: 340px; flex-shrink: 0; }
  }

  @media (min-width: 1200px) {
    .mp-list-panel { width: 380px; }
  }

  .mp-list-head {
    display: flex; justify-content: space-between; align-items: center;
    padding: .875rem 1rem; border-bottom: 1px solid #f1f5f9;
  }

  .mp-list-title { font-size: .875rem; font-weight: 700; color: var(--dark-color); }

  .mp-list-count {
    font-size: .688rem; font-weight: 600; color: var(--primary-color);
    background: var(--primary-bg); border: 1px solid var(--primary-border);
    padding: .2rem .5rem; border-radius: 9999px;
  }

  .mp-list {
    flex: 1; overflow-y: auto; padding: .625rem;
    display: flex; flex-direction: column; gap: .5rem;
  }

  .mp-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 2.5rem 1rem; text-align: center; color: var(--gray-color); gap: .5rem;
  }

  .mp-empty p { font-size: .8125rem; }

  .mp-empty button {
    margin-top: .25rem; padding: .375rem .875rem;
    background: var(--primary-bg); border: 1px solid var(--primary-border);
    border-radius: .625rem; font-size: .75rem; color: var(--primary-color);
    cursor: pointer; font-family: 'DM Sans', sans-serif;
  }

  /* Incident item */
  .mp-item {
    display: flex; align-items: flex-start; gap: .625rem;
    padding: .75rem; border: 1px solid #f1f5f9; border-radius: .875rem;
    background: white; cursor: pointer; width: 100%; text-align: left;
    font-family: 'DM Sans', sans-serif; transition: all .18s;
  }

  .mp-item:hover { border-color: var(--primary-border); background: var(--primary-bg); }

  .mp-item-bar {
    width: 3px; border-radius: 3px; align-self: stretch; flex-shrink: 0;
    min-height: 40px;
  }

  .mp-item-ico {
    width: 32px; height: 32px; border-radius: .5rem;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .mp-item-body { flex: 1; min-width: 0; }

  .mp-item-top {
    display: flex; justify-content: space-between; align-items: center;
    gap: .375rem; margin-bottom: .25rem;
  }

  .mp-item-title {
    font-size: .8125rem; font-weight: 600; color: var(--dark-color);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .mp-live-tag {
    font-size: .5625rem; font-weight: 800; padding: .125rem .4rem;
    background: #fee2e2; color: #dc2626; border-radius: 9999px;
    flex-shrink: 0; letter-spacing: .03em;
  }

  .mp-item-desc {
    font-size: .6875rem; color: var(--gray-color); line-height: 1.4;
    margin-bottom: .375rem;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .mp-item-foot {
    display: flex; justify-content: space-between; align-items: center;
    font-size: .625rem; color: #94a3b8;
  }

  .mp-item-foot span { display: flex; align-items: center; gap: .25rem; }

  .mp-item-link {
    background: none; border: none; font-size: .625rem; font-weight: 600;
    color: var(--primary-color); cursor: pointer; padding: .2rem .5rem;
    font-family: 'DM Sans', sans-serif; border-radius: .375rem; transition: background .15s;
  }

  .mp-item-link:hover { background: var(--primary-bg); }

  /* ── POPUP ── */
  .mp-popup-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.5);
    z-index: 300; display: flex; align-items: flex-end; justify-content: center;
  }

  @media (min-width: 600px) {
    .mp-popup-overlay { align-items: center; }
  }

  .mp-popup {
    background: white; width: 100%; max-width: 420px;
    border-radius: 1.5rem 1.5rem 0 0;
    padding: 1.5rem; position: relative;
    animation: popupUp .3s ease;
  }

  @media (min-width: 600px) {
    .mp-popup { border-radius: 1.5rem; animation: popupFade .2s ease; }
  }

  @keyframes popupUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }

  @keyframes popupFade {
    from { opacity:0; transform:scale(.96); }
    to   { opacity:1; transform:scale(1); }
  }

  .mp-popup-close {
    position: absolute; top: 1rem; right: 1rem;
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--light-color); border: 1px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--gray-color); transition: all .2s;
  }

  .mp-popup-close:hover { background: #f1f5f9; }

  .mp-popup-head {
    display: flex; align-items: center; gap: .75rem;
    margin-bottom: .875rem; padding-right: 2rem;
  }

  .mp-popup-ico {
    width: 40px; height: 40px; border-radius: .75rem; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }

  .mp-popup-head h3 {
    font-size: 1rem; font-weight: 700; color: var(--dark-color); line-height: 1.3;
  }

  .mp-popup-tags {
    display: flex; flex-wrap: wrap; gap: .375rem; margin-bottom: .875rem;
  }

  .mp-popup-tags span {
    font-size: .688rem; font-weight: 600; padding: .25rem .625rem;
    border-radius: 9999px; text-transform: capitalize;
  }

  .mp-popup-desc {
    font-size: .8125rem; color: #475569; line-height: 1.55; margin-bottom: 1rem;
  }

  .mp-popup-meta {
    display: flex; flex-wrap: wrap; gap: .75rem;
    font-size: .6875rem; color: #94a3b8; margin-bottom: 1.125rem;
  }

  .mp-popup-meta span { display: flex; align-items: center; gap: .25rem; }

  .mp-popup-btn {
    width: 100%; padding: .75rem;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white; border: none; border-radius: .875rem;
    font-size: .875rem; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(106,44,145,.25);
    transition: all .2s;
  }

  .mp-popup-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(106,44,145,.35); }
</style>