import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav } from '../../components/bootstrap';
import './styles.css';

export const Webinar = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Webinar data
  const webinars = [
    {
      id: 'data-viz-principles',
      title: 'Data Visualization Principles for Effective Communication',
      date: 'July 25, 2025',
      time: '11:00 AM - 12:30 PM EDT',
      presenter: 'Dr. Sarah Johnson',
      presenterTitle: 'Data Visualization Researcher, Stanford University',
      thumbnail: 'https://via.placeholder.com/800x450?text=Data+Viz+Principles',
      description: 'Learn the fundamental principles of effective data visualization that will help you communicate your insights clearly and accurately.',
      category: 'fundamentals',
      registrationLink: 'https://zoom.us/webinar/register/WN_example1',
      upcoming: true
    },
    {
      id: 'interactive-d3',
      title: 'Building Interactive Visualizations with D3.js',
      date: 'August 8, 2025',
      time: '2:00 PM - 3:30 PM EDT',
      presenter: 'Michael Chen',
      presenterTitle: 'Senior Data Visualization Engineer, Dataviz Inc.',
      thumbnail: 'https://via.placeholder.com/800x450?text=Interactive+D3',
      description: 'Dive into creating interactive data visualizations using D3.js. This hands-on webinar will cover selections, transitions, and user interactions.',
      category: 'technical',
      registrationLink: 'https://zoom.us/webinar/register/WN_example2',
      upcoming: true
    },
    {
      id: 'storytelling-with-data',
      title: 'Storytelling with Data: Crafting Compelling Narratives',
      date: 'August 22, 2025',
      time: '1:00 PM - 2:30 PM EDT',
      presenter: 'Alex Rivera',
      presenterTitle: 'Data Journalist, The Visualization Post',
      thumbnail: 'https://via.placeholder.com/800x450?text=Data+Storytelling',
      description: 'Learn how to transform your data into compelling stories that engage and inform your audience.',
      category: 'storytelling',
      registrationLink: 'https://zoom.us/webinar/register/WN_example3',
      upcoming: true
    },
    {
      id: 'responsive-viz',
      title: 'Creating Responsive Visualizations for All Devices',
      date: 'September 5, 2025',
      time: '10:00 AM - 11:30 AM EDT',
      presenter: 'Jamie Taylor',
      presenterTitle: 'UX Designer & Data Visualization Specialist',
      thumbnail: 'https://via.placeholder.com/800x450?text=Responsive+Viz',
      description: 'Discover techniques for building visualizations that work beautifully across all device sizes, from mobile phones to large desktop displays.',
      category: 'technical',
      registrationLink: 'https://zoom.us/webinar/register/WN_example4',
      upcoming: true
    },
    {
      id: 'geospatial-viz',
      title: 'Geospatial Data Visualization Techniques',
      date: 'June 10, 2025',
      time: '1:00 PM - 2:30 PM EDT',
      presenter: 'Dr. Carlos Mendez',
      presenterTitle: 'GIS Specialist & Data Scientist',
      thumbnail: 'https://via.placeholder.com/800x450?text=Geospatial+Viz',
      description: 'Explore techniques for visualizing geographic data using modern web technologies and libraries.',
      category: 'technical',
      registrationLink: null,
      recordingLink: 'https://www.youtube.com/watch?v=example1',
      upcoming: false
    },
    {
      id: 'data-ethics',
      title: 'Ethics in Data Visualization: Representing Data Honestly',
      date: 'May 15, 2025',
      time: '11:00 AM - 12:30 PM EDT',
      presenter: 'Priya Patel',
      presenterTitle: 'Data Ethics Researcher & Consultant',
      thumbnail: 'https://via.placeholder.com/800x450?text=Data+Ethics',
      description: 'An exploration of ethical considerations in data visualization and how to ensure your visualizations accurately represent the underlying data.',
      category: 'fundamentals',
      registrationLink: null,
      recordingLink: 'https://www.youtube.com/watch?v=example2',
      upcoming: false
    },
    {
      id: 'animation-motion',
      title: 'Using Animation and Motion in Data Visualization',
      date: 'April 20, 2025',
      time: '2:00 PM - 3:30 PM EDT',
      presenter: 'Thomas Wilson',
      presenterTitle: 'Motion Designer & Data Visualization Artist',
      thumbnail: 'https://via.placeholder.com/800x450?text=Animation+Motion',
      description: 'Learn how to effectively use animation and motion to enhance understanding and engagement in your data visualizations.',
      category: 'design',
      registrationLink: null,
      recordingLink: 'https://www.youtube.com/watch?v=example3',
      upcoming: false
    },
    {
      id: 'color-theory',
      title: 'Color Theory for Data Visualization',
      date: 'March 8, 2025',
      time: '1:00 PM - 2:30 PM EST',
      presenter: 'Emma Rodriguez',
      presenterTitle: 'Color Specialist & Data Visualization Designer',
      thumbnail: 'https://via.placeholder.com/800x450?text=Color+Theory',
      description: 'Explore the principles of color theory and how to apply them effectively in your data visualizations for better communication and accessibility.',
      category: 'design',
      registrationLink: null,
      recordingLink: 'https://www.youtube.com/watch?v=example4',
      upcoming: false
    }
  ];

  // Filter webinars based on active category
  const filteredWebinars = activeCategory === 'all' 
    ? webinars 
    : webinars.filter(webinar => webinar.category === activeCategory);

  // Separate upcoming and past webinars
  const upcomingWebinars = filteredWebinars.filter(webinar => webinar.upcoming);
  const pastWebinars = filteredWebinars.filter(webinar => !webinar.upcoming);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Webinars' },
    { id: 'fundamentals', name: 'Fundamentals' },
    { id: 'technical', name: 'Technical' },
    { id: 'design', name: 'Design' },
    { id: 'storytelling', name: 'Storytelling' }
  ];

  return (
    <Container className="webinar-container py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="display-4 text-center mb-4">VizHub Webinars</h1>
          <p className="lead text-center">
            Join our live webinars to learn from experts in data visualization or watch recordings of past sessions
          </p>
        </Col>
      </Row>

      {/* Category Filter */}
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <Nav className="webinar-filter">
            {categories.map(category => (
              <Nav.Item key={category.id}>
                <Nav.Link 
                  className={activeCategory === category.id ? 'active' : ''}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
      </Row>

      {/* Upcoming Webinars Section */}
      {upcomingWebinars.length > 0 && (
        <>
          <Row className="mb-4">
            <Col>
              <h2 className="section-title">Upcoming Webinars</h2>
            </Col>
          </Row>

          {/* Featured upcoming webinar */}
          {upcomingWebinars.length > 0 && (
            <Row className="mb-5">
              <Col>
                <Card className="featured-webinar">
                  <Row className="g-0">
                    <Col md={6}>
                      <div className="featured-webinar-img-container">
                        <img 
                          src={upcomingWebinars[0].thumbnail} 
                          alt={upcomingWebinars[0].title} 
                          className="featured-webinar-img"
                        />
                        <div className="webinar-category-badge">
                          {categories.find(cat => cat.id === upcomingWebinars[0].category)?.name}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <Card.Body className="d-flex flex-column h-100">
                        <div className="webinar-date mb-2">
                          <i className="bi bi-calendar-event me-2"></i>
                          {upcomingWebinars[0].date}
                        </div>
                        <div className="webinar-time mb-3">
                          <i className="bi bi-clock me-2"></i>
                          {upcomingWebinars[0].time}
                        </div>
                        <Card.Title as="h3" className="mb-3">{upcomingWebinars[0].title}</Card.Title>
                        <Card.Text className="mb-3">{upcomingWebinars[0].description}</Card.Text>
                        <div className="presenter-info mb-4">
                          <div className="d-flex align-items-center">
                            <div className="presenter-avatar me-3">
                              <img 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(upcomingWebinars[0].presenter)}&background=random`} 
                                alt={upcomingWebinars[0].presenter}
                                className="rounded-circle"
                                width="50"
                                height="50"
                              />
                            </div>
                            <div>
                              <h5 className="mb-0">{upcomingWebinars[0].presenter}</h5>
                              <p className="text-muted mb-0">{upcomingWebinars[0].presenterTitle}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <Button 
                            variant="primary" 
                            size="lg" 
                            href={upcomingWebinars[0].registrationLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-100"
                          >
                            Register Now
                          </Button>
                          <p className="text-center mt-2 mb-0">
                            <small className="text-muted">Free for all VizHub users</small>
                          </p>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          )}

          {/* Other upcoming webinars */}
          {upcomingWebinars.length > 1 && (
            <Row className="mb-5">
              {upcomingWebinars.slice(1).map(webinar => (
                <Col md={6} lg={4} className="mb-4" key={webinar.id}>
                  <Card className="webinar-card h-100">
                    <div className="webinar-card-img-container">
                      <img 
                        src={webinar.thumbnail} 
                        alt={webinar.title} 
                        className="webinar-card-img"
                      />
                      <div className="webinar-category-badge">
                        {categories.find(cat => cat.id === webinar.category)?.name}
                      </div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="webinar-date mb-2">
                        <i className="bi bi-calendar-event me-2"></i>
                        {webinar.date}
                      </div>
                      <div className="webinar-time mb-3">
                        <i className="bi bi-clock me-2"></i>
                        {webinar.time}
                      </div>
                      <Card.Title as="h4" className="mb-3">{webinar.title}</Card.Title>
                      <Card.Text className="text-truncate-3 mb-3">{webinar.description}</Card.Text>
                      <div className="presenter-info mb-3">
                        <div className="d-flex align-items-center">
                          <div className="presenter-avatar me-2">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(webinar.presenter)}&background=random`} 
                              alt={webinar.presenter}
                              className="rounded-circle"
                              width="30"
                              height="30"
                            />
                          </div>
                          <div>
                            <p className="mb-0 small">{webinar.presenter}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <Button 
                          variant="outline-primary" 
                          href={webinar.registrationLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-100"
                        >
                          Register
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {/* Past Webinars Section */}
      {pastWebinars.length > 0 && (
        <>
          <Row className="mb-4 mt-5">
            <Col>
              <h2 className="section-title">Past Webinars</h2>
              <p className="text-muted">Watch recordings of our previous webinars</p>
            </Col>
          </Row>

          <Row>
            {pastWebinars.map(webinar => (
              <Col md={6} lg={3} className="mb-4" key={webinar.id}>
                <Card className="past-webinar-card h-100">
                  <div className="past-webinar-img-container">
                    <img 
                      src={webinar.thumbnail} 
                      alt={webinar.title} 
                      className="past-webinar-img"
                    />
                    <div className="webinar-category-badge">
                      {categories.find(cat => cat.id === webinar.category)?.name}
                    </div>
                    <div className="play-button-overlay">
                      <i className="bi bi-play-circle-fill"></i>
                    </div>
                  </div>
                  <Card.Body>
                    <div className="webinar-date mb-2 small">
                      <i className="bi bi-calendar-event me-1"></i>
                      {webinar.date}
                    </div>
                    <Card.Title as="h5" className="mb-2">{webinar.title}</Card.Title>
                    <p className="presenter-name small mb-3">
                      <i className="bi bi-person me-1"></i>
                      {webinar.presenter}
                    </p>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      href={webinar.recordingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-100"
                    >
                      Watch Recording
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Newsletter Signup */}
      <Row className="mt-5">
        <Col lg={8} className="mx-auto">
          <Card className="newsletter-card text-center p-4">
            <Card.Body>
              <h3 className="mb-3">Stay Updated on Future Webinars</h3>
              <p className="mb-4">Subscribe to our newsletter to get notified about upcoming webinars and events.</p>
              <Row className="justify-content-center">
                <Col md={8}>
                  <div className="input-group mb-3">
                    <input type="email" className="form-control" placeholder="Your email address" />
                    <Button variant="primary">Subscribe</Button>
                  </div>
                </Col>
              </Row>
              <small className="text-muted">We respect your privacy. Unsubscribe at any time.</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
