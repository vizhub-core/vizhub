import { SortControl } from '../SortControl';
import { VizPreviewCollection } from '../VizPreviewCollection';
import { More } from '../More';
import './styles.scss';

export const ExplorePageBody = ({
  // Viz preview list props.
  renderVizPreviews,
  onMoreClick,
  isLoadingNextPage,

  // Sort control props.
  sortId,
  setSortId,
  sortOptions,
}) => {
  return (
    <div className="vh-page vh-explore-page">
      <div className="px-4 py-3">
        <div className="d-flex mb-3 justify-content-between align-items-end">
          <h1 className="mb-0">Explore</h1>
          {/* Null guard while feature in development - can remove later once it's working */}
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
          onMoreClick={onMoreClick}
          isLoadingNextPage={isLoadingNextPage}
        />
      </div>
    </div>
  );
};
