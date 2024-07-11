import {
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {
  Content,
  FileId,
  SlugKey,
  VizId,
  generateFileId,
  getRuntimeVersion,
} from 'entities';
import { V3Runtime } from './v3Runtime/setupV3Runtime';

const debug = false;

// Sets up either the v2 or v3 runtime environment.
// Meant to support dynamic switching between the two.
export const useRuntime = ({
  content,
  iframeRef,
  srcdocErrorMessage,
  setSrcdocErrorMessage,
  vizCacheContents,
  isVisual,
  slugResolutionCache,
  submitContentOperation,
}: {
  content: Content;
  iframeRef: RefObject<HTMLIFrameElement>;
  srcdocErrorMessage: string | null;
  setSrcdocErrorMessage: (error: string | null) => void;
  vizCacheContents: Record<string, Content>;

  // If this is false, there is no iframeRef.current.
  isVisual: boolean;
  slugResolutionCache: Record<SlugKey, VizId>;
  submitContentOperation: (
    next: (content: Content) => Content,
  ) => void;
}) => {
  // This ref is used to skip the first mount.
  const initialMount = useRef(true);

  // `runtimeVersion` is used to determine which runtime
  // to use. It's either 2 or 3.
  const runtimeVersion: number = useMemo(
    () => getRuntimeVersion(content),
    [content],
  );

  const v3RuntimeRef = useRef<V3Runtime | null>(null);

  const getV3Runtime = useCallback(async () => {
    if (v3RuntimeRef.current === null) {
      // throw new Error('v3Runtime.current is null');
      // Poll for this to be defined.
      // const interval = setInterval(() => {
      //   if (debug) {
      //     console.log('polling for v3Runtime.current...');
      //   }
      //   if (v3RuntimeRef.current !== null) {
      //     clearInterval(interval);
      //     return v3RuntimeRef.current;
      //   }
      // }, 100);
      return new Promise<V3Runtime>((resolve) => {
        const interval = setInterval(() => {
          if (debug) {
            console.log('polling for v3Runtime.current...');
          }
          if (v3RuntimeRef.current !== null) {
            clearInterval(interval);
            resolve(v3RuntimeRef.current);
          }
        }, 100);
      });
    }
    return v3RuntimeRef.current;
  }, []);

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

  // Handles cache misses for slug resolution,
  // when a viz imports from another viz.
  const resolveSlugKey = useCallback(
    async (slugKey: SlugKey): Promise<VizId> => {
      // Sanity check, should never happen.
      if (!slugResolutionCache) {
        throw new Error('slugResolutionCache is null');
      }

      const vizId = slugResolutionCache[slugKey];

      // If the viz ID for this slug is already tracked,
      // then return it.
      if (vizId) {
        return vizId;
      } else {
        // TODO make this happen by:
        // * Resolving the slug from the server
        // * Using a new API endpoint that returns the viz id for a slugKey
        throw new Error(
          `TODO client-side resolution of newly imported vizzes. Current workaround: refresh the page`,
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

          if (!content.id) {
            throw new Error('content.id is not defined');
          }

          // Writes the content of a file.
          const writeFile = (
            name: string,
            text: string,
          ) => {
            submitContentOperation((content: Content) => {
              // For new files, generate a fileId.
              let fileId: FileId = generateFileId();

              // For existing files, get the fileId.
              const { files } = content;
              if (files !== undefined) {
                const fileIds = Object.keys(files);
                const foundFileId = fileIds.find(
                  (fileId) => files[fileId].name === name,
                );
                if (foundFileId) {
                  fileId = foundFileId;
                }
              }

              return {
                ...content,
                files: {
                  ...content.files,
                  [fileId]: {
                    name,
                    text,
                  },
                },
                // Trigger a re-run.
                isInteracting: true,
              };
            });

            // Clear the `isInteracting` property.
            setTimeout(() => {
              // This somewhat cryptic logic
              // deletes the `isInteracting` property
              // from the document.
              submitContentOperation(
                ({ isInteracting, ...newDocument }) =>
                  newDocument,
              );
            }, 0);
          };

          v3RuntimeRef.current = setupV3Runtime({
            vizId: content.id,
            iframe,
            setSrcdocErrorMessage,
            getLatestContent,
            resolveSlugKey,
            writeFile,
          });
        },
      );
    }
  }, [runtimeVersion, isVisual, submitContentOperation]);

  // Send updates of imported vizzes to the V3 runtime.
  const previousVizCacheContents = useRef(vizCacheContents);

  // Track the srcdoc error message, but only check it
  // when we are attempting to run (do not re-run when
  // the error message changes or is cleared).
  const srcdocErrorMessageRef = useRef(srcdocErrorMessage);
  useEffect(() => {
    srcdocErrorMessageRef.current = srcdocErrorMessage;
  }, [srcdocErrorMessage]);

  useEffect(() => {
    // Don't crash for v2 runtime!
    if (runtimeVersion !== 3) {
      return;
    }

    // Don't run on first render.
    if (initialMount.current === true) {
      return;
    }

    // Don't run if the viz is not visual (README.md only).
    if (isVisual === false) {
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

    const update = async () => {
      const v3Runtime = await getV3Runtime();
      // Sanity check, should never happen.
      if (v3Runtime === null) {
        throw new Error('v3Runtime is null');
      }
      if (isInteracting) {
        // console.log('Running the code!');
        // console.log(
        //   'srcdocErrorMessageRef.current',
        //   srcdocErrorMessageRef.current,
        // );

        // If we are recovering from an error,
        // clear the error message, and run the code
        // totally fresh by re-computing the srcdoc.
        if (srcdocErrorMessageRef.current) {
          v3Runtime.resetSrcdoc(changedVizIds);
          // try {
          //   const srcdoc = await computeSrcDocV3(content);
          //   if (iframeRef.current) {
          //     iframeRef.current.srcdoc = srcdoc;
          //   }
          // } catch (error) {
          //   console.error(error);
          //   setSrcdocErrorMessage(error.message);
          // }
        } else {
          // Re-run the code with hot reloading.
          v3Runtime.invalidateVizCache(changedVizIds);
        }
      }
    };
    update();
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
      const v2Run = async () => {
        // Clear the console before each run.
        console.clear();

        // Clear out the old error.
        setSrcdocErrorMessage(null);

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
        } catch (error) {
          console.error(error);
          setSrcdocErrorMessage(error.message);
        }
      };
      if (content.isInteracting) {
        v2Run();
      }
    }
  }, [
    content.files,
    content.isInteracting,
    runtimeVersion,
  ]);

  // Track the initial mount.
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
  }, []);
};
