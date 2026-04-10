import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
    // Since you are in Termux, this ensures the client knows where to send requests
    baseURL: window.location.origin
});
