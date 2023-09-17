import { SearchPage, SearchPageData } from './index';
import { getAuthenticatedUser } from '../getAuthenticatedUser';

SearchPage.getPageData = async ({
  gateways,
  auth0User,
  query,
}): Promise<SearchPageData> => {
  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  return {
    title: `VizHub Search Results`,
    authenticatedUserSnapshot,
    query: query.query,
  };
};

export { SearchPage };
