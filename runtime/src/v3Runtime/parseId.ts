import { VizId } from 'entities';
import { ResolvedVizFileId } from './v3Runtime/types';

export const parseId = (
  id: ResolvedVizFileId,
): {
  vizId: VizId;
  fileName: string;
} => {
  const [vizId, fileName]: [VizId, string] = id.split(
    '/',
  ) as [VizId, string];
  return { vizId, fileName };
};
