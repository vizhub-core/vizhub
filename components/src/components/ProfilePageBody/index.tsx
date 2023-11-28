import { VizPreviewCollection } from '../VizPreviewCollection';
import { SortControl } from '../SortControl';
import { More } from '../More';
import './styles.scss';

export const ProfilePageBody = ({
  // Viz preview list props.
  renderVizPreviews,
  hasMore,
  onMoreClick,
  isLoadingNextPage,

  // User info props.
  userName,
  displayName,
  picture,

  // Sort control props.
  sortId,
  setSortId,
  sortOptions,
}) => {
  return (
    <div className="vh-page vh-profile-page">
      <div className="p-4 py-3">
        <div className="d-flex mb-3 justify-content-between align-items-end">
          <div className="d-flex">
            <img
              className="vh-profile-page__avatar me-3 rounded-circle"
              src={picture}
            />
            <div className="d-flex flex-column justify-content-center">
              <div className="vh-profile-page__full-name">
                {displayName}
              </div>
              <div className="vh-profile-page__user-name">
                {userName}
              </div>
            </div>
          </div>
          {sortOptions ? (
            <SortControl
              sortId={sortId}
              setSortId={setSortId}
              sortOptions={sortOptions}
            />
          ) : null}
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
    </div>
  );
};
