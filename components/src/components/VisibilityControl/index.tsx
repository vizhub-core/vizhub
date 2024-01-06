import { useCallback, useState } from 'react';
import { Plan, Visibility } from 'entities';
import { Form } from '../bootstrap';
import './styles.css';

const enableUnlisted = false;

const visibilities: {
  [K in Visibility]: string;
} = {
  public: 'Anyone can view this viz.',
  private: 'Only you and collaborators can view this viz.',
  unlisted: 'Anyone with the link can view this viz.',
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

  const [showUpgradeCallout, setShowUpgradeCallout] =
    useState(false);

  const handleMouseOver = useCallback(() => {
    if (currentPlan === 'free') {
      setShowUpgradeCallout(true);
    }
  }, [currentPlan]);

  return (
    <Form.Group
      className="mb-4 vh-visibility-control"
      controlId="visibility"
    >
      <Form.Label>Visibility</Form.Label>
      <div onMouseOver={handleMouseOver}>
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
      {showUpgradeCallout && (
        <p className="mt-3 upgrade-callout-text">
          Please <a href={pricingHref}>upgrade your plan</a>{' '}
          to make this viz private.
        </p>
      )}
    </Form.Group>
  );
};
