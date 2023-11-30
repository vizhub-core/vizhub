import {
  OutputOptions,
  RollupOptions,
  RollupCache,
  RollupLog,
} from 'rollup';
import {
  V3BuildError,
  V3BuildResult,
  V3RuntimeFiles,
} from './types';
import { V3PackageJson } from 'entities';
import { virtual } from './virtual';
import { importFromViz } from './importFromViz';
import { VizImport } from './extractVizImport';
import { VizCache } from './vizCache';

const debug = false;

const parseJSON = (str: string, errors: any[]) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    errors.push({
      code: 'INVALID_PACKAGE_JSON',
      message: error.message,
    });
    return undefined;
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

// Rollup cache for incremental builds!
// See https://rollupjs.org/guide/en/#cache
// Manual benchmarks for scatter plot example:
// Without cache: avg = 5.9 ms
// With cache: avg = 5.2 ms
let cache: RollupCache | undefined;

export const build = async ({
  files,
  enableSourcemap = false,
  enableCache = false,
  rollup,
  vizCache,
}: {
  files: V3RuntimeFiles;
  enableSourcemap?: boolean;
  enableCache?: boolean;
  rollup;
  vizCache: VizCache;
}): Promise<V3BuildResult> => {
  const startTime = Date.now();
  const warnings: Array<V3BuildError> = [];
  const errors: Array<V3BuildError> = [];
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
      plugins: [virtual(files), importFromViz(vizCache)],
      onwarn: (warning: RollupLog) => {
        warnings.push(JSON.parse(JSON.stringify(warning)));
      },
    };

    // If cache is enabled AND there is a cache
    // from the previous build, use it.
    if (enableCache && cache) {
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

    // Invoke Rollup before the actual build to
    // detect which vizzes are imported from.
    // const vizImports: Array<VizImport> = [];

    // Option A: Use <script> tags to import vizzes.
    //
    // After we have the viz imports, we can
    // append the script tags to the HTML,
    // much the same way that libraries are
    // appended in the HTML.
    //
    // Pros:
    //  * No need to bundle dependent vizzes with Rollup.
    //  * When a dependent viz is large, e.g. containing
    //    data files, that dependent viz is effectively
    //    "cached" in the browser, and does not need to
    //    be reloaded when the parent viz is reloaded.
    //    This makes hot reloading fast when dependent
    //    vizzes are large.

    // Cons:
    //  * Need to load vizzes from a VizHub CDN (net new).
    //  * When a dependent viz is updated, the update is
    //    _not_ immediately reflected, not amenable to
    //    hot reloading.

    // Option B: Bundle dependent vizzes with Rollup.
    //
    // After we have the viz imports, we can fetch them
    // into the browser, and then bundle them with Rollup.
    //
    // Pros:
    //  * No need to load vizzes from a VizHub CDN (net new).
    //  * When a dependent viz is updated, the update can be
    //    immediately reflected, amenable to hot reloading.
    //  * The transitive dependencies can reside in memory,
    //    leveraging ShareDB subscriptions to keep them up
    //    to date.
    //
    // Cons:
    //  * Need to bundle dependent vizzes with Rollup.
    //  * When a dependent viz is large, e.g. containing
    //    data files, that dependent viz is bundled with
    //    the parent viz, and must be reloaded when the
    //    parent viz is reloaded. This makes hot reloading
    //    slow when dependent vizzes are large.

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
