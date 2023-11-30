// // Virtual file system for Rollup
// // A Rollup plugin for a virtual file system.
// // Inspired by https://github.com/Permutatrix/rollup-plugin-hypothetical/blob/master/index.js

// import { InputPluginOption } from 'rollup';
// import { V3RuntimeFiles } from '.';

// const js = (name: string) =>
//   name.endsWith('.js') ? name : name + '.js';

// export const virtual = (
//   files: V3RuntimeFiles,
// ): InputPluginOption => ({
//   name: 'virtual',
//   // If the id starts with './', then it's a relative path,
//   // and is the responsibility of the virtual file system.
//   resolveId: (id: string, importer: string) => {
//     console.log('virtual: resolveId() ' + id);
//     console.log('  importer: ' + importer);
//     // id.startsWith('./') ? id : null,
//     if (id.startsWith('./')) {
//       return id;
//     }
//     return null;
//   },
//   load: (id: string) => files[js(id.substring(2))],
// });
