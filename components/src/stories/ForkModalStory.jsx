import { useState } from 'react';
import { ForkModal } from '../components/ForkModal';
import { args as ownerControlArgs } from './OwnerControlStory';

// Fixtures
const { initialOwner, possibleOwners } = ownerControlArgs;

export const args = {
  initialTitle: 'fork of Bar Chart',
  initialVisibility: 'public',
  initialOwner,
  possibleOwners,
  onClose: () => {
    console.log('onClose');
  },
  onFork: (forkData) => {
    console.log('onFork');
    console.log(forkData);
  },
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