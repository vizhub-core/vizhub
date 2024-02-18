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
            {isPastFeb15
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
            src="https://www.youtube-nocookie.com/embed/KMq4FSSKff0?si=QmR1ZKBWYHWQbs88"
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
                  VizHub is a platform for collaborative
                  data visualization. It lets you start
                  coding and creating data visualizations{' '}
                  <i>right away</i>, without the need to set
                  up a complex local development
                  environment. It primarily targets{' '}
                  <a href="https://d3js.org/">D3.js</a>, but
                  is a general-purpose platform supporting
                  rapid prototyping and collaborative
                  iteration of interactive graphics.
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
                  feedback using{' '}
                  <strong>hot reloading</strong> and{' '}
                  <strong>interactive widgets</strong>. Get
                  your visualizations <i>just right</i> in
                  no time flat!
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
                  Frustrated by how long it takes to make
                  and deploy changes to your data
                  visualizations? In VizHub, all changes are
                  synchronized in real-time in a multiplayer
                  environment and executed in the running
                  visualization instantaneously.
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
                <Button href="https://calendly.com/curran-kelleher/casual">
                  Book a Demo
                </Button>
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
