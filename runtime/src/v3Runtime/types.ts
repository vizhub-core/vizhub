import { V3PackageJson } from 'entities';

export type V3RuntimeFiles = {
  // Keys are file names
  // Values are file contents
  [fileName: string]: string;
};

export type V3BuildResult = {
  src: string;
  pkg: V3PackageJson;
  errors: Array<string>;
  warnings: Array<string>;
  time: number;
};
