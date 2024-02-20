import { useState, useCallback, useMemo } from 'react';
import { Modal, Button } from '../bootstrap';
import { LinkSection } from './LinkSection';
import { CollaboratorsSection } from './CollaboratorsSection';
import { ShareSectionsNav } from './ShareSectionsNav';
import { Plan, User } from 'entities';
import { EmbedSection } from './EmbedSection';
import './styles.scss';

const navItems = [
  { key: 'link', title: 'Link' },
  { key: 'embed', title: 'Embed' },
  { key: 'collaborators', title: 'Collaborators' },
  // { key: 'deploy', title: 'Deploy' },
  // { key: 'snippet', title: 'Snippet' },
];

export const ShareModal = ({
  show,
  onClose,
  linkToCopy,
  onLinkCopy,
  embedSnippetToCopy,
  onEmbedSnippetCopy,
  anyoneCanEdit,
  setAnyoneCanEdit,
  onLinkSectionNavigate,
  onEmbedSectionNavigate,
  onSnippetSectionNavigate,
  onCollaboratorsSectionNavigate,
  handleCollaboratorSearch,
  handleCollaboratorAdd,
  handleCollaboratorRemove,
  showAnyoneCanEdit,
  initialCollaborators,
  currentPlan,
  showCollaboratorsSection,
  brandedOption,
  setBrandedOption,
}: {
  show: boolean;
  linkToCopy: string;
  onLinkCopy: () => void;
  embedSnippetToCopy: string;
  onEmbedSnippetCopy?: () => void;
  onClose: () => void;
  anyoneCanEdit: boolean;
  setAnyoneCanEdit: (anyoneCanEdit: boolean) => void;
  onLinkSectionNavigate?: () => void;
  onEmbedSectionNavigate?: () => void;
  onSnippetSectionNavigate?: () => void;
  onCollaboratorsSectionNavigate?: () => void;
  handleCollaboratorSearch: (
    query: string,
  ) => Promise<User[]>;
  handleCollaboratorAdd: (user: User) => Promise<'success'>;
  handleCollaboratorRemove: (
    userId: string,
  ) => Promise<'success'>;
  showAnyoneCanEdit: boolean;
  initialCollaborators: Array<User>;
  currentPlan: Plan;
  showCollaboratorsSection: boolean;
  brandedOption: string;
  setBrandedOption: (brandedOption: string) => void;
}) => {
  const [section, setSection] = useState('link');

  const handleSectionSelect = useCallback(
    (newSection: string) => {
      // Emit these for analytics only
      if (newSection === 'link' && onLinkSectionNavigate) {
        onLinkSectionNavigate();
      } else if (
        newSection === 'embed' &&
        onEmbedSectionNavigate
      ) {
        onEmbedSectionNavigate();
      } else if (
        newSection === 'snippet' &&
        onSnippetSectionNavigate
      ) {
        onSnippetSectionNavigate();
      } else if (
        newSection === 'collaborators' &&
        onCollaboratorsSectionNavigate
      ) {
        onCollaboratorsSectionNavigate();
      }

      setSection(newSection);
    },
    [
      onLinkSectionNavigate,
      onEmbedSectionNavigate,
      onSnippetSectionNavigate,
      onCollaboratorsSectionNavigate,
    ],
  );

  const navItemsToShow = useMemo(
    () =>
      showCollaboratorsSection
        ? navItems
        : navItems.filter(
            (item) => item.key !== 'collaborators',
          ),
    [showCollaboratorsSection],
  );

  return show ? (
    <Modal
      show={show}
      onHide={onClose}
      animation={false}
      className="vh-share-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Share</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <div className="vh-form-note contextual">
          SHARE WITH
        </div> */}
        {navItemsToShow.length > 1 && (
          <ShareSectionsNav
            section={section}
            handleSectionSelect={handleSectionSelect}
            navItems={navItemsToShow}
          />
        )}
        {section === 'collaborators' && (
          <CollaboratorsSection
            anyoneCanEdit={anyoneCanEdit}
            setAnyoneCanEdit={setAnyoneCanEdit}
            handleCollaboratorSearch={
              handleCollaboratorSearch
            }
            handleCollaboratorAdd={handleCollaboratorAdd}
            handleCollaboratorRemove={
              handleCollaboratorRemove
            }
            showAnyoneCanEdit={showAnyoneCanEdit}
            initialCollaborators={initialCollaborators}
            currentPlan={currentPlan}
          />
        )}
        {section === 'link' && (
          <LinkSection
            linkToCopy={linkToCopy}
            onLinkCopy={onLinkCopy}
          />
        )}
        {section === 'embed' && (
          <EmbedSection
            embedSnippetToCopy={embedSnippetToCopy}
            onEmbedSnippetCopy={onEmbedSnippetCopy}
            brandedOption={brandedOption}
            setBrandedOption={setBrandedOption}
            currentPlan={currentPlan}
          />
        )}
        {/* {section === 'snippet' && (
          <SnippetSection
            snippetToCopy={embedSnippetToCopy}
            onSnippetCopy={onEmbedSnippetCopy}
          />
        )} */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
