// Wraps YouTube embeds in a styled wrapper,
// so that the embed resizes nicely,
// preserving aspect ratio.
const responsiveYouTube = (html) =>
  html.replace(
    /<iframe(.+)youtube(.+)<\/iframe>/g,
    (match) => `<div class='responsive-youtube'>${match}</div>`
  );

export const renderREADME = (readmeMarkdown, renderMarkdown, xss) =>
  readmeMarkdown
    ? responsiveYouTube(
        xss(renderMarkdown.parse(readmeMarkdown), {
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
