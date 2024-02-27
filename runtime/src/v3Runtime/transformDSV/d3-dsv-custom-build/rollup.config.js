import { nodeResolve } from '@rollup/plugin-node-resolve';
export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'es',
  },
  plugins: [nodeResolve()],
};
