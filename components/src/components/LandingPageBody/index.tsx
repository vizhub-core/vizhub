import { Footer } from '../Footer';
import { HomeStarter } from '../HomeStarter';
import { Button } from '../bootstrap';
import { image } from '../image';
import './styles.scss';

const enableFooter = true;

const headerBackgroundSrc = image('landing-header-bkg');

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
          <HomeStarter />
          {/* <div className="landing-page-tagline">
            {true
              ? 'Accelerate Dataviz Delivery'
              : '50% off for 3 months! Use code EARLYADOPTER (ends Feb 15)'}
          </div>
          <h1 className="landing-page-headline">
            Develop Custom Interactive Visualizations{' '}
            <i>Faster</i> with <i>More Fun</i>
          </h1>
          <Button
            variant="secondary"
            size="lg"
            href={
              isUserAuthenticated ? '/create-viz' : '/login'
            }
          >
            Get started
          </Button> */}

          <iframe
            style={{
              marginTop: '70px',
              borderRadius: '24px',
              maxWidth: '100%',
            }}
            width={560 * 2}
            height={315 * 2}
            src="https://www.youtube-nocookie.com/embed/47mjSVQEoAg?si=yf1cala_ZzF3rGpS"
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
                Discover VizHub: Your Collaborative
                Visualization Workspace
              </h1>
              <div className="vh-lede-01">
                <p>
                  VizHub isn't just a platform; it's your
                  springboard into the world of data
                  visualization. Embark on your coding
                  adventure instantly, no complex setup
                  needed. While it's a haven for D3.js
                  enthusiasts, VizHub is versatile enough
                  for any rapid prototyping and shared
                  creativity you imagine.
                </p>
              </div>
            </div>
          </div>

          <div className="feature-section">
            <div className="feature-section-content brand-background">
              <div className="feature-section-copy">
                <h3>Speed Through Iteration</h3>
                <p>
                  Tired of the lag in your visualization
                  edits? VizHub’s instant feedback loop,
                  powered by hot reloading and dynamic
                  widgets, makes tweaking your visuals a
                  breeze. Achieve perfection swiftly and see
                  your data dance to your tune, quickly and
                  efficiently.
                </p>
                <Button
                  href="https://vizhub.com/forum/t/hot-reloading-and-interactive-widgets/968"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
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
                  Bid farewell to tedious update and
                  deployment cycles. With VizHub, your
                  team's changes sync in a blink, in a
                  collaborative, "multiplayer" coding
                  environment. Watch your data
                  visualizations evolve with each keystroke,
                  together, in real time.
                </p>
                <Button href="/prifing">See pricing</Button>
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
                <h3>AI-Assisted Innovation</h3>
                <p>
                  Conquer the coding learning curve with the
                  aid of our AI companion. Stuck on a
                  JavaScript or D3.js problem? Just type
                  your intent, and watch as the AI breathes
                  code to life, transforming thoughts into
                  function—like having a coding mentor at
                  your side. It's like magic, but it's real.
                </p>
                <p>
                  P. S. If you want a real coding mentor,
                  that's available too! Just{' '}
                  <a href="https://calendly.com/curran-kelleher/data-visualization-consultation?month=2024-03">
                    book a session now
                  </a>
                  .
                </p>
                <Button
                  href="https://vizhub.com/forum/t/ai-assisted-coding/952"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more about AI Assist
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
                  Need some reference implementations?
                  VizHub provides a growing collection of
                  open source examples to help you get
                  started. These examples are designed to be
                  forked and modified to suit your needs.
                  They are MIT licensed, so you can use them
                  in your own projects.
                </p>
                <Button href="/create-viz">
                  Explore Templates
                </Button>
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
                <h3>Vanilla is the Best Flavor</h3>
                <p>
                  Frustrated with the platform-specific
                  syntax and runtime logic of other online
                  coding environments? VizHub uses{' '}
                  <strong>vanilla JavaScript</strong> and
                  also supports popular frameworks like{' '}
                  <a href="https://vizhub.com/forum/t/svelte-support-in-vizhub-3/967">
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
                <Button href="/pricing">See Plans</Button>
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
