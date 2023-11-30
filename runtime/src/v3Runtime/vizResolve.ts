// A cutom Rollup plugin to:
//  * Implement a virtual file system
//  * Support importing across vizzes
// Unified Rollup plugin for virtual file system and viz imports
// Combines functionalities of 'virtual' and 'importFromViz' plugins
import { InputPluginOption } from 'rollup';
import { extractVizImport } from './extractVizImport';
import { Content, VizId, getFileText } from 'entities';
import { VizCache } from './vizCache';
import { V3RuntimeFiles } from '.';

const js = (name: string) =>
  name.endsWith('.js') ? name : name + '.js';

export const vizResolve = (
  vizId: VizId,
  vizCache: VizCache,
): InputPluginOption => ({
  name: 'vizResolve',
  resolveId: async (id: string) => {
    console.log('vizResolve: resolveId() ' + id);
    // console.log('  importer: ' + importer);

    // Handle virtual file system resolution
    // .e.g. `import { foo } from './foo.js'`
    // .e.g. `import { foo } from './foo'`
    if (id.startsWith('./')) {
      const fileName = js(id.substring(2));
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
  load: (id: string) => {
    console.log('vizResolve: load() ' + id);

    // Parse vizId and fileName
    const [vizId, fileName]: [VizId, string] = id.split(
      '/',
    ) as [VizId, string];

    const content: Content = vizCache.get(vizId);
    return getFileText(content, fileName);
  },
});
