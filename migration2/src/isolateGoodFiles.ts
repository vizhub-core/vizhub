import { ContentV2, FileV2, FilesV2 } from 'entities';

// Check if files is even usable.
const filesAreValid = (contentV2: ContentV2) =>
  contentV2.files && contentV2.files.length > 0;

// Exclude bundle.js in our analysis.
// It contains noise like sourcemaps and transpiled JSX.
export const getGoodFiles = (files: FilesV2) =>
  files.filter((file: FileV2) => file.name !== 'bundle.js');

export const isolateGoodFiles = (
  content: ContentV2,
): FilesV2 | null => {
  if (!filesAreValid(content)) {
    return null;
  }
  const goodFiles = getGoodFiles(content.files);
  return goodFiles.length === 0 ? null : goodFiles;
};
