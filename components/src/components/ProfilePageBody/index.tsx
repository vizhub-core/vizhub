import { VizPreviewCollection } from '../VizPreviewCollection';
import { SortControl } from '../SortControl';
import { More } from '../More';
import './styles.scss';
import { PublicSVG } from '../Icons/sam/PublicSVG';
import { PrivateSVG } from '../Icons/sam/PrivateSVG';
import { OrganizationsSVG } from '../Icons/sam/OrganizationsSVG';
import { SharedSVG } from '../Icons/sam/SharedSVG';
import { StarSVG } from '../Icons/sam/StarSVG';
import { PlusSVG } from '../Icons/sam/PlusSVG';
import { Button } from '../bootstrap';

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

  // Sort control props.
  sortId,
  setSortId,
  sortOptions,
}) => {
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
            <div className="vh-base-02 edit-bio">
              Edit Bio
            </div>
          </div>
          <div className="profile-sidebar-sections">
            <div className="profile-sidebar-section vh-base-01">
              <PublicSVG /> My public vizzes
            </div>
            <div className="profile-sidebar-section vh-base-01 active">
              <PrivateSVG /> My private vizzes
            </div>
            <div className="profile-sidebar-section vh-base-01">
              <OrganizationsSVG /> My organizations
            </div>
            <div className="profile-sidebar-section vh-base-01">
              <SharedSVG /> Shared with me
            </div>
            <div className="profile-sidebar-section vh-base-01">
              <StarSVG /> My starred vizzes
            </div>
          </div>
        </div>
        <div className="profile-content">
          <div className="profile-header">
            <h2>My public vizzes</h2>
            <div className="profile-header-controls">
              {sortOptions ? (
                <SortControl
                  sortId={sortId}
                  setSortId={setSortId}
                  sortOptions={sortOptions}
                />
              ) : null}
              <Button className="create-new-button">
                <PlusSVG />
                Create new
              </Button>
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
