import { Gateways, Result, ok } from 'gateways';
import { VizId, Snapshot, Info, Content } from 'entities';

// getViz
// * Gets both info and content
export const GetViz =
  ({ getInfo, getContent }: Gateways) =>
  async (
    id: VizId,
  ): Promise<
    Result<{
      infoSnapshot: Snapshot<Info>;
      contentSnapshot: Snapshot<Content>;
      info: Info;
      content: Content;
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
