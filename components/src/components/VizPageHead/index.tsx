import { GearSVG, TrashSVG } from 'vzcode';
import { useCallback } from 'react';
import { Button } from '../bootstrap';
import { ForkSVG } from '../Icons/sam/ForkSVG';
import { SharedSVG } from '../Icons/sam/SharedSVG';
import { ImageSVG } from '../Icons/ImageSVG';
import { ExportSVG } from '../Icons/sam/ExportSVG';
import { ArrowLeftSVG } from '../Icons/sam/ArrowLeftSVG';
import { ArrowRightSVG } from '../Icons/sam/ArrowRightSVG';
import './styles.scss';

const enableDownloadImage = true;

export const VizPageHead = ({
  showEditor,
  setShowEditor,
  onExportClick,
  onShareClick,
  onForkClick,
  showForkButton,
  showTrashButton,
  showSettingsButton,
  onSettingsClick,
  onTrashClick,
  downloadImageHref,
}) => {
  const toggleShowEditor = useCallback(
    () => setShowEditor(!showEditor),
    [showEditor],
  );

  return (
    <div className="vh-viz-page-head">
      <div className="side">
        <Button variant="dark" onClick={toggleShowEditor}>
          {showEditor ? (
            <ArrowLeftSVG />
          ) : (
            <ArrowRightSVG />
          )}
          <div className="btn-text">
            {showEditor ? 'Close' : 'Open'} Editor
          </div>
        </Button>
      </div>
      <div className="side">
        {enableDownloadImage && (
          <Button
            as="a"
            variant="dark"
            href={downloadImageHref}
            download
          >
            <ImageSVG />
            <div className="btn-text">Download Image</div>
          </Button>
        )}
        <Button variant="dark" onClick={onExportClick}>
          <ExportSVG />
          <div className="btn-text">Export Code</div>
        </Button>
        <Button variant="dark" onClick={onShareClick}>
          <SharedSVG />
          <div className="btn-text">Share</div>
        </Button>
        {showSettingsButton ? (
          <Button variant="dark" onClick={onSettingsClick}>
            <GearSVG />
            <div className="btn-text">Settings</div>
          </Button>
        ) : null}
        {showTrashButton ? (
          <Button variant="dark" onClick={onTrashClick}>
            <TrashSVG />
            <div className="btn-text">Delete</div>
          </Button>
        ) : null}
        {showForkButton ? (
          <Button variant="dark" onClick={onForkClick}>
            <ForkSVG />
            <div className="btn-text">Fork</div>
          </Button>
        ) : null}
      </div>
    </div>
  );
};
