import { formatCreditBalance } from 'entities/src/accessors';
import { useCallback, useMemo } from 'react';

export const AICreditBalanceText = ({
  creditBalance,
  showTopUpText,
  onTopUpClick,
}: {
  creditBalance?: number;
  showTopUpText?: boolean;
  onTopUpClick?: () => void;
}) => {
  const formattedCreditBalance = useMemo(
    () => formatCreditBalance(creditBalance),
    [creditBalance],
  );

  const handleTopUpClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onTopUpClick();
    },
    [onTopUpClick],
  );

  return (
    <div className="d-flex flex-column">
      <div className="text-muted form-text">
        AI Credit Balance: {formattedCreditBalance}
      </div>
      {showTopUpText && (
        <div
          className="text-muted"
          onClick={handleTopUpClick}
        >
          top up
        </div>
      )}
    </div>
  );
};
