import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const manifest: Partial<VitePWAOptions> = {
    strategies: 'injectManifest',
    registerType: 'autoUpdate',
    includeAssets: [
        'icon.svg',
        'icon-small.png',
        'icon-128.png',
        'icon-256.png',
        'icon-512.png',
    ],
    manifest: {
        name: 'Studio Camila Santos',
        short_name: 'Camila Santos',
        description: 'Agende suas sessões no salão com o aplicativo',
        icons: [
            {
                src: '/icon-small.png',
                sizes: '16x16 32x32 58x58 76x76 80x80 87x87',
                type: 'image/png',
                purpose: 'any maskable',
            },
            {
                src: '/icon-128.png',
                sizes: '120x120 128x128',
                type: 'image/png',
                purpose: 'any maskable',
            },
            {
                src: '/icon-256.png',
                sizes: '25x256',
                type: 'image/png',
                purpose: 'any maskable',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
            },
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
    plugins: [vue(), VitePWA(manifest)],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('firebase/'))
                        return id
                            .toString()
                            .split('firebase/')[1]
                            .split('/')[0]
                            .toString();
                    if (id.includes('node_modules'))
                        return id
                            .toString()
                            .split('node_modules/')[1]
                            .split('/')[0]
                            .toString();
                },
            },
        },
    },
});
