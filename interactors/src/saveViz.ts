import { Result, ok, Success } from 'gateways';
import { Viz } from 'entities';

// saveViz
// * Gets both info and content
export const SaveViz =
  ({ saveInfo, saveContent }) =>
  async (viz: Viz): Promise<Result<Success>> => {
    // Save the info first, because it's required
    // to execute the size limit access control check
    // on the Content creation op.
    const infoResult = await saveInfo(viz.info);
    if (infoResult.outcome === 'failure') {
      return infoResult;
    }

    const contentResult = await saveContent(viz.content);
    if (contentResult.outcome === 'failure') {
      return contentResult;
    }

    return ok('success');
  };
