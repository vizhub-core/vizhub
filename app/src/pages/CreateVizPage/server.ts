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

  // Gather all the vizIds from the curatedVizzes
  const vizIds = curatedVizzes.reduce(
    (acc, { vizIds }) => [...acc, ...vizIds],
    [] as Array<string>,
  );

  // Detect any duplicates
  const duplicates = vizIds.reduce((acc, vizId) => {
    if (acc.includes(vizId)) {
      return [...acc, vizId];
    }
    return acc;
  }, [] as Array<string>);
  if (duplicates.length > 0) {
    console.log('Error: duplicate vizIds detected:');
    console.log(duplicates);
    return null;
  }

  const infosAndOwnersResult = await getInfosAndOwners({
    noNeedToFetchUsers: [],
    sortId: 'mostForked',
    pageNumber: 0,
    vizIds,
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
