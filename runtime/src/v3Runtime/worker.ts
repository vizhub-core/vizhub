import { rollup } from '@rollup/browser';
import { build } from './build';
import { createVizCache } from './vizCache';
import { Content, Snapshot, VizId } from 'entities';
import { V3WorkerMessage } from './types';

// Track pending promises for 'getContentSnapshotResponse' messages
const pendingPromises = new Map();

// Create a viz cache that's backed by the main thread
const vizCache = createVizCache({
  initialContents: [],
  handleCacheMiss: async (
    vizId: VizId,
  ): Promise<Content> => {
    const message: V3WorkerMessage = {
      type: 'getContentRequest',
      vizId,
    };
    postMessage(message);

    return new Promise((resolve) => {
      pendingPromises.set(vizId, resolve);
    });
  },
});

// Handle messages from the main thread
addEventListener('message', async ({ data }) => {
  const message: V3WorkerMessage = data as V3WorkerMessage;

  switch (message.type) {
    case 'build': {
      const { content, enableSourcemap } = message;

      // Update viz cache with the latest version
      vizCache.set(content);

      // Post the result of the build process
      postMessage(
        await build({
          vizId: content.id,
          enableSourcemap,
          rollup,
          vizCache,
        }),
      );
      break;
    }

    case 'getContentResponse': {
      // Resolve pending promises for content snapshots
      const resolver = pendingPromises.get(message.vizId);
      if (resolver) {
        resolver(message.content);
        pendingPromises.delete(message.vizId);
      }
      break;
    }
  }
});
