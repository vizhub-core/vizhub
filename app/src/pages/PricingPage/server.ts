import { image } from 'components/src/components/image';
import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { PricingPage, PricingPageData } from './index';

PricingPage.getPageData = async ({
  gateways,
  auth0User,
}): Promise<PricingPageData> => {
  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  const pageData: PricingPageData = {
    title: 'VizHub Pricing',
    authenticatedUserSnapshot,
    description: [
      'Upgrade to the VizHub Premium to get access to private vizzes,',
      'unlimited real-time collaborators, and AI-Assisted coding!',
    ].join(' '),
    image: image('pricing-page-unfurl'),
  };

  return pageData;
};

export { PricingPage };
