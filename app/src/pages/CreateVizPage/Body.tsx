import { useContext, useMemo } from 'react';
import { VizId } from 'entities';
import { CreateVizPageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';
import {
  CuratedVizCollection,
  curatedVizzes,
} from './curatedVizzes';

export const Body = () => {
  const { allInfoSnapshots, ownerUserSnapshotsById } =
    useContext(InfosAndOwnersContext);

  const infoSnapshotsById = useMemo(
    () =>
      allInfoSnapshots.reduce(
        (map, infoSnapshot) => ({
          ...map,
          [infoSnapshot.data.id]: infoSnapshot,
        }),
        {},
      ),
    [allInfoSnapshots],
  );

  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <CreateVizPageBody
        renderVizPreviews={() =>
          curatedVizzes.map(
            (collection: CuratedVizCollection) => {
              const { title, description, vizIds } =
                collection;
              return (
                <div key={title}>
                  {title}
                  {description()}
                  {vizIds.map((id: VizId) => {
                    const infoSnapshot =
                      infoSnapshotsById[id];
                    return infoSnapshot ? (
                      <VizPreviewPresenter
                        key={infoSnapshot.data.id}
                        infoSnapshot={infoSnapshot}
                        ownerUser={
                          ownerUserSnapshotsById[
                            infoSnapshot.data.owner
                          ].data
                        }
                      />
                    ) : null;
                  })}
                </div>
              );
            },
          )
        }
      />
    </div>
  );
};
