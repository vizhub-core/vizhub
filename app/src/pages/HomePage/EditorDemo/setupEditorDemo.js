import { createEditor } from './createEditor';
import { files } from './files';
import { srcdoc } from './srcdoc';

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

export const setupEditorDemo = ({ codemirrorContainer, iframe }) => {
  const worker = new Worker(new URL('./worker.js', import.meta.url));

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
  let state = IDLE;

  let latestFiles = files;

  // This runs when any file is changed.
  const handleCodeChange = (files) => {
    latestFiles = files;
    if (state === IDLE) {
      requestAnimationFrame(update);
      state = ENQUEUED;
    } else if (state === PENDING_CLEAN) {
      state = PENDING_DIRTY;
    }
  };

  // Builds and runs the latest files.
  const update = async () => {
    state = PENDING_CLEAN;
    await run(await build(latestFiles));
    if (state === PENDING_DIRTY) {
      requestAnimationFrame(update);
      state = ENQUEUED;
    } else {
      state = IDLE;
    }
  };

  const times = [];
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const profile = false;
  const n = 100;

  const build = (files) =>
    new Promise((resolve, reject) => {
      worker.onmessage = ({ data }) => {
        const { errors, warnings, src, pkg, time } = data;

        if (profile) {
          times.push(time);
          // Every n times, log the rolling average.
          if (times.length % n === 0) {
            console.log(avg(times.slice(times.length - n)));
          }
        }

        if (errors.length > 0) {
          return console.log(errors);
        }
        if (warnings.length > 0) {
          return console.log(warnings);
        }
        resolve({ src, pkg, warnings });
      };
      worker.postMessage({ files, enableSourcemap: true });
    });

  let isFirstRun = true;
  const run = ({ src, pkg, warnings }) =>
    new Promise((resolve, reject) => {
      if (isFirstRun) {
        isFirstRun = false;
        // TODO reset srcdoc when dependencies change
        iframe.srcdoc = srcdoc({ pkg, src });
        resolve();
      } else {
        window.onmessage = ({ data }) => {
          if (data.type === 'runDone') {
            resolve();
          }
        };
        iframe.contentWindow.postMessage({ type: 'runJS', src }, '*');
      }
    });

  createEditor({
    codemirrorContainer,
    doc: files['scatterPlot.js'],
    onChange: (newDoc) => {
      handleCodeChange({
        ...files,
        ['scatterPlot.js']: newDoc,
      });
    },
  });

  // Kick off the initial render
  // TODO work out race conditions,
  // make sure iframe and worker are both primed
  handleCodeChange({
    ...files,
  });
  // const initializeIframe = () =>
  //   new Promise((resolve) => {
  //     iframe.contentWindow.onmessage = ({ data }) => {
  //       if (data.type === 'initDone') {
  //         resolve();
  //       }
  //     };
  //     iframe.contentWindow.postMessage({ type: 'init' }, '*');
  //   });
};
