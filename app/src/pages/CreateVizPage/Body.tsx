import { useContext, useMemo } from 'react';
import { VizId, VizPath } from 'entities';
import { CreateVizPageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';
import {
  CuratedVizCollection,
  curatedVizzes,
} from './curatedVizzes';
import { VizPreviewCollection } from 'components/src/components/VizPreviewCollection';

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
              const { title, description, vizPaths } =
                collection;
              return (
                <div key={title}>
                  <h2>{title}</h2>
                  <p>{description()}</p>
                  <VizPreviewCollection>
                    {vizPaths.map((vizPath: VizPath) => {
                      const id: VizId =
                        vizIdsByPath[vizPath];
                      const infoSnapshot =
                        infoSnapshotsById[id];

                      // Don't crash in local development, where
                      // these ids are not present.
                      if (!infoSnapshot) {
                        console.warn(
                          `No infoSnapshot for id ${id}`,
                        );
                        return null;
                      }

                      return (
                        <VizPreviewPresenter
                          key={infoSnapshot.data.id}
                          infoSnapshot={infoSnapshot}
                          ownerUser={
                            ownerUserSnapshotsById[
                              infoSnapshot.data.owner
                            ].data
                          }
                        />
                      );
                    })}
                  </VizPreviewCollection>
                </div>
              );
            },
          )
        }
      />
    </div>
  );
};
