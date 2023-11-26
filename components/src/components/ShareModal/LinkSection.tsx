import { useCallback, useRef, useState } from 'react';
import {
  Form,
  FormControl,
  InputGroup,
  Button,
  Tooltip,
  Overlay,
} from '../bootstrap';

export const LinkSection = ({ linkToCopy, onLinkCopy }) => {
  // Tracks when to show the "Copied" tooltip.
  const [showTooltip, setShowTooltip] = useState(false);

  // Function to handle the onFocus event
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      event.target.select();
    },
    [],
  );

  const tooltipTarget = useRef(null);

  const handleClick = useCallback(() => {
    onLinkCopy();
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 4000);
  }, [onLinkCopy]);

  return (
    <Form.Group
      className="mb-3 mt-3"
      controlId="formShareLink"
    >
      <InputGroup>
        <FormControl
          aria-label="Link URL"
          aria-describedby="button-copy"
          defaultValue={linkToCopy}
          readOnly
          onFocus={handleFocus}
        />

        <Button
          ref={tooltipTarget}
          variant="outline-primary"
          id="button-copy"
          onClick={handleClick}
        >
          Copy
        </Button>
        <Overlay
          target={tooltipTarget.current}
          show={showTooltip}
          placement="top"
        >
          {(props) => (
            <Tooltip id="overlay-example" {...props}>
              Copied!
            </Tooltip>
          )}
        </Overlay>
      </InputGroup>
      <Form.Text className="text-muted">
        Sharing this link on social media will automatically
        create a preview.
      </Form.Text>
    </Form.Group>
  );
};
