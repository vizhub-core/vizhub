import { InputPluginOption } from 'rollup';
import { ResolvedVizFileId } from './types';
import { parseId } from './parseId';

const debug = true;

// The Svelte compiler.
let compile;

// // Inspired by https://github.com/sveltejs/sites/blob/master/packages/repl/src/lib/workers/compiler/index.js#L53
// function compile({ id, source, options, return_ast }) {
//   try {
//     const { js, css, ast } = self.svelte.compile(
//       source,
//       Object.assign({}, common_options, options),
//     );

//     return {
//       id,
//       result: {
//         js: js.code,
//         css:
//           css.code ||
//           `/* Add a <sty` +
//             `le> tag to see compiled CSS */`,
//         ast: return_ast ? ast : null,
//       },
//     };
//   } catch (err) {
//     // @ts-ignore
//     let message = `/* Error compiling component\n\n${err.message}`;
//     // @ts-ignore
//     if (err.frame) message += `\n${err.frame}`;
//     message += `\n\n*/`;

//     return {
//       id,
//       result: {
//         js: message,
//         css: message,
//       },
//     };
//   }
// }
const svelte_url =
  'https://cdn.jsdelivr.net/npm/svelte@4.2.9';

// The URL from which to load the Svelte compiler.
const svelteCompilerUrl =
  // TODO use v5?
  'https://cdn.jsdelivr.net/npm/svelte@4.2.9/compiler.cjs';

// Responsible for transforming Svelte files.
// Inspired by:
//  * https://github.com/sveltejs/sites/blob/master/packages/repl/src/lib/workers/compiler/index.js#L2
//  * https://github.com/sveltejs/sites/blob/master/packages/repl/src/lib/workers/bundler/index.js#L358
//  * https://github.com/sveltejs/rollup-plugin-svelte/blob/master/index.js#L146C4-L146C51
export const transformSvelte = ({
  getSvelteCompiler,
}: {
  getSvelteCompiler: () => any;
}): InputPluginOption => ({
  name: 'transformSvelte',

  // From https://github.com/sveltejs/sites/blob/master/packages/repl/src/lib/workers/bundler/index.js#L255C2-L271C5
  resolveId: async (importee) => {
    if (debug) {
      console.log(
        '[transformSvelte] resolveId() ' + importee,
      );
    }
    // importing from Svelte
    if (importee === `svelte`)
      return `${svelte_url}/src/runtime/index.js`;

    if (importee.startsWith(`svelte/`)) {
      const sub_path = importee.slice(7);
      return `${svelte_url}/src/runtime/${sub_path}/index.js`;
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
      if (debug) {
        console.log(
          '    [transformSvelte] tracking Svelte import for ' +
            id,
        );
      }

      if (!compile) {
        compile = getSvelteCompiler();
      }

      if (debug) {
        console.log('compile');
        console.log(compile);
      }

      const compiled = compile(code, {
        filename: fileName,
      });
      if (debug) {
        console.log('compiled');
        console.log(compiled);
      }

      return compiled.js;
    }
    return undefined;
  },
});
