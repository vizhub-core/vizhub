import { Container, Button } from '../bootstrap';
import { VizPreviewCollection } from '../VizPreviewCollection';
import './styles.scss';

export const ExplorePageBody = ({ renderVizPreviews, onMoreClick }) => {
  return (
    <div className="vh-page vh-explore-page">
      <Container className="mt-3 mb-3">
        <div className="d-flex mb-3 callout">Explore</div>
        <VizPreviewCollection>{renderVizPreviews()}</VizPreviewCollection>
        <div className="mt-3 mb-3 d-flex justify-content-center">
          <Button onClick={onMoreClick}>More</Button>
        </div>
      </Container>
    </div>
  );
};
