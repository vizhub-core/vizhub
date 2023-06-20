import magicSandbox from './magicSandbox';
import { getComputedIndexHtml } from './getComputedIndexHtml';
import { transformFiles } from './transformFiles';

// Inspired by https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/presenters/src/computeSrcDoc.js

export const computeSrcDoc = (files) => {
  return magicSandbox(getComputedIndexHtml(files), transformFiles(files));
};
