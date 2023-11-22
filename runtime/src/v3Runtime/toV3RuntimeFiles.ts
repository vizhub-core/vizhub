import { File, FileId, Files } from 'entities';
import { V3RuntimeFiles } from './types';

export const toV3RuntimeFiles = (
  files: Files,
): V3RuntimeFiles =>
  Object.keys(files).reduce(
    (acc: V3RuntimeFiles, fileId: FileId) => {
      const file: File = files[fileId];
      acc[file.name] = file.text;
      return acc;
    },
    {},
  );
