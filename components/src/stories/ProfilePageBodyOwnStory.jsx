import { ProfilePageBody } from '../components/ProfilePageBody';
import {
  args as profilePageBodyArgs,
  useProfilePageState,
} from './ProfilePageBodyStory';

const args = {
  ...profilePageBodyArgs,
  isViewingOwnProfile: true,
};

const Story = () => {
  const stateArgs = useProfilePageState();

  return (
    <div className="layout-fullscreen">
      <ProfilePageBody {...args} {...stateArgs} />
    </div>
  );
};

export default Story;
