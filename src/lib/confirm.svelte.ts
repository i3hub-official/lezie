// src/lib/confirm.svelte.ts
export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger' | 'warning';
}

class ConfirmStore {
  isOpen = $state(false);
  title = $state('');
  message = $state('');
  confirmText = $state('Confirm');
  cancelText = $state('Cancel');
  type = $state<'default' | 'danger' | 'warning'>('default');

  private resolveFn: ((value: boolean) => void) | null = null;

  async show(options: ConfirmOptions): Promise<boolean> {
    this.title = options.title;
    this.message = options.message;
    this.confirmText = options.confirmText || 'Confirm';
    this.cancelText = options.cancelText || 'Cancel';
    this.type = options.type || 'default';
    this.isOpen = true;

    return new Promise((resolve) => {
      this.resolveFn = resolve;
    });
  }

  confirm() {
    this.resolveFn?.(true);
    this.close();
  }

  cancel() {
    this.resolveFn?.(false);
    this.close();
  }

  private close() {
    this.isOpen = false;
    this.resolveFn = null;
  }
}

export const confirm = new ConfirmStore();