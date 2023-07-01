import { ExplorePage, ExplorePageData, ExplorePageQuery } from './index';
import { parseAuth0Sub } from '../../parseAuth0User';
import {
  defaultSortField,
  Snapshot,
  SortField,
  SortId,
  sortOptionsMap,
  User,
  UserId,
} from 'entities';
import { Gateways } from 'gateways';
import { Auth0User } from '../Page';

ExplorePage.getPageData = async ({
  gateways,
  auth0User,
  query,
}: {
  gateways: Gateways;
  auth0User: Auth0User | null;
  query: ExplorePageQuery;
}): Promise<ExplorePageData> => {
  const { getInfos, getUser } = gateways;

  const sort: SortId | undefined = query.sort;

  // Get the sort field from the sort query parameter.
  const sortField: SortField =
    (sort && sortOptionsMap.get(sort)?.sortField) || defaultSortField;

  let infoSnapshots;
  const infoSnapshotsResult = await getInfos({ sortField });
  if (infoSnapshotsResult.outcome === 'success') {
    infoSnapshots = infoSnapshotsResult.value;
  } else {
    infoSnapshots = [];
    console.log('Error when fetching infos by owner:');
    console.log(infoSnapshotsResult.error);
  }

  // Figure out the set of unique users that are owners of these infos.
  const ownerUsers: Array<UserId> = Array.from(
    new Set(infoSnapshots.map((snapshot) => snapshot.data.owner))
  );

  // Fetch the user snapshots for these owners.
  const ownerUserSnapshotsResult = await gateways.getUsersByIds(ownerUsers);
  let ownerUserSnapshots: Array<Snapshot<User>>;
  if (ownerUserSnapshotsResult.outcome === 'success') {
    ownerUserSnapshots = ownerUserSnapshotsResult.value;
  } else {
    ownerUserSnapshots = [];
    console.log('Error when fetching users by ids:');
    console.log(ownerUserSnapshotsResult.error);
  }

  // If the user is currently authenticated...
  let authenticatedUserSnapshot = null;
  if (auth0User) {
    const authenticatedUserResult = await getUser(parseAuth0Sub(auth0User.sub));
    if (authenticatedUserResult.outcome === 'failure') {
      console.log('Error when fetching authenticated user:');
      console.log(authenticatedUserResult.error);
      return null;
    }
    authenticatedUserSnapshot = authenticatedUserResult.value;
  }

  return {
    title: `Explore VizHub`,
    authenticatedUserSnapshot,
    infoSnapshots,
    ownerUserSnapshots,
  };
};

export { ExplorePage };
