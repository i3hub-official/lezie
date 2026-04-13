<script lang="ts">
  import { onMount } from 'svelte';
  import { Users, MessageCircle, MessageSquare, Calendar, Search, X } from 'lucide-svelte';

  let { data } = $props();
  
  let isLoading = $state(true);
  let searchQuery = $state('');
  let debouncedQuery = $state('');
  let searchTimeout: ReturnType<typeof setTimeout>;

  function handleSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    searchQuery = target.value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      debouncedQuery = searchQuery;
    }, 300);
  }

  onMount(() => {
    console.log('Page mounted');
    setTimeout(() => {
      isLoading = false;
    }, 1000);
  });
</script>

<div style="padding: 2rem;">
  <h1>Community Hub - Debug Mode</h1>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <!-- Search Bar -->
    <div style="margin-bottom: 2rem;">
      <div style="display: flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; padding: 0.5rem;">
        <Search size={18} />
        <input 
          type="text" 
          placeholder="Search..." 
          oninput={handleSearch}
          style="flex: 1; margin-left: 0.5rem; border: none; outline: none;"
        />
        {#if searchQuery}
          <button onclick={() => {
            searchQuery = '';
            debouncedQuery = '';
          }} style="border: none; background: none; cursor: pointer;">
            <X size={16} />
          </button>
        {/if}
      </div>
      <p>Searching for: "{debouncedQuery}"</p>
    </div>

    <!-- Stats Cards -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
      <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
        <Users size={22} />
        <div style="font-size: 24px; font-weight: bold;">{data?.stats?.memberCount ?? 0}</div>
        <div>Active Members</div>
      </div>
      <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
        <MessageCircle size={22} />
        <div style="font-size: 24px; font-weight: bold;">{data?.stats?.postCount ?? 0}</div>
        <div>Total Posts</div>
      </div>
      <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
        <MessageSquare size={22} />
        <div style="font-size: 24px; font-weight: bold;">{data?.stats?.discussionCount ?? 0}</div>
        <div>Discussions</div>
      </div>
      <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
        <Calendar size={22} />
        <div style="font-size: 24px; font-weight: bold;">{data?.stats?.eventCount ?? 0}</div>
        <div>Upcoming Events</div>
      </div>
    </div>

    <h2>Raw Data:</h2>
    <details>
      <summary>Click to see data</summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  {/if}
</div>