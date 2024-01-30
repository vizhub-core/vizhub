import { useCallback, useState } from 'react';
import { Plan, Visibility } from 'entities';
import { Form } from '../bootstrap';
import './styles.css';
import { UpgradeCallout } from '../UpgradeCallout';
import { image } from '../image';

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
}: {
  visibility: Visibility;
  setVisibility: (visibility: Visibility) => void;
  currentPlan: Plan;
}) => {
  const [showUpgradeCallout, setShowUpgradeCallout] =
    useState(false);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVisibility = event.target
        .value as Visibility;

      // If the user is on the free plan and clicks the private option,
      // show the upgrade callout.
      if (
        currentPlan === 'free' &&
        newVisibility === 'private'
      ) {
        setShowUpgradeCallout(true);
      } else {
        setVisibility(newVisibility);
      }
    },
    [currentPlan],
  );

  return (
    <Form.Group
      className="mb-4 vh-visibility-control"
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
            />
          ))}
      </div>
      <Form.Text className="text-muted">
        {visibilities[visibility]}
      </Form.Text>
      {showUpgradeCallout && (
        <UpgradeCallout
          imageSrc={image('empty-private-vizzes', 'svg')}
          isVertical={true}
          topMargin={true}
        >
          Private vizzes are only available with VizHub
          Premium. Please consider upgrading your plan to
          make this viz private and also gain access to
          other great features like AI-Assisted Coding and
          unlimited real-time collaborators.
        </UpgradeCallout>
      )}
    </Form.Group>
  );
};
