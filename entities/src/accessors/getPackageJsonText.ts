import { Content } from 'entities';
import { getFileText } from './getFileText';

export const getPackageJsonText = (
  content: Content,
): string | null => getFileText(content, 'package.json');
