import { HomePageBody } from '../components/HomePageBody';

const args = {
  onEmailSubmit: (email) => {
    console.log('onEmailSubmit');
    console.log(email);
  },
};

export const HomePageBodyStory = () => {
  return (
    <div className="layout-fullscreen">
      <HomePageBody {...args} />
    </div>
  );
};
