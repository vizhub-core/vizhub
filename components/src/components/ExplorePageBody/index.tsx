import { SortControl } from '../SortControl';
import { VizPreviewCollection } from '../VizPreviewCollection';
import { More } from '../More';
import './styles.scss';
import { HomeStarter } from '../HomeStarter';
import { CreateNewButton } from '../CreateNewButton';

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
}) => {
  return (
    <div className="vh-page vh-explore-page">
      <div className="px-4 py-3">
        <HomeStarter />
        <div className="d-flex mb-3 justify-content-between align-items-end">
          <h2 className="mb-0">Explore VizHub</h2>
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
    </div>
  );
};
