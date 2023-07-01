import { useMemo } from 'react';
import { Info, Snapshot, User, UserId } from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { SortProvider } from '../../contexts/SortContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';

export type ExplorePageData = PageData & {
  // The first page of results
  infoSnapshots: Array<Snapshot<Info>>;

  // The users that are owners of these Infos
  ownerUserSnapshots: Array<Snapshot<User>>;
};

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ExplorePage: Page = ({
  pageData,
}: {
  pageData: ExplorePageData;
}) => {
  const { infoSnapshots, authenticatedUserSnapshot, ownerUserSnapshots } =
    pageData;

  // Memoize a map of infoId -> ownerUser
  // TODO solve this for pagination case
  const ownerUserSnapshotMap = useMemo(
    () =>
      new Map<UserId, Snapshot<User>>(
        ownerUserSnapshots.map((snapshot: Snapshot<User>) => [
          snapshot.data.id,
          snapshot,
        ])
      ),
    [ownerUserSnapshots]
  );

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={authenticatedUserSnapshot}
    >
      <SortProvider>
        <Body
          infoSnapshots={infoSnapshots}
          ownerUserSnapshotMap={ownerUserSnapshotMap}
        />
      </SortProvider>
    </AuthenticatedUserProvider>
  );
};

ExplorePage.path = '/explore';
