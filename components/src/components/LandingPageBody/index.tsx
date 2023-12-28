import { Button } from '../bootstrap';
import { image } from '../image';
import './styles.scss';

const headerBackgroundSrc = image('landing-header-bkg');
const headerForegroundSrc = image(
  'landing-page-ui-example',
);

export const LandingPageBody = () => {
  return (
    <div className="vh-page vh-landing-page">
      <img
        className="header-background"
        src={headerBackgroundSrc}
      />
      <div className="landing-page-body">
        <div className="landing-page-content">
          <div className="landing-page-tagline">
            Accelerate Dataviz Delivery
          </div>
          <h1 className="landing-page-headline">
            Develop custom data visualizations faster and
            more collaboratively than ever.
          </h1>
          <Button variant="secondary" size="lg">
            Try Vizhub for free
          </Button>
          <img
            className="header-foreground"
            src={headerForegroundSrc}
          />
        </div>
        <div className="white-background-section">
          <div className="landing-page-content">
            <h1 className="section-heading">
              What is VizHub?
            </h1>
            <div className="vh-lede-01">
              VizHub is an interactive data visualization
              platform that caters to teaching and
              showcasing data visualizations using web
              technologies like D3.js and React.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
