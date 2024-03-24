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
import { CreateAPIKeyModal } from 'components';
import { useCallback, useState } from 'react';

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

  const [showCreateAPIKeyModal, setShowCreateAPIKeyModal] =
    useState(false);

  const handleCreateAPIKeyClick = useCallback(() => {
    setShowCreateAPIKeyModal(true);
  }, []);

  const handleCloseCreateAPIKeyModal = useCallback(() => {
    setShowCreateAPIKeyModal(false);
  }, []);

  const createAPIKey = useCallback(
    async ({ name }: { name: string }) => {
      console.log('Creating API key with name:', name);
      await new Promise((resolve) =>
        setTimeout(resolve, 3000),
      );
      return '43257483295748329';
    },
    [],
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
        >
          <Body
            profileUser={profileUser}
            handleCreateAPIKeyClick={
              handleCreateAPIKeyClick
            }
          />
          <ProfilePageToasts />
        </InfosAndOwnersProvider>
      </SectionSortProvider>
      <CreateAPIKeyModal
        show={showCreateAPIKeyModal}
        onClose={handleCloseCreateAPIKeyModal}
        createAPIKey={createAPIKey}
      />
    </AuthenticatedUserProvider>
  );
};

ProfilePage.path = '/:userName';
