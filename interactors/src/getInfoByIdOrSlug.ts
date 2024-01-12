import { Gateways, Result } from 'gateways';
import { VizId, Snapshot, Info } from 'entities';
import { isId } from './generateId';

// getInfoByIdOrSlug
// * Gets a viz info and content by id or slug
export const GetInfoByIdOrSlug =
  ({ getInfo, getInfoBySlug }: Gateways) =>
  async (
    idOrSlug: VizId | string,
  ): Promise<Result<Snapshot<Info>>> =>
    await (isId(idOrSlug)
      ? getInfo(idOrSlug)
      : getInfoBySlug(idOrSlug));
