// Virtual file system for Rollup
// A Rollup plugin for a virtual file system.
// Inspired by https://github.com/Permutatrix/rollup-plugin-hypothetical/blob/master/index.js

import { InputPluginOption } from 'rollup';
import { extractVizImport } from './extractVizImport';
import { Content, VizId } from 'entities';
import { VizCache } from './vizCache';

export const importFromViz = (
  vizCache: VizCache,
): InputPluginOption => ({
  name: 'importFromViz',
  // If we are import from another viz, like this:
  // import { message } from "@curran/21f72bf74ef04ea0b9c9b82aaaec859a";
  // import { message } from "@curran/scatter-plot";
  // then this import is the responsibility of this plugin.
  resolveId: async (id: string) => {
    const vizImport = extractVizImport(id);
    if (vizImport) {
      console.log('importFromViz: resolveId() ' + id);
      return vizImport.vizId;
    } else {
      return null;
    }
  },
  load: (id: string) => {
    const vizId: VizId = id as VizId;
    const content: Content = vizCache.get(vizId);
    console.log('importFromViz: load() ' + id);
    console.log('  content:');
    console.log(content);
    return "export const message = 'Hello, fake viz!';";
  },
});
