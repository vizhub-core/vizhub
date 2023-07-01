import { Info, Snapshot, User } from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { SortProvider } from '../../contexts/SortContext';
import { useShareDBDocData } from '../../useShareDBDocData';
import { Page, PageData } from '../Page';
import { Body } from './Body';

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

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={authenticatedUserSnapshot}
    >
      <SortProvider>
        <Body
          infoSnapshots={infoSnapshots}
          profileUser={profileUser}
          // TODO remove this prop for https://github.com/vizhub-core/vizhub3/issues/162
          profileUserSnapshot={profileUserSnapshot}
        />
      </SortProvider>
    </AuthenticatedUserProvider>
  );
};

ProfilePage.path = '/:userName';
