// @ts-ignore
import Worker from './worker.ts?worker';

import {
  ResolvedVizFileId,
  V3BuildResult,
  V3WindowMessage,
  V3WorkerMessage,
} from './types';
import { Content, VizId, getFileText } from 'entities';
import { parseId } from './parseId';
import { cleanRollupErrorMessage } from './cleanRollupErrorMessage';

// Flag for debugging.
const debug = false;

// Nothing happening.
const IDLE = 'IDLE';

// An update has been enqueued
// via requestAnimationFrame.
const ENQUEUED = 'ENQUEUED';

// An update (build and run) is pending,
// and the files have not changed.
const PENDING_CLEAN = 'PENDING_CLEAN';

// An update (build and run) is pending,
// and the files have changed
// while this run is taking place.
const PENDING_DIRTY = 'PENDING_DIRTY';

export type V3Runtime = {
  // Performs a hot reload of a new build.
  handleCodeChange: (content: Content) => void;

  // Performs a hot reload of a new build.
  invalidateVizCache: (changedVizIds: Array<VizId>) => void;

  // Performs a hard reset of the srcdoc and
  // entire runtime environment.
  resetSrcdoc: (changedVizIds: Array<VizId>) => void;
};

export const setupV3Runtime = ({
  vizId,
  iframe,
  setSrcdocErrorMessage,
  getLatestContent,
  resolveSlugKey,
  writeFile,
}: {
  vizId: VizId;
  iframe: HTMLIFrameElement;
  setSrcdocErrorMessage: (error: string | null) => void;
  getLatestContent: (vizId: VizId) => Promise<Content>;
  resolveSlugKey: (slugKey: string) => Promise<VizId>;
  writeFile: (fileName: string, content: string) => void;
}): V3Runtime => {
  // The "build worker", a Web Worker that does the building.
  const worker = new Worker();

  // Valid State Transitions:
  //
  //  * IDLE --> ENQUEUED
  //    When the system is idle and files are changed.
  //
  //  * ENQUEUED --> PENDING_CLEAN
  //    When the pending changes run.
  //
  //  * PENDING_CLEAN --> IDLE
  //    When the pending update finishes running
  //    and files were not changed in the mean time.
  //
  //  * PENDING_CLEAN --> PENDING_DIRTY
  //    When files are changed while an update is pending.
  //
  //  * PENDING_DIRTY --> ENQUEUED
  //    When the pending update finishes running
  //    and files were changed in the mean time.
  //
  // When a build error happens, the state is set to IDLE.
  // This is to prevent a build error from causing
  // the whole system to stop working.
  //
  // Valid State Transitions (with build errors):
  // TODO complete this section

  let state:
    | typeof IDLE
    | typeof ENQUEUED
    | typeof PENDING_CLEAN
    | typeof PENDING_DIRTY = IDLE;

  if (debug) {
    setInterval(() => {
      console.log('state', state);
    }, 1000);
  }

  // Pending promise resolvers.
  let pendingBuildPromise:
    | ((buildResult?: V3BuildResult) => void)
    | null = null;
  let pendingRunPromise: (() => void) | null = null;

  // Logic around profiling build times.
  const profileBuildTimes = debug;
  let buildTimes: Array<number> = [];
  const avg = (arr: Array<number>) =>
    arr.reduce((a, b) => a + b, 0) / arr.length;
  const n = 100;

  // This runs when the build worker sends a message.
  worker.addEventListener('message', async ({ data }) => {
    const message: V3WorkerMessage =
      data as V3WorkerMessage;

    // Handle 'buildResponse' messages.
    // These are sent by the build worker in response
    // to a 'buildRequest' message.
    if (message.type === 'buildResponse') {
      const buildResult: V3BuildResult | undefined =
        message.buildResult;
      const error: Error | undefined = message.error;

      if (profileBuildTimes && buildResult) {
        buildTimes.push(buildResult.time);
        // Every n times, log the rolling average.
        if (buildTimes.length % n === 0) {
          console.log(
            'Average build time: ' +
              avg(buildTimes) +
              ' ms',
          );
          buildTimes = [];
        }
      }

      // Regardless of whether the build succeeded or failed,
      // resolve the pending build promise,
      // so that the system remains responsive.
      if (pendingBuildPromise) {
        pendingBuildPromise(buildResult);
        pendingBuildPromise = null;
      }

      if (error) {
        setSrcdocErrorMessage(
          cleanRollupErrorMessage({
            rawMessage: error.message,
            vizId,
          }),
        );
      }
    }

    // Handle 'contentRequest' messages.
    // These are sent by the worker when it needs
    // to get the content of a file, in order to
    // populate its VizCache.
    if (message.type === 'contentRequest') {
      const { vizId } = message;

      const content = await getLatestContent(vizId);

      const contentResponseMessage: V3WorkerMessage = {
        type: 'contentResponse',
        vizId: message.vizId,
        content,
      };

      if (debug) {
        console.log(
          '[v3 runtime] received contentRequest, sending contentResponse',
          contentResponseMessage,
        );
      }

      // Send the content back to the worker.
      worker.postMessage(contentResponseMessage);
    }

    // Handle 'resolveSlugRequest' messages.
    // These are sent by the worker when it needs
    // to resolve a slug import to a viz ID.
    if (message.type === 'resolveSlugRequest') {
      const { slugKey } = message;

      const resolveSlugResponseMessage: V3WorkerMessage = {
        type: 'resolveSlugResponse',
        slugKey,
        requestId: message.requestId,
        vizId: await resolveSlugKey(slugKey),
      };

      if (debug) {
        console.log(
          '[v3 runtime] received resolveSlugRequest, sending resolveSlugResponse',
          resolveSlugResponseMessage,
        );
      }
      // Send the viz ID back to the worker.
      worker.postMessage(resolveSlugResponseMessage);
    }

    // Handle 'invalidateVizCacheResponse' messages.
    // These are sent by the worker in response to
    // an 'invalidateVizCacheRequest' message.
    if (message.type === 'invalidateVizCacheResponse') {
      if (debug) {
        console.log(
          '[v3 runtime] received invalidateVizCacheResponse',
          message,
        );
      }
      // Leverage existing infra for executing the hot reloading.
      handleCodeChange();
    }

    if (message.type === 'resetSrcdocResponse') {
      const srcdoc: string | undefined = message.srcdoc;
      const error: Error | undefined = message.error;

      if (error) {
        setSrcdocErrorMessage(
          cleanRollupErrorMessage({
            rawMessage: error.message,
            vizId,
          }),
        );
      } else {
        setSrcdocErrorMessage(null);

        // Really reset the srcdoc!
        // console.log('Really reset the srcdoc!');
        if (srcdoc) {
          iframe.srcdoc = srcdoc;
        }
      }
    }
  });

  // This runs when the IFrame sends a message.
  window.addEventListener('message', ({ data }) => {
    // Handle 'runDone' and 'runError' messages.
    // These happen in response to sending a 'runJS' message.
    if (
      data.type === 'runDone' ||
      data.type === 'runError'
    ) {
      // console.log('got ' + data.type);
      if (pendingRunPromise) {
        // TODO pass errors out for display
        // pendingRunPromise(data as V3WindowMessage);
        pendingRunPromise();
        pendingRunPromise = null;
      }
    }
    if (data.type === 'runError') {
      setSrcdocErrorMessage(data.error.message);
    }
    if (data.type === 'writeFile') {
      if (data.fileName && data.content) {
        writeFile(data.fileName, data.content);
      }
    }
  });

  const handleCodeChange = () => {
    if (state === IDLE) {
      state = ENQUEUED;
      update();
    } else if (state === PENDING_CLEAN) {
      state = PENDING_DIRTY;
    }
  };

  // This runs when one or more imported vizzes are changed.
  const invalidateVizCache = (
    changedVizIds: Array<VizId>,
  ): void => {
    // Send a message to the worker to invalidate the cache.
    const message: V3WorkerMessage = {
      type: 'invalidateVizCacheRequest',
      changedVizIds,
    };
    worker.postMessage(message);
  };

  const profileHotReloadFPS = true;
  let updateCount = 0;
  if (profileHotReloadFPS) {
    setInterval(() => {
      if (debug && updateCount > 0) {
        console.log(
          updateCount +
            ' hot reload' +
            (updateCount !== 1 ? 's' : '') +
            ' in the last second',
        );
      }
      updateCount = 0;
    }, 1000);
  }

  const build = () => {
    return new Promise<V3BuildResult | undefined>(
      (resolve) => {
        pendingBuildPromise = resolve;
        const message: V3WorkerMessage = {
          type: 'buildRequest',
          vizId,
          enableSourcemap: true,
        };
        worker.postMessage(message);
      },
    );
  };

  // Builds and runs the latest files.
  const update = async () => {
    state = PENDING_CLEAN;
    if (debug) {
      console.log('update: before run');
    }

    // Build the code. This may fail and return `undefined`.
    const buildResult: V3BuildResult | undefined =
      await build();

    // If the build was successful, run the code.
    if (buildResult !== undefined) {
      await run(buildResult);
    }

    if (debug) {
      console.log('update: after run');
    }
    updateCount++;
    // TypeScript can't comprehend that `state`
    // may change during the await calls above.
    // @ts-ignore
    if (state === PENDING_DIRTY) {
      requestAnimationFrame(update);
      state = ENQUEUED;
    } else {
      state = IDLE;
    }
  };

  let previousCSSFiles: Array<ResolvedVizFileId> = [];
  const run = (buildResult: V3BuildResult) => {
    return new Promise<void>((resolve) => {
      const { src, warnings, cssFiles } = buildResult;

      // Sanity check.
      // At this point, since there were no errors,
      // we expect there to be a `src` property.
      // This should never happen, but log & error just in case!
      if (src === undefined) {
        if (debug) {
          console.log(
            '[v3 runtime] src is undefined, but no errors!',
          );
        }
        throw new Error(
          '[v3 runtime] src is undefined, but no errors!',
        );
      }

      // Set pendingRunPromise because at this point,
      // we expect an asynchronous response when the run is done.
      // The iframe should send either a `runDone` or `runError` message.
      pendingRunPromise = resolve;

      // Handle build warnings
      if (warnings.length > 0) {
        // TODO: Distinguish between warnings and errors in UI
        setSrcdocErrorMessage(
          warnings
            .map((warning) => warning.message)
            .join('\n\n'),
        );
      } else {
        setSrcdocErrorMessage(null); // Clear error message if no warnings
      }

      if (iframe.contentWindow) {
        // For each cssFiles
        for (const cssFile of cssFiles) {
          const { vizId, fileName } = parseId(cssFile);

          getLatestContent(vizId).then((content) => {
            const src = getFileText(content, fileName);

            if (src === null) {
              // The file doesn't exist.
              // TODO surface this error to the user
              // in a nicer way than this.
              console.warn(
                `Imported CSS file ${fileName} doesn't exist.`,
              );
              return;
            }

            // TODO only inject CSS if it has changed.
            const runCSSMessage: V3WindowMessage = {
              type: 'runCSS',
              id: cssFile,
              src,
            };

            if (debug) {
              console.log('runCSSMessage', runCSSMessage);
            }

            iframe.contentWindow?.postMessage(
              runCSSMessage,
              window.location.origin,
            );
          });
        }

        // Detect which CSS files have been removed
        // and remove them from the iframe.
        const removedCSSFiles = previousCSSFiles.filter(
          (id) => !cssFiles.includes(id),
        );
        previousCSSFiles = cssFiles;
        if (debug) {
          console.log('removedCSSFiles', removedCSSFiles);
        }
        for (const id of removedCSSFiles) {
          const removeCSSMessage: V3WindowMessage = {
            type: 'runCSS',
            id,
            src: '',
          };
          iframe.contentWindow?.postMessage(
            removeCSSMessage,
            window.location.origin,
          );
        }

        // Clear the console before each run.
        console.clear();

        const runJSMessage: V3WindowMessage = {
          type: 'runJS',
          src,
        };
        iframe.contentWindow.postMessage(
          runJSMessage,
          window.location.origin,
        );
      }
    });
  };

  const resetSrcdoc = (changedVizIds: Array<VizId>) => {
    state = IDLE;
    pendingBuildPromise = null;
    pendingRunPromise = null;
    const message: V3WorkerMessage = {
      type: 'resetSrcdocRequest',
      vizId,
      changedVizIds,
    };
    worker.postMessage(message);
  };

  return {
    handleCodeChange,
    invalidateVizCache,
    resetSrcdoc,
  };
};
