// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    // visualizer({ open: true })
    tailwindcss(),
  ],
  resolve: {
    // Special case for runtime package,
    // so the app uses the latest source
    // rather than the built package.
    alias: {
      '@vizhub/runtime': path.resolve(
        __dirname,
        '../runtime/src',
      ),

      /**
       * @uiw/* packages are not compatible with ESM, as they do not import with `.js` extension.
       * We're using source in TypeScript instead.
       */

      '@uiw/codemirror-theme-okaidia':
        '@uiw/codemirror-theme-okaidia/src/index.ts',
      '@uiw/codemirror-theme-abcdef':
        '@uiw/codemirror-theme-abcdef/src/index.ts',
      '@uiw/codemirror-theme-dracula':
        '@uiw/codemirror-theme-dracula/src/index.ts',
      '@uiw/codemirror-theme-eclipse':
        '@uiw/codemirror-theme-eclipse/src/index.ts',
      '@uiw/codemirror-theme-github':
        '@uiw/codemirror-theme-github/src/index.ts',
      '@uiw/codemirror-theme-material':
        '@uiw/codemirror-theme-material/src/index.ts',
      '@uiw/codemirror-theme-nord':
        '@uiw/codemirror-theme-nord/src/index.ts',
      '@uiw/codemirror-theme-xcode':
        '@uiw/codemirror-theme-xcode/src/index.ts',
      '@uiw/codemirror-themes':
        '@uiw/codemirror-themes/src/index.tsx',
    },
  },
  // Support Rollup v4
  // See https://github.com/curran/rollup-v4-browser-vite-demo/
  optimizeDeps: {
    include: [
      '@uiw/codemirror-theme-okaidia',
      '@uiw/codemirror-theme-abcdef',
      '@uiw/codemirror-theme-dracula',
      '@uiw/codemirror-theme-eclipse',
      '@uiw/codemirror-theme-github',
      '@uiw/codemirror-theme-material',
      '@uiw/codemirror-theme-nord',
      '@uiw/codemirror-theme-xcode',
      '@uiw/codemirror-themes',
    ],
    exclude: [
      // Exclude Rollup v4 from being bundled,
      // because it messes up the WASM part of the build.
      '@rollup/browser',

      // Always use the latest source for runtime package
      '@vizhub/runtime',

      // Using `npm link` with VZCode
      // Steps:
      // cd ../vzcode
      // npm link ../vizhub3/node_modules/react-router-dom ../vizhub3/node_modules/react-bootstrap
      // cd ../vizhub3
      // npm link vzcode
      // Uncomment the following line
      // 'vzcode',
    ],

    // Fixes "React is undefined" error with VZCode imports
    // See https://github.com/vitejs/vite-plugin-react/issues/192#issuecomment-1627384670
    esbuildOptions: {
      jsx: 'automatic',
    },
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
