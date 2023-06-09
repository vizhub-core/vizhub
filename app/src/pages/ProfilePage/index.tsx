import { User } from 'entities';
import { ProfilePageBody, Header } from 'components';

import { useShareDBDocData } from '../../useShareDBDocData';
import { VizPreviewPresenter } from './VizPreviewPresenter';
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ProfilePage = ({ pageData }) => {
  const { profileUserSnapshot, infoSnapshots, authenticatedUserSnapshot } =
    pageData;

  // Subscribe to real-time updates in case something changes like display name.
  const profileUser = useShareDBDocData(profileUserSnapshot, 'User');
  const { userName, displayName, picture } = profileUser;

  const authenticatedUser: User = useShareDBDocData(
    authenticatedUserSnapshot,
    'User'
  );

  return (
    <div className="vh-page overflow-auto">
      <Header
        loginHref={'/login'}
        logoutHref={'/logout'}
        profileHref={`/${authenticatedUser.userName}`}
        authenticatedUserAvatarURL={authenticatedUser.picture}
      ></Header>
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
    </div>
  );
};

ProfilePage.path = '/:userName';
