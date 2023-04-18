import { ProfilePage } from './index';

ProfilePage.getPageData = async ({ gateways, params }) => {
  const { userName } = params;
  const { getUserByUserName } = gateways;

  const result = await getUserByUserName(userName);
  if (result.outcome === 'success') {
    return {
      title: `${userName} on VizHub`,
      profileUserSnapshot: result.value,
    };
  }

  // Indicates not found
  return null;
};

export { ProfilePage };
