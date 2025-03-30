import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { AILandingPage, AILandingPageData } from './index';

AILandingPage.getPageData = async ({
  gateways,
  auth0User,
}): Promise<AILandingPageData> => {
  const { authenticatedUserSnapshot } = await getAuthenticatedUser({
    gateways,
    auth0User,
  });

  const pageData: AILandingPageData = {
    title: `VizHub AI`,
    description: 'AI-Powered Data Visualization Platform',
    authenticatedUserSnapshot,
    image: 'https://vizhub-images.s3.amazonaws.com/home-unfurl.webp',
  };

  return pageData;
};

export { AILandingPage };
