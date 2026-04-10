// src/app.d.ts

declare global {
  namespace App {
    interface Locals {
      user: import('$lib/server/auth').auth.$InferPull.user | null;
      session: import('$lib/server/auth').auth.$InferPull.session | null;
    }
  }
}

export {};
