import { useContext } from 'react';
import { Footer } from '../Footer';
import { Button } from '../bootstrap';
import { image } from '../image';
import './styles.scss';

const enableFooter = true;

const headerBackgroundSrc = image('landing-header-bkg');
const headerForegroundSrc = image(
  'landing-page-ui-example-2',
);

const isPastFeb15 = new Date() > new Date('2024-02-15');

export const LandingPageBody = ({
  isUserAuthenticated,
}: {
  isUserAuthenticated: boolean;
}) => {
  return (
    <div className="vh-page vh-landing-page">
      <img
        className="header-background"
        src={headerBackgroundSrc}
      />
      <div className="landing-page-body">
        <div className="landing-page-content">
          <div className="landing-page-tagline">
            {isPastFeb15
              ? 'Accelerate Dataviz Delivery'
              : '50% off for 3 months! Use code EARLYADOPTER (ends Feb 15)'}
          </div>
          <h1 className="landing-page-headline">
            Escape the limits of BI tools with D3.js and Web
            Standards
          </h1>
          <Button
            variant="secondary"
            size="lg"
            href={
              isUserAuthenticated ? '/create-viz' : '/login'
            }
          >
            Get started
          </Button>
          {/* <a href="https://vizhub.com/curran/da1bd8ba9ffb4e71a240fb8eda172ba7">
            <img
              className="header-foreground"
              src={headerForegroundSrc}
            />
          </a> */}
          <iframe
            style={{
              marginTop: '70px',
              borderRadius: '24px',
              maxWidth: '100%',
            }}
            width={560 * 2}
            height={315 * 2}
            src="https://www.youtube-nocookie.com/embed/47mjSVQEoAg?si=Slw1ew0dWaNaQfCi"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <div className="features-container">
          <div className="white-background-section">
            <div className="landing-page-content">
              <h1 className="section-heading">
                What is VizHub
              </h1>
              <div className="vh-lede-01">
                <p>
                  VizHub is a streamlined, web-based
                  platform tailored for data visualization
                  professionals. It combines a collaborative
                  D3.js coding environment with essential
                  tools for advanced customization and
                  interactive design. Ideal for those
                  transitioning from non-coding data
                  visualization tools, VizHub simplifies
                  complex visualizations and fosters
                  learning and collaboration in a
                  user-friendly interface.
                </p>
              </div>
            </div>
          </div>

          <div className="feature-section">
            <div className="feature-section-content brand-background">
              <div className="feature-section-copy">
                <h3>Iterate Faster</h3>
                <p>
                  Sick of the slow feedback loop in your
                  current data visualization workflow?
                  Iterate faster and save time with instant
                  feedback. This makes it easy to get your
                  visualizations just right, saving you time
                  and effort.
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
                  Frustrated by how long it takes to make
                  and deploy changes to your data
                  visualizations? In VizHub, all changes are
                  synchronized in real-time in a multiplayer
                  environment and executed in the running
                  visualization instantaneously.
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
            <div className="feature-section-content brand-background">
              <div className="feature-section-copy">
                <h3>AI Assisted Coding</h3>
                <p>
                  Feeling stuck with the steep learning
                  curve of JavaScript and D3? Leverage
                  VizHub's in-editor artificial intelligence
                  to request on-demand coding suggestions.
                  Just write a comment saying what you want
                  to code, and the AI will implement it for
                  you.
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
            <div className="feature-section-content brand-background">
              <div className="feature-section-copy">
                <h3>Frictionless Productionization</h3>
                <p>
                  Frustrated with the platform-specific
                  syntax and runtime logic of other online
                  coding environments? VizHub uses{' '}
                  <strong>vanilla JavaScript</strong> and
                  also supports popular frameworks like{' '}
                  <a href="https://vizhub.com/higsch/39fa26cfa7854e34934e559efbf7855b">
                    Svelte
                  </a>{' '}
                  and{' '}
                  <a href="https://vizhub.com/curran/a95f227912474d4a9bbe88a3c6c33ab9">
                    React
                  </a>
                  . When you export code from VizHub, you
                  can drop it into and existing codebase and
                  it should work out of the box!
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
          {/* <div className="feature-section">
            <div className="feature-section-copy">
              <a href="https://calendly.com/curran-kelleher/casual">
                Book a meeting with VizHub's founder
              </a>
            </div>
          </div> */}
        </div>
        {enableFooter && <Footer />}
      </div>
    </div>
  );
};
