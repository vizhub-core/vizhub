import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Nav,
} from '../../components/bootstrap';
import './styles.css';

export const Documentation = () => {
  const [activeSection, setActiveSection] = useState(
    'getting-started',
  );

  const sections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'api-reference', title: 'API Reference' },
    { id: 'examples', title: 'Examples' },
    { id: 'tutorials', title: 'Tutorials' },
    { id: 'faq', title: 'FAQ' },
  ];

  return (
    <Container
      fluid
      className="documentation-container py-5"
    >
      <Row>
        <Col lg={3} className="mb-4">
          <div className="documentation-sidebar">
            <h5 className="sidebar-heading mb-3">
              Documentation
            </h5>
            <Nav className="flex-column">
              {sections.map((section) => (
                <Nav.Link
                  key={section.id}
                  className={
                    activeSection === section.id
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setActiveSection(section.id)
                  }
                >
                  {section.title}
                </Nav.Link>
              ))}
            </Nav>

            {activeSection === 'api-reference' && (
              <div className="mt-4">
                <h6 className="sidebar-subheading mb-2">
                  API Sections
                </h6>
                <Nav className="flex-column sub-nav">
                  <Nav.Link href="#core">Core API</Nav.Link>
                  <Nav.Link href="#visualization">
                    Visualization API
                  </Nav.Link>
                  <Nav.Link href="#data">Data API</Nav.Link>
                  <Nav.Link href="#events">
                    Events API
                  </Nav.Link>
                </Nav>
              </div>
            )}

            <div className="mt-4 p-3 sidebar-help-box">
              <h6>Need Help?</h6>
              <p className="small mb-2">
                Can't find what you're looking for?
              </p>
              <a
                href="/forum"
                className="btn btn-sm btn-outline-primary w-100"
              >
                Ask in Forum
              </a>
            </div>
          </div>
        </Col>

        <Col lg={9}>
          <div className="documentation-content">
            {activeSection === 'getting-started' && (
              <div>
                <h1 className="mb-4">
                  Getting Started with VizHub
                </h1>
                <p className="lead">
                  Welcome to VizHub's documentation. This
                  guide will help you get started with
                  creating and sharing data visualizations.
                </p>

                <section className="mb-5">
                  <h2 className="h3 mb-3">
                    What is VizHub?
                  </h2>
                  <p>
                    VizHub is a platform for creating,
                    sharing, and discovering data
                    visualizations. It provides an
                    integrated development environment where
                    you can code, preview, and publish your
                    visualizations all in one place.
                  </p>
                  <p>
                    Whether you're using D3.js, Observable
                    Plot, or other JavaScript libraries,
                    VizHub gives you the tools to bring your
                    data to life.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h3 mb-3">Installation</h2>
                  <p>
                    No installation required! VizHub runs in
                    your browser, so you can start creating
                    visualizations right away.
                  </p>
                  <div className="code-block">
                    <pre>
                      <code>// No npm install needed!</code>
                    </pre>
                  </div>
                </section>

                <section className="mb-5">
                  <h2 className="h3 mb-3">Quick Start</h2>
                  <ol className="documentation-steps">
                    <li>
                      <h4>Create an Account</h4>
                      <p>
                        Sign up for a free VizHub account to
                        start creating visualizations.
                      </p>
                    </li>
                    <li>
                      <h4>Create a New Visualization</h4>
                      <p>
                        Click the "+" button in the
                        navigation bar to create a new
                        visualization.
                      </p>
                    </li>
                    <li>
                      <h4>Write Your Code</h4>
                      <p>
                        Use the editor to write your HTML,
                        CSS, and JavaScript code.
                      </p>
                      <div className="code-block">
                        <pre>
                          <code>{`// Example D3.js code
const svg = d3.select('body').append('svg')
  .attr('width', 600)
  .attr('height', 400);

svg.append('circle')
  .attr('cx', 300)
  .attr('cy', 200)
  .attr('r', 50)
  .attr('fill', 'steelblue');`}</code>
                        </pre>
                      </div>
                    </li>
                    <li>
                      <h4>Preview Your Visualization</h4>
                      <p>
                        See your changes in real-time in the
                        preview panel.
                      </p>
                    </li>
                    <li>
                      <h4>Save and Publish</h4>
                      <p>
                        Click "Publish" to make your
                        visualization available to others.
                      </p>
                    </li>
                  </ol>
                </section>

                <section className="mb-5">
                  <h2 className="h3 mb-3">Next Steps</h2>
                  <p>
                    Once you've created your first
                    visualization, you might want to
                    explore:
                  </p>
                  <ul className="documentation-list">
                    <li>
                      <a
                        href="#api-reference"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection('api-reference');
                        }}
                      >
                        API Reference
                      </a>{' '}
                      - Learn about the VizHub API
                    </li>
                    <li>
                      <a
                        href="#examples"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection('examples');
                        }}
                      >
                        Examples
                      </a>{' '}
                      - See example visualizations
                    </li>
                    <li>
                      <a
                        href="#tutorials"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection('tutorials');
                        }}
                      >
                        Tutorials
                      </a>{' '}
                      - Follow step-by-step tutorials
                    </li>
                  </ul>
                </section>
              </div>
            )}

            {activeSection === 'api-reference' && (
              <div>
                <h1 className="mb-4">API Reference</h1>
                <p className="lead">
                  Comprehensive documentation of VizHub's
                  APIs for creating and customizing
                  visualizations.
                </p>

                <section id="core" className="mb-5">
                  <h2 className="h3 mb-3">Core API</h2>
                  <p>
                    The Core API provides the fundamental
                    functionality for creating and managing
                    visualizations.
                  </p>

                  <div className="api-method mb-4">
                    <h4 className="method-name">
                      createVisualization(options)
                    </h4>
                    <p>
                      Creates a new visualization with the
                      specified options.
                    </p>
                    <h5>Parameters:</h5>
                    <ul className="parameter-list">
                      <li>
                        <code>options</code> (Object) -
                        Configuration options for the
                        visualization
                      </li>
                    </ul>
                    <h5>Returns:</h5>
                    <p>
                      <code>Visualization</code> - A new
                      visualization instance
                    </p>
                    <h5>Example:</h5>
                    <div className="code-block">
                      <pre>
                        <code>{`const viz = VizHub.createVisualization({
  title: 'My Visualization',
  description: 'A simple bar chart',
  public: true
});`}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="api-method">
                    <h4 className="method-name">
                      getVisualization(id)
                    </h4>
                    <p>
                      Retrieves a visualization by its ID.
                    </p>
                    <h5>Parameters:</h5>
                    <ul className="parameter-list">
                      <li>
                        <code>id</code> (String) - The ID of
                        the visualization
                      </li>
                    </ul>
                    <h5>Returns:</h5>
                    <p>
                      <code>Visualization</code> - The
                      requested visualization
                    </p>
                    <h5>Example:</h5>
                    <div className="code-block">
                      <pre>
                        <code>{`const viz = VizHub.getVisualization('abc123');`}</code>
                      </pre>
                    </div>
                  </div>
                </section>

                <section
                  id="visualization"
                  className="mb-5"
                >
                  <h2 className="h3 mb-3">
                    Visualization API
                  </h2>
                  <p>
                    The Visualization API allows you to
                    manipulate and customize visualizations.
                  </p>

                  <div className="api-method">
                    <h4 className="method-name">
                      visualization.update(options)
                    </h4>
                    <p>
                      Updates the visualization with new
                      options.
                    </p>
                    <h5>Parameters:</h5>
                    <ul className="parameter-list">
                      <li>
                        <code>options</code> (Object) - New
                        configuration options
                      </li>
                    </ul>
                    <h5>Returns:</h5>
                    <p>
                      <code>Visualization</code> - The
                      updated visualization
                    </p>
                    <h5>Example:</h5>
                    <div className="code-block">
                      <pre>
                        <code>{`viz.update({
  title: 'Updated Title',
  description: 'New description'
});`}</code>
                      </pre>
                    </div>
                  </div>
                </section>

                <section id="data" className="mb-5">
                  <h2 className="h3 mb-3">Data API</h2>
                  <p>
                    The Data API provides methods for
                    loading and manipulating data in your
                    visualizations.
                  </p>

                  <div className="api-method">
                    <h4 className="method-name">
                      loadData(url, options)
                    </h4>
                    <p>Loads data from a URL.</p>
                    <h5>Parameters:</h5>
                    <ul className="parameter-list">
                      <li>
                        <code>url</code> (String) - The URL
                        to load data from
                      </li>
                      <li>
                        <code>options</code> (Object,
                        optional) - Options for loading data
                      </li>
                    </ul>
                    <h5>Returns:</h5>
                    <p>
                      <code>Promise</code> - A promise that
                      resolves with the loaded data
                    </p>
                    <h5>Example:</h5>
                    <div className="code-block">
                      <pre>
                        <code>{`VizHub.loadData('https://example.com/data.csv')
  .then(data => {
    // Use the data in your visualization
    console.log(data);
  });`}</code>
                      </pre>
                    </div>
                  </div>
                </section>

                <section id="events" className="mb-5">
                  <h2 className="h3 mb-3">Events API</h2>
                  <p>
                    The Events API allows you to respond to
                    events in your visualizations.
                  </p>

                  <div className="api-method">
                    <h4 className="method-name">
                      visualization.on(event, callback)
                    </h4>
                    <p>
                      Registers an event listener for the
                      specified event.
                    </p>
                    <h5>Parameters:</h5>
                    <ul className="parameter-list">
                      <li>
                        <code>event</code> (String) - The
                        name of the event
                      </li>
                      <li>
                        <code>callback</code> (Function) -
                        The callback function
                      </li>
                    </ul>
                    <h5>Returns:</h5>
                    <p>
                      <code>Visualization</code> - The
                      visualization instance
                    </p>
                    <h5>Example:</h5>
                    <div className="code-block">
                      <pre>
                        <code>{`viz.on('click', function(event) {
  console.log('Visualization clicked:', event);
});`}</code>
                      </pre>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'examples' && (
              <div>
                <h1 className="mb-4">Examples</h1>
                <p className="lead">
                  Explore these examples to learn how to
                  create different types of visualizations
                  with VizHub.
                </p>

                <div className="row row-cols-1 row-cols-md-2 g-4 mb-5">
                  <div className="col">
                    <div className="example-card">
                      <div className="example-image">
                        <img
                          src="https://via.placeholder.com/400x300?text=Bar+Chart"
                          alt="Bar Chart"
                        />
                      </div>
                      <div className="example-content">
                        <h3>Bar Chart</h3>
                        <p>
                          A simple bar chart created with
                          D3.js.
                        </p>
                        <a
                          href="#"
                          className="btn btn-sm btn-primary"
                        >
                          View Example
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <div className="example-card">
                      <div className="example-image">
                        <img
                          src="https://via.placeholder.com/400x300?text=Line+Chart"
                          alt="Line Chart"
                        />
                      </div>
                      <div className="example-content">
                        <h3>Line Chart</h3>
                        <p>
                          A line chart showing time series
                          data.
                        </p>
                        <a
                          href="#"
                          className="btn btn-sm btn-primary"
                        >
                          View Example
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <div className="example-card">
                      <div className="example-image">
                        <img
                          src="https://via.placeholder.com/400x300?text=Scatter+Plot"
                          alt="Scatter Plot"
                        />
                      </div>
                      <div className="example-content">
                        <h3>Scatter Plot</h3>
                        <p>
                          A scatter plot with tooltips and
                          transitions.
                        </p>
                        <a
                          href="#"
                          className="btn btn-sm btn-primary"
                        >
                          View Example
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <div className="example-card">
                      <div className="example-image">
                        <img
                          src="https://via.placeholder.com/400x300?text=Map+Visualization"
                          alt="Map Visualization"
                        />
                      </div>
                      <div className="example-content">
                        <h3>Map Visualization</h3>
                        <p>
                          A choropleth map showing
                          geographic data.
                        </p>
                        <a
                          href="#"
                          className="btn btn-sm btn-primary"
                        >
                          View Example
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href="/explore"
                    className="btn btn-outline-primary"
                  >
                    View More Examples
                  </a>
                </div>
              </div>
            )}

            {activeSection === 'tutorials' && (
              <div>
                <h1 className="mb-4">Tutorials</h1>
                <p className="lead">
                  Step-by-step tutorials to help you learn
                  how to create visualizations with VizHub.
                </p>

                <div className="tutorial-list">
                  <div className="tutorial-item">
                    <div className="tutorial-number">
                      01
                    </div>
                    <div className="tutorial-content">
                      <h3>
                        Creating Your First Visualization
                      </h3>
                      <p>
                        Learn how to create a simple bar
                        chart visualization with D3.js and
                        VizHub.
                      </p>
                      <a
                        href="/tutorial"
                        className="tutorial-link"
                      >
                        Start Tutorial{' '}
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>

                  <div className="tutorial-item">
                    <div className="tutorial-number">
                      02
                    </div>
                    <div className="tutorial-content">
                      <h3>Adding Interactivity</h3>
                      <p>
                        Learn how to add tooltips,
                        transitions, and other interactive
                        elements to your visualizations.
                      </p>
                      <a
                        href="/tutorial"
                        className="tutorial-link"
                      >
                        Start Tutorial{' '}
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>

                  <div className="tutorial-item">
                    <div className="tutorial-number">
                      03
                    </div>
                    <div className="tutorial-content">
                      <h3>Working with Data</h3>
                      <p>
                        Learn how to load and manipulate
                        data for your visualizations.
                      </p>
                      <a
                        href="/tutorial"
                        className="tutorial-link"
                      >
                        Start Tutorial{' '}
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>

                  <div className="tutorial-item">
                    <div className="tutorial-number">
                      04
                    </div>
                    <div className="tutorial-content">
                      <h3>
                        Creating Responsive Visualizations
                      </h3>
                      <p>
                        Learn how to make your
                        visualizations work well on
                        different screen sizes.
                      </p>
                      <a
                        href="/tutorial"
                        className="tutorial-link"
                      >
                        Start Tutorial{' '}
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'faq' && (
              <div>
                <h1 className="mb-4">
                  Frequently Asked Questions
                </h1>
                <p className="lead">
                  Find answers to common questions about
                  using VizHub.
                </p>

                <div
                  className="accordion"
                  id="faqAccordion"
                >
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                      >
                        What is VizHub?
                      </button>
                    </h2>
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body">
                        <p>
                          VizHub is a platform for creating,
                          sharing, and discovering data
                          visualizations. It provides an
                          integrated development environment
                          where you can code, preview, and
                          publish your visualizations all in
                          one place.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                      >
                        Is VizHub free to use?
                      </button>
                    </h2>
                    <div className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <p>
                          VizHub offers both free and
                          premium plans. The free plan
                          allows you to create public
                          visualizations, while premium
                          plans offer private visualizations
                          and additional features.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                      >
                        What libraries can I use in VizHub?
                      </button>
                    </h2>
                    <div className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <p>
                          VizHub supports D3.js, Observable
                          Plot, and most JavaScript
                          visualization libraries. You can
                          also use HTML, CSS, and JavaScript
                          to create custom visualizations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                      >
                        How do I embed a visualization in my
                        website?
                      </button>
                    </h2>
                    <div className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <p>
                          Once you've published a
                          visualization, you can embed it in
                          your website using an iframe.
                          Simply click the "Embed" button on
                          your visualization page to get the
                          embed code.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                      >
                        Can I collaborate with others on a
                        visualization?
                      </button>
                    </h2>
                    <div className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <p>
                          Currently, direct collaboration is
                          not supported, but you can fork
                          someone else's visualization to
                          create your own version, or they
                          can fork yours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
