import { VizContent } from '@vizhub/viz-types';
import { getFileText } from './getFileText';

export const getPackageJsonText = (
  content: VizContent,
): string | null => getFileText(content, 'package.json');
