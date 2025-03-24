import { useState, useCallback } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { Modal, Form, Button } from '../bootstrap';
import { Plan, PREMIUM, PRO, UserId } from 'entities';
import { VizKit } from 'api/src/VizKit';
import { Mic, MicOff } from 'lucide-react';

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
  const [usageEntries, setUsageEntries] = useState<
    UsageEntry[]
  >([]);
  const [isLoadingUsage, setIsLoadingUsage] =
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

  // Use the speech recognition hook
  const {
    isSpeaking,
    toggleSpeechRecognition,
    stopSpeaking,
  } = useSpeechRecognition(setPrompt);

  // When submitting, close the modal, reset the prompt, and
  // call the onSubmit callback with the prompt text.
  const handleSubmitClick = useCallback(() => {
    // If speech recognition is active, stop it
    if (isSpeaking) {
      stopSpeaking();
    }

    onSubmit(prompt);
    onClose();
    setPrompt('');
  }, [prompt, onSubmit, isSpeaking, stopSpeaking]);

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

  const fetchUsageData = useCallback(async () => {
    if (!userId) return;

    setIsLoadingUsage(true);
    try {
      const result = await vizKit.rest.getAIUsage({
        userId,
      });

      if (result.outcome === 'success') {
        // Transform the API data to match our UsageEntry format
        const entries: UsageEntry[] = result.value.map(
          (item) => ({
            modelName: item.model,
            prompt:
              item.userPrompt || 'No prompt available',
            cost: `$${(item.userCostCents / 100).toFixed(2)}`,
            result: '',
            thumbnailURL: `https://via.placeholder.com/100?text=${encodeURIComponent(item.model)}`,
            timestamp: new Date(
              item.timestamp,
            ).toLocaleString(),
          }),
        );

        setUsageEntries(entries);
      } else {
        console.error(
          'Failed to fetch usage ',
          result.error,
        );
      }
    } catch (error) {
      console.error('Error fetching usage ', error);
    } finally {
      setIsLoadingUsage(false);
    }
  }, [userId]);

  const handleToggleUsage = useCallback(() => {
    const newShowUsage = !showUsage;
    setShowUsage(newShowUsage);

    // Fetch usage data when opening the usage section
    if (
      newShowUsage &&
      usageEntries.length === 0 &&
      !isLoadingUsage
    ) {
      fetchUsageData();
    }
  }, [
    showUsage,
    usageEntries.length,
    isLoadingUsage,
    fetchUsageData,
  ]);

  const isPremiumOrPro =
    currentPlan === PREMIUM || currentPlan === PRO;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit with AI</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isPremiumOrPro && creditBalance === 0 ? (
          <p>
            You need to top up your AI credit balance to use
            AI-powered editing features.
          </p>
        ) : isPremiumOrPro ? (
          <>
            <Form.Group className="mb-3" controlId="prompt">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <Form.Label className="me-2 my-auto">
                  What would you like to change?
                </Form.Label>
                <Button
                  variant={
                    isSpeaking ? 'danger' : 'primary'
                  }
                  size="sm"
                  onClick={toggleSpeechRecognition}
                >
                  {isSpeaking ? (
                    <MicOff size={16} />
                  ) : (
                    <Mic size={16} />
                  )}
                </Button>
              </div>
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
        {isPremiumOrPro && creditBalance === 0 ? (
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
        ) : isPremiumOrPro ? (
          <div className="d-flex justify-content-between align-items-center flex-grow-1">
            <AICreditBalanceText
              creditBalance={creditBalance}
              showTopUpText={true}
              onTopUpClick={handleTopUpClick}
              showUsageText={true}
              onUsageClick={handleToggleUsage}
              showUsage={showUsage}
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
        <Usage
          showUsage={showUsage}
          usageEntries={usageEntries}
        />
      </Modal.Footer>
    </Modal>
  );
};
