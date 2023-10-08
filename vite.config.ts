import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const manifest: Partial<VitePWAOptions> = {
	registerType: 'autoUpdate',
	includeAssets: ['icon.svg'],
	manifest: {
		name: 'Studio Camila Santos',
		short_name: 'Camila Santos',
		description: 'Agende suas sessões no salão com o aplicativo',
		icons: [
			{
				src: '/icon.svg',
				sizes: 'any',
				type: 'image/svg+xml',
				purpose: 'any maskable',
			},
		],
		theme_color: '#302571',
		background_color: '#ffffff',
		display: 'standalone',
		scope: '/',
		start_url: '/',
		orientation: 'portrait',
	},
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), legacy(), VitePWA(manifest)],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
