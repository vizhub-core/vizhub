import { useContext } from 'react';
import {
  Info,
  Snapshot,
  User,
  sortOptions,
} from 'entities';
import { ForksPageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';
import { getVizPageHref } from '../../accessors';
import { SectionSortContext } from '../../contexts/SectionSortContext';

export const Body = ({
  forkedFromInfo,
  forkedFromOwnerUser,
}: {
  forkedFromInfo: Info;
  forkedFromOwnerUser: User;
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
    thumbnailURLs,
  } = useContext(InfosAndOwnersContext);

  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <ForksPageBody
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
                thumbnailURLs={thumbnailURLs}
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
        forkedFromTitle={forkedFromInfo.title}
        forkedFromHref={getVizPageHref({
          ownerUser: forkedFromOwnerUser,
          info: forkedFromInfo,
        })}
      />
    </div>
  );
};
