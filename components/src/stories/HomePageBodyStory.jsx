import { HomePageBody } from '../components/HomePageBody';

const args = {
  onEmailSubmit: (email) => {
    console.log('onEmailSubmit');
    console.log(email);
  },
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <div className="vh-page">
        <HomePageBody {...args} />
      </div>
    </div>
  );
};

export default Story;
