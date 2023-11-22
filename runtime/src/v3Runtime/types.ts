import { License } from 'entities';

export type V3RuntimeFiles = {
  // Keys are file names
  // Values are file contents
  [fileName: string]: string;
};

export type V3PackageJson = {
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

export type V3BuildResult = {
  src: string;
  pkg: V3PackageJson;
  errors: Array<string>;
  warnings: Array<string>;
  time: number;
};
