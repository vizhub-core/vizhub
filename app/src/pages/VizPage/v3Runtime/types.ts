import { License } from 'entities';

export type V3RuntimeFiles = {
  // Keys are file names
  // Values are file contents
  [fileName: string]: string;
};

export type PackageJson = {
  dependencies?: {
    [key: string]: string;
  };
  vizhub?: {
    libraries: {
      [key: string]: {
        path: string;
        global: string;
      };
    };
  };
  license?: License;
};
// export type BuildResult = {
//   errors: any[];
//   warnings: any[];
//   src: string;
//   pkg?: PackageJson;
//   time: number;
// };

export type BuildResult = {
  // TODO iterate types for `src` and `pkg`
  src: string;
  pkg: string;
  errors: Array<string>;
  warnings: Array<string>;
};
