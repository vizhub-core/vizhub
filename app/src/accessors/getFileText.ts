import { Content } from 'entities';

// Gets the text content of a file with the given name.
// Returns null if not found.
export const getFileText = (
  content: Content,
  fileName: string
): string | null => {
  console.log('in getFileText');
  if (content && content.files) {
    console.log('content.files', content.files);
    for (const fileId of Object.keys(content.files)) {
      const file = content.files[fileId];
      console.log('file', file);
      if (file.name === fileName) {
        return file.text;
      }
    }
  }
  return null;
};
