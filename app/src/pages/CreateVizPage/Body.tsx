import { useCallback, useContext, useMemo } from 'react';
import { User, UserId, VizId } from 'entities';
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

  const getUserById = useCallback(
    (id: UserId) => {
      return ownerUserSnapshotsById[id].data;
    },
    [ownerUserSnapshotsById],
  );

  ownerUserSnapshotsById[allInfoSnapshots[0]?.data.owner]
    .data;
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

  const infoSnapshotsByUsernameAndSlug = useMemo(
    () =>
      allInfoSnapshots.reduce(
        (map, infoSnapshot) => ({
          ...map,
          [`${getUserById(infoSnapshot.data.owner).userName}/${infoSnapshot.data.slug}`]:
            infoSnapshot,
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
            (collection: CuratedVizCollection) => (
              <div key={collection.title}>
                <h2>{collection.title}</h2>
                <p>{collection.description()}</p>
                <VizPreviewCollection>
                  {collection.vizIds.map((id: VizId) => {
                    // List items can be either ids or
                    // username/slug pairs. Look up the
                    // corresponding infoSnapshot.
                    let infoSnapshot =
                      infoSnapshotsById[id];

                    if (!infoSnapshot) {
                      infoSnapshot =
                        infoSnapshotsByUsernameAndSlug[id];
                    }
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
                        ownerUser={getUserById(
                          infoSnapshot.data.owner,
                        )}
                      />
                    );
                  })}
                </VizPreviewCollection>
              </div>
            ),
          )
        }
      />
    </div>
  );
};
