import { Container, Button } from '../bootstrap';
import { SortControl } from '../SortControl';
import { VizPreviewCollection } from '../VizPreviewCollection';
import './styles.scss';

export const ExplorePageBody = ({
  renderVizPreviews,
  onMoreClick,

  // Sort control props.
  sortId,
  setSortId,
  sortOptions,
}) => {
  return (
    <div className="vh-page vh-explore-page">
      <Container className="mt-3 mb-3">
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
        <VizPreviewCollection>{renderVizPreviews()}</VizPreviewCollection>
        <div className="mt-3 mb-3 d-flex justify-content-center">
          <Button onClick={onMoreClick}>More</Button>
        </div>
      </Container>
    </div>
  );
};
