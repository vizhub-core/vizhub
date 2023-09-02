// Consider this "ideal export"
//github.com/vizhub-core/vizhub/tree/01cadfb78a2611df32f981b1fd8136b70447de9e/prototypes/idealExport
// Also consider
// https://github.com/curran/vite-d3-template
import { Files } from 'entities';
// import { randomId } from 'vzcode/src/randomId';
import { generateExportZip } from './generateExportZip';

// const v2PackageJSON: File = {
//   name: 'package.json',
//   text: ``, // TODO merge viz package.json with Vite template stuff
// };

const augment = (files: Files): Files => {
  return {
    ...files,
    // [randomId]: v2PackageJSON,
  };
};

export const generateExportZipV3 = (
  files: Files,
  fileName: string,
) => {
  generateExportZip(augment(files), fileName);
};
