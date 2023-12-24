import { useCallback } from 'react';
import { Plan, Visibility } from 'entities';
import { Form, Alert, Button } from '../bootstrap';
import './styles.css';

const enableUnlisted = false;

const visibilities: {
  [K in Visibility]: string;
} = {
  public: 'Anyone can access this viz.',
  private: 'Only you can access this viz.',
  unlisted: 'Anyone with the link can access this viz.',
};

export const VisibilityControl = ({
  visibility,
  setVisibility,
  currentPlan,
  pricingHref,
}: {
  visibility: Visibility;
  setVisibility: (visibility: Visibility) => void;
  currentPlan: Plan;
  pricingHref: string;
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setVisibility(event.target.value as Visibility);
    },
    [],
  );
  return (
    <Form.Group
      className="mb-3 vh-visibility-control"
      controlId="visibility"
    >
      <Form.Label>Visibility</Form.Label>
      <div>
        {Object.keys(visibilities)
          .filter((value) =>
            enableUnlisted ? true : value !== 'unlisted',
          )
          .map((value) => (
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
                (value === 'private' ||
                  value === 'unlisted')
              }
            />
          ))}
      </div>
      <Form.Text className="text-muted">
        {visibilities[visibility]}
      </Form.Text>

      {currentPlan === 'free' ? (
        <Alert
          variant="info"
          className="my-3 p-3 d-flex flex-column upgrade-nudge-alert"
        >
          <strong>Want more privacy?</strong>
          <Button
            variant="primary"
            href={pricingHref}
            className="my-2"
          >
            Upgrade
          </Button>
          to make your viz private.
        </Alert>
      ) : null}
    </Form.Group>
  );
};
