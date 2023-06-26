// Allow iframes in READMEs
const xssOptions = {
  whiteList: {
    iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
  },
};

export const renderREADME = (readmeMarkdown, renderMarkdown, xss) =>
  readmeMarkdown ? xss(renderMarkdown.parse(readmeMarkdown)) : '';
