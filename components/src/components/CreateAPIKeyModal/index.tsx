import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { Modal, Form, Button } from '../bootstrap';
import { VisibilityControl } from '../VisibilityControl';
import { OwnerControl } from '../OwnerControl';
import { Plan, UserId, Visibility } from 'entities';

export const CreateAPIKeyModal = ({
  show,
  onClose,
  onCreate,
  // currentPlan,
  // enableFreeTrial,
}: {
  show: boolean;
  onClose: () => void;
  onCreate: ({ name }: { name: string }) => void;
  // currentPlan: Plan;
  // enableFreeTrial: boolean;
}) => {
  const [name, setName] = useState<string>('');

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    [],
  );

  const handleCreateClick = useCallback(() => {
    onCreate({ name });
  }, [name]);

  const inputRef = useRef(null);

  // Focus on the input field when modal is shown
  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  // Support keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.key === 'Enter' &&
        (e.ctrlKey ||
          e.shiftKey ||
          (!e.altKey && !e.metaKey))
      ) {
        handleCreateClick();
      }
    },
    [handleCreateClick],
  );

  return show ? (
    <Modal
      show={show}
      onHide={onClose}
      animation={false}
      onKeyDown={handleKeyDown}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create new API key</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={handleNameChange}
            ref={inputRef}
          />
          <Form.Text className="text-muted">
            Choose a name for your API key
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleCreateClick}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
