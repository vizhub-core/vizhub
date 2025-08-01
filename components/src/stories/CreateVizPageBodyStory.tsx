import { CreateVizPageBody } from '../components/CreateVizPageBody';

export const args = {
  renderVizPreviews: () => (
    <div className="vh-viz-preview-collection">
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">My Bar Chart</h5>
              <p className="card-text">Sales data visualization from last week</p>
              <small className="text-muted">Modified 2 hours ago</small>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">COVID-19 Dashboard</h5>
              <p className="card-text">Interactive dashboard with multiple charts</p>
              <small className="text-muted">Modified 1 day ago</small>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Network Analysis</h5>
              <p className="card-text">Social network visualization project</p>
              <small className="text-muted">Modified 3 days ago</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <CreateVizPageBody {...args} />
    </div>
  );
};

export default Story;
