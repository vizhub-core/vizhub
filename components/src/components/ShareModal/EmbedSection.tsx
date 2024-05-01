import { useCallback, useRef, useState } from 'react';
import {
  Form,
  FormControl,
  InputGroup,
  Button,
  Tooltip,
  Overlay,
  Alert,
} from '../bootstrap';
import { BrandedEmbedControl } from '../BrandedEmbedControl';
import { Plan } from 'entities';

export const EmbedSection = ({
  embedSnippetToCopy,
  onEmbedSnippetCopy,
  currentPlan,
  brandedOption,
  setBrandedOption,
  enableFreeTrial,
  isPrivate,
}: {
  embedSnippetToCopy: string;
  onEmbedSnippetCopy?: () => void;
  currentPlan: Plan;
  brandedOption: string;
  setBrandedOption: (brandedOption: string) => void;
  enableFreeTrial: boolean;
  isPrivate: boolean;
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
      {isPrivate && (
        <Alert variant="danger">
          This visualization is currently{' '}
          <strong>private</strong>, so embedding will not
          work. You need to make it <strong>public</strong>{' '}
          or <strong>unlisted</strong> to embed it.
        </Alert>
      )}
      <BrandedEmbedControl
        enableFreeTrial={enableFreeTrial}
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
