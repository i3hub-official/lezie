<script lang="ts">
  import { onMount } from 'svelte';

  // ── Types ──────────────────────────────────────────────────────────────────
  type Severity = 'critical' | 'warning' | 'info' | 'resolved';

  interface Incident {
    id:        number;
    title:     string;
    location:  string;
    area:      string;
    time:      string;
    severity:  Severity;
    category:  string;
    reports:   number;
    verified:  boolean;
    desc:      string;
  }

  // ── Mock data ──────────────────────────────────────────────────────────────
  const ALL_INCIDENTS: Incident[] = [
    { id:1,  title:'Armed robbery reported',        location:'Admiralty Way', area:'Lekki',         time:'2 min ago',  severity:'critical', category:'Crime',       reports:14, verified:true,  desc:'Multiple reports of armed men near the access road. Police notified.' },
    { id:2,  title:'Suspicious vehicle parked',     location:'Opebi Road',   area:'Ikeja',          time:'8 min ago',  severity:'warning',  category:'Suspicious',  reports:4,  verified:false, desc:'Dark SUV parked for over 3 hours with occupants inside.' },
    { id:3,  title:'Road accident — 2 vehicles',    location:'Third Mainland Bridge', area:'Lagos Island', time:'15 min ago', severity:'critical', category:'Accident', reports:22, verified:true, desc:'Two-vehicle collision blocking the fast lane. FRSC en route.' },
    { id:4,  title:'Flooding on major road',        location:'Ago Palace Way', area:'Okota',        time:'22 min ago', severity:'warning',  category:'Hazard',      reports:9,  verified:true,  desc:'Heavy flooding making road impassable. Avoid if possible.' },
    { id:5,  title:'Power outage — entire street',  location:'Bode Thomas St', area:'Surulere',     time:'34 min ago', severity:'info',     category:'Utility',     reports:6,  verified:false, desc:'PHCN transformer fault reported. No ETA for restoration.' },
    { id:6,  title:'Street brawl dispersed',        location:'Computer Village', area:'Ikeja',      time:'41 min ago', severity:'resolved', category:'Crime',       reports:11, verified:true,  desc:'Police arrived and dispersed the crowd. Area now calm.' },
    { id:7,  title:'Gas leak smell reported',       location:'Agungi Estate', area:'Lekki',         time:'55 min ago', severity:'critical', category:'Hazard',      reports:7,  verified:false, desc:'Strong gas smell reported by multiple residents near block C.' },
    { id:8,  title:'Stray dog pack on loose',       location:'Gbagada Phase 2', area:'Gbagada',     time:'1 hr ago',   severity:'warning',  category:'Other',       reports:3,  verified:false, desc:'Pack of about 6–8 stray dogs spotted near the playground.' },
    { id:9,  title:'Pothole caused tyre damage',    location:'Ikorodu Road',  area:'Maryland',      time:'1 hr ago',   severity:'info',     category:'Hazard',      reports:18, verified:true,  desc:'Large pothole after the bridge causing multiple tyre damage incidents.' },
    { id:10, title:'Noise disturbance — late night',location:'Allen Avenue',  area:'Ikeja',         time:'2 hrs ago',  severity:'info',     category:'Noise',       reports:5,  verified:false, desc:'Loud music from an event venue past midnight.' },
    { id:11, title:'Pickpocket at bus stop',        location:'Ojuelegba',     area:'Surulere',      time:'2 hrs ago',  severity:'warning',  category:'Crime',       reports:8,  verified:true,  desc:'Multiple reports of pickpocketing targeting commuters.' },
    { id:12, title:'Road cleared — traffic normal', location:'Third Mainland Bridge', area:'Lagos Island', time:'3 hrs ago', severity:'resolved', category:'Accident', reports:22, verified:true, desc:'Accident cleared. Traffic flowing normally again.' },
  ];

  const CATEGORIES = ['All', 'Crime', 'Hazard', 'Accident', 'Suspicious', 'Utility', 'Noise', 'Other'];
  const AREAS      = ['All Areas', 'Lekki', 'Ikeja', 'Surulere', 'Lagos Island', 'Gbagada', 'Okota', 'Maryland'];

  // ── State ──────────────────────────────────────────────────────────────────
  let selectedCategory = $state('All');
  let selectedArea     = $state('All Areas');
  let searchQuery      = $state('');
  let expanded         = $state<number | null>(null);
  let visible          = $state(false);

  onMount(() => {
    setTimeout(() => visible = true, 50);
  });

  // ── Derived ────────────────────────────────────────────────────────────────
  let filtered = $derived(
    ALL_INCIDENTS.filter(i => {
      const matchCat  = selectedCategory === 'All'      || i.category === selectedCategory;
      const matchArea = selectedArea === 'All Areas'    || i.area === selectedArea;
      const matchQ    = !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase())
                          || i.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchArea && matchQ;
    })
  );

  let criticalCount = $derived(filtered.filter(i => i.severity === 'critical').length);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const SEV: Record<Severity, { label: string; color: string; bg: string; border: string }> = {
    critical: { label:'Critical', color:'#ef4444', bg:'#fef2f2', border:'rgba(239,68,68,.2)' },
    warning:  { label:'Warning',  color:'#f59e0b', bg:'#fffbeb', border:'rgba(245,158,11,.2)' },
    info:     { label:'Info',     color:'#6a2c91', bg:'rgba(106,44,145,.06)', border:'rgba(106,44,145,.15)' },
    resolved: { label:'Resolved', color:'#22c55e', bg:'#f0fdf4', border:'rgba(34,197,94,.2)' },
  };
</script>

<svelte:head>
  <title>Lezie — Neighbourhood Feed</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="page" class:visible>

  <!-- ── HEADER ────────────────────────────────────────────────────────── -->
  <div class="page-header">
    <div class="header-inner">
      <div class="header-left">
        <h1>Neighbourhood Feed</h1>
        <p class="header-sub">Real-time incidents near you</p>
      </div>
      <div class="header-right">
        {#if criticalCount > 0}
          <div class="critical-badge">
            <span class="critical-dot"></span>
            {criticalCount} critical {criticalCount === 1 ? 'alert' : 'alerts'}
          </div>
        {/if}
        <a href="/report" class="report-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Report
        </a>
      </div>
    </div>
  </div>

  <!-- ── FILTERS ───────────────────────────────────────────────────────── -->
  <div class="filters-wrap">
    <div class="filters-inner">
      <!-- Search -->
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          bind:value={searchQuery}
          type="text"
          placeholder="Search incidents or location…"
          aria-label="Search incidents"
        />
        {#if searchQuery}
          <button class="clear-btn" onclick={() => searchQuery = ''} type="button" aria-label="Clear search">✕</button>
        {/if}
      </div>

      <!-- Area -->
      <select bind:value={selectedArea} class="select" aria-label="Filter by area">
        {#each AREAS as a}
          <option value={a}>{a}</option>
        {/each}
      </select>

      <!-- Category pills -->
      <div class="cat-pills">
        {#each CATEGORIES as cat}
          <button
            class="cat-pill"
            class:active={selectedCategory === cat}
            onclick={() => selectedCategory = cat}
            type="button"
          >{cat}</button>
        {/each}
      </div>
    </div>
  </div>

  <!-- ── FEED ──────────────────────────────────────────────────────────── -->
  <div class="feed-wrap">
    <div class="feed-inner">

      {#if filtered.length === 0}
        <div class="empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>No incidents match your filters.</p>
          <button onclick={() => { selectedCategory='All'; selectedArea='All Areas'; searchQuery=''; }} type="button" class="reset-btn">Clear filters</button>
        </div>
      {:else}
        <div class="result-count">{filtered.length} incident{filtered.length !== 1 ? 's' : ''}</div>

        <div class="feed">
          {#each filtered as inc, i (inc.id)}
            {@const sev = SEV[inc.severity]}
            <div
              class="incident-card"
              class:is-expanded={expanded === inc.id}
              style="animation-delay:{i * 0.04}s"
              role="button"
              tabindex="0"
              onclick={() => expanded = expanded === inc.id ? null : inc.id}
              onkeydown={(e) => e.key === 'Enter' && (expanded = expanded === inc.id ? null : inc.id)}
            >
              <!-- Left accent -->
              <div class="accent" style="background:{sev.color}"></div>

              <div class="card-body">
                <div class="card-top">
                  <div class="card-meta">
                    <!-- Severity badge -->
                    <span class="sev-badge" style="color:{sev.color}; background:{sev.bg}; border-color:{sev.border}">
                      {#if inc.severity === 'critical'}
                        <span class="sev-dot" style="background:{sev.color}"></span>
                      {/if}
                      {sev.label}
                    </span>

                    <!-- Category -->
                    <span class="cat-label">{inc.category}</span>

                    {#if inc.verified}
                      <span class="verified-badge">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Verified
                      </span>
                    {/if}
                  </div>

                  <span class="time">{inc.time}</span>
                </div>

                <h3 class="card-title">{inc.title}</h3>

                <div class="card-loc">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {inc.location} · <span class="area">{inc.area}</span>
                </div>

                {#if expanded === inc.id}
                  <p class="card-desc">{inc.desc}</p>
                {/if}

                <div class="card-footer">
                  <span class="reports-count">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    {inc.reports} {inc.reports === 1 ? 'report' : 'reports'}
                  </span>
                  <span class="expand-hint">{expanded === inc.id ? 'Show less ↑' : 'Show more ↓'}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:    #1a0b2e;
    --violet: #6a2c91;
    --viol-l: #8b5cf6;
    --mist:   #ece9f8;
    --fog:    #faf9ff;
    --serif:  'DM Serif Display', Georgia, serif;
  }

  @keyframes slideIn {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:.5; transform:scale(1.4); }
  }

  /* ── PAGE ─────────────────────────────────────────────────────────────── */
  .page {
    min-height: 100vh;
    background: #faf9ff;
    font-family: 'DM Sans', system-ui, sans-serif;
    opacity: 0;
    transition: opacity .4s ease;
  }
  .page.visible { opacity: 1; }

  /* ── HEADER ───────────────────────────────────────────────────────────── */
  .page-header {
    background: #ffffff;
    border-bottom: 1px solid var(--mist);
    padding: 2rem 0 1.5rem;
    position: sticky; top: 0; z-index: 10;
  }
  .header-inner {
    max-width: 800px; margin: 0 auto; padding: 0 1.5rem;
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem; flex-wrap: wrap;
  }
  h1 {
    font-family: var(--serif);
    font-size: clamp(1.5rem, 3vw, 2rem);
    color: var(--ink); line-height: 1.1;
  }
  .header-sub { font-size: .8125rem; color: #94a3b8; margin-top: .2rem; }
  .header-right { display:flex; align-items:center; gap:.75rem; }

  .critical-badge {
    display:flex; align-items:center; gap:.4rem;
    background:#fef2f2; border:1px solid rgba(239,68,68,.2);
    border-radius:99px; padding:.35rem .875rem;
    font-size:.75rem; font-weight:700; color:#ef4444;
  }
  .critical-dot {
    width:7px; height:7px; border-radius:50%; background:#ef4444;
    animation:pulse 1.5s ease-in-out infinite;
  }

  .report-btn {
    display:inline-flex; align-items:center; gap:.375rem;
    background:#6a2c91; color:white;
    font-size:.8rem; font-weight:700;
    padding:.5rem 1.125rem; border-radius:99px;
    text-decoration:none; font-family:'DM Sans',sans-serif;
    box-shadow:0 2px 12px rgba(106,44,145,.25);
    transition:transform .2s, box-shadow .2s;
  }
  .report-btn:hover { transform:translateY(-1px); box-shadow:0 4px 18px rgba(106,44,145,.35); }

  /* ── FILTERS ──────────────────────────────────────────────────────────── */
  .filters-wrap {
    background:#ffffff;
    border-bottom:1px solid var(--mist);
    padding:.875rem 0;
    position:sticky; top:81px; z-index:9;
  }
  .filters-inner {
    max-width:800px; margin:0 auto; padding:0 1.5rem;
    display:flex; flex-direction:column; gap:.75rem;
  }

  /* top row: search + area */
  .search-box {
    display:flex; align-items:center; gap:.625rem;
    background:var(--fog); border:1.5px solid var(--mist);
    border-radius:.875rem; padding:.625rem .875rem;
    flex:1;
    transition:border-color .2s, box-shadow .2s;
  }
  .search-box:focus-within {
    border-color:var(--violet);
    box-shadow:0 0 0 3px rgba(106,44,145,.1);
  }
  .search-box svg { color:#94a3b8; flex-shrink:0; }
  .search-box input {
    flex:1; border:none; background:transparent;
    font-family:'DM Sans',sans-serif; font-size:.875rem; color:var(--ink);
    outline:none;
  }
  .search-box input::placeholder { color:#94a3b8; }
  .clear-btn {
    background:none; border:none; cursor:pointer;
    color:#94a3b8; font-size:.8rem; padding:.1rem .2rem;
    line-height:1; transition:color .2s;
  }
  .clear-btn:hover { color:var(--ink); }

  .select {
    background:var(--fog); border:1.5px solid var(--mist);
    border-radius:.875rem; padding:.625rem .875rem;
    font-family:'DM Sans',sans-serif; font-size:.875rem; color:var(--ink);
    cursor:pointer; outline:none;
    transition:border-color .2s;
  }
  .select:focus { border-color:var(--violet); }

  /* Category pills row */
  .cat-pills {
    display:flex; gap:.4rem; flex-wrap:wrap;
  }
  .cat-pill {
    background:transparent; border:1.5px solid var(--mist);
    border-radius:99px; padding:.3rem .75rem;
    font-family:'DM Sans',sans-serif; font-size:.75rem; font-weight:600;
    color:#64748b; cursor:pointer;
    transition:all .2s;
  }
  .cat-pill:hover { border-color:rgba(106,44,145,.3); color:var(--violet); }
  .cat-pill.active {
    background:var(--violet); border-color:var(--violet);
    color:white;
  }

  /* ── FEED ─────────────────────────────────────────────────────────────── */
  .feed-wrap { max-width:800px; margin:0 auto; padding:1.5rem; }
  .feed-inner {}

  .result-count {
    font-size:.75rem; font-weight:600; color:#94a3b8;
    letter-spacing:.05em; text-transform:uppercase;
    margin-bottom:1rem;
  }

  .feed { display:flex; flex-direction:column; gap:.75rem; }

  /* Card */
  .incident-card {
    background:#ffffff;
    border:1px solid var(--mist);
    border-radius:1.25rem;
    display:flex; overflow:hidden;
    cursor:pointer;
    transition:box-shadow .25s, border-color .25s, transform .2s;
    animation:slideIn .5s ease both;
  }
  .incident-card:hover {
    box-shadow:0 8px 28px rgba(106,44,145,.09);
    border-color:rgba(106,44,145,.2);
    transform:translateY(-1px);
  }
  .incident-card.is-expanded {
    border-color:rgba(106,44,145,.25);
    box-shadow:0 12px 36px rgba(106,44,145,.12);
  }

  .accent { width:4px; flex-shrink:0; }

  .card-body { flex:1; padding:1.125rem 1.25rem; }

  .card-top {
    display:flex; align-items:flex-start; justify-content:space-between;
    gap:.75rem; margin-bottom:.625rem;
  }
  .card-meta { display:flex; align-items:center; gap:.4rem; flex-wrap:wrap; }

  .sev-badge {
    display:inline-flex; align-items:center; gap:.3rem;
    border:1px solid; border-radius:99px;
    padding:.2rem .6rem; font-size:.7rem; font-weight:700;
    letter-spacing:.03em;
  }
  .sev-dot {
    width:6px; height:6px; border-radius:50%;
    animation:pulse 1.5s ease-in-out infinite;
  }

  .cat-label {
    font-size:.7rem; font-weight:600; color:#94a3b8;
    background:var(--fog); border:1px solid var(--mist);
    border-radius:99px; padding:.2rem .6rem;
  }

  .verified-badge {
    display:inline-flex; align-items:center; gap:.25rem;
    font-size:.7rem; font-weight:600; color:#22c55e;
    background:#f0fdf4; border:1px solid rgba(34,197,94,.2);
    border-radius:99px; padding:.2rem .6rem;
  }

  .time { font-size:.75rem; color:#94a3b8; white-space:nowrap; flex-shrink:0; }

  .card-title {
    font-family:var(--serif); font-size:1.0625rem;
    color:var(--ink); line-height:1.3; margin-bottom:.5rem;
  }

  .card-loc {
    display:flex; align-items:center; gap:.3rem;
    font-size:.8rem; color:#64748b; margin-bottom:.625rem;
  }
  .card-loc svg { color:#94a3b8; flex-shrink:0; }
  .area { color:var(--violet); font-weight:600; }

  .card-desc {
    font-size:.8375rem; color:#475569; line-height:1.65;
    padding:.75rem; background:var(--fog);
    border-radius:.75rem; margin-bottom:.75rem;
    border:1px solid var(--mist);
  }

  .card-footer {
    display:flex; align-items:center; justify-content:space-between;
  }
  .reports-count {
    display:flex; align-items:center; gap:.35rem;
    font-size:.75rem; color:#94a3b8;
  }
  .reports-count svg { color:#c4b5fd; }
  .expand-hint {
    font-size:.72rem; color:#c4b5fd; font-weight:600;
    letter-spacing:.02em;
  }

  /* ── EMPTY ─────────────────────────────────────────────────────────────── */
  .empty {
    text-align:center; padding:4rem 2rem;
    display:flex; flex-direction:column; align-items:center; gap:1rem;
  }
  .empty svg { color:#c4b5fd; }
  .empty p { color:#94a3b8; font-size:.9375rem; }
  .reset-btn {
    background:none; border:1.5px solid var(--mist);
    border-radius:99px; padding:.5rem 1.25rem;
    font-family:'DM Sans',sans-serif; font-size:.8125rem;
    font-weight:600; color:var(--violet); cursor:pointer;
    transition:all .2s;
  }
  .reset-btn:hover { border-color:var(--violet); background:rgba(106,44,145,.05); }

  /* ── RESPONSIVE ─────────────────────────────────────────────────────────── */
  @media (max-width:640px) {
    .page-header { padding:1.25rem 0 1rem; }
    .filters-wrap { top:72px; }
    .cat-pill { font-size:.7rem; padding:.25rem .625rem; }
    .card-title { font-size:.9375rem; }
  }
</style>
