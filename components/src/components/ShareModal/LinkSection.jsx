import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

// TODO show tooltip after copy operation
// TODO make copy operation actually work
export const LinkSection = ({ linkToCopy, onLinkCopy }) => (
  <Form.Group className="mb-3 mt-3" controlId="formShareLink">
    <InputGroup>
      <FormControl
        aria-label="Link URL"
        aria-describedby="button-copy"
        defaultValue={linkToCopy}
        readOnly
      />
      <Button variant="outline-primary" id="button-copy" onClick={onLinkCopy}>
        Copy
      </Button>
    </InputGroup>
    <Form.Text className="text-muted">
      Sharing this link on social media will automatically create a preview.
    </Form.Text>
  </Form.Group>
);
