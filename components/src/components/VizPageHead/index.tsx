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
        <Button
          variant="dark"
          size="sm"
          onClick={toggleShowEditor}
        >
          {showEditor ? (
            <ArrowLeftSVG />
          ) : (
            <ArrowRightSVG />
          )}
          {showEditor ? 'Close' : 'Open'} Editor
        </Button>
      </div>
      <div className="side">
        {enableDownloadImage && (
          <Button
            as="a"
            variant="dark"
            size="sm"
            href={downloadImageHref}
            download
          >
            <ImageSVG />
            Download Image
          </Button>
        )}
        <Button
          variant="dark"
          size="sm"
          onClick={onExportClick}
        >
          <ExportSVG />
          Export Code
        </Button>
        <Button
          variant="dark"
          size="sm"
          onClick={onShareClick}
        >
          <SharedSVG />
          Share
        </Button>
        {showSettingsButton ? (
          <Button
            variant="dark"
            size="sm"
            onClick={onSettingsClick}
          >
            <GearSVG />
            Settings
          </Button>
        ) : null}
        {showTrashButton ? (
          <Button
            variant="dark"
            size="sm"
            onClick={onTrashClick}
          >
            <TrashSVG />
            Delete
          </Button>
        ) : null}
        {showForkButton ? (
          <Button
            variant="dark"
            size="sm"
            onClick={onForkClick}
          >
            <ForkSVG />
            Fork
          </Button>
        ) : null}
      </div>
    </div>
  );
};
