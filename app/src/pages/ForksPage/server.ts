import xss from 'xss';
import {
  Info,
  Snapshot,
  SortId,
  User,
  VizId,
  asSortId,
} from 'entities';
import {
  GetInfoByIdOrSlug,
  GetInfosAndOwners,
} from 'interactors';
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
  params: { userName, idOrSlug },
  auth0User,
  query,
}: {
  gateways: Gateways;
  auth0User: Auth0User | null;
  query: ForksPageQuery;
  params: { userName: string; idOrSlug: string };
}): Promise<ForksPageData> => {
  const { getUser, getInfo, getUserByUserName } = gateways;
  const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);
  const getInfosAndOwners = GetInfosAndOwners(gateways);

  // Get the User entity for the owner of the viz.
  const ownerUserResult = await getUserByUserName(userName);
  if (ownerUserResult.outcome === 'failure') {
    console.log('Error when fetching owner user:');
    console.log(ownerUserResult.error);
    return null;
  }
  const ownerUserSnapshot = ownerUserResult.value;
  const starredVizOwnerUser: User = ownerUserSnapshot.data;

  // Get the Info entity of the Viz.
  const infoResult = await getInfoByIdOrSlug({
    userId: starredVizOwnerUser.id,
    idOrSlug,
  });
  if (infoResult.outcome === 'failure') {
    return null;
  }
  const infoSnapshot: Snapshot<Info> = infoResult.value;

  // Get the viz id from the userName & slug/id
  const forkedFrom: VizId = infoSnapshot.data.id;

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
