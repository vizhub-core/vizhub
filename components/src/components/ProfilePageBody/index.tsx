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
import { SectionId, SortId } from 'entities';
import { useMemo } from 'react';
import { SidebarSection } from './SidebarSection';
import './styles.scss';

const enableEditBio = false;
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

  // Active section
  sectionId,
  setSectionId,
}: {
  // Viz preview list props.
  renderVizPreviews: () => React.ReactNode;
  hasMore: boolean;
  onMoreClick: () => void;
  isLoadingNextPage: boolean;

  // User info props.
  userName: string;
  displayName: string;
  picture: string;
  bio: string;
  isViewingOwnProfile: boolean;

  // Sort control props.
  sortId: SortId;
  setSortId: (sortId: SortId) => void;
  sortOptions: { id: SortId; label: string }[];

  // Active section
  sectionId: SectionId;
  setSectionId: (sectionId: SectionId) => void;
}) => {
  const copy: { [K in SectionId]: string } = useMemo(
    () => ({
      public: isViewingOwnProfile
        ? 'My public vizzes'
        : 'Public vizzes',
      private: 'My private vizzes',
      shared: 'Shared with me',
      orgs: isViewingOwnProfile
        ? 'My organizations'
        : 'Organizations',
      starred: isViewingOwnProfile
        ? 'My starred vizzes'
        : 'Starred vizzes',
    }),
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
            <SidebarSection
              sectionId="public"
              SVGComponent={PublicSVG}
              label={copy.public}
              isActive={sectionId === 'public'}
              setSectionId={setSectionId}
            />
            {isViewingOwnProfile && (
              <>
                <SidebarSection
                  sectionId="private"
                  SVGComponent={PrivateSVG}
                  label={copy.private}
                  isActive={sectionId === 'private'}
                  setSectionId={setSectionId}
                />
                <SidebarSection
                  sectionId="shared"
                  SVGComponent={SharedSVG}
                  label={copy.shared}
                  isActive={sectionId === 'shared'}
                  setSectionId={setSectionId}
                />
              </>
            )}
            <SidebarSection
              sectionId="orgs"
              SVGComponent={OrganizationsSVG}
              label={copy.orgs}
              isActive={sectionId === 'orgs'}
              setSectionId={setSectionId}
            />
            <SidebarSection
              sectionId="starred"
              SVGComponent={StarSVG}
              label={copy.starred}
              isActive={sectionId === 'starred'}
              setSectionId={setSectionId}
            />
          </div>
        </div>
        <div className="profile-content">
          {isViewingOwnProfile && <HomeStarter />}
          <div className="profile-header">
            <h2>{copy[sectionId]}</h2>
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
