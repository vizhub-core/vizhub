import { Info, Snapshot, User } from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { SortProvider } from '../../contexts/SortContext';
import { useShareDBDocData } from '../../useShareDBDocData';
import { Page, PageData } from '../Page';
import { Body } from './Body';
import {
  InfosAndOwnersPageData,
  InfosAndOwnersProvider,
} from '../../contexts/InfosAndOwnersContext';

export type ProfilePageData = PageData &
  InfosAndOwnersPageData & {
    profileUserSnapshot: Snapshot<User>;
    infoSnapshots: Array<Snapshot<Info>>;
  };

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ProfilePage: Page = ({
  pageData,
}: {
  pageData: ProfilePageData;
}) => {
  const { profileUserSnapshot, authenticatedUserSnapshot } = pageData;

  // Subscribe to real-time updates in case something changes like display name.
  const profileUser: User = useShareDBDocData(profileUserSnapshot, 'User');

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={authenticatedUserSnapshot}
    >
      <SortProvider>
        <InfosAndOwnersProvider
          infoSnapshots={pageData.infoSnapshots}
          ownerUserSnapshots={pageData.ownerUserSnapshots}
          owner={profileUser.id}
        >
          <Body profileUser={profileUser} />
        </InfosAndOwnersProvider>
      </SortProvider>
    </AuthenticatedUserProvider>
  );
};

ProfilePage.path = '/:userName';
