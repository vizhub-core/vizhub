import { Result, ok } from 'gateways';
import { VizId, Viz } from 'entities';

// getViz
// * Gets both info and content
export const GetViz =
  ({ getInfo, getContent }) =>
  async (id: VizId): Promise<Result<Viz>> => {
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
      info: infoResult.value.data,
      content: contentResult.value.data,
    });
  };
