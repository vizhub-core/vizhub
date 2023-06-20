import { File, Files } from 'entities';

// Transform files to the format expected by magicSandbox.
export const transformFiles = (files: Files) =>
  Object.values(files)

    // Filter out index.html, which is handled separately.
    .filter((file: File) => file.name !== 'index.html')

    .reduce((accumulator, file) => {
      accumulator[file.name] = {
        content: file.text,
      };
      return accumulator;
    }, {});
