import { VizId } from 'entities';
import { ResolvedVizFileId } from './types';

export const parseId = (
  id: ResolvedVizFileId,
): {
  vizId: VizId;
  fileName: string;
} => {
  const [vizId, ...fileNameParts] = id.split('/');
  const fileName = fileNameParts.join('/');
  return { vizId, fileName };
};
