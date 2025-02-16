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
import { UpgradeCallout } from '../UpgradeCallout';

export const ForkModal = ({
  show,
  onClose,
  onFork,
  initialTitle,
  initialVisibility,
  initialOwner,
  possibleOwners,
  currentPlan,
}: {
  show: boolean;
  onClose: () => void;
  onFork: ({
    title,
    visibility,
    owner,
  }: {
    title: string;
    visibility: string;
    owner: string;
  }) => void;
  initialTitle: string;
  initialVisibility: Visibility;
  initialOwner: UserId;
  possibleOwners: Array<{
    id: UserId;
    label: string;
  }>;
  currentPlan: Plan;
}) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [visibility, setVisibility] = useState<Visibility>(
    initialVisibility,
  );
  const [owner, setOwner] = useState<UserId>(initialOwner);

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    },
    [],
  );

  const handleForkClick = useCallback(() => {
    onFork({ title, visibility, owner });
  }, [title, visibility, owner, onFork]);

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
        handleForkClick();
      }
    },
    [handleForkClick],
  );

  return show ? (
    <Modal
      show={show}
      onHide={onClose}
      animation={false}
      onKeyDown={handleKeyDown}
    >
      <Modal.Header closeButton>
        <Modal.Title>Fork</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentPlan === 'premium' ? (
          <>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={handleTitleChange}
                ref={inputRef}
              />
              <Form.Text className="text-muted">
                Choose a title for your viz
              </Form.Text>
            </Form.Group>
            <VisibilityControl
              visibility={visibility}
              setVisibility={setVisibility}
              currentPlan={currentPlan}
            />
            <OwnerControl
              owner={owner}
              setOwner={setOwner}
              possibleOwners={possibleOwners}
            />
          </>
        ) : (
          <p>
            Forking is available with VizHub Premium.
            Upgrade now for only $1.99/mo or $19.99/year to
            unlock the ability to fork & modify vizzes.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {currentPlan === 'premium' ? (
          <Button
            variant="primary"
            onClick={handleForkClick}
          >
            Fork
          </Button>
        ) : (
          <Button
            variant="primary"
            href={`/pricing?feature=public-vizzes`}
            target="_blank"
            rel="noreferrer"
          >
            Upgrade Now
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  ) : null;
};
