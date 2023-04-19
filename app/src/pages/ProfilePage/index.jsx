import { ProfilePageBody } from 'components/src/components/ProfilePageBody';
import { useShareDBDocData } from '../../useShareDBDocData';
import { VizPreviewPresenter } from './VizPreviewPresenter';
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ProfilePage = ({ pageData }) => {
  const { profileUserSnapshot, infoSnapshots } = pageData;

  // Subscribe to real-time updates in case something changes like display name.
  const profileUser = useShareDBDocData(profileUserSnapshot, 'User');
  const { userName, displayName, picture } = profileUser;

  return (
    <ProfilePageBody
      renderVizPreviews={() =>
        infoSnapshots.map((infoSnapshot) => (
          <VizPreviewPresenter
            key={infoSnapshot.data.id}
            infoSnapshot={infoSnapshot}
            ownerUser={profileUser}
          />
        ))
      }
      displayName={displayName}
      userName={userName}
      picture={picture}
    />
  );
};

ProfilePage.path = '/:userName';
