// From https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/presenters/src/getComputedIndexHtml.js

import {
  dependencies,
  getConfiguredLibraries,
  dependencySource,
} from './packageJson';
import { FilesV2 } from 'entities';
import { getText } from './getText';

const isPackageJSONEnabled = true;

let parser;

// If we're in the browser, use native DOMParser.
if (typeof window !== 'undefined') {
  parser = new DOMParser();
}

// Expose a way to inject a DOMParser implementation
// when we're in a Node environment (tests, API server).
export const setJSDOM = (JSDOM) => {
  parser = new new JSDOM().window.DOMParser();
};

const injectBundleScript = (htmlTemplate, files) => {
  const doc = parser.parseFromString(htmlTemplate, 'text/html');
  // console.log('doc', doc);
  if (getText(files, 'bundle.js') && !doc.querySelector('[src="bundle.js"]')) {
    const bundleScriptTag = doc.createElement('script');
    // This will be fed through MagicSandbox.
    bundleScriptTag.src = 'bundle.js';
    doc.body.appendChild(bundleScriptTag);
    return `<!DOCTYPE html>${doc.documentElement.outerHTML}`;
  } else {
    return htmlTemplate;
  }
};

const injectDependenciesScript = (htmlTemplate, files) => {
  const deps = Object.entries(dependencies(files) || {});

  if (deps.length === 0) return htmlTemplate;

  const doc = parser.parseFromString(htmlTemplate, 'text/html');
  const libraries = getConfiguredLibraries(files);

  deps
    .map(([name, version]) => dependencySource({ name, version }, libraries))
    .forEach((url) => {
      const scriptTag = doc.createElement('script');
      scriptTag.src = url;

      doc.head.appendChild(scriptTag);
    });

  return `<!DOCTYPE html>${doc.documentElement.outerHTML}`;
};

export const getComputedIndexHtml = (files: FilesV2) => {
  try {
    const htmlTemplate = getText(files, 'index.html');

    if (!htmlTemplate) {
      return '';
    }

    // console.log('htmlTemplate', htmlTemplate);

    const htmlWithBundleScriptTemplate = injectBundleScript(
      htmlTemplate,
      files
    );

    // console.log('htmlWithBundleScriptTemplate', htmlWithBundleScriptTemplate);
    const indexHtml = injectDependenciesScript(
      htmlWithBundleScriptTemplate,
      files
    );
    // console.log('indexHtml', indexHtml);
    return indexHtml;
  } catch (err) {
    console.log(err);
  }
};
