import { Content } from 'entities';
import { getFileText } from './getFileText';

// Gets the text content of a file with the given name.
// Returns null if not found.
export const getRuntimeVersion = (
  content: Content,
): number =>
  getFileText(content, 'index.html') === null ? 3 : 2;
