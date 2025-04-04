import { VizContent, VizId } from "@vizhub/viz-types";

export type VizCache = {
  get: (vizId: string) => Promise<VizContent>;
  set: (content: VizContent) => void;
  invalidate: (vizId: string) => void;
};

// A cache of viz content.
// For use in resolving imports from other vizzes.
// Runs both on the server and in the browser.
export const createVizCache = ({
  initialContents,
  handleCacheMiss,
}: {
  initialContents: Array<VizContent>;
  handleCacheMiss: (vizId: VizId) => Promise<VizContent>;
}): VizCache => {
  // Track the content of cached vizzes.
  const contentMap = new Map<VizId, VizContent>(
    initialContents.map((content) => [content.id, content]),
  );

  // Gets the content of a viz.
  // Returns the cached content if it exists.
  // Otherwise, calls handleCacheMiss to fetch the content.
  const get = async (vizId: string): Promise<VizContent> => {
    const cachedContent: VizContent | undefined =
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
  const set = (content: VizContent) => {
    contentMap.set(content.id, content);
  };

  const invalidate = (vizId: string) => {
    contentMap.delete(vizId);
  };

  return { get, set, invalidate };
};
