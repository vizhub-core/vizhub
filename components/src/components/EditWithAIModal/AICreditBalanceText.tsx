import { formatCreditBalance } from 'entities/src/accessors';
import { useCallback, useMemo } from 'react';

export const AICreditBalanceText = ({
  expiringCreditBalance,
  nonExpiringCreditBalance,
  showTopUpText,
  onTopUpClick,
  showUsageText,
  onUsageClick,
  showUsage,
}: {
  expiringCreditBalance?: number;
  nonExpiringCreditBalance?: number;
  showTopUpText?: boolean;
  onTopUpClick?: () => void;
  showUsageText?: boolean;
  onUsageClick?: () => void;
  showUsage?: boolean;
}) => {
  const formattedExpiringCreditBalance = useMemo(
    () => formatCreditBalance(expiringCreditBalance || 0),
    [expiringCreditBalance],
  );

  const formattedNonExpiringCreditBalance = useMemo(
    () =>
      formatCreditBalance(nonExpiringCreditBalance || 0),
    [nonExpiringCreditBalance],
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
        Monthly Credits: {formattedExpiringCreditBalance}
      </div>
      {(nonExpiringCreditBalance || 0) > 0 && (
        <div className="text-muted form-text">
          Purchased Credits:{' '}
          {formattedNonExpiringCreditBalance}
        </div>
      )}
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
          <>
            <div
              className="text-muted text-decoration-underline"
              style={{
                cursor: 'pointer',
                fontSize: '12px',
              }}
              onClick={handleUsageClick}
            >
              {showUsage ? 'Hide Usage' : 'Usage'}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
