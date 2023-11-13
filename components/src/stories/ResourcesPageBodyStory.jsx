import { Header } from '../components/Header';
import { HeaderTop } from '../components/HeaderTop';
import { ResourcesPageBody } from '../components/ResourcesPageBody';

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <div className="vh-page">
        <Header />
        <ResourcesPageBody />
      </div>
    </div>
  );
};

export default Story;
