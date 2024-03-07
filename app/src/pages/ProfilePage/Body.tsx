import { useCallback, useContext, useMemo } from 'react';
import {
  User,
  sortOptions,
  getBio,
  getUserDisplayName,
  FREE,
} from 'entities';
import { ProfilePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { SectionSortContext } from '../../contexts/SectionSortContext';
import { image } from 'components/src/components/image';
import { isFreeTrialEligible } from '../../accessors/isFreeTrialEligible';

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
    ownerUserSnapshotsById,
    allInfoSnapshots,
    fetchNextPage,
    isLoadingNextPage,
    hasMore,
  } = useContext(InfosAndOwnersContext);

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

  const showUpgradeCallout =
    isViewingOwnProfile &&
    authenticatedUser?.plan === FREE &&
    sectionId === 'private';

  const renderVizPreviews = useCallback(
    () => (
      <>
        {allInfoSnapshots.map((infoSnapshot) => (
          <VizPreviewPresenter
            key={infoSnapshot.data.id}
            infoSnapshot={infoSnapshot}
            ownerUser={
              // Usually it's the profile user, but not in the
              // "Shared with me" section
              infoSnapshot.data.owner === profileUser.id
                ? profileUser
                : ownerUserSnapshotsById[
                    infoSnapshot.data.owner
                  ].data
            }
          />
        ))}
        {showUpgradeCallout &&
          allInfoSnapshots.length === 0 && (
            <>
              <img
                style={{ width: '100%' }}
                src={image('empty-private-vizzes', 'svg')}
              />
              <img
                style={{ width: '100%' }}
                src={image('empty-private-vizzes', 'svg')}
              />
            </>
          )}
      </>
    ),
    [allInfoSnapshots, profileUser, showUpgradeCallout],
  );

  const enableFreeTrial = useMemo(
    () => isFreeTrialEligible(authenticatedUser),
    [authenticatedUser],
  );

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
        showUpgradeCallout={showUpgradeCallout}
        enableFreeTrial={enableFreeTrial}
      />
    </div>
  );
};
