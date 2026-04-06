import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// Optional: Force Node.js runtime for better compatibility (avoids Edge limitations)
			// runtime: 'nodejs20.x'   // or 'nodejs18.x' if preferred
		}),
		// Recommended: Disable prerendering for this dynamic signup page
		prerender: {
			entries: [] // Or handle per-route with +page.server.js
		}
	},

	// Updated runes configuration for Svelte 5
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) => {
			// Enable runes for ALL .svelte files (including your routes)
			if (filename?.endsWith('.svelte')) {
				return { runes: true };
			}
			// Keep original behavior for node_modules if needed
			if (filename?.includes('node_modules')) {
				return undefined;
			}
			return { runes: true };
		}
	}
};

export default config;