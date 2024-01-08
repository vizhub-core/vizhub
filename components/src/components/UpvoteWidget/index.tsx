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
    Star{upvotesCount === 1 ? '' : 's'}
  </div>
);
