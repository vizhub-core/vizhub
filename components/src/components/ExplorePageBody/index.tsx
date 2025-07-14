import { SortControl } from '../SortControl';
import { VizPreviewCollection } from '../VizPreviewCollection';
import { More } from '../More';
import { Footer } from '../Footer';
import { CreateNewButton } from '../CreateNewButton';
import './styles.scss';
import { discordLink } from '../discordLink';
import { useState } from 'react';

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
  const [aiPrompt, setAiPrompt] = useState('');

  const handleCreateWithAI = () => {
    if (aiPrompt.trim()) {
      // Navigate to create new viz with the AI prompt
      window.location.href = `/create?prompt=${encodeURIComponent(aiPrompt.trim())}`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateWithAI();
    }
  };
  return (
    <div className="vh-page vh-explore-page">
      <div
        className="hero-section ai-hero"
        id="ai-hero-section"
      >
        <div className="particles-background"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="badge-container">
              <span className="new-feature-badge">New</span>
            </div>
            <h1>
              Visualize Data with{' '}
              <span className="ai-highlight">
                Generative AI Power
              </span>
            </h1>
            <p>
              Transform your ideas into interactive
              visualizations using simple natural language
              prompts. VizHub's "Edit with AI" feature edits
              your code instantly using the latest LLMs.
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <i className="bi bi-lightning-fill"></i>
                <span>Rapid prototyping & scaffolding</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-arrow-repeat"></i>
                <span>
                  Incremental iteration & refactoring
                </span>
              </div>
              <div className="feature-item">
                <i className="bi bi-database"></i>
                <span>
                  Data parsing & processing automation
                </span>
              </div>
            </div>
            <div className="hero-buttons">
              <a
                href="/features"
                className="btn btn-outline-light btn-lg"
              >
                <i className="bi bi-info-circle me-2"></i>
                Learn More
              </a>
              <CreateNewButton />
            </div>
          </div>
        </div>
        <div className="hero-video">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/wd6BnelMO9g?si=aJz_9SRg4vKt-pdN"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className="ai-create-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="ai-prompt-card">
                <h3 className="text-center mb-3">
                  <i className="bi bi-magic me-2"></i>
                  Create with AI
                </h3>
                <p className="text-center text-muted mb-4">
                  Describe what you want to visualize and let AI create it for you
                </p>
                <div className="input-group input-group-lg">
                  <input
                    type="text"
                    className="form-control ai-prompt-input"
                    placeholder="Describe what you want to visualize... (e.g., 'Create a bar chart of sales data by region')"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleCreateWithAI}
                    disabled={!aiPrompt.trim()}
                  >
                    <i className="bi bi-magic me-2"></i>
                    Create with AI
                  </button>
                </div>
              </div>
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
