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
}: {
  content: Content;
  iframeRef: RefObject<HTMLIFrameElement>;
  setSrcdocError: (error: string | null) => void;
  vizCacheContents: Record<string, Content>;
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
  useEffect(() => {
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
  }, [runtimeVersion]);

  // Used to debounce updates to the v3 runtime.
  const v3Timeout = useRef<number | undefined>(undefined);

  // Executes a "run" on the v3 runtime when the entry viz changes.
  // const v3Run = useCallback(
  //   (content: Content) => {
  //     if (v3Runtime.current && content) {
  //       v3Runtime.current.handleCodeChange(content);
  //       console.log('Code change');
  //       console.log(JSON.stringify(content));
  //       // v3Runtime.current.invalidateVizCache([content.id]);
  //     }
  //   },
  //   [content],
  // );

  // Executes a "run" on the v3 runtime when any imported viz changes.
  // Happens whenever vizCacheContents changes.
  // const v3RunImports = useCallback(
  //   (changedVizIds: Array<VizId>) => {
  //     if (v3Runtime.current) {

  //     }
  //   },
  //   [],
  // );

  // // Send file updates to the V3 runtime
  // useEffect(() => {
  //   // We don't need to execute a "run" on first render,
  //   // because SSR handles the initial run by injecting
  //   // the srcdoc into the page server-side.
  //   if (initialMount.current === true) {
  //     return;
  //   }

  //   // If we're 'interacting' using code widgets,
  //   // we want to hot reload as frequently as possible.
  //   if (content.isInteracting) {
  //     v3Run(content);
  //   } else {
  //     // Otherwise, debounce the updates.
  //     clearTimeout(v3Timeout.current);
  //     v3Timeout.current = window.setTimeout(() => {
  //       v3Run(content);
  //     }, v3RunDebounceMs);
  //   }
  // }, [content, runtimeVersion, v3Runtime]);

  // Send updates of imported vizzes to the V3 runtime.
  const previousVizCacheContents = useRef(vizCacheContents);
  useEffect(() => {
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
    console.log('isInteracting', isInteracting);
    if (isInteracting) {
      v3Runtime.current.invalidateVizCache(changedVizIds);
    } else {
      // Otherwise, debounce the updates.
      clearTimeout(v3Timeout.current);
      v3Timeout.current = window.setTimeout(() => {
        v3Runtime.current.invalidateVizCache(changedVizIds);
      }, v3RunDebounceMs);
    }
  }, [vizCacheContents]);

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
