import { useState, useCallback } from 'react';
import { Modal, Form, Button } from '../bootstrap';
import { VisibilityControl } from '../VisibilityControl';
import { OwnerControl } from '../OwnerControl';

export const SettingsModal = ({
  show,
  onClose,
  onSave,
  initialTitle,
  initialVisibility,
  initialOwner,
  possibleOwners,
  currentPlan,
  pricingHref,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [visibility, setVisibility] = useState(
    initialVisibility,
  );
  const [owner, setOwner] = useState(initialOwner);

  const handleTitleChange = useCallback((event) => {
    setTitle(event.target.value);
  }, []);

  const handleSaveClick = useCallback(() => {
    onSave({ title, visibility, owner });
  }, [title, visibility, owner, onSave]);

  return show ? (
    <Modal show={show} onHide={onClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
          <Form.Text className="text-muted">
            Choose a title for your viz
          </Form.Text>
        </Form.Group>
        <VisibilityControl
          visibility={visibility}
          setVisibility={setVisibility}
          currentPlan={currentPlan}
          pricingHref={pricingHref}
        />
        <OwnerControl
          owner={owner}
          setOwner={setOwner}
          possibleOwners={possibleOwners}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSaveClick}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
