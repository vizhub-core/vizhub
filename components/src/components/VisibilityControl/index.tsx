import { useCallback, useState } from 'react';
import { Plan, Visibility } from 'entities';
import { Form } from '../bootstrap';
import { UpgradeCallout } from '../UpgradeCallout';
import { image } from '../image';
import { PrivateVizzesUpgradeCallout } from '../PrivateVizzesUpgradeCallout';
import './styles.css';

const enableUnlisted = true;

const visibilities: {
  [K in Visibility]: string;
} = {
  public: 'Anyone can view this viz.',
  private:
    'Only you and collaborators can view this viz. Embeds are disabled.',
  unlisted:
    'Anyone with the link can view this viz. Embeds are enabled.',
};

export const VisibilityControl = ({
  visibility,
  setVisibility,
  currentPlan,
  nonPublicVizCount,
  currentVizVisibility,
}: {
  visibility: Visibility;
  setVisibility: (visibility: Visibility) => void;
  currentPlan: Plan;
  nonPublicVizCount?: number;
  currentVizVisibility?: Visibility;
}) => {
  const [showUpgradeCallout, setShowUpgradeCallout] =
    useState(false);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVisibility = event.target
        .value as Visibility;

      // Check if user is on free plan and trying to select private/unlisted
      if (
        currentPlan === 'free' &&
        (newVisibility === 'private' ||
          newVisibility === 'unlisted')
      ) {
        // Check if this would exceed the quota
        const isChangingToNonPublic =
          currentVizVisibility === 'public' &&
          (newVisibility === 'private' ||
            newVisibility === 'unlisted');

        const wouldExceedQuota =
          isChangingToNonPublic &&
          nonPublicVizCount !== undefined &&
          nonPublicVizCount >= 3;

        if (wouldExceedQuota) {
          setShowUpgradeCallout(true);
        } else {
          setVisibility(newVisibility);
        }
      } else {
        setVisibility(newVisibility);
      }
    },
    [
      currentPlan,
      nonPublicVizCount,
      currentVizVisibility,
      setVisibility,
    ],
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
        {currentPlan === 'free' &&
          nonPublicVizCount !== undefined &&
          (visibility === 'private' ||
            visibility === 'unlisted') && (
            <div className="mt-1">
              <small>
                You have used {nonPublicVizCount} of 3 free
                private/unlisted vizzes.
              </small>
            </div>
          )}
      </Form.Text>
      {showUpgradeCallout && (
        <UpgradeCallout
          featureId="private-vizzes"
          imageSrc={image('empty-private-vizzes', 'svg')}
          isVertical={true}
          topMargin={true}
        >
          <PrivateVizzesUpgradeCallout />
        </UpgradeCallout>
      )}
    </Form.Group>
  );
};
