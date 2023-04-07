import { useState, useCallback } from 'react';
import { InputGroup, Form, Button } from '../bootstrap';

import 'vizhub-ui/dist/vizhub-ui.css';
import '../index.scss';
import './styles.scss';

export const HomePageBody = ({ onEmailSubmit, children }) => {
  const [email, setEmail] = useState('');

  const handleEmailChange = useCallback((event) => {
    setEmail(event.target.value);
  }, []);

  const handleEmailSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onEmailSubmit(email);
    },
    [email]
  );

  return (
    <div className="vh-home-page-body">
      <div className="blurb-container">
        <div className="blurb">
          <div className="callout large">Accelerate</div>
          <div className="callout">Dataviz Delivery</div>
          <p className="description">
            <strong>Develop bespoke data visualizations</strong> faster and more
            collaboratively than ever with <strong>VizHub 3</strong>. Built for
            client services.
          </p>
          <Form onSubmit={handleEmailSubmit}>
            <InputGroup className="vh-email-submission">
              <Form.Control
                placeholder="Your email"
                aria-label="Your email"
                onChange={handleEmailChange}
              />
              <Button
                variant="primary"
                disabled={!email}
                onClick={handleEmailSubmit}
              >
                Join the private beta
              </Button>
            </InputGroup>
          </Form>
        </div>
      </div>
      {children}
    </div>
  );
};
