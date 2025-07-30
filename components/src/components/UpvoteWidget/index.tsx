import { ThumbsUpSVG } from '../Icons/sam/ThumbsUpSVG';
import { OverlayTrigger, Tooltip } from '../bootstrap';
import './styles.scss';

export const UpvoteWidget = ({
  upvotesCount,
  isUpvoted,
  stargazersHref = '',
  onClick = null,
  notClickable = false,
  isUserAuthenticated = false,
}) => (
  <div
    className={`vh-upvote-widget${
      isUpvoted ? ' upvoted' : ''
    }`}
  >
    {notClickable ? (
      <>
        <i className="icon-button">
          <ThumbsUpSVG width={20} />
        </i>
        <div className="widget-label-container icon-button">
          <strong>{upvotesCount}</strong>
          {/* <div className="widget-label">
            Star{upvotesCount === 1 ? '' : 's'}
          </div> */}
        </div>
      </>
    ) : (
      <>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="full-screen-icon-tooltip">
              {isUserAuthenticated
                ? `${isUpvoted ? 'Remove thumbs up' : 'Thumbs up'} this viz`
                : 'Log in to like this viz'}
            </Tooltip>
          }
        >
          <i
            className="icon-button icon-button-light"
            onClick={isUserAuthenticated ? onClick : null}
            style={{
              cursor: isUserAuthenticated
                ? 'pointer'
                : 'not-allowed',
            }}
          >
            <ThumbsUpSVG />
          </i>
        </OverlayTrigger>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="full-screen-icon-tooltip">
              View who liked this
            </Tooltip>
          }
        >
          <a
            className="widget-label-container icon-button icon-button-light"
            href={stargazersHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>{upvotesCount}</strong>
            <div className="widget-label">
              Like{upvotesCount === 1 ? '' : 's'}
            </div>
          </a>
        </OverlayTrigger>
      </>
    )}
  </div>
);
