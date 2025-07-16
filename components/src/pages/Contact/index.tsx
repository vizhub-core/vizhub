import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
} from '../../components/bootstrap';
import './styles.css';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setValidated(true);
    setSubmitted(true);
  };

  return (
    <Container className="contact-container py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="contact-card shadow">
            <Card.Body className="p-0">
              <Row className="g-0">
                <Col md={5} className="contact-info-col">
                  <div className="contact-info-content">
                    <h2 className="mb-4">Get in Touch</h2>
                    <p className="mb-5">
                      Have questions about VizHub? We're
                      here to help! Fill out the form and
                      our team will get back to you as soon
                      as possible.
                    </p>

                    <div className="contact-method">
                      <div className="contact-icon">
                        <i className="bi bi-envelope"></i>
                      </div>
                      <div className="contact-details">
                        <h4>Email Us</h4>
                        <p>
                          <a href="mailto:support@vizhub.com">
                            support@vizhub.com
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="contact-method">
                      <div className="contact-icon">
                        <i className="bi bi-discord"></i>
                      </div>
                      <div className="contact-details">
                        <h4>Join Our Discord</h4>
                        <p>
                          <a
                            href="https://discord.gg/vizhub"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            discord.gg/vizhub
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="contact-method">
                      <div className="contact-icon">
                        <i className="bi bi-github"></i>
                      </div>
                      <div className="contact-details">
                        <h4>GitHub</h4>
                        <p>
                          <a
                            href="https://github.com/vizhub-core"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            github.com/vizhub-core
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="contact-method">
                      <div className="contact-icon">
                        <i className="bi bi-twitter"></i>
                      </div>
                      <div className="contact-details">
                        <h4>Twitter</h4>
                        <p>
                          <a
                            href="https://twitter.com/vizhub"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            @vizhub
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col md={7} className="contact-form-col">
                  {submitted ? (
                    <div className="thank-you-message">
                      <div className="thank-you-icon">
                        <i className="bi bi-check-circle"></i>
                      </div>
                      <h3>Thank You!</h3>
                      <p>
                        Your message has been sent
                        successfully. We'll get back to you
                        soon.
                      </p>
                      <Button
                        variant="outline-primary"
                        onClick={() => {
                          setFormData({
                            name: '',
                            email: '',
                            subject: '',
                            message: '',
                          });
                          setValidated(false);
                          setSubmitted(false);
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <div className="contact-form-content">
                      <h2 className="mb-4">
                        Send a Message
                      </h2>
                      <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                      >
                        <Form.Group
                          className="mb-3"
                          controlId="contactName"
                        >
                          <Form.Label>Your Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide your name.
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          className="mb-3"
                          controlId="contactEmail"
                        >
                          <Form.Label>
                            Email Address
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid email
                            address.
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          className="mb-3"
                          controlId="contactSubject"
                        >
                          <Form.Label>Subject</Form.Label>
                          <Form.Select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          >
                            <option value="">
                              Select a subject
                            </option>
                            <option value="general">
                              General Inquiry
                            </option>
                            <option value="support">
                              Technical Support
                            </option>
                            <option value="feedback">
                              Feedback
                            </option>
                            <option value="billing">
                              Billing Question
                            </option>
                            <option value="partnership">
                              Partnership Opportunity
                            </option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Please select a subject.
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          className="mb-4"
                          controlId="contactMessage"
                        >
                          <Form.Label>Message</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Type your message here..."
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a message.
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                          variant="primary"
                          type="submit"
                          className="w-100 py-2"
                        >
                          Send Message
                        </Button>
                      </Form>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col className="text-center">
          <h3 className="mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-muted mb-5">
            Find quick answers to common questions
          </p>

          <Row className="justify-content-center">
            <Col md={10}>
              <div className="faq-section">
                <div className="faq-item">
                  <h4>What is VizHub?</h4>
                  <p>
                    VizHub is a platform for creating,
                    sharing, and discovering data
                    visualizations. It provides an
                    integrated development environment where
                    you can code, preview, and publish your
                    visualizations all in one place.
                  </p>
                </div>

                <div className="faq-item">
                  <h4>Is VizHub free to use?</h4>
                  <p>
                    VizHub offers both free and premium
                    plans. The free plan allows you to
                    create public visualizations, while
                    premium plans offer private
                    visualizations and additional features.
                  </p>
                </div>

                <div className="faq-item">
                  <h4>How do I get started with VizHub?</h4>
                  <p>
                    To get started, simply create an
                    account, click the "+" button to create
                    a new visualization, and start coding.
                    Check out our{' '}
                    <a href="/getting-started">
                      Getting Started guide
                    </a>{' '}
                    for more detailed instructions.
                  </p>
                </div>

                <div className="faq-item">
                  <h4>
                    What libraries can I use in VizHub?
                  </h4>
                  <p>
                    VizHub supports D3.js, Observable Plot,
                    and most JavaScript visualization
                    libraries. You can also use HTML, CSS,
                    and JavaScript to create custom
                    visualizations.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
