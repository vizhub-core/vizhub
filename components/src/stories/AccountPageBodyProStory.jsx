import { AccountPageBody } from '../components/AccountPageBody';
import { args as freeArgs } from './AccountPageBodyFreeStory';

const args = {
  ...freeArgs,
  currentPlan: 'pro',
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <AccountPageBody {...args} />
    </div>
  );
};

export default Story;
