import { Content, VizId } from 'entities';

export type VizCache = {
  get: (vizId: string) => Promise<Content>;
  set: (content: Content) => void;
  invalidate: (vizId: string) => void;
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
  // Track the content of cached vizzes.
  const contentMap = new Map<VizId, Content>(
    initialContents.map((content) => [content.id, content]),
  );

  // Gets the content of a viz.
  // Returns the cached content if it exists.
  // Otherwise, calls handleCacheMiss to fetch the content.
  const get = async (vizId: string): Promise<Content> => {
    const cachedContent: Content | undefined =
      contentMap.get(vizId);

    // Cache hit
    if (cachedContent !== undefined) {
      return cachedContent;
    }

    // Cache miss
    const freshContent = await handleCacheMiss(vizId);

    if (freshContent) {
      contentMap.set(vizId, freshContent);
      return freshContent;
    }

    // TODO surface this error to the user
    throw new Error(
      `Unresolved import from vizId ${vizId}`,
    );
  };

  // Updates the content of a viz in the cache.
  const set = (content: Content) => {
    contentMap.set(content.id, content);
  };

  const invalidate = (vizId: string) => {
    contentMap.delete(vizId);
  };

  return { get, set, invalidate };
};
