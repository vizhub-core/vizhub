import { ForkModal } from '../components/ForkModal';
import { args as ownerControlArgs } from './OwnerControlStory';

// Fixtures
const { initialOwner, possibleOwners } = ownerControlArgs;

export const args = {
  show: true,
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
  return (
    <div className="layout-centered">
      <ForkModal {...args} />
    </div>
  );
};

export default Story;
