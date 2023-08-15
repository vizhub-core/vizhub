import { Content } from 'entities';
import { getFileText } from './getFileText';

export const defaultLicense = 'MIT';

// Gets the package.json of the given viz content.
const packageJSON = (content: Content): any | null => {
  const packageJsonText = getFileText(
    content,
    'package.json',
  );
  if (packageJsonText) {
    try {
      return JSON.parse(packageJsonText);
    } catch (error) {
      // Ignore error and return null
      // in the case of invalid JSON.
    }
  }
  return null;
};

// Gets the license of the given viz content.
export const getLicense = (
  content: Content,
): string | null =>
  packageJSON(content)?.license || defaultLicense;
