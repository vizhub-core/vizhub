import { ForksPage, ForksPageData, ForksPageQuery } from './index';
import { parseAuth0Sub } from '../../parseAuth0User';
import { SortId, VizId, asSortId, defaultSortOption } from 'entities';
import { Gateways } from 'gateways';
import { Auth0User } from '../Page';
import { GetInfosAndOwners } from 'interactors';

ForksPage.getPageData = async ({
  gateways,
  params,
  auth0User,
  query,
}: {
  gateways: Gateways;
  auth0User: Auth0User | null;
  query: ForksPageQuery;
  params: { id: string };
}): Promise<ForksPageData> => {
  const forkedFrom: VizId = params.id;
  const { getUser } = gateways;
  const getInfosAndOwners = GetInfosAndOwners(gateways);

  const sortId: SortId | null = asSortId(query.sort) || defaultSortOption.id;

  const infosAndOwnersResult = await getInfosAndOwners({
    forkedFrom,
    noNeedToFetchUsers: [],
    sortId,
    pageNumber: 0,
  });
  if (infosAndOwnersResult.outcome === 'failure') {
    console.log('Error when fetching infos and owners:');
    console.log(infosAndOwnersResult.error);
    return null;
  }
  const { infoSnapshots, ownerUserSnapshots } = infosAndOwnersResult.value;

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
    title: `Forks of TODO add viz name here`,
    authenticatedUserSnapshot,
    infoSnapshots,
    ownerUserSnapshots,
    sortId,
    forkedFrom,
  };
};

export { ForksPage };
