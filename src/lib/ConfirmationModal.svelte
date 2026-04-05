<script lang="ts">
  import { confirm } from './confirm.svelte';
  import { X } from 'lucide-svelte';

  // Handle clicks properly
  function handleOverlayClick() {
    confirm.cancel();
  }

  function handleContentClick(e: MouseEvent) {
    e.stopImmediatePropagation();   // Prevent overlay click
  }
</script>

{#if confirm.isOpen}
  <!-- Overlay -->
  <div class="modal-overlay" onclick={handleOverlayClick}>
    
    <!-- Modal Content -->
    <div class="modal-content" onclick={handleContentClick}>
      
      <button class="modal-close" onclick={confirm.cancel}>
        <X size={20} />
      </button>

      <div class="modal-header">
        <h2 style="color: {confirm.type === 'danger' ? 'var(--danger-color)' : 
                          confirm.type === 'warning' ? 'var(--warning-color)' : 
                          'var(--primary-color)'}">
          {confirm.title}
        </h2>
      </div>

      <div class="modal-body">
        <p>{confirm.message}</p>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" onclick={confirm.cancel}>
          {confirm.cancelText}
        </button>
        <button 
          class="confirm-btn"
          class:danger={confirm.type === 'danger'}
          onclick={confirm.confirm}
        >
          {confirm.confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}