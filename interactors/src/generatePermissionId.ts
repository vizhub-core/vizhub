// Generates a unique permission id for a user and a viz.
// This is done as opposed to random to support the migration
import { PermissionId, ResourceId, UserId } from 'entities';

// (so that the migration can check if the upvote already exists)
export const generatePermissionId = (
  userId: UserId,
  resourceId: ResourceId,
): PermissionId => {
  return `${userId}-${resourceId}`;
};
