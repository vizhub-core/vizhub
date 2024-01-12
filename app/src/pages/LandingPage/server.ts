import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { LandingPage, LandingPageData } from './index';

LandingPage.getPageData = async ({
  gateways,
  auth0User,
}): Promise<LandingPageData> => {
  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  const pageData: LandingPageData = {
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

export { LandingPage };
