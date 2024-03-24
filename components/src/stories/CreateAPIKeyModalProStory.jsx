import { useState } from 'react';
import { CreateAPIKeyModal } from '../components/CreateAPIKeyModal';

export const args = {
  onCreate: (data) => {
    console.log(data);
  },
  currentPlan: 'premium',
};

const Story = () => {
  const [show, setShow] = useState(true);
  return (
    <div className="layout-centered">
      <CreateAPIKeyModal
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
