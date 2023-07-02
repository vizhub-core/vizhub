import { Info, Snapshot, User, sortOptions } from 'entities';
import { ProfilePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../VizPreviewPresenter';
import { useContext } from 'react';
import { SortContext } from '../../contexts/SortContext';
import { getUserDisplayName } from '../../accessors/getUserDisplayName';

export const Body = ({
  infoSnapshots,
  profileUser,
}: {
  infoSnapshots: Array<Snapshot<Info>>;
  profileUser: User;
}) => {
  const { userName, picture } = profileUser;

  const { sortId, setSortId } = useContext(SortContext);

  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <ProfilePageBody
        renderVizPreviews={() =>
          infoSnapshots.map((infoSnapshot) => (
            <VizPreviewPresenter
              key={infoSnapshot.data.id}
              infoSnapshot={infoSnapshot}
              ownerUser={profileUser}
            />
          ))
        }
        displayName={getUserDisplayName(profileUser)}
        userName={userName}
        picture={picture}
        sortId={sortId}
        setSortId={setSortId}
        sortOptions={sortOptions}
      />
    </div>
  );
};
