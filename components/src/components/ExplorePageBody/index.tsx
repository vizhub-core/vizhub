import { SortControl } from '../SortControl';
import { VizPreviewCollection } from '../VizPreviewCollection';
import { More } from '../More';
import { Footer } from '../Footer';
import { CreateNewButton } from '../CreateNewButton';
import './styles.scss';

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
      <div className="vh-page-container">
        <div
          className="alert alert-primary d-flex align-items-center justify-content-between p-3 mb-4"
          role="alert"
        >
          {enableOfficeHoursLink && (
            <div>
              <span className="fw-bold">
                📅 Join VizHub Office Hours!
              </span>{' '}
              Get personalized help with your data
              visualization projects and connect with the
              community.
            </div>
          )}
          <div className="d-flex">
            <a
              href="https://www.youtube.com/watch?v=dRBdUyUNKUw&list=PLt6yKRJektF0Mk1Mq-bnmJuY2kVtLGovk&index=1"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary btn-sm fw-bold ms-2 me-2"
            >
              <i className="bi bi-youtube me-1"></i>
              Watch Videos
            </a>
            <a
              href="https://www.meetup.com/d3-online/events/306630048/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary btn-sm fw-bold"
            >
              Register Now
            </a>
          </div>
        </div>
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
