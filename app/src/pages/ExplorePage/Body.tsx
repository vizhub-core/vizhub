import { useContext } from 'react';
import { Info, Snapshot, sortOptions } from 'entities';
import { ExplorePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { SortContext } from '../../contexts/SortContext';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';

export const Body = () => {
  const { sortId, setSortId } = useContext(SortContext);

  const {
    allInfoSnapshots,
    fetchNextPage,
    ownerUserSnapshotsById,
    isLoadingNextPage,
    hasMore,
  } = useContext(InfosAndOwnersContext);

  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <ExplorePageBody
        renderVizPreviews={() =>
          allInfoSnapshots.map(
            (infoSnapshot: Snapshot<Info>) => (
              <VizPreviewPresenter
                key={infoSnapshot.data.id}
                infoSnapshot={infoSnapshot}
                ownerUser={
                  ownerUserSnapshotsById[
                    infoSnapshot.data.owner
                  ].data
                }
              />
            ),
          )
        }
        sortId={sortId}
        setSortId={setSortId}
        sortOptions={sortOptions}
        hasMore={hasMore}
        onMoreClick={fetchNextPage}
        isLoadingNextPage={isLoadingNextPage}
      />
    </div>
  );
};
