import { Result, ok, Success } from 'gateways';
import { Viz } from 'entities';

// saveViz
// * Gets both info and content
export const SaveViz =
  ({ saveInfo, saveContent }) =>
  async (viz: Viz): Promise<Result<Success>> => {
    const [infoResult, contentResult] = await Promise.all([
      saveInfo(viz.info),
      saveContent(viz.content),
    ]);

    if (infoResult.outcome === 'failure') {
      return infoResult;
    }

    if (contentResult.outcome === 'failure') {
      return contentResult;
    }

    return ok('success');
  };
