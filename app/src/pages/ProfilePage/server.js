import { ProfilePage } from './index';
import { parseAuth0Sub } from '../../parseAuth0User';

ProfilePage.getPageData = async ({ gateways, params, auth0User }) => {
  const { userName } = params;
  const { getUserByUserName, getInfosByOwner, getUser } = gateways;

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

    // If the user is currently authenticated...
    let authenticatedUserSnapshot = null;
    if (auth0User) {
      const authenticatedUserResult = await getUser(
        parseAuth0Sub(auth0User.sub)
      );
      if (authenticatedUserResult.outcome === 'failure') {
        console.log('Error when fetching authenticated user:');
        console.log(authenticatedUserResult.error);
        return null;
      }
      authenticatedUserSnapshot = authenticatedUserResult.value;
    }

    return {
      title: `${userName} on VizHub`,
      profileUserSnapshot,
      infoSnapshots,
      authenticatedUserSnapshot,
    };
  }

  // Indicates user not found
  return null;
};

export { ProfilePage };
