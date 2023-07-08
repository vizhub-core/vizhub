import { FilesV2 } from 'entities';

// From https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/presenters/src/accessors.js#L23
const getFileIndex = (files: FilesV2, name: string) => {
  for (let i = 0; i < files.length; i++) {
    if (files[i].name === name) {
      return i;
    }
  }
  return -1;
};

const getFile = (files: FilesV2, name: string) =>
  files[getFileIndex(files, name)];

export const getText = (files: FilesV2, name: string) => {
  const file = getFile(files, name);
  return file ? file.text || '' : '';
};
