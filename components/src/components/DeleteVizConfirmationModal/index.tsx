import { Button, Modal } from '../bootstrap';
import { useCallback, useEffect } from 'react';

// Confirmation modal for deleting a viz.
// Inspired by https://react-bootstrap.netlify.app/docs/components/modal/#live-demo
export const DeleteVizConfirmationModal = ({
  show,
  onClose,
  onConfirm,
}) => {
  const handleEnterKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onConfirm();
      }
    },
    [onConfirm],
  );

  useEffect(() => {
    if (show) {
      window.addEventListener('keydown', handleEnterKey);
    } else {
      window.removeEventListener('keydown', handleEnterKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEnterKey);
    };
  }, [show, handleEnterKey]);

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
