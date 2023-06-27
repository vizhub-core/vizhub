import { User } from 'entities';
import { ProfilePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { useShareDBDocData } from '../../useShareDBDocData';
import { VizPreviewPresenter } from '../VizPreviewPresenter';
import { ProfilePageData } from './server';
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ProfilePage = ({ pageData }: { pageData: ProfilePageData }) => {
  const { profileUserSnapshot, infoSnapshots, authenticatedUserSnapshot } =
    pageData;

  // Subscribe to real-time updates in case something changes like display name.
  const profileUser = useShareDBDocData(profileUserSnapshot, 'User');
  const { userName, displayName, picture } = profileUser;

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={authenticatedUserSnapshot}
    >
      <div className="vh-page overflow-auto">
        <SmartHeader />
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
    </AuthenticatedUserProvider>
  );
};

ProfilePage.path = '/:userName';
