// import { InputPluginOption } from 'rollup';
// const debug = false;

// const fetchedFileCache = new Map<string, string>();

// // Responsible for loading Svelte internal imports.
// // Inspired by:
// // https://github.com/sveltejs/sites/blob/master/packages/repl/src/lib/workers/bundler/index.js#L345C3-L345C25
// export const urlLoad = (): InputPluginOption => ({
//   name: 'urlLoad',

//   // `id` here is of the form
//   // `{vizId}/{fileName}`
//   load: async (resolved: string) => {
//     if (!resolved.startsWith('https://')) {
//       return;
//     }
//     if (debug) {
//       console.log('[urlLoad]: load() ' + resolved);
//     }

//     const cachedFile = fetchedFileCache.get(resolved);
//     if (cachedFile) return cachedFile;

//     const fetchedFile = await fetch(resolved).then((res) =>
//       res.text(),
//     );

//     fetchedFileCache.set(resolved, fetchedFile);

//     return fetchedFile;
//   },
// });
