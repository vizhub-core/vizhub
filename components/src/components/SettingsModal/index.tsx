import { useState, useCallback } from 'react';
import {
  Modal,
  Form,
  Button,
  InputGroup,
} from '../bootstrap';
import { VisibilityControl } from '../VisibilityControl';
import {
  OwnerControl,
  PossibleOwner,
} from '../OwnerControl';
import { Plan, UserId, Visibility } from 'entities';
import './styles.css';

export const SettingsModal = ({
  show,
  onClose,
  onSave,
  initialTitle,
  initialSlug,
  initialVisibility,
  initialHeight,
  initialOwner,
  possibleOwners,
  currentPlan,
  pricingHref,
  profileHref,
  userName,
  enableURLChange = false,
}: {
  show: boolean;
  onClose: () => void;
  onSave: ({
    title,
    visibility,
    owner,
    slug,
    height,
  }: {
    title: string;
    visibility: Visibility;
    owner: string;
    slug: string;
    height: number;
  }) => void;
  initialTitle: string;
  initialSlug?: string;
  initialVisibility: Visibility;
  initialHeight: number;
  initialOwner: UserId;
  possibleOwners: Array<PossibleOwner>;
  currentPlan: Plan;
  pricingHref: string;
  profileHref?: string;
  userName?: string;
  enableURLChange?: boolean;
}) => {
  // Local state for the title
  const [title, setTitle] = useState(initialTitle);
  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    },
    [],
  );

  // Local state for the slug
  const [slug, setSlug] = useState(initialSlug);
  const handleSlugChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSlug(event.target.value);
    },
    [],
  );

  // Local state for the visibility
  const [visibility, setVisibility] = useState(
    initialVisibility,
  );

  // Local state for the owner
  const [owner, setOwner] = useState(initialOwner);

  // Local state for height
  const [height, setHeight] = useState<string>(
    '' + initialHeight,
  );
  const handleHeightChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setHeight(event.target.value);
    },
    [],
  );

  // This runs when the user clicks the save button
  const handleSaveClick = useCallback(() => {
    let validHeight = parseInt(height, 10);
    if (isNaN(validHeight)) {
      validHeight = initialHeight;
    }
    onSave({
      title,
      visibility,
      owner,
      slug,
      height: validHeight,
    });
  }, [title, visibility, owner, slug, height, onSave]);

  return show ? (
    <Modal
      show={show}
      onHide={onClose}
      animation={false}
      className="vh-settings-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-4" controlId="viz-title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
          <Form.Text className="text-muted">
            Choose a title for your viz
          </Form.Text>
        </Form.Group>

        {enableURLChange && (
          <Form.Group className="mb-4" controlId="viz-url">
            <Form.Label htmlFor="viz-url-control">
              URL
            </Form.Label>
            <InputGroup>
              <InputGroup.Text id="viz-url-prefix">
                {profileHref}
              </InputGroup.Text>
              <Form.Control
                id="viz-url-control"
                aria-describedby="viz-url-prefix"
                value={slug}
                onChange={handleSlugChange}
              />
            </InputGroup>
            <Form.Text className="text-muted">
              <div className="mb-3">
                Choose a URL for your viz.
              </div>
              <div>Sample import:</div>
              <div className="sample-import">{`import { ... } from "@${userName}/${slug}"`}</div>
            </Form.Text>
          </Form.Group>
        )}

        <VisibilityControl
          visibility={visibility}
          setVisibility={setVisibility}
          currentPlan={currentPlan}
          pricingHref={pricingHref}
        />
        <OwnerControl
          owner={owner}
          setOwner={setOwner}
          possibleOwners={possibleOwners}
        />

        <Form.Group controlId="viz-height">
          <Form.Label>Height</Form.Label>
          <Form.Control
            type="text"
            value={height}
            onChange={handleHeightChange}
          />
          <Form.Text className="text-muted">
            Set the height of the viz (in pixels).
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSaveClick}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
