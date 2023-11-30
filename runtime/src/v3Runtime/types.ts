import { V3PackageJson } from 'entities';

// The files passed to the build function.
export type V3RuntimeFiles = {
  // Keys are file names
  // Values are file contents
  [fileName: string]: string;
};

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
