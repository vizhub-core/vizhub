import {
  OutputOptions,
  RollupOptions,
  RollupCache,
  RollupLog,
  RollupBuild,
} from 'rollup';
import { V3BuildError, V3BuildResult } from './types';
import {
  Content,
  V3PackageJson,
  VizId,
  getFileText,
} from 'entities';
import { vizResolve } from './vizResolve';
import { VizCache } from './vizCache';
import { vizLoad } from './vizLoad';
import { transformDSV } from './transformDSV';
import { transformSvelte } from './transformSvelte';
import { missingIndexJSError } from 'gateways';
import {
  invalidPackageJSONError,
  missingImportError,
  rollupError,
} from 'gateways/src/errors';

const debug = false;

// From https://github.com/Rich-Harris/magic-string/blob/master/src/SourceMap.js
// Modified to support Web Workers
// Upstream PR: https://github.com/Rich-Harris/magic-string/pull/269
function getBtoa() {
  if (typeof btoa === 'function') {
    return (str) => btoa(unescape(encodeURIComponent(str)));
  } else if (typeof Buffer === 'function') {
    return (str) =>
      Buffer.from(str, 'utf-8').toString('base64');
  } else {
    return () => {
      throw new Error(
        'Unsupported environment: `window.btoa` or `Buffer` should be supported.',
      );
    };
  }
}

const niceBTOA = getBtoa();

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

const isWebWorker =
  typeof self !== 'undefined' && self.window === self;

// Builds the code.
// Throws errors if the build fails.
export const build = async ({
  vizId,
  enableSourcemap = false,
  enableCache = isWebWorker,
  rollup,
  vizCache,
  resolveSlug,
  getSvelteCompiler,
}: {
  // The ID of the viz being built.
  vizId: VizId;
  enableSourcemap?: boolean;
  enableCache?: boolean;
  rollup: (options: RollupOptions) => Promise<RollupBuild>;

  // The viz cache, prepopulated with at least the viz being built.
  vizCache: VizCache;

  // Resolves a slug import to a viz ID.
  resolveSlug?: ({ userName, slug }) => Promise<VizId>;

  // Gets the Svelte compiler.
  // This is synchronous because it either gets loaded
  // from a CDN with importScripts (which is synchronous)
  // or from a local node package (imported statically).
  getSvelteCompiler?: () => Promise<any>;
}): Promise<V3BuildResult> => {
  if (debug) {
    console.log('  build.ts: build()');
    console.log('  vizId:', vizId);
  }
  const startTime = Date.now();
  const warnings: Array<V3BuildError> = [];
  let src: string | undefined;
  let pkg: V3PackageJson | undefined;

  const content: Content = await vizCache.get(vizId);

  const indexJSContent = getFileText(content, 'index.js');
  const cssFilesSet = new Set<string>();
  if (!indexJSContent) {
    throw missingIndexJSError();
  } else {
    const trackCSSImport = (cssFile: string) => {
      cssFilesSet.add(cssFile);
    };
    const inputOptions: RollupOptions = {
      input: './index.js',
      plugins: [
        vizResolve({ vizId, resolveSlug }),
        // urlLoad(),
        transformDSV(),
        transformSvelte({ getSvelteCompiler }),
        vizLoad({ vizCache, trackCSSImport }),
        // vizLoadJS({ vizCache }),
        // cssResolve
        // csvResolve
        // jsonResolve
        // defaultResolve - protect against file system access
      ],
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
      // TODO disable sourcemaps during hot reloading
      sourcemap: enableSourcemap ? true : false,
      // sourcemap: false,
      compact: true,
    };

    const packageJSONContent = getFileText(
      content,
      'package.json',
    );

    if (packageJSONContent) {
      try {
        pkg = JSON.parse(packageJSONContent);
      } catch (error) {
        throw invalidPackageJSONError(error.message);
      }
    }

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

      // Escape script ending tags that may appear within strings,
      // so that they don't break the server-rendered HTML.
      src = code.replace('</script>', '<\\/script>');

      // If sourcemaps are enabled, tack them onto the end inline.
      if (enableSourcemap && map !== null && !debug) {
        // Note that map.toUrl breaks in Web Worker as window.btoa is not defined.
        // Inspired by https://github.com/Rich-Harris/magic-string/blob/abf373f2ed53d00e184ab236828853dd35a62763/src/SourceMap.js#L31
        src +=
          '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,' +
          niceBTOA(map.toString());
        // src += '\n//# sourceMappingURL=' + map.toUrl();
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
      // Detect missing import error from vizLoad plugin.
      if (
        error.code === 'PLUGIN_ERROR' &&
        error.plugin === 'vizLoad' &&
        error.hook === 'load'
      ) {
        // Remove unwieldy vizId from warning message,
        // but keep slugs.
        // Example:
        // Missing import: Could not load 7f0b69fcb754479699172d1887817027/missing.js (imported by 7f0b69fcb754479699172d1887817027/index.js): Imported file "missing.js" not found.

        const cleanMessage = error.message.replace(
          /[0-9a-f]{32}\//g,
          '',
        );
        throw missingImportError(cleanMessage);
      }

      throw rollupError(error.message);
    }
  }

  for (const warning of warnings) {
    // In VizHub, we want to treat certain warnings as errors.
    if (warning.code === 'UNRESOLVED_IMPORT') {
      // We don't treat it as an external dependency,
      // so remove that message text as it may be confusing.
      const cleanMessage = warning.message.replace(
        ' – treating it as an external dependency',
        '',
      );
      throw missingImportError(cleanMessage);
    }
  }

  if (debug) {
    console.log('  returning src in build.ts:');
    console.log('  src:');
    console.log(src?.slice(0, 200));
  }

  if (debug) {
    console.log('  warnings:');
    console.log(JSON.stringify(warnings, null, 2));
  }

  return {
    warnings,
    src,
    pkg,
    cssFiles: Array.from(cssFilesSet),
    time: Date.now() - startTime,
  };
};
