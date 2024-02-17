import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UpvoteWidget } from 'components';
import { VisibilityUnlistedSVG } from '../Icons/VisibilityUnlistedSVG';
import { PrivateSVG } from '../Icons/sam/PrivateSVG';
import { ForkSVGSymbol } from '../Icons/sam/ForkSVG';

import { EditSVG } from '../Icons/EditSVG';
import { ForksWidget } from '../ForksWidget';
import { OverlayTrigger, Tooltip } from '../bootstrap';
import { FullScreenSVG } from '../Icons/sam/FullScreenSVG';
import './styles.scss';
import { StarSVGSymbol } from '../Icons/sam/StarSVG';

export const VizPageViewer = ({
  vizTitle,
  setVizTitle,
  enableEditingTitle,
  vizHeight,
  renderVizRunner,
  renderMarkdownHTML,
  authorDisplayName,
  authorAvatarURL,
  createdDateFormatted,
  updatedDateFormatted,
  forkedFromVizTitle,
  forkedFromVizHref,
  forksCount,
  forksPageHref,
  ownerUserHref,
  upvotesCount,
  license,
  defaultVizWidth,
  isPrivate,
  isUnlisted,
  isVisual,
  isUpvoted,
  handleUpvoteClick,
  fullscreenHref,
  stargazersHref,
  onForkClick,
  isUserAuthenticated,
}) => {
  // This SVG element is used only for its dynamic resizing behavior.
  // It's invisible, nothing is rendered into it.
  const svgRef = useRef();

  const [iframeScale, setIframeScale] = useState(1);

  // Editable title functionality
  const [isEditingTitle, setIsEditingTitle] =
    useState(false);
  const [editableTitle, setEditableTitle] =
    useState(vizTitle);

  const handleRenameIconClick = useCallback(() => {
    setIsEditingTitle(true);
  }, []);

  const handleTitleChange = useCallback((e) => {
    setEditableTitle(e.target.value);
  }, []);

  const handleTitleSubmit = useCallback(() => {
    setVizTitle(editableTitle);
    setIsEditingTitle(false);
  }, [editableTitle, setVizTitle]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // to prevent a newline or any default behavior
        handleTitleSubmit();
      }
    },
    [handleTitleSubmit],
  );

  useEffect(() => {
    if (!isVisual) return;
    const resizeObserver = new ResizeObserver(() => {
      if (svgRef.current) {
        const { clientWidth } = svgRef.current;
        setIframeScale(clientWidth / defaultVizWidth);
      }
    });
    resizeObserver.observe(svgRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="vh-viz-page-viewer">
      <ForkSVGSymbol />
      <StarSVGSymbol />
      <div className="viewer-content">
        {isVisual && (
          <div className="viz-frame">
            <div className="viz-frame-top">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${defaultVizWidth} ${vizHeight}`}
              />
              {renderVizRunner(iframeScale)}
            </div>
            <div className="viz-frame-bottom">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="full-screen-icon-tooltip">
                    Open in full screen
                  </Tooltip>
                }
              >
                <a
                  href={fullscreenHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="icon-button icon-button-light">
                    <FullScreenSVG />
                  </i>
                </a>
              </OverlayTrigger>
            </div>
          </div>
        )}
        <div className="title-bar">
          {isEditingTitle ? (
            <input
              value={editableTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              autoFocus
            />
          ) : (
            <div className="title-bar-left">
              <h2>{vizTitle}</h2>
              {enableEditingTitle ? (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="ai-assist-widget-tooltip">
                      Edit viz title
                    </Tooltip>
                  }
                >
                  <i onClick={handleRenameIconClick}>
                    <EditSVG />
                  </i>
                </OverlayTrigger>
              ) : null}
            </div>
          )}
          <div className="title-bar-right">
            <ForksWidget
              isUserAuthenticated={isUserAuthenticated}
              onClick={onForkClick}
              forksCount={forksCount}
              forksPageHref={forksPageHref}
            />
            <UpvoteWidget
              isUserAuthenticated={isUserAuthenticated}
              upvotesCount={upvotesCount}
              onClick={handleUpvoteClick}
              isUpvoted={isUpvoted}
              stargazersHref={stargazersHref}
            />
            {isPrivate ? (
              <div className="visibility-label private">
                PRIVATE
                <PrivateSVG />
              </div>
            ) : null}
            {isUnlisted ? (
              <div className="visibility-label unlisted">
                <VisibilityUnlistedSVG />
                <div>UNLISTED</div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="meta-info">
          <a
            href={ownerUserHref}
            className="meta-info-left"
          >
            <img
              src={authorAvatarURL}
              width="40"
              height="40"
              className="rounded-circle"
            ></img>
            <h4>{authorDisplayName}</h4>
          </a>
          <div className="meta-info-right">
            <div>Last edited {updatedDateFormatted}</div>
            <div>Created on {createdDateFormatted}</div>

            {forkedFromVizHref && (
              <div>
                Forked from{' '}
                <a href={forkedFromVizHref}>
                  {forkedFromVizTitle}
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="vh-markdown-body">
          {renderMarkdownHTML()}
        </div>
        <div className="license">{license} Licensed</div>
      </div>
    </div>
  );
};
