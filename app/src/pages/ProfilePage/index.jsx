import { ProfilePageBody } from 'components/src/components/ProfilePageBody';
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ProfilePage = ({ pageData }) => {
  const { profileUserSnapshot } = pageData;

  // TODO ShareDB sync
  const profileUser = profileUserSnapshot.data;

  const { userName, displayName, picture } = profileUser;

  return (
    <ProfilePageBody
      renderVizPreviews={() => null}
      displayName={displayName}
      userName={userName}
      picture={picture}
    />
  );
};

ProfilePage.path = '/:userName';
