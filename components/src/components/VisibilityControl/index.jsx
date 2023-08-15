import { useCallback } from 'react';
import { Form, Alert, Button } from '../bootstrap';
import './styles.css';

const visibilities = {
  public: 'Anyone can see this viz.',
  unlisted: 'Anyone with the link can see this viz.',
  private: 'Only collaborators can see this viz.',
};

export const VisibilityControl = ({
  visibility,
  setVisibility,
  currentPlan,
  pricingHref,
}) => {
  const handleChange = useCallback((event) => {
    setVisibility(event.target.value);
  }, []);
  return (
    <Form.Group className="mb-3" controlId="visibility">
      <Form.Label>Visibility</Form.Label>
      <div>
        {Object.keys(visibilities).map((value) => (
          <Form.Check
            inline
            key={value}
            type="radio"
            id={value}
            value={value}
            label={value}
            checked={visibility === value}
            onChange={handleChange}
            // Disable the private option if the current plan is free
            disabled={
              currentPlan === 'free' &&
              (value === 'private' || value === 'unlisted')
            }
          />
        ))}
      </div>
      <Form.Text className="text-muted">
        {visibilities[visibility]}
      </Form.Text>
      {/* {currentPlan === 'free' ? (
        <Form.Text className="text-muted">
          <a href={pricingHref}>Upgrade to Pro</a> to make your viz private
        </Form.Text>
      ) : null} */}
      {currentPlan === 'free' ? (
        <Alert
          variant="info"
          className="my-3 p-2 d-flex flex-column"
        >
          <strong>Want more privacy?</strong>
          <Button
            variant="primary"
            href={pricingHref}
            className="my-2 btn-gradient fw-bold"
          >
            Upgrade to Pro
          </Button>
          to make your viz private or unlisted.
        </Alert>
      ) : null}
    </Form.Group>
  );
};
