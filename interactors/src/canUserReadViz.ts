import { Result, ok, err } from 'gateways';
import { VizId, Viz, PUBLIC } from 'entities';

// canUserReadViz
// * Checks if a user has access permissions to
//   read the given viz.
export const CanUserReadViz = (gateways: Gateways) => {
  const { getInfo } = gateways;

  return async (options: {
    user: UserId;
    viz: VizId;
  }): Promise<Result<Success>> => {
    const { user, viz } = options;

    // Get the info for the viz we are looking at.
    const infoResult = await getInfo(viz);
    if (infoResult.outcome === 'failure') return err(infoResult.error);
    const info = infoResult.value.data;

    // If visibility is public on this viz,
    // then anyone can read it, so return true.
    if (info.visibility === PUBLIC) {
      return ok(true);
    }

    // If the user is the owner of this viz,
    // then the user can read this viz.
    if (info.owner === user) {
      return ok(true);
    }

    return ok(false);
  };
};
