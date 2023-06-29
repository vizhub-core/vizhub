import { Info, Snapshot, User } from 'entities';
import { ProfilePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { useShareDBDocData } from '../../useShareDBDocData';
import { VizPreviewPresenter } from '../VizPreviewPresenter';
import { Page, PageData } from '../Page';

export type ProfilePageData = PageData & {
  profileUserSnapshot: Snapshot<User>;
  infoSnapshots: Array<Snapshot<Info>>;
};

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ProfilePage: Page = ({
  pageData,
}: {
  pageData: ProfilePageData;
}) => {
  const { profileUserSnapshot, infoSnapshots, authenticatedUserSnapshot } =
    pageData;

  // Subscribe to real-time updates in case something changes like display name.
  const profileUser: User = useShareDBDocData(profileUserSnapshot, 'User');
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
                ownerUserSnapshot={profileUserSnapshot}
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
