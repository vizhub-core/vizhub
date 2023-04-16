import { Gateways, Result, ok, err, Success } from 'gateways';
import { VizId, Timestamp, UserId, Upvote } from 'entities';
import { generateId } from './generateId';

// upvoteViz
//  * Creates a new Upvote associated with this viz
//  * Increments upvotesCount on the viz
export const UpvoteViz = (gateways: Gateways) => {
  const { saveUpvote, incrementUpvotesCount } = gateways;

  return async (options: {
    user: UserId;
    viz: VizId;
    timestamp: Timestamp;
  }): Promise<Result<Success>> => {
    const { user, viz, timestamp } = options;

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

    // Increment upvote count
    const incrementResult = await incrementUpvotesCount(viz);
    if (incrementResult.outcome === 'failure') {
      return err(incrementResult.error);
    }

    return ok(upvoteId);
  };
};
