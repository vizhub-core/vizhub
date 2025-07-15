import { Footer } from '../Footer';
import './styles.scss';

export const CreateVizPageBody = ({
  // Viz preview list props.
  renderVizPreviews,
}) => {
  return (
    <div className="vh-page vh-create-viz-page">
      <div className="create-viz-content vh-page-container">
        <div className="create-viz-header">
          <div className="header-content">
            <h1>Create Visualization</h1>
            <div className="vh-lede-01">
              Start by{' '}
              <span className="emphasized">forking</span> a
              template
            </div>
            <p className="create-viz-description">
              Select a template that fits your needs. Each
              provides a foundation you can customize.
            </p>
          </div>
        </div>

        {renderVizPreviews()}
      </div>
      <Footer />
    </div>
  );
};
