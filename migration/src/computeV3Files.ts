import { Content, Files, FileV2, FilesV2 } from 'entities';
import { v4 as uuid } from 'uuid';

// A file ID is an 8 character uuid (random characters).
const generateFileId = () => uuid().substring(0, 8);

export const computeV3Files = (
  goodFiles: FilesV2,
  oldContentV3?: Content,
): Files => {
  let getFileId: (file?: FileV2) => string = generateFileId;

  // If we fork from an existing V3 viz,
  // optimize the file diffs.
  // Not relevant for the primordial viz.
  if (oldContentV3) {
    const keys = Object.keys(oldContentV3.files);

    const fileIdByName = new Map<string, string>(
      keys.map((fileId) => [
        oldContentV3.files[fileId].name,
        fileId,
      ]),
    );
    const fileIdByText = new Map<string, string>(
      keys.map((fileId) => [
        oldContentV3.files[fileId].text,
        fileId,
      ]),
    );

    // Try to match on the name, in case text was changed (most common case).
    // Try to match on the text, in case name was changed (file renamed).
    // If no match, consider it a new file and mint a new file id.
    getFileId = (file) =>
      (file && fileIdByName.get(file.name)) ||
      (file && fileIdByText.get(file.text)) ||
      generateFileId();
  }

  const filesOutOfOrder = goodFiles.reduce(
    (accumulator, file) => ({
      ...accumulator,
      [getFileId(file)]: file,
    }),
    {},
  );

  const files = {};

  // Ensure ordering of keys matches that of the files
  // in the forked from viz, to minimize JSON1 OT Diff.
  if (oldContentV3) {
    Object.keys(oldContentV3.files).forEach((fileId) => {
      if (fileId in filesOutOfOrder) {
        files[fileId] = filesOutOfOrder[fileId];
      }
    });
  }

  // Get the rest, whatever wasn't in forkedFrom viz
  Object.keys(filesOutOfOrder).forEach((fileId) => {
    files[fileId] = filesOutOfOrder[fileId];
  });

  return files;
};
