export const renderREADME = (readmeMarkdown, renderMarkdown, filterXSS) =>
  readmeMarkdown ? filterXSS(renderMarkdown.parse(readmeMarkdown)) : '';
