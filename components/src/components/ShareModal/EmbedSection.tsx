import { useCallback, useRef, useState } from 'react';
import {
  Form,
  FormControl,
  InputGroup,
  Button,
  Tooltip,
  Overlay,
} from '../bootstrap';
import { BrandedEmbedControl } from '../BrandedEmbedControl';

export const EmbedSection = ({
  embedSnippetToCopy,
  onEmbedSnippetCopy,
  currentPlan,
  brandedOption,
  setBrandedOption,
}) => {
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
    onEmbedSnippetCopy?.();
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 4000);
  }, [onEmbedSnippetCopy]);

  return (
    <Form.Group className="mt-4" controlId="formShareLink">
      <BrandedEmbedControl
        currentPlan={currentPlan}
        brandedOption={brandedOption}
        setBrandedOption={setBrandedOption}
      />
      <InputGroup className="mb-1">
        <FormControl
          aria-label="Embed Snippet"
          aria-describedby="button-copy"
          value={embedSnippetToCopy}
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
        Pasting this snippet in HTML will embed the viz into
        the Web page.
      </Form.Text>
    </Form.Group>
  );
};
