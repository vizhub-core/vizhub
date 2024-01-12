import { Gateways, Result } from 'gateways';
import { VizId, Snapshot, Info } from 'entities';

// getInfoByIdOrSlug
// * Gets a viz info and content by id or slug
export const GetInfoByIdOrSlug =
  ({ getInfo }: Gateways) =>
  async (
    idOrSlug: VizId | string,
  ): Promise<Result<Snapshot<Info>>> => {
    const infoResult = await getInfo(idOrSlug);

    return infoResult;
  };
