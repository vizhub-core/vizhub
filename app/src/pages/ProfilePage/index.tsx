import { Info, Snapshot, User } from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { useShareDBDocData } from '../../useShareDBDocData';
import {
  InfosAndOwnersPageData,
  InfosAndOwnersProvider,
} from '../../contexts/InfosAndOwnersContext';
import { SectionSortProvider } from '../../contexts/SectionSortContext';
import { Page, PageData } from '../Page';
import { ProfilePageToasts } from './ProfilePageToasts';
import { Body } from './Body';

export type ProfilePageData = PageData &
  InfosAndOwnersPageData & {
    profileUserSnapshot: Snapshot<User>;
    infoSnapshots: Array<Snapshot<Info>>;
    hasMore: boolean;
  };

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ProfilePage: Page = ({
  pageData,
}: {
  pageData: ProfilePageData;
}) => {
  const {
    profileUserSnapshot,
    authenticatedUserSnapshot,
    hasMore,
  } = pageData;

  // Subscribe to real-time updates in case something changes like display name.
  const profileUser: User = useShareDBDocData<User>(
    profileUserSnapshot,
    'User',
  );

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={authenticatedUserSnapshot}
    >
      <SectionSortProvider>
        <InfosAndOwnersProvider
          infoSnapshots={pageData.infoSnapshots}
          ownerUserSnapshots={pageData.ownerUserSnapshots}
          hasMoreInitially={hasMore}
          owner={profileUser.id}
          thumbnailURLs={pageData.thumbnailURLs}
        >
          <Body profileUser={profileUser} />
          <ProfilePageToasts />
        </InfosAndOwnersProvider>
      </SectionSortProvider>
    </AuthenticatedUserProvider>
  );
};

ProfilePage.path = '/:userName';
