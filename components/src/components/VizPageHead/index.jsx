// TODO rename all other CSS files to match this
import { Button } from '../bootstrap';
import './styles.scss';

export const VizPageHead = () => (
  <div className="vh-viz-page-head">
    <div className="side">
      <Button variant="light" size="sm">
        Open Editor
      </Button>
    </div>
    <div className="side">
      <Button variant="light" size="sm">
        Export
      </Button>
      <Button variant="light" size="sm">
        Share
      </Button>
      <Button size="sm">Fork</Button>
    </div>
  </div>
);
