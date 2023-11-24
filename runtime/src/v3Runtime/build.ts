import {
  OutputOptions,
  RollupOptions,
  RollupCache,
} from 'rollup';
import { V3BuildResult, V3RuntimeFiles } from './types';
import { V3PackageJson } from 'entities';

const parseJSON = (str: string, errors: any[]) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    errors.push(error);
    error.code = 'INVALID_PACKAGE_JSON';
    throw error;
  }
};

const getPkg = (files: V3RuntimeFiles, errors: any[]) =>
  'package.json' in files
    ? parseJSON(files['package.json'], errors)
    : null;

const getGlobals = (pkg: V3PackageJson) => {
  const libraries = pkg?.vizhub?.libraries;
  if (libraries) {
    return Object.entries(libraries).reduce(
      (accumulator, [packageName, config]) => {
        accumulator[packageName] = config.global;
        return accumulator;
      },
      {},
    );
  }
  return null;
};

// A Rollup plugin for a virtual file system.
// Inspired by https://github.com/Permutatrix/rollup-plugin-hypothetical/blob/master/index.js

const js = (name: string) =>
  name.endsWith('.js') ? name : name + '.js';

const virtual = (files: V3RuntimeFiles) => ({
  name: 'virtual',
  resolveId: (id: string) =>
    id.startsWith('./') ? id : null,
  load: (id: string) =>
    id.startsWith('./') ? files[js(id.substring(2))] : null,
});

// Rollup cache for incremental builds!
// See https://rollupjs.org/guide/en/#cache
// Manual benchmarks for scatter plot example:
// Without cache: avg = 5.9 ms
// With cache: avg = 5.2 ms
let cache: RollupCache | null = null;

const debug = false;

export const build = async ({
  files,
  enableSourcemap = false,
  enableCache = false,
  rollup,
}: {
  files: V3RuntimeFiles;
  enableSourcemap?: boolean;
  enableCache?: boolean;
  rollup: any;
}): Promise<V3BuildResult> => {
  const startTime = Date.now();
  const warnings = [];
  const errors = [];
  let src: string | undefined;
  let pkg: V3PackageJson | undefined;

  if (debug) {
    console.log('build.ts: build()');
    console.log('  files:');
    console.log(files);
    console.log('  rollup:');
    console.log(rollup);
    console.log('  enableSourcemap:');
    console.log(enableSourcemap);
  }

  if (!files['index.js']) {
    errors.push({
      code: 'MISSING_INDEX_JS',
      message: 'Missing index.js',
    });
  } else {
    const inputOptions: RollupOptions = {
      input: './index.js',
      plugins: virtual(files),
      onwarn: (warning: any) => {
        warnings.push(JSON.parse(JSON.stringify(warning)));
      },
    };
    if (enableCache) {
      inputOptions.cache = cache;
    }

    const outputOptions: OutputOptions = {
      format: 'umd',
      name: 'Viz',
      sourcemap: enableSourcemap ? true : false,
    };

    pkg = getPkg(files, errors);
    if (pkg) {
      const globals = getGlobals(pkg);
      if (globals) {
        inputOptions.external = Object.keys(globals);
        outputOptions.globals = globals;
      }
    }

    try {
      if (debug) {
        console.log('  Invoking `rollup`');
      }
      const bundle = await rollup(inputOptions);
      if (enableCache) {
        cache = bundle.cache;
      }
      if (debug) {
        console.log('  Invoking `bundle.generate`');
      }
      const { code, map } = (
        await bundle.generate(outputOptions)
      ).output[0];

      // TODO benchmark performance and build size with vs. without sourcemaps
      // Idea: no sourcemaps when interacting, sourcemaps after interact is done.
      // Idea: cache builds on the server, don't store builds in ShareDB at all
      src = code;

      // If sourcemaps are enabled, tack them onto the end inline.
      if (enableSourcemap && !debug) {
        // Note that map.toUrl breaks in Web Worker as window.btoa is not defined.
        // Inspired by https://github.com/Rich-Harris/magic-string/blob/abf373f2ed53d00e184ab236828853dd35a62763/src/SourceMap.js#L31
        src +=
          '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,' +
          btoa(map.toString());
      }
      if (debug) {
        console.log('  Built with Rollup');
        console.log(src?.slice(0, 200));
      }
    } catch (error) {
      if (debug) {
        console.log('  Caught error in build.ts:');
        console.log(error);
      }
      const serializableError = JSON.parse(
        JSON.stringify(error),
      );
      serializableError.name = error.name;
      serializableError.message = error.message;
      errors.push(serializableError);
    }
  }

  if (!files['package.json']) {
    warnings.push({
      code: 'MISSING_PACKAGE_JSON',
      message: 'Missing package.json',
    });
  }

  if (debug) {
    console.log('  returning src in build.ts:');
    console.log('  src:');
    console.log(src?.slice(0, 200));
  }

  return {
    errors,
    warnings,
    src,
    pkg,
    time: Date.now() - startTime,
  };
};
