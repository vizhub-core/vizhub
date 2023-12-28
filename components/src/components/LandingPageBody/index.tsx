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
      </div>
    </div>
  );
};
