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
    defaultSortId: 'popular',
    pageNumber: 0,
  });
  if (infosAndOwnersResult.outcome === 'failure') {
    console.log('Error when fetching infos and owners:');
    console.log(infosAndOwnersResult.error);
    return null;
  }
  const { infoSnapshots, ownerUserSnapshots, hasMore } =
    infosAndOwnersResult.value;

  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  const mostRecentInfoSnapshots = await getInfosAndOwners({
    noNeedToFetchUsers: [],
    sortId: 'mostRecent',
    defaultSortId: 'mostRecent',
    pageNumber: 0,
    pageSize: 1,
  });
  if (mostRecentInfoSnapshots.outcome === 'failure') {
    console.log('Error when fetching most recent infos:');
    console.log(mostRecentInfoSnapshots.error);
    return null;
  }
  const {
    infoSnapshots: mostRecentInfos,
    ownerUserSnapshots: mostRecentOwners,
  } = mostRecentInfoSnapshots.value;

  const featuredLiveViz = {
    vizIdOrSlug:
      mostRecentInfos[0].data.slug ||
      mostRecentInfos[0].data.id,
    userName: mostRecentOwners[0].data.userName,
  };

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
    featuredLiveViz,
  };
};

export { ExplorePage };
