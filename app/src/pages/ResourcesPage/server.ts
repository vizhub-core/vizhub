import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { ResourcesPage, ResourcesPageData } from './index';

ResourcesPage.getPageData = async ({
  gateways,
  auth0User,
}): Promise<ResourcesPageData> => {
  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  const pageData: ResourcesPageData = {
    title: 'VizHub Resources',
    authenticatedUserSnapshot,
    description: [
      'Resources related to VizHub and data visualization',
    ].join(''),
    image:
      'https://vizhub.com/api/visualization/preview/77a2f42571494263931b8c4d38b7d63c.png',
  };

  return pageData;
};

export { ResourcesPage };
