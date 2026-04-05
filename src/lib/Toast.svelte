<script lang="ts">
  import { toasts } from './toasts.svelte';
  import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-svelte';

  interface Props { toast: any }
  let { toast }: Props = $props();

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: 'var(--success-color)',
    error: 'var(--danger-color)',
    warning: 'var(--warning-color)',
    info: 'var(--primary-color)'
  };
</script>

<div 
  class="toast toast-{toast.type}" 
  style="--toast-color: {colors[toast.type]}"
>
  <div class="toast-icon">
    <svelte:component this={icons[toast.type]} size={20} />
  </div>
  
  <div class="toast-body">
    <div class="toast-title">{toast.title}</div>
    {#if toast.message}
      <div class="toast-message">{toast.message}</div>
    {/if}
  </div>

  <button class="toast-close" onclick={() => toasts.remove(toast.id)}>
    <X size={18} />
  </button>
</div>