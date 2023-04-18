import PropTypes from 'prop-types';
import { Container, Image, Button } from '../bootstrap';
import { VizPreviewCollection } from '../VizPreviewCollection';
import { Header } from '../Header';
import '../index.scss';
import './profile-page.scss';

export const ProfilePageBody = ({
  renderVizPreviews,
  onMoreClick,
  userName,
  displayName,
  picture,
}) => {
  return (
    <div className="vh-page vh-profile-page">
      <Container className="mt-3 mb-3">
        <div className="d-flex mb-3">
          <Image
            className="vh-profile-page__avatar me-3"
            src={picture}
            roundedCircle
          />
          <div className="d-flex flex-column justify-content-center">
            <div className="vh-profile-page__full-name">{displayName}</div>
            <div className="vh-profile-page__user-name">{userName}</div>
          </div>
        </div>

        <VizPreviewCollection>{renderVizPreviews()}</VizPreviewCollection>
        <div className="mt-3 mb-3 d-flex justify-content-center">
          <Button onClick={onMoreClick}>More</Button>
        </div>
      </Container>
    </div>
  );
};

// Just for Storybook event listeners
ProfilePageBody.propTypes = {
  ...Header.propTypes,
  onMoreClick: PropTypes.func,
};
