import { InputPluginOption } from 'rollup';
import { ResolvedVizFileId } from './types';
import { parseId } from './parseId';
import { Content, getFileText } from 'entities';
import { VizCache } from './vizCache';

const debug = false;

// Responsible for loading all imports and
// tracking which CSS files are imported.
// Throws an error if a file is imported but not found.
export const vizLoad = ({
  vizCache,
  trackCSSImport,
}: {
  vizCache: VizCache;
  trackCSSImport: (cssFile: ResolvedVizFileId) => void;
}): InputPluginOption => ({
  name: 'vizLoad',

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
      // The import is tracked here so that it can be
      // injected into the IFrame later, external to the
      // Rollup build.
      trackCSSImport(id);
      // TODO consider using Rollup's `emitFile` to emit a CSS file.
      return '';
    }

    const content: Content = await vizCache.get(vizId);
    const fileText = getFileText(content, fileName);

    // If a file is imported but not found, throw an error.
    if (fileText === null) {
      throw new Error(
        `Imported file "${fileName}" not found.`,
      );
      // TODO ideally show username/slug instead of vizId
      // `Imported file "${fileName}" not found in viz ${vizId}`,
      // `Imported file "${fileName}" not found.`,
      // );
    }

    return fileText;
  },
});
