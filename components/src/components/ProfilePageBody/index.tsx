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
import { useCallback, useMemo } from 'react';
import { SortId } from 'entities';
import './styles.scss';

// Feature flags
const enabledSections = {
  public: true,
  // private: false,
  // orgs: false,
  // shared: false,
  // starred: false,
  private: true,
  // orgs: true,
  // shared: true,
  // starred: true,
};

const enableEditBio = false;
const enableCreateVizButton = false;

// One section of the sidebar
const SidebarSection = ({
  section,
  SVGComponent,
  label,
  isActive,
  setActiveSection,
}) => {
  if (!enabledSections[section]) return null;

  const handleClick = useCallback(() => {
    setActiveSection(section);
  }, [setActiveSection, section]);

  return (
    <div
      className={`profile-sidebar-section vh-base-01 ${
        isActive ? 'active' : ''
      }`}
      onClick={handleClick}
    >
      <SVGComponent /> {label}
    </div>
  );
};

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
  activeSection,
  setActiveSection,
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
  activeSection: ProfilePageSection;
  setActiveSection: (section: ProfilePageSection) => void;
}) => {
  const copy = useMemo(
    () => ({
      publicVizzes: isViewingOwnProfile
        ? 'My public vizzes'
        : 'Public vizzes',
      privateVizzes: isViewingOwnProfile
        ? 'My private vizzes'
        : 'Private vizzes',
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
              section="public"
              SVGComponent={PublicSVG}
              label={copy.publicVizzes}
              isActive={activeSection === 'public'}
              setActiveSection={setActiveSection}
            />
            <SidebarSection
              section="private"
              SVGComponent={PrivateSVG}
              label={copy.privateVizzes}
              isActive={activeSection === 'private'}
              setActiveSection={setActiveSection}
            />
            <SidebarSection
              section="orgs"
              SVGComponent={OrganizationsSVG}
              label={copy.orgs}
              isActive={activeSection === 'orgs'}
              setActiveSection={setActiveSection}
            />
            <SidebarSection
              section="starred"
              SVGComponent={StarSVG}
              label={copy.starred}
              isActive={activeSection === 'starred'}
              setActiveSection={setActiveSection}
            />
            {isViewingOwnProfile && (
              <SidebarSection
                section="shared"
                SVGComponent={SharedSVG}
                label="Shared with me"
                isActive={activeSection === 'shared'}
                setActiveSection={setActiveSection}
              />
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
