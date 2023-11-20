import { Button, Modal } from '../bootstrap';
import { useCallback } from 'react';

// Confirmation modal for deleting a file or directory.
// Inspired by https://react-bootstrap.netlify.app/docs/components/modal/#live-demo

// TODO reduce duplication between this and
// vzcode/src/client/VZSidebar/DeleteConfirmationModal.tsx
export const DeleteVizConfirmationModal = ({
  show,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton onClick={onClose}>
        <Modal.Title>Delete Viz</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Are you sure you want to permanently delete this
          viz?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          type="button"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
