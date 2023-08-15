import {
  Gateways,
  Result,
  ok,
  err,
  Success,
} from 'gateways';
import { VizId, Timestamp, UserId, Upvote } from 'entities';
import { generateUpvoteId } from './generateUpvoteId';

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
    const upvoteId = generateUpvoteId(user, viz);
    const newUpvote: Upvote = {
      id: upvoteId,
      user,
      viz,
      timestamp,
    };

    // Save upvote
    const saveUpvoteResult = await saveUpvote(newUpvote);
    if (saveUpvoteResult.outcome !== 'success')
      return saveUpvoteResult;

    // Increment upvote count (only if the upvote was saved)
    const incrementResult =
      await incrementUpvotesCount(viz);
    if (incrementResult.outcome === 'failure') {
      return err(incrementResult.error);
    }

    return ok('success');
  };
};
