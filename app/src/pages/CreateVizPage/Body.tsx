import { useContext } from 'react';
import { Info, Snapshot } from 'entities';
import { CreateVizPageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';

export const Body = () => {
  const { allInfoSnapshots, ownerUserSnapshotsById } =
    useContext(InfosAndOwnersContext);
  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <CreateVizPageBody
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
      />
    </div>
  );
};
