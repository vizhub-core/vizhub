// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    // visualizer({ open: true })
  ],
  build: {
    // minify: false,
    // rollupOptions: {
    //
    // },
    // rollupOptions: {
    //   // https://rollupjs.org/configuration-options/
    //   external: ['rollup'],
    // },
  },
  // Support Rollup v4
  // See https://github.com/curran/rollup-v4-browser-vite-demo/
  optimizeDeps: {
    exclude: ['@rollup/browser'],

    // Fixes "React is undefined" error with VZCode imports
    // See https://github.com/vitejs/vite-plugin-react/issues/192#issuecomment-1627384670
    esbuildOptions: {
      jsx: 'automatic',
    },
  },
});
