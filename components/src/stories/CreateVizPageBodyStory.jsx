import { CreateVizPageBody } from '../components/CreateVizPageBody';
import { renderVizPreviews } from './renderVizPreviews';

const args = {
  renderVizPreviews,
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <CreateVizPageBody {...args} />
    </div>
  );
};

export default Story;
