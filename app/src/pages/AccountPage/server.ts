import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { AccountPage, AccountPageData } from './index';
import { parseAuth0Sub } from 'api';

AccountPage.getPageData = async ({
  gateways,
  auth0User,
}): Promise<AccountPageData> => {
  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  const pageData: AccountPageData = {
    title: 'VizHub Account',
    authenticatedUserSnapshot,
    description: ['VizHub Account Page'].join(' '),
    image:
      'https://vizhub.com/api/visualization/preview/77a2f42571494263931b8c4d38b7d63c.png',
  };

  return pageData;
};

export { AccountPage };
