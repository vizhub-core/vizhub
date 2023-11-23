import { useContext } from 'react';
import {
  Info,
  Snapshot,
  User,
  sortOptions,
} from 'entities';
import { ForksPageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { SortContext } from '../../contexts/SortContext';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';
import { getVizPageHref } from '../../accessors';

export const Body = ({
  forkedFromInfo,
  forkedFromOwnerUser,
}: {
  forkedFromInfo: Info;
  forkedFromOwnerUser: User;
}) => {
  const { sortId, setSortId } = useContext(SortContext);

  const {
    allInfoSnapshots,
    fetchNextPage,
    ownerUserSnapshotsById,
    isLoadingNextPage,
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
              />
            ),
          )
        }
        sortId={sortId}
        setSortId={setSortId}
        sortOptions={sortOptions}
        onMoreClick={fetchNextPage}
        isLoadingNextPage={isLoadingNextPage}
        forkedFromTitle={forkedFromInfo.title}
        forkedFromHref={getVizPageHref(
          forkedFromOwnerUser,
          forkedFromInfo,
        )}
      />
    </div>
  );
};
