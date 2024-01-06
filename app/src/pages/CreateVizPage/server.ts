import { CreateVizPage, CreateVizPageData } from './index';
import { Gateways } from 'gateways';
import { Auth0User } from '../Page';
import { GetInfosAndOwners } from 'interactors';
import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { curatedVizzes } from './curatedVizzes';

CreateVizPage.getPageData = async ({
  gateways,
  auth0User,
}: {
  gateways: Gateways;
  auth0User: Auth0User | null;
}): Promise<CreateVizPageData> => {
  const getInfosAndOwners = GetInfosAndOwners(gateways);

  const infosAndOwnersResult = await getInfosAndOwners({
    noNeedToFetchUsers: [],
    sortId: 'mostForked',
    pageNumber: 0,
    vizIds: curatedVizzes,
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
