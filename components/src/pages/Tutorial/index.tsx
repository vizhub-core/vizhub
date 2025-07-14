import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Button } from '../../components/bootstrap';
import './styles.css';

export const Tutorial = () => {
  // Define tutorials first

  const [activeKey, setActiveKey] = useState('getting-started');
  const [activeSectionId, setActiveSectionId] = useState(tutorials[0].sections[0].id);

  // Video tutorials from Curran Kelleher's YouTube channel
  const videoTutorials = [
    {
      id: 'intro-to-d3',
      title: 'Introduction to D3.js',
      thumbnail: 'https://i.ytimg.com/vi/8jvoTV54nXw/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=8jvoTV54nXw',
      duration: '1:15:42',
      description: 'Learn the fundamentals of D3.js, a powerful JavaScript library for creating data visualizations on the web.'
    },
    {
      id: 'data-visualization-fundamentals',
      title: 'Data Visualization Fundamentals',
      thumbnail: 'https://i.ytimg.com/vi/50Kd9OvQkW4/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=50Kd9OvQkW4',
      duration: '58:27',
      description: 'Understand the core principles of effective data visualization and how to apply them in your projects.'
    },
    {
      id: 'responsive-visualizations',
      title: 'Creating Responsive Visualizations',
      thumbnail: 'https://i.ytimg.com/vi/D-QdPiRJmgY/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=D-QdPiRJmgY',
      duration: '45:18',
      description: 'Learn techniques for building visualizations that work beautifully across all device sizes.'
    },
    {
      id: 'interactive-maps',
      title: 'Interactive Maps with D3',
      thumbnail: 'https://i.ytimg.com/vi/aNbgrqRuoiE/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=aNbgrqRuoiE',
      duration: '1:02:35',
      description: 'Create interactive geographic visualizations using D3.js and GeoJSON data.'
    },
    {
      id: 'data-joins',
      title: 'Understanding D3 Data Joins',
      thumbnail: 'https://i.ytimg.com/vi/ZOeWdkq-L90/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=ZOeWdkq-L90',
      duration: '37:56',
      description: 'Master the powerful data join pattern in D3.js for binding data to DOM elements.'
    },
    {
      id: 'scales-axes',
      title: 'Scales and Axes in D3',
      thumbnail: 'https://i.ytimg.com/vi/iMYkVLWc3y0/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=iMYkVLWc3y0',
      duration: '49:12',
      description: 'Learn how to use D3 scales and axes to create properly scaled visualizations with clear reference marks.'
    }
  ];

  const tutorials = [
    {
      id: 'getting-started',
      title: 'Getting Started with VizHub',
      sections: [
        {
          id: 'intro',
          title: 'Introduction to VizHub',
          content: (
            <>
              <p>Welcome to VizHub! This tutorial will guide you through the basics of creating data visualizations on our platform.</p>
              <p>VizHub is a platform designed for data visualization creators. It provides an integrated development environment where you can code, preview, and publish your visualizations all in one place.</p>
              <div className="tutorial-image-container">
                <img 
                  src="https://via.placeholder.com/800x450?text=VizHub+Interface" 
                  alt="VizHub Interface" 
                  className="tutorial-image"
                />
              </div>
              <p>By the end of this tutorial, you'll be able to:</p>
              <ul>
                <li>Create a new visualization project</li>
                <li>Use the VizHub editor</li>
                <li>Preview your visualization</li>
                <li>Save and publish your work</li>
              </ul>
            </>
          )
        },
        {
          id: 'create-project',
          title: 'Creating Your First Project',
          content: (
            <>
              <p>Let's start by creating your first visualization project:</p>
              <ol>
                <li>Click the <strong>+</strong> button in the navigation bar</li>
                <li>Choose a template or start from scratch</li>
                <li>Give your project a name</li>
              </ol>
              <div className="tutorial-image-container">
                <img 
                  src="https://via.placeholder.com/800x450?text=Create+New+Project" 
                  alt="Creating a new project" 
                  className="tutorial-image"
                />
              </div>
              <p>Once created, you'll be taken to the VizHub editor where you can start coding your visualization.</p>
            </>
          )
        },
        {
          id: 'editor-basics',
          title: 'Editor Basics',
          content: (
            <>
              <p>The VizHub editor is divided into several panels:</p>
              <ul>
                <li><strong>Code Editor</strong> - Where you write your HTML, CSS, and JavaScript</li>
                <li><strong>Preview Panel</strong> - Shows a live preview of your visualization</li>
                <li><strong>Files Panel</strong> - Lists all files in your project</li>
                <li><strong>Console</strong> - Displays any errors or console output</li>
              </ul>
              <div className="tutorial-image-container">
                <img 
                  src="https://via.placeholder.com/800x450?text=Editor+Interface" 
                  alt="Editor interface" 
                  className="tutorial-image"
                />
              </div>
              <p>You can resize these panels by dragging the dividers between them.</p>
            </>
          )
        },
        {
          id: 'save-publish',
          title: 'Saving and Publishing',
          content: (
            <>
              <p>VizHub automatically saves your work as you type, but you'll need to publish your visualization to make it publicly accessible:</p>
              <ol>
                <li>Click the <strong>Publish</strong> button in the top-right corner</li>
                <li>Add a description of your visualization</li>
                <li>Choose whether to make it public or private</li>
                <li>Click <strong>Publish</strong> to finalize</li>
              </ol>
              <div className="tutorial-image-container">
                <img 
                  src="https://via.placeholder.com/800x450?text=Publishing+Interface" 
                  alt="Publishing interface" 
                  className="tutorial-image"
                />
              </div>
              <p>Once published, you'll get a unique URL that you can share with others.</p>
            </>
          )
        }
      ]
    },
    {
      id: 'd3-basics',
      title: 'D3.js Basics',
      sections: [
        {
          id: 'd3-intro',
          title: 'Introduction to D3.js',
          content: (
            <>
              <p>D3.js (Data-Driven Documents) is a powerful JavaScript library for creating dynamic, interactive data visualizations in web browsers.</p>
              <p>It uses HTML, SVG, and CSS to bring data to life, allowing you to bind arbitrary data to a Document Object Model (DOM) and then apply data-driven transformations.</p>
              <div className="tutorial-image-container">
                <img 
                  src="https://via.placeholder.com/800x450?text=D3.js+Example" 
                  alt="D3.js example visualization" 
                  className="tutorial-image"
                />
              </div>
              <p>D3 helps you visualize data using web standards without tying yourself to a proprietary framework.</p>
            </>
          )
        },
        {
          id: 'd3-selections',
          title: 'Selections and Data Binding',
          content: (
            <>
              <p>One of D3's core concepts is <strong>selections</strong>. Selections allow you to select DOM elements and bind data to them:</p>
              <pre className="code-block">
{`// Select all paragraphs
const p = d3.selectAll("p");

// Select a specific element by ID
const chart = d3.select("#chart");

// Data binding
const circles = svg.selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle");`}
              </pre>
              <p>The <code>enter()</code> method is used to create new elements for data that doesn't have a corresponding DOM element yet.</p>
            </>
          )
        },
        {
          id: 'd3-scales',
          title: 'Scales and Axes',
          content: (
            <>
              <p>D3 scales are functions that map from an input domain to an output range:</p>
              <pre className="code-block">
{`// Linear scale
const xScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, d => d.x)])
  .range([0, width]);

// Time scale
const timeScale = d3.scaleTime()
  .domain([new Date(2020, 0, 1), new Date(2020, 11, 31)])
  .range([0, width]);

// Creating axes
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// Rendering axes
svg.append("g")
  .attr("transform", \`translate(0, \${height})\`)
  .call(xAxis);

svg.append("g")
  .call(yAxis);`}
              </pre>
              <p>Scales help you convert your data values into visual properties like position, size, or color.</p>
            </>
          )
        }
      ]
    },
    {
      id: 'advanced-viz',
      title: 'Advanced Visualizations',
      sections: [
        {
          id: 'interactive-viz',
          title: 'Adding Interactivity',
          content: (
            <>
              <p>Interactivity makes your visualizations more engaging and informative. D3 provides several ways to add interactivity:</p>
              <pre className="code-block">
{`// Add event listeners
circles.on("mouseover", function(event, d) {
  d3.select(this)
    .transition()
    .duration(200)
    .attr("r", 10)
    .attr("fill", "orange");
    
  // Show tooltip
  tooltip.transition()
    .duration(200)
    .style("opacity", .9);
    
  tooltip.html(\`Value: \${d.value}\`)
    .style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY - 28) + "px");
})
.on("mouseout", function() {
  d3.select(this)
    .transition()
    .duration(500)
    .attr("r", 5)
    .attr("fill", "steelblue");
    
  // Hide tooltip
  tooltip.transition()
    .duration(500)
    .style("opacity", 0);
});`}
              </pre>
              <p>Common interactive features include tooltips, zooming, panning, and filtering data.</p>
            </>
          )
        },
        {
          id: 'responsive-viz',
          title: 'Responsive Visualizations',
          content: (
            <>
              <p>Creating responsive visualizations ensures they look good on all devices:</p>
              <pre className="code-block">
{`// Set up responsive SVG
const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", \`0 0 \${width} \${height}\`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("width", "100%")
  .attr("height", "auto");

// Update on window resize
function resize() {
  // Get new width based on container
  const newWidth = container.node().getBoundingClientRect().width;
  
  // Update scales
  xScale.range([0, newWidth]);
  
  // Update elements...
}

// Listen for resize events
window.addEventListener("resize", resize);`}
              </pre>
              <p>Using SVG's <code>viewBox</code> attribute and CSS to control sizing helps create visualizations that adapt to different screen sizes.</p>
            </>
          )
        }
      ]
    }
  ];

  return (
    <Container className="tutorial-container py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="display-4 text-center mb-4">VizHub Tutorials</h1>
          <p className="lead text-center">
            Learn how to create powerful data visualizations with our step-by-step tutorials
          </p>
        </Col>
      </Row>

      {/* Video Tutorials Section */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">Video Tutorials</h2>
          <p className="text-center mb-5">
            Learn data visualization techniques with these video tutorials from <a href="https://www.youtube.com/@currankelleher" target="_blank" rel="noopener noreferrer">Curran Kelleher</a>
          </p>
        </Col>
      </Row>
      
      <Row className="mb-5">
        {videoTutorials.map(video => (
          <Col md={6} lg={4} className="mb-4" key={video.id}>
            <Card className="video-tutorial-card h-100 shadow-sm">
              <div className="video-thumbnail-container">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="video-thumbnail"
                />
                <div className="video-duration">{video.duration}</div>
                <div className="video-play-button">
                  <i className="bi bi-play-circle-fill"></i>
                </div>
              </div>
              <Card.Body>
                <Card.Title as="h5">{video.title}</Card.Title>
                <Card.Text className="text-truncate-2">{video.description}</Card.Text>
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary mt-2"
                >
                  Watch Tutorial
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-5">
        <Col className="text-center">
          <a 
            href="https://www.youtube.com/@currankelleher" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline-primary"
          >
            View More Videos <i className="bi bi-youtube ms-2"></i>
          </a>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">Written Tutorials</h2>
        </Col>
      </Row>

      <Row>
        <Col md={3} className="mb-4">
          <Card className="tutorial-sidebar">
            <Card.Header>
              <h5 className="mb-0">Tutorial Topics</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {tutorials.map(tutorial => (
                <div 
                  key={tutorial.id}
                  onClick={() => setActiveKey(tutorial.id)}
                  className={`tutorial-topic-item d-flex justify-content-between align-items-center ${activeKey === tutorial.id ? 'active' : ''}`}
                >
                  {tutorial.title}
                  <i className="bi bi-chevron-right"></i>
                </div>
              ))}
            </Card.Body>
            <Card.Footer>
              <Button variant="outline-primary" size="sm" className="w-100">
                <i className="bi bi-question-circle me-2"></i>
                Request a Tutorial
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={9}>
          <Card className="tutorial-content">
            <Card.Body>
              {tutorials.map(tutorial => (
                tutorial.id === activeKey && (
                  <div key={tutorial.id}>
                    <h2 className="mb-4">{tutorial.title}</h2>
                    
                    <div className="tutorial-tabs-container">
                      <Nav variant="tabs" className="mb-4 tutorial-tabs">
                        {tutorial.sections.map(section => (
                          <Nav.Item key={section.id}>
                            <Nav.Link 
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveSectionId(section.id);
                              }}
                              active={activeSectionId === section.id}
                              href={`#${section.id}`}
                            >
                              {section.title}
                            </Nav.Link>
                          </Nav.Item>
                        ))}
                      </Nav>
                      
                      <div className="tutorial-content-container">
                        {tutorial.sections.map(section => (
                          <div 
                            key={section.id} 
                            className={`tutorial-section ${activeSectionId === section.id ? 'd-block' : 'd-none'}`}
                          >
                            {section.content}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="tutorial-navigation mt-5 d-flex justify-content-between">
                      <Button variant="outline-secondary">
                        <i className="bi bi-arrow-left me-2"></i>
                        Previous
                      </Button>
                      <Button variant="primary">
                        Next
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Button>
                    </div>
                  </div>
                )
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
