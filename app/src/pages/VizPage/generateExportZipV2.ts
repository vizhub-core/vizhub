import JSZip from 'jszip';
import { Files } from 'entities';

export const generateExportZipV2 = (files: Files) => {
  const zip = new JSZip();
  for (const { name, text } of Object.values(files)) {
    zip.file(name, text);
  }
  zip.generateAsync({ type: 'blob' }).then((content) => {
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'export.zip';
    link.click();
    URL.revokeObjectURL(url);
  });
};
