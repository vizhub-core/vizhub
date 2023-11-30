import { Content, VizId } from 'entities';

export type VizCache = {
  get: (vizId: string) => Content;
};

const sampleContent: Content = {
  id: 'sampleContent',
  files: {
    '7548392': {
      name: 'index.js',
      text: `
        import { innerMessage } from './message';
        export const message = "Outer " + innerMessage;
      `,
    },
    '6714854': {
      name: 'message.js',
      text: `
        export const innerMessage = "Inner";
      `,
    },
  },
  title: 'Sample Content for Exporting',
};
// A cache of viz content.
// For use in resolving imports from other vizzes.
// Runs both on the server and in the browser.
export const createVizCache = (
  initialContents: Array<Content>,
): VizCache => {
  const contentMap = new Map<VizId, Content>();

  // Track the content of the entry point viz.
  // contentMap.set(content.id, content);
  for (const content of initialContents) {
    contentMap.set(content.id, content);
  }

  const get = (vizId: string): Content => {
    const content = contentMap.get(vizId);
    if (content) {
      return content;
    }
    // TODO fetch the viz in this case.
    console.log(`Viz cache miss: ${vizId}`);

    // TODO move this to tests
    return sampleContent;
  };

  return { get };
};
