import { InputPluginOption } from 'rollup';
import { Content, getFileText } from 'entities';
import { VizCache } from './vizCache';
import { ResolvedVizFileId } from './types';
import { parseId } from './parseId';

const debug = false;

export const vizLoadJS = ({
  vizCache,
}: {
  vizCache: VizCache;
}): InputPluginOption => ({
  name: 'vizLoadJS',

  // `id` here is of the form
  // `{vizId}/{fileName}`
  load: async (id: ResolvedVizFileId) => {
    if (debug) {
      console.log('vizLoadJS: load() ' + id);
    }

    const { vizId, fileName } = parseId(id);

    if (debug) {
      console.log('  [vizLoadJS] vizId: ' + vizId);
      console.log('  [vizLoadJS] fileName: ' + fileName);
    }

    if (debug) {
      console.log(
        '    [vizLoadJS] tracking JS import for ' + id,
      );
    }

    // For JS imports, we need to recursively resolve
    // the imports of the imported viz.
    const content: Content = await vizCache.get(vizId);
    return getFileText(content, fileName);
  },
});
