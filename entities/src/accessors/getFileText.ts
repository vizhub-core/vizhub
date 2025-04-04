// Gets the text content of a file with the given name.
import { VizContent } from '@vizhub/viz-types';

// Returns null if not found.
// TODO consider moving this into @vizhub/viz-utils
export const getFileText = (
  content: VizContent | null,
  fileName: string,
): string | null => {
  if (content && content.files) {
    for (const fileId of Object.keys(content.files)) {
      const file = content.files[fileId];
      if (file.name === fileName) {
        return file.text;
      }
    }
  }
  return null;
};
