import { useState } from 'react';
import { SettingsModal } from '../components/SettingsModal';
import { args as ownerControlArgs } from './OwnerControlStory';

const { initialOwner, possibleOwners } = ownerControlArgs;

export const args = {
  initialTitle: 'Bar Chart',
  initialVisibility: 'public',
  initialOwner,
  possibleOwners,
  onSave: (saveData) => {
    console.log('onSave');
    console.log(saveData);
  },
  currentPlan: 'pro',
  pricingHref: 'pricingHref',
};

const Story = () => {
  const [show, setShow] = useState(true);
  return (
    <div className="layout-centered">
      <SettingsModal
        show={show}
        {...args}
        onClose={() => {
          setShow(false);
        }}
      />
    </div>
  );
};

export default Story;
