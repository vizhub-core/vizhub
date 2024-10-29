import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
// import workerLoader from 'rollup-plugin-web-worker-loader';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json',
      jsx: 'react',
    }),
    // workerLoader(),
  ],
  external: ['react', 'd3-dsv', 'svelte'],
};

// import typescript from '@rollup/plugin-typescript';
// import { nodeResolve } from '@rollup/plugin-node-resolve';

// export default {
//   input: 'src/index.ts',
//   output: {
//     file: 'dist/index.js',
//     format: 'esm',
//     sourcemap: true,
//   },
//   plugins: [nodeResolve(), typescript()],
//   external: ['react', 'd3-dsv', 'svelte'],
// };
