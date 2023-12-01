// @ts-ignore
import Worker from './worker.ts?worker';
import {
  V3BuildResult,
  V3WindowMessage,
  V3WorkerMessage,
} from './types';
import { Content } from 'entities';

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

export const setupV3Runtime = ({
  iframe, // initialFiles,
  setSrcdocError,
}: {
  iframe: HTMLIFrameElement;
  // initialFiles: V3RuntimeFiles;
  setSrcdocError: (error: string | null) => void;
}) => {
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

  // Tracks the latest content.
  let latestContent: Content | null = null;

  // Pending promise resolvers.
  let pendingBuildPromise:
    | ((buildResult: V3BuildResult) => void)
    | null = null;
  let pendingRunPromise: (() => void) | null = null;

  // Logic around profiling build times.
  const profileBuildTimes = debug;
  let buildTimes: Array<number> = [];
  const avg = (arr: Array<number>) =>
    arr.reduce((a, b) => a + b, 0) / arr.length;
  const n = 100;

  // This runs when the build worker sends a message.
  worker.addEventListener('message', ({ data }) => {
    const message: V3WorkerMessage =
      data as V3WorkerMessage;

    if (message.type === 'buildResponse') {
      const buildResult: V3BuildResult =
        message.buildResult;

      if (profileBuildTimes) {
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

      if (pendingBuildPromise) {
        pendingBuildPromise(buildResult);
        pendingBuildPromise = null;
      } else {
        // Sanity check.
        // Should never happen.
        throw new Error(
          '[v3 runtime] build worker sent message with no pending promise',
        );
      }
    }
  });

  // This runs when the IFrame sends a message.
  window.addEventListener('message', ({ data }) => {
    if (
      data.type === 'runDone' ||
      data.type === 'runError'
    ) {
      if (pendingRunPromise) {
        // TODO pass errors out for display
        // pendingRunPromise(data as V3WindowMessage);
        pendingRunPromise();
        pendingRunPromise = null;
      } else {
        // Sanity check.
        // Should never happen.
        throw new Error(
          '[v3 runtime] iframe sent message with no pending promise',
        );
      }
    }
  });

  // This runs when any file is changed.
  const handleCodeChange = (content: Content): void => {
    latestContent = content;
    if (state === IDLE) {
      state = ENQUEUED;
      update();
    } else if (state === PENDING_CLEAN) {
      state = PENDING_DIRTY;
    }
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

  // Builds and runs the latest files.
  const update = async () => {
    state = PENDING_CLEAN;
    if (debug) {
      console.log('update: before run');
    }
    if (latestContent === null) {
      // Should never happen.
      throw new Error('latestContent is null');
    }
    await run(await build(latestContent));
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

  // const build = (
  //   content: Content,
  // ): Promise<V3BuildResult> =>
  //   new Promise((resolve) => {
  //     worker.onmessage = ({ data }) => {
  //       const responseMessage = data as V3WorkerMessage;
  //       if (responseMessage.type === 'buildResponse') {
  //         const { errors, warnings, src, pkg, time } =
  //           responseMessage.buildResult;

  //         if (profileBuildTimes) {
  //           buildTimes.push(time);
  //           // Every n times, log the rolling average.
  //           if (buildTimes.length % n === 0) {
  //             console.log(
  //               'Average build time: ' +
  //                 avg(buildTimes) +
  //                 ' ms',
  //             );
  //             buildTimes = [];
  //           }
  //         }

  //         resolve({ src, pkg, errors, warnings, time });
  //       }
  //     };
  //     const requestMessage: V3WorkerMessage = {
  //       type: 'buildRequest',
  //       content,
  //       enableSourcemap: true,
  //     };
  //     worker.postMessage(requestMessage);
  //   });

  const build = (content: Content) => {
    return new Promise<V3BuildResult>((resolve) => {
      pendingBuildPromise = resolve;
      const message: V3WorkerMessage = {
        type: 'buildRequest',
        content,
        enableSourcemap: true,
      };
      worker.postMessage(message);
    });
  };

  // // Runs the latest code.
  // // TODO reset srcdoc when dependencies change
  // const run = ({
  //   src,
  //   warnings,
  //   errors,
  // }: V3BuildResult): Promise<void> =>
  //   new Promise((resolve) => {
  //     // If there were build errors,
  //     // display them and don't run.
  //     if (errors.length > 0) {
  //       setSrcdocError(
  //         errors.map((error) => error.message).join('\n\n'),
  //       );
  //       resolve();
  //       return;
  //     }

  //     // If we're here, then there were no build errors.

  //     // If there were build warnings,
  //     // display them.
  //     if (warnings.length > 0) {
  //       // TODO distinguish between warnings and errors in UI
  //       setSrcdocError(warnings.join('\n\n'));
  //     } else {
  //       // If there were no warnings,
  //       // clear the error message.
  //       setSrcdocError(null);
  //     }

  //     // Run the code.
  //     window.onmessage = ({ data }) => {
  //       const message: V3WindowMessage =
  //         data as V3WindowMessage;
  //       if (message.type === 'runDone') {
  //         if (debug) {
  //           console.log('got runDone');
  //         }
  //         resolve();
  //       }
  //       if (message.type === 'runError') {
  //         if (debug) {
  //           console.log('got runError');
  //           console.log(message.error);
  //         }
  //         // TODO pass error out for display
  //         resolve();
  //       }
  //     };

  //     if (iframe.contentWindow === null) {
  //       // Should never happen.
  //       console.log('iframe.contentWindow is null');
  //     } else {
  //       if (src === undefined) {
  //         // TODO make sure the error is displayed
  //         if (debug) {
  //           console.log('src is undefined');
  //         }
  //       } else {
  //         const message: V3WindowMessage = {
  //           type: 'runJS',
  //           src,
  //         };
  //         iframe.contentWindow.postMessage(
  //           message,
  //           // '*',
  //           window.location.origin,
  //         );
  //       }
  //     }
  //   });
  const run = (buildResult: V3BuildResult) => {
    return new Promise<void>((resolve) => {
      const { src, warnings, errors } = buildResult;

      // Handle build errors
      if (errors.length > 0) {
        setSrcdocError(
          errors.map((error) => error.message).join('\n\n'),
        );
        resolve();
        return;
      }

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
        setSrcdocError(
          warnings
            .map((warning) => warning.message)
            .join('\n\n'),
        );
      } else {
        setSrcdocError(null); // Clear error message if no warnings
      }

      if (iframe.contentWindow) {
        const message: V3WindowMessage = {
          type: 'runJS',
          src,
        };
        iframe.contentWindow.postMessage(
          message,
          window.location.origin,
        );
      }
    });
  };

  // Kick off the initial render
  // TODO work out race conditions,
  // make sure iframe and worker are both primed
  // TODO initialization handshake to avoid race condition bugs
  // using "ping" and "pong"

  return { handleCodeChange };
};
