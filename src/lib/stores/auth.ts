import { writable } from 'svelte/store';

interface User {
  id: string;
  email: string;
  name: string;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<User | null>(null);
  
  return {
    subscribe,
    set,
    update,
    login: async (_email: string, _password: string) => {
      // Implementation
    },
    logout: async () => {
      // Implementation
      set(null);
    }
  };
}

export const authStore = createAuthStore();