import {
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {
  Content,
  VizId,
  getRuntimeVersion,
} from 'entities';
import { V3Runtime } from './v3Runtime/setupV3Runtime';

// When `true`, the user can manually trigger a run of the viz
// using various keyboard shortcuts such as CTRL+S.
// TODO enable the following keyboard shortcuts:
// F5: Widely used in many IDEs like Visual Studio, PyCharm, and SQL Server Management Studio to start debugging or run the code.
// Ctrl + Enter: Common in notebook interfaces like Jupyter Notebooks and some SQL editors to execute the current cell or code block.
// Shift + Enter: Also used in Jupyter Notebooks and similar interfaces to run the current cell and move to the next cell.
// Ctrl + F5: In some environments like Visual Studio, it runs the code without starting the debugger.
// F9: Used in some Python IDEs and editors like IDLE to run the selected code.
// Cmd (or Ctrl) + R: Often used in macOS-based IDEs or text editors to run scripts.
// Alt + Enter: Used in some contexts like IntelliJ IDEA to execute code and sometimes for context-specific actions like importing libraries.
// Ctrl + Shift + B: Commonly used in Visual Studio Code to build the project.
// Ctrl + Shift + F10: In IntelliJ IDEA and PyCharm, it's used to run a script or an application.
// F8: In PowerShell ISE and other script editors, it runs the selected portion of the script.
export const enableManualRun = true;

const debug = false;

// Debounce the v3 runtime updates when not interacting
// by this many milliseconds.
const v3RunDebounceMs = 1000;

// Sets up either the v2 or v3 runtime environment.
// Meant to support dynamic switching between the two.
export const useRuntime = ({
  content,
  iframeRef,
  setSrcdocError,
  vizCacheContents,
  isVisual,
}: {
  content: Content;
  iframeRef: RefObject<HTMLIFrameElement>;
  setSrcdocError: (error: string | null) => void;
  vizCacheContents: Record<string, Content>;

  // If this is false, there is no iframeRef.current.
  isVisual: boolean;
}) => {
  // This ref is used to skip the first mount.
  const initialMount = useRef(true);

  // `runtimeVersion` is used to determine which runtime
  // to use. It's either 2 or 3.
  const runtimeVersion: number = useMemo(
    () => getRuntimeVersion(content),
    [content],
  );

  const v3Runtime = useRef<V3Runtime | null>(null);

  const vizCacheContentsRef = useRef(vizCacheContents);

  useEffect(() => {
    vizCacheContentsRef.current = vizCacheContents;
  }, [vizCacheContents]);

  // Handles cache misses for viz content,
  // when a viz imports from another viz.
  const getLatestContent = useCallback(
    async (vizId: VizId): Promise<Content> => {
      // Sanity check, should never happen.
      if (!vizCacheContentsRef.current) {
        throw new Error(
          'vizCacheContentsRef.current is null',
        );
      }

      const content = vizCacheContentsRef.current[vizId];

      // If the viz content for this import is already tracked,
      // then return it.
      if (content) {
        return content;
      } else {
        // TODO make this happen by:
        // * Fetching the viz content from the server
        // * Using a new API endpoint that returns the viz content
        // * Ingesting the snapshot and incorporating it into the vizCacheContents
        throw new Error(
          `TODO client-side fetching of newly imported vizzes. Current workaround: refresh the page`,
        );
      }
    },
    [],
  );

  // Set up the v3 runtime.
  // TODO QA the following:
  //  * Adding and removing index.js
  //  * Adding and removing index.html
  //  * Switching between versions of the runtime
  useEffect(() => {
    // If the viz is not visual (README.md only), then
    // we don't need to set up the v3 runtime.
    if (isVisual === false) {
      return;
    }
    if (runtimeVersion === 3) {
      // Load the v3 runtime.
      import('./v3Runtime/setupV3Runtime').then(
        ({ setupV3Runtime }) => {
          const iframe = iframeRef.current;

          // Should never happen. Added to pacify TypeScript.
          if (iframe === null) {
            throw new Error('iframe is null');
          }

          v3Runtime.current = setupV3Runtime({
            vizId: content.id,
            iframe,
            setSrcdocError,
            getLatestContent,
          });
        },
      );
    }
  }, [runtimeVersion, isVisual]);

  // Used to debounce updates to the v3 runtime.
  const v3Timeout = useRef<number | undefined>(undefined);

  // Send updates of imported vizzes to the V3 runtime.
  const previousVizCacheContents = useRef(vizCacheContents);
  useEffect(() => {
    // Don't crash for v2 runtime!
    if (runtimeVersion !== 3) {
      return;
    }
    if (initialMount.current === true) {
      return;
    }

    // console.log(
    //   'TODO update the v3 runtime when imported vizzes change',
    // );

    // Find the imported vizzes that have changed.
    const changedVizIds = Object.keys(
      vizCacheContents,
    ).filter((vizId) => {
      return (
        previousVizCacheContents.current[vizId] !==
        vizCacheContents[vizId]
      );
    });
    previousVizCacheContents.current = vizCacheContents;

    if (debug) {
      console.log(
        '[useRuntime] changedVizIds',
        changedVizIds,
      );
    }

    if (changedVizIds.length === 0) {
      return;
    }

    // // See if any of the vizzes we import from are interacting.
    let isInteracting = false;
    for (const vizId of changedVizIds) {
      if (vizCacheContents[vizId].isInteracting) {
        isInteracting = true;
        break;
      }
    }
    if (debug) {
      console.log('isInteracting', isInteracting);
    }
    // Sanity check, should never happen.
    if (v3Runtime.current === null) {
      throw new Error('v3Runtime.current is null');
    }
    if (isInteracting) {
      v3Runtime.current.invalidateVizCache(changedVizIds);
    } else {
      if (!enableManualRun) {
        // Otherwise, debounce the updates.
        clearTimeout(v3Timeout.current);
        v3Timeout.current = window.setTimeout(() => {
          // Sanity check, should never happen.
          if (v3Runtime.current === null) {
            throw new Error('v3Runtime.current is null');
          }
          v3Runtime.current.invalidateVizCache(
            changedVizIds,
          );
        }, v3RunDebounceMs);
      }
    }
  }, [vizCacheContents, runtimeVersion]);

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
          './v2Runtime/computeSrcDocV2'
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
