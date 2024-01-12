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

const enableOwnerControl = false;

// Slugify a string
// Inspired by https://gist.github.com/mathewbyrne/1280286
const slugify = (str: string) =>
  str
    .toLowerCase() // Convert the string to lowercase
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '') // Trim hyphens from the start of the string
    .replace(/-+$/, ''); // Trim hyphens from the end of the string

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
      slug: slugify(slug),
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
          <Form.Group
            controlId="viz-url-control"
            className="mb-4"
          >
            <Form.Label>Custom URL</Form.Label>
            <InputGroup>
              <InputGroup.Text id="viz-url-prefix">
                @{userName}/
              </InputGroup.Text>
              <Form.Control
                aria-describedby="viz-url-prefix"
                value={slug}
                onChange={handleSlugChange}
              />
            </InputGroup>
            <Form.Text className="text-muted">
              Choose a custom URL slug for this viz.
            </Form.Text>
          </Form.Group>
        )}
        <VisibilityControl
          visibility={visibility}
          setVisibility={setVisibility}
          currentPlan={currentPlan}
          pricingHref={pricingHref}
        />
        <Form.Group controlId="viz-height">
          <Form.Label>Height</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              className="me-2"
              style={{ width: '100px' }}
              type="text"
              value={height}
              onChange={handleHeightChange}
            />
            <Form.Text className="text-muted mt-0">
              pixels
            </Form.Text>
          </div>
        </Form.Group>
        {enableOwnerControl && (
          <OwnerControl
            owner={owner}
            setOwner={setOwner}
            possibleOwners={possibleOwners}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSaveClick}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
