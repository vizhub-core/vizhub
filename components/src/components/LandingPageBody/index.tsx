import { Footer } from '../Footer';
import { Button } from '../bootstrap';
import { image } from '../image';
import './styles.scss';

const enableFooter = false;

const headerBackgroundSrc = image('landing-header-bkg');
const headerForegroundSrc = image(
  'landing-page-ui-example-2',
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
          <Button
            variant="secondary"
            size="lg"
            href="/explore"
          >
            Explore VizHub
          </Button>
          <a href="https://vizhub.com/curran/da1bd8ba9ffb4e71a240fb8eda172ba7">
            <img
              className="header-foreground"
              src={headerForegroundSrc}
            />
          </a>
        </div>
        <div className="features-container">
          <div className="white-background-section">
            <div className="landing-page-content">
              <h1 className="section-heading">
                Why VizHub?
              </h1>
              <div className="vh-lede-01">
                VizHub provides a comprehensive set of tools
                for creating and sharing data visualizations
                with your team and the world. Accelerate
                your development process with hot reloading,
                interactive widgets, AI assisted coding, and
                real-time collaboration.
              </div>
            </div>
          </div>
          <div className="feature-section">
            <div className="feature-section-content brand-background">
              <div className="feature-section-copy">
                <h3>Thousands of Public Vizzes</h3>
                <p>
                  Explore over 70,000 open source data
                  visualizations created by our community.
                  Sort by most popular, most recent, or most
                  forked.
                </p>
                <Button href="/explore">Explore</Button>
              </div>
              <div className="feature-section-image">
                <img
                  src={image('explore-thumbnails')}
                ></img>
              </div>
            </div>
          </div>
          <div className="feature-section">
            <div className="feature-section-content">
              <div className="feature-section-copy">
                <h3>Hot Reloading & Interactive Widgets</h3>
                <p>
                  Hot reloading is a feature that allows you
                  to see your changes in real-time as you
                  type, without reloading the entire
                  program. VizHub's interactive widgets
                  allow you to easily tweak numbers and
                  colors and get truly instant
                  feedback,dramatically accelerating your
                  experience.
                </p>
                <Button
                  href="https://vizhub.com/curran/66194bb8626c447bb13291587da28cec"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Try it out
                </Button>
              </div>
              <div className="feature-section-image">
                <a
                  href="https://vizhub.com/curran/66194bb8626c447bb13291587da28cec"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <video autoPlay loop muted>
                    <source
                      src={image(
                        'hot-reloading-demo',
                        'mp4',
                      )}
                      type="video/mp4"
                    />
                    Your browser does not support the video
                    tag.
                  </video>
                </a>
              </div>
            </div>
          </div>
          <div className="feature-section">
            <div className="feature-section-content brand-background">
              <div className="feature-section-copy">
                <h3>AI Assisted Coding</h3>
                <p>
                  Level up your coding skills with a little
                  help from the AI. Click the "AI Assist"
                  button to start the AI typing directly
                  into your editor. VizHub's AI Assistant
                  will help you code faster and more
                  accurately than ever before.
                </p>
                <Button
                  href="https://vizhub.com/forum/t/ai-assisted-coding/952"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </Button>
              </div>
              <div className="feature-section-image">
                <a
                  href="https://vizhub.com/forum/t/ai-assisted-coding/952"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <video autoPlay loop muted>
                    <source
                      src={image('ai-assist-demo', 'webm')}
                      type="video/webm"
                    />
                    Your browser does not support the video
                    tag.
                  </video>
                </a>
              </div>
            </div>
          </div>
          <div className="feature-section">
            <div className="feature-section-content">
              <div className="feature-section-copy">
                <h3>Real-Time Collaboration</h3>
                <p>
                  Invite your friends and colleagues to
                  collaborate on your data visualizations
                  any time, anywhere. With unlimited
                  collaborators, invite your team to join
                  you in real-time, fostering a
                  collaborative environment that is both
                  dynamic and productive.
                </p>
              </div>
              <div className="feature-section-image">
                <img
                  src={image('real-time-collaboration')}
                ></img>
              </div>
            </div>
          </div>
          <div className="feature-section">
            <div className="feature-section-content brand-background">
              <div className="feature-section-copy">
                <h3>Vanilla is the Best Flavor</h3>
                <p>
                  Export your visualizations as Vanilla
                  JavaScript. Author your code using
                  industry standard ES Modules. Experience
                  frictionless integration with existing
                  codebases and downstream deployment
                  workflows.
                </p>
              </div>
              <div className="feature-section-image rotating-image">
                <img
                  style={{ marginRight: '80px' }}
                  src={image('vanilla-javascript-cone')}
                ></img>
              </div>
            </div>
          </div>
        </div>
        {enableFooter && <Footer />}
      </div>
    </div>
  );
};
