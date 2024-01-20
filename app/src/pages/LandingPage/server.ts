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
    title: `VizHub`,
    description:
      'Collaborative data visualization platform for the Web',
    authenticatedUserSnapshot,
    image:
      'https://vizhub-images.s3.amazonaws.com/home-unfurl.webp',
  };

  return pageData;
};

export { LandingPage };
