import { ExplorePage } from './index';
import { parseAuth0Sub } from '../../parseAuth0User';

ExplorePage.getPageData = async ({ gateways, auth0User }) => {
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
    infoSnapshots,
    authenticatedUserSnapshot,
  };
};

export { ExplorePage };
