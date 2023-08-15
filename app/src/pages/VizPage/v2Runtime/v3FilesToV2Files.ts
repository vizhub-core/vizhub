import { Files, FilesV2 } from 'entities';

// Migrates V3 files to V2 files.
export const v3FilesToV2Files = (files: Files): FilesV2 => {
  const v2Files: FilesV2 = [];
  for (const fileId in files) {
    const file = files[fileId];
    v2Files.push({
      name: file.name,
      text: file.text,
    });
  }
  return v2Files;
};
