import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'; // [!] Add this
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
				theme_color: '#6d28d9', // Your brand violet
				background_color: '#ffffff',
				display: 'standalone',
				icons: [
					{
						src: 'lz_ico_192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'lz_ico_512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: 'lz_ico_512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			}
		})
	]
});
