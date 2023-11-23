import { Content, FilesV2, getFileText } from 'entities';
import magicSandbox from './magicSandbox';
import { getComputedIndexHtml } from './getComputedIndexHtml';
import { transformFiles } from './transformFiles';
import { bundle } from './bundle';
import { v3FilesToV2Files } from './v3FilesToV2Files';

// Inspired by https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/presenters/src/computeSrcDoc.js

export const computeSrcDocV2 = async (content: Content) => {
  // Migrate V3 files to V2 files.
  let filesV2: FilesV2 = v3FilesToV2Files(content.files);

  // Since we do not include `bundle.js` in the migrated content,
  // we need to add it back in, computed from the files on the fly.
  // ... but only if there is an `index.js` file.
  const indexJS = getFileText(content, 'index.js');
  if (indexJS) {
    const filesV2BundleJSOnly = await bundle(filesV2);
    // Bundle the files using Rollup.
    // This will add a `bundle.js` file to the files.
    // Includes ES module bundling and JSX support.
    filesV2 = [...filesV2, ...filesV2BundleJSOnly];
  }

  // Compute the index.html file from the files.
  const template = getComputedIndexHtml(filesV2);

  // Transform files to match what MagicSandbox expects.
  const files = transformFiles(filesV2);

  // Use MagicSandbox to inject the bundle.js script tag.
  return magicSandbox(template, files);
};
