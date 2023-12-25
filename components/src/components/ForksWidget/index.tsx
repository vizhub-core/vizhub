import { useMemo } from 'react';
import { ForkSVG } from '../Icons/sam/ForkSVG';
import { commaFormat } from '../commaFormat';
import './styles.scss';

const enableForksWidget = true;

export const ForksWidget = ({
  forksCount,
  onClick = null,
}) => {
  const forksCountFormatted = useMemo(
    () => commaFormat(forksCount),
    [forksCount],
  );

  return enableForksWidget ? (
    <div className="vh-forks-widget">
      <ForkSVG onClick={onClick} />
      {forksCountFormatted}
    </div>
  ) : null;
};
