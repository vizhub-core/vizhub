// A custom Rollup plugin to:
//  * Implement a virtual file system
//  * Support importing across vizzes
// Unified Rollup plugin for virtual file system and viz imports
// Combines functionalities of 'virtual' and 'importFromViz' plugins
import { InputPluginOption } from 'rollup';
import { extractVizImport } from './extractVizImport';
import { ResolvedVizFileId } from './types';
import { parseId } from './parseId';
import { VizId } from '@vizhub/viz-types';
import { isVizId } from '@vizhub/viz-utils';

const debug = false;

export const vizResolve = ({
  vizId,
  resolveSlug,
}: {
  vizId: VizId;
  resolveSlug?: ({
    userName,
    slug,
  }: {
    userName: string;
    slug: string;
  }) => Promise<VizId>;
}): InputPluginOption => ({
  name: 'vizResolve',
  resolveId: async (
    id: string,
    importer: string | undefined,
  ): Promise<ResolvedVizFileId | undefined> => {
    if (debug) {
      console.log('[vizIdResolve] resolveId() ' + id);
      console.log('  importer: ' + importer);
    }

    // Handle virtual file system resolution
    // .e.g. `import { foo } from './foo.js'`
    // .e.g. `import { foo } from './foo'`
    if (
      id.startsWith('./') &&
      !importer?.startsWith('https://')
    ) {
      let fileName = id.substring(2);

      // Handle CSS files
      // e.g. `import './styles.css'`
      // Handle JS files
      // e.g. `import { foo } from './foo.js'`
      // e.g. `import { foo } from './foo'`
      if (
        !fileName.endsWith('.js') &&
        !fileName.endsWith('.css') &&
        !fileName.endsWith('.csv') &&
        !fileName.endsWith('.svelte')
      ) {
        fileName += '.js';
      }

      // const js = (name: string) =>
      // name.endsWith('.js') ? name : name + '.js';

      // If there is an importer, then the file is not part of
      // the entry point, so it should be resolved relative
      // to the importer's directory
      if (importer) {
        const {
          vizId: importerVizId,
          fileName: importerFileName,
        } = parseId(importer);
        // Get the directory of the importing file
        const importerDir = importerFileName
          .split('/')
          .slice(0, -1)
          .join('/');
        // Combine the directory with the imported file name
        const resolvedFileName = importerDir
          ? `${importerDir}/${fileName}`
          : fileName;
        return `${importerVizId}/${resolvedFileName}`;
      }
      return vizId + '/' + fileName;
    }

    // Handle viz import resolution
    // e.g. `import { foo } from '@curran/98e6d6509a1e407897d4f238a330efec'`
    // e.g. `import { foo } from '@curran/scatter-plot'`
    const vizImport = extractVizImport(id);
    if (vizImport) {
      let vizId: VizId;
      if (isVizId(vizImport.idOrSlug)) {
        vizId = vizImport.idOrSlug;
      } else {
        if (!resolveSlug) {
          throw new Error(
            'resolveSlug is required to import by slug',
          );
        }
        vizId = await resolveSlug({
          userName: vizImport.userName,
          slug: vizImport.idOrSlug,
        });
      }
      return vizId + '/index.js';
    }

    // If neither condition is met, return undefined.
    return undefined;
  },
});
