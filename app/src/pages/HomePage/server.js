import { HomePage } from './index';
import { parseAuth0Sub } from '../../parseAuth0User';

HomePage.getPageData = async ({ gateways, auth0User }) => {
  const { getUser } = gateways;
  // If the user is currently authenticated...
  let authenticatedUserSnapshot = null;
  if (auth0User) {
    const authenticatedUserResult = await getUser(parseAuth0Sub(auth0User.sub));
    if (authenticatedUserResult.outcome === 'failure') {
      console.log('Error when fetching authenticated user:');
      console.log(authenticatedUserResult.error);
      return null;
    }
    authenticatedUserSnapshot = authenticatedUserResult.value;
  }

  return {
    title: 'VizHub 3 Beta',
    description: 'Viz your data',
    image:
      'https://vizhub.com/api/visualization/preview/77a2f42571494263931b8c4d38b7d63c.png',
    authenticatedUserSnapshot,
  };
};

export { HomePage };
