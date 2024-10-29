import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: [
      // Exclude Rollup v4 from being bundled,
      // because it messes up the WASM part of the build.
      '@rollup/browser',
    ],
  },
  // Fix CSS warnings
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
