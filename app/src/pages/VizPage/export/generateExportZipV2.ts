// import { File, Files } from 'entities';
// import { randomId } from 'vzcode/src/randomId';
// import { generateExportZip } from './generateExportZip';

// const v2PackageJSON: File = {
//   name: 'package.json',
//   text: `{
//   "scripts": {
//     "build": "rollup -c"
//   },
//   "devDependencies": {
//     "rollup": "latest",
//     "@rollup/plugin-buble": "latest"
//   }
// }`,
// };

// const v2RollupConfig: File = {
//   name: 'rollup.config.js',
//   text: `const buble = require('@rollup/plugin-buble');
//   export default {
//     input: 'index.js',
//     external: ['d3', 'react', 'react-dom'],
//     output: {
//       file: 'bundle.js',
//       format: 'iife',
//       sourcemap: true,
//       globals: {
//         d3: 'd3',
//         react: 'React',
//         'react-dom': 'ReactDOM',
//       },
//     },
//     plugins: [buble()],
//   };`,
// };

// // Adds V2 package.json and Rollup config to build at home.
// const augment = (files: Files): Files => {
//   return {
//     ...files,
//     [randomId]: v2PackageJSON,
//     [randomId]: v2RollupConfig,
//   };
// };

// export const generateExportZipV2 = (
//   files: Files,
//   fileName: string,
// ) => {
//   generateExportZip(augment(files), fileName);
// };
