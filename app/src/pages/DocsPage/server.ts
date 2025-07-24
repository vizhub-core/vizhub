import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { DocsPage, DocsPageData } from './index';

DocsPage.getPageData = async ({
  gateways,
  auth0User,
}): Promise<DocsPageData> => {
  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  const pageData: DocsPageData = {
    title: `VizHub Documentation`,
    description:
      'Comprehensive documentation for VizHub features, API reference, examples, and tutorials.',
    authenticatedUserSnapshot,
    image:
      'https://vizhub-images.s3.amazonaws.com/home-unfurl.webp',
  };

  return pageData;
};

export { DocsPage };
