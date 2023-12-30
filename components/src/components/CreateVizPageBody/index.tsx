import { VizPreviewCollection } from '../VizPreviewCollection';
import './styles.scss';

export const CreateVizPageBody = ({
  // Viz preview list props.
  renderVizPreviews,
}) => {
  return (
    <div className="vh-page vh-create-viz-page">
      <div className="create-viz-content">
        <div className="create-viz-header">
          <h1>Create Viz</h1>
          <div className="vh-lede-01">
            Create a new viz by forking one of these starter
            templates.
          </div>
        </div>
        <VizPreviewCollection>
          {renderVizPreviews()}
        </VizPreviewCollection>
      </div>
    </div>
  );
};
