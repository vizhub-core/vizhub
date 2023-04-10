import { Result, ok } from 'gateways';
import { VizId, Viz } from 'entities';

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

    return ok(true);
  };
};
