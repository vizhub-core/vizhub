import { useState, useCallback } from 'react';
import { Modal, Button } from '../bootstrap';
import { LinkSection } from './LinkSection';
import { CollaboratorsSection } from './CollaboratorsSection';
import { ShareSectionsNav } from './ShareSectionsNav';
import { User } from 'entities';

const navItems = [
  { key: 'link', title: 'Link' },
  { key: 'collaborators', title: 'Collaborators' },
  // { key: 'embed', title: 'Embed' },
  // { key: 'deploy', title: 'Deploy' },
  // { key: 'snippet', title: 'Snippet' },
];

export const ShareModal = ({
  show,
  linkToCopy,
  onClose,
  onLinkCopy,
  anyoneCanEdit,
  setAnyoneCanEdit,
  onLinkSectionNavigate,
  onEmbedSectionNavigate,
  onSnippetSectionNavigate,
  onCollaboratorsSectionNavigate,
  handleCollaboratorSearch,
}: {
  show: boolean;
  linkToCopy: string;
  onClose: () => void;
  onLinkCopy: () => void;
  anyoneCanEdit: boolean;
  setAnyoneCanEdit: (anyoneCanEdit: boolean) => void;
  onLinkSectionNavigate?: () => void;
  onEmbedSectionNavigate?: () => void;
  onSnippetSectionNavigate?: () => void;
  onCollaboratorsSectionNavigate?: () => void;
  handleCollaboratorSearch: (
    query: string,
  ) => Promise<User[]>;
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

  return show ? (
    <Modal show={show} onHide={onClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Share</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="vh-form-note contextual">
          SHARE WITH
        </div>
        <ShareSectionsNav
          section={section}
          handleSectionSelect={handleSectionSelect}
          navItems={navItems}
        />
        {section === 'collaborators' && (
          <CollaboratorsSection
            anyoneCanEdit={anyoneCanEdit}
            setAnyoneCanEdit={setAnyoneCanEdit}
            handleCollaboratorSearch={
              handleCollaboratorSearch
            }
          />
        )}
        {section === 'link' && (
          <LinkSection
            linkToCopy={linkToCopy}
            onLinkCopy={onLinkCopy}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
