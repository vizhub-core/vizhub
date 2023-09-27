import { AccountPage, AccountPageData } from './index';
import { parseAuth0Sub } from 'api';

AccountPage.getPageData = async ({
  gateways,
  auth0User,
}): Promise<AccountPageData> => {
  const { getUser } = gateways;
  // If the user is currently authenticated...
  // TODO reduce duplication between pages
  let authenticatedUserSnapshot = null;
  if (auth0User) {
    const authenticatedUserResult = await getUser(
      parseAuth0Sub(auth0User.sub),
    );
    if (authenticatedUserResult.outcome === 'failure') {
      console.log(
        'Error when fetching authenticated user:',
      );
      console.log(authenticatedUserResult.error);
      return null;
    }
    authenticatedUserSnapshot =
      authenticatedUserResult.value;
  }

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
