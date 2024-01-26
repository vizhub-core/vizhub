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
            <div className="feature-section-content">
              <div className="feature-section-copy">
                <h3>Iterate Faster</h3>
                <p>
                  Tweak numbers and colors in real-time
                  using VizHub's Hot Reloading & Interactive
                  Widgets. These features let you to see
                  your changes immediately, without
                  reloading the entire program. This makes
                  it easy to iterate on your visualizations
                  and get them just right, saving you time
                  and effort. No more tweaking colors in
                  design tools and manually typing number
                  changes!
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
            <div className="feature-section-content">
              <div className="feature-section-copy">
                <h3>Collaborate in Real-Time</h3>
                <p>
                  With all changes synchronized in
                  real-time, you can leverage pair
                  programming and mob programming to
                  accelerate your time to delivery. Share
                  your work securely with clients. Action
                  client feedback during meetings, and your
                  changes will appear on their screen
                  instantly!
                </p>
              </div>
              <div className="feature-section-image">
                <img
                  src={image('real-time-collaboration')}
                ></img>
                <div className="collaboration-demo-video-overlay">
                  <video autoPlay loop muted>
                    <source
                      src={image(
                        'hot-reloading-collaboration-demo',
                        'mp4',
                      )}
                      type="video/mp4"
                    />
                    Your browser does not support the video
                    tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
          <div className="feature-section">
            <div className="feature-section-content">
              <div className="feature-section-copy">
                <h3>Open Source Examples</h3>
                <p>
                  Explore over 70,000 open source data
                  visualizations created by our community.
                  Sort by most popular, most recent, or most
                  forked. Most are MIT Licensed, so you can
                  use them in your own projects.
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
            <div className="feature-section-content brand-background">
              <div className="feature-section-copy">
                <h3>Frictionless Productionization</h3>
                <p>
                  Frustrated with platform-specific syntax
                  that introduces friction into your
                  process? VizHub uses{' '}
                  <strong>vanilla JavaScript</strong> and
                  industry-standard{' '}
                  <strong>ES Modules</strong>. It also
                  supports popular frameworks like{' '}
                  <a href="https://vizhub.com/higsch/39fa26cfa7854e34934e559efbf7855b">
                    Svelte
                  </a>{' '}
                  and{' '}
                  <a href="https://vizhub.com/curran/a95f227912474d4a9bbe88a3c6c33ab9">
                    React
                  </a>
                  . You can export code from VizHub and drop
                  it straight into your existing codebase,
                  and it should work out of the box!
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
