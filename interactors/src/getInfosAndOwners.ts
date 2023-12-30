import {
  Gateways,
  Result,
  err,
  ok,
  pageSize,
} from 'gateways';
import {
  Info,
  UserId,
  SortId,
  User,
  getSortField,
  SortField,
  Snapshot,
  VizId,
  Visibility,
  SectionId,
} from 'entities';
import { accessDeniedError } from 'gateways/src/errors';

const debug = false;

export type InfosAndOwners = {
  infoSnapshots: Array<Snapshot<Info>>;
  ownerUserSnapshots: Array<Snapshot<User>>;
  hasMore: boolean;
};

export const GetInfosAndOwners = (gateways: Gateways) => {
  const { getInfos } = gateways;

  return async ({
    noNeedToFetchUsers,
    sectionId,
    sortId,
    pageNumber,
    owner,
    forkedFrom,
    vizIds,
    authenticatedUserId,
  }: {
    noNeedToFetchUsers: Array<UserId>;
    sectionId?: SectionId;
    sortId?: SortId;
    pageNumber: number;
    owner?: UserId;
    forkedFrom?: VizId;
    vizIds?: Array<VizId>;
    authenticatedUserId?: UserId;
  }): Promise<Result<InfosAndOwners>> => {
    // Get the sort field from the sort query parameter.
    const sortField: SortField | undefined = sortId
      ? getSortField(sortId)
      : undefined;

    // Check access to private infos.
    if (
      (sectionId === 'private' || sectionId === 'shared') &&
      authenticatedUserId !== owner
    ) {
      return err(
        accessDeniedError(
          "Can't access someone else's private vizzes.",
        ),
      );
    }

    const visibilities: Array<Visibility> =
      sectionId === 'private' ? ['private'] : ['public'];

    const getInfosOptions = {
      owner,
      forkedFrom,
      sortField,
      pageNumber,
      vizIds,
      visibilities,
    };

    // Handle the "Shared with me" section.
    if (sectionId === 'shared') {
      if (debug) {
        console.log(
          '[GetInfosAndOwners] handling shared with me',
        );
      }
      // The "owner" that we pass to getInfos() is the
      // authenticated user, because we want to get the
      // infos that have been shared with them.
      // They are not actually the owner of the vizzes,
      // so we delete the owner property from the options.
      delete getInfosOptions.owner;

      // Figure out which vizzes have been shared with the
      // authenticated user.
      const permissionsResult =
        await gateways.getPermissions(
          authenticatedUserId,
          null,
        );
      if (permissionsResult.outcome === 'failure') {
        return permissionsResult;
      }
      const permissions = permissionsResult.value.map(
        (snapshot) => snapshot.data,
      );

      if (debug) {
        console.log(
          '[GetInfosAndOwners] permissions',
          permissions,
        );
      }

      // Deduplicate sharedVizIds, just in case
      const sharedVizIds = new Set(
        permissions.map(
          (permission) => permission.resource,
        ),
      );
      getInfosOptions.vizIds = Array.from(sharedVizIds);
      if (debug) {
        console.log(
          '[GetInfosAndOwners] getInfosOptions',
          getInfosOptions,
        );
      }

      // We want to query against all visibilities.
      getInfosOptions.visibilities = null;
    }

    const infoSnapshotsResult =
      await getInfos(getInfosOptions);
    if (infoSnapshotsResult.outcome === 'failure')
      return infoSnapshotsResult;
    const infoSnapshots = infoSnapshotsResult.value;

    // Figure out the set of unique users that are owners of these infos.
    const ownerUsers: Array<UserId> = Array.from(
      new Set(
        infoSnapshots.map(
          (snapshot) => snapshot.data.owner,
        ),
      ),
    );

    // Remove any users that we don't need to fetch.
    const noNeedToFetchUsersSet = new Set(
      noNeedToFetchUsers,
    );
    const ownerUsersToFetch = ownerUsers.filter(
      (ownerUser) => !noNeedToFetchUsersSet.has(ownerUser),
    );

    // Fetch the user snapshots for these owners.
    const ownerUserSnapshotsResult =
      await gateways.getUsersByIds(ownerUsersToFetch);
    if (ownerUserSnapshotsResult.outcome === 'failure')
      return ownerUserSnapshotsResult;
    const ownerUserSnapshots =
      ownerUserSnapshotsResult.value;

    return ok({
      infoSnapshots,
      ownerUserSnapshots,
      hasMore: infoSnapshots.length === pageSize,
    });
  };
};
