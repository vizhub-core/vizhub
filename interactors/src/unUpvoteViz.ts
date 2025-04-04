import {
  Gateways,
  Result,
  ok,
  err,
  Success,
} from 'gateways';
import { UserId } from 'entities';
import { generateUpvoteId } from './generateUpvoteId';
import { VizId } from '@vizhub/viz-types';

// unUpvoteViz
//  * Deletes an Upvote associated with this viz
//  * Cecrements upvotesCount on the viz
export const UnUpvoteViz = (gateways: Gateways) => {
  const { deleteUpvote, decrementUpvotesCount } = gateways;

  return async (options: {
    user: UserId;
    viz: VizId;
  }): Promise<Result<Success>> => {
    const { user, viz } = options;

    const upvoteId = generateUpvoteId(user, viz);

    const deleteUpvoteResult = await deleteUpvote(upvoteId);
    if (deleteUpvoteResult.outcome !== 'success')
      return deleteUpvoteResult;

    // Decrement upvote count
    const decrementResult =
      await decrementUpvotesCount(viz);
    if (decrementResult.outcome === 'failure') {
      return err(decrementResult.error);
    }

    return ok('success');
  };
};
