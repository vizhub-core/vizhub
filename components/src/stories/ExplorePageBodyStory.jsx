import { ExplorePageBody } from '../components/ExplorePageBody';
import { renderVizPreviews } from './renderVizPreviews';

const args = {
  renderVizPreviews,
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <ExplorePageBody {...args} />
    </div>
  );
};

export default Story;
