<script lang="ts">
  import { onMount } from 'svelte';
  import { Users, MessageCircle, MessageSquare, Calendar } from 'lucide-svelte';

  let { data } = $props();
  
  let isLoading = $state(true);
  let error = $state(null);

  onMount(() => {
    console.log('Page mounted with data:', data);
    setTimeout(() => {
      isLoading = false;
    }, 1000);
  });
</script>

<div style="padding: 2rem;">
  <h1>Community Hub - Debug Mode</h1>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else if error}
    <p style="color: red;">Error: {error}</p>
  {:else}
    <!-- Stats Cards -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
      <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
        <Users size={22} />
        <div>
          <div style="font-size: 24px; font-weight: bold;">{data?.stats?.memberCount ?? 0}</div>
          <div>Active Members</div>
        </div>
      </div>
      <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
        <MessageCircle size={22} />
        <div>
          <div style="font-size: 24px; font-weight: bold;">{data?.stats?.postCount ?? 0}</div>
          <div>Total Posts</div>
        </div>
      </div>
      <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
        <MessageSquare size={22} />
        <div>
          <div style="font-size: 24px; font-weight: bold;">{data?.stats?.discussionCount ?? 0}</div>
          <div>Discussions</div>
        </div>
      </div>
      <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
        <Calendar size={22} />
        <div>
          <div style="font-size: 24px; font-weight: bold;">{data?.stats?.eventCount ?? 0}</div>
          <div>Upcoming Events</div>
        </div>
      </div>
    </div>

    <h2>Raw Data:</h2>
    <details>
      <summary>Click to see data</summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  {/if}
</div>