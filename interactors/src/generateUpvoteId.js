// Generates a unique upvote id for a user and a viz.
// This is done as opposed to random to support the migration
// (so that the migration can check if the upvote already exists)
export const generateUpvoteId = (userId, vizId) => {
  return `${userId}-${vizId}`;
};
