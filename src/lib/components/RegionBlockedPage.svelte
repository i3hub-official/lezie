<script lang="ts">
  import { onMount } from 'svelte';
  import { Loader2, MapPin, Globe, AlertCircle } from 'lucide-svelte';
  import { ALLOWED_CODES, ALLOWED_NAMES } from '$lib/config/allowedRegions';

  type Status = 'checking' | 'allowed' | 'blocked' | 'error';

  let STORAGE: Storage;          // sessionStorage or fallback
  const CACHE_KEY = 'lz_region_cache';

  let status       = $state<Status>('checking');
  let countryCode  = $state('');
  let countryName  = $state('');
  let isVpn        = $state(false);
  let displayName  = $state('');

  let locationDetails = $state({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    displayName: ''
  });

  let { onAllowed }: { onAllowed?: () => void } = $props();

  function getTTL(isVpn: boolean) {
    return isVpn ? 1000 * 60 : 1000 * 60 * 60 * 24; // 1 min VPN, 24h normal
  }

  function fetchWithTimeout(url: string, timeout = 5000) {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), timeout)
      )
    ]);
  }

  async function getFullAddressFromCoords(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await res.json();

      if (data.address) {
        const a = data.address;
        locationDetails = {
          street: [a.road, a.house_number].filter(Boolean).join(' ') || a.suburb || a.neighbourhood || '',
          city: a.city || a.town || a.village || '',
          state: a.state || '',
          postalCode: a.postcode || '',
          country: a.country || '',
          displayName: data.display_name || ''
        };
        displayName = data.display_name || '';
      }
    } catch {}
  }

  async function checkRegion() {
    if (typeof window === 'undefined') return; // SSR safe
    status = 'checking';

    try {
      // 1️⃣ Read cache (sessionStorage first, fallback to localStorage)
      const cachedRaw = (sessionStorage.getItem(CACHE_KEY) || localStorage.getItem(CACHE_KEY));
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw);
        if (Date.now() - parsed.timestamp < parsed.ttl) {
          countryCode = parsed.countryCode;
          countryName = parsed.countryName;
          isVpn       = parsed.isVpn;
          displayName = parsed.displayName;
          locationDetails = parsed.locationDetails;
          status = parsed.allowed ? 'allowed' : 'blocked';
          if (parsed.allowed) onAllowed?.();
          return;
        }
      }

      let data: any = null;

      // 2️⃣ Primary: ipapi.co
      try {
        const res = await fetchWithTimeout('https://ipapi.co/json/');
        const d = await res.json();
        data = {
          countryCode: d.country_code,
          country: d.country_name,
          proxy: d.proxy ?? false,
          hosting: d.hosting ?? false,
          lat: d.latitude,
          lon: d.longitude
        };
      } catch {}

      // 3️⃣ Fallback: ipinfo.io
      if (!data) {
        try {
          const res = await fetchWithTimeout('https://ipinfo.io/json');
          const d = await res.json();
          const [lat, lon] = (d.loc || '').split(',');
          data = {
            countryCode: d.country,
            country: d.country,
            proxy: false,
            hosting: false,
            lat,
            lon
          };
        } catch {}
      }

      // 4️⃣ Fallback: Cloudflare trace
      if (!data) {
        try {
          const res = await fetchWithTimeout('https://www.cloudflare.com/cdn-cgi/trace');
          const text = await res.text();
          const match = text.match(/loc=(.*)/);
          const code = match?.[1];
          data = {
            countryCode: code,
            country: code,
            proxy: false,
            hosting: false
          };
        } catch {}
      }

      // 5️⃣ Safe fallback
      if (!data || !data.countryCode) {
        countryCode = 'NG';
        countryName = 'Nigeria';
        isVpn = false;
        status = ALLOWED_CODES.has(countryCode) ? 'allowed' : 'blocked';
        if (status === 'allowed') onAllowed?.();
        return;
      }

      // Normalize
      countryCode = (data.countryCode || '').toUpperCase();
      countryName = data.country || 'Unknown Location';
      isVpn = !!(data.proxy || data.hosting);

      if (data.lat && data.lon) {
        getFullAddressFromCoords(data.lat, data.lon);
      }

      const allowed = ALLOWED_CODES.has(countryCode);

      // VPN users: remove cache for security
      if (isVpn) {
        sessionStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_KEY);
      }

      // Save cache to both storages
      const cachePayload = JSON.stringify({
        countryCode,
        countryName,
        isVpn,
        displayName,
        locationDetails,
        allowed,
        timestamp: Date.now(),
        ttl: getTTL(isVpn)
      });

      sessionStorage.setItem(CACHE_KEY, cachePayload);
      localStorage.setItem(CACHE_KEY, cachePayload);

      // Final state
      status = allowed ? 'allowed' : 'blocked';
      if (allowed) onAllowed?.();

    } catch (err) {
      console.error(err);
      countryCode = 'NG';
      countryName = 'Nigeria';
      status = 'error';
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') STORAGE = sessionStorage;
    checkRegion();
  });
</script>

  

<svelte:head>
  <title>Lezie — Not Available in Your Region</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="wrap">
  <div class="bg-shape s1"></div>
  <div class="bg-shape s2"></div>
  <div class="grid-overlay" aria-hidden="true"></div>

  <!-- CHECKING -->
  {#if status === 'checking'}
    <div class="card checking-card">
      <div class="logo">
        <img src="/icons/lz_ico.png" alt="Lezie" width="40" height="40" />
        <span>Lezie</span>
      </div>
      <div class="spinner-wrap">
        <Loader2 size={48} class="spinner" />
      </div>
      <p class="checking-label">Verifying your location…</p>
    </div>

  <!-- BLOCKED -->
  {:else if status === 'blocked'}
    <div class="card">
      <div class="logo">
        <img src="/icons/lz_ico.png" alt="Lezie" width="40" height="40" />
        <span>Lezie</span>
      </div>

      <div class="icon-wrap">
        <Globe size={48} strokeWidth={1.5} />
        <div class="icon-ring r1"></div>
        <div class="icon-ring r2"></div>
      </div>

      <div class="tag">Region Restricted</div>

      <h1>Service only available<br /><em>in {ALLOWED_NAMES}</em></h1>

      <!-- Rich Location Display -->
      <div class="detected-location prominent">
        <MapPin size={18} />
        <div>
          <strong>{displayName || countryName}</strong><br>
          <small>{locationDetails.city && locationDetails.state ? `${locationDetails.city}, ${locationDetails.state}` : ''}</small>
        </div>
        {#if isVpn}
          <span class="vpn-tag">• VPN / Proxy detected</span>
        {/if}
      </div>

      <p class="subtitle">
        Lezie is a community safety platform built specifically for {ALLOWED_NAMES}. 
        It is not currently available in your region.
      </p>

      <button class="btn" onclick={checkRegion} type="button">Try Again</button>

      <p class="footer-note">
        For urgent safety matters, please contact your local emergency services.
      </p>
    </div>

  <!-- ERROR -->
  {:else if status === 'error'}
    <div class="card error-card">
      <div class="logo">
        <img src="/icons/lz_ico.png" alt="Lezie" width="40" height="40" />
        <span>Lezie</span>
      </div>

      <div class="icon-wrap error-icon-wrap">
        <AlertCircle size={48} strokeWidth={1.5} />
        <div class="icon-ring r1"></div>
        <div class="icon-ring r2"></div>
      </div>

      <div class="tag error-tag">Location Error</div>
      <h1 class="error-h1">Could not verify<br /><em>your location</em></h1>

      {#if displayName || countryName}
        <div class="detected-location">
          <MapPin size={16} />
          Last detected: <strong>{displayName || countryName}</strong>
        </div>
      {/if}

      <p class="subtitle">
        We were unable to determine your location. Please check your internet connection and try again.
      </p>

      <button class="btn" onclick={checkRegion} type="button">Retry</button>

      <p class="footer-note">
        If this keeps happening, contact us at 
        <a href="mailto:support@lezie.app" class="link">support@lezie.app</a>
      </p>
    </div>
  {/if}
</div>

<style>
  /* Your original styles (kept intact) */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :global(body) {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: #ffffff;
    overflow: hidden;
  }

  :root {
    --ink:    #1a0b2e;
    --violet: #6a2c91;
    --viol-l: #8b5cf6;
    --mist:   #ece9f8;
    --amber:  #f59e0b;
    --serif:  'DM Serif Display', Georgia, serif;
  }

  @keyframes drift  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(3deg)} }
  @keyframes drift2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(14px) rotate(-2deg)} }
  @keyframes ringOut {
    0%   { transform:translate(-50%,-50%) scale(.8); opacity:.5; }
    100% { transform:translate(-50%,-50%) scale(2.2); opacity:0; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes spin { to { transform:rotate(360deg); } }

  .wrap {
    min-height:100vh;
    display:flex; align-items:center; justify-content:center;
    background:#faf9ff;
    position:relative; overflow:hidden;
    padding:2rem;
  }

  .bg-shape { position:absolute; border-radius:50%; pointer-events:none; }
  .bg-shape.s1 {
    width:550px; height:550px;
    background:radial-gradient(ellipse, rgba(245,158,11,.08) 0%, transparent 70%);
    top:-180px; right:-80px;
    animation:drift 16s ease-in-out infinite;
  }
  .bg-shape.s2 {
    width:400px; height:400px;
    background:radial-gradient(ellipse, rgba(106,44,145,.07) 0%, transparent 70%);
    bottom:-130px; left:-80px;
    animation:drift2 13s ease-in-out infinite;
  }
  .grid-overlay {
    position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(106,44,145,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(106,44,145,.04) 1px, transparent 1px);
    background-size:48px 48px;
    pointer-events:none;
  }

  .card {
    position:relative; z-index:1;
    background:#ffffff;
    border:1px solid rgba(245,158,11,.2);
    border-radius:2rem;
    padding:3.5rem 3rem;
    max-width:520px; width:100%;
    text-align:center;
    box-shadow:0 32px 80px rgba(245,158,11,.07), 0 4px 16px rgba(0,0,0,.04);
    animation:fadeUp .8s ease both;
  }

  .checking-card, .error-card {
    border-color:rgba(106,44,145,.12);
  }

  .logo {
    display:inline-flex; align-items:center; gap:.625rem;
    margin-bottom:2.25rem;
    font-family:var(--serif); font-size:1.375rem;
    color:var(--ink); letter-spacing:-.02em;
  }
  .logo img { border-radius:8px; }

  .spinner-wrap {
    width:72px; height:72px; margin:0 auto 1.5rem;
    display:flex; align-items:center; justify-content:center;
  }
  .spinner { color: var(--violet); animation: spin 1s linear infinite; }

  .checking-label { font-size:.9375rem; color:#94a3b8; font-weight:500; }

  .icon-wrap {
    position:relative; width:80px; height:80px;
    margin:0 auto 1.75rem;
    display:flex; align-items:center; justify-content:center;
    color: var(--amber);
  }
  .error-icon-wrap { color: var(--violet); }

  .icon-ring {
    position:absolute; top:50%; left:50%;
    border-radius:50%;
    border:1.5px solid rgba(245,158,11,.2);
    animation:ringOut 4s ease-out infinite;
  }
  .error-icon-wrap .icon-ring { border-color:rgba(106,44,145,.2); }
  .icon-ring.r1 { width:56px; height:56px; }
  .icon-ring.r2 { width:72px; height:72px; animation-delay:1.5s; }

  .tag {
    display:inline-block;
    background:rgba(245,158,11,.08);
    border:1px solid rgba(245,158,11,.25);
    border-radius:99px; padding:.3rem .875rem;
    font-size:.7rem; font-weight:700; color:#b45309;
    letter-spacing:.07em; text-transform:uppercase;
    margin-bottom:1rem;
  }
  .error-tag {
    background:rgba(106,44,145,.07);
    border-color:rgba(106,44,145,.15);
    color:var(--violet);
  }

  .detected-location {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #f8f7ff;
    border: 1px solid var(--mist);
    border-radius: 9999px;
    padding: 0.6rem 1.2rem;
    font-size: 0.875rem;
    color: #475569;
    margin: 1rem auto 1.75rem;
    max-width: fit-content;
  }

  .detected-location.prominent {
    background: #fef3c7;
    border-color: #fcd34d;
    color: #92400e;
    font-weight: 500;
  }

  .vpn-tag {
    font-size: 0.75rem;
    color: #f59e0b;
    font-weight: 600;
  }

  h1 {
    font-family:var(--serif);
    font-size:clamp(1.75rem,4vw,2.5rem);
    color:var(--ink); line-height:1.15;
    margin-bottom:1rem;
  }
  h1 em { color:var(--amber); font-style:italic; }
  .error-h1 em { color:var(--violet); }

  .subtitle {
    font-size:.9375rem; line-height:1.75; color:#64748b;
    margin-bottom:1.75rem;
    max-width:400px; margin-left:auto; margin-right:auto;
  }

  .btn {
    display:inline-flex; align-items:center; justify-content:center;
    background:#6a2c91; color:white;
    font-size:.9rem; font-weight:700;
    padding:.875rem 2.25rem; border-radius:99px;
    border:none; cursor:pointer; width:100%;
    box-shadow:0 4px 18px rgba(106,44,145,.25);
    transition:transform .2s, box-shadow .2s;
    font-family:'DM Sans',sans-serif;
    margin-bottom:1.75rem;
  }
  .btn:hover { transform:translateY(-2px); box-shadow:0 8px 26px rgba(106,44,145,.35); }

  .footer-note { 
    font-size:.75rem; 
    color:#94a3b8; 
    line-height:1.6; 
  }

  @media (max-width:480px) {
    .card { padding:2.5rem 1.75rem; border-radius:1.5rem; }
  }
</style>