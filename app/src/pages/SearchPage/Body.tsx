import { useContext } from 'react';
import { Info, Snapshot, sortOptions } from 'entities';
import { SearchPageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';
import { SectionSortContext } from '../../contexts/SectionSortContext';

export const Body = ({
  initialSearchQuery,
}: {
  initialSearchQuery: string;
}) => {
  const { sortId, setSortId } = useContext(
    SectionSortContext,
  );

  const {
    allInfoSnapshots,
    fetchNextPage,
    ownerUserSnapshotsById,
    isLoadingNextPage,
    hasMore,
  } = useContext(InfosAndOwnersContext);

  // For local thumbnail generation triggering
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (hasMore && !isLoadingNextPage) {
  //       fetchNextPage();
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [hasMore, fetchNextPage]);

  return (
    <div className="vh-page overflow-auto">
      <SmartHeader
        initialSearchQuery={initialSearchQuery}
      />
      <SearchPageBody
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
