import { VizPreviewCollection } from '../VizPreviewCollection';
import { SortControl } from '../SortControl';
import { More } from '../More';
import { PublicSVG } from '../Icons/sam/PublicSVG';
import { PrivateSVG } from '../Icons/sam/PrivateSVG';
import { OrganizationsSVG } from '../Icons/sam/OrganizationsSVG';
import { SharedSVG } from '../Icons/sam/SharedSVG';
import {
  StarSVG,
  StarSVGSymbol,
} from '../Icons/sam/StarSVG';
import { SectionId, SortId } from 'entities';
import { useMemo } from 'react';
import { SidebarSection } from './SidebarSection';
import { UpgradeCallout } from '../UpgradeCallout';
import { CreateNewButton } from '../CreateNewButton';
import { ServerSVG } from '../Icons/sam/ServerSVG';
import { BellSVG } from '../Icons/sam/BellSVG';
import { PrivateVizzesUpgradeCallout } from '../PrivateVizzesUpgradeCallout';
import { ForkSVGSymbol } from '../Icons/sam/ForkSVG';
import './styles.scss';

const enableEditBio = false;
const enableCreateVizButton = true;
const enableAPIKeys = false;

// Feature flags for which sections to show.
const enabledSections: Set<SectionId> = new Set([
  SectionId.Public,
  SectionId.Private,
  SectionId.Shared,
  SectionId.Starred,
  // SectionId.ApiKeys,
  // SectionId.Notifications,
  // SectionId.Orgs,
]);
if (enableAPIKeys) {
  enabledSections.add(SectionId.ApiKeys);
}

type ProfileSection = {
  id: SectionId;
  SVGComponent: React.FunctionComponent;
  label: string;
  show?: boolean;
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
  sectionId,
  setSectionId,

  showUpgradeCallout,
  enableFreeTrial,

  handleCreateAPIKeyClick,
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

  // True when the user is on the free plan and viewing
  // their private vizzes
  showUpgradeCallout: boolean;
  enableFreeTrial: boolean;

  handleCreateAPIKeyClick: () => void;
}) => {
  const sections: Array<ProfileSection> = useMemo(
    () =>
      [
        {
          id: SectionId.Public,
          SVGComponent: PublicSVG,
          label: isViewingOwnProfile
            ? 'My public vizzes'
            : 'Public vizzes',
        },
        {
          id: SectionId.Private,
          SVGComponent: PrivateSVG,
          label: 'My private vizzes',
          show: isViewingOwnProfile,
        },
        {
          id: SectionId.Starred,
          SVGComponent: StarSVG,
          label: isViewingOwnProfile
            ? 'My starred vizzes'
            : 'Starred vizzes',
        },
        {
          id: SectionId.Shared,
          SVGComponent: SharedSVG,
          label: 'Shared with me',
          show: isViewingOwnProfile,
        },
        {
          id: SectionId.Notifications,
          SVGComponent: BellSVG,
          label: 'Notifications',
          show: isViewingOwnProfile,
        },
        {
          id: SectionId.ApiKeys,
          SVGComponent: ServerSVG,
          label: 'API keys',
          show: isViewingOwnProfile,
        },
        {
          id: SectionId.Orgs,
          SVGComponent: OrganizationsSVG,
          label: isViewingOwnProfile
            ? 'My organizations'
            : 'Organizations',
        },
      ].filter((section: ProfileSection) =>
        enabledSections.has(section.id),
      ),
    [isViewingOwnProfile],
  );

  // Use the same copy in the header
  // as in the sidebar.
  const profileHeader = useMemo(
    () =>
      sections.find((section) => section.id === sectionId)
        .label,
    [sectionId],
  );

  return (
    <div className="vh-page vh-profile-page">
      {/*
       * Icon symbols are defined here and not in VizPreviews
       * because the star icon is used in the sidebar.
       */}
      <ForkSVGSymbol />
      <StarSVGSymbol />
      <div className="profile-body vh-page-container">
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
            {sections.map(
              (section: ProfileSection) =>
                section.show !== false && (
                  <SidebarSection
                    key={section.id}
                    sectionId={section.id}
                    SVGComponent={section.SVGComponent}
                    label={section.label}
                    isActive={sectionId === section.id}
                    setSectionId={setSectionId}
                  />
                ),
            )}
          </div>
        </div>
        <div className="profile-content">
          {/* {isViewingOwnProfile &&
            currentPlan === 'free' &&
            sectionId === 'public' && <HomeStarter />} */}
          <div className="profile-header">
            <h2>{profileHeader}</h2>
            <div className="profile-header-controls">
              {sectionId === SectionId.ApiKeys ? (
                <CreateNewButton
                  href={null}
                  label="Create API key"
                  onClick={handleCreateAPIKeyClick}
                />
              ) : (
                <>
                  {sortOptions ? (
                    <SortControl
                      sortId={sortId}
                      setSortId={setSortId}
                      sortOptions={sortOptions}
                    />
                  ) : null}
                  {enableCreateVizButton &&
                    isViewingOwnProfile && (
                      <CreateNewButton />
                    )}
                </>
              )}
            </div>
          </div>
          {showUpgradeCallout && (
            <UpgradeCallout
              featureId="private-vizzes"
              enableFreeTrial={enableFreeTrial}
            >
              <PrivateVizzesUpgradeCallout />
            </UpgradeCallout>
          )}
          {sectionId === SectionId.ApiKeys ? (
            'API Keys go here'
          ) : (
            <VizPreviewCollection
              opacity={showUpgradeCallout ? 0.5 : 1}
              includeSymbols={false}
            >
              {renderVizPreviews()}
            </VizPreviewCollection>
          )}
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
