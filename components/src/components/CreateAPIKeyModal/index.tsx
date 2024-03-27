import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { Modal, Form, Button } from '../bootstrap';
import { CopyKeySection } from './CopyKeySection';

export const CreateAPIKeyModal = ({
  show,
  onClose,
  createAPIKey,
  // currentPlan,
  // enableFreeTrial,
}: {
  show: boolean;
  onClose: () => void;
  createAPIKey: ({
    name,
  }: {
    name: string;
  }) => Promise<string>;
  // currentPlan: Plan;
  // enableFreeTrial: boolean;
}) => {
  const [name, setName] = useState<string>('');
  const [isCreatingAPIKey, setIsCreatingAPIKey] =
    useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    [],
  );

  const handleCreateClick = useCallback(() => {
    setName('');
    setIsCreatingAPIKey(true);
    createAPIKey({ name }).then((apiKey) => {
      setApiKey(apiKey);
      setIsCreatingAPIKey(false);
    });
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

  const handleHide = useCallback(() => {
    setApiKey(null);
    setName('');
    onClose();
  }, [onClose]);

  return (
    <Modal
      show={show}
      onHide={handleHide}
      animation={true}
      onKeyDown={handleKeyDown}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {apiKey
            ? 'Save your API key'
            : 'Create new API key'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {apiKey ? (
          <CopyKeySection textToCopy={apiKey} />
        ) : (
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
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={apiKey ? handleHide : handleCreateClick}
          disabled={
            apiKey ? false : !name || isCreatingAPIKey
          }
        >
          {isCreatingAPIKey
            ? 'Creating...'
            : apiKey
              ? 'Done'
              : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
