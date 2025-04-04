import { VizFile } from '@vizhub/viz-types';
import AdmZip from 'adm-zip';

// Creates the Zip file from the given files.
export const zipFiles = (files: Array<VizFile>): Buffer => {
  const zip = new AdmZip();
  for (const file of files) {
    const { text, name } = file;
    if (text && name) {
      zip.addFile(name, Buffer.alloc(text.length, text));
    }
  }
  return zip.toBuffer();
};
