import { StarSVG } from '../Icons/StarSVG';
import './styles.css';

export const UpvoteWidget = ({ upvotesCount }) => (
  <div className="vh-upvote-widget">
    <StarSVG height={20} />
    {upvotesCount}
  </div>
);
