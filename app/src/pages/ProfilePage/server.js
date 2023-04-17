import { ProfilePage } from './index';

ProfilePage.getPageData = async ({ gateways, params }) => {
  const { userName } = params;

  // TODO
  const { getUserByUserName } = gateways;

  // TODO populate displayName properly
  const profileUser = { userName, displayName: userName };

  return {
    title: `${userName} on VizHub`,
    profileUser,
  };
};

export { ProfilePage };
