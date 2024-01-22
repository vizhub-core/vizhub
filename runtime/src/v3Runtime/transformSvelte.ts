import { InputPluginOption } from 'rollup';
import { ResolvedVizFileId } from './types';
import { parseId } from './parseId';

const debug = false;

// The cache of fetched files.
const fetchedFileCache = new Map<string, string>();

// The Svelte compiler.
let compile;

const svelteURL =
  'https://cdn.jsdelivr.net/npm/svelte@4.2.9';

// // The URL from which to load the Svelte compiler.
// const svelteCompilerUrl =
//   // TODO use v5?
//   'https://cdn.jsdelivr.net/npm/svelte@4.2.9/compiler.cjs';

// Responsible for transforming Svelte files.
// Inspired by:
//  * https://github.com/sveltejs/sites/blob/master/packages/repl/src/lib/workers/compiler/index.js#L2
//  * https://github.com/sveltejs/sites/blob/master/packages/repl/src/lib/workers/bundler/index.js#L358
//  * https://github.com/sveltejs/rollup-plugin-svelte/blob/master/index.js#L146C4-L146C51
export const transformSvelte = ({
  getSvelteCompiler,
}: {
  getSvelteCompiler?: () => any;
}): InputPluginOption => ({
  name: 'transformSvelte',

  load: async (resolved: string) => {
    console.log('[transformSvelte] resolved');
    console.log(resolved);
    if (!resolved.startsWith(svelteURL)) {
      return;
    }
    if (debug) {
      console.log('[transformSvelte]: load() ' + resolved);
    }

    const cachedFile = fetchedFileCache.get(resolved);
    if (cachedFile) return cachedFile;

    const fetchedFile = await fetch(resolved).then((res) =>
      res.text(),
    );

    fetchedFileCache.set(resolved, fetchedFile);

    return fetchedFile;
  },

  // From https://github.com/sveltejs/sites/blob/master/packages/repl/src/lib/workers/bundler/index.js#L255C2-L271C5
  resolveId: async (importee, importer) => {
    if (debug) {
      console.log(
        '[transformSvelte] resolveId() ' + importee,
      );
      console.log('importee: ' + importee);
      console.log('importer: ' + importer);
    }
    // importing from Svelte
    if (importee === `svelte`) {
      return `${svelteURL}/src/runtime/index.js`;
    }
    if (importee.startsWith(`svelte/`)) {
      const sub_path = importee.slice(7);
      return `${svelteURL}/src/runtime/${sub_path}/index.js`;
    }

    // importing from a URL
    if (/^https?:/.test(importee)) return importee;

    // Relative imports
    if (importee.startsWith('.')) {
      if (importer && importer.startsWith(svelteURL)) {
        const resolved = new URL(importee, importer).href;
        const url = new URL(importee, importer).href;
        if (debug) {
          console.log(
            '[transformSvelte] resolveId() ' + resolved,
          );
        }
        return resolved;
      }
    }
  },

  // `id` here is of the form
  // `{vizId}/{fileName}`
  transform: async (
    code: string,
    id: ResolvedVizFileId,
  ) => {
    const { fileName } = parseId(id);

    const isSvelte = fileName.endsWith('.svelte');

    if (isSvelte) {
      // if (debug) {
      //   console.log(
      //     '    [transformSvelte] tracking Svelte import for ' +
      //       id,
      //   );
      // }

      if (!compile) {
        if (!getSvelteCompiler) {
          throw new Error('Svelte compiler not available');
        }
        compile = getSvelteCompiler();
      }

      // if (debug) {
      //   console.log('compile');
      //   console.log(compile);
      // }

      const compiled = compile(code, {
        filename: fileName,
      });
      // if (debug) {
      //   console.log('compiled');
      //   console.log(compiled);
      // }

      return compiled.js;
    }
    return undefined;
  },
});
