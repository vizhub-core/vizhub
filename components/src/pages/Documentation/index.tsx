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
    { id: 'platform-features', title: 'Platform Features' },
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

            {activeSection === 'platform-features' && (
              <div className="mt-4">
                <h6 className="sidebar-subheading mb-2">
                  Features
                </h6>
                <Nav className="flex-column sub-nav">
                  <Nav.Link href="#search">Search & Explore</Nav.Link>
                  <Nav.Link href="#viz-management">
                    Viz Management
                  </Nav.Link>
                  <Nav.Link href="#editing">Code Editing</Nav.Link>
                  <Nav.Link href="#ai-assistance">
                    AI Assistance
                  </Nav.Link>
                  <Nav.Link href="#collaboration">
                    Collaboration
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
                  Welcome to VizHub! This guide will walk you through the platform's 
                  key features and show you how to get started creating and sharing 
                  data visualizations with AI assistance.
                </p>

                <section className="mb-5">
                  <h2 className="h3 mb-3">
                    What is VizHub?
                  </h2>
                  <p>
                    VizHub is a platform for creating, sharing, and discovering data
                    visualizations with AI assistance. It provides a complete development 
                    environment where you can code, preview, and publish your
                    visualizations all in one place.
                  </p>
                  <p>
                    Whether you're using D3.js, Observable Plot, or other JavaScript libraries,
                    VizHub gives you the tools to bring your data to life. The platform includes
                    AI-powered editing assistance to help you create visualizations faster and learn 
                    new techniques.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h3 mb-3">No Installation Needed</h2>
                  <p>
                    VizHub runs entirely in your browser - no software installation required! 
                    Simply sign up for an account and start creating visualizations immediately.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h3 mb-3">Quick Start Flow</h2>
                  <p>
                    Follow this simple workflow to get started with VizHub:
                  </p>
                  <ol className="documentation-steps">
                    <li>
                      <h4>1. Login to Your Account</h4>
                      <p>
                        Sign up for a free VizHub account or login if you already have one.
                        You can use your GitHub account or create a new account with your email.
                      </p>
                    </li>
                    <li>
                      <h4>2. Search and Explore Vizzes</h4>
                      <p>
                        Use the <strong>Search</strong> page to find visualizations by keyword, or 
                        browse the <strong>Explore</strong> page to discover featured and trending 
                        visualizations from the community.
                      </p>
                    </li>
                    <li>
                      <h4>3. View a Visualization</h4>
                      <p>
                        Click on any visualization to view it in detail. You can see the live 
                        output, browse the source code, and read the documentation.
                      </p>
                    </li>
                    <li>
                      <h4>4. Fork a Visualization</h4>
                      <p>
                        Found something interesting? Click the "Fork" button to create your own 
                        copy that you can modify and customize.
                      </p>
                    </li>
                    <li>
                      <h4>5. Edit the Code</h4>
                      <p>
                        Use the integrated code editor to modify HTML, CSS, and JavaScript files. 
                        See your changes in real-time as you code.
                      </p>
                      <div className="code-block">
                        <pre>
                          <code>{`// Example: Creating a simple circle with D3.js
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
                      <h4>6. Edit with AI</h4>
                      <p>
                        Use VizHub's AI assistant to help you write code, debug issues, or learn 
                        new visualization techniques. The AI can suggest improvements and help 
                        you implement complex features.
                      </p>
                    </li>
                  </ol>
                </section>

                <section className="mb-5">
                  <h2 className="h3 mb-3">Key Platform Features</h2>
                  <p>
                    Now that you understand the basic workflow, explore these key features:
                  </p>
                  <ul className="documentation-list">
                    <li>
                      <a
                        href="#platform-features"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection('platform-features');
                        }}
                      >
                        Platform Features
                      </a>{' '}
                      - Learn about search, explore, profiles, and more
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
                      - Browse example visualizations
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
                      - Step-by-step guides
                    </li>
                    <li>
                      <a
                        href="#faq"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection('faq');
                        }}
                      >
                        FAQ
                      </a>{' '}
                      - Common questions and answers
                    </li>
                  </ul>
                </section>
              </div>
            )}

            {activeSection === 'platform-features' && (
              <div>
                <h1 className="mb-4">Platform Features</h1>
                <p className="lead">
                  Comprehensive guide to VizHub's features for creating, 
                  discovering, and sharing data visualizations.
                </p>

                <section id="search" className="mb-5">
                  <h2 className="h3 mb-3">Search & Explore</h2>
                  <p>
                    VizHub provides multiple ways to discover interesting visualizations:
                  </p>

                  <div className="feature-description mb-4">
                    <h4 className="feature-name">
                      Search Page
                    </h4>
                    <p>
                      Use the search functionality to find visualizations by keyword, 
                      author, or topic. Filter results by popularity, recency, or relevance.
                    </p>
                    <p><strong>Location:</strong> Available from the main navigation</p>
                  </div>

                  <div className="feature-description">
                    <h4 className="feature-name">
                      Explore Page
                    </h4>
                    <p>
                      Browse curated collections of featured visualizations, trending 
                      content, and community highlights. Perfect for discovering new 
                      techniques and getting inspiration.
                    </p>
                    <p><strong>Location:</strong> Available from the main navigation</p>
                  </div>
                </section>

                <section id="viz-management" className="mb-5">
                  <h2 className="h3 mb-3">Viz Management</h2>
                  <p>
                    Tools for creating, organizing, and managing your visualizations:
                  </p>

                  <div className="feature-description mb-4">
                    <h4 className="feature-name">
                      Create New Visualization
                    </h4>
                    <p>
                      Start from scratch with a blank template or choose from 
                      pre-built templates for common visualization types.
                    </p>
                  </div>

                  <div className="feature-description mb-4">
                    <h4 className="feature-name">
                      Forking
                    </h4>
                    <p>
                      Create your own copy of any public visualization to modify 
                      and customize. The original remains unchanged while you 
                      experiment with your version.
                    </p>
                  </div>

                  <div className="feature-description">
                    <h4 className="feature-name">
                      Profile & Portfolio
                    </h4>
                    <p>
                      Manage your visualizations from your profile page. Track 
                      views, forks, and feedback on your work.
                    </p>
                  </div>
                </section>

                <section id="editing" className="mb-5">
                  <h2 className="h3 mb-3">Code Editing</h2>
                  <p>
                    VizHub provides a full-featured development environment:
                  </p>

                  <div className="feature-description mb-4">
                    <h4 className="feature-name">
                      Integrated Editor
                    </h4>
                    <p>
                      Edit HTML, CSS, and JavaScript files with syntax highlighting, 
                      auto-completion, and error detection.
                    </p>
                  </div>

                  <div className="feature-description mb-4">
                    <h4 className="feature-name">
                      Live Preview
                    </h4>
                    <p>
                      See your changes instantly as you code. The preview updates 
                      in real-time without needing to save or refresh.
                    </p>
                  </div>

                  <div className="feature-description">
                    <h4 className="feature-name">
                      File Management
                    </h4>
                    <p>
                      Add, delete, and organize files within your visualization 
                      project. Support for multiple file types and assets.
                    </p>
                  </div>
                </section>

                <section id="ai-assistance" className="mb-5">
                  <h2 className="h3 mb-3">AI Assistance</h2>
                  <p>
                    Get help from AI to write better code and learn faster:
                  </p>

                  <div className="feature-description mb-4">
                    <h4 className="feature-name">
                      AI Code Generation
                    </h4>
                    <p>
                      Describe what you want to create and get AI-generated code 
                      suggestions. Perfect for learning new techniques or getting 
                      unstuck.
                    </p>
                  </div>

                  <div className="feature-description">
                    <h4 className="feature-name">
                      Code Improvements
                    </h4>
                    <p>
                      Ask the AI to help optimize your code, fix bugs, or suggest 
                      alternative approaches to solve visualization challenges.
                    </p>
                  </div>
                </section>

                <section id="collaboration" className="mb-5">
                  <h2 className="h3 mb-3">Collaboration</h2>
                  <p>
                    Share and collaborate on visualizations with the community:
                  </p>

                  <div className="feature-description mb-4">
                    <h4 className="feature-name">
                      Public Sharing
                    </h4>
                    <p>
                      Make your visualizations public for others to view, fork, 
                      and learn from. Build your reputation in the visualization 
                      community.
                    </p>
                  </div>

                  <div className="feature-description mb-4">
                    <h4 className="feature-name">
                      Embedding
                    </h4>
                    <p>
                      Embed your visualizations in websites, blog posts, or 
                      presentations with simple iframe code.
                    </p>
                  </div>

                  <div className="feature-description">
                    <h4 className="feature-name">
                      Community Features
                    </h4>
                    <p>
                      Follow other creators, bookmark interesting visualizations, 
                      and engage with the community through comments and feedback.
                    </p>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'examples' && (
              <div>
                <h1 className="mb-4">Examples</h1>
                <p className="lead">
                  Discover inspiring visualizations created by the VizHub community. 
                  These examples showcase different techniques and use cases to help 
                  you learn and get inspired.
                </p>

                <section className="mb-5">
                  <h2 className="h3 mb-3">Popular Visualization Types</h2>
                  <div className="row row-cols-1 row-cols-md-2 g-4 mb-5">
                    <div className="col">
                      <div className="example-card">
                        <div className="example-content">
                          <h3>Bar Charts</h3>
                          <p>
                            Interactive bar charts with D3.js, perfect for comparing 
                            categorical data and showing rankings.
                          </p>
                          <a
                            href="/explore"
                            className="btn btn-sm btn-primary"
                          >
                            Browse Examples
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="example-card">
                        <div className="example-content">
                          <h3>Line Charts</h3>
                          <p>
                            Time series visualizations showing trends and patterns 
                            over time with smooth animations.
                          </p>
                          <a
                            href="/explore"
                            className="btn btn-sm btn-primary"
                          >
                            Browse Examples
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="example-card">
                        <div className="example-content">
                          <h3>Scatter Plots</h3>
                          <p>
                            Explore correlations and patterns in multidimensional 
                            data with interactive tooltips and zooming.
                          </p>
                          <a
                            href="/explore"
                            className="btn btn-sm btn-primary"
                          >
                            Browse Examples
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="example-card">
                        <div className="example-content">
                          <h3>Geographic Maps</h3>
                          <p>
                            Choropleth maps, point maps, and other geographic 
                            visualizations using TopoJSON and map projections.
                          </p>
                          <a
                            href="/explore"
                            className="btn btn-sm btn-primary"
                          >
                            Browse Examples
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="example-card">
                        <div className="example-content">
                          <h3>Network Diagrams</h3>
                          <p>
                            Force-directed graphs and network visualizations for 
                            exploring relationships and connections.
                          </p>
                          <a
                            href="/explore"
                            className="btn btn-sm btn-primary"
                          >
                            Browse Examples
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="example-card">
                        <div className="example-content">
                          <h3>Creative Art</h3>
                          <p>
                            Generative art, creative coding, and artistic 
                            visualizations that push the boundaries of data viz.
                          </p>
                          <a
                            href="/explore"
                            className="btn btn-sm btn-primary"
                          >
                            Browse Examples
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-5">
                  <h2 className="h3 mb-3">Getting Started with Examples</h2>
                  <ol className="documentation-steps">
                    <li>
                      <h4>Browse the Gallery</h4>
                      <p>
                        Visit the <a href="/explore">Explore page</a> to see featured 
                        and trending visualizations from the community.
                      </p>
                    </li>
                    <li>
                      <h4>View Source Code</h4>
                      <p>
                        Click on any visualization to see the live output and browse 
                        the complete source code.
                      </p>
                    </li>
                    <li>
                      <h4>Fork and Modify</h4>
                      <p>
                        Found something interesting? Click "Fork" to create your own 
                        copy that you can modify and learn from.
                      </p>
                    </li>
                    <li>
                      <h4>Learn and Experiment</h4>
                      <p>
                        Change colors, data, or interactions to understand how the 
                        visualization works and make it your own.
                      </p>
                    </li>
                  </ol>
                </section>

                <div className="text-center">
                  <a
                    href="/explore"
                    className="btn btn-outline-primary btn-lg"
                  >
                    Explore All Visualizations
                  </a>
                </div>
              </div>
            )}

            {activeSection === 'tutorials' && (
              <div>
                <h1 className="mb-4">Tutorials</h1>
                <p className="lead">
                  Step-by-step tutorials to help you learn how to create 
                  visualizations with VizHub, from basic concepts to advanced 
                  techniques.
                </p>

                <div className="tutorial-list">
                  <div className="tutorial-item">
                    <div className="tutorial-number">
                      01
                    </div>
                    <div className="tutorial-content">
                      <h3>
                        Your First Visualization
                      </h3>
                      <p>
                        Learn the VizHub workflow by creating a simple bar chart. 
                        This tutorial covers the basics: signing up, forking, editing, 
                        and publishing your first viz.
                      </p>
                      <a
                        href="/explore"
                        className="tutorial-link"
                      >
                        Start with Examples{' '}
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>

                  <div className="tutorial-item">
                    <div className="tutorial-number">
                      02
                    </div>
                    <div className="tutorial-content">
                      <h3>Using the AI Assistant</h3>
                      <p>
                        Discover how to leverage VizHub's AI features to write code, 
                        debug issues, and learn new visualization techniques faster.
                      </p>
                      <a
                        href="/docs"
                        className="tutorial-link"
                      >
                        Learn AI Features{' '}
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
                        Learn how to load, clean, and transform data for your 
                        visualizations. Covers CSV, JSON, and API data sources.
                      </p>
                      <a
                        href="/explore"
                        className="tutorial-link"
                      >
                        Browse Data Examples{' '}
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
                        Adding Interactivity
                      </h3>
                      <p>
                        Make your visualizations come alive with tooltips, 
                        animations, and user interactions using D3.js event handling.
                      </p>
                      <a
                        href="/explore"
                        className="tutorial-link"
                      >
                        See Interactive Examples{' '}
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>

                  <div className="tutorial-item">
                    <div className="tutorial-number">
                      05
                    </div>
                    <div className="tutorial-content">
                      <h3>
                        Responsive Design
                      </h3>
                      <p>
                        Create visualizations that work well on different screen 
                        sizes and devices. Learn about SVG scaling and responsive layouts.
                      </p>
                      <a
                        href="/explore"
                        className="tutorial-link"
                      >
                        View Responsive Examples{' '}
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>

                  <div className="tutorial-item">
                    <div className="tutorial-number">
                      06
                    </div>
                    <div className="tutorial-content">
                      <h3>
                        Sharing and Embedding
                      </h3>
                      <p>
                        Learn how to share your visualizations with others and 
                        embed them in websites, blogs, or presentations.
                      </p>
                      <a
                        href="#collaboration"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection('platform-features');
                        }}
                        className="tutorial-link"
                      >
                        Learn About Sharing{' '}
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
                  Find answers to common questions about using VizHub 
                  for creating and sharing data visualizations.
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
                          VizHub is a platform for creating, sharing, and discovering 
                          data visualizations with AI assistance. It provides a complete 
                          development environment in your browser where you can code, 
                          preview, and publish visualizations using D3.js, Observable Plot, 
                          and other JavaScript libraries.
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
                          VizHub offers both free and premium plans. The free plan 
                          allows you to create public visualizations and use basic 
                          features. Premium plans offer private visualizations, 
                          enhanced AI features, and additional collaboration tools.
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
                        How do I get started?
                      </button>
                    </h2>
                    <div className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <p>
                          Simply sign up for an account and follow our quick start flow: 
                          login → search or explore visualizations → view one that interests 
                          you → fork it to create your own copy → edit the code → use AI 
                          assistance if needed. No installation required!
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
                        What libraries and frameworks are supported?
                      </button>
                    </h2>
                    <div className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <p>
                          VizHub supports D3.js, Observable Plot, and most JavaScript 
                          visualization libraries. You can also use vanilla HTML, CSS, 
                          and JavaScript. The platform includes built-in support for 
                          popular data formats like CSV and JSON.
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
                        How does the AI assistance work?
                      </button>
                    </h2>
                    <div className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <p>
                          VizHub's AI assistant can help you write code, debug issues, 
                          optimize performance, and learn new techniques. Simply describe 
                          what you want to create or ask for help with existing code, 
                          and the AI will provide suggestions and explanations.
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
                        Can I embed visualizations in my website?
                      </button>
                    </h2>
                    <div className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <p>
                          Yes! Once you've published a visualization, you can embed it 
                          in your website using an iframe. Click the "Embed" or "Share" 
                          button on your visualization page to get the embed code.
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
                        What's the difference between forking and copying?
                      </button>
                    </h2>
                    <div className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <p>
                          Forking creates your own copy of a visualization that you can 
                          modify independently. The original visualization remains unchanged, 
                          and there's a connection showing that your version was forked 
                          from the original. This helps maintain attribution and allows 
                          others to discover related work.
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
                        How do I share my visualizations?
                      </button>
                    </h2>
                    <div className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <p>
                          Public visualizations are automatically shareable via direct links. 
                          You can also embed them in websites, share on social media, or 
                          showcase them in your VizHub profile. Use your profile page to 
                          organize and showcase your best work.
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
