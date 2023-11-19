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
  Permission,
} from 'entities';

// Represents the access that a user has to a viz.
// Keys are actions, values are booleans representing
// whether or not the user is allowed to perform that action.
// Only actions that are explicitly specified are included.
export type VizAccess = {
  [action: string]: boolean;
};

// Delete is allowed only for admins.
const canDelete = (permission: Permission) =>
  permission.role === ADMIN;

// Write is allowed only for editor and admin roles.
const canWrite = (permission: Permission) =>
  permission.role === EDITOR || permission.role === ADMIN;

// Read is allowed for public or unlisted vizzes.
const canRead = (info: Info) =>
  info.visibility === PUBLIC ||
  info.visibility === UNLISTED;

// VerifyVizAccess
// * Determines whether or not a given user is allowed to perform
//   a given action on a given viz.
export const VerifyVizAccess = (gateways: Gateways) => {
  const { getPermissions, getFolderAncestors } = gateways;

  return async (options: {
    authenticatedUserId: UserId | undefined;
    info: Info;
    actions: Array<Action>;
    debug?: boolean;
  }): Promise<Result<VizAccess>> => {
    const { authenticatedUserId, info, actions, debug } =
      options;

    if (debug) {
      console.log(
        'VerifyVizAccess',
        JSON.stringify(options),
      );
    }

    // If the user is the owner of the viz, then they can perform any action.
    if (info.owner === authenticatedUserId) {
      const ownerAccess: VizAccess = {};
      for (const action of actions) {
        ownerAccess[action] = true;
      }
      return ok(ownerAccess);
    }

    let resources: Array<ResourceId> | undefined;
    let permissions: Array<Permission> = [];
    let dataFetched = false;

    const fetchDataIfNeeded = async () => {
      if (dataFetched) return;
      dataFetched = true;

      if (info.folder) {
        // At this point we need to look at the permissions (collaborators).
        // To implement "waterfall permissions" (like Box),
        // we look up all the folder ancestors of this viz.
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

      if (authenticatedUserId && resources.length) {
        // Then check if the user has permission to access any of those folders,
        // in addition to permissions on this viz.
        const permissionsResult = await getPermissions(
          authenticatedUserId,
          resources,
        );
        if (permissionsResult.outcome === 'failure') {
          return err(permissionsResult.error);
        }
        permissions = permissionsResult.value.map(
          (d) => d.data,
        );
      }
    };

    let vizAccess: VizAccess = {};

    // Process each action
    for (const action of actions) {
      if (
        action === READ &&
        (canRead(info) || info.anyoneCanEdit)
      ) {
        vizAccess[action] = true;
        continue;
      }

      if (action === WRITE && info.anyoneCanEdit) {
        vizAccess[action] = true;
        continue;
      }

      await fetchDataIfNeeded();

      switch (action) {
        case READ:
          // If the user is a collaborator on any of these resources,
          // regardless of role (because all roles grant read access)
          // then the user can read this viz.
          vizAccess[action] = permissions.length > 0;
          break;
        case WRITE:
          vizAccess[action] = permissions.some(canWrite);
          break;
        case DELETE:
          vizAccess[action] = permissions.some(canDelete);
          break;
        default:
          // Defensive programming to make sure we don't forget to handle a case.
          throw new Error(`Unknown action: ${action}`);
      }
    }

    return ok(vizAccess);
  };
};
