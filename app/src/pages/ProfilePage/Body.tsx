import { useCallback, useContext, useMemo } from 'react';
import {
  User,
  sortOptions,
  getBio,
  getUserDisplayName,
} from 'entities';
import { ProfilePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { SectionSortContext } from '../../contexts/SectionSortContext';

export const Body = ({
  profileUser,
}: {
  profileUser: User;
}) => {
  const { userName, picture } = profileUser;
  const authenticatedUser = useContext(
    AuthenticatedUserContext,
  );

  const { sectionId, setSectionId, sortId, setSortId } =
    useContext(SectionSortContext);

  const {
    allInfoSnapshots,
    fetchNextPage,
    isLoadingNextPage,
    hasMore,
  } = useContext(InfosAndOwnersContext);

  const renderVizPreviews = useCallback(
    () =>
      allInfoSnapshots.map((infoSnapshot) => (
        <VizPreviewPresenter
          key={infoSnapshot.data.id}
          infoSnapshot={infoSnapshot}
          ownerUser={profileUser}
        />
      )),
    [allInfoSnapshots, profileUser],
  );

  const displayName = useMemo(
    () => getUserDisplayName(profileUser),
    [profileUser],
  );

  const bio = useMemo(
    () => getBio(profileUser),
    [profileUser],
  );

  const isViewingOwnProfile =
    authenticatedUser?.id === profileUser.id;

  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <ProfilePageBody
        renderVizPreviews={renderVizPreviews}
        displayName={displayName}
        userName={userName}
        bio={bio}
        picture={picture}
        sortId={sortId}
        setSortId={setSortId}
        sortOptions={sortOptions}
        hasMore={hasMore}
        onMoreClick={fetchNextPage}
        isLoadingNextPage={isLoadingNextPage}
        isViewingOwnProfile={isViewingOwnProfile}
        sectionId={sectionId}
        setSectionId={setSectionId}
        currentPlan={authenticatedUser?.plan}
      />
    </div>
  );
};
