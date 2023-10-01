import { Gateways, Result, ok } from 'gateways';
import { VizId } from 'entities';

// validateViz
// * Validates a viz
export const ValidateViz =
  ({ getInfo, getContent }: Gateways) =>
  async (id: VizId): Promise<Result<'success'>> => {
    const infoResult = await getInfo(id);

    if (infoResult.outcome === 'failure') {
      return infoResult;
    }

    const contentResult = await getContent(id);

    if (contentResult.outcome === 'failure') {
      return contentResult;
    }

    // TODO access owner user
    // TODO access start commit and end commit
    // TODO test Invariant: `startCommit.timestamp === info.created`
    // TODO test Invariant: `endCommit.timestamp === info.updated`

    return ok('success');
  };
