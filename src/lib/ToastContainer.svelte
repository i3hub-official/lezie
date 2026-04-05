<script>
  import { toasts } from './toasts.svelte';
  import Toast from './Toast.svelte';
</script>

<div class="toast-container">
  {#each toasts.toasts as toast (toast.id)}
    <Toast {toast} />
  {/each}
</div>