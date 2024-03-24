// Inspired by LinkSection from components/src/components/ShareModal/LinkSection.tsx
import { useCallback, useRef, useState } from 'react';
import {
  Form,
  FormControl,
  InputGroup,
  Button,
  Tooltip,
  Overlay,
} from '../bootstrap';
import { copyToClipboard } from '../copyToClipboard';

export const CopyKeySection = ({ textToCopy }) => {
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
    copyToClipboard(textToCopy);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 4000);
  }, [textToCopy]);

  return (
    <Form.Group className="mt-4" controlId="formAPIKeyCopy">
      <InputGroup className="mb-1">
        <FormControl
          aria-label="API Key to Copy"
          aria-describedby="api-copy-button"
          defaultValue={textToCopy}
          readOnly
          onFocus={handleFocus}
        />

        <Button
          ref={tooltipTarget}
          variant="outline-primary"
          id="api-copy-button"
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
        Please save this API key somewhere safe. You won't
        be able to see it again. If you lose it, you'll need
        to create a new one.
      </Form.Text>
    </Form.Group>
  );
};
