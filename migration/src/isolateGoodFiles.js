// Check if files is even usable.
const filesAreValid = (contentV2) =>
  contentV2.files && contentV2.files.length > 0;

// Exclude bundle.js in our analysis.
// It contains noise like sourcemaps and transpiled JSX.
const getGoodFiles = (files) =>
  files.filter((file) => file.name !== 'bundle.js');

export const isolateGoodFiles = (content) => {
  if (!filesAreValid(content)) {
    return null;
  }
  const goodFiles = getGoodFiles(content.files);
  return goodFiles.length === 0 ? null : goodFiles;
};
