import { Header } from '../components/Header';
import { LandingPageBody } from '../components/LandingPageBody';

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <div className="vh-page">
        <Header />
        <LandingPageBody />
      </div>
    </div>
  );
};

export default Story;
