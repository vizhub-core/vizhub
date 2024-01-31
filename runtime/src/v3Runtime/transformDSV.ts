import { InputPluginOption } from 'rollup';
import { csvParse, tsvParse } from 'd3-dsv';
import { ResolvedVizFileId } from './types';
import { parseId } from './parseId';

const debug = false;

// Responsible for loading CSV and TSV files, which are
// in general called Delimiter-Separated Values (DSV).
export const transformDSV = (): InputPluginOption => ({
  name: 'transformDSV',

  // `id` here is of the form
  // `{vizId}/{fileName}`
  transform: async (
    code: string,
    id: ResolvedVizFileId,
  ) => {
    if (debug) {
      console.log('[transformDSV]: load() ' + id);
    }

    const { vizId, fileName } = parseId(id);

    if (debug) {
      console.log('  [transformDSV] vizId: ' + vizId);
      console.log('  [transformDSV] fileName: ' + fileName);
    }
    const isCSV = fileName.endsWith('.csv');
    const isTSV = fileName.endsWith('.tsv');
    if (isCSV || isTSV) {
      if (debug) {
        console.log(
          '    [transformDSV] tracking DSV import for ' +
            id,
        );
      }

      const rows = isCSV ? csvParse(code) : tsvParse(code);

      // Convert rows to a string representation using JSON.stringify
      return {
        code: `export default JSON.parse(\`${JSON.stringify(rows)}\`);`,
        map: { mappings: '' },
      };
    }
    return undefined;
  },
});
