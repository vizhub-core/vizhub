import { InputPluginOption } from 'rollup';
import { csvParse, tsvParse } from 'd3-dsv';
import { ResolvedVizFileId } from '../types';
import { parseId } from '../parseId';
import { dsvParseSrc } from './d3-dsv-custom-build/bundle-modified-src';

const debug = false;

const optimize = false;

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
      const parseFunction = isCSV ? 'csvParse' : 'tsvParse';

      if (optimize) {
        return {
          code: `
            ${dsvParseSrc}
            export default ${parseFunction}(\`${code}\`);
          `,
          map: { mappings: '' },
        };
      } else {
        return {
          code: `export default ${JSON.stringify(rows)};`,
          map: { mappings: '' },
        };
      }
    }
    return undefined;
  },
});
