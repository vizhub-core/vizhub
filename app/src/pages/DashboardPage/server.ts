import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { DashboardPage, DashboardPageData } from './index';

DashboardPage.getPageData = async ({
  gateways,
  auth0User,
}): Promise<DashboardPageData> => {
  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  const pageData: DashboardPageData = {
    title: 'VizHub Dashboard',
    authenticatedUserSnapshot,
    description: 'Your personal VizHub dashboard',
    image: 'https://vizhub.com/api/canvas/vizhub-logo.png',
  };

  return pageData;
};

export { DashboardPage };
