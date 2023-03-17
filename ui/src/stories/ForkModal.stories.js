import { ForkModal } from '../components/ForkModal';

export default {
  title: 'VizHub/ForkModal',
  component: ForkModal,
  parameters: {
    layout: 'centered',
  },
  argTypes: { onClose: { action: 'close' }, onFork: { action: 'fork' } },
};

export const Public = {
  args: {
    show: true,
    initialTitle: 'fork of Bar Chart',
    initialVisibility: 'public',
  },
};

export const Unlisted = {
  args: {
    show: true,
    initialTitle: 'fork of Bar Chart',
    initialVisibility: 'unlisted',
  },
};

export const Private = {
  args: {
    show: true,
    initialTitle: 'fork of Bar Chart',
    initialVisibility: 'private',
  },
};
