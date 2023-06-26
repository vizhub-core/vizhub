export const renderREADME = (readmeMarkdown, renderMarkdown, xss) =>
  readmeMarkdown
    ? xss(renderMarkdown.parse(readmeMarkdown), {
        // Allow iframes in READMEs
        whiteList: {
          ...xss.whiteList,
          iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
        },
      })
    : '';
