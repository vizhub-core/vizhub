import { Footer } from '../Footer';
import {
  Button,
  Card,
  Col,
  Container,
  Row,
} from '../bootstrap';
import { image } from '../image';
import './styles.scss';

const enableFooter = true;
const enablePublicRoadmap = false;
const headerBackgroundSrc = image('landing-header-bkg');

console.log('Col');
console.log(Col);
console.log('Row');
console.log(Row);

export const SvelteAndD3PageBody = ({
  isUserAuthenticated,
}: {
  isUserAuthenticated: boolean;
}) => {
  return (
    <div className="vh-page community-svelte-and-d3-page">
      <Container>
        <Row className="mt-5">
          <Col
            md={{ span: 8, offset: 2 }}
            className="text-center"
          >
            <h1>Svelte and D3 in VizHub</h1>
            <p>
              Unlock the power of interactive data
              visualizations with this powerful technology
              combo
            </p>
            <a
              href="https://vizhub.com/higsch/3e9e1b1e7fdf49489c7869f97d038a11?edit=files&file=App.svelte"
              className="responsive-link"
            >
              <img
                src={image('svelte-and-d3-example')}
                alt="Svelte and D3 Example"
                className="responsive-img"
              />
            </a>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={{ span: 8, offset: 2 }}>
            <h2>Why Svelte and D3?</h2>
            <p>
              Combine the power of Svelte with the
              flexibility of D3 to create stunning,
              interactive data visualizations effortlessly
              in VizHub.
            </p>
            <h3>Seamless Integration</h3>
            <p>
              Harness the reactivity and performance of
              Svelte alongside the powerful data
              manipulation capabilities of D3. With VizHub,
              integrating these two technologies has never
              been easier.
            </p>
            <h3>Live Collaboration</h3>
            <p>
              Work together with your team in real-time.
              Share your visualizations instantly and get
              feedback on the fly. VizHub’s collaborative
              environment makes teamwork seamless.
            </p>
            <h3>Rapid Prototyping</h3>
            <p>
              Build and iterate on your data visualizations
              quickly. The combination of Svelte's intuitive
              framework and D3's robust data handling allows
              for fast development cycles.
            </p>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={{ span: 8, offset: 2 }}>
            <h2>Features</h2>
            <h3>Interactive Visualizations</h3>
            <p>
              Create dynamic, responsive visualizations that
              engage your audience. With Svelte and D3,
              bring your data to life with animations,
              transitions, and interactivity.
            </p>
            <h3>Hot Reloading</h3>
            <p>
              Get truly instant feedback with hot reloading.
              When you change the code, it runs instantly
              for everyone viewing! No need to refresh the
              page or restart your code.
            </p>
            <h3>Easy to Learn, Easy to Use</h3>
            <p>
              Svelte’s simple syntax and D3’s powerful
              library make a perfect pair. Whether you’re a
              beginner or an expert, you’ll find the tools
              you need to create sophisticated
              visualizations.
            </p>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={{ span: 8, offset: 2 }}>
            <h2>How It Works</h2>
            <ul>
              <li>
                <strong>Create a Project:</strong> Start a
                new project in VizHub with a Svelte and D3
                template.
              </li>
              <li>
                <strong>Develop Your Visualization:</strong>{' '}
                Use Svelte to manage your UI components and
                D3 to handle your data visualization logic.
              </li>
              <li>
                <strong>Collaborate and Share:</strong>{' '}
                Invite collaborators, share your work, and
                get instant feedback.
              </li>
            </ul>
          </Col>
        </Row>

        {/* <Row className="mt-5">
          <Col md={{ span: 8, offset: 2 }}>
            <h2>What Our Users Say</h2>
            <Card className="mb-3">
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p>
                    "VizHub has revolutionized how we build
                    and share data visualizations. The
                    Svelte and D3 integration is seamless
                    and powerful."
                  </p>
                  <footer className="blockquote-footer">
                    Data Scientist at XYZ Corp.
                  </footer>
                </blockquote>
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p>
                    "Creating interactive visualizations has
                    never been easier. The real-time
                    collaboration feature is a
                    game-changer."
                  </p>
                  <footer className="blockquote-footer">
                    Developer at ABC Inc.
                  </footer>
                </blockquote>
              </Card.Body>
            </Card>
          </Col>
        </Row> */}

        <Row className="mt-5 text-center">
          <Col>
            <Button
              variant="primary"
              size="lg"
              href="/pricing"
            >
              Start Your Free Trial
            </Button>
            <p className="mt-3">
              Have Questions?{' '}
              <a href="mailto:contact@vizhub.com">
                Contact Us
              </a>
            </p>
          </Col>
        </Row>

        <Row className="mt-5 mb-5">
          <Col md={{ span: 8, offset: 2 }}>
            <h2>About VizHub</h2>
            <p>
              VizHub is a platform dedicated to making data
              visualization accessible and collaborative.
              Our mission is to empower everyone to create,
              share, and learn from data visualizations.
              With our seamless integration of Svelte and
              D3, we are pushing the boundaries of what's
              possible in the world of data visualization.
            </p>
          </Col>
        </Row>
      </Container>
      {enableFooter && <Footer />}
    </div>
  );
};
