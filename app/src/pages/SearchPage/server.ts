import { SearchPage, SearchPageData, SearchPageQuery } from './index';
import { parseAuth0Sub } from '../../parseAuth0User';
import { Info, SortId, VizId, asSortId, defaultSortOption } from 'entities';
import { Gateways } from 'gateways';
import { Auth0User } from '../Page';
import { GetInfosAndOwners } from 'interactors';
import xss from 'xss';

SearchPage.getPageData = async ({
  gateways,
  auth0User,
  query,
}: {
  gateways: Gateways;
  auth0User: Auth0User | null;
  query: SearchPageQuery;
  params: { id: string };
}): Promise<SearchPageData> => {
  const { getUser } = gateways;

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
    title: `VizHub Search Results`,
    authenticatedUserSnapshot,
    query: query.query,
  };
};

export { SearchPage };
