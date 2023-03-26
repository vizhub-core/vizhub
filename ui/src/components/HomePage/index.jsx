import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { Header } from '../Header';
import '../index.scss';
import './home-page.scss';

export const HomePage = (props) => {
  return (
    <div className="vh-page vh-home-page">
      <Header {...props} />
      <div className="blurb-container">
        <div className="blurb">
          <div className="callout">Accelerate Dataviz Delivery</div>
          <p className="description">
            <strong>Develop bespoke data visualizations</strong> faster and more
            collaboratively than ever with VizHub 3. Built for client services.
          </p>
          <InputGroup className="vh-email-submission">
            <Form.Control placeholder="Your email" aria-label="Your email" />
            <Button variant="primary" id="button-addon2">
              Join the private beta
            </Button>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};
