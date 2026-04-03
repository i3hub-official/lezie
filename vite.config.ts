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
    { src: '/icons/lz_ico.png', sizes: '72x72', type: 'image/png' },
    { src: '/icons/lz_ico.png', sizes: '96x96', type: 'image/png' },
    { src: '/icons/lz_ico.png', sizes: '128x128', type: 'image/png' },
    { src: '/icons/lz_ico.png', sizes: '144x144', type: 'image/png' },
    { src: '/icons/lz_ico.png', sizes: '152x152', type: 'image/png' },
    { src: '/icons/lz_ico.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/lz_ico.png', sizes: '384x384', type: 'image/png' },
    { src: '/icons/lz_ico.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
]
});
