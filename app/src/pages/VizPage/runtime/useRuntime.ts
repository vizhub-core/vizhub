import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { VizContent, VizId } from '@vizhub/viz-types';
import { createRuntime } from '@vizhub/runtime';
import type { VizHubRuntime } from '@vizhub/runtime';
import BuildWorker from './buildWorker?worker';
import { SlugKey } from 'entities';
import { vizFilesToFileCollection } from '@vizhub/viz-utils';

const DEBUG = false;

// Sets up either the v2 or v3 runtime environment.
// Meant to support dynamic switching between the two.
export const useRuntime = ({
  content,
  iframeRef,
  srcdocErrorMessage,
  setSrcdocErrorMessage,
  vizCacheContents,
  isVisual,
  submitContentOperation,
  slugResolutionCache,
}: {
  content: VizContent;
  iframeRef: RefObject<HTMLIFrameElement>;
  srcdocErrorMessage: string | null;
  setSrcdocErrorMessage: (error: string | null) => void;
  vizCacheContents: Record<string, VizContent>;

  // If this is false, there is no iframeRef.current.
  isVisual: boolean;
  submitContentOperation: (
    next: (content: VizContent) => VizContent,
  ) => void;
  slugResolutionCache: Record<SlugKey, VizId>;
}) => {
  // // This ref is used to skip the first mount.
  const initialMount = useRef(true);

  const runtimeRef = useRef<VizHubRuntime | null>(null);

  // Poll for this to be defined.
  const getVizHubRuntime = useCallback(async () => {
    if (runtimeRef.current === null) {
      return new Promise<VizHubRuntime>((resolve) => {
        const interval = setInterval(() => {
          DEBUG &&
            console.log(
              'polling for VizHubRuntime.current...',
            );
          if (runtimeRef.current !== null) {
            clearInterval(interval);
            resolve(runtimeRef.current);
          }
        }, 100);
      });
    }
    return runtimeRef.current;
  }, []);

  const vizCacheContentsRef = useRef(vizCacheContents);

  useEffect(() => {
    vizCacheContentsRef.current = vizCacheContents;
  }, [vizCacheContents]);

  // Handles cache misses for viz content,
  // when a viz imports from another viz.
  const getLatestContent = useCallback(
    async (vizId: VizId): Promise<VizContent> => {
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

  useEffect(() => {
    // If the viz is not visual (README.md only), then
    // we don't need to set up the v3 runtime.
    if (isVisual === false) {
      return;
    }
    // Load the v3 runtime.

    const iframe = iframeRef.current;

    // Should never happen. Added to pacify TypeScript.
    if (iframe === null) {
      throw new Error('iframe is null');
    }

    if (!content.id) {
      throw new Error('content.id is not defined');
    }

    // // Writes the content of a file.
    // const writeFile = (name: string, text: string) => {
    //   submitContentOperation((content: VizContent) => {
    //     // For new files, generate a fileId.
    //     let fileId: VizFileId = generateVizFileId();

    //     // For existing files, get the fileId.
    //     const { files } = content;
    //     if (files !== undefined) {
    //       const fileIds = Object.keys(files);
    //       const foundFileId = fileIds.find(
    //         (fileId) => files[fileId].name === name,
    //       );
    //       if (foundFileId) {
    //         fileId = foundFileId;
    //       }
    //     }

    //     return {
    //       ...content,
    //       files: {
    //         ...content.files,
    //         [fileId]: {
    //           name,
    //           text,
    //         },
    //       },
    //       // Trigger a re-run.
    //       isInteracting: true,
    //     };
    //   });

    //   // Clear the `isInteracting` property.
    //   setTimeout(() => {
    //     // This somewhat cryptic logic
    //     // deletes the `isInteracting` property
    //     // from the document.
    //     submitContentOperation(
    //       ({ isInteracting, ...newDocument }) =>
    //         newDocument,
    //     );
    //   }, 0);
    // };

    const worker = new BuildWorker();
    runtimeRef.current = createRuntime({
      iframe,
      setBuildErrorMessage: setSrcdocErrorMessage,
      worker,
      // vizId: content.id,
      // setSrcdocErrorMessage,
      getLatestContent,
      // resolveSlugKey,
      // writeFile,
    });
    // slugResolutionCache
  }, [isVisual]);

  // Send updates of imported vizzes to the V3 runtime.
  const previousVizCacheContents = useRef(vizCacheContents);

  // Track the srcdoc error message, but only check it
  // when we are attempting to run (do not re-run when
  // the error message changes or is cleared).
  const srcdocErrorMessageRef = useRef(srcdocErrorMessage);
  useEffect(() => {
    srcdocErrorMessageRef.current = srcdocErrorMessage;
  }, [srcdocErrorMessage]);

  // This effect runs when the vizCacheContents changes.
  // Its purpose is to check if any of the imported vizzes
  // have changed, and if so, to re-run the code.
  useEffect(() => {
    // Don't run on first render.
    if (initialMount.current === true) {
      return;
    }

    // Don't run if the viz is not visual (README.md only).
    if (isVisual === false) {
      return;
    }

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

    DEBUG &&
      console.log(
        '[useRuntime] changedVizIds',
        changedVizIds,
      );

    if (changedVizIds.length === 0) {
      return;
    }

    // See if any of the vizzes we import from are interacting.
    let isInteracting = false;
    for (const vizId of changedVizIds) {
      if (vizCacheContents[vizId].isInteracting) {
        isInteracting = true;
        break;
      }
    }
    DEBUG && console.log('isInteracting', isInteracting);

    const update = async () => {
      const runtime = await getVizHubRuntime();
      // Sanity check, should never happen.
      if (runtime === null) {
        throw new Error('VizHubRuntime is null');
      }

      if (isInteracting) {
        runtime.invalidateVizCache(changedVizIds);
        runtime.run({
          files: vizFilesToFileCollection(content.files),
          enableHotReloading: true,
        });
      }
    };
    update();
  }, [vizCacheContents]);

  // Track the initial mount.
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
  }, []);
};
