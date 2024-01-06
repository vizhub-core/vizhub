import { useState } from 'react';
import { SettingsModal } from '../components/SettingsModal';
import { args as settingsModalArgs } from './SettingsModalStory';

export const args = {
  ...settingsModalArgs,
  currentPlan: 'free',
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
