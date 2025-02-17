import { useState, useCallback } from 'react';
import { Modal, Form, Button } from '../bootstrap';
import { Plan } from 'entities';

export const EditWithAIModal = ({
  show,
  onClose,
  onSubmit,
  currentPlan,
}: {
  show: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  currentPlan: Plan;
}) => {
  const [prompt, setPrompt] = useState<string>('');

  const handlePromptChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPrompt(event.target.value);
    },
    [],
  );

  const handleSubmitClick = useCallback(() => {
    onSubmit(prompt);
  }, [prompt, onSubmit]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit with AI</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentPlan === 'premium' ? (
          <Form.Group className="mb-3" controlId="prompt">
            <Form.Label>
              What would you like to change?
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Describe the changes you want to make..."
            />
            <Form.Text className="text-muted">
              Be specific about what you want to modify in
              your code
            </Form.Text>
          </Form.Group>
        ) : (
          <p>
            AI-powered code editing is available with VizHub
            Premium. Upgrade now for only $1.99/mo or
            $19.99/year to unlock AI assistance and many
            other features.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {currentPlan === 'premium' ? (
          <Button
            variant="primary"
            onClick={handleSubmitClick}
            disabled={!prompt.trim()}
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="primary"
            href={`/pricing?feature=ai-editing`}
            target="_blank"
            rel="noreferrer"
          >
            Upgrade Now
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
