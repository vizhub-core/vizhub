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
    title: 'VizHub 3 Beta',
    authenticatedUserSnapshot,
    description: [
      // Inspired by result generated by Google's AI 6/7/2023
      'VizHub 3 is a private beta program',
      'that allows users to develop custom data visualizations',
      'faster and more collaboratively.',
      'The program provides "accelerators" such as',
      'in-browser viz authorship, ',
      'collaborative source code editing, ',
      'hot reloading, versioned preview links, ',
      'hosted production deployments, ',
      'revision history and ',
      'advanced access control that help individuals and teams',
      'deliver dataviz projects.',
    ].join(''),
    image:
      'https://vizhub.com/api/visualization/preview/77a2f42571494263931b8c4d38b7d63c.png',
  };

  return pageData;
};

export { LandingPage };
