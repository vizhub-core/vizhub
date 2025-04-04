import { Gateways, Result } from 'gateways';
import { Snapshot, Info, UserId } from 'entities';
import { VizId } from '@vizhub/viz-types';
import { isVizId } from '@vizhub/viz-utils';

// getInfoByIdOrSlug
// * Gets a viz info and content by id or slug
export const GetInfoByIdOrSlug =
  ({ getInfo, getInfoByUserAndSlug }: Gateways) =>
  async ({
    userId,
    idOrSlug,
  }: {
    userId: UserId;
    idOrSlug: VizId | string;
  }): Promise<Result<Snapshot<Info>>> =>
    await (isVizId(idOrSlug)
      ? getInfo(idOrSlug)
      : getInfoByUserAndSlug({ userId, slug: idOrSlug }));
