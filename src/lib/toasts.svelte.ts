// src/lib/toasts.svelte.ts
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

class ToastsStore {
  toasts = $state<Toast[]>([]);
  maxToasts = 5;   // ← You can change this number anytime

  success(title: string, message?: string, duration = 3800) {
    this.addToast('success', title, message, duration);
  }

  error(title: string, message?: string, duration = 5000) {
    this.addToast('error', title, message, duration);
  }

  warning(title: string, message?: string, duration = 4500) {
    this.addToast('warning', title, message, duration);
  }

  info(title: string, message?: string, duration = 4000) {
    this.addToast('info', title, message, duration);
  }

  private addToast(type: ToastType, title: string, message?: string, duration?: number) {
    const toast: Toast = {
      id: Math.random().toString(36).slice(2, 11),
      type,
      title,
      message,
      duration: duration ?? 4000
    };

    // Enforce maximum limit
    if (this.toasts.length >= this.maxToasts) {
      this.toasts = this.toasts.slice(0, this.maxToasts - 1);
    }

    this.toasts = [toast, ...this.toasts];

    if (duration !== 0) {
      setTimeout(() => this.remove(toast.id), toast.duration);
    }
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  clear() {
    this.toasts = [];
  }
}

export const toasts = new ToastsStore();