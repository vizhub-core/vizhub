import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
} from '../../components/bootstrap';
import './styles.css';

export const Blog = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with D3.js Visualizations',
      excerpt:
        'Learn the basics of creating interactive data visualizations with D3.js, the powerful JavaScript library for manipulating documents based on data.',
      author: 'Sarah Johnson',
      date: 'July 10, 2025',
      imageUrl:
        'https://via.placeholder.com/800x400?text=D3.js+Visualization',
      category: 'Tutorials',
    },
    {
      id: 2,
      title:
        'Best Practices for Color in Data Visualization',
      excerpt:
        'Explore how to effectively use color in your data visualizations to enhance understanding and accessibility without sacrificing aesthetics.',
      author: 'Michael Chen',
      date: 'July 5, 2025',
      imageUrl:
        'https://via.placeholder.com/800x400?text=Color+in+Visualization',
      category: 'Design',
    },
    {
      id: 3,
      title: "Introducing VizHub's New Features",
      excerpt:
        "Check out the latest features and improvements we've added to VizHub to make your data visualization workflow even smoother.",
      author: 'Alex Rivera',
      date: 'June 28, 2025',
      imageUrl:
        'https://via.placeholder.com/800x400?text=New+Features',
      category: 'Announcements',
    },
    {
      id: 4,
      title: 'Creating Responsive Visualizations',
      excerpt:
        'Learn techniques for building visualizations that work beautifully across all device sizes, from mobile phones to large desktop displays.',
      author: 'Jamie Taylor',
      date: 'June 20, 2025',
      imageUrl:
        'https://via.placeholder.com/800x400?text=Responsive+Visualizations',
      category: 'Tutorials',
    },
    {
      id: 5,
      title:
        'Data Visualization Ethics: Representing Data Honestly',
      excerpt:
        'An exploration of ethical considerations in data visualization and how to ensure your visualizations accurately represent the underlying data.',
      author: 'Priya Patel',
      date: 'June 15, 2025',
      imageUrl:
        'https://via.placeholder.com/800x400?text=Visualization+Ethics',
      category: 'Best Practices',
    },
    {
      id: 6,
      title:
        'Community Spotlight: Outstanding Visualizations',
      excerpt:
        'Highlighting exceptional visualizations created by members of the VizHub community, with insights into their creative process.',
      author: 'Carlos Mendez',
      date: 'June 8, 2025',
      imageUrl:
        'https://via.placeholder.com/800x400?text=Community+Spotlight',
      category: 'Community',
    },
  ];

  // Categories for the filter
  const categories = [
    'All',
    'Tutorials',
    'Design',
    'Announcements',
    'Best Practices',
    'Community',
  ];

  return (
    <Container className="blog-container py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="display-4 text-center mb-4">
            VizHub Blog
          </h1>
          <p className="lead text-center">
            Insights, tutorials, and news from the data
            visualization community
          </p>
        </Col>
      </Row>

      {/* Category Filter */}
      <Row className="mb-4">
        <Col className="d-flex justify-content-center flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              className={`btn ${category === 'All' ? 'btn-primary' : 'btn-outline-primary'} m-1`}
            >
              {category}
            </button>
          ))}
        </Col>
      </Row>

      {/* Featured Post */}
      <Row className="mb-5">
        <Col>
          <Card className="featured-post border-0 shadow">
            <Row className="g-0">
              <Col md={6}>
                <Card.Img
                  src={blogPosts[0].imageUrl}
                  alt={blogPosts[0].title}
                  className="featured-image h-100 object-fit-cover"
                />
              </Col>
              <Col md={6}>
                <Card.Body className="d-flex flex-column h-100 p-4">
                  <div className="mb-2">
                    <span className="badge bg-primary">
                      {blogPosts[0].category}
                    </span>
                    <small className="text-muted ms-2">
                      {blogPosts[0].date}
                    </small>
                  </div>
                  <Card.Title as="h2" className="mb-3">
                    {blogPosts[0].title}
                  </Card.Title>
                  <Card.Text className="mb-4">
                    {blogPosts[0].excerpt}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar me-2">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(blogPosts[0].author)}&background=random`}
                          alt={blogPosts[0].author}
                          className="rounded-circle"
                          width="40"
                          height="40"
                        />
                      </div>
                      <span>{blogPosts[0].author}</span>
                    </div>
                    <button className="btn btn-primary">
                      Read More
                    </button>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Blog Posts Grid */}
      <Row>
        {blogPosts.slice(1).map((post) => (
          <Col lg={4} md={6} className="mb-4" key={post.id}>
            <Card className="blog-card h-100 border-0 shadow-sm">
              <div className="blog-card-img-container">
                <Card.Img
                  variant="top"
                  src={post.imageUrl}
                  alt={post.title}
                  className="blog-card-img"
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <div className="mb-2">
                  <span className="badge bg-primary">
                    {post.category}
                  </span>
                  <small className="text-muted ms-2">
                    {post.date}
                  </small>
                </div>
                <Card.Title as="h3">
                  {post.title}
                </Card.Title>
                <Card.Text className="text-truncate-3">
                  {post.excerpt}
                </Card.Text>
                <div className="mt-auto pt-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="avatar me-2">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`}
                          alt={post.author}
                          className="rounded-circle"
                          width="30"
                          height="30"
                        />
                      </div>
                      <small>{post.author}</small>
                    </div>
                    <button className="btn btn-sm btn-outline-primary">
                      Read
                    </button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Newsletter Signup */}
      <Row className="mt-5">
        <Col lg={8} className="mx-auto">
          <Card className="newsletter-card border-0 shadow text-center p-4">
            <Card.Body>
              <h3 className="mb-3">
                Subscribe to Our Newsletter
              </h3>
              <p className="mb-4">
                Get the latest articles, tutorials, and
                updates delivered to your inbox.
              </p>
              <Row className="justify-content-center">
                <Col md={8}>
                  <div className="input-group mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your email address"
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                    >
                      Subscribe
                    </button>
                  </div>
                </Col>
              </Row>
              <small className="text-muted">
                We respect your privacy. Unsubscribe at any
                time.
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
