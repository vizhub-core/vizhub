import {
  Info,
  Snapshot,
  User,
  UserId,
  defaultSortOption,
  sortOptions,
} from 'entities';
import { ExplorePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { VizPreviewPresenter } from '../VizPreviewPresenter';
import { Page, PageData } from '../Page';
import { useEffect, useMemo, useState } from 'react';

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
        <ExplorePageBody
          renderVizPreviews={() =>
            infoSnapshots.map((infoSnapshot: Snapshot<Info>) => {
              const info: Info = infoSnapshot.data;
              return (
                <VizPreviewPresenter
                  key={info.id}
                  infoSnapshot={infoSnapshot}
                  ownerUserSnapshot={ownerUserSnapshotMap.get(info.owner)}
                />
              );
            })
          }
          sortId={sortId}
          setSortId={setSortId}
          sortOptions={sortOptions}
        />
      </div>
    </AuthenticatedUserProvider>
  );
};

ExplorePage.path = '/explore';
