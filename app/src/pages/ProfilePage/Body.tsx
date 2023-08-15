import { User, sortOptions } from 'entities';
import { ProfilePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../VizPreviewPresenter';
import { useContext } from 'react';
import { SortContext } from '../../contexts/SortContext';
import { getUserDisplayName } from '../../accessors/getUserDisplayName';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';

export const Body = ({
  profileUser,
}: {
  profileUser: User;
}) => {
  const { userName, picture } = profileUser;

  const { sortId, setSortId } = useContext(SortContext);

  const {
    allInfoSnapshots,
    fetchNextPage,
    isLoadingNextPage,
  } = useContext(InfosAndOwnersContext);

  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <ProfilePageBody
        renderVizPreviews={() =>
          allInfoSnapshots.map((infoSnapshot) => (
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
        onMoreClick={fetchNextPage}
        isLoadingNextPage={isLoadingNextPage}
      />
    </div>
  );
};
