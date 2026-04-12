// src/app.d.ts

declare global {
  namespace App {
    interface Locals {
      users: import('$lib/server/auth').auth.$InferPull.users | null;
      sessions: import('$lib/server/auth').auth.$InferPull.sessions | null;
    }
  }
}

export {};
