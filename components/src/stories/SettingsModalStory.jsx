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
  profileHref: 'https://vizhub.com/joe',
  initialSlug: '21f72bf74ef04ea0b9c9b82aaaec859a',
  userName: 'joe',
  enableURLChange: true,
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
