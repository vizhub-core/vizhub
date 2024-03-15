import { Footer } from '../Footer';
import { Testimonial } from '../Testimonial';
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
          {/* <HomeStarter /> */}
          <div className="landing-page-tagline">
            {true
              ? 'Accelerate Dataviz Delivery'
              : '50% off for 3 months! Use code EARLYADOPTER (ends Feb 15)'}
          </div>
          <h1 className="landing-page-headline">
            Interactive Data Visualizations Fast
          </h1>
          <Button
            variant="secondary"
            size="lg"
            href="/login"
          >
            Get Started
          </Button>

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
                Why VizHub?
              </h1>
              <div className="vh-lede-01 mb-3">
                <p>
                  VizHub is a platform for creating,
                  sharing, and collaborating on interactive
                  data visualizations. It's designed for
                  data scientists, developers, and designers
                  who want to create interactive
                  visualizations with ease. It's free for
                  open source, with a premium plan that
                  supports professional work.
                </p>
              </div>
              <Button href="/pricing">See Plans</Button>
            </div>
          </div>

          {/* <Testimonial
            quote={
              <>
                Curran quickly understood my complex
                codebase, and was able to fix many of my
                visualization's bugs that I couldn't find
                solutions for online. Additionally, he gave
                specific, best-practice advice to improve
                the load time, UI responsiveness, and
                maintainability of my D3 implementation.
                Curran was great to work with and I would
                100% recommend him to anyone stuck with D3
                bugs, or looking to refactor their code to
                follow best practices.
              </>
            }
            name="Louis Parizeau"
            title="Co-Founder, Highgate Analytics"
          /> */}
          <Testimonial
            quote={
              <>
                <p>
                  For the past two years, I've relied on
                  VizHub for both my undergraduate and
                  graduate Data Visualization courses.
                  VizHub offers a seamless platform for
                  hosting P5 and D3 code online, providing
                  students with the invaluable ability to
                  make instant changes to their code and
                  observe the results in real-time. This has
                  been a huge hit for my students and me.
                </p>
                <p>
                  {' '}
                  In my course, students are required to
                  maintain a portfolio of their assignments,
                  and VizHub simplifies this process
                  significantly by allowing them to
                  effortlessly embed their projects onto
                  their personal websites. One of the
                  standout features of VizHub is its ongoing
                  improvement under the diligent guidance of
                  Curran Kelleher, the platform's creator.
                  For example, when I reached out to him
                  about my students running into problems
                  with using P5 on Vizhub, he found a
                  solution and promptly made change to
                  Vizhub to allow my students to use P5. His
                  proactive approach ensures that VizHub
                  remains at the forefront of online
                  solutions for educators and students alike
                  who are keen on exploring and showcasing
                  their visualization projects.
                </p>
              </>
            }
            name="Alark Joshi"
            title="Associate Professor of Computer Science, University of San Francisco"
          />

          <div className="feature-section">
            <div className="feature-section-content brand-background">
              <div className="feature-section-copy">
                <h3>Speed Through Iteration</h3>
                <p>
                  Tired of the lag in your visualization
                  edits? VizHub's instant feedback loop,
                  powered by hot reloading and interactive
                  widgets, makes tweaking your visuals a
                  breeze. Achieve perfection swiftly, saving
                  time and money, and delighting your
                  audience.
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
                <h3>Unite Efforts Instantly</h3>
                <p>
                  Bid farewell to tedious update and
                  deployment cycles. With VizHub, your
                  team's changes sync in a blink, in a
                  collaborative, "multiplayer" coding
                  environment. Watch your data
                  visualizations evolve with each keystroke,
                  together, in real time.
                </p>
                <Button href="https://vizhub.com/forum/t/real-time-collaborators/976">
                  Learn more
                </Button>
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
                  your intent as a comment or partial
                  solution, and watch as the AI breathes
                  code to life, transforming thoughts into
                  functions—like having a coding mentor at
                  your side. It's like magic, but it's real.
                </p>

                <Button
                  href="https://vizhub.com/forum/t/ai-assisted-coding/952"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </Button>
                <p className="text-muted small mt-3">
                  P. S. If you want a real coding mentor,
                  that's available too!{' '}
                  <a href="https://calendly.com/curran-kelleher/data-visualization-consultation?month=2024-03">
                    Book a session now
                  </a>{' '}
                  to get expert help.
                </p>
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
                <h3>Be Inspired by Open Source</h3>
                <p>
                  Looking for a jumping-off point? VizHub's
                  curated library of open-source examples
                  awaits your exploration. Tailor them,
                  twist them, make them your own by forking
                  and modifying. They're not just
                  samples—they are the beginning of
                  something greater. And with an MIT
                  license, the sky's your limit.
                </p>
                <Button href="/create-viz">
                  Create Viz
                </Button>
              </div>
              <div className="feature-section-image">
                <img
                  className="explore-thumbnails"
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
                  Overwhelmed by quirky quirks of other
                  online coding platforms? VizHub champions
                  vanilla JavaScript and embraces beloved
                  frameworks like{' '}
                  <a href="https://vizhub.com/forum/t/svelte-support-in-vizhub-3/967">
                    Svelte
                  </a>{' '}
                  and{' '}
                  <a href="https://vizhub.com/curran/a95f227912474d4a9bbe88a3c6c33ab9">
                    React
                  </a>
                  . Our promise: code that plays well with
                  others. Export from VizHub, integrate with
                  ease, and keep your story flowing without
                  friction.
                </p>
                <Button href="https://github.com/curran/vite-d3-template/tree/main">
                  See Vite Template
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
          <div className="feature-section">
            <div className="feature-section-content">
              <div className="feature-section-copy">
                <h3>
                  Elevate Your Brand with Seamless
                  Integration
                </h3>
                <p>
                  White-label embedding from VizHub offers
                  the ultimate flexibility for your brand's
                  storytelling. Embed stunning, interactive
                  data visualizations directly into your
                  digital platforms, free from external
                  branding. Present your insights with
                  confidence and maintain brand consistency
                  across every touchpoint.
                </p>
                <Button href="https://vizhub.com/forum/t/embedding-vizzes/975">
                  Learn more
                </Button>
              </div>
              <div className="feature-section-image">
                <img
                  src={image('white-label-embedding')}
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
