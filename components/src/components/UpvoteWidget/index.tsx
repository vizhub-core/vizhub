// TODO upgrade this to new icon sam/StarSVG
import { StarSVG } from '../Icons/StarSVG';
import './styles.scss';

// TODO bring this back after upvotes are migrated and working again.
const enableUpvoteWidget = false;

export const UpvoteWidget = ({
  upvotesCount,
  onClick = null,
}) =>
  enableUpvoteWidget ? (
    <div className="vh-upvote-widget">
      <StarSVG
        height={22}
        onClick={onClick}
        fill="#3866E9"
      />
      {upvotesCount}
    </div>
  ) : null;
