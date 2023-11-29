// Virtual file system for Rollup
// A Rollup plugin for a virtual file system.
// Inspired by https://github.com/Permutatrix/rollup-plugin-hypothetical/blob/master/index.js

import { InputPluginOption } from 'rollup';
import { V3RuntimeFiles } from '.';

const js = (name: string) =>
  name.endsWith('.js') ? name : name + '.js';

export const virtual = (
  files: V3RuntimeFiles,
): InputPluginOption => ({
  name: 'virtual',
  resolveId: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 20));

    console.log(`resolving id: ${id}`);

    // If the id starts with './', then it's a relative path
    return id.startsWith('./') ? id : null;

    // If we are import from another viz, like this:
    // import { message } from "@curran/21f72bf74ef04ea0b9c9b82aaaec859a";
    // import { message } from "@curran/scatter-plot";
    //
  },
  load: (id: string) =>
    id.startsWith('./') ? files[js(id.substring(2))] : null,
});
