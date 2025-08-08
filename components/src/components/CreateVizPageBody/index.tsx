import { Footer } from '../Footer';
import { useLanguage } from '../LanguageContext';
import './styles.scss';

export const CreateVizPageBody = ({
  // Viz preview list props.
  renderVizPreviews,
}) => {
  const { t } = useLanguage();

  const templateCategories = [
    {
      id: 'basic',
      title: 'Basic Charts',
      description: 'Start with fundamental visualization types',
      icon: 'bi-bar-chart-fill',
      templates: [
        {
          id: 'bar-chart',
          title: 'Bar Chart',
          description: 'Compare categories with rectangular bars',
          thumbnail: '/templates/bar-chart.png',
          difficulty: 'Beginner',
          tags: ['D3.js', 'SVG', 'Data']
        },
        {
          id: 'line-chart',
          title: 'Line Chart',
          description: 'Show trends over time with connected points',
          thumbnail: '/templates/line-chart.png',
          difficulty: 'Beginner',
          tags: ['D3.js', 'Time Series', 'Trends']
        },
        {
          id: 'scatter-plot',
          title: 'Scatter Plot',
          description: 'Explore relationships between two variables',
          thumbnail: '/templates/scatter-plot.png',
          difficulty: 'Beginner',
          tags: ['D3.js', 'Correlation', 'Analysis']
        },
        {
          id: 'pie-chart',
          title: 'Pie Chart',
          description: 'Display proportions of a whole',
          thumbnail: '/templates/pie-chart.png',
          difficulty: 'Beginner',
          tags: ['D3.js', 'Proportions', 'Circular']
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Visualizations',
      description: 'Complex charts for detailed analysis',
      icon: 'bi-graph-up-arrow',
      templates: [
        {
          id: 'heatmap',
          title: 'Heatmap',
          description: 'Visualize data density with color intensity',
          thumbnail: '/templates/heatmap.png',
          difficulty: 'Intermediate',
          tags: ['D3.js', 'Color Scale', 'Matrix']
        },
        {
          id: 'treemap',
          title: 'Treemap',
          description: 'Hierarchical data with nested rectangles',
          thumbnail: '/templates/treemap.png',
          difficulty: 'Intermediate',
          tags: ['D3.js', 'Hierarchy', 'Nested']
        },
        {
          id: 'network-graph',
          title: 'Network Graph',
          description: 'Visualize connections and relationships',
          thumbnail: '/templates/network-graph.png',
          difficulty: 'Advanced',
          tags: ['D3.js', 'Force Layout', 'Networks']
        },
        {
          id: 'sankey-diagram',
          title: 'Sankey Diagram',
          description: 'Flow visualization with proportional arrows',
          thumbnail: '/templates/sankey-diagram.png',
          difficulty: 'Advanced',
          tags: ['D3.js', 'Flow', 'Proportional']
        }
      ]
    },
    {
      id: 'geographic',
      title: 'Geographic Maps',
      description: 'Location-based data visualization',
      icon: 'bi-globe',
      templates: [
        {
          id: 'world-map',
          title: 'World Map',
          description: 'Global data visualization with country boundaries',
          thumbnail: '/templates/world-map.png',
          difficulty: 'Intermediate',
          tags: ['D3.js', 'GeoJSON', 'Choropleth']
        },
        {
          id: 'bubble-map',
          title: 'Bubble Map',
          description: 'Geographic data with proportional circles',
          thumbnail: '/templates/bubble-map.png',
          difficulty: 'Intermediate',
          tags: ['D3.js', 'Geographic', 'Proportional']
        }
      ]
    },
    {
      id: 'interactive',
      title: 'Interactive Charts',
      description: 'Engaging visualizations with user interaction',
      icon: 'bi-cursor-fill',
      templates: [
        {
          id: 'dashboard',
          title: 'Interactive Dashboard',
          description: 'Multi-chart dashboard with filters',
          thumbnail: '/templates/dashboard.png',
          difficulty: 'Advanced',
          tags: ['D3.js', 'Dashboard', 'Filters']
        },
        {
          id: 'animated-chart',
          title: 'Animated Chart',
          description: 'Time-based animation with smooth transitions',
          thumbnail: '/templates/animated-chart.png',
          difficulty: 'Advanced',
          tags: ['D3.js', 'Animation', 'Transitions']
        }
      ]
    }
  ];

  return (
    <div className="vh-page vh-create-viz-page">
      {/* Hero Section */}
      <div className="create-viz-hero">
        <div className="hero-particles"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <i className="bi bi-sparkles me-2"></i>
              New AI Features Available
            </div>
            <h1>
              Create <span className="gradient-text">Amazing</span> Visualizations
            </h1>
            <p className="hero-description">
              Transform your data into compelling stories with our AI-powered visualization platform. 
              Choose from professional templates or let AI build custom charts for you.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="bi bi-collection"></i>
                </div>
                <span className="stat-number">50+</span>
                <span className="stat-label">Professional Templates</span>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="bi bi-robot"></i>
                </div>
                <span className="stat-number">AI</span>
                <span className="stat-label">Powered Creation</span>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="bi bi-code-square"></i>
                </div>
                <span className="stat-number">D3.js</span>
                <span className="stat-label">Industry Standard</span>
              </div>
            </div>
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg hero-primary-btn">
                <i className="bi bi-magic me-2"></i>
                Start Creating Now
              </button>
              <button className="btn btn-outline-light btn-lg">
                <i className="bi bi-play-circle me-2"></i>
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="create-viz-content vh-page-container">
        {/* Quick Start Section */}
        <div className="quick-start-section">
          <div className="section-header">
            <h2>Choose Your Path</h2>
            <p>Three powerful ways to bring your data to life</p>
          </div>
          <div className="quick-start-options">
            <div className="quick-start-card primary">
              <div className="card-header">
                <div className="card-icon">
                  <i className="bi bi-magic"></i>
                </div>
                <div className="card-badge">Most Popular</div>
              </div>
              <h3>AI-Powered Creation</h3>
              <p>Simply describe your data and visualization goals. Our AI will generate the perfect chart for you in seconds.</p>
              <div className="card-features">
                <div className="feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Natural language input</span>
                </div>
                <div className="feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Smart chart recommendations</span>
                </div>
                <div className="feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Instant code generation</span>
                </div>
              </div>
              <button className="btn btn-primary btn-lg">
                <i className="bi bi-robot me-2"></i>
                Create with AI
              </button>
            </div>
            <div className="quick-start-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="bi bi-palette"></i>
                </div>
              </div>
              <h3>Template Gallery</h3>
              <p>Browse our curated collection of professional templates. Perfect for common visualization needs.</p>
              <div className="card-features">
                <div className="feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>50+ professional templates</span>
                </div>
                <div className="feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Fully customizable</span>
                </div>
                <div className="feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Best practices included</span>
                </div>
              </div>
              <button className="btn btn-outline-primary btn-lg">
                <i className="bi bi-grid-3x3-gap me-2"></i>
                Browse Templates
              </button>
            </div>
            <div className="quick-start-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="bi bi-code-slash"></i>
                </div>
              </div>
              <h3>Blank Canvas</h3>
              <p>Start from scratch with complete creative freedom. Perfect for experienced developers and unique projects.</p>
              <div className="card-features">
                <div className="feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Full D3.js environment</span>
                </div>
                <div className="feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Live code editor</span>
                </div>
                <div className="feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Unlimited customization</span>
                </div>
              </div>
              <button className="btn btn-outline-primary btn-lg">
                <i className="bi bi-plus-circle me-2"></i>
                Start Coding
              </button>
            </div>
          </div>
        </div>

        {/* Template Categories */}
        <div className="template-categories">
          <div className="section-header">
            <h2>Professional Templates</h2>
            <p>Hand-crafted visualizations ready for your data</p>
            <div className="template-filters">
              <button className="filter-btn active">All Templates</button>
              <button className="filter-btn">Beginner</button>
              <button className="filter-btn">Intermediate</button>
              <button className="filter-btn">Advanced</button>
            </div>
          </div>

          {templateCategories.map((category) => (
            <div key={category.id} className="template-category">
              <div className="category-header">
                <div className="category-title">
                  <div className="category-icon">
                    <i className={category.icon}></i>
                  </div>
                  <div>
                    <h3>{category.title}</h3>
                    <p className="category-description">{category.description}</p>
                  </div>
                </div>
                <div className="category-count">
                  {category.templates.length} templates
                </div>
              </div>
              
              <div className="template-grid">
                {category.templates.map((template) => (
                  <div key={template.id} className="template-card">
                    <div className="template-thumbnail">
                      <div className="template-placeholder">
                        <i className="bi bi-bar-chart-fill"></i>
                        <span>{template.title}</span>
                      </div>
                      <div className="template-overlay">
                        <button className="btn btn-primary btn-sm">
                          <i className="bi bi-play-fill me-1"></i>
                          Use Template
                        </button>
                        <button className="btn btn-outline-light btn-sm">
                          <i className="bi bi-eye me-1"></i>
                          Live Preview
                        </button>
                      </div>
                    </div>
                    <div className="template-info">
                      <div className="template-header">
                        <h4>{template.title}</h4>
                        <div className="template-actions">
                          <button className="action-btn" title="Add to favorites">
                            <i className="bi bi-heart"></i>
                          </button>
                          <button className="action-btn" title="Share template">
                            <i className="bi bi-share"></i>
                          </button>
                        </div>
                      </div>
                      <p>{template.description}</p>
                      <div className="template-meta">
                        <span className={`difficulty ${template.difficulty.toLowerCase()}`}>
                          <i className="bi bi-star-fill me-1"></i>
                          {template.difficulty}
                        </span>
                        <div className="template-tags">
                          {template.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                          {template.tags.length > 2 && (
                            <span className="tag more">+{template.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Visualizations */}
        <div className="recent-section">
          <div className="section-header">
            <h2>Continue Working</h2>
            <p>Pick up where you left off with your recent visualizations</p>
          </div>
          {renderVizPreviews()}
        </div>

        {/* Learning Resources */}
        <div className="learning-resources">
          <h2>Learning Resources</h2>
          <div className="resource-grid">
            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-book"></i>
              </div>
              <h3>Documentation</h3>
              <p>Comprehensive guides and API references</p>
              <a href="/docs" className="btn btn-outline-primary btn-sm">
                Read Docs
              </a>
            </div>
            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-play-circle"></i>
              </div>
              <h3>Video Tutorials</h3>
              <p>Step-by-step video guides for beginners</p>
              <a href="/tutorials" className="btn btn-outline-primary btn-sm">
                Watch Videos
              </a>
            </div>
            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-people"></i>
              </div>
              <h3>Community</h3>
              <p>Get help and share your work with others</p>
              <a href="/forum" className="btn btn-outline-primary btn-sm">
                Join Forum
              </a>
            </div>
            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-lightbulb"></i>
              </div>
              <h3>Examples</h3>
              <p>Explore inspiring visualizations from the community</p>
              <a href="/explore" className="btn btn-outline-primary btn-sm">
                Browse Examples
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
