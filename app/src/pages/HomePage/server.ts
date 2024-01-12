import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { HomePage, HomePageData } from './index';

HomePage.getPageData = async ({
  gateways,
  auth0User,
}): Promise<HomePageData> => {
  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  const pageData: HomePageData = {
    title: 'VizHub',
    authenticatedUserSnapshot,
    description: [
      'VizHub is a data visualization platform',
    ].join(''),
    image:
      'https://vizhub.com/api/visualization/preview/77a2f42571494263931b8c4d38b7d63c.png',
  };

  return pageData;
};

export { HomePage };
