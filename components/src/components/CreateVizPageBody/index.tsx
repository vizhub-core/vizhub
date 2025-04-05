import { Footer } from '../Footer';
import './styles.scss';

export const CreateVizPageBody = ({
  // Viz preview list props.
  renderVizPreviews,
}) => {
  return (
    <div className="vh-page vh-create-viz-page">
      <div className="create-viz-content vh-page-container">
        {/* <div className="vh-lede-01">
          <div className="create-viz-header">
            <h1>Create Your Visualization</h1>
            Transform your data into powerful, interactive
            visualizations. Choose from our templates or
            start from scratch to bring your data to life.
          </div>
        </div>
        <div className="vh-lede-01">
          <h3>Getting Started </h3>
          jumpstart your visualization projectby{' '}
          <span className="emphasized">forking</span> one of
          the templates below.
          <p>
            Each template comes with pre-configured settings
            and example data that you can easily customize
            to match your needs. Whether you're creating a
            simple chart or a complex interactive
            visualization, we've got you covered.
          </p>
        </div> */}
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">
              Create Your Visualization
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Transform your data into powerful, interactive
              visualizations. Choose from our templates or
              start from scratch to bring your data to life.
            </p>
          </div>
        </div>

        {renderVizPreviews()}

        <div className="vh-lede-01">
          <h4>Need Help?</h4>
          <p>
            Our community forum is also a great place to get
            inspiration and help from other visualization
            creators.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};
