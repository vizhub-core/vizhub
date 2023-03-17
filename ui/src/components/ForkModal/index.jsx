import { useState, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { VisibilityControl } from '../VisibilityControl';

export const ForkModal = ({
  show,
  onClose,
  onFork,
  initialTitle,
  initialVisibility,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [visibility, setVisibility] = useState(initialVisibility);

  const handleTitleChange = useCallback((event) => {
    setTitle(event.target.value);
  }, []);

  const handleForkClick = useCallback(() => {
    onFork({ title, visibility });
  }, [title, visibility]);

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
