import { useState } from 'react';
import { Container, Form, Row, Col, Button } from '../bootstrap';
import './styles.css';

export const VizBotPage = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResponse(`Based on your prompt: "${prompt}", I recommend creating a visualization that shows the relationship between your variables. You could use a bar chart to compare categories, or a line chart to show trends over time. Would you like me to generate a specific visualization type for your data?`);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <Container fluid className="vizbot-container">
      <Row className="justify-content-center align-items-center">
        <Col md={10} lg={8} className="text-center">
          <div className="vizbot-hero">
            <div className="vizbot-robot-container">
              <img 
                src="/src/Assets/ChatGPT Image Jul 16, 2025, 10_24_49 PM.png" 
                alt="VizBot Robot" 
                className="vizbot-robot-image"
              />
            </div>
            <div className="vizbot-text">
              <h1 className="vizbot-title">VizBot</h1>
              <h2 className="vizbot-subtitle">How can I assist with your data visualization?</h2>
              <p className="vizbot-description">
                I can generate charts and maps to help you visualize your data.
              </p>
            </div>
          </div>
          
          <Form onSubmit={handleSubmit} className="vizbot-form">
            <div className="input-container">
              <Form.Control
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt..."
                disabled={isLoading}
                className="vizbot-input"
                autoComplete="off"
              />
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isLoading || !prompt.trim()}
                className="submit-btn"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : 'Generate'}
              </Button>
            </div>
          </Form>
          
          {response && (
            <div className="response-container mt-4">
              <h3>VizBot Response:</h3>
              <div className="response-content">
                <p>{response}</p>
              </div>
            </div>
          )}
          
          <div className="sample-visualizations mt-5">
            <h3 className="mb-4">Sample Visualizations</h3>
            <Row>
              <Col md={4} className="mb-4">
                <div className="viz-sample">
                  <div className="viz-img bar-chart"></div>
                  <h4>Bar Charts</h4>
                  <p>Compare values across categories</p>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="viz-sample">
                  <div className="viz-img line-chart"></div>
                  <h4>Line Charts</h4>
                  <p>Track changes over time</p>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="viz-sample">
                  <div className="viz-img pie-chart"></div>
                  <h4>Pie Charts</h4>
                  <p>Show composition and proportions</p>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="viz-sample">
                  <div className="viz-img scatter-plot"></div>
                  <h4>Scatter Plots</h4>
                  <p>Identify correlations between variables</p>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="viz-sample">
                  <div className="viz-img map-viz"></div>
                  <h4>Maps</h4>
                  <p>Visualize geographic data</p>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="viz-sample">
                  <div className="viz-img heatmap"></div>
                  <h4>Heatmaps</h4>
                  <p>Show intensity of values in a matrix</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
