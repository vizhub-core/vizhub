import { ForkSVG } from '../Icons/sam/ForkSVG';
import './styles.scss';

// TODO bring this back after upvotes are migrated and working again.
const enableForksWidget = true;

export const ForksWidget = ({
  forksCount,
  onClick = null,
}) =>
  enableForksWidget ? (
    <div className="vh-forks-widget">
      <ForkSVG onClick={onClick} />
      {forksCount}
    </div>
  ) : null;
