import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'build/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins: [nodeResolve()],
  },
  {
    input: 'src/worker.js',
    output: {
      file: 'build/worker.js',
      format: 'iife',
      sourcemap: true,
    },
  },
];
