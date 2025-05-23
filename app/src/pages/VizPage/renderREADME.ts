import xss from 'xss';
import { marked, Renderer } from 'marked';
// import { gfmHeadingId } from 'marked-gfm-heading-id';

// const xss = (d) => d;

// Use a custom renderer to open links in a new tab.
// Draws from
// https://github.com/markedjs/marked/issues/144
// https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/neoFrontend/src/pages/VizPage/Body/Viewer/DescriptionSection/renderMarkdown.js
const renderer = new Renderer();
// renderer.link = function ({ href, title, text }) {
//   return Renderer.prototype.link
//     .call(this, href, title, text)
//     .replace('<a', '<a target="_blank"');
// };

marked.use(
  {
    renderer,
  },
  // TODO try getting this to work some time maybe
  // gfmHeadingId({
  //   prefix: 'heading-',
  // }),
);
// marked.use();

// Set up the renderer to add IDs to headings.

// Opt out of the default behavior of mangling emails (gets rid of warning).
// .use({ mangle: false, renderer });

// Wraps YouTube embeds in a styled wrapper,
// so that the embed resizes nicely,
// preserving aspect ratio.
const responsiveYouTube = (html) =>
  html.replace(
    /<iframe(.+)youtube(.+)<\/iframe>/g,
    (match: string) =>
      `<div class='responsive-youtube'>${match}</div>`,
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
        // @ts-ignore
        xss(marked.parse(readmeText), {
          // Allow iframes in READMEs
          whiteList: {
            // @ts-ignore
            ...xss.whiteList,
            iframe: [
              'src',
              'width',
              'height',
              'frameborder',
              'allowfullscreen',
            ],
            img: ['src', 'alt', 'width'],
            video: [
              'src',
              'controls',
              'autoplay',
              'loop',
              'muted',
              'width',
            ],
            source: ['src', 'type'],
          },
        }),
      )
    : '';
