import { ProfilePage } from './index';

ProfilePage.getPageData = async ({ gateways, params }) => {
  const { userName } = params;
  const { getUserByUserName, getInfosByOwner } = gateways;

  const userResult = await getUserByUserName(userName);
  if (userResult.outcome === 'success') {
    const profileUserSnapshot = userResult.value;

    const owner = profileUserSnapshot.data.id;

    let infoSnapshots;
    const infoSnapshotsResult = await getInfosByOwner(owner);
    if (infoSnapshotsResult.outcome === 'success') {
      infoSnapshots = infoSnapshotsResult.value;
    } else {
      infoSnapshots = [];
      console.log('Error when fetching infos by owner:');
      console.log(infoSnapshotsResult.error);
    }

    return {
      title: `${userName} on VizHub`,
      profileUserSnapshot,
      infoSnapshots,
    };
  }

  // Indicates user not found
  return null;
};

export { ProfilePage };
