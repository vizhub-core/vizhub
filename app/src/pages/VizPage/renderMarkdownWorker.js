// This file defines a Web Worker that renders Markdown.
// Inspired by https://github.com/vizhub-core/vizhub/blob/main/prototypes/open-core-first-attempt/packages/vizhub-plugin-viz-page/src/VizPage/Readme/markdownRenderingWorker.js

// Constructs the src attribute of a <script> tag
// that pulls in multiple libraries from JSDelivr
// with only a single network request.
// See https://www.jsdelivr.com/features#combine
export const jsDelivrCombine = (libs) =>
  'https://cdn.jsdelivr.net/combine/' +
  libs.map((lib) => `npm/${lib}`).join(',');

// TODO consider sourcing these from package.json
// We use Marked to render Markdown.
// https://www.npmjs.com/package/marked
const markedVersion = '5.1.0';

// We use xss to sanitize rendered Markdown.
// https://www.npmjs.com/package/xss
// Note: we are not using DOMPurify
// because it does not support Web Workers.
const xssVersion = '1.0.14';

// Load modules in the browser via CDN.
importScripts(
  jsDelivrCombine([
    `marked@${markedVersion}/marked.min.js`,
    `xss@${xssVersion}/dist/xss.min.js`,
  ])
);

// TODO update this to use Vite's build, not JSDelivr
// Inspired by https://github.com/mdn/simple-web-worker/blob/gh-pages/worker.js
onmessage = ({ data }) => {
  postMessage(filterXSS(marked(data)));
};
