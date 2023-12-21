import {
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  User,
  sortOptions,
  getBio,
  getUserDisplayName,
} from 'entities';
import {
  ProfilePageBody,
  ProfilePageSection,
} from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { SortContext } from '../../contexts/SortContext';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';

export const Body = ({
  profileUser,
}: {
  profileUser: User;
}) => {
  const { userName, picture } = profileUser;
  const authenticatedUser = useContext(
    AuthenticatedUserContext,
  );

  const { sortId, setSortId } = useContext(SortContext);

  // TODO make this part of the URL
  // Public: https://vizhub.com/curran
  // Private https://vizhub.com/curran?section=private
  const [activeSection, setActiveSection] =
    useState<ProfilePageSection>('public');

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
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </div>
  );
};
