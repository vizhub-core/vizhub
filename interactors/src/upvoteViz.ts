import {
  Gateways,
  Result,
  ok,
  err,
  Success,
} from 'gateways';
import { VizId, Timestamp, UserId, Upvote } from 'entities';
import { generateUpvoteId } from './generateUpvoteId';
import { invariantViolationError } from 'gateways/src/errors';

// upvoteViz
//  * Creates a new Upvote associated with this viz
//  * Increments upvotesCount on the viz
export const UpvoteViz = (gateways: Gateways) => {
  const { getUpvote, saveUpvote, incrementUpvotesCount } =
    gateways;

  return async (options: {
    user: UserId;
    viz: VizId;
    timestamp: Timestamp;
  }): Promise<Result<Success>> => {
    const { user, viz, timestamp } = options;

    const upvoteId = generateUpvoteId(user, viz);

    // Check if the upvote already exists
    const getUpvoteResult = await getUpvote(upvoteId);
    if (getUpvoteResult.outcome === 'success') {
      return err(
        invariantViolationError('Upvote already exists'),
      );
    }

    // Save the upvote
    const newUpvote: Upvote = {
      id: upvoteId,
      user,
      viz,
      timestamp,
    };
    const saveUpvoteResult = await saveUpvote(newUpvote);
    if (saveUpvoteResult.outcome !== 'success')
      return saveUpvoteResult;

    // Increment upvote count
    const incrementResult =
      await incrementUpvotesCount(viz);
    if (incrementResult.outcome === 'failure') {
      return err(incrementResult.error);
    }

    return ok('success');
  };
};
