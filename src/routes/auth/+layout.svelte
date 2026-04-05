<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import { goto } from '$app/navigation';
  
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
        <button class="logo" onclick={() => goto('/')}>
          <img 
            src="/icons/lz_ico.png"
            alt="Lezie Logo"
            width="56"
            height="56"
            class="logo-img"
          />
          <span class="logo-text">Lezie</span>
        </button>
      </div>

      <div class="auth-content">
        {@render children()}
      </div>

      <div class="auth-footer">
      </div>
    </div>
  </div>
</div>

<style>
  /* Auth-specific styles only - no layout/page controls */
  .auth-layout {
    min-height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .auth-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }
  
  .gradient-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    opacity: 0.1;
  }
  
  .pattern-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(106, 44, 145, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 75% 75%, rgba(106, 44, 145, 0.1) 2px, transparent 2px);
    background-size: 50px 50px;
  }
  
  /* Container - responsive width */
  .auth-container {
    width: 100%;
    max-width: 480px;
    padding: 2rem;
    z-index: 1;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
  }
  
  .auth-container.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Card - responsive styling */
  .auth-card {
    background: white;
    border-radius: 1.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }
  
  /* Header with logo control */
  .auth-header {
    padding: 2rem 2rem 1rem;
    text-align: center;
    border-bottom: 1px solid var(--primary-border);
  }
  
  .logo {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem 1rem;
    transition: all 0.2s ease;
    border-radius: 1rem;
  }
  
  .logo:hover {
    background: rgba(106, 44, 145, 0.05);
    transform: translateY(-1px);
  }
  
  .logo:active {
    transform: translateY(0);
  }
  
  .logo-img {
    display: block;
    transition: transform 0.2s ease;
  }
  
  .logo:hover .logo-img {
    transform: scale(1.05);
  }
  
  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .auth-content {
    padding: 2rem;
  }
  
  .auth-footer {
    padding: 1.5rem 2rem;
    background: var(--light-color);
    border-top: 1px solid var(--primary-border);
    text-align: center;
    font-size: 0.875rem;
    color: var(--gray-color);
  }
  
  /* Responsive Breakpoints */
  
  /* Tablet (768px and below) */
  @media (max-width: 768px) {
    .auth-container {
      max-width: 90%;
      padding: 1.5rem;
    }
    
    .logo-text {
      font-size: 1.25rem;
    }
    
    .logo-img {
      width: 48px;
      height: 48px;
    }
  }
  
  /* Mobile (640px and below) - Full width card */
  @media (max-width: 640px) {
    .auth-container {
      max-width: 100%;
      padding: 1rem;
    }
    
    .auth-card {
      border-radius: 1rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .auth-header {
      padding: 1.5rem 1.5rem 0.75rem;
    }
    
    .auth-content {
      padding: 1.5rem;
    }
    
    .auth-footer {
      padding: 1rem 1.5rem;
    }
    
    .logo {
      padding: 0.375rem 0.75rem;
    }
    
    .logo-text {
      font-size: 1.125rem;
    }
    
    .logo-img {
      width: 40px;
      height: 40px;
    }
  }
  
  /* Small mobile (480px and below) */
  @media (max-width: 480px) {
    .auth-container {
      padding: 0.75rem;
    }
    
    .auth-header {
      padding: 1.25rem 1rem 0.5rem;
    }
    
    .auth-content {
      padding: 1.25rem;
    }
    
    .logo {
      gap: 0.5rem;
    }
    
    .logo-text {
      font-size: 1rem;
    }
    
    .logo-img {
      width: 36px;
      height: 36px;
    }
  }
</style>