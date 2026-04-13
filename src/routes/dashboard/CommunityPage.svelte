<script lang="ts">
  import { onMount } from 'svelte';

  let { data } = $props();
  
  let isLoading = $state(true);
  let error = $state(null);

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
  {:else if error}
    <p style="color: red;">Error: {error}</p>
  {:else}
    <h2>Stats:</h2>
    <ul>
      <li>Members: {data?.stats?.memberCount ?? 0}</li>
      <li>Posts: {data?.stats?.postCount ?? 0}</li>
      <li>Discussions: {data?.stats?.discussionCount ?? 0}</li>
      <li>Events: {data?.stats?.eventCount ?? 0}</li>
    </ul>
    
    <h2>Sample Data:</h2>
    <pre>{JSON.stringify(data?.posts?.[0] ?? 'No posts', null, 2)}</pre>
  {/if}
</div>