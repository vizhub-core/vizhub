import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { Modal, Form, Button } from '../bootstrap';
import { VisibilityControl } from '../VisibilityControl';
import { OwnerControl } from '../OwnerControl';
import {
  CommitId,
  Plan,
  PREMIUM,
  PRO,
  UserId,
  Visibility,
} from 'entities';
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
  commitId,
  nonPublicVizCount,
}: {
  show: boolean;
  onClose: () => void;
  onFork: ({
    title,
    visibility,
    owner,
    commitId,
  }: {
    title: string;
    visibility: string;
    owner: string;
    commitId: CommitId;
  }) => void;
  initialTitle: string;
  initialVisibility: Visibility;
  initialOwner: UserId;
  possibleOwners: Array<{
    id: UserId;
    label: string;
  }>;
  currentPlan: Plan;
  commitId: CommitId;
  nonPublicVizCount?: number;
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
    onFork({ title, visibility, owner, commitId });
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
            nonPublicVizCount={nonPublicVizCount}
            currentVizVisibility={initialVisibility}
          />
          <OwnerControl
            owner={owner}
            setOwner={setOwner}
            possibleOwners={possibleOwners}
          />
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleForkClick}>
          Fork
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
