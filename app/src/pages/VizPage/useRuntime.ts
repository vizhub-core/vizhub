import {
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Content } from 'entities';
import { getRuntimeVersion } from '../../accessors/getRuntimeVersion';
import { toV3RuntimeFiles } from './v3Runtime/toV3RuntimeFiles';

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
  const runtimeVersion = useMemo(
    () => getRuntimeVersion(content),
    [content],
  );

  // Set up the v3 runtime.
  useEffect(() => {
    if (runtimeVersion === 3) {
      // Lazy load the v3 runtime.
      import('./v3Runtime/setupV3Runtime').then(
        ({ setupV3Runtime }) => {
          const iframe = iframeRef.current;
          const initialFiles = toV3RuntimeFiles(
            content.files,
          );
          setupV3Runtime({ iframe, initialFiles });
        },
      );
    }
  }, [runtimeVersion]);

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

        // Lazy load computeSrcDoc because it's a large chunk.
        const { computeSrcDoc } = await import(
          './v2Runtime/computeSrcDoc'
        );

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
  }, [content.files, runtimeVersion]);
};
