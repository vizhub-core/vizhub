export type V3RuntimeFiles = {
  // Keys are file names
  // Values are file contents
  [fileName: string]: string;
};

export type PackageJSON = {
  dependencies: {
    [key: string]: string;
  };
  vizhub: {
    libraries: {
      [key: string]: {
        path: string;
        global: string;
      };
    };
  };
};
export type BuildResult = {
  errors: any[];
  warnings: any[];
  src: string;
  pkg: PackageJSON;
  time: number;
};
