import { Gateways, Result, ok, err, Success } from 'gateways';
import { VizId, Info, Timestamp, UserId, UpvoteId, Upvote } from 'entities';
import { generateId } from './generateId';

// upvoteViz
//  * Creates a new Upvote associated with this viz
//  * Increments upvotesCount on the viz
export const UpvoteViz = (gateways: Gateways) => {
  const { getInfo, saveInfo, saveUpvote } = gateways;

  return async (options: {
    user: UserId;
    viz: VizId;
    timestamp: Timestamp;
  }): Promise<Result<Success>> => {
    const { user, viz, timestamp } = options;

    // Get the info for the viz we are upvoting.
    // TODO consider locking as this is a "critical section"?
    //   If saveInfo is invoked between this get and the save,
    //   will it reset whatever was saved?
    //   https://github.com/mike-marcacci/node-redlock
    const infoResult = await getInfo(viz);
    if (infoResult.outcome === 'failure') return err(infoResult.error);
    const info = infoResult.value.data;
    const newInfo: Info = {
      ...info,
      upvotesCount: info.upvotesCount + 1,
    };
    const saveInfoResult = await saveInfo(newInfo);
    if (saveInfoResult.outcome !== 'success') return saveInfoResult;

    // Save the upvote
    const upvoteId = generateId();
    const newUpvote: Upvote = {
      id: upvoteId,
      user,
      viz,
      timestamp,
    };
    const saveUpvoteResult = await saveUpvote(newUpvote);
    if (saveUpvoteResult.outcome !== 'success') return saveUpvoteResult;

    return ok(upvoteId);
  };
};
