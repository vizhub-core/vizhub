import { ForksPage, ForksPageData, ForksPageQuery } from './index';
import { parseAuth0Sub } from '../../parseAuth0User';
import { Info, SortId, VizId, asSortId, defaultSortOption } from 'entities';
import { Gateways } from 'gateways';
import { Auth0User } from '../Page';
import { GetInfosAndOwners } from 'interactors';
import xss from 'xss';

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
  const { getUser, getInfo } = gateways;
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

  // Get the Info snapshot for the forked-from viz
  const forkedFromInfoResult = await getInfo(forkedFrom);
  if (forkedFromInfoResult.outcome === 'failure') {
    console.log('Error when fetching forked-from info:');
    console.log(forkedFromInfoResult.error);
    return null;
  }
  const forkedFromInfoSnapshot = forkedFromInfoResult.value;
  const forkedFromInfo: Info = forkedFromInfoSnapshot.data;

  // Get the owner of the forked-from viz
  const forkedFromOwnerResult = await getUser(forkedFromInfo.owner);
  if (forkedFromOwnerResult.outcome === 'failure') {
    console.log('Error when fetching forked-from owner:');
    console.log(forkedFromOwnerResult.error);
    return null;
  }
  const forkedFromOwnerUserSnapshot = forkedFromOwnerResult.value;

  return {
    title: `Forks of ${xss(forkedFromInfo.title)}`,
    authenticatedUserSnapshot,
    infoSnapshots,
    ownerUserSnapshots,
    sortId,
    forkedFrom,
    forkedFromInfoSnapshot,
    forkedFromOwnerUserSnapshot,
  };
};

export { ForksPage };
