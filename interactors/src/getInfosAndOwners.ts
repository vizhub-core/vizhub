import { Gateways, Result, ok } from 'gateways';
import {
  Info,
  UserId,
  SortId,
  User,
  getSortField,
  SortField,
  Snapshot,
} from 'entities';

export const GetInfosAndOwners = (gateways: Gateways) => {
  const { getInfos } = gateways;

  return async ({
    noNeedToFetchUsers,
    sortId,
    pageNumber,
  }: {
    noNeedToFetchUsers: Array<UserId>;
    sortId: SortId;
    pageNumber: number;
  }): Promise<
    Result<{
      infoSnapshots: Array<Snapshot<Info>>;
      ownerUserSnapshots: Array<Snapshot<User>>;
    }>
  > => {
    // Get the sort field from the sort query parameter.
    const sortField: SortField = getSortField(sortId);

    // Reference of signure of getInfos:
    //   getInfos({
    // owner,
    // forkedFrom,
    // sortField,
    // pageNumber,
    // sortOrder,

    const infoSnapshotsResult = await getInfos({ sortField, pageNumber });
    if (infoSnapshotsResult.outcome === 'failure') return infoSnapshotsResult;
    const infoSnapshots = infoSnapshotsResult.value;

    // Figure out the set of unique users that are owners of these infos.
    const ownerUsers: Array<UserId> = Array.from(
      new Set(infoSnapshots.map((snapshot) => snapshot.data.owner))
    );

    // Remove any users that we don't need to fetch.
    const noNeedToFetchUsersSet = new Set(noNeedToFetchUsers);
    const ownerUsersToFetch = ownerUsers.filter(
      (ownerUser) => !noNeedToFetchUsersSet.has(ownerUser)
    );

    // Fetch the user snapshots for these owners.
    const ownerUserSnapshotsResult = await gateways.getUsersByIds(
      ownerUsersToFetch
    );
    if (ownerUserSnapshotsResult.outcome === 'failure')
      return ownerUserSnapshotsResult;
    const ownerUserSnapshots = ownerUserSnapshotsResult.value;

    return ok({ infoSnapshots, ownerUserSnapshots });
  };
};
