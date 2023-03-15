import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button } from '../Button';

export const ForkModal = ({ show, onClose, onFork }) => {
  const [title, setTitle] = useState();

  const handleTitleChange = useCallback((event) => {
    setTitle(event.target.value);
  }, []);

  const handleForkClick = useCallback(() => {
    onFork({ title });
  }, [title]);

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
            Choose a title for your new viz
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="visibility">
          <Form.Label>Visibility</Form.Label>
          <Form.Check type="radio" id="private" label="private" />
          <Form.Check type="radio" id="unlisted" label="unlisted" />
          <Form.Check type="radio" id="public" label="public" />
          <Form.Text className="text-muted">Who can access this viz</Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleForkClick}>
          Fork
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};

ForkModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onFork: PropTypes.func.isRequired,
};
