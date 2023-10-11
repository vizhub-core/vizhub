import React from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
} from '../bootstrap';

export const LandingPageBody = () => {
  return (
    <Container fluid className="p-5 bg-light">
      <Container className="my-5">
        <Row className="align-items-center">
          <Col md={8}>
            <h1>
              Welcome to Our Data Visualization Platform!
            </h1>
            <p>
              Revolutionizing the way you collaborate and
              design data visualizations.
            </p>
            <Button variant="primary" href="#features">
              Learn More
            </Button>
          </Col>
        </Row>
      </Container>

      <section id="features">
        <Container>
          <h2 className="mb-4">Key Features</h2>
          <Row className="mb-3">
            <Col>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>
                    Browser-based Designing
                  </Card.Title>
                  <Card.Text>
                    Enable designers to contribute to data
                    visualization projects using just a
                    browser, no local setup required.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>
                    Real-time Mob Programming
                  </Card.Title>
                  <Card.Text>
                    Collaborate seamlessly in real-time and
                    enhance team synergy.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>
                    AI-Assisted Coding
                  </Card.Title>
                  <Card.Text>
                    Bring in an AI collaborator directly
                    into your editor during mob programming
                    sessions.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>
                    Freedom with Vanilla JavaScript
                  </Card.Title>
                  <Card.Text>
                    Author in Vanilla JavaScript and easily
                    export your work without any platform
                    lock-in.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>
                    Streamlined Development
                  </Card.Title>
                  <Card.Text>
                    Boost your team's efficiency in data
                    visualization development.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>
                    Immediate Client Feedback
                  </Card.Title>
                  <Card.Text>
                    Action feedback instantly with real-time
                    collaboration and hot reloading.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  );
};
