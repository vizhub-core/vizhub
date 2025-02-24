import { formatCreditBalance } from 'entities/src/accessors';
import { useCallback, useMemo } from 'react';
import { Form } from '../bootstrap';

export const AICreditBalanceText = ({
  creditBalance,
  showTopUpText,
  onTopUpClick,
}: {
  creditBalance?: number;
  showTopUpText: boolean;
  onTopUpClick: () => void;
}) => {
  const formattedCreditBalance = useMemo(
    () => formatCreditBalance(creditBalance),
    [creditBalance],
  );

  return (
    <div>
      <Form.Text className="text-muted mb3">
        AI Credit Balance: {formattedCreditBalance}
      </Form.Text>
      {showTopUpText && (
        <div>
          <small>
            <a
              href="#"
              onClick={useCallback(
                (e) => {
                  e.preventDefault();
                  onTopUpClick();
                },
                [onTopUpClick],
              )}
              style={{
                textDecoration: 'underline',
                color: '#6c757d',
                fontSize: '0.75em',
              }}
            >
              top up
            </a>
          </small>
        </div>
      )}
    </div>
  );
};
