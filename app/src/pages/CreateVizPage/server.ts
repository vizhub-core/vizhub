import { CreateVizPage, CreateVizPageData } from './index';
import { Gateways } from 'gateways';
import { Auth0User } from '../Page';
import {
  GetInfosAndOwners,
  ResolveVizPaths,
} from 'interactors';
import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { curatedVizzes } from './curatedVizzes';
import { VizPath } from 'entities';

CreateVizPage.getPageData = async ({
  gateways,
  auth0User,
}: {
  gateways: Gateways;
  auth0User: Auth0User | null;
}): Promise<CreateVizPageData> => {
  const getInfosAndOwners = GetInfosAndOwners(gateways);
  const resolveVizPaths = ResolveVizPaths(gateways);

  // Gather all the VizPaths from the curatedVizzes
  const vizPaths: Array<VizPath> = curatedVizzes.reduce(
    (acc, { vizPaths }) => [...acc, ...vizPaths],
    [],
  );

  // Detect and report any duplicates
  const duplicates = vizPaths.reduce((acc, vizPath) => {
    if (acc.includes(vizPath)) {
      return [...acc, vizPath];
    }
    return acc;
  }, [] as Array<string>);
  if (duplicates.length > 0) {
    console.log('Error: duplicate vizIds detected:');
    console.log(duplicates);
    return null;
  }

  const resolvedVizIdsResult = await resolveVizPaths({
    vizPaths,
  });
  if (resolvedVizIdsResult.outcome === 'failure') {
    console.log('Error when resolving vizPaths:');
    console.log(resolvedVizIdsResult.error);
    return null;
  }

  const { vizIdsByPath, vizIds } =
    resolvedVizIdsResult.value;

  // console.log({ vizIdsByPath, vizIds });

  const infosAndOwnersResult = await getInfosAndOwners({
    noNeedToFetchUsers: [],
    sortId: 'mostForked',

    // Fetch all infos, no pagination
    disablePagination: true,
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
    vizIdsByPath,
  };
};

export { CreateVizPage };
