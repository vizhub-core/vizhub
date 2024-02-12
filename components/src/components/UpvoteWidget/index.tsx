import { StarSVG } from '../Icons/sam/StarSVG';
import { OverlayTrigger, Tooltip } from '../bootstrap';
import './styles.scss';

export const UpvoteWidget = ({
  upvotesCount,
  isUpvoted,
  stargazersHref,
  onClick = null,
}) => (
  <div
    className={`vh-upvote-widget${
      isUpvoted ? ' upvoted' : ''
    }`}
  >
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="full-screen-icon-tooltip">
          Star this viz
        </Tooltip>
      }
    >
      <i className="icon-button icon-button-light">
        <StarSVG onClick={onClick} />
      </i>
    </OverlayTrigger>
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="full-screen-icon-tooltip">
          View Stargazers
        </Tooltip>
      }
    >
      <a
        href={stargazersHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        <strong>{upvotesCount}</strong>
        <div className="widget-label">
          Star{upvotesCount === 1 ? '' : 's'}
        </div>
      </a>
    </OverlayTrigger>
  </div>
);
