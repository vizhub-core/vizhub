import {
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Content } from 'entities';
import { getRuntimeVersion } from 'entities/src/accessors/getRuntimeVersion';
import { toV3RuntimeFiles } from '../../runtime/v3Runtime/toV3RuntimeFiles';
import { V3RuntimeFiles } from '../../runtime/v3Runtime/types';

// Sets up either the v2 or v3 runtime environment.
// Meant to support dynamic switching between the two.
export const useRuntime = ({
  iframeRef,
  content,
  setSrcdocError,
}: {
  iframeRef: RefObject<HTMLIFrameElement>;
  content: Content;
  setSrcdocError: (error: string | null) => void;
}) => {
  // This ref is used to skip the first mount.
  const initialMount = useRef(true);

  // `runtimeVersion` is used to determine which runtime
  // to use. It's either 2 or 3.
  const runtimeVersion: number = useMemo(
    () => getRuntimeVersion(content),
    [content],
  );

  const v3Runtime = useRef<{
    handleCodeChange: (files: V3RuntimeFiles) => void;
  } | null>(null);

  // Set up the v3 runtime.
  useEffect(() => {
    if (runtimeVersion === 3) {
      // Load the v3 runtime.
      import('../../runtime/v3Runtime/setupV3Runtime').then(
        ({ setupV3Runtime }) => {
          const iframe = iframeRef.current;
          // const initialFiles = toV3RuntimeFiles(
          //   content.files,
          // );
          v3Runtime.current = setupV3Runtime({
            iframe,
            // initialFiles,
            setSrcdocError,
          });

          // TODO expose handleCodeChange so we can
          // update the runtime when the code changes.
        },
      );
    }
  }, [runtimeVersion]);

  // Send file updates to the V3 runtime
  useEffect(() => {
    // We don't need to execute a "run" on first render,
    // because SSR handles the initial run by injecting
    // the srcdoc into the page server-side.
    if (initialMount.current) {
      return;
    }

    if (v3Runtime.current && content.files) {
      v3Runtime.current.handleCodeChange(
        toV3RuntimeFiles(content.files),
      );
    }
  }, [content.files, runtimeVersion, v3Runtime]);

  // Compute V2 updates on the main thread.
  useEffect(() => {
    // We don't need to execute a "run" on first render,
    // because SSR handles the initial run by injecting
    // the srcdoc into the page server-side.
    if (initialMount.current) {
      return;
    }

    // The following code only runs after the user
    // has edited the code and the files have changed.
    if (runtimeVersion === 2) {
      // // Debounce the updates.
      const timeout = setTimeout(async () => {
        // v2RuntimeWorker.current.postMessage({ content });

        // Set process on global scope so computeSrcDoc doesn't break.
        // @ts-ignore
        globalThis.process = {};

        // Lazy load computeSrcDoc because it's a large chunk.
        const { computeSrcDocV2 } = await import(
          '../../runtime/v2Runtime/computeSrcDocV2'
        );

        // console.log(computeSrcDoc);
        try {
          const srcdoc = await computeSrcDocV2(content);
          if (iframeRef.current) {
            iframeRef.current.srcdoc = srcdoc;
          }
        } catch (e) {
          // TODO QA this code path, ideally add tests
          console.log(
            'TODO QA this code path, ideally add tests',
          );
          setSrcdocError(e.message);
        }
      }, 800);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [content.files, runtimeVersion]);

  // Track the initial mount.
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
  }, []);
};
