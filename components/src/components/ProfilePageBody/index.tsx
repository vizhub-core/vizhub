import { VizPreviewCollection } from '../VizPreviewCollection';
import { SortControl } from '../SortControl';
import { More } from '../More';
import { PublicSVG } from '../Icons/sam/PublicSVG';
import { PrivateSVG } from '../Icons/sam/PrivateSVG';
import { OrganizationsSVG } from '../Icons/sam/OrganizationsSVG';
import { SharedSVG } from '../Icons/sam/SharedSVG';
import {
  ThumbsUpSVG,
  ThumbsUpSVGSymbol,
} from '../Icons/sam/ThumbsUpSVG';
import { SectionId, SortId, Plan } from 'entities';
import { useMemo } from 'react';
import { SidebarSection } from './SidebarSection';
import { UpgradeCallout } from '../UpgradeCallout';
import {
  CreateNewButton,
  CREATE_API_KEY,
} from '../CreateNewButton';
import { ServerSVG } from '../Icons/sam/ServerSVG';
import { BellSVG } from '../Icons/sam/BellSVG';
import { PrivateVizzesUpgradeCallout } from '../PrivateVizzesUpgradeCallout';
import { ForkSVGSymbol } from '../Icons/sam/ForkSVG';
import './styles.scss';
import { UnlistedSVG } from '../Icons/sam/UnlistedSVG';
import { PlanBrandPremiumSVG } from '../Icons/sam/PlanBrandPremiumSVG';
import { OverlayTrigger, Tooltip } from '../bootstrap';

const enableEditBio = false;
const enableCreateVizButton = true;
const enableAPIKeys = true;

// Feature flags for which sections to show.
const enabledSections: Set<SectionId> = new Set([
  SectionId.Public,
  SectionId.Private,
  SectionId.Unlisted,
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
  children,

  // User info props.
  userName,
  displayName,
  picture,
  bio,
  isViewingOwnProfile,
  plan,

  // Sort control props.
  sortId,
  setSortId,
  sortOptions,

  // Active section
  sectionId,
  setSectionId,

  showUpgradeCallout,

  handleCreateAPIKeyClick,
  showCreateAPIKeyButton,
}: {
  children: React.ReactNode;

  // User info props.
  userName: string;
  displayName: string;
  picture: string;
  bio: string;
  isViewingOwnProfile: boolean;
  plan: Plan;

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

  handleCreateAPIKeyClick: () => void;
  showCreateAPIKeyButton: boolean;
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
          id: SectionId.Unlisted,
          SVGComponent: UnlistedSVG,
          label: 'My unlisted vizzes',
          show: isViewingOwnProfile,
        },
        {
          id: SectionId.Starred,
          SVGComponent: ThumbsUpSVG,
          label: isViewingOwnProfile
            ? 'My liked vizzes'
            : 'Liked vizzes',
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
      <ThumbsUpSVGSymbol />
      <div className="profile-body vh-page-container">
        <div className="profile-sidebar">
          <div>
            <div className="profile-avatar-container">
              <img
                className="profile-avatar"
                src={picture}
              />
              {plan === 'premium' && (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="premium-badge-tooltip">
                      Plan: Premium
                    </Tooltip>
                  }
                >
                  <a
                    href="/pricing"
                    className="profile-premium-badge"
                  >
                    <PlanBrandPremiumSVG />
                  </a>
                </OverlayTrigger>
              )}
            </div>
            <h3 className="profile-name">{displayName}</h3>
            <div className="profile-username-section">
              <div className="vh-lede-01">@{userName}</div>
            </div>
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
                showCreateAPIKeyButton ? (
                  <CreateNewButton
                    href={null}
                    buttonType={CREATE_API_KEY}
                    onClick={handleCreateAPIKeyClick}
                  />
                ) : null
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
            <UpgradeCallout featureId="private-vizzes">
              <PrivateVizzesUpgradeCallout />
            </UpgradeCallout>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
