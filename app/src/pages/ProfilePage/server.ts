import { ProfilePage, ProfilePageData } from './index';
import { parseAuth0Sub } from '../../parseAuth0User';
import { GetInfosAndOwners } from 'interactors';
import {
  SortId,
  asSortId,
  defaultSortOption,
} from 'entities';

ProfilePage.getPageData = async ({
  gateways,
  params,
  query,
  auth0User,
}) => {
  const { userName } = params;
  const { getUserByUserName, getUser } = gateways;
  const getInfosAndOwners = GetInfosAndOwners(gateways);

  const userResult = await getUserByUserName(userName);
  if (userResult.outcome === 'success') {
    const profileUserSnapshot = userResult.value;

    const owner = profileUserSnapshot.data.id;

    const sortId: SortId | null =
      asSortId(query.sort) || defaultSortOption.id;

    const infosAndOwnersResult = await getInfosAndOwners({
      owner,
      noNeedToFetchUsers: [owner],
      sortId,
      pageNumber: 0,
    });
    if (infosAndOwnersResult.outcome === 'failure') {
      console.log('Error when fetching infos and owners:');
      console.log(infosAndOwnersResult.error);
      return null;
    }
    const { infoSnapshots } = infosAndOwnersResult.value;

    // If the user is currently authenticated...
    let authenticatedUserSnapshot = null;
    if (auth0User) {
      const authenticatedUserResult = await getUser(
        parseAuth0Sub(auth0User.sub),
      );
      if (authenticatedUserResult.outcome === 'failure') {
        console.log(
          'Error when fetching authenticated user:',
        );
        console.log(authenticatedUserResult.error);
        return null;
      }
      authenticatedUserSnapshot =
        authenticatedUserResult.value;
    }

    const pageData: ProfilePageData = {
      title: `${userName} on VizHub`,
      authenticatedUserSnapshot,
      profileUserSnapshot,
      ownerUserSnapshots: [profileUserSnapshot],
      infoSnapshots,
    };

    return pageData;
  }

  // Indicates user not found
  return null;
};

export { ProfilePage };
