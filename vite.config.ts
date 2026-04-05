import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Lezie | Real-Time Safety & Monitoring',
				short_name: 'Lezie',
				description: 'Proactive community safety and identity protection.',
				theme_color: '#6d28d9',
				background_color: '#ffffff',
				display: 'standalone',
				start_url: '/',
				icons: [
					{
						src: '/icons/lz_ico.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icons/lz_ico.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg}']
			}
		})
	]
});