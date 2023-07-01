import { Info, Snapshot, sortOptions } from 'entities';
import { ExplorePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { SortContext } from '../../contexts/SortContext';
import { VizPreviewPresenter } from '../VizPreviewPresenter';
import { useContext } from 'react';

export const Body = ({ infoSnapshots, ownerUserSnapshotMap }) => {
  const { sortId, setSortId } = useContext(SortContext);

  return (
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
  );
};
