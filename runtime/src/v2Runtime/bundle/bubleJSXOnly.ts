// Derived from https://github.com/rollup/rollup-plugin-buble/blob/master/src/index.js
// import { transform } from 'buble-jsx-only';

import { transform } from 'buble';
// import { createFilter } from 'rollup-pluginutils';

export default function buble(options) {
  if (!options) options = {};
  // var filter = createFilter(
  //   options.include,
  //   options.exclude,
  // );

  if (!options.transforms) options.transforms = {};
  options.transforms.modules = false;

  return {
    name: 'buble',

    transform: function (code, id) {
      // if (!filter(id)) return null;

      try {
        return transform(code, options);
      } catch (e) {
        e.plugin = 'buble';
        if (!e.loc) e.loc = {};
        e.loc.file = id;
        e.frame = e.snippet;
        throw e;
      }
    },
  };
}
