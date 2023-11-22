import Worker from './worker.ts?worker';
import { BuildResult, V3RuntimeFiles } from './types';

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

  let latestFiles: V3RuntimeFiles | null = null;

  // This runs when any file is changed.
  const handleCodeChange = (
    files: V3RuntimeFiles,
  ): void => {
    latestFiles = files;
    if (state === IDLE) {
      //      requestAnimationFrame(update);
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
    await run(await build(latestFiles));
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

  let buildTimes = [];
  const profileBuildTimes = true;
  const avg = (arr: number[]) =>
    arr.reduce((a, b) => a + b, 0) / arr.length;
  const n = 100;

  const build = (
    files: V3RuntimeFiles,
  ): Promise<BuildResult> =>
    new Promise((resolve) => {
      worker.onmessage = ({ data }) => {
        const { errors, warnings, src, pkg, time } = data;

        if (profileBuildTimes) {
          buildTimes.push(time);
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

        // if (errors.length > 0) {
        //   return console.log(errors);
        // }
        // if (warnings.length > 0) {
        //   return console.log(warnings);
        // }

        resolve({ src, pkg, errors, warnings });
      };
      worker.postMessage({ files, enableSourcemap: true });
    });

  // Runs the latest code.
  // TODO reset srcdoc when dependencies change
  const run = ({
    src,
    warnings,
    errors,
  }: BuildResult): Promise<void> =>
    new Promise((resolve) => {
      // If there were build errors,
      // display them and don't run.
      if (errors.length > 0) {
        setSrcdocError(errors.join('\n\n'));
        resolve();
        return;
      }

      // If we're here, then there were no build errors.

      // If there were build warnings,
      // display them.
      if (warnings.length > 0) {
        // TODO distinguish between warnings and errors in UI
        setSrcdocError(warnings.join('\n\n'));
      } else {
        // If there were no warnings,
        // clear the error message.
        setSrcdocError(null);
      }

      // Run the code.
      window.onmessage = ({ data }) => {
        if (data.type === 'runDone') {
          if (debug) {
            console.log('got run done');
          }
          resolve();
        }
      };
      iframe.contentWindow.postMessage(
        { type: 'runJS', src },
        '*',
      );
    });

  // Kick off the initial render
  // TODO work out race conditions,
  // make sure iframe and worker are both primed
  // TODO initialization handshake to avoid race condition bugs
  // using "ping" and "pong"

  return { handleCodeChange };
};