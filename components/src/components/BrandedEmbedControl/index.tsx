import { useCallback, useState } from 'react';
import { Plan, Visibility } from 'entities';
import { Form } from '../bootstrap';
import { UpgradeCallout } from '../UpgradeCallout';
import { image } from '../image';
import './styles.css';

const options = {
  branded:
    'The VizHub logo will be displayed on your embed.',
  whiteLabel:
    'No VizHub branding will be displayed on your embed.',
};

const labels = {
  branded: 'branded',
  whiteLabel: 'white label',
};

export const BrandedEmbedControl = ({
  brandedOption,
  setBrandedOption,
  currentPlan,
}: {
  brandedOption: string;
  setBrandedOption: (option: string) => void;
  currentPlan: Plan;
}) => {
  const [showUpgradeCallout, setShowUpgradeCallout] =
    useState(false);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newBrandedOption: string = event.target.value;

      // If the user is on the free plan and clicks the private option,
      // show the upgrade callout.
      if (
        currentPlan === 'free' &&
        newBrandedOption === 'whiteLabel'
      ) {
        setShowUpgradeCallout(true);
      } else {
        setBrandedOption(newBrandedOption);
      }
    },
    [currentPlan],
  );

  return (
    <Form.Group
      className="mb-4 vh-branded-embed-control"
      controlId="visibility"
    >
      <Form.Label>Branding</Form.Label>
      <div>
        {Object.keys(options).map((value) => (
          <Form.Check
            inline
            key={value}
            type="radio"
            id={value}
            value={value}
            label={labels[value]}
            checked={brandedOption === value}
            onChange={handleChange}
          />
        ))}
      </div>
      <Form.Text className="text-muted">
        {options[brandedOption]}
      </Form.Text>
      {showUpgradeCallout && (
        <UpgradeCallout
          imageSrc={image('whitelabel-embedding-2')}
          isVertical={true}
          topMargin={true}
        >
          White label embedding is only available with
          VizHub Premium. Choosing the "white label" option
          allows you to remove the VizHub logo from your
          embeds. Please consider upgrading your plan to
          embed this viz without attribution.
        </UpgradeCallout>
      )}
    </Form.Group>
  );
};
