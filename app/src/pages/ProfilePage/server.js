import { ProfilePage } from './index';

ProfilePage.getPageData = async ({ gateways, params }) => {
  const { userName } = params;
  const { getUserByUserName } = gateways;

  const result = await getUserByUserName(userName);
  if (result.outcome === 'success') {
    // getInfosByOwner

    return {
      title: `${userName} on VizHub`,
      profileUserSnapshot: result.value,
    };
  }

  // Indicates user not found
  return null;
};

export { ProfilePage };
