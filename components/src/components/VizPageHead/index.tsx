import { useCallback } from 'react';
import { Button } from '../bootstrap';
import { ForkSVG } from '../Icons/ForkSVG';
import { ShareSVG } from '../Icons/ShareSVG';
import { ChevronSVG } from '../Icons/ChevronSVG';
import { DownloadSVG } from '../Icons/DownloadSVG';
import { SettingsSVG } from '../Icons/SettingsSVG';
import './styles.scss';
import { TrashSVG } from '../Icons/TrashSVG';

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
}) => {
  const toggleShowEditor = useCallback(
    () => setShowEditor(!showEditor),
    [showEditor],
  );

  return (
    <div className="vh-viz-page-head">
      <div className="side">
        <Button
          variant="light"
          size="sm"
          onClick={toggleShowEditor}
        >
          <ChevronSVG left={showEditor} />
          {showEditor ? 'Close' : 'Open'} Editor
        </Button>
      </div>
      <div className="side">
        <Button
          variant="light"
          size="sm"
          onClick={onExportClick}
        >
          <DownloadSVG />
          Export
        </Button>
        <Button
          variant="light"
          size="sm"
          onClick={onShareClick}
        >
          <ShareSVG />
          Share
        </Button>
        {showSettingsButton ? (
          <Button
            variant="light"
            size="sm"
            onClick={onSettingsClick}
          >
            <SettingsSVG />
            Settings
          </Button>
        ) : null}
        {showTrashButton ? (
          <Button
            variant="light"
            size="sm"
            onClick={onTrashClick}
          >
            <TrashSVG fill="#FF006B" />
            Delete
          </Button>
        ) : null}
        {showForkButton ? (
          <Button size="sm" onClick={onForkClick}>
            <ForkSVG />
            Fork
          </Button>
        ) : null}
      </div>
    </div>
  );
};
