import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UpvoteWidget } from 'components';
import { VisibilityPrivateSVG } from '../Icons/VisibilityPrivateSVG';
import { VisibilityUnlistedSVG } from '../Icons/VisibilityUnlistedSVG';
import './styles.scss';

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
}) => {
  // This SVG element is used only for its dynamic resizing behavior.
  // It's invisible, nothing is rendered into it.
  const svgRef = useRef();

  const [iframeScale, setIframeScale] = useState(1);

  const handleUpvoteClick = useCallback(() => {
    console.log('upvote clicked');
    alert('TODO handle upvoting');
  }, []);

  // Editable title functionality
  const [isEditingTitle, setIsEditingTitle] =
    useState(false);
  const [editableTitle, setEditableTitle] =
    useState(vizTitle);

  // const handleRenameIconClick = () => {
  //   setIsEditingTitle(true);
  // };

  // const handleTitleChange = (e) => {
  //   setEditableTitle(e.target.value);
  // };

  // const handleTitleSubmit = () => {
  //   setVizTitle(editableTitle);
  //   setIsEditingTitle(false);
  // };

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
      <div className="viewer-content">
        <div className="viz-frame">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${defaultVizWidth} ${vizHeight}`}
          />
          {renderVizRunner(iframeScale)}
        </div>
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
            <h4>{vizTitle}</h4>
          )}
          <div className="title-bar-right">
            {enableEditingTitle ? (
              <i
                className="bx bxs-edit utilities"
                style={{
                  color: 'rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                }}
                onClick={handleRenameIconClick}
                title="Edit viz title"
              ></i>
            ) : null}
            <UpvoteWidget
              upvotesCount={upvotesCount}
              onClick={handleUpvoteClick}
            />
            {isPrivate ? (
              <div className="visibility-label private">
                <VisibilityPrivateSVG />
                <div>PRIVATE</div>
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
            <div>{authorDisplayName}</div>
          </a>
          <div className="meta-info-right">
            <div>Last edited {updatedDateFormatted}</div>
            <div>Created on {createdDateFormatted}</div>
            {forkedFromVizHref ? (
              <>
                <div>
                  Forked from{' '}
                  <a href={forkedFromVizHref}>
                    {forkedFromVizTitle}
                  </a>
                </div>
                <a href={forksPageHref}>
                  {forksCount} fork
                  {forksCount === 1 ? '' : 's'}
                </a>
              </>
            ) : null}
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
