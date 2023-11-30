import { Content } from 'entities';

export type VizCache = {
  get: (vizId: string) => Content;
};

const sampleContent: Content = {
  id: 'viz1',
  files: {
    '7548392': {
      name: 'index.js',
      text: 'export const message = "Sample Message";',
    },
  },
  title: 'Sample Content for Exporting',
};
// A cache of viz content.
// For use in resolving imports from other vizzes.
// Runs both on the server and in the browser.
export const createVizCache = (): VizCache => {
  const get = (vizId: string): Content => {
    return sampleContent;
  };
  return { get };
};
