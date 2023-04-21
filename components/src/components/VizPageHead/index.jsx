// TODO rename all other CSS files to match this
import { Button } from '../bootstrap';
import { ForkSVG } from '../Icons/ForkSVG';
import { ShareSVG } from '../Icons/ShareSVG';
import { ChevronSVG } from '../Icons/ChevronSVG';
import { DownloadSVG } from '../Icons/DownloadSVG';

import './styles.scss';

export const VizPageHead = () => (
  <div className="vh-viz-page-head">
    <div className="side">
      <Button variant="light" size="sm">
        <ChevronSVG left />
        Open Editor
      </Button>
    </div>
    <div className="side">
      <Button variant="light" size="sm">
        <DownloadSVG />
        Export
      </Button>
      <Button variant="light" size="sm">
        <ShareSVG />
        Share
      </Button>
      <Button size="sm">
        <ForkSVG />
        Fork
      </Button>
    </div>
  </div>
);
