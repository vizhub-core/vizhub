import { InputPluginOption } from 'rollup';
import { csvParse, tsvParse } from 'd3-dsv';
import { ResolvedVizFileId } from '../types';
import { parseId } from '../parseId';
import { dsvParseSrc } from './d3-dsv-custom-build/bundle-modified-src';

const debug = false;

const optimize = true;

// Escape backticks in a string so that it can be
// used in a template literal. Also need to escape backslashes.
const escapeBackticks = (str: string) =>
  // str.replace(/`/g, '\\`');
  str.replace(/\\/g, '\\\\').replace(/`/g, '\\`');

// Responsible for loading CSV and TSV files, which are
// in general called Delimiter-Separated Values (DSV).
export const transformDSV = (): InputPluginOption => ({
  name: 'transformDSV',

  // `id` here is of the form
  // `{vizId}/{fileName}`
  transform: async (
    text: string,
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

      const parseFunction = isCSV ? 'csvParse' : 'tsvParse';

      if (optimize) {
        return {
          code: `
            ${dsvParseSrc}
            const data = ${parseFunction}(\`${escapeBackticks(text)}\`);
            export default data;
          `,
          map: { mappings: '' },
        };
      } else {
        const rows = isCSV
          ? csvParse(text)
          : tsvParse(text);
        return {
          code: `export default ${JSON.stringify(rows)};`,
          map: { mappings: '' },
        };
      }
    }
    return undefined;
  },
});
