import { rollup } from '@rollup/browser';
import { build } from './build';
import { createVizCache } from './vizCache';
import { Content, VizId } from 'entities';
import { V3WorkerMessage } from './types';

const debug = false;

// Tracks pending promises for 'contentResponse' messages
const pendingContentResponsePromises = new Map();

// Tracks pending promises for 'resolveSlugResponse' messages
const pendingResolveSlugResponsePromises = new Map();

// Create a viz cache that's backed by the main thread
const vizCache = createVizCache({
  initialContents: [],
  handleCacheMiss: async (
    vizId: VizId,
  ): Promise<Content> => {
    const message: V3WorkerMessage = {
      type: 'contentRequest',
      vizId,
    };

    if (debug) {
      console.log(
        '[build worker] sending content request message to main thread',
        message,
      );
    }
    postMessage(message);

    return new Promise((resolve) => {
      pendingContentResponsePromises.set(vizId, resolve);
    });
  },
});

// Create a slug resolver that's backed by the main thread
const resolveSlug = ({
  userName,
  slug,
}): Promise<VizId> => {
  const slugKey = `${userName}/${slug}`;
  const message: V3WorkerMessage = {
    type: 'resolveSlugRequest',
    slugKey,
  };

  if (debug) {
    console.log(
      '[build worker] sending resolve slug request message to main thread',
      message,
    );
  }
  postMessage(message);

  return new Promise((resolve) => {
    pendingResolveSlugResponsePromises.set(
      slugKey,
      resolve,
    );
  });
};

// Handle messages from the main thread
addEventListener('message', async ({ data }) => {
  const message: V3WorkerMessage = data as V3WorkerMessage;

  switch (message.type) {
    case 'buildRequest': {
      const { vizId, enableSourcemap } = message;

      if (debug) {
        console.log(
          '[build worker] received build request message from main thread',
          message,
        );
      }

      // Post the result of the build process
      const responseMessage: V3WorkerMessage = {
        type: 'buildResponse',
        buildResult: await build({
          vizId,
          enableSourcemap,
          rollup,
          vizCache,
          resolveSlug,
        }),
      };
      postMessage(responseMessage);
      break;
    }

    case 'contentResponse': {
      // Resolve pending promises for content snapshots
      const resolver = pendingContentResponsePromises.get(
        message.vizId,
      );
      if (resolver) {
        resolver(message.content);
        pendingContentResponsePromises.delete(
          message.vizId,
        );
      }
      break;
    }

    case 'invalidateVizCacheRequest': {
      if (debug) {
        console.log(
          '[build worker] received invalidateVizCacheRequest',
          message,
        );
      }
      const { changedVizIds } = message;

      // Invalidate the viz cache for the changed vizzes.
      // This will cause the worker to re-fetch the content
      // of those vizzes the next time it needs them.
      for (const vizId of changedVizIds) {
        vizCache.invalidate(vizId);
      }

      const responseMessage: V3WorkerMessage = {
        type: 'invalidateVizCacheResponse',
      };
      postMessage(responseMessage);
      break;
    }

    // Resolve pending promises for slug resolution
    case 'resolveSlugResponse': {
      const resolver =
        pendingResolveSlugResponsePromises.get(
          message.slugKey,
        );
      if (resolver) {
        resolver(message.vizId);
        pendingResolveSlugResponsePromises.delete(
          message.slugKey,
        );
      }
      break;
    }
  }
});
