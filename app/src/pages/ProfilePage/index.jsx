import { ProfilePageBody } from 'components/src/components/ProfilePageBody';
import { useShareDBDocData } from '../../useShareDBDocData';
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ProfilePage = ({ pageData }) => {
  const { profileUserSnapshot } = pageData;

  // Subscribe to real-time updates in case something changes like display name.
  const profileUser = useShareDBDocData(profileUserSnapshot, 'User');
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
