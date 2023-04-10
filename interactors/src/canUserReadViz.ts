import { Gateways, Result, ok, err } from 'gateways';
import { VizId, UserId, ResourceId, PUBLIC } from 'entities';

// canUserReadViz
// * Checks if a user has access permissions to
//   read the given viz.
export const CanUserReadViz = (gateways: Gateways) => {
  const { getInfo, getPermissions, getFolderAncestors } = gateways;

  return async (options: {
    user: UserId;
    viz: VizId;
  }): Promise<Result<boolean>> => {
    const { user, viz } = options;

    // Get the info for the viz we are looking at.
    const infoResult = await getInfo(viz);
    if (infoResult.outcome === 'failure') return err(infoResult.error);
    const info = infoResult.value.data;

    // If visibility is public on this viz,
    // then anyone can read it, so return true.
    if (info.visibility === PUBLIC) {
      return ok(true);
    }

    // If the user is the owner of this viz,
    // then the user can read this viz.
    if (info.owner === user) {
      return ok(true);
    }

    // At this point we need to look at the permissions (collaborators).
    // To implement "waterfall permissions" (like Box),
    // we look up all the folder ancestors of this viz.
    let resources: Array<ResourceId>;
    if (info.folder) {
      const ancestorsResult = await getFolderAncestors(info.folder);
      if (ancestorsResult.outcome === 'failure') {
        return err(ancestorsResult.error);
      }
      const ancestors = ancestorsResult.value;

      resources = [viz, ...ancestors.map((folder) => folder.id)];
    } else {
      resources = [viz];
    }

    // Then check if the user has permission to access any of those folders,
    // in addition to permissions on this viz.
    const permissionsResult = await getPermissions(user, resources);
    if (permissionsResult.outcome === 'failure') {
      return err(permissionsResult.error);
    }
    const permissions = permissionsResult.value.map((d) => d.data);

    // If the user is a collaborator on any of these resources,
    // then the user can read this viz.
    if (permissions.length > 0) {
      return ok(true);
    }

    return ok(false);
  };
};
