import { ProfilePageBody } from 'ui/src/components/ProfilePageBody';
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ProfilePage = ({ pageData }) => {
  const { profileUser } = pageData;
  const { userName, displayName } = profileUser;
  return (
    <ProfilePageBody
      renderVizPreviews={() => null}
      displayName={displayName}
      userName={userName}
    />
  );
};

ProfilePage.path = '/:userName';
ProfilePage.getPageData = async (params) => {
  const { userName } = params;
  // TODO populate user as authenticatedUser

  // TODO populate displayName properly
  const profileUser = { userName, displayName: userName };

  return {
    title: `${userName} on VizHub`,
    profileUser,
  };
};
