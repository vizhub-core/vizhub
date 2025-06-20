import { Header } from '../components/Header';
import { args as loggedOutArgs } from './HeaderLoggedOutStory';

const args = {
  ...loggedOutArgs,
  authenticatedUserAvatarURL: 'https://github.com/mdo.png',
  onNotificationsClick: () => {},
  userHasNotifications: true,
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <Header {...args} />
    </div>
  );
};

export default Story;
