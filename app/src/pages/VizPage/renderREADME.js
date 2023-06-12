export const renderREADME = (readmeMarkdown, marked, filterXSS) =>
  readmeMarkdown ? filterXSS(marked.parse(readmeMarkdown)) : '';
