import xss from 'xss';
import { Info, SortId, VizId, asSortId } from 'entities';
import { GetInfosAndOwners } from 'interactors';
import { Gateways } from 'gateways';
import { Auth0User } from '../Page';
import { getAuthenticatedUser } from '../getAuthenticatedUser';
import {
  ForksPage,
  ForksPageData,
  ForksPageQuery,
} from './index';

const defaultSortId: SortId = 'mostRecent';

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

  const sortId: SortId | null =
    asSortId(query.sort) || defaultSortId;

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
  const { infoSnapshots, ownerUserSnapshots, hasMore } =
    infosAndOwnersResult.value;

  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

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
  const forkedFromOwnerResult = await getUser(
    forkedFromInfo.owner,
  );
  if (forkedFromOwnerResult.outcome === 'failure') {
    console.log('Error when fetching forked-from owner:');
    console.log(forkedFromOwnerResult.error);
    return null;
  }
  const forkedFromOwnerUserSnapshot =
    forkedFromOwnerResult.value;

  return {
    title: `Forks of ${xss(forkedFromInfo.title)}`,
    authenticatedUserSnapshot,
    infoSnapshots,
    ownerUserSnapshots,
    sortId,
    forkedFrom,
    forkedFromInfoSnapshot,
    forkedFromOwnerUserSnapshot,
    hasMore,
  };
};

export { ForksPage };
