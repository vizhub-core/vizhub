import { useState } from 'react';
import { ForkModal } from '../components/ForkModal';
import { args as proArgs } from './ForkModalProStory';

const args = {
  ...proArgs,
  currentPlan: 'free',
};

const Story = () => {
  const [show, setShow] = useState(true);
  return (
    <div className="layout-centered">
      <ForkModal
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
