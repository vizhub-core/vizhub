import { FileV2, FilesV2 } from 'entities';
import { FileCollection } from 'magic-sandbox';

// Transform files to the format expected by magicSandbox.
export const transformFiles = (
  files: FilesV2,
): FileCollection =>
  Object.values(files)

    // Filter out index.html, which is handled separately.
    .filter((file: FileV2) => file.name !== 'index.html')

    .reduce((accumulator, file) => {
      accumulator[file.name] = file.text;
      return accumulator;
    }, {});
