import { rollup } from '@rollup/browser';
import { build } from './build';
import { VizCache, createVizCache } from './vizCache';
import { Content, VizId } from 'entities';
import { V3BuildResult, V3WorkerMessage } from './types';
import { svelteCompilerUrl } from './transformSvelte';
import { computeSrcDocV3 } from './computeSrcDocV3';

const debug = false;

// Generate a unique request ID
const generateRequestId = (): string =>
  (Math.random() + '').slice(2);

// Tracks pending promises for 'contentResponse' messages
const pendingContentResponsePromises = new Map();

// Tracks pending promises for 'resolveSlugResponse' messages
const pendingResolveSlugResponsePromises = new Map();

// Create a viz cache that's backed by the main thread
let vizCache: VizCache = createVizCache({
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

  // Since the same slug could be requested multiple times
  // in quick succession, we need to support multiple
  // pending requests for the same slug.
  // We do this by generating a unique ID for each request.
  const requestId = generateRequestId();
  const message: V3WorkerMessage = {
    type: 'resolveSlugRequest',
    slugKey,
    requestId,
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
      requestId,
      resolve,
    );
  });
};

// Inspired by
// https://github.com/sveltejs/sites/blob/master/packages/repl/src/lib/workers/bundler/index.js#L44
// unpkg doesn't set the correct MIME type for .cjs files
// https://github.com/mjackson/unpkg/issues/355
const getSvelteCompiler = async () => {
  const compiler = await fetch(svelteCompilerUrl).then(
    (r) => r.text(),
  );
  (0, eval)(compiler);

  // console.log(self.svelte);
  // @ts-ignore
  return self.svelte.compile;
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

      let error: Error | undefined;
      let buildResult: V3BuildResult | undefined;
      try {
        buildResult = await build({
          vizId,
          enableSourcemap,
          rollup,
          vizCache,
          resolveSlug,
          getSvelteCompiler,
        });
      } catch (e) {
        if (debug) console.error(e);
        error = e;
      }

      // Post the result of the build process
      const responseMessage: V3WorkerMessage = {
        type: 'buildResponse',
        buildResult,
        error,
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
          message.requestId,
        );
      if (resolver) {
        resolver(message.vizId);
        pendingResolveSlugResponsePromises.delete(
          message.requestId,
        );
      }
      break;
    }

    case 'resetSrcdocRequest': {
      // Invalidate viz cache for changed vizzes.
      const { vizId, changedVizIds } = message;
      for (const changedVizId of changedVizIds) {
        vizCache.invalidate(changedVizId);
      }

      // Compute a fresh build/
      let error: Error | undefined;
      let buildResult: V3BuildResult | undefined;
      try {
        buildResult = await build({
          vizId,
          enableSourcemap: true,
          rollup,
          vizCache,
          resolveSlug,
          getSvelteCompiler,
        });
      } catch (e) {
        if (debug) console.error(e);
        error = e;
      }

      let srcdoc: string | undefined;
      if (buildResult !== undefined) {
        srcdoc = await computeSrcDocV3({
          vizCache,
          buildResult,
        });
      }

      // Post the result of the build process
      const responseMessage: V3WorkerMessage = {
        type: 'resetSrcdocResponse',
        srcdoc,
        error,
      };
      postMessage(responseMessage);

      break;
    }
  }
});
