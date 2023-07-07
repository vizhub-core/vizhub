import { Content, FilesV2 } from 'entities';
import magicSandbox from './magicSandbox';
import { getComputedIndexHtml } from './getComputedIndexHtml';
import { transformFiles } from './transformFiles';
import { bundle } from './bundle';
import { v3FilesToV2Files } from './v3FilesToV2Files';

// Inspired by https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/presenters/src/computeSrcDoc.js

export const computeSrcDoc = (content: Content) => {
  // Migrate V3 files to V2 files.
  const files: FilesV2 = v3FilesToV2Files(content.files);

  // Since we do not include `bundle.js` in the migrated content,
  // we need to add it back in, computed from the files on the fly.
  files.push({
    name: 'bundle.js',
    text: bundle(files),
  });

  return magicSandbox(
    getComputedIndexHtml(files),
    transformFiles(content.files)
  );
};
