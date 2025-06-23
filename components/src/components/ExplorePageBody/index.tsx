import { SortControl } from '../SortControl';
import { VizPreviewCollection } from '../VizPreviewCollection';
import { More } from '../More';
import { Footer } from '../Footer';
import { CreateNewButton } from '../CreateNewButton';
import './styles.scss';
import { discordLink } from '../discordLink';

const enableOfficeHoursLink = false;

export const ExplorePageBody = ({
  // Viz preview list props.
  renderVizPreviews,
  onMoreClick,
  isLoadingNextPage,

  // Sort control props.
  sortId,
  setSortId,
  sortOptions,
  hasMore,
  children = null,
}) => {
  return (
    <div className="vh-page vh-explore-page">
      <div className="hero-section ai-hero" id="ai-hero-section">
        <div className="particles-background"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="badge-container">
              <span className="new-feature-badge">New</span>
            </div>
            <h1>Visualize Data with <span className="ai-highlight">AI Power</span></h1>
            <p>Transform your ideas into interactive visualizations using simple natural language prompts. VizHub AI analyzes your data, suggests optimal chart types, and generates D3.js code instantly.</p>
            <div className="feature-list">
              <div className="feature-item">
                <i className="bi bi-lightning-fill"></i>
                <span>Generate code in seconds</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-graph-up"></i>
                <span>Smart data analysis</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-brush"></i>
                <span>Customizable designs</span>
              </div>
            </div>
            <div className="hero-buttons">
              <CreateNewButton className="hero-create-button" buttonText="Create with AI" icon="bi-magic">
                <span className="button-content">
                  <i className="bi bi-magic me-2"></i>
                  Create with AI
                </span>
              </CreateNewButton>
              <a href="#ai-hero-section" className="btn btn-outline-light">
                <i className="bi bi-info-circle me-2"></i>
                Learn More
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="ai-illustration">
              <div className="code-window">
                <div className="code-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="code-header">
                  <span className="code-title">AI Visualization Generator</span>
                </div>
                <div className="code-content">
                  <div className="prompt-line">
                    <span className="prompt-symbol">&gt;</span>
                    <span className="prompt-text">Create a bar chart showing sales by region</span>
                  </div>
                  <div className="response-line">Analyzing data structure...</div>
                  <div className="response-line">Identifying optimal visualization...</div>
                  <div className="response-line success">✓ Generated D3.js bar chart with 5 regions</div>
                  <div className="typing-effect">Applying custom color scheme...</div>
                </div>
              </div>
              <div className="floating-chart"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="vh-page-container">
        {enableOfficeHoursLink && (
          <div
            className="alert alert-primary d-flex align-items-center justify-content-between p-3 mb-4"
            role="alert"
          >
            <div>
              <span className="fw-bold">
                📅 Join VizHub Office Hours!
              </span>{' '}
              Live in{' '}
              <a
                href={discordLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>{' '}
              Saturdays 1pm Eastern.
            </div>

            <div className="d-flex">
              <a
                href="https://www.youtube.com/watch?v=xgVD8EYlVkI&list=PLt6yKRJektF0Mk1Mq-bnmJuY2kVtLGovk"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm fw-bold ms-2 me-2"
              >
                <i className="bi bi-youtube me-1"></i>
                Previous Office Hours Videos
              </a>
            </div>
          </div>
        )}
        {children}
        <div className="vh-page-header">
          <h2 className="mb-0">Explore</h2>
          <div className="explore-header-controls">
            {sortOptions ? (
              <SortControl
                sortId={sortId}
                setSortId={setSortId}
                sortOptions={sortOptions}
              />
            ) : null}
            <CreateNewButton />
          </div>
        </div>
        <VizPreviewCollection>
          {renderVizPreviews()}
        </VizPreviewCollection>
        <More
          hasMore={hasMore}
          onMoreClick={onMoreClick}
          isLoadingNextPage={isLoadingNextPage}
        />
      </div>
      <Footer />
    </div>
  );
};
