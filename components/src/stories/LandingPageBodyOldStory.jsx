import { Header } from '../components/Header';
import { HeaderTop } from '../components/HeaderTop';
import { LandingPageBody } from '../components/LandingPageBodyOld';

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <div className="vh-page">
        <HeaderTop />
        <Header />
        <LandingPageBody />
      </div>
    </div>
  );
};

export default Story;
