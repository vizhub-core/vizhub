import React from 'react';
import { Container, Row, Col, Card, Button } from '../../components/bootstrap';
import './styles.css';

export const GettingStarted = () => {
  return (
    <Container className="getting-started-container py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="display-4 text-center mb-4">Getting Started with VizHub</h1>
          <p className="lead text-center">
            Welcome to VizHub! This guide will help you create your first data visualization
            and make the most of our platform.
          </p>
        </Col>
      </Row>

      {/* Introduction Section */}
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="section-title">What is VizHub?</h2>
              <p>
                VizHub is a platform for creating, sharing, and discovering data visualizations.
                Built for the data visualization community, VizHub provides an integrated development
                environment where you can code, preview, and publish your visualizations all in one place.
              </p>
              <p>
                Whether you're using D3.js, Observable Plot, or other JavaScript libraries,
                VizHub gives you the tools to bring your data to life.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Start Guide */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">Quick Start Guide</h2>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm step-card">
            <Card.Body>
              <div className="step-number">1</div>
              <h3>Create an Account</h3>
              <p>
                Sign up for a free VizHub account to start creating visualizations.
                You'll need an account to save and share your work.
              </p>
              <Button variant="primary" href="/login" className="mt-auto">Sign Up / Log In</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm step-card">
            <Card.Body>
              <div className="step-number">2</div>
              <h3>Create Your First Visualization</h3>
              <p>
                Click the "+" button in the navigation bar to create a new visualization.
                You'll be taken to our editor where you can start coding right away.
              </p>
              <Button variant="primary" href="/create" className="mt-auto">Create Visualization</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm step-card">
            <Card.Body>
              <div className="step-number">3</div>
              <h3>Share Your Work</h3>
              <p>
                Once you're happy with your visualization, publish it to share with the community.
                You can embed it in your website or share the link on social media.
              </p>
              <Button variant="outline-primary" href="/explore" className="mt-auto">Explore Examples</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Features Overview */}
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="section-title">Key Features</h2>
              <ul className="feature-list">
                <li>
                  <strong>Integrated Development Environment</strong> - Code, preview, and publish all in one place
                </li>
                <li>
                  <strong>Real-time Preview</strong> - See your changes instantly as you code
                </li>
                <li>
                  <strong>Version Control</strong> - Track changes to your visualizations over time
                </li>
                <li>
                  <strong>Forking</strong> - Build upon others' work by creating your own version
                </li>
                <li>
                  <strong>Embedding</strong> - Easily embed your visualizations in other websites
                </li>
                <li>
                  <strong>Community</strong> - Learn from and collaborate with other visualization creators
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Learning Resources */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">Learning Resources</h2>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm resource-card">
            <Card.Body>
              <h3>D3.js Tutorials</h3>
              <p>
                Learn how to use D3.js, the powerful JavaScript library for creating
                data-driven documents.
              </p>
              <a href="https://observablehq.com/@d3/learn-d3" target="_blank" rel="noopener noreferrer" className="resource-link">
                D3 Tutorials on Observable <i className="bi bi-box-arrow-up-right"></i>
              </a>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm resource-card">
            <Card.Body>
              <h3>Community Examples</h3>
              <p>
                Explore visualizations created by the VizHub community for inspiration
                and learning.
              </p>
              <a href="/explore" className="resource-link">
                Browse Examples <i className="bi bi-arrow-right"></i>
              </a>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm resource-card">
            <Card.Body>
              <h3>Discord Community</h3>
              <p>
                Join our Discord server to connect with other visualization creators,
                ask questions, and share your work.
              </p>
              <a href="https://discord.gg/vizhub" target="_blank" rel="noopener noreferrer" className="resource-link">
                Join Discord <i className="bi bi-discord"></i>
              </a>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FAQ Section */}
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="section-title">Frequently Asked Questions</h2>
              
              <div className="faq-item">
                <h4>What libraries can I use in VizHub?</h4>
                <p>
                  VizHub supports D3.js, Observable Plot, and most JavaScript visualization libraries.
                  You can also use HTML, CSS, and JavaScript to create custom visualizations.
                </p>
              </div>
              
              <div className="faq-item">
                <h4>Is VizHub free to use?</h4>
                <p>
                  VizHub offers both free and premium plans. The free plan allows you to create
                  public visualizations, while premium plans offer private visualizations and
                  additional features. Check our <a href="/pricing">pricing page</a> for details.
                </p>
              </div>
              
              <div className="faq-item">
                <h4>How do I embed a visualization in my website?</h4>
                <p>
                  Once you've published a visualization, you can embed it in your website using
                  an iframe. Simply click the "Embed" button on your visualization page to get
                  the embed code.
                </p>
              </div>
              
              <div className="faq-item">
                <h4>Can I collaborate with others on a visualization?</h4>
                <p>
                  Currently, direct collaboration is not supported, but you can fork someone else's
                  visualization to create your own version, or they can fork yours.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Call to Action */}
      <Row className="mt-5">
        <Col className="text-center">
          <h2 className="mb-4">Ready to Create Your First Visualization?</h2>
          <Button variant="primary" size="lg" href="/create" className="px-5 py-3">
            Get Started Now
          </Button>
          <p className="mt-3">
            Need help? <a href="mailto:support@vizhub.com">Contact our support team</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};
