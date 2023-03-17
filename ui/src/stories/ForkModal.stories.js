import { ForkModal } from '../components/ForkModal';
import { Normal as OwnerControlNormal } from './OwnerControl.stories';

// Fixtures
const { initialOwner, possibleOwners } = OwnerControlNormal.args;

export default {
  title: 'VizHub/ForkModal',
  component: ForkModal,
  parameters: {
    layout: 'centered',
  },
  argTypes: { onClose: { action: 'close' }, onFork: { action: 'fork' } },
};

export const Normal = {
  args: {
    show: true,
    initialTitle: 'fork of Bar Chart',
    initialVisibility: 'public',
    initialOwner,
    possibleOwners,
  },
};
