import { Content, V3PackageJson, VizId } from 'entities';

// The result of a build.
export type V3BuildResult = {
  // Could be undefined if there's no index.js.
  src: string | undefined;
  pkg: V3PackageJson | undefined;
  warnings: Array<V3BuildError>;
  time: number;

  // A list of CSS files to be injected into the IFrame.
  // e.g. `['./styles.css']`
  // TODO e.g. `['@curran/scatter-plot/styles.css']`
  cssFiles: Array<ResolvedVizFileId>;
};

// The shape of a build error.
export type V3BuildError = {
  code: string;
  message: string;
};

// A resolved viz file id is of the form
// `{idOrSlug}/{fileName}`
export type ResolvedVizFileId = string;

// Messages sent to and from the build worker.
export type V3WorkerMessage =
  // `contentRequest`
  //  * Sent from the worker to the main thread.
  //  * When the worker requests the content of an imported viz.
  //  * The main thread should respond with a `getContentResponse` message.
  //  * This supports the worker's VizCache when it has a cache miss.
  | { type: 'contentRequest'; vizId: VizId }

  // `contentResponse`
  //  * Sent from the main thread to the worker.
  //  * When the main thread responds to a `contentRequest` message.
  | {
      type: 'contentResponse';
      vizId: VizId;
      content: Content;
    }

  // `buildRequest`
  //  * Sent from the main thread to the worker.
  //  * When the main thread requests a build.
  | {
      type: 'buildRequest';
      vizId: VizId;
      enableSourcemap: boolean;
    }

  // `buildResponse`
  //  * Sent from the worker to the main thread.
  //  * When the worker responds to a `buildRequest` message.
  //  * This message is sent to the main thread.
  //  * This message includes
  //  * EITHER `buildResult` the result of the build
  //  * OR `error` if the build failed.
  | {
      type: 'buildResponse';
      buildResult?: V3BuildResult;
      error?: Error;
    }

  // `invalidateVizCache`
  //  * Sent from the main thread to the worker.
  //  * When the main thread wants to invalidate the VizCache.
  //  * This happens when an imported viz changes.
  | {
      type: 'invalidateVizCacheRequest';
      changedVizIds: Array<VizId>;
    }

  // `invalidateVizCacheResponse`
  //  * Sent from the worker to the main thread.
  //  * When the worker responds to a `invalidateVizCacheRequest` message.
  | {
      type: 'invalidateVizCacheResponse';
    }

  // `resolveSlugRequest`
  //  * Sent from the worker to the main thread.
  //  * When the worker requests a viz ID for a slug.
  | {
      type: 'resolveSlugRequest';
      slugKey: string;
      requestId: string;
    }

  // `resolveSlugResponse`
  //  * Sent from the main thread to the worker.
  //  * When the main thread responds to a `resolveSlugRequest` message.
  | {
      type: 'resolveSlugResponse';
      slugKey: string;
      vizId: VizId;
      requestId: string;
    }

  // `resetRequest`
  //  * Sent from the main thread to the worker.
  //  * When the main thread wants to reset the runtime
  //  * This happens when an error occurs.
  | {
      type: 'resetSrcdocRequest';
      vizId: VizId;
      changedVizIds: Array<VizId>;
    }

  // `resetResponse`
  //  * Sent from the worker to the main thread.
  //  * When the worker responds to a `resetRequest` message.
  //  * Provides:
  //  * EITHER a fresh `srcdoc` for the iframe
  //  * OR an `error` if the build failed.
  | {
      type: 'resetSrcdocResponse';
      srcdoc?: string;
      error?: Error;
    };

// Messages sent to and from the IFrame window.
export type V3WindowMessage =
  // `runJS`
  //  * Sent from the main thread to the IFrame.
  //  * Triggers hot reloading within the V3 runtime.
  | {
      type: 'runJS';
      src: string;
    }

  // `runCSS`
  //  * Sent from the main thread to the IFrame.
  //  * Triggers hot reloading of CSS within the V3 runtime.
  | {
      type: 'runCSS';
      src: string;
      id: ResolvedVizFileId;
    }

  // `runDone`
  //  * Sent from the IFrame to the main thread.
  //  * Indicates that the V3 runtime has finished running the JS.
  //  * If this was sent, there were no immediate runtime errors.
  | {
      type: 'runDone';
    }

  // `runError`
  //  * Sent from the IFrame to the main thread.
  //  * Indicates that the V3 runtime has finished running the JS.
  //  * If this was sent, there was an immediate runtime error.
  | {
      type: 'runError';
      error: Error;
    };
