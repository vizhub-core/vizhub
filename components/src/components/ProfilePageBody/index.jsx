import { Container, Button } from '../bootstrap';
import { VizPreviewCollection } from '../VizPreviewCollection';
import { SortControl } from '../SortControl';
import './styles.scss';

export const ProfilePageBody = ({
  renderVizPreviews,
  onMoreClick,
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
      <Container className="mt-3 mb-3">
        <div className="d-flex mb-3 justify-content-between align-items-end">
          <div className="d-flex">
            <img
              className="vh-profile-page__avatar me-3 rounded-circle"
              src={picture}
            />
            <div className="d-flex flex-column justify-content-center">
              <div className="vh-profile-page__full-name">{displayName}</div>
              <div className="vh-profile-page__user-name">{userName}</div>
            </div>
          </div>
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
