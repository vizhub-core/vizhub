import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Footer } from '../Footer';
import './styles.scss';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: false,
        error: true,
        message: 'Please fill out all required fields.'
      });
      return;
    }
    
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    setFormStatus({
      submitted: true,
      error: false,
      message: 'Thank you for your message! We will get back to you soon.'
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="vh-page vh-contact-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="contact-header">
              <h1>Contact Us</h1>
              <p>Have questions or feedback about VizHub? We'd love to hear from you!</p>
            </div>
            
            {formStatus.submitted && (
              <Alert variant="success" className="mb-4">
                {formStatus.message}
              </Alert>
            )}
            
            {formStatus.error && (
              <Alert variant="danger" className="mb-4">
                {formStatus.message}
              </Alert>
            )}
            
            <div className="contact-card">
              <Row>
                <Col md={5} className="contact-info">
                  <div className="contact-info-content">
                    <h3>Get in Touch</h3>
                    <p>We're here to help with any questions about our platform.</p>
                    
                    <div className="contact-method">
                      <i className="bi bi-envelope"></i>
                      <div>
                        <h4>Email</h4>
                        <p>support@vizhub.com</p>
                      </div>
                    </div>
                    
                    <div className="contact-method">
                      <i className="bi bi-discord"></i>
                      <div>
                        <h4>Discord</h4>
                        <p>Join our community</p>
                      </div>
                    </div>
                    
                    <div className="contact-method">
                      <i className="bi bi-github"></i>
                      <div>
                        <h4>GitHub</h4>
                        <p>Report issues or contribute</p>
                      </div>
                    </div>
                  </div>
                </Col>
                
                <Col md={7} className="contact-form">
                  <h3>Send a Message</h3>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name <span className="required">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Email <span className="required">*</span></Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Message <span className="required">*</span></Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={5} 
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Button type="submit" className="submit-button">
                      Send Message
                    </Button>
                  </Form>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};
