import { ExplorePage, ExplorePageData } from './index';
import { parseAuth0Sub } from '../../parseAuth0User';
import { Snapshot, User, UserId } from 'entities';

ExplorePage.getPageData = async ({
  gateways,
  auth0User,
}): Promise<ExplorePageData> => {
  const { getInfos, getUser } = gateways;

  let infoSnapshots;
  const infoSnapshotsResult = await getInfos({});
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
