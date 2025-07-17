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
import { useMemo, useState } from 'react';
import { SidebarSection } from './SidebarSection';
import { UpgradeCallout } from '../UpgradeCallout';
import { CreateNewButton } from '../CreateNewButton';
import { ServerSVG } from '../Icons/sam/ServerSVG';
import { BellSVG } from '../Icons/sam/BellSVG';
import { PrivateVizzesUpgradeCallout } from '../PrivateVizzesUpgradeCallout';
import { ForkSVGSymbol } from '../Icons/sam/ForkSVG';
import './styles.scss';
import { UnlistedSVG } from '../Icons/sam/UnlistedSVG';

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

  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(bio);
  
  const handleEditBio = () => {
    setIsEditing(true);
  };
  
  const handleSaveBio = () => {
    // In a real implementation, you would save the bio to the backend here
    setIsEditing(false);
    // For now, we're just updating the local state
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedBio(bio);
  };

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
          <div className="profile-info">
            <img className="profile-avatar" src={picture} alt={displayName} />
            <h3 className="profile-name">{displayName}</h3>
            <div className="vh-lede-01 username">@{userName}</div>
          </div>
          <div className="profile-bio">
            {isEditing ? (
              <div className="bio-edit-container">
                <textarea 
                  className="bio-textarea"
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
                <div className="bio-edit-actions">
                  <button className="bio-save-btn" onClick={handleSaveBio}>Save</button>
                  <button className="bio-cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="bio-content">{bio || "No bio yet"}</div>
                {enableEditBio && isViewingOwnProfile && (
                  <div className="vh-base-02 edit-bio" onClick={handleEditBio}>
                    {bio ? "Edit Bio" : "Add Bio"}
                  </div>
                )}
              </>
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
            <h2 className="section-title">{profileHeader}</h2>
            <div className="profile-header-controls">
              {sectionId === SectionId.ApiKeys ? (
                showCreateAPIKeyButton ? (
                  <CreateNewButton
                    href={null}
                    label="Create API key"
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
