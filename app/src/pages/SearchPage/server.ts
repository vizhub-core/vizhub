import { SearchPage, SearchPageData } from './index';
import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { GetInfosAndOwners } from 'interactors';
import { SortId, asSortId } from 'entities';
import { explorePageDefaultSortId } from '../ExplorePage';

SearchPage.getPageData = async ({
  gateways,
  auth0User,
  query,
}): Promise<SearchPageData> => {
  const getInfosAndOwners = GetInfosAndOwners(gateways);

  const sortId: SortId | null =
    asSortId(query.sort) || explorePageDefaultSortId;

  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  const infosAndOwnersResult = await getInfosAndOwners({
    query: query.query,
    noNeedToFetchUsers: [],
    sortId,
    defaultSortId: 'popular',
    pageNumber: 0,
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

  return {
    title: `VizHub Search Results`,
    authenticatedUserSnapshot,
    initialSearchQuery: query.query,
    infoSnapshots,
    ownerUserSnapshots,
    sortId,
    hasMore,
    thumbnailURLs,
  };
};

export { SearchPage };
