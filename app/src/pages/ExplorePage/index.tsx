import { useCallback, useMemo } from 'react';
import { Info, Snapshot, SortId, User, UserId } from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { SortProvider } from '../../contexts/SortContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';

export type ExplorePageData = PageData & {
  // The first page of results
  infoSnapshots: Array<Snapshot<Info>>;

  // The users that are owners of these Infos
  ownerUserSnapshots: Array<Snapshot<User>>;

  sortId: SortId;
};

// The type for the query parameters for this page
export type ExplorePageQuery = {
  // The sort order for the results
  sort?: SortId;
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
  // TODO solve for changing sort order
  const ownerUserMap: Map<UserId, User> = useMemo(
    () =>
      new Map(
        ownerUserSnapshots.map((snapshot: Snapshot<User>) => [
          snapshot.data.id,
          snapshot.data,
        ])
      ),
    [ownerUserSnapshots]
  );

  const fetchNextPage = useCallback(() => {
    // TODO Invoke API to fetch next page
    console.log('TODO: fetch next page');
  }, []);

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={authenticatedUserSnapshot}
    >
      <SortProvider>
        <Body
          infoSnapshots={infoSnapshots}
          ownerUserMap={ownerUserMap}
          fetchNextPage={fetchNextPage}
        />
      </SortProvider>
    </AuthenticatedUserProvider>
  );
};

ExplorePage.path = '/explore';
