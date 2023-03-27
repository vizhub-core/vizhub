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
      <HomePageBody {...args} />
    </div>
  );
};

export default Story;
