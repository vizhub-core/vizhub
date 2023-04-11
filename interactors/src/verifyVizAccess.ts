import { Gateways, Result, ok, err } from 'gateways';
import {
  VizInfo,
  UserId,
  ResourceId,
  PUBLIC,
  EDITOR,
  ADMIN,
  Action,
  READ,
  WRITE,
  DELETE,
} from 'entities';

// VerifyAccess
// * Determines whether or not a given user is allowed to perform
//   a given action on a given viz.
export const VerifyVizAccess = (gateways: Gateways) => {
  const { getInfo, getPermissions, getFolderAncestors } = gateways;

  return async (options: {
    userId: UserId;
    vizInfo: VizInfo;
    action: Action;
  }): Promise<Result<boolean>> => {
    const { userId, vizInfo, action } = options;

    // If visibility is public, then anyone can read.
    if (action === READ && vizInfo.visibility === PUBLIC) {
      return ok(true);
    }

    // If the user is the owner of this viz,
    // then the user can perform any action.
    if (vizInfo.owner === userId) {
      return ok(true);
    }

    // At this point we need to look at the permissions (collaborators).
    // To implement "waterfall permissions" (like Box),
    // we look up all the folder ancestors of this viz.
    let resources: Array<ResourceId>;
    if (vizInfo.folder) {
      const ancestorsResult = await getFolderAncestors(vizInfo.folder);
      if (ancestorsResult.outcome === 'failure') {
        return err(ancestorsResult.error);
      }
      const ancestors = ancestorsResult.value;

      resources = [vizInfo.id, ...ancestors.map((folder) => folder.id)];
    } else {
      resources = [vizInfo.id];
    }

    // Then check if the user has permission to access any of those folders,
    // in addition to permissions on this viz.
    const permissionsResult = await getPermissions(userId, resources);
    if (permissionsResult.outcome === 'failure') {
      return err(permissionsResult.error);
    }
    const permissions = permissionsResult.value.map((d) => d.data);

    if (permissions.length > 0) {
      // If the user is a collaborator on any of these resources,
      // regardless of role (because all roles grant read access)
      // then the user can read this viz.
      if (action === READ) {
        return ok(true);
      }

      // Write is allowed only for editor and admin roles.
      if (action === WRITE) {
        return ok(
          permissions.some(
            (permission) =>
              permission.role === EDITOR || permission.role === ADMIN
          )
        );
      }

      // Delete is allowed only for admins.
      if (action === DELETE) {
        return ok(permissions.some((permission) => permission.role === ADMIN));
      }
    }

    return ok(false);
  };
};
