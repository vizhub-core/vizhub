// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
  },
});
