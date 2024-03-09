import { useContext, useEffect } from 'react';
import { Info, Snapshot, sortOptions } from 'entities';
import { ExplorePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';
import { SectionSortContext } from '../../contexts/SectionSortContext';
import { FeaturedLiveViz } from './FeaturedLiveViz';
import { VizKit } from 'api/src/VizKit';

const vizKit = VizKit({ baseUrl: '/api' });

export const Body = ({ featuredLiveViz }) => {
  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      'event.pageview.explore',
    );
  }, []);

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
      >
        <FeaturedLiveViz
          userName={featuredLiveViz.userName}
          vizIdOrSlug={featuredLiveViz.vizIdOrSlug}
        />
      </ExplorePageBody>
    </div>
  );
};
