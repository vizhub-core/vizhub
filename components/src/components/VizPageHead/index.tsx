import { GearSVG, TrashSVG } from 'vzcode';
import { useCallback } from 'react';
import { Button } from '../bootstrap';
import { ForkSVG } from '../Icons/sam/ForkSVG';
import { SharedSVG } from '../Icons/sam/SharedSVG';
import { ImageSVG } from '../Icons/ImageSVG';
import { ExportSVG } from '../Icons/sam/ExportSVG';
import { ArrowLeftSVG } from '../Icons/sam/ArrowLeftSVG';
import { ArrowRightSVG } from '../Icons/sam/ArrowRightSVG';
import { ServerSVG } from '../Icons/sam/ServerSVG';
import { RectangleStackSVG } from '../Icons/sam/RectangleStackSVG';
import './styles.scss';

const enableRevisionHistory = true;
const enableDownloadImage = true;
const enableAPIButton = false;

export const VizPageHead = ({
  showEditor,
  setShowEditor,
  exportHref,
  onShareClick,
  onForkClick,
  showForkButton,
  showTrashButton,
  showSettingsButton,
  showExportButton,
  showShareButton,
  showImageButton,
  onSettingsClick,
  onTrashClick,
  downloadImageHref,
  toggleShowRevisionHistory,
  userCanExport,
  toggleExportCodeUpgradeNudgeModal,
}) => {
  const toggleShowEditor = useCallback(
    () => setShowEditor(!showEditor),
    [showEditor, setShowEditor],
  );

  // const handleExportImageClick = useCallback(
  //   (
  //     event: React.MouseEvent<
  //       HTMLAnchorElement,
  //       MouseEvent
  //     >,
  //   ) => {
  //     if (!userCanExport) {
  //       event.preventDefault();
  //       alert(
  //         'This feature is available for pro users only.',
  //       );
  //     }
  //   },
  //   [userCanExport],
  // );

  const handleExportCodeClick = useCallback(
    (
      event: React.MouseEvent<
        HTMLButtonElement,
        MouseEvent
      >,
    ) => {
      if (!userCanExport) {
        event.preventDefault();
        toggleExportCodeUpgradeNudgeModal();
      }
    },
    [userCanExport, toggleExportCodeUpgradeNudgeModal],
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
        {enableRevisionHistory && (
          <Button
            variant="dark"
            onClick={toggleShowRevisionHistory}
          >
            <RectangleStackSVG />
            <div className="btn-text">
              Revision History (beta)
            </div>
          </Button>
        )}
        {enableDownloadImage && showImageButton && (
          <Button
            as="a"
            variant="dark"
            href={downloadImageHref}
            download
          >
            <ImageSVG />
            <div className="btn-text">Export Image</div>
          </Button>
        )}
        {showExportButton && (
          <Button
            variant="dark"
            as="a"
            href={userCanExport ? exportHref : '#'}
            onClick={handleExportCodeClick}
          >
            <ExportSVG />
            <div className="btn-text">Export Code</div>
          </Button>
        )}
        {enableAPIButton && (
          <Button
            as="a"
            variant="dark"
            href="https://vizhub.com/forum/t/api-access-for-vizzes/971"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ServerSVG />
            <div className="btn-text">API</div>
          </Button>
        )}

        {showShareButton && (
          <Button variant="dark" onClick={onShareClick}>
            <SharedSVG />
            <div className="btn-text">Share</div>
          </Button>
        )}
        {showSettingsButton && (
          <Button variant="dark" onClick={onSettingsClick}>
            <GearSVG />
            <div className="btn-text">Settings</div>
          </Button>
        )}
        {showTrashButton && (
          <Button variant="dark" onClick={onTrashClick}>
            <TrashSVG />
            <div className="btn-text">Delete</div>
          </Button>
        )}
        {showForkButton && (
          <Button variant="dark" onClick={onForkClick}>
            <ForkSVG />
            <div className="btn-text">Fork</div>
          </Button>
        )}
      </div>
    </div>
  );
};
