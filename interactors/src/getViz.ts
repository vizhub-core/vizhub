import { Result, ok } from 'gateways';
import { VizId, Snapshot, Info, Content } from 'entities';

// getViz
// * Gets both info and content
export const GetViz =
  ({ getInfo, getContent }) =>
  async (
    id: VizId
  ): Promise<
    Result<{
      infoSnapshot: Snapshot<Info>;
      contentSnapshot: Snapshot<Content>;
      info: Info;
      content: Content;
    }>
  > => {
    const [infoResult, contentResult] = await Promise.all([
      getInfo(id),
      getContent(id),
    ]);

    if (infoResult.outcome === 'failure') {
      return infoResult;
    }

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
