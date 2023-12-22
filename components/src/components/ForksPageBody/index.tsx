import { SortControl } from '../SortControl';
import { VizPreviewCollection } from '../VizPreviewCollection';
import { More } from '../More';
import './styles.scss';

export const ForksPageBody = ({
  // Viz preview list props.
  renderVizPreviews,
  hasMore,
  onMoreClick,
  isLoadingNextPage,

  // Sort control props.
  sortId,
  setSortId,
  sortOptions,

  // The title of the viz that was forked from.
  forkedFromTitle,

  // The href to the viz that was forked from.
  forkedFromHref,
}) => {
  return (
    <div className="vh-page vh-explore-page">
      <div className="px-4 py-3">
        <div className="d-flex mb-3 justify-content-between align-items-end">
          <h1 className="mb-0">
            Forks of{' '}
            <a href={forkedFromHref}>{forkedFromTitle}</a>
          </h1>
          <SortControl
            sortId={sortId}
            setSortId={setSortId}
            sortOptions={sortOptions}
          />
        </div>
        <VizPreviewCollection>
          {renderVizPreviews()}
        </VizPreviewCollection>
        <More
          onMoreClick={onMoreClick}
          isLoadingNextPage={isLoadingNextPage}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
};
