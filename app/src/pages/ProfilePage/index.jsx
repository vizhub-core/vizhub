import { ProfilePageBody } from 'components/src/components/ProfilePageBody';
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
