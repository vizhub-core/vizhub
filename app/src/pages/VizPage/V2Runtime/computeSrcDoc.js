// Inspired by https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/presenters/src/computeSrcDoc.js
import magicSandbox from './magicSandbox';
import { getComputedIndexHtml } from './getComputedIndexHtml';
import { transformFiles } from './transformFiles';

export const computeSrcDoc = (files) => {
  return magicSandbox(getComputedIndexHtml(files), transformFiles(files));
};
