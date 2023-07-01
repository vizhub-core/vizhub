import { Info, Snapshot, User, defaultSortOption, sortOptions } from 'entities';
import { ProfilePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { useShareDBDocData } from '../../useShareDBDocData';
import { VizPreviewPresenter } from '../VizPreviewPresenter';
import { Page, PageData } from '../Page';
import { useEffect, useState } from 'react';

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

  // TODO URL param for sort
  const [sortId, setSortId] = useState(defaultSortOption.id);

  useEffect(() => {
    console.log('sortId changed to', sortId);
  }, [sortId]);

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
          sortId={sortId}
          setSortId={setSortId}
          sortOptions={sortOptions}
        />
      </div>
    </AuthenticatedUserProvider>
  );
};

ProfilePage.path = '/:userName';
