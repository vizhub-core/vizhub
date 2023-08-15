import { RefObject, useEffect, useMemo, useRef } from 'react';
import { getRuntimeVersion } from '../../accessors/getRuntimeVersion';
import { Content } from 'entities';
// import V2Worker from './v2Runtime/v2RuntimeWorker?worker';
// import { computeSrcDoc } from './v2Runtime/computeSrcDoc';

// Sets up either the v2 or v3 runtime environment.
// Meant to support dynamic switching between the two.
export const useRuntime = ({
  iframeRef,
  content,
}: {
  iframeRef: RefObject<HTMLIFrameElement>;
  content: Content;
}) => {
  // This ref is used to skip the first mount.
  const initialMount = useRef(true);

  // Either 2 or 3.
  const runtimeVersion = useMemo(() => getRuntimeVersion(content), [content]);

  // The v3 runtime worker.
  // const v3RuntimeWorker = useRef<Worker>();

  // // Load the v3 runtime worker.
  // useEffect(() => {
  //   if (runtimeVersion === 3) {
  //     v3RuntimeWorker.current = new Worker(
  //       new URL('./v2Runtime/v2RuntimeWorker.ts', import.meta.url),
  //     );
  //   }
  // }, [runtimeVersion]);

  // Compute V2 updates on the main thread.
  useEffect(() => {
    // We don't need to execute a "run" on first render,
    // because SSR handles the initial run by injecting
    // the srcdoc into the page server-side.
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    // The following code only runs after the user
    // has edited the code and the files have changed.

    if (runtimeVersion === 2) {
      // // Debounce the updates.
      const timeout = setTimeout(async () => {
        // v2RuntimeWorker.current.postMessage({ content });

        // Set process on global scope so computeSrcDoc doesn't break.
        globalThis.process = {};

        const { computeSrcDoc } = await import('./v2Runtime/computeSrcDoc');

        // console.log(computeSrcDoc);
        const srcdoc = await computeSrcDoc(content);
        if (iframeRef.current) {
          iframeRef.current.srcdoc = srcdoc;
        }
      }, 800);

      return () => {
        clearTimeout(timeout);
      };
    }

    // TODO ref editorDemo
    // if (runtimeVersion === 3) {
    //   // Debounce the updates.
    //   // TODO throttle uppdates during interactions
    //   // ref VZCode server
    //   const timeout = setTimeout(() => {
    //     v3RuntimeWorker.current.postMessage({
    //       type: 'run',
    //       files: content.files,
    //     });
    //   }, 800);

    //   return () => {
    //     clearTimeout(timeout);
    //   };
    // }
  }, [content.files, runtimeVersion]);

  // Receive messages from v2 runtime worker.
  // useEffect(() => {
  //   if (runtimeVersion === 2) {
  //     const handleMessage = (event) => {
  //       if (event.data.type === 'error') {
  //         console.error(event.data.error);
  //       } else {
  //         if (iframeRef.current) {
  //           iframeRef.current.srcdoc = event.data.srcdoc;
  //         }
  //       }
  //     };
  //     v2RuntimeWorker.current.onmessage = handleMessage;

  //     // Support dynamic switching between v2 and v3.
  //     return () => {
  //       v2RuntimeWorker.current.onmessage = null;
  //     };
  //   }
  // }, [runtimeVersion]);
};
