import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal, Nav, Button } from '../bootstrap';
import { LinkSection } from './LinkSection';

const sections = {
  link: LinkSection,

  // TODO
  embed: () => null,

  // TODO
  snippet: () => null,
};

export const ShareModal = ({
  show,
  linkToCopy,
  onClose,
  onLinkCopy,
  onLinkSectionNavigate,
  onEmbedSectionNavigate,
  onSnippetSectionNavigate,
}) => {
  const [section, setSection] = useState('link');
  const Section = sections[section];

  const handleSectionSelect = useCallback((newSection) => {
    // Emit these for analytics only
    if (newSection === 'link') {
      onLinkSectionNavigate();
    } else if (newSection === 'embed') {
      onEmbedSectionNavigate();
    } else if (newSection === 'snippet') {
      onSnippetSectionNavigate();
    }

    setSection(newSection);
  }, []);

  return show ? (
    <Modal show={show} onHide={onClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Share</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="vh-form-note contextual">
          SHARE WITH
        </div>
        <Nav
          variant="pills"
          defaultActiveKey={section}
          onSelect={handleSectionSelect}
        >
          <Nav.Item>
            <Nav.Link eventKey="link">Link</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="embed">Embed</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="snippet">Snippet</Nav.Link>
          </Nav.Item>
        </Nav>
        <Section
          linkToCopy={linkToCopy}
          onLinkCopy={onLinkCopy}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};

ShareModal.propTypes = {
  onClose: PropTypes.func.isRequired,

  // Exposed for analytics only
  onLinkCopy: PropTypes.func.isRequired,

  // Exposed for analytics only
  onLinkSectionNavigate: PropTypes.func.isRequired,

  // Exposed for analytics only
  onEmbedSectionNavigate: PropTypes.func.isRequired,

  // Exposed for analytics only
  onSnippetSectionNavigate: PropTypes.func.isRequired,
};
