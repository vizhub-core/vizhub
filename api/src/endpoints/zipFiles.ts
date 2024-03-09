import { FileId, Files } from 'entities';
import AdmZip from 'adm-zip';

// Creates the Zip file from the given files.
export const zipFiles = (files: Files): Buffer => {
  const zip = new AdmZip();
  Object.keys(files).forEach((fileId: FileId) => {
    const { text, name } = files[fileId];
    zip.addFile(name, Buffer.alloc(text.length, text));
  });
  return zip.toBuffer();
};
