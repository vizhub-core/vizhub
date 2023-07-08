import { Content, FilesV2 } from 'entities';
import { getFileText } from '../../../accessors/getFileText';
import magicSandbox from './magicSandbox';
import { getComputedIndexHtml } from './getComputedIndexHtml';
import { transformFiles } from './transformFiles';
import { bundle } from './bundle';
import { v3FilesToV2Files } from './v3FilesToV2Files';

// Inspired by https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/presenters/src/computeSrcDoc.js

export const computeSrcDoc = (content: Content) => {
  // Migrate V3 files to V2 files.
  let filesV2: FilesV2 = v3FilesToV2Files(content.files);

  // Since we do not include `bundle.js` in the migrated content,
  // we need to add it back in, computed from the files on the fly.
  // ... but only if there is an `index.js` file.
  const indexJS = getFileText(content, 'index.js');
  if (indexJS) {
    filesV2 = [...filesV2, ...bundle(filesV2)];
  }

  const template = getComputedIndexHtml(filesV2);

  console.log('here', template);
  const files = transformFiles(filesV2);

  return magicSandbox(template, files);
};