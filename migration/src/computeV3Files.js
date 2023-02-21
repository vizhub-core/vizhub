import { v4 as uuid } from 'uuid';

// A file ID is an 8 character uuid (random characters).
const generateFileId = () => uuid().substr(0, 8);

export const computeV3Files = (goodFiles, forkedFromContentV3) => {
  let getFileId = generateFileId;

  // If we fork from an existing V3 viz,
  // optimize the file diffs.
  // Not relevant for the primordial viz.
  if (forkedFromContentV3) {
    const keys = Object.keys(forkedFromContentV3.files);

    const fileIdByName = new Map(
      keys.map((fileId) => [forkedFromContentV3.files[fileId].name, fileId])
    );
    const fileIdByText = new Map(
      keys.map((fileId) => [forkedFromContentV3.files[fileId].text, fileId])
    );

    // Try to match on the name, in case text was changed (most common case).
    // Try to match on the text, in case name was changed (file renamed).
    // If no match, consider it a new file and mint a new file id.
    getFileId = (file) =>
      fileIdByName.get(file.name) ||
      fileIdByText.get(file.text) ||
      generateFileId();
  }

  const filesOutOfOrder = goodFiles.reduce(
    (accumulator, file) => ({ ...accumulator, [getFileId(file)]: file }),
    {}
  );

  const files = {};

  // Ensure ordering of keys matches that of the files
  // in the forked from viz, to minimize JSON1 OT Diff.
  if (forkedFromContentV3) {
    Object.keys(forkedFromContentV3.files).forEach((fileId) => {
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
