import { VizPageViewer } from '../components/VizPageViewer';
import { args as publicArgs } from './VizPageViewerStory';

const args = {
  ...publicArgs,
  isUserAuthenticated: false,
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <VizPageViewer {...args} />
    </div>
  );
};

export default Story;
