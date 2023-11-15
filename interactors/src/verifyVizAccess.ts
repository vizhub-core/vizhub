import { Gateways, Result, ok, err } from 'gateways';
import {
  Info,
  UserId,
  ResourceId,
  PUBLIC,
  EDITOR,
  ADMIN,
  Action,
  READ,
  WRITE,
  DELETE,
  UNLISTED,
} from 'entities';

// Delete is allowed only for admins.
const canDelete = (permission) => permission.role === ADMIN;

// Write is allowed only for editor and admin roles.
const canWrite = (permission) =>
  permission.role === EDITOR || permission.role === ADMIN;

// VerifyAccess
// * Determines whether or not a given user is allowed to perform
//   a given action on a given viz.
export const VerifyVizAccess = (gateways: Gateways) => {
  const { getPermissions, getFolderAncestors } = gateways;

  return async (options: {
    authenticatedUserId: UserId | undefined;
    info: Info;
    action: Action;
    debug?: boolean;
  }): Promise<Result<boolean>> => {
    const { authenticatedUserId, info, action, debug } =
      options;

    if (debug) {
      console.log(
        'VerifyVizAccess',
        JSON.stringify(options),
      );
    }

    // Allow anyone to edit a viz wherein `anyoneCanEdit` is true.
    if (action === WRITE && info.anyoneCanEdit) {
      return ok(true);
    }

    // If user is undefined, then the user is not logged in,
    // and therefore can only read public or unlisted vizzes.
    if (authenticatedUserId === undefined) {
      // If the action is read, then the user can read public or unlisted vizzes.
      if (action === READ) {
        return ok(
          info.visibility === PUBLIC ||
            info.visibility === UNLISTED,
        );
      }
      // If the action is write or delete, then the user cannot perform that action.
      if (action === WRITE || action === DELETE) {
        return ok(false);
      }

      // Defensive programming to make sure we don't forget to handle a case.
      throw new Error(`Unknown action: ${action}`);
    }

    // If visibility is public, then anyone can read.
    if (action === READ && info.visibility === PUBLIC) {
      return ok(true);
    }

    // If the user is the owner of this viz,
    // then the user can perform any action.
    if (info.owner === authenticatedUserId) {
      return ok(true);
    }

    // At this point we need to look at the permissions (collaborators).
    // To implement "waterfall permissions" (like Box),
    // we look up all the folder ancestors of this viz.
    let resources: Array<ResourceId>;
    if (info.folder) {
      const ancestorsResult = await getFolderAncestors(
        info.folder,
      );
      if (ancestorsResult.outcome === 'failure') {
        return err(ancestorsResult.error);
      }
      const ancestors = ancestorsResult.value;

      resources = [
        info.id,
        ...ancestors.map((folder) => folder.id),
      ];
    } else {
      resources = [info.id];
    }

    // Then check if the user has permission to access any of those folders,
    // in addition to permissions on this viz.
    const permissionsResult = await getPermissions(
      authenticatedUserId,
      resources,
    );
    if (permissionsResult.outcome === 'failure') {
      return err(permissionsResult.error);
    }
    const permissions = permissionsResult.value.map(
      (d) => d.data,
    );

    if (permissions.length > 0) {
      // If the user is a collaborator on any of these resources,
      // regardless of role (because all roles grant read access)
      // then the user can read this viz.
      if (action === READ) {
        return ok(true);
      }

      if (action === WRITE) {
        return ok(permissions.some(canWrite));
      }

      if (action === DELETE) {
        return ok(permissions.some(canDelete));
      }
    }

    return ok(false);
  };
};
