import { Gateways, Result } from 'gateways';
import { VizId, Snapshot, Info, UserId } from 'entities';
import { isId } from './generateId';

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
    await (isId(idOrSlug)
      ? getInfo(idOrSlug)
      : getInfoByUserAndSlug({ userId, slug: idOrSlug }));
