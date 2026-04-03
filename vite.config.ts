import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Lezie Safety Network',
				short_name: 'Lezie',
				description: 'Real-time incident reporting and identity monitoring.',
				theme_color: '#6d28d9',
				background_color: '#ffffff',
				display: 'standalone',
				icons: [
					{
						src: 'icons/lz_ico.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'icons/lz_ico.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: 'icons/lz_ico.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			}
		})
	]
});
