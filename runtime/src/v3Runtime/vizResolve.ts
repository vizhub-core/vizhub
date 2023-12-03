// A custom Rollup plugin to:
//  * Implement a virtual file system
//  * Support importing across vizzes
// Unified Rollup plugin for virtual file system and viz imports
// Combines functionalities of 'virtual' and 'importFromViz' plugins
import { InputPluginOption } from 'rollup';
import { extractVizImport } from './extractVizImport';
import { Content, VizId, getFileText } from 'entities';
import { VizCache } from './vizCache';
import { ResolvedVizFileId } from './types';

const debug = false;

export const parseId = (
  id: ResolvedVizFileId,
): {
  vizId: VizId;
  fileName: string;
} => {
  const [vizId, fileName]: [VizId, string] = id.split(
    '/',
  ) as [VizId, string];
  return { vizId, fileName };
};

export const vizResolve = ({
  vizId,
  vizCache,
  trackCSSImport,
}: {
  vizId: VizId;
  vizCache: VizCache;
  trackCSSImport: (cssFile: ResolvedVizFileId) => void;
}): InputPluginOption => ({
  name: 'vizResolve',
  resolveId: (
    id: string,
    importer: string | undefined,
  ): ResolvedVizFileId | undefined => {
    if (debug) {
      console.log('vizResolve: resolveId() ' + id);
      console.log('  importer: ' + importer);
    }

    // Handle virtual file system resolution
    // .e.g. `import { foo } from './foo.js'`
    // .e.g. `import { foo } from './foo'`
    if (id.startsWith('./')) {
      // const fileName = js(id.substring(2));

      let fileName = id.substring(2);

      // Handle CSS files
      // e.g. `import './styles.css'`
      // Handle JS files
      // e.g. `import { foo } from './foo.js'`
      // e.g. `import { foo } from './foo'`
      if (
        !fileName.endsWith('.js') &&
        !fileName.endsWith('.css')
      ) {
        fileName += '.js';
      }

      // const js = (name: string) =>
      // name.endsWith('.js') ? name : name + '.js';

      // If there is an importer, then the file not part of
      // the entry point, so it should be resolved relative
      // to the importer viz.
      if (importer) {
        const { vizId: importerVizId } = parseId(importer);
        return importerVizId + '/' + fileName;
      }
      return vizId + '/' + fileName;
    }

    // Handle viz import resolution
    // e.g. `import { foo } from '@curran/98e6d6509a1e407897d4f238a330efec'`
    // e.g. `import { foo } from '@curran/scatter-plot'`
    const vizImport = extractVizImport(id);
    if (vizImport) {
      return vizImport.vizId + '/index.js';
    }

    // If neither condition is met, return null
    return undefined;
  },

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
