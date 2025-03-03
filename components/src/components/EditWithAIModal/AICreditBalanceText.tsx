import { formatCreditBalance } from 'entities/src/accessors';
import { useCallback, useMemo } from 'react';

export const AICreditBalanceText = ({
  creditBalance,
  showTopUpText,
  onTopUpClick,
  showUsageText,
  onUsageClick,
}: {
  creditBalance?: number;
  showTopUpText?: boolean;
  onTopUpClick?: () => void;
  showUsageText?: boolean;
  onUsageClick?: () => void;
}) => {
  const formattedCreditBalance = useMemo(
    () => formatCreditBalance(creditBalance),
    [creditBalance],
  );

  const handleTopUpClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onTopUpClick?.();
    },
    [onTopUpClick],
  );

  const handleUsageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onUsageClick?.();
    },
    [onUsageClick],
  );

  return (
    <div className="d-flex flex-column">
      <div className="text-muted form-text">
        AI Credit Balance: {formattedCreditBalance}
      </div>
      <div className="d-flex">
        {showTopUpText && (
          <div
            className="text-muted text-decoration-underline me-2"
            style={{ cursor: 'pointer', fontSize: '12px' }}
            onClick={handleTopUpClick}
          >
            Top up
          </div>
        )}
        {showUsageText && (
          <div
            className="text-muted text-decoration-underline"
            style={{ cursor: 'pointer', fontSize: '12px' }}
            onClick={handleUsageClick}
          >
            {showUsageText ? 'Usage' : 'Hide Usage'}
          </div>
        )}
      </div>
    </div>
  );
};
