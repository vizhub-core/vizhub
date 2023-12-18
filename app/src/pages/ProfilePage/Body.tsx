import { useContext } from 'react';
import {
  User,
  sortOptions,
  getBio,
  getUserDisplayName,
} from 'entities';
import { ProfilePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { SortContext } from '../../contexts/SortContext';
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
    hasMore,
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
        bio={getBio(profileUser)}
        picture={picture}
        sortId={sortId}
        setSortId={setSortId}
        sortOptions={sortOptions}
        hasMore={hasMore}
        onMoreClick={fetchNextPage}
        isLoadingNextPage={isLoadingNextPage}
      />
    </div>
  );
};
