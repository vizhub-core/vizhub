// import { InputPluginOption } from 'rollup';
// import { VizCache } from './vizCache';
// import { ResolvedVizFileId } from './types';
// import { parseId } from './parseId';
// import { Content, getFileText } from 'entities';

// const debug = true;

// export const vizLoadSvelte = ({
//   vizCache,
// }: {
//   vizCache: VizCache;
// }): InputPluginOption => ({
//   name: 'vizLoadSvelte',

//   // `id` here is of the form
//   // `{vizId}/{fileName}`
//   load: async (id: ResolvedVizFileId) => {
//     if (debug) {
//       console.log('vizLoadSvelte: load() ' + id);
//     }

//     const { vizId, fileName } = parseId(id);

//     if (debug) {
//       console.log('  [vizLoadSvelte] vizId: ' + vizId);
//       console.log(
//         '  [vizLoadSvelte] fileName: ' + fileName,
//       );
//     }

//     if (fileName.endsWith('.svelte')) {
//       if (debug) {
//         console.log(
//           '    [vizLoadSvelte] tracking Svelte import for ' +
//             id,
//         );
//       }

//       // For Svelte imports, we need to recursively resolve
//       // the imports of the imported viz.
//       const content: Content = await vizCache.get(vizId);
//       return getFileText(content, fileName);
//     }
//   },
// });
