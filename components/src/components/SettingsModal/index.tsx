import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
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
import {
  Plan,
  UserId,
  Visibility,
  slugify,
} from 'entities';
import './styles.css';
import { CircleXSVG } from '../Icons/sam/CircleXSVG';
import { CircleCheckSVG } from '../Icons/sam/CircleCheckSVG';

const enableOwnerControl = false;

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
  userName,
  enableURLChange = false,
  validateSlug,
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
  userName?: string;
  enableURLChange?: boolean;
  validateSlug: (
    slug: string,
  ) => Promise<'valid' | 'invalid'>;
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
  const [slugValidationState, setSlugValidationState] =
    useState<'validating' | 'valid' | 'invalid' | null>(
      null,
    );

  const slugValidationTimeout = useRef<number | null>(null);
  const handleSlugChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSlug = event.target.value;

      // For controlled UI
      setSlug(newSlug);

      setSlugValidationState('validating');

      // Debounce
      if (slugValidationTimeout.current) {
        clearTimeout(slugValidationTimeout.current);
      }
      slugValidationTimeout.current = setTimeout(
        async () => {
          const newSlugSlugified = slugify(newSlug);
          setSlugValidationState(
            await validateSlug(newSlugSlugified),
          );

          // Update the UI with the slugified version
          setSlug(newSlugSlugified);
        },
        500,
      );
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

  // Run handleSaveClick on Enter key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSaveClick();
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener(
        'keypress',
        handleKeyPress,
      );
    };
  }, [handleSaveClick]);

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
            Choose a title for your viz.
          </Form.Text>
        </Form.Group>

        <VisibilityControl
          visibility={visibility}
          setVisibility={setVisibility}
          currentPlan={currentPlan}
        />
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
            <Form.Text className="text-muted d-flex justify-content-between align-items-center">
              Choose a custom URL slug for this viz.
              <span
                // This height is to prevent the UI from jumping
                // around when the validation state changes
                style={{ height: '24px' }}
                className="d-flex align-items-center"
              >
                {slugValidationState === 'validating' &&
                  'Checking availability...'}
                {slugValidationState === 'valid' && (
                  <span className="vh-color-success-01 d-flex align-items-center">
                    Available!
                    <CircleCheckSVG className="ms-1" />
                  </span>
                )}
                {slugValidationState === 'invalid' && (
                  <span className="text-danger d-flex align-items-center">
                    Already taken
                    <CircleXSVG className="ms-1" />
                  </span>
                )}
              </span>
            </Form.Text>
          </Form.Group>
        )}
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
        <Button
          variant="primary"
          onClick={handleSaveClick}
          disabled={
            slugValidationState === 'validating' ||
            slugValidationState === 'invalid'
          }
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
