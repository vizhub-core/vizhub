import {
  CreateVizPage,
  CreateVizPageData,
  CreateVizPageQuery,
} from './index';

import {
  SortId,
  asSortId,
  defaultSortOption,
} from 'entities';
import { Gateways } from 'gateways';
import { Auth0User } from '../Page';
import { GetInfosAndOwners } from 'interactors';
import { getAuthenticatedUser } from '../getAuthenticatedUser';

CreateVizPage.getPageData = async ({
  gateways,
  auth0User,
  query,
}: {
  gateways: Gateways;
  auth0User: Auth0User | null;
  query: CreateVizPageQuery;
}): Promise<CreateVizPageData> => {
  const getInfosAndOwners = GetInfosAndOwners(gateways);

  const infosAndOwnersResult = await getInfosAndOwners({
    noNeedToFetchUsers: [],
    sortId: 'mostForked',
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

  return {
    title: `Create Viz`,
    authenticatedUserSnapshot,
    infoSnapshots,
    ownerUserSnapshots,
    hasMore,
  };
};

export { CreateVizPage };
