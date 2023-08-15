import { useState, useCallback } from 'react';
import { Modal, Form, Button } from '../bootstrap';
import { VisibilityControl } from '../VisibilityControl';
import { OwnerControl } from '../OwnerControl';

export const ForkModal = ({
  show,
  onClose,
  onFork,
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

  const handleForkClick = useCallback(() => {
    onFork({ title, visibility, owner });
  }, [title, visibility, owner, onFork]);

  return show ? (
    <Modal show={show} onHide={onClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Fork</Modal.Title>
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
        <Button variant="primary" onClick={handleForkClick}>
          Fork
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
