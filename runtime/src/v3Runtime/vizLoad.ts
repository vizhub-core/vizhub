// A custom Rollup plugin to:
//  * Implement a virtual file system
//  * Support importing across vizzes
// Unified Rollup plugin for virtual file system and viz imports
// Combines functionalities of 'virtual' and 'importFromViz' plugins
import { InputPluginOption } from 'rollup';
import { Content, VizId, getFileText } from 'entities';
import { VizCache } from './vizCache';
import { ResolvedVizFileId } from './types';
import { parseId } from './parseId';

const debug = false;

export const vizLoad = ({
  vizCache,
  trackCSSImport,
}: {
  vizId: VizId;
  vizCache: VizCache;
  trackCSSImport: (cssFile: ResolvedVizFileId) => void;
}): InputPluginOption => ({
  name: 'vizLoad',

  // `id` here is of the form
  // `{vizId}/{fileName}`
  load: async (id: ResolvedVizFileId) => {
    if (debug) {
      console.log('vizResolve: load() ' + id);
    }

    const { vizId, fileName } = parseId(id);

    if (debug) {
      console.log('  [vizResolve] vizId: ' + vizId);
      console.log('  [vizResolve] fileName: ' + fileName);
    }

    // For CSS imports, all we need to do here is
    // keep track of them so they can be injected
    // into the IFrame later.
    if (fileName.endsWith('.css')) {
      if (debug) {
        console.log(
          '    [vizResolve] tracking CSS import for ' + id,
        );
      }
      trackCSSImport(id);
      return '';
    }

    if (debug) {
      console.log(
        '    [vizResolve] tracking JS import for ' + id,
      );
    }

    // For JS imports, we need to recursively resolve
    // the imports of the imported viz.
    const content: Content = await vizCache.get(vizId);
    return getFileText(content, fileName);
  },
});
