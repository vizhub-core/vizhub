import { InputPluginOption } from 'rollup';
import { ResolvedVizFileId } from './types';
import { parseId } from './parseId';

const debug = false;

// Responsible for tracking which CSS files are imported.
export const vizLoadCSS = ({
  trackCSSImport,
}: {
  trackCSSImport: (cssFile: ResolvedVizFileId) => void;
}): InputPluginOption => ({
  name: 'vizLoadCSS',

  // `id` here is of the form
  // `{vizId}/{fileName}`
  load: async (id: ResolvedVizFileId) => {
    if (debug) {
      console.log('[vizLoadCSS]: load() ' + id);
    }

    const { vizId, fileName } = parseId(id);

    if (debug) {
      console.log('  [vizLoadCSS] vizId: ' + vizId);
      console.log('  [vizLoadCSS] fileName: ' + fileName);
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
    return undefined;
  },
});
