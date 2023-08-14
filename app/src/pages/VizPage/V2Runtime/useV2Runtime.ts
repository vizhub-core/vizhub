import { useEffect, useRef } from 'react';
// import V2RuntimeWorker from './v2RuntimeWorker?worker';

let v2RuntimeWorker: Worker;

if (typeof window !== 'undefined') {
  v2RuntimeWorker = new Worker(
    new URL('./v2RuntimeWorker.js', import.meta.url),
  );
}
// This hook is used to update the srcdoc of the iframe
export const useV2Runtime = ({ setSrcdoc, files }) => {
  // This ref is used to skip the first mount.
  const initialMount = useRef(true);

  // This effect is used to update the srcdoc
  useEffect(() => {
    // If it's the first mount, just update the ref
    // and skip the logic. This is the case of the
    // initial render. In this case the srcdoc is
    // server-rendered and we don't need to compute it.
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    // The following code only runs after the user
    // has edited the code and the files have changed.

    // Debounce the updates.
    const timeout = setTimeout(() => {
      // Update the files in the ShareDB<Content> document.
      v2RuntimeWorker.postMessage({
        type: 'updateFiles',
        files,
      });
      setSrcdoc('TODO compute this from worker');
    }, 800);

    return () => {
      clearTimeout(timeout);
    };
  }, [files]);
};