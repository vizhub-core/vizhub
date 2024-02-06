import { StarSVG } from '../Icons/sam/StarSVG';
import './styles.scss';

export const UpvoteWidget = ({
  upvotesCount,
  isUpvoted,
  onClick = null,
}) => (
  <div
    className={`vh-upvote-widget${
      isUpvoted ? ' upvoted' : ''
    }`}
  >
    <StarSVG onClick={onClick} />
    <strong>{upvotesCount}</strong>
    <div className="widget-label">
      Star{upvotesCount === 1 ? '' : 's'}
    </div>
  </div>
);
