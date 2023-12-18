import { generatePermissionId } from 'interactors';
import { Gateways } from 'gateways';
import {
  CollaboratorV2,
  Permission,
  Timestamp,
  UserId,
  VizId,
} from 'entities';

// Migrate collaborators to V3 "Permissions"
export const migrateCollaborators = async ({
  vizId,
  collaboratorsV2,
  lastUpdatedTimestamp,
  owner,
  gateways,
}: {
  vizId: VizId;
  collaboratorsV2: Array<CollaboratorV2>;
  lastUpdatedTimestamp: Timestamp;
  owner: UserId;
  gateways: Gateways;
}) => {
  const { getPermission, savePermission } = gateways;

  process.stdout.write('    ');
  if (collaboratorsV2 && collaboratorsV2.length > 0) {
    for (const collaboratorV2 of collaboratorsV2) {
      const { userId } = collaboratorV2;

      // If the permission already exists, skip it
      const upvoteId = generatePermissionId(userId, vizId);
      const upvoteExists =
        (await getPermission(upvoteId)).outcome ===
        'success';
      if (upvoteExists) {
        process.stdout.write('-');
      } else {
        process.stdout.write('+');

        // export interface Permission {
        //   id: PermissionId;

        //   // The user that was granted the permission
        //   user: UserId;

        //   // The resource the permission is on
        //   resource: ResourceId;

        //   // The role of this permission
        //   role: Role;

        //   // When this role was granted
        //   timestamp: Timestamp;

        //   // Who granted this role
        //   grantedBy: UserId;
        // }

        const permission: Permission = {
          id: upvoteId,
          user: userId,
          resource: vizId,
          role: 'editor',

          // Since there are no timestamps in V2, we'll use the
          // lastUpdatedTimestamp as the timestamp for all
          // collaborators.
          timestamp: lastUpdatedTimestamp,

          // We assume that it was granted by the viz owner.
          grantedBy: owner,
        };

        const result = await savePermission(permission);
        if (result.outcome === 'failure') {
          console.log(result.error);
          process.exit(1);
        }
      }
    }
    process.stdout.write('\n');
  }
};
