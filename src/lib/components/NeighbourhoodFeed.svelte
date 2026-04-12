<!-- src/lib/components/NeighbourhoodFeed.svelte -->
<!-- Neighbourhood feed showing nearby incidents/posts within 2km.        -->
<!-- Includes AI summarise button that calls /api/ai/summarise-feed.      -->

<script lang="ts">
  import { onMount } from 'svelte';

  import {
    MapPin, Clock, AlertTriangle, Shield, Users,
    Flame, Car, Building, Volume2, AlertOctagon,
    MoreHorizontal, ThumbsUp, MessageSquare, Share2,
    Sparkles, Loader2, RefreshCw, Radio, ChevronDown,
    ChevronUp, TrendingUp, Zap, Eye, Filter
  } from 'lucide-svelte';
import { haversineKm } from '$lib/server/db/geo';

  // ── Types ──────────────────────────────────────────────────────────────────

  interface FeedItem {
    id: string;
    type: 'incident' | 'post' | 'alert';
    title: string;
    body?: string;
    category?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    location?: string;
    distance_km?: number;
    reported_at: string;
    author?: string;
    isAnonymous?: boolean;
    reactions?: number;
    comments?: number;
  }

  interface AISummary {
    headline: string;
    summary: string;
    safety_tip: string;
    mood: 'calm' | 'watchful' | 'tense' | 'urgent';
    item_count: number;
    generated_at: string;
  }

  // ── Props ──────────────────────────────────────────────────────────────────

  interface Props {
    neighbourhood?: string;   // e.g. "Surulere, Lagos"
    lat?: number | null;
    lng?: number | null;
  }

  let {
    neighbourhood = '',
    lat = null,
    lng = null,
  }: Props = $props();

  // ── State ──────────────────────────────────────────────────────────────────

  let feedItems        = $state<FeedItem[]>([]);
  let isLoadingFeed    = $state(true);
  let activeFilter     = $state<'all' | 'incident' | 'post' | 'alert'>('all');
  let aiSummary        = $state<AISummary | null>(null);
  let isSummarising    = $state(false);
  let summaryError     = $state('');
  let summaryExpanded  = $state(true);
  let showSummary      = $state(false);

  // ── Mood config ────────────────────────────────────────────────────────────

  const moodConfig = {
    calm:     { color: '#10B981', bg: '#d1fae5', border: '#6ee7b7', label: 'Calm',     icon: Shield  },
    watchful: { color: '#F59E0B', bg: '#fef3c7', border: '#fcd34d', label: 'Watchful', icon: Eye     },
    tense:    { color: '#F97316', bg: '#ffedd5', border: '#fdba74', label: 'Tense',    icon: AlertTriangle },
    urgent:   { color: '#EF4444', bg: '#fee2e2', border: '#fca5a5', label: 'Urgent',   icon: Zap     },
  };

  // ── Category config ────────────────────────────────────────────────────────

  const categoryConfig: Record<string, { color: string; bg: string; icon: any }> = {
    suspicious: { color: '#F59E0B', bg: '#fef3c7', icon: AlertTriangle },
    theft:      { color: '#EF4444', bg: '#fee2e2', icon: AlertOctagon  },
    vandalism:  { color: '#F97316', bg: '#ffedd5', icon: Building      },
    fire:       { color: '#DC2626', bg: '#fee2e2', icon: Flame         },
    accident:   { color: '#F59E0B', bg: '#fef3c7', icon: Car           },
    noise:      { color: '#8B5CF6', bg: '#ede9fe', icon: Volume2       },
    other:      { color: '#6B7280', bg: '#f3f4f6', icon: MoreHorizontal},
  };

  const severityColors = {
    low:      '#10B981',
    medium:   '#F59E0B',
    high:     '#F97316',
    critical: '#EF4444',
  };

  // ── Derived: filtered items ────────────────────────────────────────────────

  const displayItems = $derived(
    activeFilter === 'all'
      ? feedItems
      : feedItems.filter(i => i.type === activeFilter)
  );

  // ── Mount: load feed ───────────────────────────────────────────────────────

  onMount(async () => {
    await loadFeed();
  });

  async function loadFeed() {
  isLoadingFeed = true;

  const params = new URLSearchParams();
  if (lat)           params.set('lat',           String(lat));
  if (lng)           params.set('lng',           String(lng));
  if (neighbourhood) params.set('neighbourhood', neighbourhood);

  const res = await fetch(`/api/reports/map?${params}&dateRange=day`);
  if (res.ok) {
    const raw = await res.json();
    // Map map-API shape to FeedItem shape
    feedItems = raw.map((r: any) => ({
      id:          r.id,
      type:        'incident' as const,
      title:       r.title,
      body:        r.description,
      category:    r.category,
      severity:    r.severity,
      location:    r.location,
      distance_km: (lat && lng)
        ? haversineKm(lat, lng, r.lat, r.lng)
        : undefined,
      reported_at: r.time,
    }))
    // Enforce 2km radius on client side as final guard
    .filter((item: any) =>
      item.distance_km === undefined || item.distance_km <= 2
    )
    .sort((a: any, b: any) =>
      (a.distance_km ?? 99) - (b.distance_km ?? 99)
    );
  }

  isLoadingFeed = false;
}
        

  // ── AI Summarise ──────────────────────────────────────────────────────────

  async function summariseFeed() {
    if (isSummarising || feedItems.length === 0) return;

    isSummarising = true;
    summaryError  = '';
    showSummary   = true;

    try {
      const res = await fetch('/api/ai/summarise-feed', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          neighbourhood: neighbourhood || undefined,
          items: feedItems.map(item => ({
            id:          item.id,
            type:        item.type,
            title:       item.title,
            body:        item.body,
            category:    item.category,
            severity:    item.severity,
            location:    item.location,
            distance_km: item.distance_km,
            reported_at: item.reported_at,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Server error ${res.status}`);
      }

      aiSummary       = await res.json();
      summaryExpanded = true;

    } catch (err: unknown) {
      summaryError = err instanceof Error ? err.message : 'Summary unavailable. Please try again.';
    } finally {
      isSummarising = false;
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function formatTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m    = Math.floor(diff / 60000);
    const h    = Math.floor(diff / 3600000);
    const d    = Math.floor(diff / 86400000);
    if (m < 1)  return 'Just now';
    if (h < 1)  return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  }

  function formatDistance(km?: number) {
    if (km === undefined) return '';
    return km < 1 ? `${Math.round(km * 1000)}m away` : `${km.toFixed(1)}km away`;
  }

  function getCatConfig(category?: string) {
    return categoryConfig[category ?? 'other'] ?? categoryConfig.other;
  }
</script>

<div class="nf-wrap">

  <!-- ── Header ──────────────────────────────────────────────────────────── -->
  <div class="nf-header">
    <div class="nf-header-left">
      <div class="nf-header-icon">
        <Radio size={18} />
      </div>
      <div>
        <h2>Neighbourhood Feed</h2>
        {#if neighbourhood}
          <p class="nf-location"><MapPin size={11} /> {neighbourhood}</p>
        {:else}
          <p class="nf-location"><MapPin size={11} /> Within 2km of you</p>
        {/if}
      </div>
    </div>

    <div class="nf-header-right">
      <!-- Summarise button -->
      <button
        class="nf-summarise-btn {isSummarising ? 'nf-summarise-btn--loading' : ''}"
        onclick={summariseFeed}
        disabled={isSummarising || isLoadingFeed || feedItems.length === 0}
        title="AI summary of this feed"
      >
        {#if isSummarising}
          <Loader2 size={14} class="nf-spin" />
          <span>Analysing…</span>
        {:else}
          <Sparkles size={14} />
          <span>AI Summary</span>
        {/if}
      </button>

      <!-- Refresh -->
      <button
        class="nf-icon-btn"
        onclick={loadFeed}
        disabled={isLoadingFeed}
        title="Refresh feed"
      >
        <RefreshCw size={15} class={isLoadingFeed ? 'nf-spin' : ''} />
      </button>
    </div>
  </div>

  <!-- ── AI Summary Panel ───────────────────────────────────────────────── -->
  {#if showSummary}
    <div class="nf-summary-wrap">
      {#if isSummarising}
        <div class="nf-summary-loading">
          <Loader2 size={18} class="nf-spin" />
          <span>Generating AI summary of your neighbourhood feed…</span>
        </div>

      {:else if summaryError}
        <div class="nf-summary-error">
          <AlertTriangle size={14} />
          <span>{summaryError}</span>
          <button onclick={summariseFeed}>Retry</button>
        </div>

      {:else if aiSummary}
        {@const mood = moodConfig[aiSummary.mood]}
        {@const MoodIcon = mood.icon}

        <div
          class="nf-summary-card"
          style="border-color:{mood.border}; background:linear-gradient(135deg,{mood.bg} 0%,white 100%);"
        >
          <!-- Summary header -->
          <div class="nf-summary-head">
            <div class="nf-summary-title">
              <span class="nf-mood-chip" style="background:{mood.bg}; color:{mood.color}; border-color:{mood.border};">
                <MoodIcon size={11} />
                {mood.label}
              </span>
              <span class="nf-summary-label">
                <Sparkles size={12} />
                AI Summary · {aiSummary.item_count} items
              </span>
            </div>
            <button
              class="nf-icon-btn"
              onclick={() => summaryExpanded = !summaryExpanded}
              title={summaryExpanded ? 'Collapse' : 'Expand'}
            >
              {#if summaryExpanded}
                <ChevronUp size={14} />
              {:else}
                <ChevronDown size={14} />
              {/if}
            </button>
          </div>

          {#if summaryExpanded}
            <!-- Headline -->
            <p class="nf-summary-headline">{aiSummary.headline}</p>

            <!-- Body -->
            <p class="nf-summary-body">{aiSummary.summary}</p>

            <!-- Safety tip -->
            <div class="nf-summary-tip" style="border-color:{mood.border};">
              <Zap size={12} style="color:{mood.color}; flex-shrink:0;" />
              <p>{aiSummary.safety_tip}</p>
            </div>

            <p class="nf-summary-time">
              <TrendingUp size={10} />
              Generated {formatTime(aiSummary.generated_at)}
              · <button class="nf-regen-btn" onclick={summariseFeed}>Regenerate</button>
            </p>
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  <!-- ── Filter tabs ────────────────────────────────────────────────────── -->
  <div class="nf-filters">
    {#each ([
      { value: 'all',      label: 'All'       },
      { value: 'incident', label: 'Incidents' },
      { value: 'alert',    label: 'Alerts'    },
      { value: 'post',     label: 'Posts'     },
    ] as const) as f}
      <button
        class="nf-filter-btn {activeFilter === f.value ? 'nf-filter-btn--active' : ''}"
        onclick={() => activeFilter = f.value}
      >
        {f.label}
        <span class="nf-filter-count">
          {f.value === 'all' ? feedItems.length : feedItems.filter(i => i.type === f.value).length}
        </span>
      </button>
    {/each}
  </div>

  <!-- ── Feed items ─────────────────────────────────────────────────────── -->
  {#if isLoadingFeed}
    <div class="nf-loading">
      <Loader2 size={24} class="nf-spin" />
      <p>Loading nearby feed…</p>
    </div>

  {:else if displayItems.length === 0}
    <div class="nf-empty">
      <Users size={36} />
      <p>No {activeFilter === 'all' ? '' : activeFilter + ' '}activity nearby.</p>
    </div>

  {:else}
    <div class="nf-list">
      {#each displayItems as item}
        {@const cat = getCatConfig(item.category)}
        {@const CatIcon = cat.icon}

        <div class="nf-item nf-item--{item.type}">

          <!-- Item header -->
          <div class="nf-item-head">
            <div class="nf-item-icon" style="background:{cat.bg}; color:{cat.color};">
              <CatIcon size={14} />
            </div>
            <div class="nf-item-meta">
              <div class="nf-item-meta-top">
                <span class="nf-type-chip nf-type-chip--{item.type}">{item.type}</span>
                {#if item.severity}
                  <span
                    class="nf-sev-chip"
                    style="color:{severityColors[item.severity]};
                           background:{severityColors[item.severity]}18;"
                  >
                    {item.severity}
                  </span>
                {/if}
              </div>
              <div class="nf-item-meta-bottom">
                {#if item.location}
                  <span><MapPin size={10} /> {item.location}</span>
                {/if}
                {#if item.distance_km !== undefined}
                  <span class="nf-distance">· {formatDistance(item.distance_km)}</span>
                {/if}
                <span><Clock size={10} /> {formatTime(item.reported_at)}</span>
              </div>
            </div>
          </div>

          <!-- Title + body -->
          <h4 class="nf-item-title">{item.title}</h4>
          {#if item.body}
            <p class="nf-item-body">{item.body}</p>
          {/if}

          <!-- Footer -->
          <div class="nf-item-foot">
            <span class="nf-author">
              {item.isAnonymous ? 'Anonymous' : (item.author ?? 'Community member')}
            </span>
            <div class="nf-item-actions">
              {#if item.reactions !== undefined}
                <button class="nf-action-btn">
                  <ThumbsUp size={12} /> {item.reactions}
                </button>
              {/if}
              {#if item.comments !== undefined}
                <button class="nf-action-btn">
                  <MessageSquare size={12} /> {item.comments}
                </button>
              {/if}
              <button class="nf-action-btn">
                <Share2 size={12} />
              </button>
            </div>
          </div>

        </div>
      {/each}
    </div>
  {/if}

</div>

<style>
  .nf-wrap {
    font-family: 'DM Sans', system-ui, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* ── Header ────────────────────────────────────────────────────────────── */
  .nf-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 1.25rem;
    padding: 1rem 1.25rem;
    border: 1px solid #e2e8f0;
  }

  .nf-header-left {
    display: flex;
    align-items: center;
    gap: .75rem;
  }

  .nf-header-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--primary-color, #6a2c91), var(--primary-dark, #4b1d68));
    border-radius: .875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .nf-header-left h2 {
    font-size: .9375rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: .125rem;
  }

  .nf-location {
    display: flex;
    align-items: center;
    gap: .25rem;
    font-size: .688rem;
    color: #64748b;
  }

  .nf-header-right {
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  /* ── Summarise button ───────────────────────────────────────────────────── */
  .nf-summarise-btn {
    display: flex;
    align-items: center;
    gap: .375rem;
    padding: .5rem 1rem;
    background: linear-gradient(135deg, var(--primary-color, #6a2c91), var(--primary-dark, #4b1d68));
    color: white;
    border: none;
    border-radius: .75rem;
    font-size: .75rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all .2s;
    white-space: nowrap;
  }

  .nf-summarise-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(106,44,145,.3);
  }

  .nf-summarise-btn:disabled {
    opacity: .6;
    cursor: not-allowed;
    transform: none;
  }

  .nf-summarise-btn--loading {
    background: #94a3b8;
  }

  /* ── Icon button ────────────────────────────────────────────────────────── */
  .nf-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: .375rem;
    color: #94a3b8;
    border-radius: .5rem;
    display: flex;
    transition: all .2s;
    font-family: inherit;
  }

  .nf-icon-btn:hover:not(:disabled) {
    background: var(--primary-bg, #f5f3ff);
    color: var(--primary-color, #6a2c91);
  }

  .nf-icon-btn:disabled { opacity: .5; cursor: not-allowed; }

  /* ── Summary panel ──────────────────────────────────────────────────────── */
  .nf-summary-wrap {
    animation: fadeIn .3s ease;
  }

  .nf-summary-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .75rem;
    padding: 1.25rem;
    background: white;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    font-size: .8125rem;
    color: var(--primary-color, #6a2c91);
  }

  .nf-summary-error {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .75rem 1rem;
    background: #fef3c7;
    border: 1px solid #fde68a;
    border-radius: .875rem;
    font-size: .75rem;
    color: #92400e;
  }

  .nf-summary-error button {
    margin-left: auto;
    background: none;
    border: 1px solid #f59e0b;
    color: #b45309;
    border-radius: .375rem;
    padding: .125rem .5rem;
    font-size: .625rem;
    cursor: pointer;
    font-family: inherit;
  }

  .nf-summary-card {
    border-radius: 1.25rem;
    border: 1px solid;
    padding: 1rem 1.25rem;
    animation: fadeIn .3s ease;
  }

  .nf-summary-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .75rem;
  }

  .nf-summary-title {
    display: flex;
    align-items: center;
    gap: .5rem;
    flex-wrap: wrap;
  }

  .nf-mood-chip {
    display: flex;
    align-items: center;
    gap: .25rem;
    font-size: .625rem;
    font-weight: 700;
    padding: .25rem .625rem;
    border-radius: 9999px;
    border: 1px solid;
    text-transform: uppercase;
    letter-spacing: .04em;
  }

  .nf-summary-label {
    display: flex;
    align-items: center;
    gap: .25rem;
    font-size: .688rem;
    color: #64748b;
  }

  .nf-summary-headline {
    font-size: .9375rem;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.45;
    margin-bottom: .625rem;
  }

  .nf-summary-body {
    font-size: .8125rem;
    color: #334155;
    line-height: 1.6;
    margin-bottom: .875rem;
  }

  .nf-summary-tip {
    display: flex;
    align-items: flex-start;
    gap: .5rem;
    padding: .625rem .75rem;
    background: white;
    border-radius: .75rem;
    border: 1px solid;
    margin-bottom: .625rem;
  }

  .nf-summary-tip p {
    font-size: .75rem;
    color: #475569;
    line-height: 1.5;
    margin: 0;
    flex: 1;
  }

  .nf-summary-time {
    display: flex;
    align-items: center;
    gap: .25rem;
    font-size: .563rem;
    color: #94a3b8;
  }

  .nf-regen-btn {
    background: none;
    border: none;
    color: var(--primary-color, #6a2c91);
    font-size: .563rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    padding: 0;
    text-decoration: underline;
  }

  /* ── Filters ────────────────────────────────────────────────────────────── */
  .nf-filters {
    display: flex;
    gap: .375rem;
    background: white;
    padding: .25rem;
    border-radius: .875rem;
    border: 1px solid #e2e8f0;
    width: fit-content;
  }

  .nf-filter-btn {
    display: flex;
    align-items: center;
    gap: .375rem;
    padding: .375rem .75rem;
    background: none;
    border: none;
    border-radius: .625rem;
    font-size: .75rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    font-family: inherit;
    transition: all .2s;
  }

  .nf-filter-btn--active {
    background: var(--primary-color, #6a2c91);
    color: white;
  }

  .nf-filter-count {
    font-size: .563rem;
    background: rgba(0,0,0,.1);
    padding: .1rem .375rem;
    border-radius: .375rem;
  }

  .nf-filter-btn--active .nf-filter-count {
    background: rgba(255,255,255,.2);
  }

  /* ── Loading / empty ────────────────────────────────────────────────────── */
  .nf-loading,
  .nf-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: .75rem;
    padding: 3rem;
    background: white;
    border-radius: 1.25rem;
    border: 1px solid #e2e8f0;
    color: #94a3b8;
    font-size: .8125rem;
    text-align: center;
  }

  /* ── Feed list ──────────────────────────────────────────────────────────── */
  .nf-list {
    display: flex;
    flex-direction: column;
    gap: .75rem;
  }

  /* ── Feed item ──────────────────────────────────────────────────────────── */
  .nf-item {
    background: white;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    padding: 1rem;
    transition: all .2s;
  }

  .nf-item:hover {
    border-color: var(--primary-border, #ddd6fe);
    box-shadow: 0 4px 12px rgba(0,0,0,.06);
  }

  .nf-item--alert {
    border-left: 3px solid #F59E0B;
  }

  .nf-item--incident {
    border-left: 3px solid #EF4444;
  }

  .nf-item--post {
    border-left: 3px solid var(--primary-color, #6a2c91);
  }

  .nf-item-head {
    display: flex;
    align-items: flex-start;
    gap: .625rem;
    margin-bottom: .625rem;
  }

  .nf-item-icon {
    width: 32px;
    height: 32px;
    border-radius: .625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .nf-item-meta { flex: 1; min-width: 0; }

  .nf-item-meta-top {
    display: flex;
    align-items: center;
    gap: .375rem;
    margin-bottom: .25rem;
    flex-wrap: wrap;
  }

  .nf-type-chip {
    font-size: .563rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .05em;
    padding: .15rem .5rem;
    border-radius: .375rem;
  }

  .nf-type-chip--incident { background: #fee2e2; color: #dc2626; }
  .nf-type-chip--alert    { background: #fef3c7; color: #d97706; }
  .nf-type-chip--post     { background: var(--primary-bg, #f5f3ff); color: var(--primary-color, #6a2c91); }

  .nf-sev-chip {
    font-size: .563rem;
    font-weight: 600;
    padding: .15rem .5rem;
    border-radius: .375rem;
    text-transform: capitalize;
  }

  .nf-item-meta-bottom {
    display: flex;
    align-items: center;
    gap: .5rem;
    flex-wrap: wrap;
    font-size: .625rem;
    color: #64748b;
  }

  .nf-item-meta-bottom span {
    display: flex;
    align-items: center;
    gap: .2rem;
  }

  .nf-distance { color: var(--primary-color, #6a2c91); font-weight: 500; }

  .nf-item-title {
    font-size: .875rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: .375rem;
    line-height: 1.4;
  }

  .nf-item-body {
    font-size: .75rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: .75rem;
  }

  .nf-item-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: .625rem;
    border-top: 1px solid #f1f5f9;
  }

  .nf-author {
    font-size: .625rem;
    color: #94a3b8;
    font-style: italic;
  }

  .nf-item-actions {
    display: flex;
    align-items: center;
    gap: .25rem;
  }

  .nf-action-btn {
    display: flex;
    align-items: center;
    gap: .25rem;
    background: none;
    border: none;
    font-size: .625rem;
    color: #94a3b8;
    cursor: pointer;
    padding: .25rem .5rem;
    border-radius: .5rem;
    font-family: inherit;
    transition: all .15s;
  }

  .nf-action-btn:hover {
    background: var(--primary-bg, #f5f3ff);
    color: var(--primary-color, #6a2c91);
  }

  /* ── Animations ─────────────────────────────────────────────────────────── */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  :global(.nf-spin) { animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ─────────────────────────────────────────────────────────── */
  @media (max-width: 640px) {
    .nf-header { flex-direction: column; gap: .875rem; align-items: flex-start; }
    .nf-header-right { width: 100%; justify-content: flex-end; }
    .nf-filters { width: 100%; overflow-x: auto; }
  }
</style>