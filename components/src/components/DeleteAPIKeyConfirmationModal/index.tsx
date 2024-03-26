import { Button, Modal } from '../bootstrap';
import { useCallback, useEffect } from 'react';

// Confirmation modal for deleting an API key.
// Inspired by https://react-bootstrap.netlify.app/docs/components/modal/#live-demo
export const DeleteAPIKeyConfirmationModal = ({
  show,
  onClose,
  onConfirm,
}: {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
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
      <Modal.Header closeButton>
        <Modal.Title>Delete API Key</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>This will permanently revoke the API key.</p>
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
