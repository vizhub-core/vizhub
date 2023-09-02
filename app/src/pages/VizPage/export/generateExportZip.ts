import JSZip from 'jszip';
import { Files } from 'vzcode';

// Generates a zip file of the given files using jszip
// and downloads it to the user's machine.
// `fileName` is the name of the zip file to be generated.
export const generateExportZip = (
  files: Files,
  fileName = 'export.zip',
) => {
  const zip = new JSZip();
  for (const { name, text } of Object.values(files)) {
    zip.file(name, text);
  }
  zip.generateAsync({ type: 'blob' }).then((content) => {
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  });
};
