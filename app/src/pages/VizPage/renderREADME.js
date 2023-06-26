// import xss from 'xss';

import { marked, Renderer } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';

const xss = (d) => d;

// Use a custom renderer to open links in a new tab.
// Draws from
// https://github.com/markedjs/marked/issues/144
// https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/neoFrontend/src/pages/VizPage/Body/Viewer/DescriptionSection/renderMarkdown.js
const renderer = new Renderer();
renderer.link = function (href, title, text) {
  const link = Renderer.prototype.link.call(this, href, title, text);
  return link.replace('<a', '<a target="_blank"');
};

// Set up the renderer to add IDs to headings.
marked.use(
  gfmHeadingId({
    prefix: 'heading-',
  })
);
// Opt out of the default behavior of mangling emails (gets rid of warning).
marked.use({ mangle: false, renderer });

// Wraps YouTube embeds in a styled wrapper,
// so that the embed resizes nicely,
// preserving aspect ratio.
const responsiveYouTube = (html) =>
  html.replace(
    /<iframe(.+)youtube(.+)<\/iframe>/g,
    (match) => `<div class='responsive-youtube'>${match}</div>`
  );

// Renders README text as HTML.
// Usage:
//   const html = renderREADME('# Hello World!');
// Handles the following:
// - Markdown
// - YouTube embeds
// - XSS sanitization
// - H1 ids
export const renderREADME = (readmeText) =>
  readmeText
    ? responsiveYouTube(
        xss(marked.parse(readmeText), {
          // Allow iframes in READMEs
          whiteList: {
            ...xss.whiteList,
            iframe: [
              'src',
              'width',
              'height',
              'frameborder',
              'allowfullscreen',
            ],
          },
        })
      )
    : '';
