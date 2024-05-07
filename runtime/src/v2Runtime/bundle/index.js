import { rollup } from './rollup.browser';
import bubleJSXOnly from './bubleJSXOnly';
import hypothetical from './hypothetical';
import { getLibraries } from './getLibraries';

// if HTML parser encounter </script> it stops parsing current script
// in order to avoid that, </script> should be split into parts.
const escapeClosingScriptTag = (code) =>
  code.split('</script>').join('" + "<" + "/script>" + "');

const transformFilesToObject = (files) =>
  files
    .filter(
      (file) => file.name.endsWith('.js'),
      // TODO: add support for other file types
      // file.name.endsWith('.svelte') ||
      // file.name.endsWith('.jsx') ||
      // file.name.endsWith('.ts') ||
      // file.name.endsWith('.tsx') ||
      // file.name.endsWith('.vue')
    )
    .reduce((accumulator, file) => {
      accumulator['./' + file.name] = file.text;
      return accumulator;
    }, {});

export const bundle = async (files) => {
  const libraries = getLibraries(files);

  const outputOptions = {
    format: 'iife',
    name: 'bundle',
    sourcemap: 'inline',
    globals: libraries,
  };

  const inputOptions = {
    input: './index.js',
    plugins: [
      hypothetical({
        files: transformFilesToObject(files),
        cwd: false,
      }),
      bubleJSXOnly({
        target: {
          chrome: 71,
        },
      }),
    ],
    external: Object.keys(libraries),
    // Suppress Rollup warnings
    onwarn: () => {},
  };
  const rollupBundle = await rollup(inputOptions);
  const { output } =
    await rollupBundle.generate(outputOptions);

  // Monkey patch magic-string internals
  // to support characters outside of the Latin1 range, e.g. Cyrillic.
  //
  // Related reading:
  //  - https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa#Unicode_strings
  //  - https://github.com/Rich-Harris/magic-string/blob/3466b0230dddc95eb378ed3e0d199e36fbd1f572/src/SourceMap.js#L3
  //
  if (output.length !== 1) {
    throw new Error(
      'Expected Rollup output length to be 1. This Error is a VizHub bug if it happens.',
    );
  }
  const { code, map } = output[0];

  const escapedCode = escapeClosingScriptTag(code);

  const toString = map.toString.bind(map);
  map.toString = () =>
    unescape(encodeURIComponent(toString()));

  // Inspired by https://github.com/rollup/rollup/issues/121
  const codeWithSourceMap =
    escapedCode + '\n//# sourceMappingURL=' + map.toUrl();

  return [
    {
      name: 'bundle.js',
      text: codeWithSourceMap,
    },
  ];
};
