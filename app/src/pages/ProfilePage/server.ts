import { ProfilePage, ProfilePageData } from './index';
import { GetInfosAndOwners } from 'interactors';
import {
  SectionId,
  SortId,
  asSectionId,
  asSortId,
  defaultSectionId,
} from 'entities';
import { getAuthenticatedUser } from '../getAuthenticatedUser';

const defaultSortId: SortId = 'mostRecent';

ProfilePage.getPageData = async ({
  gateways,
  params,
  query,
  auth0User,
}) => {
  const { userName } = params;
  const { getUserByUserName } = gateways;
  const getInfosAndOwners = GetInfosAndOwners(gateways);

  const userResult = await getUserByUserName(userName);
  if (userResult.outcome === 'success') {
    const profileUserSnapshot = userResult.value;

    const owner = profileUserSnapshot.data.id;

    const sortId: SortId | null =
      asSortId(query.sort) || defaultSortId;

    const sectionId: SectionId | null =
      asSectionId(query.section) || defaultSectionId;

    const { authenticatedUserSnapshot } =
      await getAuthenticatedUser({
        gateways,
        auth0User,
      });

    const infosAndOwnersResult = await getInfosAndOwners({
      owner,
      noNeedToFetchUsers: [owner],
      sectionId,
      sortId,
      pageNumber: 0,
      authenticatedUserId:
        authenticatedUserSnapshot?.data?.id,
    });
    if (infosAndOwnersResult.outcome === 'failure') {
      console.log('Error when fetching infos and owners:');
      console.log(infosAndOwnersResult.error);
      return null;
    }
    const {
      infoSnapshots,
      ownerUserSnapshots,
      hasMore,
      thumbnailURLs,
    } = infosAndOwnersResult.value;

    const pageData: ProfilePageData = {
      title: `${userName} on VizHub`,
      authenticatedUserSnapshot,
      profileUserSnapshot,
      ownerUserSnapshots,
      infoSnapshots,
      hasMore,
      thumbnailURLs,
    };

    return pageData;
  }

  // Indicates user not found
  return null;
};

export { ProfilePage };
