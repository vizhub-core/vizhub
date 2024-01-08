import { StarSVG } from '../Icons/sam/StarSVG';
import './styles.scss';

const enableUpvoteWidget = true;

export const UpvoteWidget = ({
  upvotesCount,
  isUpvoted,
  onClick = null,
}) =>
  enableUpvoteWidget ? (
    <div
      className={`vh-upvote-widget${
        isUpvoted ? ' upvoted' : ''
      }`}
    >
      <StarSVG onClick={onClick} />
      {upvotesCount}
    </div>
  ) : null;
