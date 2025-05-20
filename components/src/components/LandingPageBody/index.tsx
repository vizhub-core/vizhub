import { Footer } from '../Footer';
import { HomeStarter } from '../HomeStarter';
// import { Testimonial } from '../Testimonial';
import { Button } from '../bootstrap';
import { discordLink } from '../discordLink';
import { image } from '../image';
import './styles.scss';

const enableFooter = true;
const enablePublicRoadmap = false;
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
        {/* <div className="landing-page-content">
          <HomeStarter /> 
          {/* <div className="landing-page-tagline">
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
          ></iframe> }
        </div> */}
        <div className="features-container">
          <div className="white-background-section blurb-and-testimonial">
            <div className="landing-page-content">
              <h1 className="section-heading">
                Welcome to VizHub!
              </h1>
              <div className="vh-lede-01 mb-3">
                <p>
                  VizHub is a platform for creating,
                  sharing, and collaborating on interactive
                  data visualizations. It's perfect for data
                  scientists, developers, and designers who
                  want to create high-quality, custom
                  visualizations. VizHub is free for
                  open-source projects, with a premium plan
                  for professional use.
                </p>
                <p>Unique Features:</p>
                <ul>
                  <li>
                    <a href="#hot-reloading">
                      Hot Reloading and Interactive Widgets
                    </a>
                  </li>
                  <li>
                    <a href="#real-time-collaborators">
                      Real-time Collaboration
                    </a>
                  </li>
                  <li>
                    <a href="#private-vizzes">
                      Private Vizzes
                    </a>
                  </li>
                  <li>
                    <a href="#ai-assisted-coding">
                      AI-Assisted Coding
                    </a>
                  </li>
                  <li>
                    <a href="#white-label-embedding">
                      White Label Embedding
                    </a>
                  </li>
                </ul>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button href="/" size="lg">
                  Explore VizHub
                </Button>
                <Button
                  href="/pricing"
                  size="lg"
                  variant="secondary"
                >
                  See Plans
                </Button>
              </div>
            </div>
            {/* <Testimonial
              headshotImgSrc={image('headshot-alark')}
              link="https://www.linkedin.com/in/alarkjoshi/"
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
                    observe the results in real-time. This
                    has been a huge hit for my students and
                    me.
                  </p>
                  <p>
                    In my course, students are required to
                    maintain a portfolio of their
                    assignments, and VizHub simplifies this
                    process significantly by allowing them
                    to effortlessly embed their projects
                    onto their personal websites. One of the
                    standout features of VizHub is its
                    ongoing improvement under the diligent
                    guidance of Curran Kelleher, the
                    platform's creator. For example, when I
                    reached out to him about my students
                    running into problems with using P5 on
                    Vizhub, he found a solution and promptly
                    made change to Vizhub to allow my
                    students to use P5. His proactive
                    approach ensures that VizHub remains at
                    the forefront of online solutions for
                    educators and students alike who are
                    keen on exploring and showcasing their
                    visualization projects.
                  </p>
                </>
              }
              name="Alark Joshi"
              title="Associate Professor of Computer Science"
              association="University of San Francisco"
            /> */}
          </div>

          <div
            className="feature-section"
            id="hot-reloading"
          >
            <div className="feature-section-content brand-background">
              <div className="feature-section-copy">
                <h3>
                  Hot Reloading and Interactive Widgets
                </h3>
                <p>
                  <strong>Hot reloading</strong> is a way of
                  executing freshly edited code without a
                  re-loading the entire page. This lets you
                  preserve state between runs, accelerating
                  your development cycle dramatically.
                </p>
                <p>
                  <strong>Interactive widgets</strong> let
                  you tweak numbers and colors by dragging
                  the mouse, not typing. When combined with
                  hot reloading, interactive widgets provide
                  an entirely new experience that makes
                  tweaking numbers and colors riduculously
                  fast and satisfying.
                </p>
                <Button
                  href="https://vizhub.com/forum/t/hot-reloading-and-interactive-widgets/968"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
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
          <div
            className="feature-section"
            id="real-time-collaborators"
          >
            <div className="feature-section-content">
              <div className="feature-section-copy">
                <h3>Real-time Collaboration</h3>
                <p>
                  Edit code with others in real-time. It's
                  like Google Docs for code. Everyone gets
                  access to hot reloading and interactive
                  widgets, in a live collaborative
                  environment. When anyone runs the code, it
                  runs for everyone.
                </p>
                <Button
                  href="https://vizhub.com/forum/t/real-time-collaborators/976"
                  size="lg"
                >
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
          <div
            className="feature-section"
            id="private-vizzes"
          >
            <div className="feature-section-content">
              <div className="feature-section-copy">
                <h3>Private Vizzes</h3>
                <p>
                  Work on real projects and sensitive data
                  with private vizzes. Leverage real-time
                  collaboration by selectively inviting
                  friends and colleagues to view and edit
                  your private vizzes. Only available with
                  VizHub Premium.
                </p>
                <Button
                  href="/pricing?feature=private-vizzes"
                  size="lg"
                >
                  See Plans
                </Button>
              </div>
              <div className="feature-section-image">
                <img
                  src={image('empty-private-vizzes', 'svg')}
                ></img>
                <img
                  src={image('empty-private-vizzes', 'svg')}
                ></img>
              </div>
            </div>
          </div>

          <div
            className="feature-section"
            id="ai-assisted-coding"
          >
            <div className="feature-section-content brand-background">
              <div className="feature-section-copy">
                <h3>AI-Assisted Coding</h3>
                <p>
                  Write code and solve technical challenges
                  faster by invoking artificial intelligence
                  on-demand. Prompt the robot by typing a
                  comment or partial solution, put your
                  cursor where you want code generated, and
                  click "Start AI Assist". Code will be
                  streamed directly into your editor, as
                  though you are working with a remote
                  collaborator. Powered by OpenAI's GPT4.
                  Only available with VizHub Premium.
                </p>

                <Button
                  href="/pricing?feature=ai-assisted-coding"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                >
                  See Plans
                </Button>
                {/* <p className="text-muted small mt-3">
                  P. S. If you want a real coding mentor,
                  that's available too!{' '}
                  <a href="https://calendly.com/curran-kelleher/data-visualization-consultation?month=2024-03">
                    Book a session now
                  </a>{' '}
                  to get expert help.
                </p> */}
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
          <div
            className="feature-section"
            id="white-label-embedding"
          >
            <div className="feature-section-content">
              <div className="feature-section-copy">
                <h3>White Label Embedding</h3>
                <p>
                  Embed interactive visualizations from
                  VizHub into your existing Web pages
                  without any VizHub branding or link back.
                  Just copy the embed snippet and paste it
                  into your HTML. Works anywhere iframes are
                  allowed. Only available with VizHub
                  Premium.
                </p>
                <Button
                  href="/pricing?feature=white-label-embedding"
                  size="lg"
                >
                  See Plans
                </Button>
              </div>
              <div className="feature-section-image">
                <img
                  src={image('white-label-embedding')}
                ></img>
              </div>
            </div>
          </div>
          {/* <div className="feature-section">
            <div className="feature-section-content">
              <div className="feature-section-copy">
                <h3>Search Open Source Examples</h3>
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
                <Button href="/explore" size="lg">
                  Explore VizHub
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
                <Button
                  href="https://github.com/vizhub-core/vite-export-template"
                  size="lg"
                >
                  Vite Template
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
          */}
          {enablePublicRoadmap && (
            <div className="white-background-section blurb-and-testimonial">
              <div className="landing-page-content">
                <h1 className="section-heading">
                  Public Roadmap
                </h1>
                <div className="vh-lede-01 mb-3">
                  <p>
                    Here are some plans we have for the
                    future of VizHub.
                  </p>
                  <ul>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/788">
                        API Keys for Read/Write Viz Access
                        via API
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/781">
                        Revision History: Restore to
                        Previous Version
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/789">
                        Revision History: Embed Previous
                        Version
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/790">
                        Revision History: Export Previous
                        Version
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/791">
                        Revision History: Fork From Previous
                        Version
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/792">
                        Comments: Notifications
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/793">
                        Comments: @-Mentions
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/702">
                        Export Formats: Export as React, Vue
                        or Svelte app
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/794">
                        Persistent Configuration
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/795">
                        Better Search (text embeddings &
                        vector similarity search)
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/796">
                        Image Search (image embeddings &
                        vector similarity search)
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/797">
                        Recommended Vizzes
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/798">
                        Visual Forks Tree Navigator
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/vizhub-core/vizhub-feedback/issues/799">
                        Ready-made Branded Dataviz Templates
                      </a>
                    </li>
                  </ul>
                  <p>
                    If any of these resonate with you,
                    please help us priotitize by commenting
                    on the linked issues above. If you have
                    more ideas for features that would make
                    VizHub more useful to you, please let us
                    know by{' '}
                    <a href="https://github.com/vizhub-core/vizhub-feedback/issues/new">
                      opening a new issue
                    </a>{' '}
                    or{' '}
                    <a href={discordLink}>
                      chatting in Discord
                    </a>
                    !
                  </p>
                </div>
              </div>
            </div>
          )}
          <HomeStarter />
        </div>
        {enableFooter && <Footer />}
      </div>
    </div>
  );
};
