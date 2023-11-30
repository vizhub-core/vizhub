import { Content, VizId } from 'entities';

export type VizCache = {
  get: (vizId: string) => Promise<Content>;
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
export const createVizCache = ({
  initialContents,
  handleCacheMiss,
}: {
  initialContents: Array<Content>;
  handleCacheMiss: (vizId: VizId) => Promise<Content>;
}): VizCache => {
  const contentMap = new Map<VizId, Content>();

  // Track the content of the entry point viz.
  // contentMap.set(content.id, content);
  for (const content of initialContents) {
    contentMap.set(content.id, content);
  }

  const get = async (vizId: string): Promise<Content> => {
    const cachedContent = contentMap.get(vizId);
    if (cachedContent) {
      return cachedContent;
    }
    // TODO fetch the viz in this case.
    console.log(`Viz cache miss: ${vizId}`);

    const freshContent = await handleCacheMiss(vizId);

    if (freshContent) {
      contentMap.set(vizId, freshContent);
      return freshContent;
    }

    // TODO move this to tests
    return sampleContent;
  };

  return { get };
};
