import { ExplorePage, ExplorePageData } from './index';
import { parseAuth0Sub } from '../../parseAuth0User';
import { Snapshot, User } from 'entities';
import { Result } from 'gateways';

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
  const ownerUsers = Array.from(
    new Set(infoSnapshots.map((snapshot) => snapshot.data.owner))
  );

  // Fetch the user snapshots for these owners.
  // TODO introduce gateways.getUsers so we make fewer requests.
  // See https://github.com/vizhub-core/vizhub3/issues/151
  const ownerUserSnapshotResults: Array<Result<Snapshot<User>>> =
    await Promise.all(ownerUsers.map(getUser));
  const ownerUserSnapshots: Array<Snapshot<User>> = [];
  for (const ownerUserSnapshotResult of ownerUserSnapshotResults) {
    if (ownerUserSnapshotResult.outcome === 'success') {
      ownerUserSnapshots.push(ownerUserSnapshotResult.value);
    } else {
      console.log('Error when fetching user:');
      console.log(ownerUserSnapshotResult.error);
    }
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
