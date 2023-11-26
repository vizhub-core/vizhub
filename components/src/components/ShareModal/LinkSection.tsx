import { useCallback } from 'react';
import {
  Form,
  FormControl,
  InputGroup,
  Button,
} from '../bootstrap';

export const LinkSection = ({ linkToCopy, onLinkCopy }) => {
  // Function to handle the onFocus event
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      event.target.select();
    },
    [],
  );

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
          variant="outline-primary"
          id="button-copy"
          onClick={onLinkCopy}
        >
          Copy
        </Button>
      </InputGroup>
      <Form.Text className="text-muted">
        Sharing this link on social media will automatically
        create a preview.
      </Form.Text>
    </Form.Group>
  );
};
