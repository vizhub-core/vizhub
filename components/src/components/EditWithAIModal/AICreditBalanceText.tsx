import { formatCreditBalance } from 'entities/src/accessors';
import { useMemo } from 'react';
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
      <Form.Text className="text-muted">
        AI Credit Balance: {formattedCreditBalance}
      </Form.Text>
      {showTopUpText && (
        <div>
          <small>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onTopUpClick();
              }}
              style={{ textDecoration: 'underline' }}
            >
              top up
            </a>
          </small>
        </div>
      )}
    </div>
  );
};
