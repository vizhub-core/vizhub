import { VizContent } from '@vizhub/viz-types';
import { getFileText } from './getFileText';

// Gets the text content of a file with the given name.
// Returns null if not found.
export const getRuntimeVersion = (
  content: VizContent,
): number =>
  getFileText(content, 'index.html') === null ? 3 : 2;
