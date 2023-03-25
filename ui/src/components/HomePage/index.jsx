import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { Header } from '../Header';
import { VizPreviewCollection } from '../VizPreviewCollection';
import '../index.scss';
import './home-page.scss';

export const HomePage = (props) => {
  const { renderVizPreviews, onMoreClick } = props;
  return (
    <div className="home-page">
      <Header {...props} />
      <Container className="mt-3 mb-3">
        <VizPreviewCollection>{renderVizPreviews()}</VizPreviewCollection>
        <div className="mt-3 mb-3 d-flex justify-content-center">
          <Button onClick={onMoreClick}>More</Button>
        </div>
      </Container>
    </div>
  );
};

// Just for Storybook event listeners
HomePage.propTypes = { ...Header.propTypes, onMoreClick: PropTypes.func };
