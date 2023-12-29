// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(), visualizer({ open: true })],
  // Support Rollup v4
  // See https://github.com/curran/rollup-v4-browser-vite-demo/
  optimizeDeps: {
    exclude: [
      // Exclude Rollup v4 from being bundled,
      // because it messes up the WASM part of the build.
      '@rollup/browser',

      // Uncomment the following to use npm link with Vite.
      // Exclude VZCode, so that we can use `npm link` locally
      // and still have it work with Vite.
      // 'vzcode',
    ],

    // Fixes "React is undefined" error with VZCode imports
    // See https://github.com/vitejs/vite-plugin-react/issues/192#issuecomment-1627384670
    esbuildOptions: {
      jsx: 'automatic',
    },
  },
});
