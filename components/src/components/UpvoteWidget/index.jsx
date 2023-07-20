import { StarSVG } from '../Icons/StarSVG';
import './styles.scss';

export const UpvoteWidget = ({ upvotesCount, onClick }) => (
  <div className="vh-upvote-widget">
    <StarSVG height={22} onClick={onClick} />
    {upvotesCount}
  </div>
);
