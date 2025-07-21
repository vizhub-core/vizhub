import { ProfilePageBody } from '../components/ProfilePageBody';
import {
  args as profilePageBodyArgs,
  useProfilePageState,
} from './ProfilePageBodyStory';

const args = {
  ...profilePageBodyArgs,
  isViewingOwnProfile: true,
  plan: 'premium',
};

const Story = () => {
  const stateArgs = useProfilePageState({
    initialSectionId: 'api-keys',
  });

  return (
    <div className="layout-fullscreen">
      <ProfilePageBody {...args} {...stateArgs} />
    </div>
  );
};

export default Story;
