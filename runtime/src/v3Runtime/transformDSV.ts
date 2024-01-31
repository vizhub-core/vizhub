import { InputPluginOption } from 'rollup';
import { csvParse, tsvParse } from 'd3-dsv';
import { ResolvedVizFileId } from './types';
import { parseId } from './parseId';

const debug = false;

// function escapeBackticksAndQuotes(str) {
//   const escapedChars: Array<string> = [];
//   for (let i = 0; i < str.length; i++) {
//     switch (str[i]) {
//       case '`':
//         escapedChars.push('\\`');
//         break;
//       case '"':
//         escapedChars.push('\\"');
//         break;
//       default:
//         escapedChars.push(str[i]);
//     }
//   }
//   return escapedChars.join('');
// }

// export const stringToBase64 =
//   typeof Buffer !== 'undefined'
//     ? (str: string) => Buffer.from(str).toString('base64')
//     : (str: string) =>
//         btoa(
//           new TextEncoder()
//             .encode(str)
//             .reduce(
//               (acc, byte) =>
//                 acc + String.fromCharCode(byte),
//               '',
//             ),
//         );

// function base64Encode(str) {
//   const encoder = new TextEncoder();
//   const encoded = encoder.encode(str);
//   return btoa(String.fromCharCode(...encoded));
// }

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

      // const dsv = escapeBackticksAndQuotes(code);

      const rows = isCSV ? csvParse(code) : tsvParse(code);

      // // Convert rows to a string representation using JSON.stringify
      // KEEP THIS COMMENT FOR REFERENCE
      // This approach worked well, but failed in certain cases where
      // the data contained characters that were not properly escaped,
      // namely the backtick character ` and double quotes ".
      return {
        code: `export default JSON.parse(\`${JSON.stringify(rows)}\`);`,
        map: { mappings: '' },
      };
      // const base64Encoded = base64Encode(
      //   JSON.stringify(rows),
      // );

      // console.log(base64Encoded);
      // return {
      //   code: `
      //     const base64Decode = (str) => {
      //       const bytes = Uint8Array.from(atob(str), c => c.charCodeAt(0));
      //       const decoder = new TextDecoder();
      //       return decoder.decode(bytes);
      //     };
      //     export default JSON.parse(base64Decode('${base64Encoded}'));
      //   `,
      //   map: { mappings: '' },
      // };
    }
    return undefined;
  },
});
