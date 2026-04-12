<!-- src/routes/dashboard/AIPage.svelte -->
<!-- AI Hub: Safety Assistant chat (left) + Smart Alert Patterns (right) -->
<!-- Slots into dashboard via svelte:component — matches AlertsPage conventions -->

<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Bot, Send, Loader2, MapPin, RefreshCw,
    AlertTriangle, Shield, Zap, MessageSquare,
    Activity, TrendingUp, ShieldAlert, Info,
    ChevronDown, ChevronUp, Sparkles, Radio,
    X, Mic, CornerDownLeft
  } from 'lucide-svelte';

  // ── Types ──────────────────────────────────────────────────────────────────

  interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    timestamp: string;
  }

  interface Pattern {
    title: string;
    description: string;
    affected_area: string;
    incident_types: string[];
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
  }

  interface PatternResult {
    patterns: Pattern[];
    overall_risk: 'low' | 'medium' | 'high' | 'critical';
    summary: string;
    analysed_at: string;
  }

  // ── State ──────────────────────────────────────────────────────────────────

  let messages         = $state<ChatMessage[]>([]);
  let inputText        = $state('');
  let isChatLoading    = $state(false);
  let isPatternLoading = $state(false);
  let patternResult    = $state<PatternResult | null>(null);
  let patternError     = $state('');
  let chatError        = $state('');
  let nearbyCount      = $state(0);
  let userLat          = $state<number | null>(null);
  let userLng          = $state<number | null>(null);
  let locationError    = $state('');
  let expandedPattern  = $state<number | null>(null);
  let chatContainer: HTMLDivElement;
  let inputEl: HTMLTextAreaElement;

  // ── Suggested prompts ─────────────────────────────────────────────────────

  const suggestions = [
    'Is it safe to walk outside right now?',
    'What incidents happened near me today?',
    'How do I report a robbery?',
    'What should I do in a fire emergency?',
    'Give me safety tips for this area',
  ];

  // ── Severity config ───────────────────────────────────────────────────────

  const riskConfig = {
    low:      { color: '#10B981', bg: '#d1fae5', label: 'Low Risk'      },
    medium:   { color: '#F59E0B', bg: '#fef3c7', label: 'Moderate Risk' },
    high:     { color: '#F97316', bg: '#ffedd5', label: 'High Risk'     },
    critical: { color: '#EF4444', bg: '#fee2e2', label: 'Critical Risk' },
  };

  // ── Mount: get user location + load patterns ───────────────────────────────

  onMount(() => {
    // Greet the user
    messages = [{
      role:      'model',
      content:   'Hello! I\'m your Lezie Safety Assistant. I can help you understand safety risks near you, guide you through reporting incidents, and give you real-time advice. What would you like to know?',
      timestamp: new Date().toISOString(),
    }];

    getLocation();
  });

  function getLocation() {
    if (!navigator.geolocation) {
      locationError = 'Geolocation is not supported by your browser.';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat = pos.coords.latitude;
        userLng = pos.coords.longitude;
        locationError = '';
        // Auto-load patterns once we have location
        loadPatterns();
      },
      () => {
        locationError = 'Location access denied. Chat still works, but nearby context is unavailable.';
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  }

  // ── Chat ──────────────────────────────────────────────────────────────────

  async function sendMessage(text?: string) {
    const content = (text ?? inputText).trim();
    if (!content || isChatLoading) return;

    inputText = '';

    // Add user message
    messages = [...messages, {
      role:      'user',
      content,
      timestamp: new Date().toISOString(),
    }];

    chatError    = '';
    isChatLoading = true;

    // Scroll to bottom
    await scrollChat();

    try {
      const body: Record<string, unknown> = {
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      };

      if (userLat !== null && userLng !== null) {
        body.lat = userLat;
        body.lng = userLng;
      } else {
        // Fallback coords if location unavailable — send Lagos centre so
        // the endpoint doesn't reject, but context will be empty
        body.lat = 6.5244;
        body.lng = 3.3792;
      }

      const res = await fetch('/api/ai/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Server error ${res.status}`);
      }

      const data = await res.json();
      nearbyCount = data.nearby_incident_count ?? 0;

      messages = [...messages, {
        role:      'model',
        content:   data.reply,
        timestamp: new Date().toISOString(),
      }];

    } catch (err: unknown) {
      chatError = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
    } finally {
      isChatLoading = false;
      await scrollChat();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  async function scrollChat() {
    await new Promise(r => setTimeout(r, 50));
    chatContainer?.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
  }

  function clearChat() {
    messages = [{
      role:      'model',
      content:   'Chat cleared. How can I help you stay safe today?',
      timestamp: new Date().toISOString(),
    }];
    chatError = '';
  }

  // ── Pattern Detection ─────────────────────────────────────────────────────

  async function loadPatterns() {
    isPatternLoading = true;
    patternError     = '';

    try {
      const res = await fetch('/api/ai/alerts/analyse', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({}),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Server error ${res.status}`);
      }

      patternResult = await res.json();

    } catch (err: unknown) {
      patternError = err instanceof Error ? err.message : 'Could not load pattern analysis.';
    } finally {
      isPatternLoading = false;
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function formatTime(iso: string) {
    const d    = new Date(iso);
    const diff = Date.now() - d.getTime();
    const m    = Math.floor(diff / 60000);
    const h    = Math.floor(diff / 3600000);
    if (m < 1)  return 'Just now';
    if (h < 1)  return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return d.toLocaleDateString('en-NG', { dateStyle: 'short' });
  }

  function formatAnalysedAt(iso: string) {
    return new Date(iso).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
  }
</script>

<div class="ai-page">

  <!-- ── Header ──────────────────────────────────────────────────────────── -->
  <div class="page-header">
    <div class="header-left">
      <div class="header-icon">
        <Sparkles size={22} />
      </div>
      <div>
        <h1>AI Safety Hub</h1>
        <p>Smart assistant + neighbourhood pattern detection</p>
      </div>
    </div>
    <div class="header-right">
      {#if userLat !== null}
        <div class="location-pill">
          <MapPin size={12} />
          <span>Location active</span>
        </div>
      {:else if locationError}
        <button class="location-pill location-pill--warn" onclick={getLocation}>
          <MapPin size={12} />
          <span>Enable location</span>
        </button>
      {/if}
      {#if nearbyCount > 0}
        <div class="nearby-pill">
          <Radio size={12} />
          <span>{nearbyCount} nearby incident{nearbyCount !== 1 ? 's' : ''}</span>
        </div>
      {/if}
    </div>
  </div>

  <!-- ── Two-column layout ─────────────────────────────────────────────── -->
  <div class="ai-grid">

    <!-- LEFT: Chat ──────────────────────────────────────────────────────── -->
    <div class="chat-panel">
      <div class="panel-head">
        <div class="panel-title">
          <MessageSquare size={16} />
          <span>Safety Assistant</span>
        </div>
        <button class="icon-btn" onclick={clearChat} title="Clear chat">
          <X size={15} />
        </button>
      </div>

      <!-- Location warning -->
      {#if locationError}
        <div class="location-warn">
          <Info size={13} />
          <span>{locationError}</span>
          <button onclick={getLocation}>Retry</button>
        </div>
      {/if}

      <!-- Messages -->
      <div class="chat-messages" bind:this={chatContainer}>
        {#each messages as msg}
          <div class="message message--{msg.role}">
            {#if msg.role === 'model'}
              <div class="msg-avatar">
                <Bot size={14} />
              </div>
            {/if}
            <div class="msg-bubble">
              <p>{msg.content}</p>
              <span class="msg-time">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        {/each}

        {#if isChatLoading}
          <div class="message message--model">
            <div class="msg-avatar"><Bot size={14} /></div>
            <div class="msg-bubble msg-bubble--typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        {/if}

        {#if chatError}
          <div class="chat-error">
            <AlertTriangle size={13} />
            {chatError}
          </div>
        {/if}
      </div>

      <!-- Suggestions (shown only before user sends first message) -->
      {#if messages.length <= 1}
        <div class="suggestions">
          {#each suggestions as s}
            <button class="suggestion-chip" onclick={() => sendMessage(s)}>
              {s}
            </button>
          {/each}
        </div>
      {/if}

      <!-- Input -->
      <div class="chat-input-wrap">
        <textarea
          bind:this={inputEl}
          bind:value={inputText}
          onkeydown={handleKeydown}
          placeholder="Ask anything about safety near you…"
          rows="1"
          class="chat-input"
          disabled={isChatLoading}
        ></textarea>
        <button
          class="send-btn"
          onclick={() => sendMessage()}
          disabled={!inputText.trim() || isChatLoading}
          title="Send (Enter)"
        >
          {#if isChatLoading}
            <Loader2 size={16} class="spin" />
          {:else}
            <Send size={16} />
          {/if}
        </button>
      </div>
      <p class="input-hint">
        <CornerDownLeft size={10} /> Enter to send &nbsp;·&nbsp; Shift+Enter for new line
      </p>
    </div>

    <!-- RIGHT: Smart Alert Patterns ─────────────────────────────────────── -->
    <div class="patterns-panel">
      <div class="panel-head">
        <div class="panel-title">
          <Activity size={16} />
          <span>Pattern Detection</span>
        </div>
        <button
          class="icon-btn"
          onclick={loadPatterns}
          disabled={isPatternLoading}
          title="Refresh analysis"
        >
          <RefreshCw size={15} class={isPatternLoading ? 'spin' : ''} />
        </button>
      </div>

      {#if isPatternLoading}
        <div class="patterns-loading">
          <Loader2 size={28} class="spin" />
          <p>Analysing your alert zones…</p>
        </div>

      {:else if patternError}
        <div class="patterns-error">
          <AlertTriangle size={20} />
          <p>{patternError}</p>
          <button onclick={loadPatterns}>Try again</button>
        </div>

      {:else if patternResult}

        <!-- Overall risk badge -->
        <div
          class="overall-risk"
          style="background:{riskConfig[patternResult.overall_risk].bg};
                 border-color:{riskConfig[patternResult.overall_risk].color}40;"
        >
          <div class="risk-left">
            <ShieldAlert size={18} style="color:{riskConfig[patternResult.overall_risk].color}" />
            <div>
              <span class="risk-label" style="color:{riskConfig[patternResult.overall_risk].color}">
                {riskConfig[patternResult.overall_risk].label}
              </span>
              <p class="risk-summary">{patternResult.summary}</p>
            </div>
          </div>
        </div>

        <!-- Patterns list -->
        {#if patternResult.patterns.length === 0}
          <div class="no-patterns">
            <Shield size={32} />
            <p>No significant patterns detected in your alert zones.</p>
          </div>
        {:else}
          <div class="patterns-list">
            {#each patternResult.patterns as pattern, i}
              {@const cfg = riskConfig[pattern.risk_level]}
              <div class="pattern-card">
                <button
                  class="pattern-header"
                  onclick={() => expandedPattern = expandedPattern === i ? null : i}
                >
                  <div class="pattern-left">
                    <span
                      class="pattern-dot"
                      style="background:{cfg.color}"
                    ></span>
                    <div>
                      <span class="pattern-title">{pattern.title}</span>
                      <span class="pattern-area">
                        <MapPin size={10} /> {pattern.affected_area}
                      </span>
                    </div>
                  </div>
                  <div class="pattern-right">
                    <span class="risk-badge" style="background:{cfg.bg}; color:{cfg.color};">
                      {pattern.risk_level}
                    </span>
                    {#if expandedPattern === i}
                      <ChevronUp size={14} />
                    {:else}
                      <ChevronDown size={14} />
                    {/if}
                  </div>
                </button>

                {#if expandedPattern === i}
                  <div class="pattern-body">
                    <p class="pattern-desc">{pattern.description}</p>

                    <div class="pattern-types">
                      {#each pattern.incident_types as type}
                        <span class="type-chip">{type}</span>
                      {/each}
                    </div>

                    <div class="pattern-rec">
                      <Zap size={12} />
                      <p>{pattern.recommendation}</p>
                    </div>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}

        <p class="analysed-at">
          <TrendingUp size={10} />
          Analysed {formatAnalysedAt(patternResult.analysed_at)}
        </p>

      {:else}
        <!-- No zones / not yet loaded -->
        <div class="no-patterns">
          <Shield size={32} />
          <p>Create alert zones to enable pattern detection.</p>
          <button class="refresh-btn" onclick={loadPatterns}>
            <RefreshCw size={14} /> Run Analysis
          </button>
        </div>
      {/if}
    </div>

  </div>
</div>

<style>
  .ai-page {
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  /* ── Header ────────────────────────────────────────────────────────────── */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 1.5rem;
    padding: 1rem 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0,0,0,.04);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .header-left h1 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: .125rem;
  }

  .header-left p {
    font-size: .75rem;
    color: #64748b;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  .location-pill {
    display: flex;
    align-items: center;
    gap: .375rem;
    font-size: .688rem;
    font-weight: 500;
    padding: .375rem .75rem;
    background: #d1fae5;
    color: #065f46;
    border-radius: 9999px;
    border: none;
    cursor: default;
  }

  .location-pill--warn {
    background: #fef3c7;
    color: #92400e;
    cursor: pointer;
  }

  .nearby-pill {
    display: flex;
    align-items: center;
    gap: .375rem;
    font-size: .688rem;
    font-weight: 500;
    padding: .375rem .75rem;
    background: var(--primary-bg, #f5f3ff);
    color: var(--primary-color, #6a2c91);
    border-radius: 9999px;
  }

  /* ── Two-col grid ───────────────────────────────────────────────────────── */
  .ai-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 1.25rem;
    align-items: start;
  }

  @media (max-width: 1024px) {
    .ai-grid { grid-template-columns: 1fr; }
  }

  /* ── Shared panel shell ─────────────────────────────────────────────────── */
  .chat-panel,
  .patterns-panel {
    background: white;
    border-radius: 1.25rem;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .panel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .875rem 1rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: .5rem;
    font-size: .875rem;
    font-weight: 700;
    color: #0f172a;
  }

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: .375rem;
    color: #94a3b8;
    border-radius: .5rem;
    display: flex;
    transition: all .2s;
  }

  .icon-btn:hover:not(:disabled) {
    background: var(--primary-bg, #f5f3ff);
    color: var(--primary-color, #6a2c91);
  }

  .icon-btn:disabled { opacity: .5; cursor: not-allowed; }

  /* ── Location warning bar ───────────────────────────────────────────────── */
  .location-warn {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .5rem 1rem;
    background: #fefce8;
    border-bottom: 1px solid #fde68a;
    font-size: .688rem;
    color: #92400e;
  }

  .location-warn button {
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

  /* ── Chat messages ──────────────────────────────────────────────────────── */
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: .875rem;
    min-height: 380px;
    max-height: 480px;
  }

  .message {
    display: flex;
    gap: .5rem;
    align-items: flex-end;
  }

  .message--user {
    flex-direction: row-reverse;
  }

  .msg-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--primary-bg, #f5f3ff);
    border: 1.5px solid var(--primary-border, #ddd6fe);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color, #6a2c91);
    flex-shrink: 0;
  }

  .msg-bubble {
    max-width: 78%;
    padding: .625rem .875rem;
    border-radius: 1rem;
    font-size: .8125rem;
    line-height: 1.55;
    position: relative;
  }

  .message--model .msg-bubble {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-bottom-left-radius: .25rem;
    color: #1e293b;
  }

  .message--user .msg-bubble {
    background: var(--primary-color, #6a2c91);
    color: white;
    border-bottom-right-radius: .25rem;
  }

  .msg-time {
    display: block;
    font-size: .563rem;
    margin-top: .25rem;
    opacity: .6;
  }

  /* Typing indicator */
  .msg-bubble--typing {
    display: flex;
    align-items: center;
    gap: .25rem;
    padding: .625rem .875rem;
  }

  .msg-bubble--typing span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #94a3b8;
    animation: bounce .9s infinite;
  }

  .msg-bubble--typing span:nth-child(2) { animation-delay: .15s; }
  .msg-bubble--typing span:nth-child(3) { animation-delay: .3s; }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30%            { transform: translateY(-5px); }
  }

  .chat-error {
    display: flex;
    align-items: center;
    gap: .5rem;
    font-size: .75rem;
    color: #dc2626;
    background: #fee2e2;
    border-radius: .625rem;
    padding: .5rem .75rem;
  }

  /* ── Suggestions ────────────────────────────────────────────────────────── */
  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: .375rem;
    padding: .625rem 1rem;
    border-top: 1px solid #f1f5f9;
  }

  .suggestion-chip {
    background: var(--primary-bg, #f5f3ff);
    border: 1px solid var(--primary-border, #ddd6fe);
    color: var(--primary-color, #6a2c91);
    border-radius: 9999px;
    padding: .3rem .75rem;
    font-size: .688rem;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: all .15s;
  }

  .suggestion-chip:hover {
    background: var(--primary-color, #6a2c91);
    color: white;
    border-color: var(--primary-color, #6a2c91);
  }

  /* ── Chat input ─────────────────────────────────────────────────────────── */
  .chat-input-wrap {
    display: flex;
    align-items: flex-end;
    gap: .5rem;
    padding: .75rem 1rem;
    border-top: 1px solid #f1f5f9;
  }

  .chat-input {
    flex: 1;
    padding: .625rem .875rem;
    border: 1.5px solid #e2e8f0;
    border-radius: .875rem;
    font-size: .8125rem;
    font-family: 'DM Sans', sans-serif;
    resize: none;
    line-height: 1.5;
    transition: border-color .2s;
    max-height: 120px;
    overflow-y: auto;
  }

  .chat-input:focus {
    outline: none;
    border-color: var(--primary-color, #6a2c91);
    box-shadow: 0 0 0 3px rgba(106,44,145,.08);
  }

  .chat-input:disabled { background: #f8fafc; color: #94a3b8; }

  .send-btn {
    width: 38px;
    height: 38px;
    border-radius: .75rem;
    background: var(--primary-color, #6a2c91);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all .2s;
  }

  .send-btn:hover:not(:disabled) {
    background: var(--primary-dark, #4b1d68);
    transform: translateY(-1px);
  }

  .send-btn:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; }

  .input-hint {
    display: flex;
    align-items: center;
    gap: .25rem;
    font-size: .563rem;
    color: #94a3b8;
    padding: 0 1rem .625rem;
  }

  /* ── Patterns panel ─────────────────────────────────────────────────────── */
  .patterns-loading,
  .patterns-error,
  .no-patterns {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2.5rem 1.5rem;
    gap: .75rem;
    color: #64748b;
    font-size: .8125rem;
  }

  .patterns-error { color: #dc2626; }

  .patterns-error button,
  .no-patterns button,
  .refresh-btn {
    display: flex;
    align-items: center;
    gap: .375rem;
    padding: .5rem 1rem;
    background: var(--primary-color, #6a2c91);
    color: white;
    border: none;
    border-radius: .625rem;
    font-size: .75rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all .2s;
  }

  .patterns-error button { background: #dc2626; }

  /* Overall risk */
  .overall-risk {
    margin: 1rem;
    padding: .875rem;
    border-radius: .875rem;
    border: 1px solid;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: .75rem;
  }

  .risk-left {
    display: flex;
    align-items: flex-start;
    gap: .625rem;
  }

  .risk-label {
    display: block;
    font-size: .75rem;
    font-weight: 700;
    margin-bottom: .25rem;
  }

  .risk-summary {
    font-size: .75rem;
    color: #475569;
    line-height: 1.5;
  }

  /* Patterns list */
  .patterns-list {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: 0 1rem 1rem;
  }

  .pattern-card {
    border: 1px solid #e2e8f0;
    border-radius: .875rem;
    overflow: hidden;
  }

  .pattern-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .75rem;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    gap: .5rem;
    transition: background .15s;
  }

  .pattern-header:hover { background: #f8fafc; }

  .pattern-left {
    display: flex;
    align-items: center;
    gap: .625rem;
    text-align: left;
    flex: 1;
    min-width: 0;
  }

  .pattern-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .pattern-title {
    display: block;
    font-size: .8125rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: .125rem;
  }

  .pattern-area {
    display: flex;
    align-items: center;
    gap: .2rem;
    font-size: .625rem;
    color: #64748b;
  }

  .pattern-right {
    display: flex;
    align-items: center;
    gap: .375rem;
    flex-shrink: 0;
    color: #64748b;
  }

  .risk-badge {
    font-size: .563rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: .2rem .5rem;
    border-radius: .375rem;
  }

  .pattern-body {
    padding: .75rem;
    border-top: 1px solid #f1f5f9;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    gap: .625rem;
  }

  .pattern-desc {
    font-size: .75rem;
    color: #475569;
    line-height: 1.55;
  }

  .pattern-types {
    display: flex;
    flex-wrap: wrap;
    gap: .3rem;
  }

  .type-chip {
    font-size: .563rem;
    font-weight: 500;
    padding: .2rem .5rem;
    background: var(--primary-bg, #f5f3ff);
    color: var(--primary-color, #6a2c91);
    border-radius: .375rem;
    text-transform: capitalize;
  }

  .pattern-rec {
    display: flex;
    align-items: flex-start;
    gap: .375rem;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: .625rem;
    padding: .5rem .625rem;
    font-size: .75rem;
    color: #78350f;
    line-height: 1.5;
  }

  .pattern-rec p { flex: 1; }

  .analysed-at {
    display: flex;
    align-items: center;
    gap: .25rem;
    font-size: .563rem;
    color: #94a3b8;
    padding: .5rem 1rem .875rem;
  }

  /* ── Shared spin ────────────────────────────────────────────────────────── */
  :global(.spin) { animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Mobile ─────────────────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: .875rem;
      align-items: flex-start;
    }

    .header-right { flex-wrap: wrap; }

    .chat-messages { min-height: 300px; max-height: 360px; }
  }
</style>