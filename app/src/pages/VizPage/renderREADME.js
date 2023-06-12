export const renderREADME = (readmeMarkdown, marked, filterXSS) =>
  filterXSS(marked(readmeMarkdown));
