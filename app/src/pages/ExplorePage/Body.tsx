import { Info, Snapshot, sortOptions } from 'entities';
import { ExplorePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { SortContext } from '../../contexts/SortContext';
import { VizPreviewPresenter } from '../VizPreviewPresenter';
import { useContext } from 'react';

export const Body = ({ infoSnapshots, ownerUserMap, fetchNextPage }) => {
  const { sortId, setSortId } = useContext(SortContext);

  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <ExplorePageBody
        renderVizPreviews={() =>
          infoSnapshots.map((infoSnapshot: Snapshot<Info>) => (
            <VizPreviewPresenter
              key={infoSnapshot.data.id}
              infoSnapshot={infoSnapshot}
              ownerUser={ownerUserMap.get(infoSnapshot.data.owner)}
            />
          ))
        }
        sortId={sortId}
        setSortId={setSortId}
        sortOptions={sortOptions}
        onMoreClick={fetchNextPage}
      />
    </div>
  );
};
