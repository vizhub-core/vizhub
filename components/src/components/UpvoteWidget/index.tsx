import { StarSVG } from '../Icons/sam/StarSVG';
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
    <StarSVG onClick={onClick} />
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
  </div>
);
