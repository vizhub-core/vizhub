import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import {Button} from '../Button';

// TODO send form info to onFork
export const ForkModal = ({ show, onClose, onFork }) => {
  return show ? (
    <Modal show={show} onHide={onClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Fork</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" />
          <Form.Text className="text-muted">
            Choose a name for your new viz.
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onFork}>
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