import { Gateways, Result, ok } from 'gateways';
import { Snapshot, Info } from 'entities';
import { VizContent, VizId } from '@vizhub/viz-types';

// getViz
// * Gets both info and content
export const GetViz =
  ({ getInfo, getContent }: Gateways) =>
  async (
    id: VizId,
  ): Promise<
    Result<{
      infoSnapshot: Snapshot<Info>;
      contentSnapshot: Snapshot<VizContent>;
      info: Info;
      content: VizContent;
    }>
  > => {
    const infoResult = await getInfo(id);

    if (infoResult.outcome === 'failure') {
      return infoResult;
    }

    const contentResult = await getContent(id);

    if (contentResult.outcome === 'failure') {
      return contentResult;
    }

    return ok({
      infoSnapshot: infoResult.value,
      contentSnapshot: contentResult.value,
      info: infoResult.value.data,
      content: contentResult.value.data,
    });
  };
