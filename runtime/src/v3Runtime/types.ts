import { Content, V3PackageJson, VizId } from 'entities';

// The result of a build.
export type V3BuildResult = {
  // Could be undefined if there's no index.js.
  src: string | undefined;
  pkg: V3PackageJson | undefined;
  errors: Array<V3BuildError>;
  warnings: Array<V3BuildError>;
  time: number;
};

// The shape of a build error.
export type V3BuildError = {
  code: string;
  message: string;
};

// Messages sent to and from the worker.
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
      content: Content;
      enableSourcemap: boolean;
    }

  // `buildResponse`
  //  * Sent from the worker to the main thread.
  //  * When the worker responds to a `buildRequest` message.
  //  * This message includes the result of the build.
  //  * This message is sent to the main thread.
  | {
      type: 'buildResponse';
      buildResult: V3BuildResult;
    };
