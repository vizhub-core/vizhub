import { Header } from '../components/Header';

export const args = {
  loginHref: 'loginHref',
  logoutHref: 'logoutHref',
  profileHref: 'profileHref',
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
