import { Header } from '../components/Header';

const args = {
  // authenticatedUserDisplayName: 'Jane Doe',
  authenticatedUserAvatarURL: 'https://github.com/mdo.png',

  // onLogin: () => {
  //   console.log('onLogin');
  // },
  onLogoutClick: () => {
    console.log('onLogoutClick');
  },
  onCreateVizClick: () => {
    console.log('onCreateVizClick');
  },
  onProfileClick: () => {
    console.log('onProfileClick');
  },
  onForumClick: () => {
    console.log('onForumClick');
  },
  onVizHubClick: () => {
    console.log('onVizHubClick');
  },
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <Header {...args} />
    </div>
  );
};

export default Story;
