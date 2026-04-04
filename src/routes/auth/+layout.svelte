<!-- auth/+layout.svelte -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  
  let isVisible = $state(false);
  
  let { children } = $props();
  
  onMount(() => {
    isVisible = true;
  });
</script>

<svelte:head>
  <title>Lezie - Authentication</title>
</svelte:head>

<div class="auth-layout">
  <div class="auth-background">
    <div class="gradient-bg"></div>
    <div class="pattern-bg"></div>
  </div>
  
  <div class="auth-container" class:visible={isVisible}>
    <div class="auth-card">
      <div class="auth-header">
        <a href={resolve('/')} class="logo">
          <img 
          src="/icons/lz_ico.png"
          alt="Lezie Logo"
          width="96"
          height="96"
          />
          <!-- <span>Lezie</span> -->
        </a>
      </div>
      
      <div class="auth-content">
        <!-- Render default children -->
        {@render children()}
      </div>
      
      <div class="auth-footer">
      </div>
    </div>
  </div>
</div>