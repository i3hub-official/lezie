<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { resolve } from '$app/paths';
  
  let isVisible = false;
  
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
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L2 9L16 16L30 9L16 2Z" fill="#3B82F6" stroke="#2563EB" stroke-width="1.5"/>
            <path d="M2 9V23L16 30L30 23V9" stroke="#2563EB" stroke-width="1.5" fill="none"/>
            <path d="M16 16V30" stroke="#2563EB" stroke-width="1.5"/>
          </svg>
          <span>Lezie</span>
        </a>
        <slot name="header" />
      </div>
      
      <div class="auth-content">
        <slot />
      </div>
      
      <div class="auth-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</div>

<style>
  .auth-layout {
    min-height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: 0.1;
  }
  
  .pattern-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 2px, transparent 2px);
    background-size: 50px 50px;
  }
  
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
  
  .auth-card {
    background: white;
    border-radius: 1.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }
  
  .auth-header {
    padding: 2rem 2rem 1rem;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .logo {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, #3B82F6, #8B5CF6);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-bottom: 1rem;
  }
  
  .logo svg {
    display: block;
  }
  
  .auth-content {
    padding: 2rem;
  }
  
  .auth-footer {
    padding: 1.5rem 2rem;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  @media (max-width: 640px) {
    .auth-container {
      padding: 1rem;
    }
    
    .auth-header,
    .auth-content {
      padding: 1.5rem;
    }
    
    .auth-footer {
      padding: 1rem 1.5rem;
    }
  }
</style>