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
  // `getContentRequest`
  //  * When the worker requests the content of an imported viz.
  //  * The main thread should respond with a `getContentResponse` message.
  //  * This supports the worker's VizCache when it has a cache miss.
  | { type: 'getContentRequest'; vizId: VizId }

  // `getContentResponse`
  //  * When the main thread responds to a `getContentRequest` message.
  | {
      type: 'getContentResponse';
      vizId: VizId;
      content: Content;
    }

  // `build`
  //  * When the main thread requests a build.
  | {
      type: 'build';
      content: Content;
      enableSourcemap: boolean;
    };
