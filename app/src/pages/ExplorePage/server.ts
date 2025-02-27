import {
  ExplorePage,
  ExplorePageData,
  ExplorePageQuery,
  explorePageDefaultSortId,
} from './index';
import { SortId, asSortId } from 'entities';
import { Gateways } from 'gateways';
import { Auth0User } from '../Page';
import { GetInfosAndOwners } from 'interactors';
import { getAuthenticatedUser } from '../getAuthenticatedUser';

ExplorePage.getPageData = async ({
  gateways,
  auth0User,
  query,
}: {
  gateways: Gateways;
  auth0User: Auth0User | null;
  query: ExplorePageQuery;
}): Promise<ExplorePageData> => {
  const getInfosAndOwners = GetInfosAndOwners(gateways);

  const sortId: SortId | null =
    asSortId(query.sort) || explorePageDefaultSortId;

  const infosAndOwnersResult = await getInfosAndOwners({
    noNeedToFetchUsers: [],
    sortId,
    defaultSortId: explorePageDefaultSortId,
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

  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  return {
    title: `VizHub`,
    description: 'Data visualization platform for the web',
    authenticatedUserSnapshot,
    infoSnapshots,
    ownerUserSnapshots,
    sortId,
    hasMore,
    image:
      'https://vizhub-images.s3.amazonaws.com/home-unfurl.webp',
    thumbnailURLs,
  };
};

export { ExplorePage };
