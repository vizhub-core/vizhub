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
        <Form.Group className="mb-3" controlId="formFork">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
          <Form.Text className="text-muted">
            Choose a name for your new viz.
          </Form.Text>
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
