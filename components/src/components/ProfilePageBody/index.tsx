import { VizPreviewCollection } from '../VizPreviewCollection';
import { SortControl } from '../SortControl';
import { More } from '../More';
import { PublicSVG } from '../Icons/sam/PublicSVG';
import { PrivateSVG } from '../Icons/sam/PrivateSVG';
import { OrganizationsSVG } from '../Icons/sam/OrganizationsSVG';
import { SharedSVG } from '../Icons/sam/SharedSVG';
import { StarSVG } from '../Icons/sam/StarSVG';
import { PlusSVG } from '../Icons/sam/PlusSVG';
import { Button } from '../bootstrap';
import { HomeStarter } from '../HomeStarter';
import './styles.scss';
import { useMemo } from 'react';

const enableEditBio = false;
const enablePrivateSection = false;
const enableOrgsSection = false;
const enableSharedWithMeSection = false;
const enableStarredSection = false;
const enableCreateVizButton = false;

export const ProfilePageBody = ({
  // Viz preview list props.
  renderVizPreviews,
  hasMore,
  onMoreClick,
  isLoadingNextPage,

  // User info props.
  userName,
  displayName,
  picture,
  bio,
  isViewingOwnProfile,

  // Sort control props.
  sortId,
  setSortId,
  sortOptions,
}) => {
  const copy = useMemo(
    () =>
      isViewingOwnProfile
        ? {
            publicVizzes: 'My public vizzes',
            privateVizzes: 'My private vizzes',
            orgs: 'My organizations',
            starred: 'My starred vizzes',
          }
        : {
            publicVizzes: 'Public vizzes',
            privateVizzes: 'Private vizzes',
            orgs: 'Organizations',
            starred: 'Starred vizzes',
          },
    [isViewingOwnProfile],
  );

  return (
    <div className="vh-page vh-profile-page">
      <div className="profile-body">
        <div className="profile-sidebar">
          <div>
            <img className="profile-avatar" src={picture} />
            <h3 className="profile-name">{displayName}</h3>
            <div className="vh-lede-01">@{userName}</div>
          </div>
          <div>
            <div>{bio}</div>
            {enableEditBio && (
              <div className="vh-base-02 edit-bio">
                Edit Bio
              </div>
            )}
          </div>
          <div className="profile-sidebar-sections">
            <div className="profile-sidebar-section vh-base-01 active">
              <PublicSVG /> {copy.publicVizzes}
            </div>
            {enablePrivateSection && (
              <div className="profile-sidebar-section vh-base-01">
                <PrivateSVG /> {copy.privateVizzes}
              </div>
            )}
            {enableOrgsSection && (
              <div className="profile-sidebar-section vh-base-01">
                <OrganizationsSVG /> {copy.orgs}
              </div>
            )}
            {enableStarredSection && (
              <div className="profile-sidebar-section vh-base-01">
                <StarSVG /> {copy.starred}
              </div>
            )}
            {enableSharedWithMeSection &&
              isViewingOwnProfile && (
                <div className="profile-sidebar-section vh-base-01">
                  <SharedSVG /> Shared with me
                </div>
              )}
          </div>
        </div>
        <div className="profile-content">
          {isViewingOwnProfile && <HomeStarter />}
          <div className="profile-header">
            <h2>
              {isViewingOwnProfile
                ? 'My public vizzes'
                : 'Public vizzes'}
            </h2>
            <div className="profile-header-controls">
              {sortOptions ? (
                <SortControl
                  sortId={sortId}
                  setSortId={setSortId}
                  sortOptions={sortOptions}
                />
              ) : null}
              {enableCreateVizButton &&
                isViewingOwnProfile && (
                  <Button className="create-new-button">
                    <PlusSVG />
                    Create new
                  </Button>
                )}
            </div>
          </div>
          <VizPreviewCollection>
            {renderVizPreviews()}
          </VizPreviewCollection>
          <More
            hasMore={hasMore}
            onMoreClick={onMoreClick}
            isLoadingNextPage={isLoadingNextPage}
          />
        </div>
      </div>
    </div>
  );
};
