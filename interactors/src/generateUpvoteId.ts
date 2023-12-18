// Generates a unique upvote id for a user and a viz.
// This is done as opposed to random to support the migration
import { UpvoteId, UserId, VizId } from 'entities';

// (so that the migration can check if the upvote already exists)
export const generateUpvoteId = (
  userId: UserId,
  vizId: VizId,
): UpvoteId => {
  return `${userId}-${vizId}`;
};
