import { useState, useCallback } from 'react';
import { Modal, Form, Button } from '../bootstrap';
import { Plan, UserId } from 'entities';
import { VizKit } from 'api/src/VizKit';

import { AICreditBalanceText } from './AICreditBalanceText';

const vizKit = VizKit();

export const EditWithAIModal = ({
  show,
  onClose,
  onSubmit,
  creditBalance,
  currentPlan,
  userId,
  modelName,
  setModelName,
  modelNameOptions,
}: {
  show: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  creditBalance?: number;
  currentPlan: Plan;
  userId?: UserId;
  modelName: string;
  setModelName: (modelName: string) => void;
  modelNameOptions: string[];
}) => {
  const [prompt, setPrompt] = useState<string>('');

  const handlePromptChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPrompt(event.target.value);
    },
    [],
  );

  const handleModelChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setModelName(event.target.value);
    },
    [setModelName],
  );

  // When submitting, close the modal, reset the prompt, and
  // call the onSubmit callback with the prompt text.
  const handleSubmitClick = useCallback(() => {
    onSubmit(prompt);
    onClose();
    setPrompt('');
  }, [prompt, onSubmit]);

  const handleTopUpClick = useCallback(async () => {
    // Sanity check - should never happen
    if (!userId) {
      return;
    }

    // Record analytics of the click.
    vizKit.rest.recordAnalyticsEvents(
      'event.click.ai.top-up',
    );

    // Create a Stripe Checkout session.
    const createCheckoutSessionResult =
      await vizKit.rest.createCheckoutSession({
        userId,
        isCreditTopUp: true,
      });
    if (createCheckoutSessionResult.outcome === 'failure') {
      console.error(
        'Error creating checkout session',
        createCheckoutSessionResult.error,
      );
      return;
    }

    // Redirect the user to the Stripe Checkout page.
    const { sessionURL } =
      createCheckoutSessionResult.value;
    window.location.href = sessionURL;
  }, [userId]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit with AI</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentPlan === 'premium' &&
        creditBalance === 0 ? (
          <p>
            You need to top up your AI credit balance to use
            AI-powered editing features.
          </p>
        ) : currentPlan === 'premium' ? (
          <>
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
            <Form.Group
              className="mb-3"
              controlId="modelSelect"
            >
              <Form.Label>Select AI Model</Form.Label>
              <Form.Select
                value={modelName}
                onChange={handleModelChange}
                aria-label="Select AI model"
              >
                {modelNameOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </>
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
        {currentPlan === 'premium' &&
        creditBalance === 0 ? (
          <div className="d-flex justify-content-between align-items-center flex-grow-1">
            <AICreditBalanceText
              creditBalance={creditBalance}
            />
            <Button
              variant="primary"
              onClick={handleTopUpClick}
              className="ms-auto"
            >
              Top Up Balance
            </Button>
          </div>
        ) : currentPlan === 'premium' ? (
          <div className="d-flex justify-content-between align-items-center flex-grow-1">
            <AICreditBalanceText
              creditBalance={creditBalance}
              showTopUpText={true}
              onTopUpClick={handleTopUpClick}
            />
            <Button
              variant="primary"
              onClick={handleSubmitClick}
              disabled={!prompt.trim()}
            >
              Submit
            </Button>
          </div>
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
