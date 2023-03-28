import { VizPreviewCollection } from '../components/VizPreviewCollection';
import { renderVizPreviews } from './renderVizPreviews';

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <VizPreviewCollection>{renderVizPreviews()}</VizPreviewCollection>
    </div>
  );
};

export default Story;
