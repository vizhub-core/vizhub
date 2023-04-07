importScripts(
  'https://cdn.jsdelivr.net/npm/rollup@2.79.0/dist/rollup.browser.js'
);

// A Rollup plugin for a virtual file system.
// Inspired by https://github.com/Permutatrix/rollup-plugin-hypothetical/blob/master/index.js

const js = (name) => (name.endsWith('.js') ? name : name + '.js');
const virtual = (files) => ({
  name: 'virtual',
  resolveId: (id) => (id.startsWith('./') ? id : null),
  load: (id) => (id.startsWith('./') ? files[js(id.substring(2))] : null),
});

const parseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    error.code = 'INVALID_PACKAGE_JSON';
    throw error;
  }
};

const getPkg = (files, errors) =>
  'package.json' in files ? parseJSON(files['package.json'], errors) : null;

const getGlobals = (pkg, errors) => {
  const libraries = pkg?.vizhub?.libraries;
  if (libraries) {
    return Object.entries(libraries).reduce(
      (accumulator, [packageName, config]) => {
        accumulator[packageName] = config.global;
        return accumulator;
      },
      {}
    );
  }
  return null;
};

// Rollup cache for incremental builds!
// See https://rollupjs.org/guide/en/#cache
// Manual benchmarks for scatter plot example:
// Without cache: avg = 5.9 ms
// With cache: avg = 5.2 ms
let cache;

const build = async ({ files, enableSourcemap = false }) => {
  const startTime = Date.now();
  const warnings = [];
  const errors = [];
  let src;
  let pkg;

  const inputOptions = {
    input: './index.js',
    plugins: virtual(files),
    onwarn: (warning) => {
      warnings.push(JSON.parse(JSON.stringify(warning)));
    },
    cache,
  };

  const outputOptions = {
    format: 'umd',
    name: 'Viz',
    sourcemap: enableSourcemap ? true : false,
  };

  if ('package.json' in files) {
    pkg = parseJSON(files['package.json'], errors);
    if (pkg) {
      const globals = getGlobals(pkg, errors);
      if (globals) {
        inputOptions.external = Object.keys(globals);
        outputOptions.globals = globals;
      }
    }
  }

  try {
    const bundle = await rollup.rollup(inputOptions);
    cache = bundle.cache;
    const { code, map } = (await bundle.generate(outputOptions)).output[0];

    // TODO benchmark performance and build size with vs. without sourcemaps
    // Idea: no sourcemaps when interacting, sourcemaps after interact is done.
    // Idea: cache builds on the server, don't store builds in ShareDB at all
    src = code;
    // If sourcemaps are enabled, tack them onto the end inline.
    if (enableSourcemap) {
      // Note that map.toUrl breaks in Web Worker as window.btoa is not defined.
      // Inspired by https://github.com/Rich-Harris/magic-string/blob/abf373f2ed53d00e184ab236828853dd35a62763/src/SourceMap.js#L31
      src +=
        '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,' +
        btoa(map.toString());
    }
  } catch (error) {
    console.log('TODO handle this error');
    console.log(error);
    const serializableError = JSON.parse(JSON.stringify(error));
    serializableError.name = error.name;
    serializableError.message = error.message;
    errors.push(serializableError);
  }

  return {
    errors,
    warnings,
    src,
    pkg,
    time: Date.now() - startTime,
  };
};

onmessage = async ({ data }) => {
  postMessage(await build(data));
};
