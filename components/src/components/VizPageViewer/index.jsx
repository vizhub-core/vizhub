import { useCallback, useRef } from 'react';
import { UpvoteWidget } from 'components';
import './styles.scss';

export const VizPageViewer = ({
  vizTitle,
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
  defaultVizHeight,
}) => {
  // This SVG elemeng is used only for its dynamic resizing behavior.
  // It's invisible, nothing is rendered into it.
  const svgRef = useRef();

  const handleUpvoteClick = useCallback(() => {
    console.log('upvote clicked');
    alert('TODO handle upvoting');
  }, []);

  return (
    <div className="vh-viz-page-viewer">
      <div className="viewer-content">
        <div className="viz-frame">
          <svg
            ref={svgRef}
            viewBox={`0 0 960 ${vizHeight || defaultVizHeight}`}
          />
          {renderVizRunner(svgRef)}
        </div>
        <div className="title-bar">
          <h4>{vizTitle}</h4>
          <UpvoteWidget
            upvotesCount={upvotesCount}
            onClick={handleUpvoteClick}
          />
        </div>

        <div className="meta-info">
          <a href={ownerUserHref} className="meta-info-left">
            <img
              src={authorAvatarURL}
              width="40"
              height="40"
              className="rounded-circle"
            ></img>
            <div>{authorDisplayName}</div>
          </a>
          <div className="meta-info-right">
            <div>Last edited {createdDateFormatted}</div>
            <div>Created on {updatedDateFormatted}</div>
            {forkedFromVizHref ? (
              <>
                <div>
                  Forked from{' '}
                  <a href={forkedFromVizHref}>{forkedFromVizTitle}</a>
                </div>
                <a href={forksPageHref}>{forksCount} forks</a>
              </>
            ) : null}
          </div>
        </div>
        <div className="vh-markdown-body">{renderMarkdownHTML()}</div>
        <div className="license">{license} Licensed</div>
      </div>
    </div>
  );
};
