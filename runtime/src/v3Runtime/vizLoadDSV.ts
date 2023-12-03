import { InputPluginOption } from 'rollup';
import { csvParse, tsvParse } from 'd3-dsv';
import { Content, getFileText } from 'entities';
import { VizCache } from './vizCache';
import { ResolvedVizFileId } from './types';
import { parseId } from './parseId';

const debug = false;

// Responsible for loading CSV and TSV files, which are
// in general called Delimiter-Separated Values (DSV).
export const vizLoadDSV = ({
  vizCache,
}: {
  vizCache: VizCache;
}): InputPluginOption => ({
  name: 'vizLoadDSV',

  // `id` here is of the form
  // `{vizId}/{fileName}`
  load: async (id: ResolvedVizFileId) => {
    if (debug) {
      console.log('[vizLoadDSV]: load() ' + id);
    }

    const { vizId, fileName } = parseId(id);

    if (debug) {
      console.log('  [vizLoadDSV] vizId: ' + vizId);
      console.log('  [vizLoadDSV] fileName: ' + fileName);
    }
    const isCSV = fileName.endsWith('.csv');
    const isTSV = fileName.endsWith('.tsv');
    if (isCSV || isTSV) {
      if (debug) {
        console.log(
          '    [vizLoadDSV] tracking DSV import for ' + id,
        );
      }
      // For CSV imports, we need to get the file content.
      const content: Content = await vizCache.get(vizId);
      const dsvString = getFileText(content, fileName);

      // If a file is imported but not found, return null.
      if (dsvString === null) {
        return null;
      }

      const rows = isCSV
        ? csvParse(dsvString)
        : tsvParse(dsvString);

      // Convert rows to a string representation using JSON.stringify
      return `export default ${JSON.stringify(rows)};`;
    }
    return undefined;
  },
});
