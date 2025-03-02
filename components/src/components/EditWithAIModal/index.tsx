import { useState, useCallback, useMemo } from 'react';
import { Modal, Form, Button } from '../bootstrap';
import { Plan, UserId } from 'entities';
import { VizKit } from 'api/src/VizKit';

import { AICreditBalanceText } from './AICreditBalanceText';
import { Usage, UsageEntry } from './Usage';

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
  const [showUsage, setShowUsage] =
    useState<boolean>(false);

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

  const handleToggleUsage = useCallback(() => {
    setShowUsage((prev) => !prev);
  }, []);

  // Sample usage data - in a real app, this would come from props or an API
  const usageEntries = useMemo<UsageEntry[]>(
    () => [
      {
        modelName: 'sonet',
        prompt: 'Make it green',
        cost: '$0.03',
        result: 'abc',
        timestamp: '2025-03-01 14:32',
      },
      {
        modelName: 'gpt-4',
        prompt: 'Add a dropdown menu',
        cost: '$0.12',
        result: 'Added Bootstrap dropdown',
        timestamp: '2025-03-01 10:15',
      },
      {
        modelName: 'claude',
        prompt: 'Fix the layout',
        cost: '$0.08',
        result: 'Adjusted CSS grid',
        timestamp: '2025-02-28 16:45',
      },
    ],
    [],
  );

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
              showUsageText={true}
              onUsageClick={handleToggleUsage}
            />
            <div className="ms-auto">
              <Button
                variant="outline-secondary"
                onClick={handleToggleUsage}
                className="me-2"
              >
                {showUsage ? 'Hide Usage' : 'Usage'}
              </Button>
              <Button
                variant="primary"
                onClick={handleTopUpClick}
              >
                Top Up Balance
              </Button>
            </div>
          </div>
        ) : currentPlan === 'premium' ? (
          <div className="d-flex justify-content-between align-items-center flex-grow-1">
            <AICreditBalanceText
              creditBalance={creditBalance}
              showTopUpText={true}
              onTopUpClick={handleTopUpClick}
              showUsageText={true}
              onUsageClick={handleToggleUsage}
            />
            <div>
              <Button
                variant="primary"
                onClick={handleSubmitClick}
                disabled={!prompt.trim()}
              >
                Submit
              </Button>
            </div>
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
        <Usage showUsage={showUsage} usageEntries={usageEntries} />
      </Modal.Footer>
    </Modal>
  );
};
