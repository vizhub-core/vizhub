import { SortControl } from '../SortControl';
import { VizPreviewCollection } from '../VizPreviewCollection';
import { More } from '../More';
import { Footer } from '../Footer';
import { CreateNewButton } from '../CreateNewButton';
import { useLanguage } from '../LanguageContext';
import { discordLink } from '../links';
import './styles.scss';

const enableOfficeHoursLink = false;
const enableYouTubeEmbed = false;

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
  const { t } = useLanguage();

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
              <span className="new-feature-badge">
                {t('explore.hero.badge')}
              </span>
            </div>
            <h1>
              {t('explore.hero.title.before')}{' '}
              <span className="ai-highlight">
                {t('explore.hero.title.highlight')}
              </span>
            </h1>
            <p>{t('explore.hero.description')}</p>
            <div className="feature-list">
              <div className="feature-item">
                <i className="bi bi-lightning-fill"></i>
                <span>{t('explore.feature.instant')}</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-stars"></i>
                <span>{t('explore.feature.vizbot')}</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-database"></i>
                <span>{t('explore.feature.history')}</span>
              </div>
            </div>
            <div className="hero-buttons">
              <CreateNewButton />
              <a
                href="/features"
                className="hero-buttons-link btn btn-secondary"
              >
                <i className="bi bi-info-circle me-2"></i>
                {t('explore.button.learn-more')}
              </a>
            </div>
          </div>
          {enableYouTubeEmbed && (
            <div className="hero-video">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube-nocookie.com/embed/wd6BnelMO9g?si=aJz_9SRg4vKt-pdN&autoplay=1&mute=1&rel=0"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>
      
      <div className="showcase-section">
        <div className="showcase-container">
          <div className="showcase-header">
            <h2>Featured Visualizations</h2>
            <p>Discover what's possible with VizHub's AI-powered visualization tools</p>
          </div>
          
          <div className="featured-viz-embed">
            <iframe 
              src="https://vizhub.com/nitanagdeote/4ec01c35544d49f4b45b8b472e659f97?mode=embed" 
              title="World Choropleth Map"
              className="viz-iframe"
              allow="fullscreen"
            ></iframe>
            <div className="featured-viz-info">
              <h3>World Choropleth Map</h3>
              <p>Interactive visualization showing global data with color-coded regions and hover interactions</p>
              <div className="viz-tags">
                <span className="viz-tag">GeoJSON</span>
                <span className="viz-tag">D3.js</span>
                <span className="viz-tag">Choropleth</span>
              </div>
              <a href="https://vizhub.com/nitanagdeote/4ec01c35544d49f4b45b8b472e659f97" target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-3">
                Open in Editor
              </a>
            </div>
          </div>
          
          <h3 className="more-examples-heading">More Examples</h3>
          
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="showcase-preview">
                <div className="showcase-image" style={{backgroundColor: '#4a90e2'}}></div>
                <div className="showcase-overlay">
                  <a href="#" className="btn btn-light btn-sm">View Project</a>
                </div>
              </div>
              <div className="showcase-info">
                <h3>Interactive Data Dashboard</h3>
                <p>Real-time analytics visualization with filtering capabilities</p>
                <div className="showcase-tags">
                  <span className="showcase-tag">D3.js</span>
                  <span className="showcase-tag">Dashboard</span>
                </div>
              </div>
            </div>
            
            <div className="showcase-item">
              <div className="showcase-preview">
                <div className="showcase-image" style={{backgroundColor: '#8e44ad'}}></div>
                <div className="showcase-overlay">
                  <a href="#" className="btn btn-light btn-sm">View Project</a>
                </div>
              </div>
              <div className="showcase-info">
                <h3>Geographic Data Mapping</h3>
                <p>Interactive choropleth map with zoom and tooltip features</p>
                <div className="showcase-tags">
                  <span className="showcase-tag">GeoJSON</span>
                  <span className="showcase-tag">Maps</span>
                </div>
              </div>
            </div>
            
            <div className="showcase-item">
              <div className="showcase-preview">
                <div className="showcase-image" style={{backgroundColor: '#2ecc71'}}></div>
                <div className="showcase-overlay">
                  <a href="#" className="btn btn-light btn-sm">View Project</a>
                </div>
              </div>
              <div className="showcase-info">
                <h3>Network Visualization</h3>
                <p>Force-directed graph showing relationships and connections</p>
                <div className="showcase-tags">
                  <span className="showcase-tag">Network</span>
                  <span className="showcase-tag">Graph</span>
                </div>
              </div>
            </div>
          </div>
          <div className="showcase-cta">
            <a href="/explore" className="btn btn-outline-primary">Explore All Visualizations</a>
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
          <h2 className="mb-0">
            {t('explore.page.title')}
          </h2>
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
