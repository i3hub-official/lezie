<script lang="ts">
  import { onMount } from 'svelte';
  import { Cookie, Shield, BarChart2, Target, X, ChevronDown, Check } from 'lucide-svelte';

  let visible      = $state(false);
  let showDetails  = $state(false);
  let saving       = $state(false);

  let prefs = $state({
    necessary:  true,   // always on
    analytics:  false,
    functional: false,
    marketing:  false,
  });

  const STORAGE_KEY = 'lezie_cookie_consent';

  onMount(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setTimeout(() => { visible = true; }, 600);
    }
  });

  function save(choice: 'all' | 'necessary' | 'custom') {
    saving = true;
    if (choice === 'all') {
      prefs = { necessary: true, analytics: true, functional: true, marketing: true };
    } else if (choice === 'necessary') {
      prefs = { necessary: true, analytics: false, functional: false, marketing: false };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, prefs, ts: Date.now() }));
    setTimeout(() => {
      saving = false;
      visible = false;
    }, 400);
  }

  const cookieTypes = [
    {
      key:   'necessary',
      icon:  Shield,
      label: 'Necessary',
      desc:  'Core functionality — authentication, security, and session management. Cannot be disabled.',
      locked: true,
    },
    {
      key:   'analytics',
      icon:  BarChart2,
      label: 'Analytics',
      desc:  'Helps us understand how people use Lezie so we can improve the experience for everyone.',
      locked: false,
    },
    {
      key:   'functional',
      icon:  Cookie,
      label: 'Functional',
      desc:  'Remembers your preferences like language, location defaults, and map settings.',
      locked: false,
    },
    {
      key:   'marketing',
      icon:  Target,
      label: 'Marketing',
      desc:  'Used to deliver relevant community safety updates and product announcements.',
      locked: false,
    },
  ] as const;
</script>

{#if visible}
  <!-- Backdrop (details open on mobile) -->
  {#if showDetails}
    <div class="ck-backdrop" onclick={() => showDetails = false}></div>
  {/if}

  <div class="ck-bar {showDetails ? 'ck-bar--expanded' : ''}" role="dialog" aria-label="Cookie preferences">

    <!-- Compact row -->
    <div class="ck-compact">
      <div class="ck-compact-left">
        <span class="ck-icon-wrap"><Cookie size={18} /></span>
        <div class="ck-compact-text">
          <strong>We use cookies</strong>
          <span>To keep Lezie safe, personalised, and improving — <button class="ck-text-btn" onclick={() => showDetails = !showDetails}>manage preferences <ChevronDown size={11} class="ck-chevron {showDetails ? 'ck-chevron--open' : ''}" /></button></span>
        </div>
      </div>

      <div class="ck-compact-actions">
        <button class="ck-btn ck-btn--ghost" onclick={() => save('necessary')} disabled={saving}>
          Necessary only
        </button>
        <button class="ck-btn ck-btn--primary" onclick={() => save('all')} disabled={saving}>
          {#if saving}<span class="ck-spinner"></span>{:else}<Check size={14} />{/if}
          Accept all
        </button>
        <button class="ck-dismiss" onclick={() => save('necessary')} aria-label="Dismiss">
          <X size={15} />
        </button>
      </div>
    </div>

    <!-- Expanded details -->
    {#if showDetails}
      <div class="ck-details">
        <div class="ck-divider"></div>

        <div class="ck-types">
          {#each cookieTypes as ct}
            <div class="ck-type-row">
              <div class="ck-type-icon"><ct.icon size={15} /></div>
              <div class="ck-type-info">
                <span class="ck-type-label">{ct.label}</span>
                <span class="ck-type-desc">{ct.desc}</span>
              </div>
              <div class="ck-toggle-wrap">
                {#if ct.locked}
                  <span class="ck-always-on">Always on</span>
                {:else}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs[ct.key]}
                    class="ck-toggle {prefs[ct.key] ? 'ck-toggle--on' : ''}"
                    onclick={() => { prefs[ct.key] = !prefs[ct.key]; }}>
                    <span class="ck-toggle-knob"></span>
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>

        <div class="ck-details-actions">
          <a href="/privacy" class="ck-link">Privacy Policy</a>
          <a href="/cookies" class="ck-link">Cookie Policy</a>
          <div style="flex:1"></div>
          <button class="ck-btn ck-btn--ghost" onclick={() => save('necessary')} disabled={saving}>
            Reject all
          </button>
          <button class="ck-btn ck-btn--primary" onclick={() => save('custom')} disabled={saving}>
            {#if saving}<span class="ck-spinner"></span>{/if}
            Save preferences
          </button>
        </div>
      </div>
    {/if}

  </div>
{/if}

<style>
  :global(.ck-bar *) { font-family: 'DM Sans', system-ui, sans-serif; box-sizing: border-box; }

  .ck-backdrop {
    position: fixed; inset: 0; z-index: 998;
    background: rgba(26, 11, 46, 0.15);
    backdrop-filter: blur(2px);
    animation: ck-fade-in 0.2s ease;
  }

  .ck-bar {
    position: fixed; bottom: 1.25rem; left: 50%; transform: translateX(-50%);
    width: calc(100% - 2rem); max-width: 860px;
    background: white;
    border: 1.5px solid #e5e7eb;
    border-radius: 1.25rem;
    box-shadow: 0 20px 48px rgba(26, 11, 46, 0.14), 0 4px 12px rgba(0,0,0,0.06);
    z-index: 999;
    overflow: hidden;
    animation: ck-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .ck-bar--expanded {
    max-height: 90vh;
    overflow-y: auto;
  }

  /* Compact row */
  .ck-compact {
    display: flex; align-items: center; gap: 1rem;
    padding: 1rem 1.25rem;
    flex-wrap: wrap;
  }

  .ck-compact-left {
    display: flex; align-items: center; gap: .75rem; flex: 1; min-width: 200px;
  }

  .ck-icon-wrap {
    width: 38px; height: 38px; border-radius: .75rem; flex-shrink: 0;
    background: linear-gradient(135deg, #f3e8ff, #ede9fe);
    display: flex; align-items: center; justify-content: center;
    color: #6a2c91;
  }

  .ck-compact-text {
    display: flex; flex-direction: column; gap: .1rem;
  }

  .ck-compact-text strong {
    font-size: .875rem; font-weight: 700; color: #1e1b4b;
  }

  .ck-compact-text span {
    font-size: .75rem; color: #64748b; line-height: 1.5;
  }

  .ck-text-btn {
    background: none; border: none; padding: 0; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: .75rem;
    color: #6a2c91; font-weight: 600; display: inline-flex; align-items: center; gap: .2rem;
    transition: opacity .15s;
  }
  .ck-text-btn:hover { opacity: .75; }

  :global(.ck-chevron) { transition: transform .2s; display: inline-block; }
  :global(.ck-chevron--open) { transform: rotate(180deg); }

  .ck-compact-actions {
    display: flex; align-items: center; gap: .5rem; flex-shrink: 0;
  }

  /* Buttons */
  .ck-btn {
    display: inline-flex; align-items: center; gap: .375rem;
    padding: .5rem 1rem; border-radius: .625rem;
    font-size: .8125rem; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all .2s; white-space: nowrap;
    border: none;
  }
  .ck-btn:disabled { opacity: .65; cursor: not-allowed; }

  .ck-btn--primary {
    background: linear-gradient(135deg, #6a2c91, #4a1d6e);
    color: white;
    box-shadow: 0 3px 10px rgba(106,44,145,.25);
  }
  .ck-btn--primary:hover:not(:disabled) {
    box-shadow: 0 5px 16px rgba(106,44,145,.35);
    transform: translateY(-1px);
  }

  .ck-btn--ghost {
    background: white; color: #64748b;
    border: 1.5px solid #e5e7eb;
  }
  .ck-btn--ghost:hover:not(:disabled) {
    border-color: #6a2c91; color: #6a2c91; background: #f3e8ff;
  }

  .ck-dismiss {
    width: 32px; height: 32px; border-radius: .5rem;
    background: none; border: 1.5px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    color: #94a3b8; cursor: pointer; transition: all .2s; flex-shrink: 0;
  }
  .ck-dismiss:hover { border-color: #6a2c91; color: #6a2c91; background: #f3e8ff; }

  /* Details panel */
  .ck-divider { height: 1px; background: #f1f5f9; margin: 0 1.25rem; }

  .ck-details { padding: 1rem 1.25rem 1.25rem; }

  .ck-types {
    display: flex; flex-direction: column; gap: .5rem;
    margin: .875rem 0 1.125rem;
  }

  .ck-type-row {
    display: flex; align-items: flex-start; gap: .75rem;
    padding: .75rem; border-radius: .875rem;
    border: 1.5px solid #f1f5f9;
    background: #fafafa;
    transition: border-color .15s;
  }
  .ck-type-row:hover { border-color: #e9d5ff; }

  .ck-type-icon {
    width: 32px; height: 32px; border-radius: .5rem;
    background: linear-gradient(135deg, #f3e8ff, #ede9fe);
    display: flex; align-items: center; justify-content: center;
    color: #6a2c91; flex-shrink: 0; margin-top: .1rem;
  }

  .ck-type-info {
    flex: 1; display: flex; flex-direction: column; gap: .2rem; min-width: 0;
  }

  .ck-type-label {
    font-size: .8125rem; font-weight: 700; color: #1e1b4b;
  }

  .ck-type-desc {
    font-size: .75rem; color: #64748b; line-height: 1.5;
  }

  .ck-toggle-wrap {
    display: flex; align-items: center; flex-shrink: 0; padding-top: .15rem;
  }

  .ck-always-on {
    font-size: .6875rem; font-weight: 600; color: #6a2c91;
    background: #f3e8ff; padding: .2rem .6rem; border-radius: 100px;
    border: 1px solid #ddd6fe;
  }

  /* Toggle switch */
  .ck-toggle {
    width: 40px; height: 22px; border-radius: 100px;
    background: #e2e8f0; border: none; cursor: pointer;
    position: relative; transition: background .25s;
    padding: 0;
  }
  .ck-toggle--on { background: #6a2c91; }

  .ck-toggle-knob {
    position: absolute; top: 3px; left: 3px;
    width: 16px; height: 16px; border-radius: 50%;
    background: white;
    box-shadow: 0 1px 4px rgba(0,0,0,.2);
    transition: transform .25s cubic-bezier(.34,1.56,.64,1);
  }
  .ck-toggle--on .ck-toggle-knob { transform: translateX(18px); }

  /* Details footer */
  .ck-details-actions {
    display: flex; align-items: center; gap: .75rem; flex-wrap: wrap;
  }

  .ck-link {
    font-size: .75rem; color: #94a3b8; font-weight: 500;
    text-decoration: none; transition: color .15s;
  }
  .ck-link:hover { color: #6a2c91; }

  /* Spinner */
  .ck-spinner {
    width: 12px; height: 12px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: white;
    border-radius: 50%;
    animation: ck-spin .5s linear infinite;
  }

  /* Animations */
  @keyframes ck-slide-up {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes ck-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes ck-spin { to { transform: rotate(360deg); } }

  /* Responsive */
  @media (max-width: 600px) {
    .ck-bar { bottom: 0; left: 0; right: 0; transform: none; width: 100%; border-radius: 1.25rem 1.25rem 0 0; max-width: 100%; }
    @keyframes ck-slide-up {
      from { opacity: 0; transform: translateY(100%); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ck-compact { flex-direction: column; align-items: flex-start; }
    .ck-compact-actions { width: 100%; justify-content: flex-end; }
    .ck-details-actions { justify-content: flex-end; }
    .ck-link { display: none; }
  }
</style>
