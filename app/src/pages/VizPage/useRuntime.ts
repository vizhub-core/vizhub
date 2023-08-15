import { RefObject, useEffect, useMemo, useRef } from 'react';
import { getRuntimeVersion } from '../../accessors/getRuntimeVersion';
import { Content } from 'entities';

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

  const runtimeVersion = useMemo(() => getRuntimeVersion(content), [content]);

  const v2RuntimeWorker = useRef<Worker | null>(null);

  const v3RuntimeWorker = useRef<Worker | null>(null);

  // Load the v2 runtime worker.
  useEffect(() => {
    if (runtimeVersion === 2) {
      v2RuntimeWorker.current = new Worker(
        new URL('./v2Runtime/v2RuntimeWorker.ts', import.meta.url),
      );
    }
  }, [runtimeVersion]);

  // Load the v3 runtime worker.
  useEffect(() => {
    if (runtimeVersion === 3) {
      v3RuntimeWorker.current = new Worker(
        new URL('./v2Runtime/v2RuntimeWorker.ts', import.meta.url),
      );
    }
  }, [runtimeVersion]);

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
      // Debounce the updates.
      const timeout = setTimeout(() => {
        v2RuntimeWorker.current.postMessage({
          type: 'computeSrcdoc',
          files: content.files,
        });

        if (iframeRef.current) {
          iframeRef.current.srcdoc = 'TODO compute this from worker';
        }
      }, 800);

      return () => {
        clearTimeout(timeout);
      };
    }

    if (runtimeVersion === 3) {
      // Debounce the updates.
      // TODO throttle uppdates during interactions
      // ref VZCode server
      const timeout = setTimeout(() => {
        v3RuntimeWorker.current.postMessage({
          type: 'run',
          files: content.files,
        });
      }, 800);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [content.files, runtimeVersion]);
};
